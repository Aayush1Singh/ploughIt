import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
export const ProtectRoutes = ({ children }) => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);
  useEffect(() => {
    const verify = async function (getToken) {
      await axios
        .get("http://localhost:3000/signin/verify", {
          headers: { token: getToken },
        })
        .then((response) => {
          if (response.data.bearer) {
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
