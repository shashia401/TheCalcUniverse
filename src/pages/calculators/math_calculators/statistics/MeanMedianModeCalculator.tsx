import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3, Plus, Trash2 } from 'lucide-react';

const MeanMedianModeCalculator: React.FC = () => {
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '']);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateStatistics();
  }, [numbers]);

  const addNumber = () => {
    setNumbers([...numbers, '']);
  };

  const removeNumber = (index: number) => {
    if (numbers.length > 1) {
      setNumbers(numbers.filter((_, i) => i !== index));
    }
  };

  const updateNumber = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const calculateStatistics = () => {
    const validNumbers = numbers
      .filter(n => n !== '' && !isNaN(parseFloat(n)))
      .map(n => parseFloat(n))
      .sort((a, b) => a - b);

    if (validNumbers.length === 0) {
      setResults(null);
      return;
    }

    const n = validNumbers.length;
    const sum = validNumbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / n;

    // Median
    let median: number;
    const mid = Math.floor(n / 2);
    if (n % 2 === 0) {
      median = (validNumbers[mid - 1] + validNumbers[mid]) / 2;
    } else {
      median = validNumbers[mid];
    }

    // Mode
    const frequency: { [key: number]: number } = {};
    validNumbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency)
      .filter(key => frequency[parseFloat(key)] === maxFreq)
      .map(key => parseFloat(key));

    // Range
    const range = validNumbers[n - 1] - validNumbers[0];
    const min = validNumbers[0];
    const max = validNumbers[n - 1];

    // Quartiles
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = validNumbers[q1Index];
    const q3 = validNumbers[q3Index];
    const iqr = q3 - q1;

    setResults({
      count: n,
      sum,
      mean,
      median,
      mode: modes.length === n ? 'No mode' : modes.join(', '),
      range,
      min,
      max,
      q1,
      q3,
      iqr,
      sortedData: validNumbers
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">Math Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Mean, Median, Mode, Range Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Mean, Median, Mode, Range Calculator</h1>
        </div>

        {/* Number Inputs */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Data Points</label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {numbers.map((number, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="number"
                  value={number}
                  onChange={(e) => updateNumber(index, e.target.value)}
                  placeholder={`Value ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  onClick={() => removeNumber(index)}
                  disabled={numbers.length === 1}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={addNumber}
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Data Point</span>
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Basic Statistics */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Central Tendency Measures</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Count</div>
                  <div className="text-2xl font-bold text-blue-600">{results.count}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Sum</div>
                  <div className="text-2xl font-bold text-green-600">{results.sum.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mean</div>
                  <div className="text-2xl font-bold text-purple-600">{results.mean.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Median</div>
                  <div className="text-2xl font-bold text-orange-600">{results.median.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Mode and Range */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mode</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Mode</span>
                    <span className="font-semibold text-green-600">{results.mode}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Most Frequent Value(s)</span>
                    <span className="font-semibold text-green-600">{results.mode}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Range</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Minimum</span>
                    <span className="font-semibold text-purple-600">{results.min}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Maximum</span>
                    <span className="font-semibold text-purple-600">{results.max}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Range</span>
                    <span className="font-semibold text-purple-600">{results.range.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quartiles */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quartiles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Q1 (25th percentile)</div>
                  <div className="text-xl font-bold text-orange-600">{results.q1}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Q2 (Median)</div>
                  <div className="text-xl font-bold text-orange-600">{results.median.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Q3 (75th percentile)</div>
                  <div className="text-xl font-bold text-orange-600">{results.q3}</div>
                </div>
                <div className="md:col-span-3 bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">IQR (Interquartile Range)</div>
                  <div className="text-xl font-bold text-orange-600">{results.iqr.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Sorted Data */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sorted Data</h3>
              <div className="bg-white rounded-lg p-4">
                <div className="flex flex-wrap gap-2">
                  {results.sortedData.map((num: number, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-mono text-sm"
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Central Tendency Measures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Mean</h4>
              <p className="text-gray-600 mt-1">The average of all values, calculated by summing all values and dividing by the count.</p>
              <p className="text-gray-600 mt-1">Formula: μ = (Σx) / n</p>
            </div>
            <div>
              <h4 className="font-semibold">Median</h4>
              <p className="text-gray-600 mt-1">The middle value when data is arranged in order. For even-sized datasets, it's the average of the two middle values.</p>
            </div>
            <div>
              <h4 className="font-semibold">Mode</h4>
              <p className="text-gray-600 mt-1">The most frequently occurring value(s) in the dataset. A dataset may have no mode, one mode, or multiple modes.</p>
            </div>
            <div>
              <h4 className="font-semibold">Range</h4>
              <p className="text-gray-600 mt-1">The difference between the maximum and minimum values in the dataset.</p>
              <p className="text-gray-600 mt-1">Formula: Range = Max - Min</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeanMedianModeCalculator;