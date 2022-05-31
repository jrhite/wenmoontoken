//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


//
// TODO create WenMoonToken ERC-20 token inheriting from ERC-20 base contract
//
contract WenMoonToken is ERC20 {
  
  //
  // TODO implement token constructor
  //
  constructor(uint256 initialSupply) ERC20("WenMoonToken", "WMT") {
    _mint(msg.sender, initialSupply);
  }
}