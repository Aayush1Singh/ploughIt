import React, { useState } from "react";
import { Form, FormRow, GreenButton, Label } from "../ui/FormRow";
import { InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// import useCheckAuth from "../services/checkAuth";
import { useNavigate } from "react-router-dom";
import { MFormControl } from "../features/makeContract/UploadDemad";
import { logIn } from "./userSlice";
const Background = styled.div`
  width: 100%;
  height: 97vh;
  display: grid;
  align-items: center;
  justify-content: center;
`;
function Login() {
  const dispatch = useDispatch();
  const { register, formState, handleSubmit } = useForm();
  const { errors } = formState;
  let auth = false;
  const [isAuth, setAuth] = useState(false);
  // const { isauth } = useCheckAuth();
  const navigate = useNavigate();
  function onSubmit(data) {
    console.log(data);
    const a = async function () {
      console.log(data);
      const myHeaders = new Headers();
      myHeaders.append("1", "2");
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify(data);

      const requestOptions = {
        headers: data,
        body: raw,
        redirect: "follow",
      };

      axios
        .get("http://localhost:3000/signin", requestOptions)
        .then((response, error) => {
          if (error) {
            console.log(response.data);
            return;
          }
          console.log(response, error);
          localStorage.setItem("jwt", response.data.accessToken);
          console.log(response.data.id);
          dispatch(
            logIn({ email: data.email, role: data.role, id: response.data.id })
          );
          auth = true;
          navigate("/home/dashboard");
        })
        .catch((error) => {
          console.error(error);
        });
    };
    a();
  }
  const userF = useSelector((state) => state.user);

  console.log(userF, "popopoplplplplp");

  function onError(err) {
    console.log(err);
  }
  const [role, setRole] = useState("farmer");
  // if (auth) navigate("/dashboard");
  return (
    <Background>
      <Form onSubmit={handleSubmit(onSubmit, onError)}>
        <FormRow content={"Username/Email"}>
          <TextField
            id="username"
            label={"Username/Email"}
            variant="outlined"
            {...register("email", {
              min: 1,
              validate: (value) => {
                return value.includes("@") || "enter a valid email";
              },
            })}
            error={!!errors.email}
            helperText={errors?.email?.message}
          />
        </FormRow>
        <FormRow content={"Password"}>
          {" "}
          <TextField
            id="password"
            type="password"
            label={"password"}
            variant="outlined"
            {...register("password", {
              min: 1,
            })}
            error={!!errors.password}
            helperText={errors?.variety?.password}
          />
        </FormRow>
        <FormRow content={"Sign in as"}>
          <MFormControl>
            <InputLabel id="demo-simple-select-label">Preference</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Role"
              defaultValue="farmer"
              onChange={(e) => {
                setRole(e.target.value);
              }}
              {...register("role", {
                required: "this field is required",
                min: 1,
              })}
              error={!!errors.preference}
              helpertext={errors?.preference?.message}
            >
              <MenuItem value={"contractor"}>Contractor</MenuItem>
              <MenuItem value={"farmer"}>Farmer</MenuItem>
            </Select>
          </MFormControl>
        </FormRow>{" "}
        <FormRow>
          <GreenButton type="submit">Submit</GreenButton>
        </FormRow>
      </Form>
    </Background>
  );
}

export default Login;
