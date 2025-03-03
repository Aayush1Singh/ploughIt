import React, { useState } from "react";
import { Form, FormRow, GreenButton } from "../../ui/FormRow";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import Slider from "@mui/material/Slider";
import styled from "styled-components";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../../database/supabase";
import axios from "axios";
import { useSelector } from "react-redux";
import api from "../../services/axiosApi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export const MSlider = styled(Slider)`
  margin-left: 10rem;
  color: green;
`;
export const MFormControl = styled(FormControl)`
  width: 13rem;
`;
async function uploadDemand(data) {
  console.log("heelo2");
  console.log(data);
  api
    .get("http://localhost:3000/demand/insert", { headers: data })
    .then((response) => {
      console.log(response.data);
    })
    .catch((err) => console.log(err));
  // if (error) throw new Error(error.message);
}
function UploadDemand() {
  const { id, role } = useSelector((state) => state.user);
  const queryClient = useQueryClient();
  const [preference, setPreference] = useState("none");
  const { register, handleSubmit, formState } = useForm();
  const navigate = useNavigate();
  const { errors } = formState;
  console.log(!!errors.variety);
  const { mutate, isLoading } = useMutation({
    mutationFn: uploadDemand,
    onSuccess: () => {
      queryClient.invalidateQueries(["demands", { id, role }]);
      toast.success("Demand Created");
      navigate("/home/dashboard");
    },
    onError: (error) => toast.error(error.message),
  });
  function onSubmit(data) {
    console.log(data);
    mutate(data);
  }
  function onError(e) {
    console.log(errors);
    console.log(e);
  }

  const handleChange = (event) => {
    setPreference(event.target.value);
  };
  return (
    <>
      <p className="text-6xl">Create Demand</p>

      <Form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <FormRow content="Crop">
          <TextField
            id="outlined-basic"
            label={"crop"}
            variant="outlined"
            {...register("crop", {
              required: "this field is required",
              min: 1,
            })}
          />
        </FormRow>
        <FormRow content="Variety">
          <TextField
            id="outlined-basic"
            label={"variety"}
            variant="outlined"
            {...register("variety", {
              required: "this field is required",
              min: 1,
            })}
            error={!!errors.variety}
            helperText={errors?.variety?.message}
          />
        </FormRow>
        <FormRow content="Quantity">
          <TextField
            id="outlined-basic"
            label={"Quantity"}
            variant="outlined"
            {...register("quantity", {
              required: "this field is required",
              min: 1,
              valueAsNumber: true,
              validate: (value, formValues) => !isNaN(Number(value)),
            })}
            error={!!errors.quantity}
            helperText={errors?.quantity?.message}
          />
        </FormRow>
        <FormRow content="Estimated buy Price">
          <TextField
            id="outlined-basic"
            label={"price"}
            variant="outlined"
            {...register("price", {
              required: "this field is required",
              min: 1,
              valueAsNumber: true,
              validate: (value, formValues) => !isNaN(Number(value)),
            })}
            error={!!errors.price}
            helperText={errors?.price?.message}
          />
        </FormRow>

        <FormRow content="Duration">
          <MSlider
            defaultValue={50}
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
            error={!!errors.duration}
            helperText={errors?.duration?.message}
          />
        </FormRow>
        <FormRow content={"Preference"}>
          <MFormControl>
            <InputLabel id="demo-simple-select-label">Preference</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Preference"
              defaultValue="none"
              onChange={(e) => {
                setPreference(e.target.value);
              }}
              {...register("preference", {
                required: "this field is required",
                min: 1,
              })}
              error={!!errors.preference}
              helpertext={errors?.preference?.message}
            >
              <MenuItem value={"none"}>None</MenuItem>
              <MenuItem value={"organic"}>Organic</MenuItem>
              <MenuItem value={"no pesticides"}>No pesticides</MenuItem>
            </Select>
          </MFormControl>
        </FormRow>
        <FormRow content="other-description">
          <TextField
            id="outlined-textarea"
            label="Multiline Placeholder"
            placeholder="Placeholder"
            multiline
            {...register("description", {
              required: "this field is required",
              min: 1,
            })}
            error={!!errors.description}
            helperText={errors?.description?.message}
          />
        </FormRow>
        <FormRow>
          <GreenButton type="submit">Submit</GreenButton>
        </FormRow>
        <input type="hidden" defaultValue={id} {...register("id")}></input>
      </Form>
    </>
  );
}

export default UploadDemand;
