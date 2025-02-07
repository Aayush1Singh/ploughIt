// "use client";

// import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
// export type Details = {
//   auto_id: number;
//   crop: string;
//   variety: string;
//   preference: "none" | "organic" | "no pesticides";
//   status: string;
//   duration: number;
// };
// export const columns = [
//   {
//     accessorKey: "auto_id",
//     header: "ID",
//   },
//   {
//     accessorKey: "crop",
//     header: "Crop",
//   },
//   {
//     accessorKey: "variety",
//     header: "Variety",
//   },
//   {
//     accessorKey: "preference",
//     header: "Preference",
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//   },
//   {
//     accessorKey: "duration",
//     header: "Duration (Days)",
//   },
// ];

import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
export const columns = [
  { field: "auto_id", headerName: "ID", width: 70 },
  { field: "crop", headerName: "Crop", width: 130 },
  { field: "variety", headerName: "Variety", width: 130 },
  { field: "preference", headerName: "Quantity", width: 150 },
  { field: "preference", headerName: "Preference", width: 150 },
  { field: "status", headerName: "Status", width: 120 },
  {
    field: "duration",
    headerName: "Duration (Days)",
    type: "number",
    width: 120,
  },
  { field: "", headerName: "" },
];

export default function DataTable({ rows }) {
  rows.map((data) => {
    data.id = data.auto_id;
    return data;
  });
  const navigate = useNavigate();
  return (
    <TableContainer className="w- h-[318px] max-w-auto rounded-t-xl border-2 border-blue-500">
      <TableHead className="border-separate bg-lime-500">
        {columns.map((column) => (
          <TableCell key={column.field}>{column.headerName}</TableCell>
        ))}
      </TableHead>
      <TableBody className="h-9 overflow-auto">
        {rows.map((data) => {
          return (
            <TableRow
              key={data.created_at}
              onClick={() => {
                console.log("hello");
                navigate(`/home/dashboard/${data.auto_id}`, { state: data });
              }}
              className="hover:bg-lime-100"
            >
              <TableCell>{data.auto_id}</TableCell>
              <TableCell>{data.crop}</TableCell>
              <TableCell>{data.variety}</TableCell>
              <TableCell>{data.quantity}</TableCell>
              <TableCell>{data.preference}</TableCell>
              <TableCell>{data.status}</TableCell>
              <TableCell>{data.duration}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </TableContainer>
  );
}
