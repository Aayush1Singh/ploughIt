import api from "@/services/axiosApi";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
  TextField,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled, { css } from "styled-components";
import Modal2, { MainHead } from "./Modal2";
import Modal, { ContentRow } from "@/ui/Modal";
export const StyleStatus = styled.span`
  ${({ variation }) =>
    variation === "P" &&
    css`
      color: var(--color-yellow-500);
    `}
  ${({ variation }) =>
    variation === "U" &&
    css`
      color: var(--color-blue-500);
    `}
    ${({ variation }) =>
    variation === "R" &&
    css`
      color: var(--color-red-500);
    `}

  ${({ variation }) =>
    variation === "AC" &&
    css`
      color: var(--color-green-500);
    `}
`;
const API_URL = import.meta.env.VITE_BACKEND_URL;

function TableRow2({ data, farmerID }) {
  console.log(data);
  const [isOpen, setOpenModal] = useState(false);
  const [originalData, setOriginalData] = useState({});

  async function getData() {
    const x = await api.get(`${API_URL}/demand/search/id`, {
      headers: { data: JSON.stringify({ id: data.demandID }) },
    });
    console.log(x);
    return x;
  }
  const {
    data: oriData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["proposals", "update", data.demandID],
    queryFn: getData,
    enabled: false,
  });
  useEffect(() => {
    console.log("kkokokokookokokkk".oriData?.data?.result[0]);
    setOriginalData(oriData?.data?.result[0]);
  }, [oriData, isLoading]);
  if (!data || data.length == 0) return null;
  return (
    <>
      <TableRow
        onClick={(e) => {
          if (data.status == "R") return;
          refetch();
          setOpenModal(true);
        }}
        className="hover:bg-green-300"
      >
        <TableCell>{data.demandID}</TableCell>
        <TableCell>{data.price}</TableCell>
        <TableCell>{data.duration}</TableCell>
        <TableCell>
          <StyleStatus variation={data.status}>
            {data.status == "U"
              ? "Updated"
              : data.status == "R"
                ? "Rejected"
                : data.status == "AC"
                  ? "Accepted"
                  : "Pending"}
          </StyleStatus>
        </TableCell>
      </TableRow>

      {isOpen && originalData?.crop && (
        <Modal data={originalData} setIsOpen={setOpenModal}></Modal>
      )}
    </>
  );
}
function ProposalsTable({ rows, farmerID }) {
  const columns = [
    { headerName: "demandID" },
    { headerName: "Price" },
    { headerName: "Duration" },
    { headerName: "Status" },
  ];
  console.log(rows);
  const navigate = useNavigate();

  return (
    <TableContainer
      className={
        "h-full w-full overflow-auto rounded-xl border-2 border-blue-500"
      }
    >
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
                  farmerID={farmerID}
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

export default ProposalsTable;
