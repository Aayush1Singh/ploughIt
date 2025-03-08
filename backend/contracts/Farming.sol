// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/proxy/Clones.sol"; 
contract FarmingContract {
    bool isInitialized;
    struct  terms{
    address owner;
    string  variation;
    string  crop;
    uint256  quantity;
    uint256  pricePerUnit;
    uint256  startDate;
    uint256  duration;
    bool  isCompleted;
    uint256 farmerID;
    uint256  contractorID;    
    }
    terms public contractDetails;
     function initialize(string memory _crop,string memory _variation,uint _duration,uint _price,uint _quantity,uint _farmerID,uint _contractorID) public {
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
        contractDetails.startDate=block.timestamp;
        isInitialized=true;
    }
    function updateStatus(bool status) public{
        contractDetails.isCompleted=status;
    }
     function monthsToSeconds(uint256 _months) public pure returns (uint256) {
        return _months * 30 * 24 * 60 * 60; // Approximate 30 days in a month
    }
    function getDetail() public view returns (string memory, string memory, uint256, uint256,uint256) {
        return (contractDetails.crop, contractDetails.variation, contractDetails.pricePerUnit,contractDetails.quantity, contractDetails.duration);
    }    
    function destroyContract() public {
        require(msg.sender == contractDetails.owner, "Only owner can destroy contract");
        require(contractDetails.isCompleted==true,'Contract is still in process or still unresolved');
        require(contractDetails.startDate+monthsToSeconds(contractDetails.duration)<block.timestamp,'Contract Time not expired');
    }
}
