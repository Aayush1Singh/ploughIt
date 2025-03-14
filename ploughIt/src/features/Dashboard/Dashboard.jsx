import { useContext, useEffect, useMemo, useState } from "react";
import DemandsTable, { StyledButton, StyledTableRow } from "./DemandsTable";
import { useSelector } from "react-redux";
import api from "../../services/axiosApi";
import Modal2 from "./Modal2";
import { PartialTable2 } from "./PartialTable";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import OngoingContracts from "./OngoingContracts";
import { Visual } from "./Visual";
import ProposalsTable from "./ProposalsTable";
import Loader from "@/ui/Loader";
import { ThemeContext } from "@/pages/AppLayout";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export default function Dashboard() {
  const { role, id, email } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [partialData, setPartialData] = useState([]);
  const [ongoingData, setOngoingData] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  const { isLoading, setLoader } = useContext(ThemeContext);
  // console.log(x);

  // const [isLoading, setLoading] = useState(false);
  async function demandFn() {
    const data = await api.get(`${API_URL}/${role}/demand/pending`, {
      headers: { data: JSON.stringify({ id }) },
    });
    return data;
  }
  async function partialDemands() {
    const data = await api.get(`${API_URL}/${role}/demand/partial`, {
      headers: { data: JSON.stringify({ id }) },
    });
    return data;
  }
  async function ongoingDemands() {
    const data = await api.get(`${API_URL}/${role}/demand/ongoing`, {
      headers: { data: JSON.stringify({ id }) },
    });
    return data;
  }
  async function proposals() {
    const data = await api.get(`${API_URL}/${role}/proposals`, {
      headers: { data: JSON.stringify({ id }) },
    });
    return data;
  }
  const { data: resultPartialDemands, fetchStatus: loaderPartial } = useQuery({
    queryFn: partialDemands,
    queryKey: ["partial", { id, role }],
    staleTime: Infinity,
  });
  const { data: resultOngoingDemands, fetchStatus: loaderOngoing } = useQuery({
    queryFn: ongoingDemands,
    queryKey: ["ongoing", { id, role }],
    staleTime: Infinity,
  });
  const { data: resultPendingDemands, fetchStatus: loaderDemands } = useQuery({
    queryFn: demandFn,
    queryKey: ["demands", { id, role }],
    staleTime: Infinity,
  });
  const { data: resultProposalsData, fetchStatus: loaderProposals } = useQuery({
    queryFn: proposals,
    queryKey: ["proposals", { id, role }],
    staleTime: Infinity,
  });
  useEffect(() => {
    // console.log(resultProposalsData);
    if (resultProposalsData instanceof Error) {
      toast.error(resultProposalsData.message);
    } else {
      // console.log(resultProposalsData);
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
    if (resultOngoingDemands instanceof Error) {
      toast.error(resultOngoingDemands.message);
    } else {
      setOngoingData(resultOngoingDemands?.data);
    }
  }, [resultOngoingDemands, loaderOngoing]);
  useEffect(() => {
    // console.log(resultPartialDemands);
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
    // console.log(pendingValue);
    return [
      { name: "Pending", value: pendingValue },
      { name: "Partial", value: partialValue },
      { name: "Ongoing", value: ongoingValue },
    ];
  }, [pendingValue, partialValue, ongoingValue]);
  useEffect(() => {
    if (
      loaderDemands == "fetching" ||
      loaderProposals == "fetching" ||
      loaderOngoing == "fetching" ||
      loaderPartial == "fetching"
    ) {
      setLoader(true);
    } else setLoader(false);
  }, [loaderDemands, loaderProposals, loaderOngoing, loaderPartial]);
  // if (isLoading) return <Loader></Loader>;
  return (
    <>
      {isLoading && <Loader></Loader>}
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
        <OngoingContracts
          rows={ongoingData}
          contractorID={id}
        ></OngoingContracts>
      </div>
    </>
  );
}
