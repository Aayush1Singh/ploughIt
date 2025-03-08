import axios from "axios";
import React, { useEffect, useState } from "react";
import styled, { css } from "styled-components";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import api from "../services/axiosApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
const BackGroundTemp = styled.div`
  position: absolute;
  z-index: 1000;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
  /* background-image: linear-gradient(to bottom right, green, blue); */
`;
const Div2 = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;
export const GreenButton = styled(Button)`
  &.MuiButton-root {
    background-color: green;
    color: white;
    border-radius: 5px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
    width: 300px;
    height: 60px;
  }
`;
const BackDrop = styled.div`
  z-index: 0;
  /* background-image: linear-gradient(red, yellow, blue); */
  backdrop-filter: blur(3px);
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  justify-items: center;
  align-items: center;
`;
const Window = styled.div`
  width: 40rem;
  height: 30rem;
  border-radius: 20px;
  background-color: white;
  padding: 20px;
  border: solid 2px;
`;
export const Content = styled.p`
  font-family: "Libre Franklin Variable", sans-serif;
  font-size: 30px;
  margin: 0 0;
`;
export const SecondMainHead = styled.p`
  font-size: 30px;
  margin: 0 0;
`;
export const ThirdMainHead = styled.p`
  font-size: 20px;
  margin: 0 0;
  margin-bottom: 5px;
`;
export const MainHead = styled.p`
  font-size: 80px;
  margin: 0 0;
  line-height: 1;
`;
export const FlexIt = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 4px dotted black;
  margin-bottom: 10px;
`;
export const Span = styled.span`
  font-weight: 600;
`;
export const ButtonClose = styled.button`
  /* position: absolute; */
  right: 0%;
  width: 30px;
  height: 30px;
  background-color: transparent;
  box-shadow: 0 0;
  border-width: 0;
`;
export const Input = styled.input`
  width: 3rem;
  border-radius: 5px;

  ${({ variation }) => {
    return (
      variation === "multiline" &&
      css`
        width: 10rem;
        height: 3rem;
      `
    );
  }}
`;
const Textarea = styled.textarea`
  height: 4rem;
  max-height: 4rem;
  min-height: 4rem;
