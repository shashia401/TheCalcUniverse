import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Clock } from "lucide-react";

// A small set of common time zones for demo; you can expand as needed
const timeZones = [
  { label: "UTC", value: "UTC" },
  { label: "New York (EST/EDT)", value: "America/New_York" },
  { label: "London (GMT/BST)", value: "Europe/London" },
  { label: "Berlin (CET/CEST)", value: "Europe/Berlin" },
  { label: "Delhi (IST)", value: "Asia/Kolkata" },
  { label: "Tokyo (JST)", value: "Asia/Tokyo" },
  { label: "Sydney (AEST/AEDT)", value: "Australia/Sydney" },
  { label: "Los Angeles (PST/PDT)", value: "America/Los_Angeles" },
];

function convertTime(dateStr: string, timeStr: string, fromTz: string, toTz: string) {
  if (!dateStr || !timeStr || !fromTz || !toTz) return "";
  try {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const date = new Date(dateStr + "T" + timeStr + ":00");
    // Convert to UTC
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: fromTz }));
    // Convert from UTC to target
    const targetDate = new Date(utcDate.toLocaleString("en-US", { timeZone: toTz }));
    return targetDate.toLocaleString("en-US", {
      timeZone: toTz,
      year: "numeric", month: "long", day: "numeric",
      hour: "2-digit", minute: "2-digit", hour12: false
    });
  } catch {
    return "";
  }
}

const TimeZoneConverter: React.FC = () => {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [fromTz, setFromTz] = useState("UTC");
  const [toTz, setToTz] = useState("America/New_York");

  const converted = convertTime(date, time, fromTz, toTz);

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
        <span className="text-gray-900 font-medium">Time Zone Converter</span>
      </nav>
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Clock className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Time Zone Converter</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
            <input type="time" value={time} onChange={e => setTime(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Time Zone</label>
            <select value={fromTz} onChange={e => setFromTz(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {timeZones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Time Zone</label>
            <select value={toTz} onChange={e => setToTz(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              {timeZones.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
            </select>
          </div>
        </div>
        {converted && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Converted Time</h3>
            <div className="text-2xl font-bold text-blue-600">{converted}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeZoneConverter;