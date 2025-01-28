import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/axiosApi";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { ContentRow, MainHead } from "../../ui/Modal";
import { StyledButton } from "../Dashboard/DemandsTable";
import Modal2 from "../Dashboard/Modal2";
import UpdateDemand from "../Dashboard/UpdateDemand";
import { useSelector } from "react-redux";
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
const TableHead = function () {
  return (
    <StyledTableHead>
      <p>farmerID</p>
      <p>price</p>
      <p>duration</p>
    </StyledTableHead>
  );
};
const TableRow = function ({ data }) {
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
                  }
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
    <div>
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
      <StyledButton onClick={() => setUpdate(true)}>update</StyledButton>
      <StyledButton onClick={() => {}}>delete</StyledButton>
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
    <div>
      <button
        onClick={() => {
          navigate(-1);
        }}
      >
        &larr;
      </button>
      <ContentDiv data={state}></ContentDiv>
      <Table>
        <TableHead></TableHead>
        <TableRows>
          {proposals.map((proposal) => (
            <TableRow data={proposal} key={proposal.created_at}></TableRow>
          ))}
        </TableRows>
      </Table>
    </div>
  );
}

export default DemandDetials;
