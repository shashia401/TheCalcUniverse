import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Calendar } from "lucide-react";

function countBusinessDays(start: string, end: string) {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) return null;
  let count = 0;
  let current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) count++; // Exclude Sunday (0) and Saturday (6)
    current.setDate(current.getDate() + 1);
  }
  return count;
}

const BusinessDaysCalculator: React.FC = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const businessDays = countBusinessDays(start, end);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/date-time-calculators" className="hover:text-blue-600 transition-colors">Date & Time Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Business Days Calculator</span>
      </nav>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Calendar className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Business Days Calculator</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input type="date" value={start} onChange={e => setStart(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input type="date" value={end} onChange={e => setEnd(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        {start && end && businessDays !== null ? (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Days</h3>
            <div className="text-3xl font-bold text-blue-600">{businessDays}</div>
          </div>
        ) : (start && end) ? (
          <div className="text-red-600 mt-4">Please enter valid dates (start before end).</div>
        ) : null}
      </div>
    </div>
  );
};

export default BusinessDaysCalculator;