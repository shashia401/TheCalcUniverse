import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const TestScoreCalculator = () => {
  const [correct, setCorrect] = useState("");
  const [total, setTotal] = useState("");
  const [score, setScore] = useState<string | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const c = parseFloat(correct);
    const t = parseFloat(total);
    if (!isNaN(c) && !isNaN(t) && t > 0 && c >= 0 && c <= t) {
      setScore(((c / t) * 100).toFixed(2));
    } else {
      setScore(null);
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
        <span className="text-gray-900 font-medium">Test Score Calculator</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">Test Score Calculator</h1>
      <p className="mb-4 text-gray-700">
        Enter the number of questions you got correct and the total number of questions to calculate your test score percentage.
      </p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Correct Answers</label>
          <input
            type="number"
            min="0"
            value={correct}
            onChange={e => setCorrect(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Total Questions</label>
          <input
            type="number"
            min="1"
            value={total}
            onChange={e => setTotal(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Calculate
        </button>
      </form>
      {score !== null && (
        <div className="mt-6 text-xl font-semibold">
          Your Score: <span className="text-blue-700">{score}%</span>
        </div>
      )}
    </div>
  );
};

export default TestScoreCalculator;