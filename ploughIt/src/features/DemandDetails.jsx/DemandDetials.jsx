import React, { useEffect, useState } from "react";
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
  if (!data) return;

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
            <StyledButton
              variation={"accept"}
              onClick={() => {
                api.get(
                  `http://localhost:3000/proposal/accepted/${data.demandID}`,
                  {
                    headers: { proposal: JSON.stringify(data) },
                  },
                );
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
          ></UpdateDemand>
        </Modal2>
      )}
    </div>
  );
};
function TableRow2({ data }) {
  console.log(data);
  const [sureModel, setSureModel] = useState(false);
  if (!data) return;
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
          <StyledButton variation={"reject"}>Reject</StyledButton>
        </TableCell>
        {sureModel && (
          <Modal2 setIsOpen={setSureModel}>
            <div>
              <p>are you sure?</p>
              <StyledButton
                variation={"accept"}
                onClick={() => {
                  api.get(
                    `http://localhost:3000/proposal/accepted/${data.demandID}`,
                    {
                      headers: { proposal: JSON.stringify(data) },
                    },
                  );
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
  useEffect(() => {
    //send a req to fetch all demands related to a singhe demandID;
    api
      .get(`http://localhost:3000/proposal/${param.demandID}`)
      .then((response) => {
        console.log(response.data.result);
        setProposals(response.data.result);
      });
  }, [state]);
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
            {proposals.map((proposal) => (
              <TableRow2 data={proposal} key={proposal.created_at}></TableRow2>
            ))}
          </TableBody>
        </TableContainer>
      </div>
    </div>
  );
}

export default DemandDetials;
