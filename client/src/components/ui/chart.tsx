import React from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export const colors = {
  primary: "#3b82f6", // blue-500
  success: "#10b981", // emerald-500
  danger: "#ef4444",  // red-500
  warning: "#f59e0b", // amber-500
  gray: "#6b7280",    // gray-500
};

export const SimpleLineChart: React.FC<{
  data: any[];
  lines: Array<{ dataKey: string; stroke: string; name: string }>;
  xAxisDataKey: string;
  height?: number;
  unit?: string;
}> = ({ data, lines, xAxisDataKey, height = 400, unit = "" }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisDataKey} />
        <YAxis unit={unit} />
        <Tooltip formatter={(value) => [`${value}${unit}`, ""]} />
        <Legend />
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.stroke}
            name={line.name}
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export const SimpleAreaChart: React.FC<{
  data: any[];
  areas: Array<{ dataKey: string; fill: string; stroke: string; name: string }>;
  xAxisDataKey: string;
  height?: number;
  unit?: string;
}> = ({ data, areas, xAxisDataKey, height = 400, unit = "" }) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={xAxisDataKey} />
        <YAxis unit={unit} />
        <Tooltip formatter={(value) => [`${value}${unit}`, ""]} />
        <Legend />
        {areas.map((area, index) => (
          <Area
            key={index}
            type="monotone"
            dataKey={area.dataKey}
            fill={area.fill}
            stroke={area.stroke}
            name={area.name}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
};