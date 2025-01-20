import { useEffect, useState } from "react";
import useUserRole from "../../services/getUserRole";
import DemandsTable from "./DemandsTable";
import axios from "axios";
import Proposals from "./Proposals";
import { useSelector } from "react-redux";

export default function Dashboard() {
  const { a: role } = useUserRole();
  const [data, setData] = useState([]);
  const id = useSelector((state) => state.user.id);
  const [proposalData, setProposalData] = useState([]);
  console.log(role);
  function updateData(data1) {
    return setData((data) => data1);
  }
  useEffect(() => {
    console.log(role);
    if (!role || !role.id) return;
    axios
      .get("http://localhost:3000/contractor/demand", {
        headers: { data: JSON.stringify({ id: role.id }) },
      })
      .then((response) => {
        console.log(role);
        console.log(response);
        updateData(response.data);
      })
      .catch((error) => console.log(error));
    axios
      .get("http://localhost:3000/proposal/search", {
        headers: { id },
      })
      .then((response) => {
        console.log(response.data);
        setProposalData(response.data);
      });
  }, [role]);
  console.log(data);
  return (
    <>
      <DemandsTable data={data} contractorID={role.id}></DemandsTable>
      <Proposals data={proposalData}></Proposals>
    </>
  );
}
