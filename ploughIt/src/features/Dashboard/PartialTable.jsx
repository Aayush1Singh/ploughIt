import { useState, createPortal } from "react";
import styled, { css } from "styled-components";
import UpdateDemand from "./UpdateDemand";
import Modal2, { FlexIt } from "./Modal2";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import { useSelector } from "react-redux";
import api from "@/services/axiosApi";
export const StyledTableRow = styled.div`
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
// export const Table = styled.div`
//   width: 37rem;
//   justify-items: center;
//   max-height: 20rem;
//   overflow: auto;

//   /* height: 5rem; */
//   border: solid 2px;
//   border-radius: 10px;
//   padding: 3px;
//   &::-webkit-scrollbar {
//     width: 20px;
//   }
//   &::-webkit-scrollbar-track {
//     background-color: transparent;
//   }
//   &::-webkit-scrollbar-thumb {
//     background-color: #d6dee1;
//   }
//   &::-webkit-scrollbar-thumb {
//     background-color: #d6dee1;
//     border-radius: 20px;
//   }
//   &::-webkit-scrollbar-thumb {
//     background-color: #d6dee1;
//     border-radius: 20px;
//     border: 6px solid transparent;
//     background-clip: content-box;
//   }
//   &::-webkit-scrollbar-thumb:hover {
//     background-color: #a8bbbf;
//   }
//   div:first-child {
//     position: sticky;
//     top: 0;
//     background-color: #84cc16 !important;
//     border-radius: 10px;
//     font-size: 20px;
//     font-family: "Libre Franklin Variable", sans-serif;
//   }
//   div:first-child {
//     border-top: 0;
//   }
// `;
const dat = { naem: "singh" };
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

export const columns = [
  { field: "auto_id", headerName: "ID", width: 70 },
  { field: "crop", headerName: "Crop", width: 130 },
  { field: "variety", headerName: "Variety", width: 130 },
  { field: "preference", headerName: "Quantity", width: 150 },
  { field: "preference", headerName: "Price", width: 150 },
  { field: "duration", headerName: "Duration" },

  {
    field: "farmer_approval",
    headerName: "Farmer",
    type: "number",
    width: 120,
  },
  { field: "contractor_approval", headerName: "Contractor" },
];
const Styledspan = styled.span`
  ${({ variation }) =>
    variation == "pending" &&
    css`
      color: var(--color-yellow-500);
    `}
  ${({ variation }) =>
    variation == "approved" &&
    css`
      color: var(--color-green-500);
    `}
`;

export function PartialTableRow({ data, navigate, contractorID }) {
  const [isModal, setIsModal] = useState(false);
  const { role, id } = useSelector((state) => state.user);
  return (
    <>
      <TableRow
        className="hover:bg-lime-100"
        key={data.created_at}
        onClick={(e) => {
          e.preventDefault();
          // console.log("hello");
          setIsModal(true);
        }}
      >
        <TableCell>{data.auto_id}</TableCell>
        <TableCell>{data.crop}</TableCell>
        <TableCell>{data.variety}</TableCell>
        <TableCell>{data.quantity}</TableCell>
        <TableCell>{data.price}</TableCell>
        <TableCell>{data.duration}</TableCell>
        <TableCell>
          <Styledspan variation={data.farmer_approval ? "approved" : "pending"}>
            {data.farmer_approval ? "approved" : "pending"}
          </Styledspan>{" "}
        </TableCell>{" "}
        <TableCell>
          <Styledspan
            variation={data.contractor_approval ? "approved" : "pending"}
          >
            {data.contractor_approval ? "approved" : "pending"}
          </Styledspan>
        </TableCell>
      </TableRow>
      {isModal && (
        <Modal2 setIsOpen={setIsModal}>
          <div>
            {data[`${role}_approval`] ? (
              "You have already approvesd"
            ) : (
              <StyledButton
                variation="accept"
                onClick={() => {
                  data[`${role}ID`] = id;
                  api.get("http://localhost:3000/makeContract", {
                    headers: { demand: JSON.stringify(data) },
                  });
                }}
              >
                Approve
              </StyledButton>
            )}
          </div>
        </Modal2>
      )}
    </>
  );
}
export function PartialTable2({ rows, className }) {
  const navigate = useNavigate();
  // console.log(rows);
  return (
    <TableContainer
      className={"h-full overflow-auto rounded-xl border-2 border-blue-500"}
    >
      <Table className="w-full">
        <TableHead className="border-separate bg-lime-500">
          {columns.map((column) => (
            <TableCell key={column.field}>{column.headerName}</TableCell>
          ))}
        </TableHead>
        <TableBody className="h-9">
          {rows &&
            rows?.map((data) => {
              return (
                <>
                  <PartialTableRow
                    data={data}
                    navigate={navigate}
                  ></PartialTableRow>
                </>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
