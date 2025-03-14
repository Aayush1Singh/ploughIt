import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/axiosApi";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ContentRow, MainHead } from "../../ui/Modal";
import { StyledButton } from "../Dashboard/DemandsTable";
import Modal2, { FlexIt } from "../Dashboard/Modal2";
import UpdateDemand from "../Dashboard/UpdateDemand";
import { useSelector } from "react-redux";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import toast from "react-hot-toast";
import { ThemeContext } from "@/pages/AppLayout";
import { useQuery } from "@tanstack/react-query";
const Table = styled.div``;
const TableRows = styled.div`
  //farmerID Price Duration Time
  overflow: auto;
`;
const StyledTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  &:hover {
    background-color: grey;
  }
`;
const StyledTableHead = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  background-color: green;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
`;
const API_URL = import.meta.env.VITE_BACKEND_URL;

const TableHeadT = function () {
  return (
    <StyledTableHead>
      <p>farmerID</p>
      <p>price</p>
      <p>duration</p>
    </StyledTableHead>
  );
};
const TableRowT = function ({ data }) {
  const [sureModel, setSureModel] = useState(false);
  const { isLoading, setLoader } = useContext(ThemeContext);

  if (!data) return;
  async function acceptContract() {
    setLoader(true);
    const op = await api.get(`${API_URL}/proposal/accepted/${data.demandID}`, {
      headers: { proposal: JSON.stringify(data) },
    });
    setLoader(false);
    if (op.resposnse.status == "failed") {
      console.log("helo");
    }
  }
  return (
    <StyledTableRow>
      <p>{data.farmerID}</p>
      <p>{data.price}</p>
      <p>{data.duration}</p>
      <p>
        <StyledButton
          variation={"accept"}
          onClick={() => {
            setSureModel(true);
            //are you sure model
          }}
        >
          Accept
        </StyledButton>
        <StyledButton variation={"reject"}>Reject</StyledButton>
      </p>
      {sureModel && (
        <Modal2 setIsOpen={setSureModel}>
          <div>
            <p>are you sure?</p>
            <StyledButton variation={"accept"} onClick={acceptContract}>
              Yes
            </StyledButton>{" "}
            <StyledButton variation={"reject"} onClick={() => {}}>
              No
            </StyledButton>
          </div>
        </Modal2>
      )}
    </StyledTableRow>
  );
};
const ContentDiv = function ({ data }) {
  const [oData, setData] = useState(data || {});
  // console.log(oriData);
  console.log(oData);
  const [update, setUpdate] = useState(false);
  useEffect(() => {}, [update]);
  const contractorID = useSelector((state) => state.user.id);
  return (
    <div className="m-0 p-0">
      <MainHead>{`Details`}</MainHead>
      <ContentRow rowName={"Crop"} content={oData.crop}></ContentRow>{" "}
      <ContentRow rowName={"Variety"} content={oData.variety}></ContentRow>{" "}
      <ContentRow rowName={"Price"} content={oData.price}></ContentRow>{" "}
      <ContentRow
        rowName={"Description"}
        content={oData.description}
      ></ContentRow>{" "}
      <ContentRow
        rowName={"Preference"}
        content={oData.preference}
      ></ContentRow>{" "}
      <ContentRow rowName={"Duration"} content={oData.duration}></ContentRow>{" "}
      <ContentRow rowName={"Quantity"} content={oData.quantity}></ContentRow>{" "}
      <StyledButton
        className="rounded-full p-3 hover:bg-green-300"
        variation="accept"
        onClick={() => setUpdate(true)}
      >
        Update
      </StyledButton>
      <StyledButton variation="reject" onClick={() => {}}>
        delete
      </StyledButton>
      {update && (
        <Modal2
          id={data.auto_id}
          heading={`Update Demand No: ${data.auto_id}`}
          actionName={"Update Demand"}
          setIsOpen={setUpdate}
        >
          <UpdateDemand
            data={oData}
            id={contractorID}
            updateTempData={setData}
            setUpdateDisplay={setUpdate}
          ></UpdateDemand>
        </Modal2>
      )}
    </div>
  );
};
function TableRow2({ data, navigate }) {
  console.log(data);
  const [sureModel, setSureModel] = useState(false);
  const [sureModelRetry, setSureModelRetry] = useState(false);
  const [retryRes, setRetryRes] = useState(null);
  const [rejected, setRejected] = useState(data.status == "R" ? true : false);
  const { isLoading, setLoader } = useContext(ThemeContext);
  useEffect(() => {
    // if (retryRes) {
    console.log(retryRes);
    if (retryRes) setSureModelRetry(true); // ✅ Open modal only after data is ready
  }, [retryRes]);
  if (!data) return;
  if (rejected) return null;
  function handleLoadingChangeT() {
    setLoader(true);
  }
  function handleLoadingChangeF() {
    setLoader(false);
  }
  async function payRestAndMakeContract() {
    console.log("hellllllllllllllll");
    console.log(retryRes);
    let { to: address, remainingAmount } = retryRes.data;

    handleLoadingChangeT();
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    handleLoadingChangeF();

    try {
      // handleLoadingChange();
      remainingAmount = BigInt(remainingAmount);
      const to = await window.ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: accounts[0],
            to: address,
            value: `0x${remainingAmount.toString(16)}`,
          },
        ],
      });
      // handleLoadingChange();
      acceptContract();
      // api.get(`${VITE_API_URL}\`)
      console.log(to);
      return to;
    } catch (err) {
      console.log(retryRes);
      console.log(err);
      return err;
    }
  }
  async function acceptContract() {
    setLoader(true);
    const x = await api
      .get(`${API_URL}/proposal/accepted/${data.demandID}`, {
        headers: { proposal: JSON.stringify(data) },
      })
      .then((res) => {
        console.log(res);
        toast.error("inida");

        if (res.data.status == "failed") {
          if (res.data.message == "Insufficient amount deposited") {
            //logic to deposit money
            toast.error("could not make contract due to indufficient deposit");
            //modal window to ask to deposit money and if pressend yes on that send eth_transaction and on success, make contract
            setSureModel(false);
            setRetryRes(res);
            //making a modal windoww
            // setSureModelRetry(true);
          }
        } else {
          toast.success("Proposal accepted and contract made");
          navigate("/home/dashboard");
        }
      });
    setLoader(false);
  }
  return (
    <>
      <TableRow
        key={data.created_at}
        onClick={(e) => {}}
        className="hover:bg-lime-100"
      >
        <TableCell>{data.farmerID}</TableCell>
        <TableCell>{data.price}</TableCell>
        <TableCell>{data.duration}</TableCell>
        <TableCell>
          <StyledButton
            variation={"accept"}
            onClick={() => {
              setSureModel(true);
              //are you sure model
            }}
          >
            Accept
          </StyledButton>
          <StyledButton
            variation={"reject"}
            onClick={(e) => {
              api.get(`${API_URL}/proposal/reject`, {
                headers: { data: JSON.stringify(data) },
              });
              toast.success("proposal rejected");
              setRejected(true);
            }}
          >
            Reject
          </StyledButton>
        </TableCell>
        {sureModelRetry && (
          <Modal2 setIsOpen={setSureModelRetry}>
            <p> Deposit money and make cotract?</p>
            <StyledButton
              variation="accept"
              onClick={() => {
                payRestAndMakeContract();
              }}
            >
              {" "}
              Yes
            </StyledButton>
            <StyledButton
              variation="reject"
              onClick={() => {
                setSureModelRetry(false);
              }}
            >
              No
            </StyledButton>
          </Modal2>
        )}

        {sureModel && (
          <Modal2 setIsOpen={setSureModel}>
            <div>
              <p>Are you sure?</p>
              <StyledButton
                variation={"accept"}
                onClick={() => {
                  api
                    .get(`${API_URL}/proposal/accepted/${data.demandID}`, {
                      headers: { proposal: JSON.stringify(data) },
                    })
                    .then((res) => {
                      console.log(res);
                      toast.error("inida");
                      if (res.data.status == "failed") {
                        console.log("hheloooo");
                        toast.error(
                          res?.data.message ||
                            "could not make contracct due to insufficient funds",
                        );
                        setSureModel(false);
                        setRetryRes(res);
                        console.log("ko");
                        // setSureModelRetry(true);
                      } else {
                        toast.success("Proposal accepted and contract made");
                        navigate("/home/dashboard");
                      }
                    });
                }}
              >
                Yes
              </StyledButton>{" "}
              <StyledButton variation={"reject"} onClick={() => {}}>
                No
              </StyledButton>
            </div>
          </Modal2>
        )}
      </TableRow>
    </>
  );
}
const columns = [
  { headerName: "FarmerID" },
  { headerName: "Price" },
  { headerName: "Duration" },
  { headerName: "Actions" },
];

