import { useState, createPortal } from "react";
import styled, { css } from "styled-components";
import UpdateDemand from "./UpdateDemand";
import Modal2, { FlexIt } from "./Modal2";
const StyledTableRow = styled.div`
  width: 100%;

  min-width: 4rem;
  border-top: solid 2px;
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 0.5fr; //id crop variety quantity preference status duration left
  /* background-color: green; */
  justify-items: center;
  gap: 10px;
  &:hover {
    background-color: #eee;
  }
`;
export const Table = styled.div`
  width: 37rem;
  justify-items: center;
  max-height: 20rem;
  overflow: auto;

  /* height: 5rem; */
  border: solid 2px;
  border-radius: 10px;
  padding: 3px;
  &::-webkit-scrollbar {
    width: 20px;
  }
  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
  }
  div:first-child {
    position: sticky;
    top: 0;
    background-color: #84cc16 !important;
    border-radius: 10px;
    font-size: 20px;
    font-family: "Libre Franklin Variable", sans-serif;
  }
  div:first-child {
    border-top: 0;
  }
`;
export const StyledButton = styled.button`
  background-color: transparent;
  box-shadow: 0px;
  border-width: 0px;
  ${({ variation }) => {
    return (
      variation == "reject" &&
      css`
        background-color: #be123c;
        color: #fb7185;
        font-weight: 600;
        border-radius: 30px;
        width: fit-content;
        height: fit-content;
        padding: 0.5rem 0.5rem;
      `
    );
  }};
  ${({ variation }) => {
    return (
      variation == "accept" &&
      css`
        font-weight: 600;
        background-color: #22c55e;
        color: #86efac;
        border-radius: 30px;
        width: fit-content;
        height: fit-content;
        padding: 0.5rem 0.5rem;
      `
    );
  }};
`;
function TableRow({ data, contractorID }) {
  const [display, setDisplay] = useState(false);
  const [update, setUpdate] = useState(false);
  return (
    <>
      <StyledTableRow onClick={(e) => setDisplay((display) => !display)}>
        <p>{data.auto_id}</p>
        <p>{data.crop}</p>
        <p>{data.variety}</p>
        <p>{data.quantity}</p>
        <p>{data.preference}</p>
        <p>{data.status}</p>
        <p>{data.duration}</p>
        <FlexIt style={{ borderBottom: `0px` }}>
          <StyledButton
            onClick={(e) => {
              setUpdate((update) => !update);
            }}
          >
            🖊️
          </StyledButton>
          <StyledButton
            onClick={(e) => {
              setUpdate((update) => !update);
            }}
          >
            🗑️
          </StyledButton>
        </FlexIt>
      </StyledTableRow>
      {update && (
        <Modal2
          id={data.auto_id}
          heading={`Update Demand No: ${data.auto_id}`}
          actionName={"Update Demand"}
          setIsOpen={setUpdate}
        >
          <UpdateDemand data={data} id={contractorID}></UpdateDemand>
        </Modal2>
      )}
      {display && <div>description: ${data.description}</div>}
    </>
  );
}
function DemandsTable({ data, contractorID }) {
  console.log(data);
  return (
    <Table>
      <TableRow
        data={{
          auto_id: "ID",
          variety: "Variety",
          crop: "Crop",
          quantity: "Quantity",
          preference: "Preference",
          status: "Status",
          duration: "Duration",
        }}
      ></TableRow>
      {data &&
        data?.map((item) => {
          // console.log(item.auto_id);
          return (
            <TableRow
              key={item.auto_id}
              data={item}
              contractorID={contractorID}
            ></TableRow>
          );
        })}
    </Table>
  );
}

export default DemandsTable;
