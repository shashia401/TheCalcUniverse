import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3, Plus, Trash2 } from 'lucide-react';

const DescriptiveStatisticsCalculator: React.FC = () => {
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
    const populationVariance = validNumbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / n;
    const sampleVariance = n > 1 ? validNumbers.reduce((acc, num) => acc + Math.pow(num - mean, 2), 0) / (n - 1) : 0;
    const populationStdDev = Math.sqrt(populationVariance);
    const sampleStdDev = Math.sqrt(sampleVariance);

    // Quartiles
    const q1Index = Math.floor(n * 0.25);
    const q3Index = Math.floor(n * 0.75);
    const q1 = validNumbers[q1Index];
    const q3 = validNumbers[q3Index];
    const iqr = q3 - q1;

    // Skewness (Pearson's moment coefficient)
    const skewness = validNumbers.reduce((acc, num) => acc + Math.pow((num - mean) / populationStdDev, 3), 0) / n;

    // Kurtosis
    const kurtosis = validNumbers.reduce((acc, num) => acc + Math.pow((num - mean) / populationStdDev, 4), 0) / n - 3;

    // Coefficient of Variation
    const cv = (populationStdDev / mean) * 100;

    // Standard Error of the Mean
    const sem = sampleStdDev / Math.sqrt(n);

    // Confidence Intervals (95%)
    const z95 = 1.96; // Z-score for 95% confidence
    const marginOfError = z95 * sem;
    const ci95Lower = mean - marginOfError;
    const ci95Upper = mean + marginOfError;

    // Percentiles
    const percentiles: { [key: number]: number } = {};
    [5, 10, 25, 50, 75, 90, 95].forEach(p => {
      const index = Math.floor(n * (p / 100));
      percentiles[p] = validNumbers[index];
    });

    setResults({
      count: n,
      sum,
      mean,
      median,
      mode: modes.length === n ? 'No mode' : modes.join(', '),
      range,
      min,
      max,
      populationVariance,
      sampleVariance,
      populationStdDev,
      sampleStdDev,
      q1,
      q3,
      iqr,
      skewness,
      kurtosis,
      cv,
      sem,
      ci95: {
        lower: ci95Lower,
        upper: ci95Upper
      },
      percentiles,
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
        <span className="text-gray-900 font-medium">Descriptive Statistics Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Descriptive Statistics Calculator</h1>
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Data Point</span>
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Central Tendency */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Central Tendency</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mean</div>
                  <div className="text-3xl font-bold text-indigo-600">{results.mean.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Median</div>
                  <div className="text-3xl font-bold text-blue-600">{results.median.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mode</div>
                  <div className="text-3xl font-bold text-cyan-600">{results.mode}</div>
                </div>
              </div>
            </div>

            {/* Dispersion */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Dispersion</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Range</div>
                  <div className="text-2xl font-bold text-purple-600">{results.range.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Variance (Sample)</div>
                  <div className="text-2xl font-bold text-pink-600">{results.sampleVariance.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Std Dev (Sample)</div>
                  <div className="text-2xl font-bold text-fuchsia-600">{results.sampleStdDev.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Coef. of Variation</div>
                  <div className="text-2xl font-bold text-rose-600">{results.cv.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {/* Quartiles and Percentiles */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quartiles</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Q1 (25th percentile)</span>
                    <span className="font-semibold text-blue-600">{results.q1}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Q2 (Median)</span>
                    <span className="font-semibold text-blue-600">{results.median.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Q3 (75th percentile)</span>
                    <span className="font-semibold text-blue-600">{results.q3}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">IQR (Q3 - Q1)</span>
                    <span className="font-semibold text-blue-600">{results.iqr.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Percentiles</h3>
                <div className="space-y-3">
                  {Object.entries(results.percentiles).map(([percentile, value]: [string, any]) => (
                    <div key={percentile} className="flex justify-between items-center p-3 bg-white rounded-lg">
                      <span className="text-gray-700">P{percentile}</span>
                      <span className="font-semibold text-teal-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Distribution Shape */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution Shape</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Skewness</div>
                  <div className="text-2xl font-bold text-amber-600">{results.skewness.toFixed(6)}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {results.skewness > 0.5 ? 'Positively skewed (right tail)' : 
                     results.skewness < -0.5 ? 'Negatively skewed (left tail)' : 
                     'Approximately symmetric'}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Kurtosis</div>
                  <div className="text-2xl font-bold text-orange-600">{results.kurtosis.toFixed(6)}</div>
                  <div className="text-sm text-gray-600 mt-2">
                    {results.kurtosis > 0 ? 'Leptokurtic (heavy tails)' : 
                     results.kurtosis < 0 ? 'Platykurtic (light tails)' : 
                     'Mesokurtic (normal distribution)'}
                  </div>
                </div>
              </div>
            </div>

            {/* Confidence Interval */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inference</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Standard Error of Mean</div>
                  <div className="text-xl font-bold text-green-600">{results.sem.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">95% Confidence Interval</div>
                  <div className="text-xl font-bold text-emerald-600">
                    [{results.ci95.lower.toFixed(4)}, {results.ci95.upper.toFixed(4)}]
                  </div>
                </div>
              </div>
            </div>

            {/* Data Summary */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Count:</span>
                      <span className="font-mono">{results.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sum:</span>
                      <span className="font-mono">{results.sum.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-mono">{results.min}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-mono">{results.max}</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Sorted Data</h4>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {results.sortedData.map((num: number, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded font-mono text-xs"
                      >
                        {num}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Descriptive Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Central Tendency</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Mean:</strong> Average of all values</li>
                <li>• <strong>Median:</strong> Middle value when sorted</li>
                <li>• <strong>Mode:</strong> Most frequent value(s)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Dispersion</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Range:</strong> Difference between max and min</li>
                <li>• <strong>Variance:</strong> Average squared deviation from mean</li>
                <li>• <strong>Standard Deviation:</strong> Square root of variance</li>
                <li>• <strong>IQR:</strong> Difference between Q3 and Q1</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Shape</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Skewness:</strong> Measures asymmetry of distribution</li>
                <li>• <strong>Kurtosis:</strong> Measures "tailedness" of distribution</li>
                <li>• <strong>Normal distribution:</strong> Skewness ≈ 0, Kurtosis ≈ 0</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Data exploration and summary</li>
                <li>• Quality control and monitoring</li>
                <li>• Research and experimental analysis</li>
                <li>• Financial and economic analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DescriptiveStatisticsCalculator;