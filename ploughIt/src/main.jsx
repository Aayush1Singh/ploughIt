import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import store, { persistor } from "./pages/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/lib/integration/react.js";
import { StyledEngineProvider } from "@mui/material";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <StyledEngineProvider injectFirst>
      <PersistGate
        loading={<div>Loading...</div>}
        persistor={persistor}
        onBeforeLift={() => {
          console.log("Rehydration complete", store.getState());
        }}
      >
        <App />
      </PersistGate>
    </StyledEngineProvider>
  </Provider>,
);
