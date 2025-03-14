import React from "react";
import { useLocation } from "react-router-dom";

function ShowSummary() {
  const { state } = useLocation();

  console.log(state);

  return <div>showSummary</div>;
}

export default ShowSummary;
