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
import Login from "./pages/login";
import Modal from "./ui/Modal";
// import { ProtectRoutes } from "./pages/ProtectRoutes";
import NotFound from "./pages/NotFound";
import ProtectRoutes from "./pages/ProtectRoutes";
import RedirectPage from "./pages/RedirectPage";
import { Provider } from "react-redux";
import store from "./pages/store";
function App() {
  const queryClient = new QueryClient({ staleTime: Infinity });
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route element={<RedirectPage></RedirectPage>} path="/"></Route>
            <Route element={<Login></Login>} path="/login"></Route>
            {/* </Routes>

        <Routes> */}
            <Route
              path="/home"
              element={
                <ProtectRoutes>
                  <AppLayout></AppLayout>
                </ProtectRoutes>
              }
            >
              <Route path="dashboard" element={<Dashboard />}></Route>
              <Route path="settings" element={<Settings />}></Route>
              <Route path="createParcel" element={<UploadDemand />}></Route>
              <Route path="lease" element={<Lease></Lease>}></Route>
              <Route
                path="search"
                element={<SearchDemand></SearchDemand>}
              ></Route>
              <Route element={<NotFound></NotFound>} path="*"></Route>
            </Route>
            <Route element={<Modal></Modal>} path="/modal"></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  );
}

export default App;
