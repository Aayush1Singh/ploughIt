import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";

function RedirectPage() {
  const navigate = useNavigate();
  console.log(localStorage.getItem("jwt"));
  axios
    .get("http://localhost:3000/signin/verify", {
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
  return null;
}

export default RedirectPage;
