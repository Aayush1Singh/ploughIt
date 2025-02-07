import React from "react";
import { Sector } from "recharts";

const renderActiveShape = (props) => {
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;

  return (
    <g>
      {/* Render the highlighted segment */}
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // increase outer radius for highlighting effect
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ transition: "all 2s ease-in-out" }} // Smooth transition
      />
      {/* Optionally, render a label or extra details */}
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#333" fontSize={14}>
        {payload.name}
      </text>
    </g>
  );
};

export default renderActiveShape;
