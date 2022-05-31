//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

// TODO npm install OpenZeppelin ERC-20 contracts and import IERC20


contract WenMoonBank {
  // mapping: ERC20 token address => account address => uint256
  mapping(address => mapping (address => uint256)) balances;

  //
  // TODO: implement deposit function
  //
  function deposit(address erc20TokenAddress, uint256 amount) external {
    //
    // can add extra deposit logic here, eg: add bonus multiplier to deposit
    //

    //
    // add core deposit logic here
    //
  }

  //
  // TODO: implement withdraw function
  //
  function withdraw(address erc20TokenAddress, uint256 amount) external {
    require(balances[erc20TokenAddress][msg.sender] >= amount);

    //
    // can add extra withdraw logic here, eg: calculate interest
    //

    //
    // add core withdraw logic here
    //
  }
}
