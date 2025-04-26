import React from "react";

function DashboardCard({ title, value }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 flex flex-col items-center justify-center">
      <h3 className="text-xl font-semibold text-gray-700 mb-2 text-center">{title}</h3>
      <p className="text-3xl font-bold text-indigo-600">{value}</p>
    </div>
  );
}

export default DashboardCard;