function DemandDetials() {
  const navigate = useNavigate();
  const param = useParams();
  console.log(param);
  const { state } = useLocation();
  console.log(state);
  const [proposals, setProposals] = useState([]);
  const { isLoading, setLoader } = useContext(ThemeContext);
  async function getProposals() {
    return await api.get(`${API_URL}/proposal/${param.demandID}`);

    // .then((response) => {
    //   console.log(response.data.result);
    //   setProposals(response.data.result);
    // });
  }
  const { data, fetchStatus } = useQuery({
    queryKey: ["proposal", param.demandID],
    queryFn: getProposals,
    staleTime: Infinity,
  });
  useEffect(() => {
    console.log(data);
    if (data) setProposals(data?.data?.result);
  }, [data]);
  useEffect(() => {
    //send a req to fetch all demands related to a singhe demandID;

    // api.get(`${API_URL}/proposal/${param.demandID}`).then((response) => {
    //   console.log(response.data.result);
    //   setProposals(response.data.result);
    // });
    if (fetchStatus == "idle") {
      setLoader(false);
    } else {
      setLoader(true);
    }
  }, [fetchStatus]);
  return (
    <div className="grid h-full gap-2 overflow-auto">
      <button
        className="rounded-full p-3 hover:bg-green-100"
        onClick={() => {
          navigate(-1);
        }}
      >
        &larr;
      </button>
      <ContentDiv data={state}></ContentDiv>
      <div className="flex justify-center">
        <TableContainer className="h-[252px] max-w-fit items-center overflow-auto rounded-xl border-2 border-blue-500">
          <TableHead className="w-full border-separate bg-lime-500">
            {columns.map((column) => (
              <TableCell key={column.field}>{column.headerName}</TableCell>
            ))}
          </TableHead>
          <TableBody className="h-9">
            {proposals.map((proposal) => {
              if (proposal.status == "R") return null;

              return (
                <TableRow2
                  data={proposal}
                  navigate={navigate}
                  key={proposal.created_at}
                ></TableRow2>
              );
            })}
          </TableBody>
        </TableContainer>
      </div>
    </div>
  );
}

export default DemandDetials;
