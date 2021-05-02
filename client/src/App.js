import React, { Component, useState } from 'react'
import Mevony from './contracts/Mevony.json'
import myTokenSale from './contracts/MyTokenSale.json'
import KycContract from './contracts/KycContract.json'

import getWeb3 from './getWeb3'

import './App.css'

class App extends Component {
  state = {
    loaded: false,
    kycAddress: '0x123...',
    tokenSaleAddress: null,
    userTokens: 0,
    amount: 0,
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      this.web3 = await getWeb3()

      // Use web3 to get the user's accounts.
      this.accounts = await this.web3.eth.getAccounts()

      // Get the contract instance.
      this.networkId = await this.web3.eth.net.getId()
      this.tokenInstance = new this.web3.eth.Contract(
        Mevony.abi,
        Mevony.networks[this.networkId] &&
          Mevony.networks[this.networkId].address
      )

      this.tokenSaleInstance = new this.web3.eth.Contract(
        myTokenSale.abi,
        myTokenSale.networks[this.networkId] &&
          myTokenSale.networks[this.networkId].address
      )

      this.kycInstance = new this.web3.eth.Contract(
        KycContract.abi,
        KycContract.networks[this.networkId] &&
          KycContract.networks[this.networkId].address
      )

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.listenToTokenTransfer()
      this.setState(
        {
          loaded: true,
          tokenSaleAddress: myTokenSale.networks[this.networkId].address,
        },
        this.updateUserTokens
      )
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      )
      console.error(error)
    }
  }
  updateUserTokens = async () => {
    let userTokens = await this.tokenInstance.methods
      .balanceOf(this.accounts[0])
      .call()
    this.setState({ userTokens: userTokens })
  }

  listenToTokenTransfer = () => {
    this.tokenInstance.events
      .Transfer({ to: this.accounts[0] })
      .on('data', this.updateUserTokens)
  }

  handleBuyTokens = async () => {
    await this.tokenSaleInstance.methods
      .buyTokens(this.accounts[0])
      .send({ from: this.accounts[0], value: this.state.amount })
  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    this.setState({
      [name]: value,
    })
  }

  handleKycWhiteListing = async () => {
    await this.kycInstance.methods
      .setKycCompleted(this.state.kycAddress)
      .send({ from: this.accounts[0] })
    alert('Kyc for' + this.state.kycAddress + ' is completed')
  }
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>
    }
    return (
      <div className='app-container'>
        <div className=''>
          <h1>Cupcake.finance (CPC) token crowdsale.</h1>
          <p>Get your tokens today!</p>
          <h2>Kyc Whitelisting</h2>
          Address to allow:{' '}
          <input
            type='text'
            name='kycAddress'
            value={this.state.kycAddress}
            onChange={this.handleInputChange}
            className='input-left'
          />
          <button className='wl-btn' onClick={this.handleKycWhiteListing}>
            Add to Whitelist
          </button>
          <h2>Buy CPC</h2>
          <p>
            If you want to buy CPC, send Wei to this address:{' '}
            {this.state.tokenSaleAddress}
          </p>
          <h1>You currently have: {this.state.userTokens} CPC</h1>
          <input
            type='text'
            name='amount'
            value={this.state.amount}
            onChange={this.handleInputChange}
          />
          <button onClick={this.handleBuyTokens}>Buy more tokens</button>
        </div>

        <img src='/cc.png' alt='' />
      </div>
    )
  }
}

export default App
