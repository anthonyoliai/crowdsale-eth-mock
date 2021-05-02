require('dotenv').config({ path: '../.env' })
const Token = artifacts.require('Mevony')

const chai = require('./setupchai.js')
const BN = web3.utils.BN
const expect = chai.expect

contract('Token Test', async (accounts) => {
  const [initialHolder, recipient, anotherAccount] = accounts

  beforeEach(async () => {
    this.myToken = await Token.new(process.env.INITIAL_TOKENS)
  })

  it('All tokens should be in my account', async () => {
    let instance = this.myToken
    let totalSupply = await instance.totalSupply()
    //old style:
    //let balance = await instance.balanceOf.call(initialHolder);
    //assert.equal(balance.valueOf(), 0, "Account 1 has a balance");
    //condensed, easier readable style:
    return expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply)
  })
  it('is possible to send tokens between accounts', async () => {
    const sendTokens = 1
    let instance = this.myToken
    let totalSupply = await instance.totalSupply()
    expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply)
    expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled
    expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)))
    return expect(
      instance.balanceOf(recipient)
    ).to.eventually.be.a.bignumber.equal(new BN(sendTokens))
  })
  it('is not possible to send more tokens than available in total', async () => {
    let instance = this.myToken
    let balanceOfDeployer = await instance.balanceOf(initialHolder)
    expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to
      .eventually.be.rejected
    return expect(
      instance.balanceOf(initialHolder)
    ).to.eventually.be.a.bignumber.equal(balanceOfDeployer)
  })
})
