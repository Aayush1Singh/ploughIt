import React, { useEffect, useLayoutEffect, useState } from "react";
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
import api from "../services/axiosApi";
import Loader from "../ui/Loader";
import toast from "react-hot-toast";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
const Background = styled.div`
  width: 100%;
  height: 97vh;
  display: grid;
  align-items: center;
  justify-content: center;
`;
const API_URL = import.meta.env.VITE_BACKEND_URL;
console.log(API_URL);
function Login() {
  const dispatch = useDispatch();
  const QueryClient = useQueryClient();
  const { register, formState, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { errors } = formState;
  const [role, setRole] = useState("farmer");
  const [isAuth, setAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [formData, setFormData] = useState({});
  const login = async function ({ queryKey }) {
    const data = queryKey[1];
    const data1 = await api.get(`${API_URL}/signin`, {
      headers: data,
      withCredentials: true,
    });
    console.log(data1);
    return data1;
  };
  const {
    data: result,
    isLoading,
    refetch,
  } = useQuery({
    queryFn: login,
    queryKey: ["login", formData],
    enabled: !!formData.email,
    onSuccess: (data) => {
      console.log(data);
      localStorage.setItem("jwt", data.accessToken);
      setToken(data.accessToken);
      dispatch(logIn({ email: data.email, role: data.role, id: data.id }));
      navigate("/home/dashboard");
      toast.success("Logged In Successfully");
    },
    staleTime: Infinity,
  });
  function onSubmit(data) {
    console.log(data);
    const queryState = QueryClient.getQueryState(["login", data]);
    if (
      queryState?.data &&
      queryState.data instanceof Error &&
      queryState.data.message != "Network Error"
    ) {
      toast.error(queryState.data.message);
      return;
    } else {
      if (JSON.stringify(data) === JSON.stringify(formData)) {
        QueryClient.invalidateQueries({ queryKey: ["login", data] });
      } else setFormData(data);
    }
  }
  function onError(err) {
    //toast validation error
    Object.entries(err).map((error) => toast.error(error[1].message));
  }
  useEffect(() => {
    if (!result) return;
    console.log("hello");
    const { data, status } = result;
    if (!data) {
      console.log("k");
      toast.error("UserName/password invalid");
    } else if (status == 200) {
      console.log(data);
      localStorage.setItem("jwt", data.accessToken);
      setToken(data.accessToken);
      dispatch(
        logIn({ email: formData.email, role: formData.role, id: data.id }),
      );
      navigate("/home/dashboard");
      toast.success("Logged In Successfully");
    } else {
      toast.error(data?.message);
    }
  }, [dispatch, navigate, result, isLoading]);
  return (
    <Background className="login-background">
      {/* <Loader></Loader> */}
      <p className="absolute top-0 left-0">
        Test credentials for contractor role:
        <br />
        email: abc@gmail.com
        <br />
        password:helloitsme
        <br />
        <br />
        <br />
        Test credentials for farmer role:
        <br />
        email: abc3@gmail.com
        <br />
        password:helloitsme
        <br />
      </p>
      <Form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="overlay-login-form p-8"
      >
        <FormRow content={"Username/Email"}>
          <TextField
            className="focus: border-red focus:ring-2 focus:outline-none"
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
        <FormRow content={"Password"} className="">
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
