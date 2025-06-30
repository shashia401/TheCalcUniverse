import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3, Plus, Trash2 } from 'lucide-react';

const CentralTendencyCalculator: React.FC = () => {
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '']);
  const [results, setResults] = useState<any>(null);
  const [dataType, setDataType] = useState<'ungrouped' | 'grouped'>('ungrouped');
  const [frequencies, setFrequencies] = useState<string[]>(['1', '1', '1', '1', '1']);

  useEffect(() => {
    calculateStatistics();
  }, [numbers, frequencies, dataType]);

  const addNumber = () => {
    setNumbers([...numbers, '']);
    setFrequencies([...frequencies, '1']);
  };

  const removeNumber = (index: number) => {
    if (numbers.length > 1) {
      setNumbers(numbers.filter((_, i) => i !== index));
      setFrequencies(frequencies.filter((_, i) => i !== index));
    }
  };

  const updateNumber = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const updateFrequency = (index: number, value: string) => {
    const newFrequencies = [...frequencies];
    newFrequencies[index] = value;
    setFrequencies(newFrequencies);
  };

  const calculateStatistics = () => {
    if (dataType === 'ungrouped') {
      calculateUngroupedStatistics();
    } else {
      calculateGroupedStatistics();
    }
  };

  const calculateUngroupedStatistics = () => {
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
    const standardDeviation = Math.sqrt(variance);

    // Midrange
    const midrange = (min + max) / 2;

    // Geometric Mean
    const geometricMean = Math.pow(validNumbers.reduce((acc, num) => acc * num, 1), 1 / n);

    // Harmonic Mean
    const harmonicMean = n / validNumbers.reduce((acc, num) => acc + (1 / num), 0);

    // Trimmed Mean (10% trimmed)
    const trimCount = Math.floor(n * 0.1);
    const trimmedData = validNumbers.slice(trimCount, n - trimCount);
    const trimmedMean = trimmedData.reduce((acc, num) => acc + num, 0) / trimmedData.length;

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
      standardDeviation,
      midrange,
      geometricMean,
      harmonicMean,
      trimmedMean,
      sortedData: validNumbers
    });
  };

  const calculateGroupedStatistics = () => {
    const validData = numbers
      .map((n, i) => ({
        value: parseFloat(n),
        frequency: parseInt(frequencies[i]) || 0
      }))
      .filter(item => !isNaN(item.value) && !isNaN(item.frequency) && item.frequency > 0)
      .sort((a, b) => a.value - b.value);

    if (validData.length === 0) {
      setResults(null);
      return;
    }

    // Total frequency
    const totalFrequency = validData.reduce((acc, item) => acc + item.frequency, 0);
    
    // Sum
    const sum = validData.reduce((acc, item) => acc + (item.value * item.frequency), 0);
    
    // Mean
    const mean = sum / totalFrequency;
    
    // Median
    const medianPosition = totalFrequency / 2;
    let cumulativeFreq = 0;
    let median = 0;
    
    for (const item of validData) {
      cumulativeFreq += item.frequency;
      if (cumulativeFreq >= medianPosition) {
        median = item.value;
        break;
      }
    }
    
    // Mode
    const maxFrequency = Math.max(...validData.map(item => item.frequency));
    const modes = validData
      .filter(item => item.frequency === maxFrequency)
      .map(item => item.value);
    
    // Range
    const min = validData[0].value;
    const max = validData[validData.length - 1].value;
    const range = max - min;
    
    // Variance and Standard Deviation
    const sumSquaredDiff = validData.reduce(
      (acc, item) => acc + item.frequency * Math.pow(item.value - mean, 2),
      0
    );
    const variance = sumSquaredDiff / totalFrequency;
    const standardDeviation = Math.sqrt(variance);
    
    // Midrange
    const midrange = (min + max) / 2;

    setResults({
      count: totalFrequency,
      sum,
      mean,
      median,
      mode: modes.join(', '),
      range,
      min,
      max,
      variance,
      standardDeviation,
      midrange,
      groupedData: validData
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
        <span className="text-gray-900 font-medium">Central Tendency Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-teal-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Central Tendency Calculator</h1>
        </div>

        {/* Data Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Data Type</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setDataType('ungrouped')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dataType === 'ungrouped'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Ungrouped Data
            </button>
            <button
              onClick={() => setDataType('grouped')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                dataType === 'grouped'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Grouped Data
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {dataType === 'ungrouped' 
              ? 'Use for raw data points without frequencies' 
              : 'Use when each value has a specific frequency or count'}
          </div>
        </div>

        {/* Data Inputs */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Data Points</label>
          <div className="grid grid-cols-1 gap-3">
            {numbers.map((number, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="number"
                  value={number}
                  onChange={(e) => updateNumber(index, e.target.value)}
                  placeholder={`Value ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
                
                {dataType === 'grouped' && (
                  <input
                    type="number"
                    value={frequencies[index]}
                    onChange={(e) => updateFrequency(index, e.target.value)}
                    placeholder="Frequency"
                    min="1"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                )}
                
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
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Data Point</span>
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Main Results */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Central Tendency Measures</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mean (Arithmetic Average)</div>
                  <div className="text-3xl font-bold text-teal-600">{results.mean.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Median (Middle Value)</div>
                  <div className="text-3xl font-bold text-cyan-600">{results.median.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mode (Most Frequent)</div>
                  <div className="text-3xl font-bold text-blue-600">{results.mode}</div>
                </div>
              </div>
            </div>

            {/* Additional Measures */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Count</span>
                    <span className="font-semibold text-blue-600">{results.count}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Sum</span>
                    <span className="font-semibold text-blue-600">{results.sum.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Range</span>
                    <span className="font-semibold text-blue-600">{results.range.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Minimum</span>
                    <span className="font-semibold text-blue-600">{results.min}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Maximum</span>
                    <span className="font-semibold text-blue-600">{results.max}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Averages</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Midrange</span>
                    <span className="font-semibold text-purple-600">{results.midrange.toFixed(6)}</span>
                  </div>
                  {results.geometricMean && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Geometric Mean</span>
                      <span className="font-semibold text-purple-600">{results.geometricMean.toFixed(6)}</span>
                    </div>
                  )}
                  {results.harmonicMean && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">Harmonic Mean</span>
                      <span className="font-semibold text-purple-600">{results.harmonicMean.toFixed(6)}</span>
                    </div>
                  )}
                  {results.trimmedMean && (
                    <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">10% Trimmed Mean</span>
                      <span className="font-semibold text-purple-600">{results.trimmedMean.toFixed(6)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Dispersion Measures */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dispersion Measures</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Variance</div>
                  <div className="text-xl font-bold text-green-600">{results.variance.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Standard Deviation</div>
                  <div className="text-xl font-bold text-emerald-600">{results.standardDeviation.toFixed(6)}</div>
                </div>
              </div>
            </div>

            {/* Data Display */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
              {dataType === 'ungrouped' ? (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Sorted Data</h4>
                  <div className="flex flex-wrap gap-2">
                    {results.sortedData.map((num: number, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-teal-100 text-teal-800 rounded-lg font-mono text-sm"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Frequency Distribution</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Value</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Frequency</th>
                          <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Relative Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results.groupedData.map((item: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-4 py-2 font-mono">{item.value}</td>
                            <td className="px-4 py-2 font-mono">{item.frequency}</td>
                            <td className="px-4 py-2 font-mono">
                              {((item.frequency / results.count) * 100).toFixed(2)}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Central Tendency Measures</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Mean</h4>
              <p className="text-gray-600 mt-1">The arithmetic mean is the sum of all values divided by the number of values. It's sensitive to outliers.</p>
              <p className="text-gray-600 mt-1">Formula: μ = (Σx) / n</p>
            </div>
            <div>
              <h4 className="font-semibold">Median</h4>
              <p className="text-gray-600 mt-1">The middle value when data is arranged in order. For even-sized datasets, it's the average of the two middle values. Less affected by outliers than the mean.</p>
            </div>
            <div>
              <h4 className="font-semibold">Mode</h4>
              <p className="text-gray-600 mt-1">The most frequently occurring value(s) in the dataset. A dataset may have no mode, one mode (unimodal), or multiple modes (multimodal).</p>
            </div>
            <div>
              <h4 className="font-semibold">Alternative Averages</h4>
              <ul className="text-gray-600 space-y-1 mt-1">
                <li>• <strong>Midrange:</strong> Average of minimum and maximum values</li>
                <li>• <strong>Geometric Mean:</strong> nth root of the product of n values</li>
                <li>• <strong>Harmonic Mean:</strong> Reciprocal of the average of reciprocals</li>
                <li>• <strong>Trimmed Mean:</strong> Mean after removing extreme values</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CentralTendencyCalculator;