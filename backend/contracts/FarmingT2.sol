// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/proxy/Clones.sol"; 
contract FarmingContractT2 {
    enum Status { Created, Accepted, Completed, Cancelled }
    address contractor;
    address farmer;
    bool approveC;
    uint balance;
    uint public startDate;
    bool isInitialized;
    uint256 amount;
    struct  terms{
    address owner;
    string  variation;
    string  crop;
    uint256  quantity;
    uint256  pricePerUnit;
    uint256  duration;
    bool  isCompleted;
    uint256 farmerID;
    uint256  contractorID;    
    }
    terms public contractDetails;
    event ContractApproved(address indexed contractAddress, address indexed contractor, address indexed farmer);
    event EarnestDeposited(address indexed from, uint256 amount);
     function initialize(address _farmer,address _contractor,string memory _crop,string memory _variation,uint _duration,uint _price,uint _quantity,uint _farmerID,uint _contractorID,uint256 _amount) public {
       require(!isInitialized, "Already initialized");
      contractDetails.owner=msg.sender;
      contractDetails.crop=_crop;
      contractDetails.quantity=_quantity;
      contractDetails.variation=_variation;
      contractDetails.duration=_duration;
      contractDetails.pricePerUnit=_price;
      contractDetails.farmerID=_farmerID;
      contractDetails.contractorID=_contractorID;
      contractDetails.isCompleted=false;
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
      (bool sent, ) = farmer.call{value: msg.value}("");
      require(sent, "Failed to send Ether");
        
    }
    function sendMoneyContractor( )  private  {
      require(approveC==true,'Not authorised');
      require(msg.sender==contractDetails.owner,'Server not authorised');
      (bool sent, ) = contractor.call{value: msg.value}("");
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
      balance+=msg.value;
    }
    function updateStatus(bool status) public{
      contractDetails.isCompleted=status;
    }
    function getDetail() public view returns (string memory, string memory, uint256, uint256,uint256) {
      return (contractDetails.crop, contractDetails.variation, contractDetails.pricePerUnit, contractDetails.quantity,contractDetails.duration);
    }

}
