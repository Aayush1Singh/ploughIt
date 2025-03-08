import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { columns, StyledButton } from "./DemandsTable";
import Modal2, { FlexIt, MainHead, SecondMainHead } from "./Modal2";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  TableRow,
  Table,
} from "@mui/material";
import axios from "axios";
import { ContentRow } from "../../ui/Modal";
import api from "../../services/axiosApi";
import { useNavigate } from "react-router-dom";
import UpdateDemand from "./UpdateDemand";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { StyleStatus } from "./ProposalsTable";
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
const API_URL = import.meta.env.BACKEND_URL;

// function TableRow({ data }) {
//   const [isOpen, setOpenModal] = useState(false);
//   const [propose, setProposal] = useState(false);
//   const [originalData, setOriginalData] = useState({});
//   const [orginalPrice, setOrigianalPrice] = useState(0);
//   const [orginalDescription, setOrigianalDescription] = useState("");
//   const [orginalDuration, setOrigianalDuration] = useState(0);
//   useEffect(() => {
//     if (isOpen) {
//       api
//         .get(`http://localhost:3000/demand/search/id`, {
//           headers: { data: JSON.stringify({ id: data.demandID }) },
//         })
//         .then((response) => {
//           console.log(response);
//           const { price, duration, description } = response.data.result[0];
//           setOrigianalPrice(price);
//           setOrigianalDuration(duration);
//           setOrigianalDescription(description);
//           setOriginalData(response.data.result[0]);
//         });
//     }
//   }, [isOpen]);
//   return (
//     <StyledTableRow onClick={(e) => setOpenModal(true)}>
//       <p>{data.demandID}</p>
//       <p>{data.description}</p>
//       <FlexIt style={{ borderBottom: 0 }}>
//         <StyledButton variation="reject">Reject</StyledButton>
//         <StyledButton>🖊️</StyledButton>
//         <StyledButton variation="accept">Accept</StyledButton>
//       </FlexIt>
//       {isOpen && (
//         <Modal2 setIsOpen={setOpenModal}>
//           <form>
//             <MainHead>{`Demand ID: ${data.demandID}`}</MainHead>
//             <ContentRow
//               rowName={"crop"}
//               content={originalData.crop}
//             ></ContentRow>
//             <ContentRow
//               rowName={"variety"}
//               content={originalData.variety}
//             ></ContentRow>
//             <ContentRow
//               rowName={"preference"}
//               content={originalData.preference}
//             ></ContentRow>{" "}
//             <ContentRow
//               rowName={"created_at"}
//               content={originalData.created_at}
//             ></ContentRow>
//             <StyledDiv>
//               <p>Proposed Value</p>
//               <p>Old Value</p>
//             </StyledDiv>
//             <StyledDiv>
//               <p>{`Price `}</p>
//               <TextField defaultValue={data.price} disabled></TextField>
//               {<TextField value={orginalPrice} disabled={!propose}></TextField>}
//             </StyledDiv>{" "}
//             <StyledDiv>
//               <p>{`Duration `}</p>
//               <TextField defaultValue={data.duration} disabled></TextField>
//               {<TextField value={orginalPrice} disabled={!propose}></TextField>}
//             </StyledDiv>{" "}
//             <StyledDiv>
//               <p>{`Description `}</p>
//               <TextField defaultValue={data.description} disabled></TextField>
//               {
//                 <TextField
//                   value={orginalDescription}
//                   multiline
//                   disabled={!propose}
//                 ></TextField>
//               }
//             </StyledDiv>
//             <StyledDiv>
//               <StyledButton variation={"reject"} style={{ fontSize: `25px` }}>
//                 Reject
//               </StyledButton>{" "}
//               <StyledButton variation={"accept"} style={{ fontSize: `25px` }}>
//                 Accept
//               </StyledButton>
//               {(!propose && (
//                 <StyledButton
//                   style={{ fontSize: `25px` }}
//                   onClick={(e) => {
//                     e.preventDefault();
//                     setProposal(true);
//                   }}
//                 >
//                   🖊️
//                 </StyledButton>
//               )) || (
//                 <StyledButton variation={"accept"} style={{ fontSize: `25px` }}>
//                   Send Proposal
//                 </StyledButton>
//               )}
//             </StyledDiv>
//             <SecondMainHead></SecondMainHead>
//           </form>
//         </Modal2>
//       )}
//     </StyledTableRow>
//   );
// }
function Proposals({ data }) {
  console.log(data);
  return (
    <Table>
      <TableRow
        data={{ demandID: "DemandID", description: "Description" }}
      ></TableRow>
      {data &&
        data?.map((proposal) => (
          <TableRow2
            key={JSON.stringify(
              [
                proposal.contractorID,
                proposal.farmerID,
                proposal.created_at,
              ].join(":"),
            )}
            data={proposal}
          ></TableRow2>
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

export function TableRow2({ data, navigate }) {
  const [update, setUpdate] = useState(false);
  return (
    <>
      <TableRow
        key={data.created_at}
        onClick={(e) => {
          e.preventDefault();
          // console.log("hello");
          data = { ...data, auto_id: data.demandID };
          navigate(`/home/dashboard/${data.auto_id}`, { state: data });
        }}
        className="hover:bg-lime-100"
      >
        <TableCell>{data.demandID}</TableCell>
        <TableCell>{data.price}</TableCell>
        <TableCell>{data.duration}</TableCell>
        <TableCell>
          {" "}
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
    </>
  );
}

export function AllProposalsTable() {
  const navigate = useNavigate();
  // console.log(rows);
  const { id, role } = useSelector((state) => state.user);
  const columns = [
    { headerName: "demandID" },
    { headerName: "Price" },
    { headerName: "Duration" },
    { headerName: "Status" },
  ];
  async function searchAllProposals() {
    return await api.get(`${API_URL}/proposal/search`, {
      headers: { id },
    });
  }
  const [rows, setRows] = useState([]);
  const { data, isLoading } = useQuery({
    queryFn: searchAllProposals,
    queryKey: ["all", "proposals", { id, role }],
  });
  useEffect(() => {
    console.log(data);
    setRows(data?.data?.result);
  }, [data]);
  if (!rows) return null;
  return (
    <>
      <p className="m-5 text-6xl">Proposals</p>
      <TableContainer className="mr-auto ml-auto h-[318px] max-w-[800px] overflow-auto rounded-xl border-2 border-blue-500">
        <Table className="mr-auto ml-auto">
          <TableHead className="border-separate bg-lime-500">
            {columns.map((column) => (
              <TableCell key={column.field}>{column.headerName}</TableCell>
            ))}
          </TableHead>
          <TableBody className="h-9">
            {rows.map((data) => {
              return (
                <>
                  <TableRow2 data={data} navigate={navigate}></TableRow2>
                </>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
export default AllProposalsTable;
