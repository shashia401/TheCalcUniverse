import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp } from 'lucide-react';

const TaylorSeriesCalculator: React.FC = () => {
  const [functionType, setFunctionType] = useState<'sin' | 'cos' | 'exp' | 'ln' | 'arctan' | 'custom'>('sin');
  const [centerPoint, setCenterPoint] = useState('0');
  const [numberOfTerms, setNumberOfTerms] = useState('5');
  const [evaluateAt, setEvaluateAt] = useState('1');
  const [result, setResult] = useState<any>(null);

  const calculateTaylorSeries = () => {
    const a = parseFloat(centerPoint);
    const n = parseInt(numberOfTerms);
    const x = parseFloat(evaluateAt);

    if (isNaN(a) || isNaN(n) || isNaN(x) || n <= 0) {
      setResult(null);
      return;
    }

    let series: any[] = [];
    let approximation = 0;
    let actualValue = 0;

    switch (functionType) {
      case 'sin':
        actualValue = Math.sin(x);
        for (let i = 0; i < n; i++) {
          const power = 2 * i + 1;
          const coefficient = Math.pow(-1, i) / factorial(power);
          const term = coefficient * Math.pow(x - a, power);
          approximation += term;
          series.push({
            term: i + 1,
            coefficient: coefficient,
            power: power,
            value: term,
            formula: `${coefficient >= 0 ? '+' : ''}${coefficient.toFixed(6)}(x-${a})^${power}`
          });
        }
        break;

      case 'cos':
        actualValue = Math.cos(x);
        for (let i = 0; i < n; i++) {
          const power = 2 * i;
          const coefficient = Math.pow(-1, i) / factorial(power);
          const term = coefficient * Math.pow(x - a, power);
          approximation += term;
          series.push({
            term: i + 1,
            coefficient: coefficient,
            power: power,
            value: term,
            formula: `${coefficient >= 0 ? '+' : ''}${coefficient.toFixed(6)}(x-${a})^${power}`
          });
        }
        break;

      case 'exp':
        actualValue = Math.exp(x);
        for (let i = 0; i < n; i++) {
          const coefficient = 1 / factorial(i);
          const term = coefficient * Math.pow(x - a, i);
          approximation += term;
          series.push({
            term: i + 1,
            coefficient: coefficient,
            power: i,
            value: term,
            formula: `${coefficient >= 0 ? '+' : ''}${coefficient.toFixed(6)}(x-${a})^${i}`
          });
        }
        break;

      case 'ln':
        if (x <= 0) {
          setResult({ error: 'Natural logarithm is undefined for x ≤ 0' });
          return;
        }
        actualValue = Math.log(x);
        // ln(x) around x = 1: ln(x) = (x-1) - (x-1)²/2 + (x-1)³/3 - ...
        if (a === 1) {
          for (let i = 1; i <= n; i++) {
            const coefficient = Math.pow(-1, i + 1) / i;
            const term = coefficient * Math.pow(x - 1, i);
            approximation += term;
            series.push({
              term: i,
              coefficient: coefficient,
              power: i,
              value: term,
              formula: `${coefficient >= 0 ? '+' : ''}${coefficient.toFixed(6)}(x-1)^${i}`
            });
          }
        } else {
          setResult({ error: 'ln(x) series only implemented around x = 1' });
          return;
        }
        break;

      case 'arctan':
        actualValue = Math.atan(x);
        for (let i = 0; i < n; i++) {
          const power = 2 * i + 1;
          const coefficient = Math.pow(-1, i) / power;
          const term = coefficient * Math.pow(x - a, power);
          approximation += term;
          series.push({
            term: i + 1,
            coefficient: coefficient,
            power: power,
            value: term,
            formula: `${coefficient >= 0 ? '+' : ''}${coefficient.toFixed(6)}(x-${a})^${power}`
          });
        }
        break;
    }

    const error = Math.abs(actualValue - approximation);
    const relativeError = Math.abs(error / actualValue) * 100;

    setResult({
      series,
      approximation,
      actualValue,
      error,
      relativeError,
      convergenceRadius: getConvergenceRadius(functionType)
    });
  };

  const factorial = (n: number): number => {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
  };

  const getConvergenceRadius = (func: string): string => {
    switch (func) {
      case 'sin':
      case 'cos':
      case 'exp':
        return 'Infinite (converges for all x)';
      case 'ln':
        return '1 (converges for |x-1| < 1)';
      case 'arctan':
        return '1 (converges for |x| ≤ 1)';
      default:
        return 'Unknown';
    }
  };

  const functions = [
    { id: 'sin', name: 'sin(x)', description: 'Sine function' },
    { id: 'cos', name: 'cos(x)', description: 'Cosine function' },
    { id: 'exp', name: 'eˣ', description: 'Exponential function' },
    { id: 'ln', name: 'ln(x)', description: 'Natural logarithm' },
    { id: 'arctan', name: 'arctan(x)', description: 'Inverse tangent' },
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
        <span className="text-gray-900 font-medium">Taylor Series Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Taylor Series Calculator</h1>
        </div>

        {/* Function Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Function</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {functions.map((func) => (
              <button
                key={func.id}
                onClick={() => setFunctionType(func.id as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  functionType === func.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-lg">{func.name}</div>
                <div className="text-xs opacity-75">{func.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Parameters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Center Point (a)
            </label>
            <input
              type="number"
              value={centerPoint}
              onChange={(e) => setCenterPoint(e.target.value)}
              placeholder="0"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Terms
            </label>
            <input
              type="number"
              value={numberOfTerms}
              onChange={(e) => setNumberOfTerms(e.target.value)}
              placeholder="5"
              min="1"
              max="20"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Evaluate at x
            </label>
            <input
              type="number"
              value={evaluateAt}
              onChange={(e) => setEvaluateAt(e.target.value)}
              placeholder="1"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateTaylorSeries}
          className="w-full md:w-auto px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate Taylor Series
        </button>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Taylor Series Approximation</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Approximation</div>
                  <div className="text-xl font-bold text-purple-600">{result.approximation.toFixed(8)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Actual Value</div>
                  <div className="text-xl font-bold text-blue-600">{result.actualValue.toFixed(8)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Absolute Error</div>
                  <div className="text-xl font-bold text-red-600">{result.error.toExponential(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Relative Error</div>
                  <div className="text-xl font-bold text-orange-600">{result.relativeError.toFixed(4)}%</div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Convergence Radius</div>
                <div className="text-lg font-semibold text-gray-800">{result.convergenceRadius}</div>
              </div>
            </div>

            {/* Series Terms */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Series Terms</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-white">
                      <th className="text-left p-3 font-semibold">Term</th>
                      <th className="text-left p-3 font-semibold">Formula</th>
                      <th className="text-left p-3 font-semibold">Coefficient</th>
                      <th className="text-left p-3 font-semibold">Power</th>
                      <th className="text-left p-3 font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.series.map((term: any, index: number) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-3">{term.term}</td>
                        <td className="p-3 font-mono text-xs">{term.formula}</td>
                        <td className="p-3 font-mono">{term.coefficient.toFixed(6)}</td>
                        <td className="p-3">{term.power}</td>
                        <td className="p-3 font-mono">{term.value.toFixed(8)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Series Formula */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Taylor Series Formula</h3>
              <div className="bg-white rounded-lg p-4">
                <div className="text-center font-mono text-lg text-blue-800 mb-4">
                  f(x) = Σ [f⁽ⁿ⁾(a) / n!] × (x - a)ⁿ
                </div>
                <div className="text-sm text-gray-600 text-center">
                  where f⁽ⁿ⁾(a) is the nth derivative of f evaluated at x = a
                </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Taylor Series</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Functions</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• eˣ = 1 + x + x²/2! + x³/3! + ...</li>
                <li>• sin(x) = x - x³/3! + x⁵/5! - ...</li>
                <li>• cos(x) = 1 - x²/2! + x⁴/4! - ...</li>
                <li>• ln(1+x) = x - x²/2 + x³/3 - ... (|x| &lt; 1)</li>
                <li>• arctan(x) = x - x³/3 + x⁵/5 - ... (|x| ≤ 1)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Function approximation</li>
                <li>• Numerical analysis</li>
                <li>• Physics and engineering</li>
                <li>• Computer graphics</li>
                <li>• Signal processing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaylorSeriesCalculator;