import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCheckAuth from "../services/checkAuth";
export const ProtectRoutes = ({ children }) => {
  // return children;
  const navigate = useNavigate();
  console.log(2);
  let isauth = false;
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const a = async function () {
      await axios
        .get("http://localhost:3000/signin/verify", {
          headers: { token: getToken },
        })
        .then((response) => {
          console.log(response);
          if (response.data.email) {
            isauth = true;
            setIsAuth(true);
            return;
          } else {
            setIsAuth(false);
            isauth = false;
            navigate("/login");
            return null;
          }
        })
        .catch((error) => {
          setIsAuth(false);

          isauth = false;
          navigate("/login");
          return;
        });
    };
    a();
  }, []);
  const getToken = localStorage.getItem("jwt");
  if (!getToken) {
    navigate("/login");
    return null;
  }
  console.log(1);

  console.log(isAuth);
  if (isAuth) {
    return children;
  } else {
    navigate("/login");
    return null;
  }
  // return null;
  // if (getToken) return <div>{children}</div>;
};

export default ProtectRoutes;
