import React from "react";
import { compose, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import { composeWithDevTools } from "redux-devtools-extension";

const store = configureStore(
  {
    reducer: {
      user: userReducer,
    },
  },
  composeWithDevTools()
);
export default store;
