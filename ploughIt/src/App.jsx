import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import Settings from "./pages/Settings";
import Dashboard from "./features/Dashboard/Dashboard";
import Lease from "./features/lease/Lease";
import UploadDemand from "./features/makeContract/UploadDemad";
import SearchDemand from "./features/SearchContract/SearchDemand";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./pages/Login";
import Modal from "./ui/Modal";
import OngoingContractDetails from "./features/Dashboard/OngoingContractDetails";
// import { ProtectRoutes } from "./pages/ProtectRoutes";
import NotFound from "./pages/NotFound";
import ProtectRoutes from "./pages/ProtectRoutes";
import RedirectPage from "./pages/RedirectPage";
import { Provider, useSelector } from "react-redux";
import store, { persistor } from "./pages/store";
import DemandDetials from "./features/DemandDetails.jsx/DemandDetials";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "react-hot-toast";
import AllProposalsTable from "./features/Dashboard/Proposals";
function App() {
  const queryClient = new QueryClient();
  const { role } = useSelector((state) => state.user);
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <Toaster></Toaster>
      <BrowserRouter>
        <Routes>
          <Route element={<RedirectPage></RedirectPage>} path="/"></Route>
          <Route element={<Login></Login>} path="/login"></Route>
          <Route
            path="/home"
            element={
              <ProtectRoutes>
                <AppLayout></AppLayout>
              </ProtectRoutes>
            }
          >
            <Route path="dashboard" element={<Dashboard />}></Route>
            <Route
              path="/home/proposals/all"
              element={<AllProposalsTable></AllProposalsTable>}
            ></Route>
            <Route
              path="dashboard/:demandID"
              element={<DemandDetials />}
            ></Route>
            <Route path="settings" element={<Settings />}></Route>
            {role == "contractor" && (
              <Route path="uploadDemand" element={<UploadDemand />}></Route>
            )}

            <Route path="lease" element={<Lease></Lease>}></Route>
            {role == "farmer" && (
              <Route
                path="search"
                element={<SearchDemand></SearchDemand>}
              ></Route>
            )}
            <Route
              path="dashboard/ongoing/:contractID"
              element={<OngoingContractDetails></OngoingContractDetails>}
            ></Route>
            <Route element={<NotFound></NotFound>} path="*"></Route>
          </Route>
          <Route element={<Modal></Modal>} path="/modal"></Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
