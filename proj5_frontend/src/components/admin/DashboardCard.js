import React from "react";
import CountUp from "react-countup"; // Importa o CountUp para animação de contagem

function DashboardCard({ title, value }) {
  const displayValue =
    value === null || value === undefined || (typeof value === "number" && isNaN(value))
      ? "N/A"
      : value;

  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center hover:scale-105 transform transition-transform duration-300">

      <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600">
        {typeof value === "number" ? <CountUp end={value} duration={1.5} /> : value}
      </p>
    </div>
  );
}

export default DashboardCard;
