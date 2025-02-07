import { useEffect, useMemo, useState } from "react";
import DemandsTable, { StyledButton, StyledTableRow } from "./DemandsTable";
import { useSelector } from "react-redux";
import api from "../../services/axiosApi";
import Modal2 from "./Modal2";
import { PartialTable2 } from "./PartialTable";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import OngoingDemands from "./OngoingDemands";
import { Visual } from "./Visual";
import ProposalsTable from "./ProposalsTable";
export default function Dashboard() {
  const { role, id, email } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [partialData, setPartialData] = useState([]);
  const [ongoingData, setOngoingData] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  async function demandFn() {
    const data = await api.get(`http://localhost:3000/${role}/demand/pending`, {
      headers: { data: JSON.stringify({ id }) },
    });
    return data;
  }
  async function partialDemands() {
    const data = await api.get(`http://localhost:3000/${role}/demand/partial`, {
      headers: { data: JSON.stringify({ id }) },
    });
    return data;
  }
  async function proposals() {
    const data = await api.get(`http://localhost:3000/${role}/proposals`, {
      headers: { data: JSON.stringify({ id }) },
    });
    return data;
  }
  const { data: resultPartialDemands, isLoading: loaderPartial } = useQuery({
    queryFn: partialDemands,
    queryKey: ["partial", { id, role }],
    staleTime: Infinity,
  });
  const { data: resultPendingDemands, isLoading: loaderDemands } = useQuery({
    queryFn: demandFn,
    queryKey: ["demands", { id, role }],
    staleTime: Infinity,
  });
  const { data: resultProposalsData, isLoading: loaderProposals } = useQuery({
    queryFn: proposals,
    queryKey: ["proposals", { id, role }],
    staleTime: Infinity,
  });
  useEffect(() => {
    console.log(resultProposalsData);
    if (resultProposalsData instanceof Error) {
      toast.error(resultProposalsData.message);
    } else {
      console.log(resultProposalsData);
      setProposalData(resultProposalsData?.data?.result);
    }
  }, [resultProposalsData, loaderProposals]);
  useEffect(() => {
    if (resultPendingDemands instanceof Error) {
      toast.error(resultPendingDemands.message);
    } else {
      setData(resultPendingDemands?.data);
    }
  }, [resultPendingDemands, loaderDemands]);
  useEffect(() => {
    console.log(resultPartialDemands);
    if (resultPartialDemands instanceof Error) {
      toast.error(resultPartialDemands.message);
    } else {
      setPartialData(resultPartialDemands?.data);
    }
  }, [resultPartialDemands, loaderPartial]);
  const pendingValue = useMemo(
    () =>
      data?.length > 0
        ? data.reduce((acc, item) => acc + item.price * item.quantity, 0)
        : 0,
    [data],
  );
  const partialValue = useMemo(
    () =>
      partialData?.length > 0
        ? partialData.reduce((acc, item) => acc + item.price * item.quantity, 0)
        : 0,
    [partialData],
  );
  const ongoingValue = useMemo(
    () =>
      ongoingData?.length > 0
        ? ongoingData.reduce((acc, item) => acc + item.price * item.quantity, 0)
        : 0,
    [ongoingData],
  );
  const pieData = useMemo(() => {
    console.log(pendingValue);
    return [
      { name: "Pending", value: pendingValue },
      { name: "Partial", value: partialValue },
      { name: "Ongoing", value: ongoingValue },
    ];
  }, [pendingValue, partialValue, ongoingValue]);
  //   api
  //     .get("http://localhost:3000/proposal/search", {
  //       headers: { id },
  //     })
  //     .then((response) => {
  //       setProposalData(response.data.result);
  //     })
  //     .catch((err) => console.log(err));
  return (
    <div className="to-white-100 grid h-full grid-cols-2 grid-rows-2 items-center justify-between gap-3">
      {role == "contractor" && (
        <DemandsTable rows={data} contractorID={id}></DemandsTable>
      )}
      {role == "farmer" && (
        <ProposalsTable rows={proposalData}></ProposalsTable>
      )}
      <Visual data={pieData}></Visual>
      {partialData && (
        <PartialTable2 rows={partialData} className=""></PartialTable2>
      )}
      <OngoingDemands></OngoingDemands>
    </div>
  );
}
