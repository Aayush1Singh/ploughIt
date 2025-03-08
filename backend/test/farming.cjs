const chai = require("chai");
const { ethers } = require("hardhat");
const { expect } = chai;
require("@nomicfoundation/hardhat-ethers");
describe("FarmingContract Deployment", function () {
  let contract;
  let contractor, farmer, admin, server1, server;
  let res;
  let FarmingFactory, farmingFactory, farmingContractT2, farmingContract;
  beforeEach(async function () {
    const [server1] = await hre.ethers.getSigners();
    // console.log("hello", await hre.ethers.getSigners());
    // List of server wallet addresses
    contractor = farmer = admin = server = server1;
    const allowedServers = [server1.address];

    console.log(
      "Deploying FarmingFactory with allowed servers:",
      allowedServers
    );
    const FarmingContract = await ethers.getContractFactory("FarmingContract");
    farmingContract = await FarmingContract.deploy();
    const FarmingContractT2 = await ethers.getContractFactory(
      "FarmingContractT2"
    );
    farmingContractT2 = await FarmingContractT2.deploy();
    // console.log(farmingContractT2.target);
    // console.log(farmingContract.target);
    // Deploy FarmingFactory with allowed server wallets
    const FarmingFactory = await hre.ethers.getContractFactory(
      "FarmingFactory"
    );
    farmingFactory = await FarmingFactory.deploy(
      allowedServers,
      farmingContract.target,
      farmingContractT2.target
    );

    await farmingFactory.waitForDeployment();
    // console.log("FarmingFactory deployed at:", farmingFactory.target);
    // console.log(
    //   await farmingFactory.interface.getFunction("createFarmingContractT2")
    // );
  });
  it("should deposit earnest", async function () {
    const depositAmount = ethers.parseEther("4");
    const tx = await farmingFactory.connect(contractor).depositEarnest({
      value: "4000000000000000000",
    });
    await expect(tx)
      .to.emit(farmingFactory, "EarnestDeposited")
      .withArgs(contractor.address, depositAmount);
  });
  it("should verify amount deposited", async function () {
    const depositAmount = ethers.parseEther("4");
    const tx = await farmingFactory.connect(contractor).depositEarnest({
      value: "4000000000000000000",
    });
    const tt = await farmingFactory.connect(contractor).totalDeposited();
    expect(tt).to.equal("4000000000000000000");
  });
  it("should make contract", async function () {
    const depositAmount = ethers.parseEther("4");
    let tx = await farmingFactory.connect(contractor).depositEarnest({
      value: "4000000000000000000",
    });
    tx.wait();
    tx = await farmingFactory
      .connect(server)
      .createFarmingContractT2(
        farmer,
        contractor,
        0,
        "wheat",
        "mogra",
        6,
        120,
        40,
        1,
        2,
        10
      );
    tx = await farmingFactory.getDetails(0);
    console.log(tx);
  });
  it("should deposit rest of money", async function () {
    const depositAmount = ethers.parseEther("4");
    let tx = await farmingFactory.connect(contractor).depositEarnest({
      value: "4000000000000000000",
    });
    tx = await farmingFactory
      .connect(server)
      .createFarmingContractT2(
        farmer,
        contractor,
        0,
        "wheat",
        "mogra",
        6,
        120,
        40,
        1,
        2,
        10
      );

    tx = await farmingFactory.connect(contractor).depositRest(0, {
      value: "6000000000000000000",
    });

    const contractAddress = await farmingFactory.getAddressDemand(0); // Get contract address
    console.log("Contract Address: new ", contractAddress); // Debugging

    // Get a contract instance of the contract at contractAddress
    const contractInstance = new ethers.Contract(
      contractAddress,
      [
        {
          inputs: [
            {
              internalType: "address",
              name: "_farmer",
              type: "address",
            },
            {
              internalType: "address",
              name: "_contractor",
              type: "address",
            },
            {
              internalType: "string",
              name: "_crop",
              type: "string",
            },
            {
              internalType: "string",
              name: "_variation",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "_duration",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_price",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_quantity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_farmerID",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "_contractorID",
              type: "uint256",
            },
          ],
          stateMutability: "nonpayable",
          type: "constructor",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "from",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "amount",
              type: "uint256",
            },
          ],
          name: "EarnestDeposited",
          type: "event",
        },
        {
          inputs: [],
          name: "approveContractor",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "contractDetails",
          outputs: [
            {
              internalType: "address",
              name: "owner",
              type: "address",
            },
            {
              internalType: "string",
              name: "variation",
              type: "string",
            },
            {
              internalType: "string",
              name: "crop",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "quantity",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "pricePerUnit",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "duration",
              type: "uint256",
            },
            {
              internalType: "bool",
              name: "isCompleted",
              type: "bool",
            },
            {
              internalType: "uint256",
              name: "farmerID",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "contractorID",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "getDetail",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
            {
              internalType: "string",
              name: "",
              type: "string",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bool",
              name: "status",
              type: "bool",
            },
          ],
          name: "resolveIssue",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [],
          name: "startDate",
          outputs: [
            {
              internalType: "uint256",
              name: "",
              type: "uint256",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "bool",
              name: "status",
              type: "bool",
            },
          ],
          name: "updateStatus",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ],
      contractor
    );

    // Call approveContractor
    tx = await contractInstance.connect(contractor).approveContractor();
    await tx.wait();
    console.log("Transaction successful:", tx);
  });
});
