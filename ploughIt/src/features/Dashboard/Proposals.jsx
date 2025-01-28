import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { StyledButton, Table } from "./DemandsTable";
import Modal2, { FlexIt, MainHead, SecondMainHead } from "./Modal2";
import { TextField } from "@mui/material";
import axios from "axios";
import { ContentRow } from "../../ui/Modal";
import api from "../../services/axiosApi";
const StyledTableRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 3fr 1fr;
  justify-content: center;
  gap: 20px;
  width: 100%; //demandID proposal
  align-items: center;
  &:hover {
    background-color: #eee;
  }
`;
const StyledDiv = styled.div`
  display: flex;
  font-family: "Libre Franklin Variable", sans-serif;
  font-size: 20px;
  gap: 1rem;
`;
function TableRow({ data }) {
  const [isOpen, setOpenModal] = useState(false);
  const [propose, setProposal] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [orginalPrice, setOrigianalPrice] = useState(0);
  const [orginalDescription, setOrigianalDescription] = useState("");
  const [orginalDuration, setOrigianalDuration] = useState(0);
  useEffect(() => {
    if (isOpen) {
      api
        .get(`http://localhost:3000/demand/search/id`, {
          headers: { data: JSON.stringify({ id: data.demandID }) },
        })
        .then((response) => {
          console.log(response);
          const { price, duration, description } = response.data.result[0];
          setOrigianalPrice(price);
          setOrigianalDuration(duration);
          setOrigianalDescription(description);
          setOriginalData(response.data.result[0]);
        });
    }
  }, [isOpen]);
  return (
    <StyledTableRow onClick={(e) => setOpenModal(true)}>
      <p>{data.demandID}</p>
      <p>{data.description}</p>
      <FlexIt style={{ borderBottom: 0 }}>
        <StyledButton variation="reject">Reject</StyledButton>
        <StyledButton>🖊️</StyledButton>
        <StyledButton variation="accept">Accept</StyledButton>
      </FlexIt>
      {isOpen && (
        <Modal2 setIsOpen={setOpenModal}>
          <form>
            <MainHead>{`Demand ID: ${data.demandID}`}</MainHead>
            <ContentRow
              rowName={"crop"}
              content={originalData.crop}
            ></ContentRow>
            <ContentRow
              rowName={"variety"}
              content={originalData.variety}
            ></ContentRow>
            <ContentRow
              rowName={"preference"}
              content={originalData.preference}
            ></ContentRow>{" "}
            <ContentRow
              rowName={"created_at"}
              content={originalData.created_at}
            ></ContentRow>
            <StyledDiv>
              <p>Proposed Value</p>
              <p>Old Value</p>
            </StyledDiv>
            <StyledDiv>
              <p>{`Price `}</p>
              <TextField defaultValue={data.price} disabled></TextField>
              {<TextField value={orginalPrice} disabled={!propose}></TextField>}
            </StyledDiv>{" "}
            <StyledDiv>
              <p>{`Duration `}</p>
              <TextField defaultValue={data.duration} disabled></TextField>
              {<TextField value={orginalPrice} disabled={!propose}></TextField>}
            </StyledDiv>{" "}
            <StyledDiv>
              <p>{`Description `}</p>
              <TextField defaultValue={data.description} disabled></TextField>
              {
                <TextField
                  value={orginalDescription}
                  multiline
                  disabled={!propose}
                ></TextField>
              }
            </StyledDiv>
            <StyledDiv>
              <StyledButton variation={"reject"} style={{ fontSize: `25px` }}>
                Reject
              </StyledButton>{" "}
              <StyledButton variation={"accept"} style={{ fontSize: `25px` }}>
                Accept
              </StyledButton>
              {(!propose && (
                <StyledButton
                  style={{ fontSize: `25px` }}
                  onClick={(e) => {
                    e.preventDefault();
                    setProposal(true);
                  }}
                >
                  🖊️
                </StyledButton>
              )) || (
                <StyledButton variation={"accept"} style={{ fontSize: `25px` }}>
                  Send Proposal
                </StyledButton>
              )}
            </StyledDiv>
            <SecondMainHead></SecondMainHead>
          </form>
        </Modal2>
      )}
    </StyledTableRow>
  );
}
function Proposals({ data }) {
  return (
    <Table>
      <TableRow
        data={{ demandID: "DemandID", description: "Description" }}
      ></TableRow>
      {data &&
        data?.map((proposal) => (
          <TableRow
            key={JSON.stringify(
              [
                proposal.contractorID,
                proposal.farmerID,
                proposal.created_at,
              ].join(":")
            )}
            data={proposal}
          ></TableRow>
        ))}{" "}
      <TableRow
        data={{
          demandID: 1,
          proposal: "it is best in class you know it i know ",
        }}
      ></TableRow>
    </Table>
  );
}

export default Proposals;
