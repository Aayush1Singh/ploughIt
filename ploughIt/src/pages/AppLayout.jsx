import Button from "@mui/material/Button";
import { Link, NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import MainNav from "../ui/MainNav";
import SideBarNav from "./SideBarNav";
import { useState, createContext } from "react";
import Loader from "@/ui/Loader";
const StyledButton = styled(Button)`
  &.MuiButton-root {
    background-color: black;
    border-radius: 5px;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 24px;
  }
`;
const StyledGrid = styled.div`
  display: grid;
  box-sizing: border-box;
  grid-template-columns: 0.1fr 1fr;
  grid-template-rows: 5rem 1fr;
  height: 100vh;
  margin: 0 0;
  padding: 0 0;
  padding: 4px;

  /* border: 1px solid red; */
`;
const Header = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  justify-content: right;
`;
const Body = styled.div`
  //setting loader spiiner 100 pc -5px
  padding-left: 5px;
  padding-top: 5px;
  grid-column: 2;
  grid-row: 2;
  height: 100%;
  width: 100%;
  overflow: auto;
  position: relative;
`;
const SideBar = styled.div`
  grid-row: 1/-1;
  grid-column: 1;
  display: flex;
  align-items: center;
`;
const API_URL = import.meta.env.VITE_BACKEND_URL;
export const ThemeContext = createContext(null);

function AppLayout() {
  const [isLoading, setLoader] = useState(false);

  return (
    <StyledGrid>
      <SideBar className="item-center flex bg-gradient-to-b from-green-300 to-white">
        <SideBarNav></SideBarNav>
        {/* <NavLink to="/home/search">Search</NavLink>
        <NavLink to="/login">login</NavLink> */}
      </SideBar>
      <Header className="bg-gradient-to-r from-green-300 to-white">
        <MainNav></MainNav>
      </Header>
      <Body>
        <ThemeContext.Provider value={{ isLoading, setLoader }}>
          {isLoading && <Loader></Loader>}

          <Outlet />
        </ThemeContext.Provider>
      </Body>
      {/* <MainNav></MainNav> */}
    </StyledGrid>
  );
}

export default AppLayout;
