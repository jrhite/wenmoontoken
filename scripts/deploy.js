const { ethers } = require('hardhat');

const utils = ethers.utils;

async function main() {
  // deploy WenMoonBank contract
  const WenMoonBank = await ethers.getContractFactory('WenMoonBank');
  wenMoonBank = await WenMoonBank.deploy();

  await wenMoonBank.deployed();

  // deploy WenMoonToken ERC-20 token with an initial supply of 1 billion tokens
  const WenMoonToken = await ethers.getContractFactory('WenMoonToken');
  wenMoonToken = await WenMoonToken.deploy(utils.parseUnits('1000000000', 18));

  await wenMoonToken.deployed();

  console.log('WenMoonBank deployed to:', wenMoonBank.address);
  console.log('WenMoonToken deployed to:', wenMoonToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
