import React from "react";
import { compose, configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
// import { composeWithDevTools } from "redux-devtools-extension";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage by default
const persistConfig = {
  key: "user",
  storage, // This will persist state in localStorage
  whiteList: ["user"],
};
const persistedReducer = persistReducer(persistConfig, userReducer);
const store = configureStore(
  {
    reducer: {
      user: persistedReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false, // Disable serializable check for redux-persist
      }),
  },
  // ,composeWithDevTools()
);
/*
const store = configureStore({
  reducer: {
    user: persistedUserReducer, // Use the persisted reducer here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Required for redux-persist compatibility
    }),
}); 
*/
export const persistor = persistStore(store);
export default store;
