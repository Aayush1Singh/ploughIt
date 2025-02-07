import { PureComponent, useState } from "react";
import {
  PieChart,
  Pie,
  Sector,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import renderActiveShape from "./renderActiveShape"; // import your custom active shape renderer
// const data = [
//   { name: "Group A", value: 400 },
//   { name: "Group B", value: 300 },
//   { name: "Group C", value: 300 },
//   { name: "Group D", value: 200 },
// ];
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p></p>
        {payload[0].name}: ₹{payload[0].value}
      </div>
    );
  }
};

export function Visual({ data }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };
  if (!data) return null;
  console.log(data);
  return (
    <ResponsiveContainer>
      <PieChart
        width="100%"
        height="100%"

        //onMouseEnter={this.onPeEnter}
      >
        <Pie
          data={data}
          cx={"50%"}
          cy={"50%"}
          innerRadius={100}
          outerRadius={120}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
          onMouseEnter={onPieEnter}
          onMouseLeave={() => setActiveIndex(null)}
          activeIndex={activeIndex}
          activeShape={renderActiveShape}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              className="transition-all"
            />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}
