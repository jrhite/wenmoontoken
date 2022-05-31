const { expect } = require("chai");
const { ethers } = require("hardhat");

const utils = ethers.utils;

describe("WenMoonBank", function () {
  let deployer, user;

  let wenMoonBank;
  let wenMoonToken;

  ///////////////////////////////////////
  //
  // 1. Get some deployer and user signer from Hardhat to test with
  //
  // 2. Deploy WenMoonBank contract using deployer Hardhat account
  //
  // 3. Deploy WenMoonToken ERC-20 token using deployer Hardhat account
  //    (this gives the deployer the total initial supply of WenMoonToken)
  //
  // 4. Fund user account and bank contract with WenMoonToken
  //
  ///////////////////////////////////////
  before(async function () {
    // get some signers for testing
    [deployer, user] = await ethers.getSigners();

    // deploy WenMoonBank contract
    const WenMoonBank = await hre.ethers.getContractFactory('WenMoonBank');
    wenMoonBank = await WenMoonBank.deploy();

    await wenMoonBank.deployed();

    // deploy WenMoonToken ERC-20 token with an initial supply of 1 billion tokens
    const WenMoonToken = await hre.ethers.getContractFactory('WenMoonToken');
    wenMoonToken = await WenMoonToken.deploy(utils.parseUnits('1000000000', 18));

    await wenMoonToken.deployed();

    console.log('WenMoonBank deployed to:', wenMoonBank.address);
    console.log('WenMoonToken deployed to:', wenMoonToken.address);

    const deployerInitalTokenBalance = await wenMoonToken.balanceOf(deployer.address);

    console.log(`deployer ${deployer.address} initial WMT balance = ${utils.formatUnits(
        deployerInitalTokenBalance,
        18
      )}`
    );

    ///////////////////////////////////////
    //
    // fund user account
    //
    // (the WenMoonToken is being transfered from the deployer account to the user)
    //
    ///////////////////////////////////////
    let transferTxn = await wenMoonToken.transfer(user.address,utils.parseUnits('100', 18));

    // wait for transfer txn to be mined
    await transferTxn.wait();

    const userTokenBalance = await wenMoonToken.balanceOf(user.address);

    console.log(
      `user ${user.address} WMT balance = ${utils.formatUnits(userTokenBalance, 18)}`
    );

    // fund the WenMoonBank contract itself with WenMoonTokens
    transferTxn = await wenMoonToken.transfer(wenMoonBank.address, utils.parseUnits('1000000', 18));

    // wait for transfer txn to be mined
    await transferTxn.wait();

    const bankTokenBalance = await wenMoonToken.balanceOf(wenMoonBank.address);

    console.log(
      `WenMoonBank's WMT balance = ${utils.formatUnits(bankTokenBalance, 18)}`
    );

    const deployerFinalTokenBalance = await wenMoonToken.balanceOf(deployer.address);

    console.log(
      `deployer's final WMT balance = ${utils.formatUnits(deployerFinalTokenBalance, 18)}`
    );
  });

  describe('approve() / allowance() checks', function () {
    it('WenMoonBank is not approved to spend WenMoonTokens on a user\'s behalf', async function () {
      const allowance = utils.formatUnits(
        await wenMoonToken.allowance(user.address, wenMoonBank.address), 18);

      console.log(
        `Address ${wenMoonBank.address} can spend ${allowance} WMT tokens on behalf of user ${user.address}`
      );
    });

    it('After calling approve() WenMoonBank is approved to spend WenMoonTokens on a user\'s behalf',
      async function () {
        const approvalAmount = utils.parseUnits('50', 18);

        const approveTxn = await wenMoonToken.connect(user).approve(wenMoonBank.address, approvalAmount);

        // wait for approve txn to be mined
        await approveTxn.wait();

        const allowance = utils.formatUnits(
          await wenMoonToken.allowance(user.address, wenMoonBank.address), 18);

        console.log(
          `Address ${wenMoonBank.address} can spend ${allowance} WMT tokens on behalf of user ${user.address}`
        );
      }
    );
  });

  describe('deposit()', function () {
    it('transfers WMT from user account to bank contract account', async function () {
      const depositAmount = utils.parseUnits('50', 18);

      const wenMoonTokenUserSigner = await wenMoonToken.connect(user);

      const approveTxn = await wenMoonTokenUserSigner.approve(wenMoonBank.address, depositAmount);

      // wait for approve txn to be mined
      await approveTxn.wait();

      const wenMoonBankUserSigner = await wenMoonBank.connect(user);

      const depositTxn = await wenMoonBankUserSigner.deposit(wenMoonToken.address, depositAmount);

      // wait for deposit txn to be mined
      await depositTxn.wait();

      const userBalance = await wenMoonToken.balanceOf(user.address);
      console.log(`user ${user.address} WMT balance = ${utils.formatUnits(userBalance, 18)}`);

      const bankBalance = await wenMoonToken.balanceOf(wenMoonBank.address);
      console.log(`bank WMT balance = ${utils.formatUnits(bankBalance, 18)}`);
    });
  });

  describe('withdraw()', function () {
    it('transfers WMT from bank contract account to user account', async function () {
      const withdrawAmount = utils.parseUnits('50', 18);

      const wenMoonBankUserSigner = await wenMoonBank.connect(user);

      const withdrawTxn = await wenMoonBankUserSigner.withdraw(
        wenMoonToken.address,
        withdrawAmount
      );

      // wait for deposit txn to be mined
      await withdrawTxn.wait();

      const userBalance = await wenMoonToken.balanceOf(user.address);
      console.log(
        `user ${user.address} WMT balance = ${utils.formatUnits(userBalance, 18)}`
      );

      const bankBalance = await wenMoonToken.balanceOf(wenMoonBank.address);
      console.log(`bank WMT balance = ${utils.formatUnits(bankBalance, 18)}`);      
    });
  });
});
