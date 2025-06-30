import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3, Plus, Trash2 } from 'lucide-react';

const StandardDeviationCalculator: React.FC = () => {
  const [numbers, setNumbers] = useState<string[]>(['', '', '', '', '']);
  const [calculationType, setCalculationType] = useState<'population' | 'sample'>('population');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateStatistics();
  }, [numbers, calculationType]);

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
      .map(n => parseFloat(n));

    if (validNumbers.length === 0) {
      setResults(null);
      return;
    }

    const n = validNumbers.length;
    const sum = validNumbers.reduce((acc, num) => acc + num, 0);
    const mean = sum / n;

    // Variance and Standard Deviation
    const squaredDifferences = validNumbers.map(num => Math.pow(num - mean, 2));
    const sumSquaredDiff = squaredDifferences.reduce((acc, val) => acc + val, 0);
    
    let variance, standardDeviation;
    
    if (calculationType === 'population') {
      variance = sumSquaredDiff / n;
      standardDeviation = Math.sqrt(variance);
    } else { // sample
      if (n <= 1) {
        variance = 0;
        standardDeviation = 0;
      } else {
        variance = sumSquaredDiff / (n - 1);
        standardDeviation = Math.sqrt(variance);
      }
    }

    // Coefficient of Variation
    const cv = (standardDeviation / mean) * 100;

    // Z-scores
    const zScores = validNumbers.map(num => (num - mean) / standardDeviation);

    // Standard Error of the Mean (SEM)
    const sem = standardDeviation / Math.sqrt(n);

    // Confidence Intervals (95%)
    const z95 = 1.96; // Z-score for 95% confidence
    const marginOfError = z95 * sem;
    const ci95Lower = mean - marginOfError;
    const ci95Upper = mean + marginOfError;

    setResults({
      count: n,
      sum,
      mean,
      variance,
      standardDeviation,
      cv,
      zScores,
      sem,
      ci95: {
        lower: ci95Lower,
        upper: ci95Upper
      },
      data: validNumbers,
      squaredDifferences,
      sumSquaredDiff
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
        <span className="text-gray-900 font-medium">Standard Deviation Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Standard Deviation Calculator</h1>
        </div>

        {/* Calculation Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setCalculationType('population')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                calculationType === 'population'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Population (σ)
            </button>
            <button
              onClick={() => setCalculationType('sample')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                calculationType === 'sample'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Sample (s)
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {calculationType === 'population' 
              ? 'Use when data represents the entire population (divides by n)' 
              : 'Use when data is a sample of a larger population (divides by n-1)'}
          </div>
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
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Data Point</span>
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Main Results */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Standard Deviation Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {calculationType === 'population' ? 'Population Standard Deviation (σ)' : 'Sample Standard Deviation (s)'}
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{results.standardDeviation.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {calculationType === 'population' ? 'Population Variance (σ²)' : 'Sample Variance (s²)'}
                  </div>
                  <div className="text-3xl font-bold text-indigo-600">{results.variance.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mean (μ)</div>
                  <div className="text-3xl font-bold text-blue-600">{results.mean.toFixed(6)}</div>
                </div>
              </div>
            </div>

            {/* Additional Statistics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Count (n)</span>
                    <span className="font-semibold text-blue-600">{results.count}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Sum (Σx)</span>
                    <span className="font-semibold text-blue-600">{results.sum.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Sum of Squared Differences</span>
                    <span className="font-semibold text-blue-600">{results.sumSquaredDiff.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Measures</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Coefficient of Variation</span>
                    <span className="font-semibold text-green-600">{results.cv.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">Standard Error of Mean</span>
                    <span className="font-semibold text-green-600">{results.sem.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <span className="text-gray-700">95% Confidence Interval</span>
                    <span className="font-semibold text-green-600">
                      [{results.ci95.lower.toFixed(4)}, {results.ci95.upper.toFixed(4)}]
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Calculation */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Calculation</h3>
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Step 1: Calculate the mean</h4>
                  <div className="font-mono text-sm">
                    <div>Mean = (Sum of all values) / (Number of values)</div>
                    <div>Mean = ({results.data.join(' + ')}) / {results.count}</div>
                    <div>Mean = {results.sum.toFixed(4)} / {results.count}</div>
                    <div>Mean = {results.mean.toFixed(6)}</div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Step 2: Calculate squared differences from the mean</h4>
                  <div className="font-mono text-sm">
                    {results.data.map((value: number, index: number) => (
                      <div key={index}>
                        ({value} - {results.mean.toFixed(4)})² = {results.squaredDifferences[index].toFixed(6)}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Step 3: Calculate the variance</h4>
                  <div className="font-mono text-sm">
                    <div>Sum of squared differences = {results.sumSquaredDiff.toFixed(6)}</div>
                    {calculationType === 'population' ? (
                      <>
                        <div>Population Variance (σ²) = Sum of squared differences / n</div>
                        <div>σ² = {results.sumSquaredDiff.toFixed(6)} / {results.count}</div>
                        <div>σ² = {results.variance.toFixed(6)}</div>
                      </>
                    ) : (
                      <>
                        <div>Sample Variance (s²) = Sum of squared differences / (n - 1)</div>
                        <div>s² = {results.sumSquaredDiff.toFixed(6)} / {results.count - 1}</div>
                        <div>s² = {results.variance.toFixed(6)}</div>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Step 4: Calculate the standard deviation</h4>
                  <div className="font-mono text-sm">
                    {calculationType === 'population' ? (
                      <>
                        <div>Population Standard Deviation (σ) = √Variance</div>
                        <div>σ = √{results.variance.toFixed(6)}</div>
                        <div>σ = {results.standardDeviation.toFixed(6)}</div>
                      </>
                    ) : (
                      <>
                        <div>Sample Standard Deviation (s) = √Variance</div>
                        <div>s = √{results.variance.toFixed(6)}</div>
                        <div>s = {results.standardDeviation.toFixed(6)}</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Z-Scores */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Z-Scores</h3>
              <p className="text-sm text-gray-600 mb-4">
                Z-scores show how many standard deviations each value is from the mean.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.data.map((value: number, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3 flex justify-between items-center">
                    <span className="font-mono text-gray-700">{value}</span>
                    <span className={`font-mono ${
                      results.zScores[index] > 0 ? 'text-green-600' : 
                      results.zScores[index] < 0 ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      z = {results.zScores[index].toFixed(3)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Standard Deviation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Population vs. Sample</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Population (σ):</strong> Use when your data represents the entire group</li>
                <li>• <strong>Sample (s):</strong> Use when your data is a subset of a larger group</li>
                <li>• Sample standard deviation uses n-1 in the denominator (Bessel's correction)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Interpretation</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Measures the amount of variation or dispersion in a dataset</li>
                <li>• Lower values indicate data points are close to the mean</li>
                <li>• Higher values indicate data points are spread out over a wider range</li>
                <li>• In a normal distribution, about 68% of values fall within 1 standard deviation of the mean</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Formulas</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Population: σ = √[Σ(x - μ)² / N]</li>
                <li>• Sample: s = √[Σ(x - x̄)² / (n-1)]</li>
                <li>• Coefficient of Variation: CV = (σ / μ) × 100%</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Quality control in manufacturing</li>
                <li>• Financial risk assessment</li>
                <li>• Scientific research and experiments</li>
                <li>• Educational assessment and grading</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StandardDeviationCalculator;