import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function useCheckAuth() {
  let isauth = false;
  const navigate = useNavigate();
  const getToken = localStorage.getItem("jwt");
  if (!getToken) {
    navigate("/login");
    // return null;
  }
  console.log(1);
  const a = async function () {
    await axios
      .get("http://localhost:3000/signin/verify", {
        headers: { token: getToken },
      })
      .then((response) => {
        console.log(response);
        if (response.data.email) {
          isauth = true;
          // return true;
        } else {
          // setIsAuth(false);
          isauth = false;
          // return false;
        }
      })
      .catch((error) => {
        isauth = false;
        // return false;
      });
  };

  a();

  return { isauth };
}

export default useCheckAuth;
