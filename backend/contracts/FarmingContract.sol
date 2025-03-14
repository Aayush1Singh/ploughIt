// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Farming.sol';
import './FarmingT2.sol';
import "@openzeppelin/contracts/proxy/Clones.sol";

interface IFarmingContract {
    function getDetail() external view returns (string memory, string memory, uint256, uint256,uint256);
}
contract FarmingFactory{
  address private owner;
  address public farmingContractMaster; // Master contract address
  address public farmingContractMasterT2;
  mapping(uint256=>address) public demandToContract;
  mapping(address=>bool)allowedServers;
  mapping(address=>uint) public moneyTransfered;
  constructor(address[] memory servers,address masterContract,address masterContractT2){
    owner=msg.sender;
    for(uint i=0;i<servers.length;i++){
      allowedServers[servers[i]]=true;
    }
    farmingContractMaster=masterContract;
    farmingContractMasterT2=masterContractT2;
  }
  function requestAddServer(address _new) public {
    require(msg.sender==owner,'You are not authorised');
    allowedServers[_new]=true;
  }
  function removeServer(address _new) public {
    require(msg.sender==owner,'You are not authorised');
    allowedServers[_new]=false;
  }
  function createFarmingContract(uint256 _demandID,string memory _crop,string memory _variation,uint256 _duration,uint256 _price,uint256 _quantity,uint256 _farmerID,uint256 _contractorID) public {
    require(allowedServers[msg.sender]==true,'Not authorised');
    require(demandToContract[_demandID]==address(0),"Contract already exists");
    address proxy = Clones.clone(farmingContractMaster);
    FarmingContract(payable(proxy)).initialize(_crop,_variation,_duration,_price,_quantity,_farmerID,_contractorID);
    demandToContract[_demandID]=proxy;
  }
  function createFarmingContractT2(address _farmer,address _contractor,uint256 _demandID,string memory _crop,string memory _variation,uint256 _duration,uint256 _price,uint256 _quantity,uint256 _farmerID,uint256 _contractorID,uint256 _amount) public {
    require(allowedServers[msg.sender]==true,'Not authorised');
    require(demandToContract[_demandID]==address(0),"Contract already exists");
    require(moneyTransfered[_contractor]>= uint256(_amount*30)/100,'Insufficient amount deposited');
    address proxy = Clones.clone(farmingContractMasterT2);
    FarmingContractT2(payable(proxy)).initialize(_farmer,_contractor,_crop,_variation,_duration,_price,_quantity,_farmerID,_contractorID,_amount);
    demandToContract[_demandID]=proxy;
    (bool success, ) = payable(proxy).call{value: uint256(_amount*30)/100}("");
    require(success, 'Could not transfer money but contract created');
    moneyTransfered[_contractor]-=uint256(_amount*30)/100;
  }
  function getDetails(uint256 _demandID) public view returns (string memory, string memory, uint256, uint256, uint256) {
    require(allowedServers[msg.sender]==true,'Not authorised');
    require(demandToContract[_demandID]!=address(0),"Contract does not exists");
   IFarmingContract contractInstance = IFarmingContract(demandToContract[_demandID]);
    return contractInstance.getDetail();  
  }
  function getContractAddress(uint256 _demandID) public view returns (address) {
    require(demandToContract[_demandID]!=address(0),"Contract does not exists");
    return demandToContract[_demandID];
  }
  receive() external payable{
    moneyTransfered[msg.sender]+=msg.value;
  }
  function totalDeposited(address _contractor) public view returns(uint256){
    return moneyTransfered[_contractor];
  }
  function revertMoney(uint256 _amount,address _contractor) payable public{
    require(msg.sender == owner || allowedServers[msg.sender]==true, 'You are not authorised');
    if(moneyTransfered[_contractor]>=_amount){
      (bool success, ) = payable(address(_contractor)).call{value: uint256(_amount)}("");
      require(success,'coud not transfer money');
      moneyTransfered[_contractor] -= _amount;
    }
    else {
      (bool success, ) = payable(address(_contractor)).call{value: uint256(moneyTransfered[_contractor])}("");
      require(success,'coud not transfer money');
      moneyTransfered[_contractor] =0;
    }
  }
  function getAddressDemand(uint256 _demandID) public view returns(address){
    return demandToContract[_demandID];
  }
  function updateFarmingContractMaster(address _new) public {
    require(msg.sender==owner,'You are not authorised');
    farmingContractMaster=_new;
  }
  function updateFarmingContractMasterT2(address _new) public {
    require(msg.sender==owner,'You are not authorised');
    farmingContractMasterT2=_new;
  }
}