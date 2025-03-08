import React, { useState } from "react";
import api from "../../services/axiosApi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
function TableRow2({ data, navigate }) {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <TableRow
        key={data.created_at}
        onClick={(e) => {
          e.preventDefault();
          // console.log("hello");
          navigate(`/home/dashboard/ongoing/${data.contractID}`, {
            state: data,
          });
        }}
        className="hover:bg-lime-100"
      >
        <TableCell>{data.contractID}</TableCell>
        <TableCell>{data.farmerID}</TableCell>
        <TableCell>{data.crop}</TableCell>
        <TableCell>{data.quantity}</TableCell>
        <TableCell>{data.duration}</TableCell>
      </TableRow>
    </>
  );
}
function OngoingContracts({ rows, contractorID }) {
  console.log("ongoing demands: ", rows);
  const navigate = useNavigate();
  const columns = [
    { headerName: "DemandID" },
    { headerName: "farmerID" },
    { headerName: "crop" },
    { headerName: "Quantity" },
    { headerName: "Duration" },
  ];
  return (
    <TableContainer className="h-full w-full overflow-auto rounded-xl border-2 border-blue-500">
      <Table className="w-full">
        <TableHead className="border-separate bg-lime-500">
          {columns.map((column) => (
            <TableCell key={column.field + Math.random()}>
              {column.headerName}
            </TableCell>
          ))}
        </TableHead>
        <TableBody className="h-9">
          {rows?.map((data) => {
            return (
              <>
                <TableRow2
                  data={data}
                  contractorID={contractorID}
                  navigate={navigate}
                ></TableRow2>
              </>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OngoingContracts;
