import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3, Plus, Trash2 } from 'lucide-react';

const AverageCalculator: React.FC = () => {
  const [numbers, setNumbers] = useState<string[]>(['', '', '']);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateAverages();
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

  const calculateAverages = () => {
    const validNumbers = numbers
      .filter(n => n !== '' && !isNaN(parseFloat(n)))
      .map(n => parseFloat(n))
      .sort((a, b) => a - b);

    if (validNumbers.length === 0) {
      setResults(null);
      return;
    }

    // Mean
    const mean = validNumbers.reduce((sum, num) => sum + num, 0) / validNumbers.length;

    // Median
    let median: number;
    const mid = Math.floor(validNumbers.length / 2);
    if (validNumbers.length % 2 === 0) {
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
    const range = validNumbers[validNumbers.length - 1] - validNumbers[0];

    // Standard Deviation
    const variance = validNumbers.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / validNumbers.length;
    const standardDeviation = Math.sqrt(variance);

    setResults({
      count: validNumbers.length,
      sum: validNumbers.reduce((sum, num) => sum + num, 0),
      mean: mean,
      median: median,
      mode: modes.length === validNumbers.length ? 'No mode' : modes.join(', '),
      range: range,
      min: validNumbers[0],
      max: validNumbers[validNumbers.length - 1],
      standardDeviation: standardDeviation,
      variance: variance
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">Math Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Average Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Average Calculator</h1>
        </div>

        {/* Number Inputs */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Numbers</label>
          <div className="space-y-3">
            {numbers.map((number, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="number"
                  value={number}
                  onChange={(e) => updateNumber(index, e.target.value)}
                  placeholder={`Number ${index + 1}`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={() => removeNumber(index)}
                  disabled={numbers.length === 1}
                  className="p-3 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={addNumber}
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Number</span>
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Statistical Results</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Count</div>
                <div className="text-2xl font-bold text-gray-800">{results.count}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Sum</div>
                <div className="text-2xl font-bold text-blue-600">{results.sum.toFixed(2)}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Mean (Average)</div>
                <div className="text-2xl font-bold text-green-600">{results.mean.toFixed(4)}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Median</div>
                <div className="text-2xl font-bold text-purple-600">{results.median.toFixed(4)}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Mode</div>
                <div className="text-lg font-bold text-orange-600">{results.mode}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Range</div>
                <div className="text-2xl font-bold text-red-600">{results.range.toFixed(4)}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Minimum</div>
                <div className="text-2xl font-bold text-indigo-600">{results.min}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Maximum</div>
                <div className="text-2xl font-bold text-pink-600">{results.max}</div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Standard Deviation</div>
                <div className="text-xl font-bold text-teal-600">{results.standardDeviation.toFixed(4)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AverageCalculator;