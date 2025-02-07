const hre = require("hardhat");

async function main() {
  // Get signers (list of accounts)
  const [deployer, server1, server2, server3] = await hre.ethers.getSigners();

  // List of server wallet addresses
  const allowedServers = [server1.address, server2.address, server3.address];

  console.log("Deploying FarmingFactory with allowed servers:", allowedServers);

  // Deploy FarmingFactory with allowed server wallets
  const FarmingFactory = await hre.ethers.getContractFactory("FarmingFactory");
  const farmingFactory = await FarmingFactory.deploy(allowedServers);

  await farmingFactory.waitForDeployment();

  console.log("FarmingFactory deployed at:", farmingFactory.target);
}

// Execute deployment script
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
