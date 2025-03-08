// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './Farming.sol';
import './FarmingT2.sol';
import "@openzeppelin/contracts/proxy/Clones.sol";

interface IFarmingContract {
    function getDetail() external view returns (string memory, string memory, uint256, uint256,uint256);
}
contract FarmingFactory{
  mapping(uint256=>address) public demandToContract;
  mapping(address=>bool)allowedServers;
  mapping(address=>uint) public moneyTransfered;
  address owner;
  address public farmingContractMaster; // Master contract address
  address public farmingContractMasterT2;
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
    allowedServers[_new]=true;
  }
  function createFarmingContract(uint256 _demandID,string memory _crop,string memory _variation,uint _duration,uint _price,uint _quantity,uint _farmerID,uint _contractorID) public {
    require(allowedServers[msg.sender]==true,'Not authorised');
    require(demandToContract[_demandID]==address(0),"Contract already exsists");
    address proxy = Clones.clone(farmingContractMaster);
    FarmingContract(payable(proxy)).initialize(_crop,_variation,_duration,_price,_quantity,_farmerID,_contractorID);
    demandToContract[_demandID]=proxy;
  }
  function createFarmingContractT2(address _farmer,address _contractor,uint256 _demandID,string memory _crop,string memory _variation,uint _duration,uint _price,uint _quantity,uint _farmerID,uint _contractorID,uint256 _amount) public {
    require(allowedServers[msg.sender]==true,'Not authorised');
    require(demandToContract[_demandID]==address(0),"Contract already exsists");
    require(moneyTransfered[_contractor]>= uint256(_amount*30)/100,'Insufficient amount deposited');
    address proxy = Clones.clone(farmingContractMasterT2);
    FarmingContractT2(payable(proxy)).initialize(_farmer,_contractor,_crop,_variation,_duration,_price,_quantity,_farmerID,_contractorID,_amount);
    demandToContract[_demandID]=proxy;
    (bool success, ) = payable(proxy).call{value: uint256(_amount*30)/100}("");
    require(success==true,'Could not transfer money but contract created');
    moneyTransfered[_contractor]-=uint256(_amount*30)/100;
  }
  function getDetails(uint _demandID) public view returns 
  (string memory, string memory, uint256, uint256,uint256) {
    require(allowedServers[msg.sender]==true,'Not authorised');
    require(demandToContract[_demandID]!=address(0),"Contract does not exists");
   IFarmingContract contractInstance = IFarmingContract(demandToContract[_demandID]);
    return contractInstance.getDetail();  
  }
  function getContractAddress(uint _demandID) public view returns 
  (address) {
    require(allowedServers[msg.sender]==true,'Not authorised');
    require(demandToContract[_demandID]!=address(0),"Contract does not exists");
    return demandToContract[_demandID];
  }
  
  receive() external payable{
    moneyTransfered[msg.sender]+=msg.value;
  }
  event EarnestDeposited(address indexed from, uint256 amount);
  event EarnestRest(address indexed from, uint256 amount);
  function depositEarnest() public payable {
    moneyTransfered[msg.sender]+=msg.value;
    emit EarnestDeposited(msg.sender,moneyTransfered[msg.sender]);
  }
  function depositRest(uint _demandID) public payable {
    require(demandToContract[_demandID]!=address(0),'No contract found');
    (bool success, ) = payable(address(demandToContract[_demandID])).call{value: uint256(msg.value)}("");
    // require(success,'Could not deposit money');
    emit EarnestRest(msg.sender,moneyTransfered[msg.sender]);
  }
  function totalDeposited() public view returns(uint){
    return moneyTransfered[msg.sender];
  }
  function revertMoney(uint _amount,address _contractor) payable public{
    require(moneyTransfered[_contractor]>=_amount,'Not enough Money deposited');
    (bool success, ) = payable(address(_contractor)).call{value: uint256(msg.value)}("");
    require(success,'coud not transfer money');
  }
  function getAddressDemand(uint _demandID) public view returns(address){
    return demandToContract[_demandID];
  }
}