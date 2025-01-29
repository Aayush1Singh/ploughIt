import { useEffect, useState } from "react";
import useUserRole from "../../services/getUserRole";
import DemandsTable, {
  StyledButton,
  StyledTableRow,
  Table,
} from "./DemandsTable";
import axios from "axios";
import Proposals from "./Proposals";
import { useSelector } from "react-redux";
import api from "../../services/axiosApi";
import Modal2 from "./Modal2";
function PartialTableRow({ data, contractorID, children }) {
  const [display, setDisplay] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const { role, id } = useSelector((state) => state.user);

  return (
    <>
      <StyledTableRow onClick={(e) => setIsModal((isModal) => !isModal)}>
        <p>{data.auto_id}</p>
        <p>{data.crop}</p>
        <p>{data.variety}</p>
        <p>{data.quantity}</p>
        <p>{data.preference}</p>
        <p>{data.duration}</p>
        <p>{data.farmer_approval}</p>
        <p>{data.contractor_approval}</p>
      </StyledTableRow>
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
function PartialTable({ data, contractorID }) {
  return (
    <Table>
      <PartialTableRow
        data={{
          auto_id: "ID",
          variety: "Variety",
          crop: "Crop",
          quantity: "Quantity",
          preference: "Preference",
          duration: "Duration",
          farmer_approval: "farmer_approval",
          contractor_approval: "contractor_approval",
        }}
      ></PartialTableRow>
      {data &&
        data?.map((item) => {
          console.log(item);
          return (
            <PartialTableRow
              key={item.auto_id}
              data={item}
              contractorID={contractorID}
            ></PartialTableRow>
          );
        })}
    </Table>
  );
}
export default function Dashboard() {
  const { role, id, email } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user);
  const [data, setData] = useState([]);
  const [proposalData, setProposalData] = useState([]);
  const [partialData, setPartialData] = useState([]);
  function updateData(data1) {
    setData((data) => data1);
  }
  useEffect(() => {
    if (!id) return;
    api
      .get(`http://localhost:3000/${role}/demand/pending`, {
        headers: { data: JSON.stringify({ id }) },
      })
      .then((response) => {
        updateData(response.data);
      })
      .catch((error) => console.log(error));
    api
      .get(`http://localhost:3000/${role}/demand/partial`, {
        headers: { data: JSON.stringify({ id }) },
      })
      .then((response) => {
        setPartialData(response.data);
        console.log(response.data);
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
      <PartialTable data={partialData}></PartialTable>
    </>
  );
}
