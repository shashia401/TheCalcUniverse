import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3 } from 'lucide-react';

const ZScoreCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'value' | 'probability'>('value');
  
  // Z-score from value
  const [value, setValue] = useState('');
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  
  // Probability from z-score
  const [zScore, setZScore] = useState('');
  const [comparisonType, setComparisonType] = useState<'less' | 'greater' | 'between' | 'outside'>('less');
  const [secondZScore, setSecondZScore] = useState('');
  
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateZScore();
  }, [calculationType, value, mean, stdDev, zScore, comparisonType, secondZScore]);

  const calculateZScore = () => {
    try {
      if (calculationType === 'value') {
        const x = parseFloat(value);
        const μ = parseFloat(mean);
        const σ = parseFloat(stdDev);
        
        if (!value || !mean || !stdDev || isNaN(x) || isNaN(μ) || isNaN(σ) || σ <= 0) {
          setResult(null);
          return;
        }

        const z = (x - μ) / σ;
        
        // Calculate probability
        const probability = normalCDF(z);
        const percentile = probability * 100;
        
        setResult({
          type: 'value',
          x,
          mean: μ,
          stdDev: σ,
          zScore: z,
          probability,
          percentile,
          steps: [
            `Z-score formula: z = (x - μ) / σ`,
            `z = (${x} - ${μ}) / ${σ}`,
            `z = ${(x - μ).toFixed(4)} / ${σ}`,
            `z = ${z.toFixed(6)}`,
            `Probability P(Z < ${z.toFixed(4)}) = ${probability.toFixed(6)}`,
            `Percentile = ${percentile.toFixed(2)}%`
          ]
        });
      } else {
        const z1 = parseFloat(zScore);
        
        if (!zScore || isNaN(z1)) {
          setResult(null);
          return;
        }

        let probability: number;
        let description: string;
        let steps: string[] = [];
        
        if (comparisonType === 'less') {
          probability = normalCDF(z1);
          description = `P(Z < ${z1.toFixed(4)})`;
          steps = [
            `Calculate probability P(Z < ${z1.toFixed(4)})`,
            `Using standard normal cumulative distribution function`,
            `P(Z < ${z1.toFixed(4)}) = ${probability.toFixed(6)}`,
            `Probability = ${(probability * 100).toFixed(2)}%`
          ];
        } else if (comparisonType === 'greater') {
          probability = 1 - normalCDF(z1);
          description = `P(Z > ${z1.toFixed(4)})`;
          steps = [
            `Calculate probability P(Z > ${z1.toFixed(4)})`,
            `P(Z > ${z1.toFixed(4)}) = 1 - P(Z < ${z1.toFixed(4)})`,
            `P(Z > ${z1.toFixed(4)}) = 1 - ${normalCDF(z1).toFixed(6)}`,
            `P(Z > ${z1.toFixed(4)}) = ${probability.toFixed(6)}`,
            `Probability = ${(probability * 100).toFixed(2)}%`
          ];
        } else if (comparisonType === 'between') {
          const z2 = parseFloat(secondZScore);
          
          if (!secondZScore || isNaN(z2)) {
            setResult(null);
            return;
          }
          
          const lowerZ = Math.min(z1, z2);
          const upperZ = Math.max(z1, z2);
          
          probability = normalCDF(upperZ) - normalCDF(lowerZ);
          description = `P(${lowerZ.toFixed(4)} < Z < ${upperZ.toFixed(4)})`;
          steps = [
            `Calculate probability P(${lowerZ.toFixed(4)} < Z < ${upperZ.toFixed(4)})`,
            `P(${lowerZ.toFixed(4)} < Z < ${upperZ.toFixed(4)}) = P(Z < ${upperZ.toFixed(4)}) - P(Z < ${lowerZ.toFixed(4)})`,
            `P(${lowerZ.toFixed(4)} < Z < ${upperZ.toFixed(4)}) = ${normalCDF(upperZ).toFixed(6)} - ${normalCDF(lowerZ).toFixed(6)}`,
            `P(${lowerZ.toFixed(4)} < Z < ${upperZ.toFixed(4)}) = ${probability.toFixed(6)}`,
            `Probability = ${(probability * 100).toFixed(2)}%`
          ];
        } else if (comparisonType === 'outside') {
          const z2 = parseFloat(secondZScore);
          
          if (!secondZScore || isNaN(z2)) {
            setResult(null);
            return;
          }
          
          const lowerZ = Math.min(z1, z2);
          const upperZ = Math.max(z1, z2);
          
          probability = normalCDF(lowerZ) + (1 - normalCDF(upperZ));
          description = `P(Z < ${lowerZ.toFixed(4)} or Z > ${upperZ.toFixed(4)})`;
          steps = [
            `Calculate probability P(Z < ${lowerZ.toFixed(4)} or Z > ${upperZ.toFixed(4)})`,
            `P(Z < ${lowerZ.toFixed(4)} or Z > ${upperZ.toFixed(4)}) = P(Z < ${lowerZ.toFixed(4)}) + P(Z > ${upperZ.toFixed(4)})`,
            `P(Z < ${lowerZ.toFixed(4)} or Z > ${upperZ.toFixed(4)}) = ${normalCDF(lowerZ).toFixed(6)} + (1 - ${normalCDF(upperZ).toFixed(6)})`,
            `P(Z < ${lowerZ.toFixed(4)} or Z > ${upperZ.toFixed(4)}) = ${normalCDF(lowerZ).toFixed(6)} + ${(1 - normalCDF(upperZ)).toFixed(6)}`,
            `P(Z < ${lowerZ.toFixed(4)} or Z > ${upperZ.toFixed(4)}) = ${probability.toFixed(6)}`,
            `Probability = ${(probability * 100).toFixed(2)}%`
          ];
        }
        
        setResult({
          type: 'probability',
          zScore: z1,
          secondZScore: parseFloat(secondZScore) || null,
          comparisonType,
          probability,
          description,
          steps
        });
      }
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  // Standard normal cumulative distribution function (CDF)
  const normalCDF = (z: number): number => {
    // Approximation of the normal CDF
    if (z < -6) return 0;
    if (z > 6) return 1;
    
    let sum = 0;
    let term = z;
    let i = 3;
    
    while (Math.abs(term) > 1e-10) {
      sum += term;
      term = term * z * z / i;
      i += 2;
    }
    
    return 0.5 + sum * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
  };

  const commonZScores = [
    { z: -3, p: '0.13%', description: '3σ below mean' },
    { z: -2, p: '2.28%', description: '2σ below mean' },
    { z: -1.96, p: '2.5%', description: '95% confidence interval' },
    { z: -1.645, p: '5%', description: '90% confidence interval' },
    { z: -1, p: '15.87%', description: '1σ below mean' },
    { z: 0, p: '50%', description: 'Mean' },
    { z: 1, p: '84.13%', description: '1σ above mean' },
    { z: 1.645, p: '95%', description: '90% confidence interval' },
    { z: 1.96, p: '97.5%', description: '95% confidence interval' },
    { z: 2, p: '97.72%', description: '2σ above mean' },
    { z: 3, p: '99.87%', description: '3σ above mean' },
  ];

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
        <span className="text-gray-900 font-medium">Z-Score Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Z-Score Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Calculation Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setCalculationType('value')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'value'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Calculate Z-Score from Value</div>
              <div className="text-sm opacity-75">z = (x - μ) / σ</div>
            </button>
            <button
              onClick={() => setCalculationType('probability')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'probability'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Calculate Probability from Z-Score</div>
              <div className="text-sm opacity-75">P(Z &lt; z), P(Z &gt; z), etc.</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8">
          {calculationType === 'value' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value (x)
                </label>
                <input
                  type="number"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="e.g., 75"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mean (μ)
                </label>
                <input
                  type="number"
                  value={mean}
                  onChange={(e) => setMean(e.target.value)}
                  placeholder="e.g., 70"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Standard Deviation (σ)
                </label>
                <input
                  type="number"
                  value={stdDev}
                  onChange={(e) => setStdDev(e.target.value)}
                  placeholder="e.g., 5"
                  step="any"
                  min="0.000001"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          )}

          {calculationType === 'probability' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Z-Score
                  </label>
                  <input
                    type="number"
                    value={zScore}
                    onChange={(e) => setZScore(e.target.value)}
                    placeholder="e.g., 1.96"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comparison Type
                  </label>
                  <select
                    value={comparisonType}
                    onChange={(e) => setComparisonType(e.target.value as any)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  >
                    <option value="less">Less than (Z &lt; z)</option>
                    <option value="greater">Greater than (Z &gt; z)</option>
                    <option value="between">Between two z-scores</option>
                    <option value="outside">Outside two z-scores</option>
                  </select>
                </div>
              </div>
              
              {(comparisonType === 'between' || comparisonType === 'outside') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Second Z-Score
                  </label>
                  <input
                    type="number"
                    value={secondZScore}
                    onChange={(e) => setSecondZScore(e.target.value)}
                    placeholder="e.g., 2.58"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Common Z-Scores */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Z-Scores</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Z-Score</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentile</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commonZScores.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 whitespace-nowrap font-mono">{item.z}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.p}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (calculationType === 'value') {
                            // Can't directly use z-score in value calculation
                          } else {
                            setZScore(item.z.toString());
                          }
                        }}
                        className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        disabled={calculationType === 'value'}
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Z-Score from Value Results */}
            {result.type === 'value' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Z-Score Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Z-Score</div>
                    <div className="text-3xl font-bold text-blue-600">{result.zScore.toFixed(6)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Probability P(Z &lt; z)</div>
                    <div className="text-3xl font-bold text-indigo-600">{result.probability.toFixed(6)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Percentile</div>
                    <div className="text-3xl font-bold text-purple-600">{result.percentile.toFixed(2)}%</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Interpretation</div>
                  <div className="text-lg text-gray-900">
                    {result.zScore > 0 
                      ? `The value ${result.x} is ${Math.abs(result.zScore).toFixed(2)} standard deviations above the mean.`
                      : result.zScore < 0
                        ? `The value ${result.x} is ${Math.abs(result.zScore).toFixed(2)} standard deviations below the mean.`
                        : `The value ${result.x} is exactly at the mean.`
                    }
                  </div>
                </div>
              </div>
            )}

            {/* Probability from Z-Score Results */}
            {result.type === 'probability' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Probability Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Probability</div>
                    <div className="text-3xl font-bold text-blue-600">{result.probability.toFixed(6)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Percentage</div>
                    <div className="text-3xl font-bold text-indigo-600">{(result.probability * 100).toFixed(2)}%</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Description</div>
                  <div className="text-lg text-gray-900">
                    {result.description} = {(result.probability * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Z-Scores</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">What is a Z-Score?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Measures how many standard deviations a value is from the mean</li>
                <li>• Standardizes values from different distributions</li>
                <li>• Formula: z = (x - μ) / σ</li>
                <li>• Positive z-score: value is above the mean</li>
                <li>• Negative z-score: value is below the mean</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Standard Normal Distribution</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Mean = 0, Standard deviation = 1</li>
                <li>• 68% of values fall within ±1σ of the mean</li>
                <li>• 95% of values fall within ±1.96σ of the mean</li>
                <li>• 99.7% of values fall within ±3σ of the mean</li>
                <li>• Total area under the curve = 1 (100%)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Comparing scores from different distributions</li>
                <li>• Identifying outliers (typically |z| &gt; 3)</li>
                <li>• Calculating percentiles and probabilities</li>
                <li>• Creating confidence intervals</li>
                <li>• Hypothesis testing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Interpretation</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• z = 0: Value equals the mean</li>
                <li>• z = 1: Value is 1 standard deviation above the mean</li>
                <li>• z = -1: Value is 1 standard deviation below the mean</li>
                <li>• z = 2: Value is in the 97.7th percentile</li>
                <li>• z = -2: Value is in the 2.3rd percentile</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZScoreCalculator;