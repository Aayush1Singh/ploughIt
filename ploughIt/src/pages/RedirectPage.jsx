import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosApi";
const API_URL = import.meta.env.VITE_BACKEND_URL;

function RedirectPage() {
  const navigate = useNavigate();
  console.log(localStorage.getItem("jwt"));
  const a = async function () {
    await api
      .get(`${API_URL}/signin/verify/protect`, {
        headers: { token: localStorage.getItem("jwt") },
      })
      .then((response) => {
        console.log(response);
        if (response.data) {
          console.log(response);
          navigate("/home/dashboard");
        } else {
          console.log(response.data, "kkk");
          navigate("/login");
        }
      })
      .catch((err) => {
        navigate("/login");
        console.log(err);
      });
  };
  a();
  return null;
}

export default RedirectPage;
