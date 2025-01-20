import React from "react";
import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  email: "",
  id: -1,
  role: "",
};
export const userDetails = createSlice({
  name: "user",
  initialState,
  reducers: {
    logIn: (state, action) => {
      state.email = action.payload.email;
      state.id = action.payload.id;
      state.role = action.payload.role;
      return state;
    },
    logOut: (state, action) => {
      return {};
    },
    updateUser: (state, action) => {},
  },
});
console.log(userDetails.actions);
export const { logIn } = userDetails.actions;
export default userDetails.reducer;
