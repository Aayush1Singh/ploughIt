import { Card, CardActionArea, CardContent } from "@mui/material";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "./Modal";

const P = styled.p`
  font-family: "Libre Franklin Variable", sans-serif;
  font-size: 1rem;
  padding: 0 0;
  margin: 0 0;
  max-width: 310px;
  word-wrap: break-word;
  overflow: hidden;
  max-height: 40px;
`;
const Description = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 4px;
  max-width: 310px;

  width: fit-content;
`;
const Wrap = styled.div`
  max-width: 310px;
`;
const StyledCardContent = styled(CardContent)`
  max-width: 310px;
  max-height: 150px;
`;
const Span = styled.span`
  display: inline;
`;
const H2 = styled.h2`
  margin: 0;
  margin-bottom: 10px;
`;
function ContentRow({ header, content }) {
  return (
    <Wrap>
      <P>
        <Span style={{ fontWeight: "bold" }}>{header} </Span>: {content}
      </P>
    </Wrap>
  );
}

function DemandCard({ data }) {
  const [isOpen, setIsOpen] = useState();

  const { id, description, price, crop, variety, duration, preference } = data;
  return (
    <>
      <Card sx={{ width: "100%" }}>
        <CardActionArea
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((isOpen) => !isOpen);
          }}
        >
          <StyledCardContent>
            <H2>{data?.crop}</H2>
            <Description>
              <ContentRow header="variety" content={variety}></ContentRow>
              <ContentRow header="duration" content={duration}></ContentRow>
              <ContentRow header="preference" content={preference}></ContentRow>
              <ContentRow
                header="description"
                content={description}
              ></ContentRow>
            </Description>
          </StyledCardContent>
        </CardActionArea>
      </Card>
      {isOpen && <Modal data={data} setIsOpen={setIsOpen}></Modal>}
    </>
  );
}

export default DemandCard;
