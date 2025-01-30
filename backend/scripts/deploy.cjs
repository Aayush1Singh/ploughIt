// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// async function main() {
//   // const [deployer] = await ethers.getSigners();
//   // console.log("Deploying contracts with the account:", deployer.address);
//   const Farming = await ethers.getContractFactory("FarmingContract");
//   const register = await Farming.deploy();
//   await register.waitForDeployment(); // Required in ethers v6

//   const maker = async function deployContract(
//     demandID,
//     contractorID,
//     farmerID,
//     crop,
//     variation,
//     quantity,
//     price,
//     duration
//   ) {
//     await register.makeContract(1, 1, 1, "Wheat", "Organic", 100, 10, 30);
//   };

//   module.exports = { register };
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });
// const { ethers } = require("hardhat");

// // Deploy Farming contract
// let register;

// async function deployContract() {
//   const Farming = await ethers.getContractFactory("FarmingContract");
//   register = await Farming.deploy();
//   await register.waitForDeployment();
//   console.log(register.target); // Required in ethers v6
//   console.log("Contract deployed!");
// }

// // Define the maker function
// const maker = async function deployContract(
//   demandID,
//   contractorID,
//   farmerID,
//   crop,
//   variation,
//   quantity,
//   price,
//   duration
// ) {
//   if (!register) {
//     throw new Error("Contract is not deployed yet. Call deployContract first.");
//   }
//   await register.makeContract(
//     demandID,
//     contractorID,
//     farmerID,
//     crop,
//     variation,
//     quantity,
//     price,
//     duration
//   );
// };
// const getContract = async function (_demandID) {
//   return await register.getContractDetails(_demandID);
// };
// // Export the deployContract and maker functions
// module.exports = { deployContract, maker, getContract };

const fs = require("fs");
const { ethers } = require("hardhat");
const path = require("path");

// File to store the deployed contract address
const CONTRACT_ADDRESS_FILE = path.resolve(__dirname, "contract-address.json");

async function main() {
  let register;

  // Check if contract address exists
  if (fs.existsSync(CONTRACT_ADDRESS_FILE)) {
    const address = JSON.parse(
      fs.readFileSync(CONTRACT_ADDRESS_FILE, "utf-8")
    ).address;
    console.log("Using existing contract at address:", address);

    // Reuse the existing deployed contract
    const Farming = await ethers.getContractFactory("FarmingContract");
    register = Farming.attach(address);
  } else {
    console.log("Deploying a new contract...");
    const Farming = await ethers.getContractFactory("FarmingContract");
    register = await Farming.deploy();
    await register.waitForDeployment();

    // Save the deployed contract address
    const address = register.target; // `target` is the contract address in ethers v6
    fs.writeFileSync(
      CONTRACT_ADDRESS_FILE,
      JSON.stringify({ address }, null, 2)
    );
    console.log("Contract deployed at address:", address);
  }

  // Function to interact with the contract
  const maker = async function deployContract(
    demandID,
    contractorID,
    farmerID,
    crop,
    variation,
    quantity,
    price,
    duration
  ) {
    await register.makeContract(
      demandID,
      contractorID,
      farmerID,
      crop,
      variation,
      quantity,
      price,
      duration
    );
  };

  module.exports = { maker, register };
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
