import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Table,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
function TableRow2({ data, farmerID }) {
  console.log(data);
  return (
    <TableRow>
      <TableCell>{data.demandID}</TableCell>
      <TableCell>{data.price}</TableCell>
      <TableCell>{data.duration}</TableCell>
      <TableCell>{data.status}</TableCell>
    </TableRow>
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
      className="h-full max-w-fit overflow-auto rounded-xl border-2 border-blue-500"
      w-full
    >
      <Table calssName="w-full">
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
