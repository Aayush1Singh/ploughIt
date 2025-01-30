import chai from "chai";
import hardhat from "hardhat";
import "@nomicfoundation/hardhat-ethers";
const { ethers } = hardhat;
const { expect } = chai;
describe("FarmingContract Deployment", function () {
  let Farming, contract;

  beforeEach(async function () {
    console.log("Deploying contract...");
    Farming = await ethers.getContractFactory("FarmingContract");
    contract = await Farming.deploy();
    await contract.makeContract(0, 1, 1, "wheat", "mogra", 20, 30, 6);
    // await contract.deploy();
    await contract.waitForDeployment(); // Required in ethers v6
    console.log("Contract deployed:", contract);
  });

  it("should deploy the contract correctly", async function () {
    expect(contract.target).to.be.properAddress;
  });

  it("should return correct initial values", async function () {
    const cropType = await contract.getCrop(0);
    expect(cropType).to.equal("wheat"); // Modify based on actual contract getter function
  });
});
