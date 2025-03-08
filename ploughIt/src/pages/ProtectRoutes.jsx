import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosApi";
import { useDispatch } from "react-redux";
import { logIn } from "./userSlice";
const API_URL = import.meta.env.VITE_BACKEND_URL;

export const ProtectRoutes = ({ children }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const verify = async function (getToken) {
      await api
        .get(`${API_URL}/signin/verify/protect`, {
          headers: { token: getToken },
        })
        .then((response) => {
          console.log(response);
          if (response.data.message === "verified") {
            console.log(response.data.user);
            // dispatch(logIn(response.data.user));
            setIsAuth(true);
          } else {
            setIsAuth(false);
            navigate("/login");
          }
        })
        .catch((error) => {
          setIsAuth(false);
          navigate("/login");
        });
    };
    verify(localStorage.getItem("jwt"));
  }, []);
  if (!isAuth) {
    navigate("/login");
    return null;
  } else {
    return children;
  }
};

export default ProtectRoutes;
