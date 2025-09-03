import React from "react";

const StatsCard = ({ icon, title, value, color, darkMode }) => (
  <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-xl p-3 shadow-sm border`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{title}</p>
        <p className={`text-lg font-bold ${color}`}>{value}</p>
      </div>
      <div className="p-2 rounded-full bg-white/10">{icon}</div>
    </div>
  </div>
);

export default StatsCard;