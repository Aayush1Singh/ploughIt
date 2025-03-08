import React, { useState } from "react";
import { FormRow, Form, GreenButton } from "../../ui/FormRow";
import { useForm } from "react-hook-form";
import { InputLabel, MenuItem, TextField } from "@mui/material";
import { MFormControl, MSlider } from "../makeContract/UploadDemad";
import styled from "styled-components";
import axios from "axios";
import api from "../../services/axiosApi";
import toast from "react-hot-toast";
/*price quantity description preference duration */
const Select = styled.select`
  height: 3rem;
  width: 11.5rem;
  border-radius: 5px;
`;
const StyledForm = styled(Form)`
  gap: 2rem;
`;
function UpdateDemand({ data, id, updateTempData, setUpdateDisplay }) {
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;

  console.log(errors);
  const [preference, setPreference] = useState(data.preference);

  function onSubmit(data2) {
    data2.crop = data.crop;
    data2.variety = data.variety;
    data2.contractorID = id;
    console.log({ ...data, ...data2 });
    if (updateTempData) updateTempData({ ...data, ...data2 });
    api
      .get("http://localhost:3000/update", {
        headers: { data: JSON.stringify({ ...data, ...data2 }) },
      })
      .then((response) => {
        toast.success("Updated Successfully");
        console.log(response);
      })
      .catch((err) => {
        toast.error("Could not update");
        console.log(err);
      });
    console.log("hellllllllllllllllllllllllllll");
    setUpdateDisplay(false);
    // set req to update on backend;
  }
  return (
    <StyledForm onSubmit={handleSubmit(onSubmit)}>
      <FormRow content="Quantity">
        <TextField
          size="small"
          defaultValue={data.quantity}
          id="outlined-basic"
          label={"Quantity"}
          variant="outlined"
          {...register("quantity", {
            required: "this field is required",
            min: 1,
            valueAsNumber: true,
            validate: (value, formValues) => !isNaN(Number(value)),
          })}
          // error={!!errors?.quantity}
          helperText={errors?.quantity?.message}
        />
      </FormRow>
      <FormRow content="Estimated buy Price">
        <TextField
          size="small"
          defaultValue={data.price}
          id="outlined-basic"
          label={"price"}
          variant="outlined"
          {...register("price", {
            required: "this field is required",
            min: 1,
            valueAsNumber: true,
            validate: (value, formValues) => !isNaN(Number(value)),
          })}
          // error={!!errors?.price}
          helperText={errors?.price?.message}
        />
      </FormRow>
      <FormRow content="Duration">
        <MSlider
          defaultValue={data.duration}
          aria-label="Default"
          valueLabelDisplay="auto"
          max={12}
          step={1}
          marks
          type="number"
          {...register("duration", {
            required: "this field is required",
            min: 1,
            valueAsNumber: true,
          })}
          // error={!!errors?.duration}
          helperText={errors?.duration?.message}
        />
      </FormRow>
      <FormRow content={"Preference"}>
        {/* <MFormControl> */}
        {/* <InputLabel id="demo-simple-select-label">Preference</InputLabel> */}
        <Select
          name="preference"
          {...register("preference", {
            required: "this field is required",
            min: 1,
          })}
        >
          <option value="none">None</option>
          <option value="organic">Organic</option>
          <option value="no pesticides">No Pesticides</option>
        </Select>
      </FormRow>
      <FormRow content="other-description">
        <TextField
          size="small"
          defaultValue={data.description}
          id="outlined-textarea"
          label="Multiline Placeholder"
          placeholder="Placeholder"
          multiline
          {...register("description", {
            required: "this field is required",
            min: 1,
          })}
          // error={!!errors?.description}
          helperText={errors?.description?.message}
        />
      </FormRow>{" "}
      <FormRow>
        <GreenButton type="submit" size="large">
          Update
        </GreenButton>
      </FormRow>
    </StyledForm>
  );
}

export default UpdateDemand;
