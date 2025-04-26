import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Função para formatar a data (YYYY-MM-DD ➔ DD/MM/YYYY)
const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label, dataKeyLabel }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
        <p className="font-semibold">{formatDate(label)}</p>
        <p>{`${dataKeyLabel}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

function LineChartComponent({ data, dataKey, dataKeyLabel }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip dataKeyLabel={dataKeyLabel} />} />
        <Line 
  type="monotone" 
  dataKey={dataKey} 
  stroke="#8884d8"
  dot={{ r: 3 }} // Pontos mais visíveis
  isAnimationActive={true}
  animationDuration={1500}
  animationEasing="ease-out"
/>
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;

