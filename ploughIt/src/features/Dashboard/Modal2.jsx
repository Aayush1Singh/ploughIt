import axios from "axios";
import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { Button } from "@mui/material";
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
  font-size: 35px;
  margin: 0 0;
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
function ContentRow({ rowName, content, suffix }) {
  return (
    <ThirdMainHead>
      <Span>{rowName}</Span>:{content} {suffix}
    </ThirdMainHead>
  );
}

export function Modal2({ id, heading, actionName, children, setIsOpen }) {
  // const { result: details } = axios.get("http://localhost:3000/details", {
  //   headers: { id },
  // });
  useEffect(() => {
    document.addEventListener(
      "click",
      function (event) {
        // If user either clicks X button OR clicks outside the modal window, then close modal by calling closeModal()
        if (
          event.target.matches(".button-close-modal") ||
          // !event.target.closest(".modal") ||
          !document.querySelector(".modal")?.contains(event.target)
        ) {
          // console.log(
          //   event.target,
          //   document.querySelector(".modal")?.contains(event.target),
          //   "kkkkkkkkkkkkkkkkkkkkkkkkkk"
          // );
          setIsOpen(false);
        }
      },
      true
    );
  });
  const details = {
    crop: "Wheat",
    variety: "PBW 757",
    created_at: "2024-07-01",
    quantity: 30,
    price: 200,
    location: "Delhi",
    preference: "organic",
  };
  return ReactDOM.createPortal(
    <BackGroundTemp>
      <BackDrop>
        <Window className={"modal"}>
          <FlexIt>
            <MainHead>{heading}</MainHead>{" "}
            <ButtonClose className="button-close-modal">❌</ButtonClose>
          </FlexIt>
          {children}
          <FlexIt></FlexIt>
        </Window>
      </BackDrop>
    </BackGroundTemp>,
    document.body
  );
}

export default Modal2;
