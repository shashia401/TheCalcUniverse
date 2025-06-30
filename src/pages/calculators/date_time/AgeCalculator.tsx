import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Calendar } from "lucide-react";

function calculateAge(birthDateStr: string, refDateStr: string) {
  if (!birthDateStr) return null;
  const birthDate = new Date(birthDateStr);
  const refDate = refDateStr ? new Date(refDateStr) : new Date();
  if (isNaN(birthDate.getTime()) || isNaN(refDate.getTime()) || birthDate > refDate) return null;

  let years = refDate.getFullYear() - birthDate.getFullYear();
  let months = refDate.getMonth() - birthDate.getMonth();
  let days = refDate.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const prevMonth = new Date(refDate.getFullYear(), refDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  return { years, months, days };
}

const AgeCalculator: React.FC = () => {
  const [birthDate, setBirthDate] = useState("");
  const [refDate, setRefDate] = useState("");
  const age = calculateAge(birthDate, refDate);

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
        <span className="text-gray-900 font-medium">Age Calculator</span>
      </nav>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Calendar className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Age Calculator</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reference Date (optional)</label>
            <input type="date" value={refDate} onChange={e => setRefDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        {birthDate && age ? (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Age</h3>
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {age.years} years, {age.months} months, {age.days} days
            </div>
          </div>
        ) : birthDate ? (
          <div className="text-red-600 mt-4">Please enter a valid date of birth.</div>
        ) : null}
      </div>
    </div>
  );
};

export default AgeCalculator; 