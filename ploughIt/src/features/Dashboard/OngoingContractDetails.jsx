import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { StyledButton } from "./DemandsTable";
import api from "@/services/axiosApi";
import { ethers } from "ethers";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ContentRow } from "@/ui/Modal";
import { MainHead } from "./Modal2";
import { useSelector } from "react-redux";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const FARMING_CONTRACT_T2_ABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "contractAddress",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "contractor",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "farmer",
        type: "address",
      },
    ],
    name: "ContractApproved",
    type: "event",
  },
  {
    inputs: [],
    name: "amount",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "approveC",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
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
    name: "getDetail",
    outputs: [
      { internalType: "string", name: "", type: "string" },
      { internalType: "string", name: "", type: "string" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getID",
    outputs: [
      { internalType: "uint256", name: "", type: "uint256" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_farmer", type: "address" },
      { internalType: "address", name: "_contractor", type: "address" },
      { internalType: "string", name: "_crop", type: "string" },
      { internalType: "string", name: "_variation", type: "string" },
      { internalType: "uint256", name: "_duration", type: "uint256" },
      { internalType: "uint256", name: "_price", type: "uint256" },
      { internalType: "uint256", name: "_quantity", type: "uint256" },
      { internalType: "uint256", name: "_farmerID", type: "uint256" },
      { internalType: "uint256", name: "_contractorID", type: "uint256" },
      { internalType: "uint256", name: "_amount", type: "uint256" },
    ],
    name: "initialize",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "bool", name: "status", type: "bool" }],
    name: "resolveIssue",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "startDate",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  { stateMutability: "payable", type: "receive" },
];
const ContentDiv = function ({ data }) {
  const [oData, setData] = useState(data || {});
  // console.log(oriData);
  setData(data);
  console.log(oData);
  if (!oData) return null;
  return (
    <div className="m-0 p-0">
      <MainHead>{`Details`}</MainHead>
      <ContentRow rowName={"Crop"} content={oData[0]}></ContentRow>{" "}
      <ContentRow rowName={"Variety"} content={oData[1]}></ContentRow>{" "}
      <ContentRow rowName={"Price"} content={oData[2]}></ContentRow>{" "}
      {/* <ContentRow
        rowName={"Preference"}
        content={oData.preference}
      ></ContentRow>{" "} */}
      <ContentRow rowName={"Duration"} content={oData[4]}></ContentRow>{" "}
      <ContentRow rowName={"Quantity"} content={oData[3]}></ContentRow>{" "}
      <ContentRow rowName={"Price"} content={oData[1]}></ContentRow>{" "}
    </div>
  );
};
function OngoingDemandDetails() {
  const [hasFetchedAddr, setGetAddr] = useState(false);
  const [pendingActions, setPendingActions] = useState(null);
  const { state } = useLocation();
  async function getContractDetails() {
    const resp = await api.get(`${API_URL}/contract/${state.contractID}`);
    console.log(resp);
    return resp;
  }
  const { data: contractData } = useQuery({
    queryKey: ["contractDetails", state.contractoID],
    queryFn: getContractDetails,
    staleTime: Infinity,
  });

  async function completeContract(response) {
    try {
      // const response = await api.get(`${API_URL}/getContractAddress`, {
      //   headers: { contractID: state.contractID },
      // });
      console.log(response);
      const addressDest = response.data.contractAddress;
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get provider and signer
      console.log(window.ethereum);
      console.log(ethers);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      // Contract address and ABI
      const contractAddress = `${addressDest}`; // Replace with actual contract address
      const contractABI = FARMING_CONTRACT_T2_ABI;

      // Connect to contract
      let contract = new ethers.Contract(contractAddress, contractABI, signer);
      contract = await contract.connect(signer);
      const tx = await contract.approveContractor();

      console.log("successfully transferred money: ", tx);
    } catch (err) {
      console.log("due to complete contract ", err);
    }
  }

  async function payRest(response) {
    let res = await api.get(`${API_URL}/convertMoneyRest`, {
      headers: { data: JSON.stringify(state) },
    });
    // console.log(convertercryptoToDollars);
    const { amount, contractAddress } = res.data;
    console.log(res);
    // const response = await api.get(`${API_URL}/getContractAddress`, {
    //   headers: { contractID: state.contractID },
    // });
    // console.log(response);
    // const addressDest = convertercryptoToDollars.contractAddress;

    // convertercryptoToDollars = JSON.parse(convertercryptoToDollars.data.data);
    // convertercryptoToDollars = convertercryptoToDollars.data[0].quote.ETH.price;
    // convertercryptoToDollars = parseFloat(convertercryptoToDollars).toFixed(18);
    const convertercryptoToDollars = `0x${BigInt(amount).toString(16)}`;
    console.log(convertercryptoToDollars);
    try {
      let accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const to = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: contractAddress,
            value: convertercryptoToDollars,
          },
        ],
      });
      console.log(to);
      //send a response to frontend to indicate success
      return to;
    } catch (err) {
      console.log(err);
      return err;
    }
    // console.log(JSON.parse(res.data.data).data[0].quote.ETH.price);
  }
  async function getContractAddress() {
    const response = await api.get(`${API_URL}/getContractAddress`, {
      headers: { contractID: state.contractID },
    });
    return response;
  }
  const { data, fetchStatus } = useQuery({
    queryKey: ["contractAddress", state.contractID],
    queryFn: getContractAddress,
    staleTime: Infinity,
    enabled: hasFetchedAddr,
  });
  const queryClient = useQueryClient();

  function handleCompleteContract() {
    const cachedAddr = queryClient.getQueryData([
      "contractAddress",
      state.contractID,
    ]);

    if (cachedAddr) {
      completeContract(cachedAddr); // Use cached data instead of waiting for refetch
    } else {
      setGetAddr(true);
      setPendingActions("completeContract");
      // while (fetchStatus == "fetching");
      // completeContract(data);
    }
  }
  async function handlePayRest() {
    const cachedAddr = queryClient.getQueryData([
      "contractAddress",
      state.contractID,
    ]);

    if (cachedAddr) {
      payRest(cachedAddr); // Use cached data instead of waiting for refetch
    } else {
      setGetAddr(true);
      setPendingActions("payRest");
      // await payRest(data);
    }
  }
  useEffect(() => {
    if (data && pendingActions == "payRest") {
      payRest(data);
    } else if (data && pendingActions == "completeContracct") {
      completeContract(data);
    }
  }, [pendingActions, data]);
  console.log(state);
  return (
    <>
      {/* <ContentDiv data={contractData}></ContentDiv> */}
      <div>
        <StyledButton
          variation="accept"
          onClick={(e) => {
            handlePayRest();
          }}
        >
          Pay Rest Amount
        </StyledButton>
        <StyledButton
          variation="accept"
          onClick={(e) => {
            handleCompleteContract();
          }}
        >
          Complete Contract
        </StyledButton>
      </div>
    </>
  );
}

export default OngoingDemandDetails;
