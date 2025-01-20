import { Button } from "@mui/material";
import styled from "styled-components";

export const LocationDiv = styled.div`
  display: flex;
  translate: 23%;
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
    translate: -100%;
  }
`;
export const Form = styled.form`
  max-width: 40rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
export const StyledFormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* height: 5rem; */
  height: fit-content;
  max-width: 40rem;
  gap: 3rem;
`;
export const Label = styled.label`
  font-family: "Libre Franklin Variable", sans-serif;
  font-size: 30px;
`;

export function FormRow({ children, content, height }) {
  return (
    <StyledFormRow style={{ height: `${height}rem` }}>
      <Label>{content}</Label>
      {children}
    </StyledFormRow>
  );
}
