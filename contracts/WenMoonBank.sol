//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


contract WenMoonBank {
  struct UserAccount {
    bool isNotFirstDeposit;
    uint256 balance;
  }

  // mapping: ERC20 token address => account address => UserAccount
  mapping(address => mapping (address => UserAccount)) userAccounts;

  //
  // TODO: implement deposit function
  //
  function deposit(address erc20TokenAddress, uint256 amount) external {
    //
    // can add extra deposit logic here, eg: add bonus multiplier to deposit
    //
    uint256 bonusPercentage = 5;

    //
    // Calculate deposit bonus
    //
    // Notes
    //
    //   * avoid doing fractional math in Solidity
    //   * we have 18 decimals of precision, so we have a lot of room to work with
    //   * mulitply then divide!
    //       * mulitply bonus percent first, then divide by 100 (10 ** 2) to convert the
    //         value into a percentage
    //       * be careful multiplcation doesn't overflow (eg: number doesn't exceed 10 ** 36)
    //   
    uint256 bonus = (amount *  bonusPercentage) / 10**2;

    IERC20(erc20TokenAddress).transferFrom(msg.sender, address(this), amount);

    userAccounts[erc20TokenAddress][msg.sender].balance += amount;

    if (! userAccounts[erc20TokenAddress][msg.sender].isNotFirstDeposit) {
      IERC20(erc20TokenAddress).transfer(msg.sender, bonus);
    }

    userAccounts[erc20TokenAddress][msg.sender].isNotFirstDeposit = true;
  }

  //
  // TODO: implement withdraw function
  //
  function withdraw(address erc20TokenAddress, uint256 amount) external {
    require(userAccounts[erc20TokenAddress][msg.sender].balance >= amount);

    //
    // can add extra withdraw logic here, eg: calculate interest
    //

    userAccounts[erc20TokenAddress][msg.sender].balance -= amount;

    IERC20(erc20TokenAddress).transfer(msg.sender, amount);
  }
}
