// const { expect } = require("chai");
// const { ethers } = require("hardhat");
// const tokens = (n) => {
//   return ethers.parseUnits(n.toString(), "ether");
// };
// const ether = tokens;
// describe("RealEstate", () => {
//   let escrow, realEstate;
//   let deployer, seller, lender, inspector;
//   let nftID = 1;
//   let purchasePrice = ether(100);
//   let escrowAmount = ether(20);
//   beforeEach(async () => {
//     accounts = await ethers.getSigners();
//     deployer = accounts[0];
//     seller = deployer;
//     buyer = accounts[1];
//     lender = accounts[2];
//     inspector = accounts[3];
//     const RealEstate = await ethers.getContractFactory("RealEstate");
//     const Escrow = await ethers.getContractFactory("Escrow");
//     realEstate = await RealEstate.deploy();
//     escrow = await Escrow.deploy(
//       realEstate.target,
//       nftID,
//       ether(100),
//       ether(20),
//       seller.address,
//       buyer.address,
//       inspector.address,
//       lender.address
//     );
//     transaction = await realEstate
//       .connect(seller)
//       .approve(escrow.target, nftID);
//     await transaction.wait();
//   });
//   describe("Deployment", async () => {
//     it("sends and nft to seller", async () => {
//       expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
//     });
//   });
//   describe("Selling real estate", async () => {
//     it("executes a successful trans.", async () => {
//       expect(await realEstate.ownerOf(nftID)).to.equal(seller.address);
//       console.log(await escrow.getBalance());
//       transaction = await escrow
//         .connect(buyer)
//         .depositEarnest({ value: escrowAmount });
//       await transaction.wait();
//       console.log(await escrow.getBalance());
//       transaction = await escrow
//         .connect(inspector)
//         .updateInspectionStatus(true);
//       await transaction.wait();
//       transaction = await escrow.connect(buyer).finalizeSale();
//       await transaction.wait();
//       expect(await realEstate.ownerOf(nftID)).to.equal(buyer.address);
//     });
//   });
// });