`;
const API_URL = import.meta.env.BACKEND_URL;

export function ContentRow({ rowName, content, suffix }) {
  return (
    <ThirdMainHead>
      <Span>{rowName}</Span>:{content} {suffix}
    </ThirdMainHead>
  );
}
function EditContentRow({ content, suffix, rowName, variation, children }) {
  return (
    <ThirdMainHead>
      <Span>{rowName}</Span>: {children} {suffix}{" "}
    </ThirdMainHead>
  );
}
export function Modal({ data: details, setIsOpen }) {
  const [proposal, setProposal] = useState(false);
  console.log(details);
  useEffect(() => {
    document.addEventListener(
      "click",
      function (event) {
        // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
        if (
          event.target.matches(".button-close-modal") ||
          !event.target.closest(".modal")
        ) {
          setIsOpen(false);
        }
      },
      true,
    );
  });
  async function proposalInsert(data) {
    console.log("gay");
    data = { ...data, status: "P" };
    const res = await api.get(`${API_URL}/proposal/insert`, {
      headers: { data: JSON.stringify(data) },
    });
    if (res instanceof Error) {
      toast.error("could not send proposal");
    } else {
      toast.success("proposal sent");
      setIsOpen(false);
      queryClient.invalidateQueries(["proposals", { id, role }]);
    }
    return res;
  }
  const { mutate, isLoading } = useMutation({
    mutationFn: proposalInsert,
  });

  // const { result: details } = axios.get("http://localhost:3000/details", {
  //   headers: { id },
  // });
  // const details = {
  //   crop: "Wheat",
  //   variety: "PBW 757",
  //   created_at: "2024-07-01",
  //   quantity: 30,
  //   price: 200,
  //   location: "Delhi",
  //   preference: "organic",
  // };
  const { id, role } = useSelector((state) => state.user);
  const { register, handleSubmit, formState } = useForm();
  const { errors } = formState;
  const queryClient = useQueryClient();
  async function onSubmit(data) {
    console.log(data);
    console.log(id, details);
    data = {
      ...data,
      farmerID: id,
      contractorID: details.contractorID,
      demandID: details.auto_id,
    };
    mutate(data);
    console.log(errors);
    // const res = await api.get("http://localhost:3000/proposal/insert", {
    //   headers: { data: JSON.stringify(data) },
    // });
    // if (res instanceof Error) {
    //   toast.error("could not send proposal");
    // } else {
    //   toast.success("proposal sent");
    //   setIsOpen(false);
    //   queryClient.invalidateQueries(["proposals", { id, role }]);
    // }
  }
  function onError(err) {
    console.log(err);
  }
  return (
    <BackGroundTemp>
      <BackDrop>
        <Window className={"modal"}>
          <form onSubmit={handleSubmit(onSubmit, onError)}>
            <FlexIt>
              <MainHead>{details.crop || "Hello"}</MainHead>{" "}
              <ButtonClose type="button" className="button-close-modal">
                ❌
              </ButtonClose>
            </FlexIt>
            <FlexIt>
              <SecondMainHead>
                {`Variety: `}
                {details.variety || "any"}
              </SecondMainHead>
              <ThirdMainHead>{`contract created: ${details.created_at}`}</ThirdMainHead>
            </FlexIt>
            <ContentRow
              rowName="Quantity required"
              content={details.quantity}
              suffix="quintels"
            ></ContentRow>

            {(proposal && (
              <EditContentRow rowName="Price " content={details.price}>
                {" "}
                <Input
                  defaultValue={details.price}
                  {...register("price")}
                ></Input>
              </EditContentRow>
            )) || (
              <ContentRow rowName="Price " content={details.price}></ContentRow>
            )}
            {(proposal && (
              <EditContentRow
                rowName="Delivery Deadline"
                content={details.duration}
              >
                {" "}
                <Input
                  defaultValue={details.duration}
                  {...register("duration", {
                    validate: {
                      testInp: (duration) =>
                        !Number.isNaN(Number(duration)) || "input number only",
                    },
                  })}
                ></Input>
              </EditContentRow>
            )) || (
              <ContentRow
                rowName="Delivery Deadline "
                content={details.duration}
              ></ContentRow>
            )}
            <ContentRow
              rowName="Delivery Location "
              content={details.location}
            ></ContentRow>
            <ContentRow
              rowName="Preferred farming "
              content={details.preference}
            ></ContentRow>
            <ContentRow
              rowName="Pre payment details "
              content={30}
              suffix="percent"
            ></ContentRow>
            {(proposal && (
              <EditContentRow
                variation={"multiline"}
                rowName="Other Proposals"
                content={details.quantity}
              >
                {" "}
                <Textarea
                  name="textarea"
                  {...register("description")}
                ></Textarea>
              </EditContentRow>
            )) || (
              <>
                <SecondMainHead>{`Contractor's information`}</SecondMainHead>
                <ContentRow
                  rowName="Name "
                  content={details.ownerID}
                ></ContentRow>
                <ContentRow rowName="Contact information "></ContentRow>
              </>
            )}
            <FlexIt></FlexIt>
            <Div2>
              {/* <GreenButton
                type="button"
                onClick={(e) => {

                  e.preventDefault();
                }}
              >
                accept contract
              </GreenButton> */}
              {proposal ? (
                <GreenButton type="submit">Send Proposal</GreenButton>
              ) : (
                <GreenButton
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setProposal((proposal) => !proposal);
                  }}
                >
                  Proposal
                </GreenButton>
              )}
            </Div2>
          </form>
        </Window>
      </BackDrop>
    </BackGroundTemp>
  );
}

export default Modal;
