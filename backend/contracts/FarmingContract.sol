// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FarmingContract {
    address public contractor;
    address public farmer;
    uint public price;
    string public cropType;
    uint public deliveryDeadline;
    bool public fulfilled;

    constructor(
        address _farmer,
        uint _price,
        string memory _cropType,
        uint _deliveryDeadline
    ) {
        contractor = msg.sender;
        farmer = _farmer;
        price = _price;
        cropType = _cropType;
        deliveryDeadline = _deliveryDeadline;
        fulfilled = false;
    }

    function fundContract() public payable {
        require(msg.sender == contractor, "Only the contractor can fund.");
        require(msg.value == price, "Incorrect amount.");
    }

    function fulfillContract() public {
        require(msg.sender == farmer, "Only the farmer can fulfill.");
        require(!fulfilled, "Contract already fulfilled.");
        fulfilled = true;

        payable(farmer).transfer(price);
    }
}
