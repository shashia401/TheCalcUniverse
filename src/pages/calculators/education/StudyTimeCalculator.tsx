import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const StudyTimeCalculator = () => {
  const [pages, setPages] = useState("");
  const [rate, setRate] = useState("");
  const [sessions, setSessions] = useState("");
  const [result, setResult] = useState<string | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(pages);
    const r = parseFloat(rate);
    const s = parseFloat(sessions) || 1;
    if (!isNaN(p) && !isNaN(r) && r > 0 && s > 0) {
      const totalMinutes = (p / r) * 60;
      const perSession = totalMinutes / s;
      setResult(
        `Total study time: ${Math.round(totalMinutes)} min (${(totalMinutes / 60).toFixed(2)} hrs). 
Per session: ${Math.round(perSession)} min (${(perSession / 60).toFixed(2)} hrs).`
      );
    } else {
      setResult(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/education" className="hover:text-blue-600 transition-colors">Education Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Study Time Calculator</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">Study Time Calculator</h1>
      <p className="mb-4 text-gray-700">
        Estimate how long it will take to study a number of pages or topics. Enter your reading/study speed and how many sessions you want to split your study into.
      </p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Total Pages/Topics</label>
          <input
            type="number"
            min="1"
            value={pages}
            onChange={e => setPages(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Pages/Topics per Hour</label>
          <input
            type="number"
            min="1"
            value={rate}
            onChange={e => setRate(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Number of Study Sessions (optional)</label>
          <input
            type="number"
            min="1"
            value={sessions}
            onChange={e => setSessions(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="1"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Calculate
        </button>
      </form>
      {result && (
        <div className="mt-6 text-lg font-semibold whitespace-pre-line">
          {result}
        </div>
      )}
    </div>
  );
};

export default StudyTimeCalculator;