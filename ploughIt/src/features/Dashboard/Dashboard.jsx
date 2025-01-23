import { useEffect, useState } from "react";
import useUserRole from "../../services/getUserRole";
import DemandsTable from "./DemandsTable";
import axios from "axios";
import Proposals from "./Proposals";
import { useSelector } from "react-redux";
import api from "../../services/axiosApi";

export default function Dashboard() {
  const { role, id, email } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  function updateData(data1) {
    setData((data) => data1);
  }
  useEffect(() => {
    if (!id) return;
    api
      .get("http://localhost:3000/contractor/demand", {
        headers: { data: JSON.stringify({ id }) },
      })
      .then((response) => {
        updateData(response.data);
      })
      .catch((error) => console.log(error));
    api
      .get("http://localhost:3000/proposal/search", {
        headers: { id },
      })
      .then((response) => {
        setProposalData(response.data.result);
      })
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <DemandsTable data={data} contractorID={id}></DemandsTable>
      <Proposals data={proposalData}></Proposals>
    </>
  );
}
