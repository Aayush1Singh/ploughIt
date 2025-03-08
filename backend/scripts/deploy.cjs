const hre = require("hardhat");
async function main() {
  // Get signers (list of accounts)
  const [server1] = await hre.ethers.getSigners();
  // console.log("hello", await hre.ethers.getSigners());
  // List of server wallet addresses
  const allowedServers = [server1.address];

  console.log("Deploying FarmingFactory with allowed servers:", allowedServers);
  const FarmingContract = await ethers.getContractFactory("FarmingContract");
  const farmingContract = await FarmingContract.deploy();
  const FarmingContractT2 = await ethers.getContractFactory(
    "FarmingContractT2"
  );
  const farmingContractT2 = await FarmingContractT2.deploy();
  console.log(farmingContract.target);
  console.log(farmingContractT2.target);
  // Deploy FarmingFactory with allowed server wallets
  const FarmingFactory = await hre.ethers.getContractFactory("FarmingFactory");
  const farmingFactory = await FarmingFactory.deploy(
    allowedServers,
    farmingContract.target,
    farmingContractT2.target
  );

  await farmingFactory.waitForDeployment();

  console.log("FarmingFactory deployed at:", farmingFactory.target);
}

// Execute deployment script
main().catch((error) => {
  console.error(error);
  process.exit(1);
});

/*
Deploying FarmingFactory with allowed servers: [ '0xa0976a34f8cc39BCD669C12229aB3328b8101127' ]
0xE6ce1A9060018f1407F8E17E67772cfE3CBADc50
0xA97D6F03f7e0ca20e49Db2E3B2496786B06b104F
FarmingFactory deployed at: 0x7c8eF95A8bB23a463F84F986C490911D5d936b29
 */

/*
npx hardhat verify --network sepolia 0xE6ce1A9060018f1407F8E17E67772cfE3CBADc50   
[INFO] Sourcify Verification Skipped: Sourcify verification is currently disabled. To enable it, add the following entry to your Hardhat configuration:

sourcify: {
  enabled: true
}

Or set 'enabled' to false to hide this message.

For more information, visit https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#verifying-on-sourcify
Successfully submitted source code for contract
contracts/Farming.sol:FarmingContract at 0xE6ce1A9060018f1407F8E17E67772cfE3CBADc50
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FarmingContract on the block explorer.
https://sepolia.etherscan.io/address/0xE6ce1A9060018f1407F8E17E67772cfE3CBADc50#code

*/


/*

npx hardhat verify --network sepolia 0xA97D6F03f7e0ca20e49Db2E3B2496786B06b104F
[INFO] Sourcify Verification Skipped: Sourcify verification is currently disabled. To enable it, add the following entry to your Hardhat configuration:

sourcify: {
  enabled: true
}

Or set 'enabled' to false to hide this message.

For more information, visit https://hardhat.org/hardhat-runner/plugins/nomicfoundation-hardhat-verify#verifying-on-sourcify
Successfully submitted source code for contract
contracts/FarmingT2.sol:FarmingContractT2 at 0xA97D6F03f7e0ca20e49Db2E3B2496786B06b104F
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FarmingContractT2 on the block explorer.
https://sepolia.etherscan.io/address/0xA97D6F03f7e0ca20e49Db2E3B2496786B06b104F#code
*/


/*
Successfully submitted source code for contract
contracts/FarmingContract.sol:FarmingFactory at 0x7c8eF95A8bB23a463F84F986C490911D5d936b29
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FarmingFactory on the block explorer.
https://sepolia.etherscan.io/address/0x7c8eF95A8bB23a463F84F986C490911D5d936b29#code

*/