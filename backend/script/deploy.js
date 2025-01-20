async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const FarmingContract = await ethers.getContractFactory("FarmingContract");
  const farmingContract = await FarmingContract.deploy(
    "0xFarmerAddressHere", // Farmer's address
    ethers.utils.parseEther("1"), // Price in ether
    "Wheat", // Crop type
    Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days from now
  );

  console.log("FarmingContract deployed to:", farmingContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
