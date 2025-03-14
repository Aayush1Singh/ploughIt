// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/proxy/Clones.sol"; 
contract FarmingContractT2 {
    address contractor;
    address farmer;
    uint256 public startDate;
    uint256 public amount;
    bool public approveC;
    bool isInitialized;
    struct  terms{
    address owner;
    uint256  quantity;
    uint256  pricePerUnit;
    uint256  duration;
    uint256 farmerID;
    uint256  contractorID;  
    string  variation;
    string  crop;
    }
    terms contractDetails;
    event ContractApproved(address indexed contractAddress, address indexed contractor, address indexed farmer);
     function initialize(address _farmer,address _contractor,string memory _crop,string memory _variation,uint256 _duration,uint256 _price,uint256 _quantity,uint256 _farmerID,uint256 _contractorID,uint256 _amount) public {
       require(!isInitialized, "Already initialized");
      contractDetails.owner=msg.sender;
      contractDetails.crop=_crop;
      contractDetails.quantity=_quantity;
      contractDetails.variation=_variation;
      contractDetails.duration=_duration;
      contractDetails.pricePerUnit=_price;
      contractDetails.farmerID=_farmerID;
      contractDetails.contractorID=_contractorID;
      farmer=_farmer;
      contractor=_contractor;
      approveC=false;
      startDate=block.timestamp;
      isInitialized=true;
      amount=_amount;
    }
    function sendMoneyFarmer()  private  {
      require(approveC==true,'Not authorised');
      require(msg.sender==contractDetails.owner || msg.sender==contractor,'Server not authorised');
      (bool sent, ) = farmer.call{value:address(this).balance}("");
      require(sent, "Failed to send Ether");
    }
    function sendMoneyContractor( )  private  {
      require(approveC==true,'Not authorised');
      require(msg.sender==contractDetails.owner,'Server not authorised');
      (bool sent, ) = contractor.call{value: address(this).balance}("");
      require(sent, "Failed to send Ether");
    }     
    function approveContractor() public {
      require(msg.sender==contractor,'You are not authorised');
      require(amount<=address(this).balance,'Total Contract amount not deposited');
      require(approveC==false,'Already approved');
      approveC=true;
      sendMoneyFarmer();
      emit ContractApproved(address(this),contractor,farmer);
    }
    function resolveIssue(bool status) public {
      require(msg.sender==contractDetails.owner,'You are not authorised');
      approveC=status;
      if(status==false){ sendMoneyContractor();}
      else{ sendMoneyFarmer();}
    }
    receive() external payable {
    }
    function getDetail() public view returns (string memory, string memory, uint256, uint256,uint256) {
      return (contractDetails.crop, contractDetails.variation, contractDetails.pricePerUnit, contractDetails.quantity,contractDetails.duration);
    }
    function getID() public view returns (uint256 ,uint256){
      return (contractDetails.farmerID,contractDetails.contractorID);
    }
}
