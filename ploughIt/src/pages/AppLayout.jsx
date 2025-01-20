import Button from "@mui/material/Button";
import { Link, NavLink, Outlet } from "react-router-dom";
import styled from "styled-components";
import MainNav from "../ui/MainNav";
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
  grid-template-columns: 0.2fr 1fr;
  grid-template-rows: 5rem 1fr;
  height: 100dvh;
  overflow: hidden;
  margin: 0 0;
  padding: 10px;
`;
const Header = styled.div`
  grid-column: 2;
  grid-row: 1;
  display: flex;
  width: 100%;
  justify-content: right;
  margin: 0 0.5rem;
`;
const Body = styled.div`
  grid-column: 2;
  grid-row: 2;
`;
const SideBar = styled.div`
  grid-row: 1/-1;
  grid-column: 1;
`;
function AppLayout() {
  return (
    <StyledGrid>
      <SideBar>
        <NavLink to="/home/search">hello helo</NavLink>
      </SideBar>
      <Header>
        <MainNav></MainNav>
      </Header>
      <Body>
        <Outlet />
      </Body>
      {/* <MainNav></MainNav> */}
    </StyledGrid>
  );
}

export default AppLayout;
