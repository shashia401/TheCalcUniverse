import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Clock } from "lucide-react";

function getCountdown(target: string) {
  if (!target) return null;
  const targetDate = new Date(target);
  const now = new Date();
  if (isNaN(targetDate.getTime()) || targetDate <= now) return null;
  let ms = targetDate.getTime() - now.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  ms -= days * (1000 * 60 * 60 * 24);
  const hours = Math.floor(ms / (1000 * 60 * 60));
  ms -= hours * (1000 * 60 * 60);
  const minutes = Math.floor(ms / (1000 * 60));
  ms -= minutes * (1000 * 60);
  const seconds = Math.floor(ms / 1000);
  return { days, hours, minutes, seconds };
}

const CountdownCalculator: React.FC = () => {
  const [target, setTarget] = useState("");
  const [countdown, setCountdown] = useState<any>(null);

  useEffect(() => {
    if (!target) return;
    const interval = setInterval(() => {
      setCountdown(getCountdown(target));
    }, 1000);
    return () => clearInterval(interval);
  }, [target]);

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
        <span className="text-gray-900 font-medium">Countdown Calculator</span>
      </nav>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Clock className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Countdown Calculator</h1>
        </div>
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Target Date & Time</label>
          <input type="datetime-local" value={target} onChange={e => setTarget(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
        </div>
        {target && countdown ? (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Remaining</h3>
            <div className="text-3xl font-bold text-blue-600">
              {countdown.days} days, {countdown.hours} hours, {countdown.minutes} minutes, {countdown.seconds} seconds
            </div>
          </div>
        ) : (target && !countdown) ? (
          <div className="text-red-600 mt-4">Please enter a future date/time.</div>
        ) : null}
      </div>
    </div>
  );
};

export default CountdownCalculator;