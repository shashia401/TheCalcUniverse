import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp, Plus, Trash2 } from 'lucide-react';

const CorrelationCalculator: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<{ x: string; y: string }[]>([
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' },
    { x: '', y: '' },
  ]);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateCorrelation();
  }, [dataPoints]);

  const addDataPoint = () => {
    setDataPoints([...dataPoints, { x: '', y: '' }]);
  };

  const removeDataPoint = (index: number) => {
    if (dataPoints.length > 2) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
    }
  };

  const updateDataPoint = (index: number, field: 'x' | 'y', value: string) => {
    const newDataPoints = [...dataPoints];
    newDataPoints[index][field] = value;
    setDataPoints(newDataPoints);
  };

  const calculateCorrelation = () => {
    const validDataPoints = dataPoints.filter(
      point => point.x !== '' && point.y !== '' && !isNaN(parseFloat(point.x)) && !isNaN(parseFloat(point.y))
    );

    if (validDataPoints.length < 2) {
      setResults(null);
      return;
    }

    const xValues = validDataPoints.map(point => parseFloat(point.x));
    const yValues = validDataPoints.map(point => parseFloat(point.y));
    const n = validDataPoints.length;

    // Calculate means
    const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
    const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;

    // Calculate variances and covariance
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;

    for (let i = 0; i < n; i++) {
      const xDiff = xValues[i] - xMean;
      const yDiff = yValues[i] - yMean;
      sumXY += xDiff * yDiff;
      sumX2 += xDiff * xDiff;
      sumY2 += yDiff * yDiff;
    }

    // Pearson correlation coefficient
    const r = sumXY / Math.sqrt(sumX2 * sumY2);
    
    // Coefficient of determination (r-squared)
    const rSquared = r * r;
    
    // Linear regression
    const slope = sumXY / sumX2;
    const intercept = yMean - slope * xMean;
    
    // Calculate predicted y values and residuals
    const predictions = xValues.map(x => slope * x + intercept);
    const residuals = yValues.map((y, i) => y - predictions[i]);
    
    // Calculate standard error of the estimate
    const sumResidualSquared = residuals.reduce((sum, res) => sum + res * res, 0);
    const standardError = Math.sqrt(sumResidualSquared / (n - 2));
    
    // Calculate t-statistic for significance testing
    const tStat = r * Math.sqrt((n - 2) / (1 - r * r));
    
    // Interpret correlation strength
    let strength = '';
    const absR = Math.abs(r);
    if (absR < 0.2) strength = 'Very weak';
    else if (absR < 0.4) strength = 'Weak';
    else if (absR < 0.6) strength = 'Moderate';
    else if (absR < 0.8) strength = 'Strong';
    else strength = 'Very strong';
    
    // Direction
    const direction = r > 0 ? 'Positive' : r < 0 ? 'Negative' : 'No';
    
    setResults({
      pearsonR: r,
      rSquared,
      slope,
      intercept,
      standardError,
      tStat,
      strength,
      direction,
      regression: {
        equation: `y = ${slope.toFixed(4)}x + ${intercept.toFixed(4)}`,
        predictions,
        residuals
      },
      data: {
        x: xValues,
        y: yValues,
        xMean,
        yMean,
        n
      }
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
        <span className="text-gray-900 font-medium">Correlation Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Correlation Calculator</h1>
        </div>

        {/* Data Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Data Points (x, y)</label>
          <div className="grid grid-cols-1 gap-3">
            <div className="grid grid-cols-2 gap-4 mb-2">
              <div className="text-center font-medium text-gray-700">X Values</div>
              <div className="text-center font-medium text-gray-700">Y Values</div>
            </div>
            {dataPoints.map((point, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 items-center">
                <input
                  type="number"
                  value={point.x}
                  onChange={(e) => updateDataPoint(index, 'x', e.target.value)}
                  placeholder={`x${index + 1}`}
                  step="any"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={point.y}
                    onChange={(e) => updateDataPoint(index, 'y', e.target.value)}
                    placeholder={`y${index + 1}`}
                    step="any"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeDataPoint(index)}
                    disabled={dataPoints.length <= 2}
                    className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button
            onClick={addDataPoint}
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Data Point</span>
          </button>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Correlation Results */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Correlation Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Pearson Correlation Coefficient (r)</div>
                  <div className="text-3xl font-bold text-blue-600">{results.pearsonR.toFixed(6)}</div>
                  <div className="mt-2 text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      results.pearsonR > 0 ? 'bg-green-100 text-green-800' : 
                      results.pearsonR < 0 ? 'bg-red-100 text-red-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {results.direction} correlation
                    </span>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Coefficient of Determination (r²)</div>
                  <div className="text-3xl font-bold text-indigo-600">{results.rSquared.toFixed(6)}</div>
                  <div className="mt-2 text-sm text-gray-600">
                    {(results.rSquared * 100).toFixed(2)}% of variation explained
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Strength</div>
                  <div className="text-xl font-bold text-gray-800">{results.strength}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">t-Statistic</div>
                  <div className="text-xl font-bold text-gray-800">{results.tStat.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Standard Error</div>
                  <div className="text-xl font-bold text-gray-800">{results.standardError.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Regression Results */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Linear Regression</h3>
              <div className="bg-white rounded-lg p-4 text-center mb-4">
                <div className="text-sm text-gray-600 mb-1">Regression Equation</div>
                <div className="text-2xl font-bold text-green-600 font-mono">
                  {results.regression.equation}
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  Slope: {results.slope.toFixed(6)}, Y-intercept: {results.intercept.toFixed(6)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Interpretation</h4>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• For each unit increase in x, y changes by {results.slope.toFixed(4)} units</li>
                    <li>• When x = 0, y is predicted to be {results.intercept.toFixed(4)}</li>
                    <li>• {Math.abs(results.rSquared * 100).toFixed(2)}% of the variation in y is explained by x</li>
                    <li>• The correlation is {results.strength.toLowerCase()} and {results.direction.toLowerCase()}</li>
                  </ul>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Data Summary</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Number of data points:</span>
                      <span className="font-mono">{results.data.n}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean of x:</span>
                      <span className="font-mono">{results.data.xMean.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mean of y:</span>
                      <span className="font-mono">{results.data.yMean.toFixed(4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Table */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Analysis</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">X</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Y</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Y</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Residual</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {results.data.x.map((x: number, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-2 whitespace-nowrap font-mono">{x}</td>
                        <td className="px-4 py-2 whitespace-nowrap font-mono">{results.data.y[index]}</td>
                        <td className="px-4 py-2 whitespace-nowrap font-mono">{results.regression.predictions[index].toFixed(4)}</td>
                        <td className="px-4 py-2 whitespace-nowrap font-mono">
                          <span className={results.regression.residuals[index] > 0 ? 'text-green-600' : 'text-red-600'}>
                            {results.regression.residuals[index].toFixed(4)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Correlation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Pearson Correlation Coefficient</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Measures the strength and direction of a linear relationship</li>
                <li>• Ranges from -1 (perfect negative) to +1 (perfect positive)</li>
                <li>• r = 0 indicates no linear relationship</li>
                <li>• Formula: r = Σ[(x - x̄)(y - ȳ)] / √[Σ(x - x̄)² × Σ(y - ȳ)²]</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Coefficient of Determination (r²)</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Represents the proportion of variance in y explained by x</li>
                <li>• Ranges from 0 to 1 (or 0% to 100%)</li>
                <li>• Higher values indicate better fit of the regression model</li>
                <li>• r² = 0.75 means 75% of variation is explained by the model</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Correlation Strength</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• |r| {'<'} 0.2: Very weak correlation</li>
                <li>• 0.2 ≤ |r| {'<'} 0.4: Weak correlation</li>
                <li>• 0.4 ≤ |r| {'<'} 0.6: Moderate correlation</li>
                <li>• 0.6 ≤ |r| {'<'} 0.8: Strong correlation</li>
                <li>• |r| ≥ 0.8: Very strong correlation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Important Notes</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Correlation does not imply causation</li>
                <li>• Only measures linear relationships</li>
                <li>• Sensitive to outliers</li>
                <li>• Requires at least 2 data points</li>
                <li>• More data points generally provide more reliable results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrelationCalculator;