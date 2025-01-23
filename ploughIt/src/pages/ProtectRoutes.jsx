import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/axiosApi";
import { useDispatch } from "react-redux";
import { logIn } from "./userSlice";
export const ProtectRoutes = ({ children }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    const verify = async function (getToken) {
      await api
        .get("http://localhost:3000/signin/verify/protect", {
          headers: { token: getToken },
        })
        .then((response) => {
          console.log(response);
          if (response.data.message === "verified") {
            dispatch(logIn(response.data.user));
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
