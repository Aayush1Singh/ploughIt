import axios from "axios";
import { useEffect, useState } from "react";
import { logIn } from "../pages/userSlice";
import { useDispatch } from "react-redux";
const API_URL = import.meta.env.BACKEND_URL;

function useUserRole() {
  const dispatch = useDispatch();
  const [a, seta] = useState({});
  async function updateA(data) {
    await seta((a) => {
      return data;
    });
  }
  useEffect(() => {
    async function a2() {
      await axios
        .get(`${API_URL}/signin/verify`, {
          headers: { token: localStorage.getItem("jwt") },
        })
        .then((response) => {
          console.log(response.data, "kkkkkkkkkkkkkkkkkkkkkkkkkk");

          updateA(response.data);
          dispatch(logIn(response.data));
          console.log(a, "lllllllllllllllllllllllll");
          console.log(a);
          // return response.data;
        });
    }
    a2();
  }, []);

  return { a, seta };
}

export default useUserRole;
