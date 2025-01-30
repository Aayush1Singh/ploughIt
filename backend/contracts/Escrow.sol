// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.28;

// // Uncomment this line to use console.log
// // import "hardhat/console.sol";
// interface IERC721{
//     function transferFrom(address _from,address _to, uint256 _id) external;
// }
// contract Escrow{
//     // mapping(uint=>bool) public isListed;
//     // mapping(uint=>uint) public purchasePrice;
//     // mapping(uint=>uint) public escrowAmount;
//     // mapping(uint=>uint) public buyer;
    
//     address public nftAddress;
//     uint256 public nftID;
//     address payable public seller;
//     // address payable public buyer;
//     // uint256 public escrowAmount;
//     // uint public purchasePrice;
//     address public inspector;
//     address public lender;
//     bool inspectionPassed=false;
//     mapping(address=>bool) public approval;
//     constructor (address  _nftAddress,uint256 _nftID,
//     uint256 _purchasePrice,uint256 _escrowAmount ,address payable _seller,address payable _buyer,address _inspector,
//     address _lender) {
//         nftAddress=_nftAddress;
//         nftID=_nftID;
//         seller=_seller;
//         // buyer=_buyer;
//         // escrowAmount=_escrowAmount;
//         // purchasePrice=_purchasePrice;
//         inspector=_inspector;
//         lender=_lender;
//     }
//     receive() external payable{

//     }
//     modifier onlyBuyer(){
//         require(msg.sender==buyer,'only buyer');
//         _;
//     }
//     modifier onlyInspector(){
//         require(msg.sender==inspector,'only inspaector');
//         _;
//     }    
//     function updateInspectionStatus(bool _passed) public onlyInspector{
//         inspectionPassed=_passed;
//     }
//     function depositEarnest() public payable onlyBuyer{
//         require(msg.value>=escrowAmount);
//         require(msg.sender==buyer,'only buyer cna call');

//     }
//     function getBalance() public view returns(uint){
//         return address(this).balance;
//     }
//     function finalizeSale() public{
//         require(inspectionPassed,'Must pass inspection');
//         IERC721(nftAddress).transferFrom(seller, buyer, nftID);
//     }
//     function list(uint256 _nftID) public {
//         IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftID);
//         isListed[_nftID]=true;
//     }
// }