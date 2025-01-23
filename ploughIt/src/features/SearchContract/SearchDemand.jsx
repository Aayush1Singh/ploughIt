import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Button,
  Pagination,
  Slider,
  Stack,
  TextField,
} from "@mui/material";
import styled from "styled-components";
import DemandCard from "../../ui/DemandCard";
import { useForm } from "react-hook-form";
import Tags from "../../ui/multiAutocomplete";
import supabase from "../../database/supabase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Skeleton from "@mui/material/Skeleton";
import axios from "axios";
import api from "../../services/axiosApi";
const FlexIt = styled.div`
  width: 200px;
  justify-self: center;
  display: flex;
  justify-content: space-between;
`;
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
`;
const Label = styled.label`
  font-family: "Libre Franklin Variable", sans-serif;
`;
const OuterWrap = styled.form`
  display: grid;
  grid-template-columns: 1fr;
  margin: 0 auto;
  max-width: 60rem;
  gap: 2rem;
`;
const StyleSearch = styled.div`
  display: grid;
  grid-template-rows: 3;
`;
const StylePagination = styled(Pagination)`
 &.css-1xra8g6-MuiPagination-root {
  width:fit-content;
  justify-self:center;
 }


 
}
`;
const SimpleButton = styled.button`
  border-width: 0;
  background-color: transparent;
  box-shadow: 0;
`;
const top100Films = ["hello", "bye"];
const cropDetails = {
  id: "84080",
  crop: "wheat",
  variety: "mogra",
  duration: "6",
  preference: "organic",
  description: `fine of 200 will be imposed in case of late or no delivery are you ok.
  i am india you  know`,
};
const MSlider = styled(Slider)`
  &.MuiSlider-root {
    color: green;
  }
`;
const DemandWindow = styled.div`
  grid-template-columns: 1fr 1fr 1fr;
  display: grid;
`;
async function searchAPI(
  crop,
  variety,
  price,
  quantity,
  preference,
  duration,
  cursors,
  type
) {
  let data = {};
  console.log("hello", "yooyo");
  await api
    .get(
      `http://localhost:3000/demand/search${type === "" ? "" : `/${type}`}`,
      {
        headers: {
          data: JSON.stringify({
            crop,
            variety,
            price,
            quantity,
            preference,
            duration,
            PAGE_SIZE: 6,
            cursors,
          }),
        },
      }
    )
    .then((response) => {
      data = response.data;
    })
    .catch((err) => console.log(err));
  return data;
}
function SearchDemand() {
  const [quantity, setQuantity] = useState([0, 100]);
  const [price, setPrice] = useState(0);
  const [crop, setCrop] = useState([]);
  const [variety, setVariety] = useState([]);
  const [preference, setPreference] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [duration, setDuration] = useState([0, 12]);
  const [type, setType] = useState("");
  const [page, setPage] = useState(0);
  function handleType(data) {
    setType((type) => data);
  }
  const { data, refetch, isPending, isFetching } = useQuery({
    queryFn: () =>
      searchAPI(
        crop,
        variety,
        price,
        quantity,
        preference,
        duration,
        queryClient.getQueryData(["searchResults"])?.cursors,
        type
      ),
    queryKey: ["searchResults"],
    onSuccess: () => console.log("data fetched"),
    onError: (error) => console.log(error.message),
  });
  const toggleLoading = function () {
    setIsLoading((isLoading) => !isLoading);
  };
  const queryClient = useQueryClient();
  useEffect(
    function () {
      toggleLoading();
      const debounce = setTimeout(() => {
        queryClient.invalidateQueries(["searchResults"]);
      }, 1000);

      toggleLoading();
      return () => clearTimeout(debounce);
    },
    [
      crop,
      variety,
      price,
      quantity,
      preference,
      duration,
      refetch,
      page,
      type,
      queryClient,
    ]
  );
  return (
    <StyleSearch>
      <StyledDiv>
        <Tags setValue={setCrop} label="crops"></Tags>
        <Tags setValue={setVariety} label="variety"></Tags>{" "}
        <div>
          <Label>Quantity</Label>
          <MSlider
            type="number"
            getAriaLabel={() => "Temperature range"}
            value={quantity}
            onChange={(e) => {
              setQuantity((quantity) => e.target.value);
            }}
            valueLabelDisplay="auto"
          />
        </div>
        <TextField
          label="Minimum price"
          type="number"
          onChange={(e) => setPrice((price) => e.target.value)}
        ></TextField>
        <div>
          <Label>Duration</Label>
          <MSlider
            getAriaLabel={() => "Temperature range"}
            value={duration}
            max={12}
            onChange={(e) => {
              setDuration((duration) => e.target.value);
            }}
            valueLabelDisplay="auto"
          />
        </div>
        <TextField
          label="preference"
          onChange={(e) => setPreference((preference) => e.target.value)}
        ></TextField>
      </StyledDiv>
      <StyledDiv>
        {(isLoading || isPending || isFetching) && (
          <>
            <Skeleton variant="rectangular" height={160} />
            <Skeleton variant="rectangular" height={160} />
            <Skeleton variant="rectangular" height={160} />
            <Skeleton variant="rectangular" height={160} />
            <Skeleton variant="rectangular" height={160} />
            <Skeleton variant="rectangular" height={160} />
          </>
        )}

        {!isPending &&
          !isLoading &&
          !isFetching &&
          data?.result?.map((requirement) => (
            <DemandCard key={requirement.id} data={requirement}></DemandCard>
          ))}
      </StyledDiv>
      <FlexIt>
        {page > 0 && (
          <SimpleButton
            onClick={(e) => {
              handleType("prev");
              setPage((page) => page - 1);
            }}
          >
            &larr;Previous{" "}
          </SimpleButton>
        )}
        {data?.cursors?.hasMore && (
          <SimpleButton
            onClick={(e) => {
              handleType("next");
              setPage((page) => page + 1);
            }}
          >
            Next &rarr;
          </SimpleButton>
        )}
      </FlexIt>
    </StyleSearch>
  );
}

export default SearchDemand;
