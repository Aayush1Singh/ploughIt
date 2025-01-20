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
async function filtering(response, data1, data2) {
  console.log(response);
  const x = await response.in("preference", "organic");

  console.log(x);
  if (data2.length == 0) return response;
  return await response.in(data1, data2);
}
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
  console.log(
    crop,
    variety,
    price,
    quantity,
    preference,
    cursors,
    duration,
    type
  );
  let data = {};

  console.log(
    `http://localhost:3000/demand/search${type === "" ? "" : `/${type}`}`
  );
  await axios
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
      console.log(response.data);
      data = response.data;
      return response;
    })
    .catch((err) => console.log(err));
  console.log(data);
  return data;
  // let { data, error, isLoading } = await supabase
  //   .from("demand")
  //   .select()
  //   .in("crop", crop)
  //   .in("variety", variety)
  //   .eq("preference", preference)
  //   .gte("duration", duration[0])
  //   .lte("duration", duration[1])
  //   .gte("price", price)
  //   .gte("quantity", quantity[0])
  //   .lte("quantity", quantity[1])
  //   .limit(6);
  // return data;
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
      // queryClient.invalidateQueries(["searchResults"]);
      toggleLoading();
      console.log(isPending, isLoading);
      const debounce = setTimeout(() => {
        queryClient.invalidateQueries(["searchResults"]);
        console.log(isPending);
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
  console.log(data);
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
              console.log(queryClient.getQueriesData("searchResults"));
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
              console.log(queryClient.getQueryData(["searchResults"]));
            }}
          >
            Next &rarr;
          </SimpleButton>
        )}
      </FlexIt>
    </StyleSearch>
  );
  // return (
  //   <OuterWrap onSubmit={handleSubmit(onSubmit)}>
  //     <StyledDiv>
  //       {" "}
  //       <Autocomplete
  //         id="crop"
  //         freeSolo
  //         multiple
  //         options={top100Films.map((option) => option)}
  //         renderInput={(params) => <TextField {...params} label="Crop" />}
  //         {...register("crop")}
  //       />{" "}
  //       <Autocomplete
  //         id="variety"
  //         freeSolo
  //         multiple
  //         options={top100Films.map((option) => option)}
  //         renderInput={(params) => <TextField {...params} label="Variety" />}
  //       />{" "}
  // <div>
  //   <Label>Quantity</Label>
  //   <Slider
  //     getAriaLabel={() => "Temperature range"}
  //     value={range}
  //     onChange={(e) => {
  //       setRange(e.target.value);
  //     }}
  //     valueLabelDisplay="auto"
  //   />
  // </div>
  //       <Autocomplete
  //         id="price"
  //         freeSolo
  //         multiple
  //         options={top100Films.map((option) => option)}
  //         renderInput={(params) => (
  //           <TextField {...params} label="Estimated Buy Price" />
  //         )}
  //       />
  //       <Autocomplete
  //         id="duration"
  //         freeSolo
  //         multiple
  //         options={top100Films.map((option) => option)}
  //         renderInput={(params) => {
  //           console.log(params);
  //           return <TextField {...params} label="Duration" />;
  //         }}
  //       />
  //       <Autocomplete
  //         id="preference"
  //         freeSolo
  //         multiple
  //         options={top100Films.map((option) => option)}
  //         renderInput={(params) => <TextField {...params} label="preference" />}
  //       />{" "}
  //     </StyledDiv>
  //     <button type="submit"></button>
  //     <DemandCard data={cropDetails} />
  //   </OuterWrap>
}

export default SearchDemand;
