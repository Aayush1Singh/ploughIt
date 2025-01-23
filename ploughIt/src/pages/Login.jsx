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
  const navigate = useNavigate();
  const { errors } = formState;
  const [role, setRole] = useState("farmer");
  const [isAuth, setAuth] = useState(false);
  const [token, setToken] = useState(null);
  function onSubmit(data) {
    const login = async function (data) {
      api
        .get("http://localhost:3000/signin", {
          headers: data,
          withCredentials: true,
        })
        .then((response) => {
          console.log("hello");
          // if (error) {
          //   console.log("hello");
          //   return;
          // }
          console.log(response);
          localStorage.setItem("jwt", response.data.accessToken);
          setToken(response.data.accessToken);
          dispatch(
            logIn({ email: data.email, role: data.role, id: response.data.id })
          );
          navigate("/home/dashboard");
        })
        .catch((error) => {
          //toast failed login  error msg
          console.log(error);
        });
    };
    login(data);
  }

  function onError(err) {
    //toast validation error
    console.log(err);
  }
  // useLayoutEffect(() => {
  //   const authInterceptor = axios.interceptors.request.use((config) => {
  //     config.headers.Authorization =
  //       !config._retry && token
  //         ? `Bearer ${token}`
  //         : config.headers.Authorization;
  //     return config;
  //   });
  //   return () => {
  //     axios.interceptors.request.eject(authInterceptor);
  //   };
  // }, [token]);
  // useLayoutEffect(() => {
  //   const refreshInterceptor = axios.interceptors.response.use(
  //     (response) => response,
  //     (error) => {
  //       const originalRequest = error.config;
  //       console.log(error);
  //       if (
  //         error.response.status == 400 &&
  //         error.response.message === "Expired"
  //       ) {
  //         try {
  //           const token = axios
  //             .get("http://localhost:3000/refresh", {
  //               withCredentials: true,
  //             })
  //             .then((response) => {
  //               console.log(response);
  //               localStorage.setItem("jwt", response.data.accessToken);
  //               setToken(response.data.accessToken);
  //               navigate("/home/dashboard");
  //             });
  //           //generate new token
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }
  //       return error;
  //     }
  //   );
  //   return () => {
  //     axios.interceptors.response.eject(refreshInterceptor);
  //   };
  // }, [token]);
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
