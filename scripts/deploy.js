const { ethers } = require("hardhat");

async function main() {
  [signer1, signer2] = await ethers.getSigners();

  // deploy contracts
  const Bank = await ethers.getContractFactory("Bank", signer1);
  const bankContract = await Bank.deploy();

  const Matic = await ethers.getContractFactory("Matic", signer2);
  const matic = await Matic.deploy();

  const Shib = await ethers.getContractFactory("Shib", signer2);
  const shib = await Shib.deploy();

  const Usdt = await ethers.getContractFactory("Usdt", signer2);
  const usdt = await Usdt.deploy();

  // white list tokens
  // allows users of dapp to deposite and withdraw tokens
  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String('Matic'),
    matic.address
  );

  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String('Shib'),
    shib.address
  );

  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String('Usdt'),
    usdt.address
  );

  await bankContract.whitelistToken(
    ethers.utils.formatBytes32String('Eth'),
    '0xb6C48f46663100ABd5dcEdfbc589a8399076aF7B'
  );

  console.log("Bank deployed to:", bankContract.address, "by", signer1.address);
  console.log("Matic deployed to:", matic.address, "by", signer2.address);
  console.log("Shib deployed to:", shib.address, "by", signer2.address);
  console.log("Usdt deployed to:", usdt.address, "by", signer2.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });