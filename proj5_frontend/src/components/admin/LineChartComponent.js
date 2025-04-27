import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

// Função para formatar a data
const formatDate = (dateValue) => {
  if (Array.isArray(dateValue) && dateValue.length === 3) {
    const [year, month, day] = dateValue;
    return `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}/${year}`;
  }
  if (typeof dateValue === "string") {
    const [year, month, day] = dateValue.split("-");
    return `${day}/${month}/${year}`;
  }
  return "";
};

// Custom Tooltip
const CustomTooltip = ({ active, payload, label, dataKeyLabel }) => {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-white p-2 border border-gray-300 rounded shadow text-sm">
        <p className="font-semibold">{label}</p>
        <p>{`${dataKeyLabel}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

function LineChartComponent({ data, dataKey, dataKeyLabel }) {
  // ➔ Formatar a data ANTES de passar ao LineChart
  const formattedData = data.map(item => ({
    ...item,
    date: formatDate(item.date),
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={formattedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip content={<CustomTooltip dataKeyLabel={dataKeyLabel} />} />
        <Line 
          type="monotone" 
          dataKey={dataKey} 
          stroke="#8884d8"
          isAnimationActive={true}
          animationDuration={1500}
          animationEasing="ease-out"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

export default LineChartComponent;
