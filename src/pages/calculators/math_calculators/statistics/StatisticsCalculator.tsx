import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3, Plus, Trash2 } from 'lucide-react';

const StatisticsCalculator: React.FC = () => {
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

    // Variance and Standard Deviation
    const variance = validNumbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / n;
    const sampleVariance = n > 1 ? validNumbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / (n - 1) : 0;
    const standardDeviation = Math.sqrt(variance);
    const sampleStandardDeviation = Math.sqrt(sampleVariance);

    // Quartiles
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = validNumbers[q1Index];
    const q3 = validNumbers[q3Index];
    const iqr = q3 - q1;

    // Skewness (Pearson's moment coefficient)
    const skewness = validNumbers.reduce((acc, num) => acc + Math.pow((num - mean) / standardDeviation, 3), 0) / n;

    // Kurtosis
    const kurtosis = validNumbers.reduce((acc, num) => acc + Math.pow((num - mean) / standardDeviation, 4), 0) / n - 3;

    setResults({
      count: n,
      sum,
      mean,
      median,
      mode: modes.length === n ? 'No mode' : modes.join(', '),
      range,
      min,
      max,
      variance,
      sampleVariance,
      standardDeviation,
      sampleStandardDeviation,
      q1,
      q3,
      iqr,
      skewness,
      kurtosis,
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
        <span className="text-gray-900 font-medium">Statistics Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Statistics Calculator</h1>
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Basic Statistics</h3>
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

            {/* Central Tendency & Spread */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Central Tendency</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Mode</span>
                    <span className="font-semibold text-green-600">{results.mode}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Minimum</span>
                    <span className="font-semibold text-green-600">{results.min}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Maximum</span>
                    <span className="font-semibold text-green-600">{results.max}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Range</span>
                    <span className="font-semibold text-green-600">{results.range.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Variability</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Population Variance</span>
                    <span className="font-semibold text-purple-600">{results.variance.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Sample Variance</span>
                    <span className="font-semibold text-purple-600">{results.sampleVariance.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Population Std Dev</span>
                    <span className="font-semibold text-purple-600">{results.standardDeviation.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Sample Std Dev</span>
                    <span className="font-semibold text-purple-600">{results.sampleStandardDeviation.toFixed(4)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quartiles and Advanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quartiles</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Q1 (25th percentile)</span>
                    <span className="font-semibold text-orange-600">{results.q1}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Q2 (Median)</span>
                    <span className="font-semibold text-orange-600">{results.median.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Q3 (75th percentile)</span>
                    <span className="font-semibold text-orange-600">{results.q3}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">IQR (Q3 - Q1)</span>
                    <span className="font-semibold text-orange-600">{results.iqr.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shape</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Skewness</span>
                    <span className="font-semibold text-indigo-600">{results.skewness.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Kurtosis</span>
                    <span className="font-semibold text-indigo-600">{results.kurtosis.toFixed(4)}</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">Distribution Shape</div>
                    <div className="text-sm">
                      {Math.abs(results.skewness) < 0.5 ? '📊 Approximately symmetric' :
                       results.skewness > 0.5 ? '📈 Right-skewed (positive)' : '📉 Left-skewed (negative)'}
                    </div>
                  </div>
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
      </div>
    </div>
  );
};

export default StatisticsCalculator;