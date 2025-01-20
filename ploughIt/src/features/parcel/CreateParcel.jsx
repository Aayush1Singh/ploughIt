import { styled } from "styled-components";
import { Button, TextField } from "@mui/material";
import "@fontsource-variable/libre-franklin";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import { Form, FormRow, GreenButton, LocationDiv } from "../../ui/FormRow";

function CreateParcel() {
  const { register, required, reset, isLoading, handleSubmit } = useForm();
  function onSubmit(data) {
    console.log(data);
  }
  function onError() {}
  function getLocation() {}
  return (
    <Form onSubmit={handleSubmit(onSubmit, onError)}>
      <FormRow content={"Upload Your Land"}></FormRow>
      <FormRow content="landID">
        <TextField id="outlined-basic" label={"landID"} variant="outlined" />
      </FormRow>
      <FormRow content={"LandArea"}>
        <TextField
          id="outlined-basic"
          label={"landArea"}
          variant="outlined"
          {...register("landArea", { required, min: 10 })}
          // inputRef={register}
        />
      </FormRow>
      <FormRow content={"location"}>
        <LocationDiv>
          <TextField
            id="outlined-basic"
            label={"Location"}
            variant="outlined"
            {...register("Location", { required, min: 10 })}
          ></TextField>
          <GreenButton size="small" variant="contained" onClick={getLocation}>
            📍
          </GreenButton>
        </LocationDiv>
      </FormRow>
      <FormRow>
        <GreenButton size="large">Submit</GreenButton>
      </FormRow>
    </Form>
  );
}

export default CreateParcel;
/*...register("", { required, min: 10, max: 10 }) */
