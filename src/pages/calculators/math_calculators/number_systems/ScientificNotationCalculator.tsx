import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Zap } from 'lucide-react';

const ScientificNotationCalculator: React.FC = () => {
  const [inputType, setInputType] = useState<'decimal' | 'scientific'>('decimal');
  const [decimalNumber, setDecimalNumber] = useState('');
  const [coefficient, setCoefficient] = useState('');
  const [exponent, setExponent] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    convertNumber();
  }, [inputType, decimalNumber, coefficient, exponent]);

  const convertNumber = () => {
    if (inputType === 'decimal') {
      const num = parseFloat(decimalNumber);
      if (!decimalNumber || isNaN(num)) {
        setResult(null);
        return;
      }

      if (num === 0) {
        setResult({
          type: 'toScientific',
          original: '0',
          coefficient: '0',
          exponent: '0',
          scientific: '0 × 10⁰',
          engineeringNotation: '0 × 10⁰'
        });
        return;
      }

      const absNum = Math.abs(num);
      const exponentValue = Math.floor(Math.log10(absNum));
      const coefficientValue = num / Math.pow(10, exponentValue);
      
      // Engineering notation (exponent is multiple of 3)
      const engExponent = Math.floor(exponentValue / 3) * 3;
      const engCoefficient = num / Math.pow(10, engExponent);

      setResult({
        type: 'toScientific',
        original: decimalNumber,
        coefficient: coefficientValue.toFixed(6),
        exponent: exponentValue.toString(),
        scientific: `${coefficientValue.toFixed(6)} × 10^${exponentValue}`,
        engineeringNotation: `${engCoefficient.toFixed(3)} × 10^${engExponent}`,
        steps: generateToScientificSteps(num, coefficientValue, exponentValue)
      });
    } else {
      const coeff = parseFloat(coefficient);
      const exp = parseInt(exponent);
      
      if (!coefficient || !exponent || isNaN(coeff) || isNaN(exp)) {
        setResult(null);
        return;
      }

      const decimalResult = coeff * Math.pow(10, exp);
      
      setResult({
        type: 'toDecimal',
        coefficient: coefficient,
        exponent: exponent,
        decimal: decimalResult.toString(),
        formatted: formatLargeNumber(decimalResult),
        steps: generateToDecimalSteps(coeff, exp, decimalResult)
      });
    }
  };

  const generateToScientificSteps = (num: number, coeff: number, exp: number): string[] => {
    const steps = [];
    steps.push(`Converting ${num} to scientific notation:`);
    
    if (Math.abs(num) >= 1) {
      steps.push(`Move decimal point ${exp} places to the left`);
      steps.push(`${num} = ${coeff.toFixed(6)} × 10^${exp}`);
    } else {
      steps.push(`Move decimal point ${Math.abs(exp)} places to the right`);
      steps.push(`${num} = ${coeff.toFixed(6)} × 10^${exp}`);
    }
    
    return steps;
  };

  const generateToDecimalSteps = (coeff: number, exp: number, result: number): string[] => {
    const steps = [];
    steps.push(`Converting ${coeff} × 10^${exp} to decimal:`);
    
    if (exp >= 0) {
      steps.push(`Move decimal point ${exp} places to the right`);
    } else {
      steps.push(`Move decimal point ${Math.abs(exp)} places to the left`);
    }
    
    steps.push(`Result: ${result}`);
    return steps;
  };

  const formatLargeNumber = (num: number): string => {
    if (Math.abs(num) < 1e-6 || Math.abs(num) >= 1e6) {
      return num.toExponential(6);
    }
    return num.toString();
  };

  const examples = [
    { decimal: '1500000', scientific: '1.5 × 10⁶', description: 'Large number' },
    { decimal: '0.000025', scientific: '2.5 × 10⁻⁵', description: 'Small number' },
    { decimal: '299792458', scientific: '2.99792458 × 10⁸', description: 'Speed of light (m/s)' },
    { decimal: '0.00000000000000000016', scientific: '1.6 × 10⁻¹⁹', description: 'Elementary charge (C)' },
  ];

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
        <span className="text-gray-900 font-medium">Scientific Notation Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Zap className="w-8 h-8 text-yellow-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Scientific Notation Calculator</h1>
        </div>

        {/* Input Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Conversion Direction</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setInputType('decimal')}
              className={`p-4 rounded-lg border-2 transition-all ${
                inputType === 'decimal'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Decimal → Scientific</div>
              <div className="text-sm opacity-75">Convert decimal to scientific notation</div>
            </button>
            <button
              onClick={() => setInputType('scientific')}
              className={`p-4 rounded-lg border-2 transition-all ${
                inputType === 'scientific'
                  ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Scientific → Decimal</div>
              <div className="text-sm opacity-75">Convert scientific notation to decimal</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="mb-8">
          {inputType === 'decimal' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decimal Number
              </label>
              <input
                type="text"
                value={decimalNumber}
                onChange={(e) => setDecimalNumber(e.target.value)}
                placeholder="Enter decimal number (e.g., 1500000 or 0.000025)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-mono"
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Coefficient
                </label>
                <input
                  type="number"
                  value={coefficient}
                  onChange={(e) => setCoefficient(e.target.value)}
                  placeholder="Enter coefficient (e.g., 1.5)"
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-mono"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exponent
                </label>
                <input
                  type="number"
                  value={exponent}
                  onChange={(e) => setExponent(e.target.value)}
                  placeholder="Enter exponent (e.g., 6)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-lg font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.type === 'toScientific' ? (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Scientific Notation Result</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Standard Scientific Notation</div>
                    <div className="text-xl font-mono text-yellow-600">{result.scientific}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Engineering Notation</div>
                    <div className="text-xl font-mono text-orange-600">{result.engineeringNotation}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Original Number</div>
                    <div className="text-lg font-mono text-gray-800">{result.original}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Coefficient</div>
                    <div className="text-lg font-mono text-blue-600">{result.coefficient}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Exponent</div>
                    <div className="text-lg font-mono text-green-600">{result.exponent}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Decimal Result</h3>
                
                <div className="text-center mb-6">
                  <div className="text-2xl font-mono text-blue-600 mb-2">
                    {result.coefficient} × 10^{result.exponent} = {result.formatted}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Exact Decimal Value</div>
                  <div className="text-lg font-mono text-gray-800 break-all">{result.decimal}</div>
                </div>
              </div>
            )}

            {/* Steps */}
            {result.steps && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Steps</h3>
                <div className="space-y-2">
                  {result.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="text-gray-700 font-mono text-sm">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">{example.description}</div>
                <div className="font-mono text-sm">
                  <div className="text-blue-600">{example.decimal}</div>
                  <div className="text-gray-400">↕</div>
                  <div className="text-green-600">{example.scientific}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Scientific Notation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Format</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• a × 10<sup>n</sup> where 1 ≤ |a| &lt; 10</li>
                <li>• Coefficient: significant digits</li>
                <li>• Exponent: power of 10</li>
                <li>• Positive exponent: large numbers</li>
                <li>• Negative exponent: small numbers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Physics and chemistry calculations</li>
                <li>• Astronomy (distances, masses)</li>
                <li>• Engineering measurements</li>
                <li>• Computer science (floating point)</li>
                <li>• Financial modeling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificNotationCalculator;