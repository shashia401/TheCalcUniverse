import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Clock } from "lucide-react";

function getDuration(start: string, end: string) {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()) || startDate > endDate) return null;
  let ms = endDate.getTime() - startDate.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(ms / (1000 * 60));
  ms -= minutes * (1000 * 60);
  const seconds = Math.floor(ms / 1000);
  return { days, hours, minutes, seconds };
}

const TimeDurationCalculator: React.FC = () => {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const duration = getDuration(start, end);

  return (
    <div className="max-w-2xl mx-auto p-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/date-time-calculators" className="hover:text-blue-600 transition-colors">Date & Time Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Time Duration Calculator</span>
      </nav>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Clock className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Time Duration Calculator</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time</label>
            <input type="datetime-local" value={start} onChange={e => setStart(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date & Time</label>
            <input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        {start && end && duration ? (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Duration</h3>
            <div className="text-3xl font-bold text-blue-600">
              {duration.days} days, {duration.hours} hours, {duration.minutes} minutes, {duration.seconds} seconds
            </div>
          </div>
        ) : (start && end) ? (
          <div className="text-red-600 mt-4">Please enter valid start and end date/time.</div>
        ) : null}
      </div>
    </div>
  );
};

export default TimeDurationCalculator;