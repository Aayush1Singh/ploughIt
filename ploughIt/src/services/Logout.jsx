import React from "react";
import api from "./axiosApi";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_BACKEND_URL;
function Logout() {
  const navigate = useNavigate();
  async function logoutUser() {
    try {
      await api.post(`${API_URL}/logout`); // Optional, see Step 3
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("accessToken");
      navigate("/login"); // Redirect to login page
    }
  }

  return (
    <button
      className="hover: border-b-orange-600 hover:bg-red-500"
      onClick={() => {
        logoutUser();
      }}
    >
      Logout
    </button>
  );
}

export default Logout;
