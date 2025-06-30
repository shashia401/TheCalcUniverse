import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight } from "lucide-react";

const ReadingTimeCalculator = () => {
  const [words, setWords] = useState("");
  const [wpm, setWpm] = useState("200");
  const [result, setResult] = useState<string | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(words);
    const speed = parseFloat(wpm);
    if (!isNaN(w) && !isNaN(speed) && w > 0 && speed > 0) {
      const minutes = w / speed;
      const min = Math.floor(minutes);
      const sec = Math.round((minutes - min) * 60);
      setResult(
        `Estimated reading time: ${min} min ${sec} sec (${minutes.toFixed(2)} min)`
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
        <span className="text-gray-900 font-medium">Reading Time Calculator</span>
      </nav>
      <h1 className="text-3xl font-bold mb-4">Reading Time Calculator</h1>
      <p className="mb-4 text-gray-700">
        Estimate how long it will take to read a text. Enter the number of words and your reading speed (words per minute).
      </p>
      <form onSubmit={calculate} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Number of Words</label>
          <input
            type="number"
            min="1"
            value={words}
            onChange={e => setWords(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Reading Speed (words per minute)</label>
          <input
            type="number"
            min="1"
            value={wpm}
            onChange={e => setWpm(e.target.value)}
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
      {result && (
        <div className="mt-6 text-lg font-semibold">{result}</div>
      )}
    </div>
  );
};

export default ReadingTimeCalculator;