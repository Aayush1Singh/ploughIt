// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmingContract {
    enum Status { Created, Accepted, Completed, Cancelled }
    struct ContractDetails {
        uint256 demandID;
        string variation; 
        string crop; 
        uint256 quantity;
        uint256 pricePerUnit;
        uint256 startDate;
        uint256 duration;
        string status;
        uint256 farmerID;
        uint256 contractorID;
    }
    mapping(uint=>ContractDetails) public register;
    // Events
    event ContractCreated(uint256 contractorID,uint256 farmerID, string crop, string variation, uint256 quantity, uint256 price);
    constructor(
    ) {
        // register[_demandID] = ContractDetails({
        //     demandID:_demandID,
        //     farmerID: _farmerID,
        //     contractorID: _contractorID,
        //     crop: _crop,
        //     variation: _variation,
        //     quantity: _quantity,
        //     pricePerUnit: _pricePerUnit,
        //     startDate: block.timestamp,
        //     duration: _duration,
        //     status: 'created'
        // });

        // emit ContractCreated(_contractorID, _farmerID,_crop, _variation, _quantity, _pricePerUnit);
    }
 function makeContract (
        uint256 _demandID,
        uint256 _contractorID,
        uint256 _farmerID,
        string memory _crop,
        string memory _variation,
        uint256 _quantity,
        uint256 _pricePerUnit,
        uint256 _duration 
    ) public {
        register[_demandID] = ContractDetails({
            demandID:_demandID,
            farmerID: _farmerID,
            contractorID: _contractorID,
            crop: _crop,
            variation: _variation,
            quantity: _quantity,
            pricePerUnit: _pricePerUnit,
            startDate: block.timestamp,
            duration: _duration,
            status: 'created'
        });

        emit ContractCreated(_contractorID, _farmerID,_crop, _variation, _quantity, _pricePerUnit);
    }
    function getEndDate(uint demandID) public view returns (uint256) {
        return register[demandID].startDate + register[demandID].duration;
    }
    function getCrop(uint demandID) public view returns ( string memory){
        return register[demandID].crop;
    }
function getContractDetails(uint demandID) public view returns (
    uint256, uint256, string memory, string memory, uint256
) {
    return (
        register[demandID].contractorID,
        register[demandID].farmerID,
        register[demandID].crop,
        register[demandID].variation,
        register[demandID].quantity
    );
}
}
