require('dotenv').config({ path: '../.env' })
const TokenSale = artifacts.require('MyTokenSale')
const Token = artifacts.require('Mevony')
const KycContract = artifacts.require('KycContract')
const chai = require('./setupchai.js')
const BN = web3.utils.BN

const expect = chai.expect

contract('TokenSale Test', async (accounts) => {
  const [initialHolder, recipient, anotherAccount] = accounts
  it('should not have any tokens in deployer account', async () => {
    let instance = await Token.deployed()
    return expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(new BN(0))
  })

  it('all tokens should be in the tokensale smart contract by default', async () => {
    let instance = await Token.deployed()
    let balanceOfTokenSaleSmartContract = await instance.balanceOf(
      TokenSale.address
    )
    let totalSupply = await instance.totalSupply()
    return expect(balanceOfTokenSaleSmartContract).to.be.a.bignumber.equal(
      totalSupply
    )
  })
  it('should be possible to buy tokens', async () => {
    let tokenInstance = await Token.deployed()
    let tokenSaleInstance = await TokenSale.deployed()
    let KycInstance = await KycContract.deployed()

    let balanceBefore = await tokenInstance.balanceOf(initialHolder)
    await KycInstance.setKycCompleted(initialHolder, { from: initialHolder })
    expect(
      tokenSaleInstance.sendTransaction({
        from: initialHolder,
        value: web3.utils.toWei('1', 'wei'),
      })
    ).to.be.fulfilled
    balanceBefore = balanceBefore.add(new BN(1))
    return expect(
      tokenInstance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(balanceBefore)
  })
})
