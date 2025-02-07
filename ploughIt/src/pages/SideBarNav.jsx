import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

function SideBarNav() {
  const { role } = useSelector((state) => state.user);
  const styles = "rounded-full  hover:bg-green-500 w-full p-2 ease-in-out";
  return (
    <div className="flex w-full flex-col gap-3">
      {role == "farmer" && (
        <NavLink to="/home/search" className={styles}>
          Search Demands
        </NavLink>
      )}

      {role == "contractor" && (
        <NavLink
          to="/home/uploadDemand"
          className={styles}
          // className={({ isActive, isPending }) =>
          //   isPending ? "pending" : isActive ? "active" : ""
          // }
        >{`Create Demand`}</NavLink>
      )}
      {role == "contractor" && (
        <NavLink to="/home/proposals/all" className={styles}>
          {" "}
          Proposals
        </NavLink>
      )}
      {
        <NavLink to="/home/settings" className={styles}>
          Settings
        </NavLink>
      }
      {role == "contractor" && (
        <NavLink to="/home/bid" className={styles}>
          Bid
        </NavLink>
      )}
      <NavLink to="/home/dashboard" className={styles}>
        Dashboard
      </NavLink>
    </div>
  );
}

export default SideBarNav;
