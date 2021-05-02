var Mevony = artifacts.require('./Mevony.sol')
var MyTokenSale = artifacts.require('./MyTokenSale.sol')
var MyKycContract = artifacts.require('./KycContract.sol')
require('dotenv').config({ path: '../.env' })

module.exports = async function (deployer) {
  let address = await web3.eth.getAccounts()
  await deployer.deploy(Mevony, process.env.INITIAL_TOKENS)
  await deployer.deploy(MyKycContract)
  await deployer.deploy(
    MyTokenSale,
    1,
    address[0],
    Mevony.address,
    MyKycContract.address
  )
  let instance = await Mevony.deployed()
  await instance.transfer(MyTokenSale.address, process.env.INITIAL_TOKENS)
}
