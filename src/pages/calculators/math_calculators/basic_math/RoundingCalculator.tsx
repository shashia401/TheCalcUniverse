import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, RotateCcw } from 'lucide-react';

const RoundingCalculator: React.FC = () => {
  const [number, setNumber] = useState('');
  const [decimalPlaces, setDecimalPlaces] = useState('2');
  const [roundingMethod, setRoundingMethod] = useState<'standard' | 'up' | 'down' | 'toward-zero' | 'away-zero'>('standard');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateRounding();
  }, [number, decimalPlaces, roundingMethod]);

  const calculateRounding = () => {
    const num = parseFloat(number);
    const places = parseInt(decimalPlaces);

    if (!number || isNaN(num) || isNaN(places) || places < 0) {
      setResult(null);
      return;
    }

    const multiplier = Math.pow(10, places);
    let rounded: number;
    let explanation: string;

    switch (roundingMethod) {
      case 'standard':
        rounded = Math.round(num * multiplier) / multiplier;
        explanation = 'Round to nearest (0.5 rounds up)';
        break;
      case 'up':
        rounded = Math.ceil(num * multiplier) / multiplier;
        explanation = 'Always round up (ceiling)';
        break;
      case 'down':
        rounded = Math.floor(num * multiplier) / multiplier;
        explanation = 'Always round down (floor)';
        break;
      case 'toward-zero':
        rounded = Math.trunc(num * multiplier) / multiplier;
        explanation = 'Round toward zero (truncate)';
        break;
      case 'away-zero':
        rounded = num >= 0 
          ? Math.ceil(num * multiplier) / multiplier
          : Math.floor(num * multiplier) / multiplier;
        explanation = 'Round away from zero';
        break;
      default:
        return;
    }

    // Generate different rounding examples
    const roundingExamples = {
      standard: Math.round(num * multiplier) / multiplier,
      up: Math.ceil(num * multiplier) / multiplier,
      down: Math.floor(num * multiplier) / multiplier,
      towardZero: Math.trunc(num * multiplier) / multiplier,
      awayZero: num >= 0 
        ? Math.ceil(num * multiplier) / multiplier
        : Math.floor(num * multiplier) / multiplier
    };

    // Significant figures rounding
    const significantFigures = [];
    for (let i = 1; i <= 6; i++) {
      const factor = Math.pow(10, i - Math.floor(Math.log10(Math.abs(num))) - 1);
      const sigFigRounded = Math.round(num * factor) / factor;
      significantFigures.push({
        figures: i,
        value: sigFigRounded
      });
    }

    setResult({
      original: num,
      rounded: rounded,
      decimalPlaces: places,
      method: roundingMethod,
      explanation,
      examples: roundingExamples,
      significantFigures,
      steps: generateSteps(num, places, rounded, roundingMethod)
    });
  };

  const generateSteps = (num: number, places: number, result: number, method: string): string[] => {
    const steps = [];
    steps.push(`Original number: ${num}`);
    steps.push(`Rounding to ${places} decimal place${places !== 1 ? 's' : ''}`);
    
    const multiplier = Math.pow(10, places);
    const shifted = num * multiplier;
    
    steps.push(`Multiply by 10^${places}: ${num} × ${multiplier} = ${shifted}`);
    
    switch (method) {
      case 'standard':
        steps.push(`Apply standard rounding: ${shifted} → ${Math.round(shifted)}`);
        break;
      case 'up':
        steps.push(`Round up (ceiling): ${shifted} → ${Math.ceil(shifted)}`);
        break;
      case 'down':
        steps.push(`Round down (floor): ${shifted} → ${Math.floor(shifted)}`);
        break;
      case 'toward-zero':
        steps.push(`Round toward zero (truncate): ${shifted} → ${Math.trunc(shifted)}`);
        break;
      case 'away-zero':
        const awayResult = num >= 0 ? Math.ceil(shifted) : Math.floor(shifted);
        steps.push(`Round away from zero: ${shifted} → ${awayResult}`);
        break;
    }
    
    steps.push(`Divide by 10^${places}: ${Math.round(shifted)} ÷ ${multiplier} = ${result}`);
    
    return steps;
  };

  const roundingMethods = [
    { id: 'standard', name: 'Standard', description: 'Round to nearest (0.5 → up)' },
    { id: 'up', name: 'Round Up', description: 'Always round up (ceiling)' },
    { id: 'down', name: 'Round Down', description: 'Always round down (floor)' },
    { id: 'toward-zero', name: 'Toward Zero', description: 'Truncate (toward zero)' },
    { id: 'away-zero', name: 'Away from Zero', description: 'Round away from zero' },
  ];

  const commonRoundings = [
    { places: 0, name: 'Whole Number' },
    { places: 1, name: '1 Decimal' },
    { places: 2, name: '2 Decimals' },
    { places: 3, name: '3 Decimals' },
    { places: 4, name: '4 Decimals' },
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
        <span className="text-gray-900 font-medium">Rounding Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <RotateCcw className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Rounding Calculator</h1>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number to Round</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter number (e.g., 3.14159)"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Decimal Places</label>
            <input
              type="number"
              value={decimalPlaces}
              onChange={(e) => setDecimalPlaces(e.target.value)}
              min="0"
              max="10"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {commonRoundings.map((rounding) => (
                <button
                  key={rounding.places}
                  onClick={() => setDecimalPlaces(rounding.places.toString())}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {rounding.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Rounding Method Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Rounding Method</label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {roundingMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setRoundingMethod(method.id as any)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  roundingMethod === method.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{method.name}</div>
                <div className="text-xs opacity-75">{method.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Rounded Result</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">
                {result.rounded}
              </div>
              <div className="text-lg text-gray-600 mb-2">
                {result.original} → {result.rounded}
              </div>
              <div className="text-sm text-gray-500">
                {result.explanation}
              </div>
            </div>

            {/* All Rounding Methods Comparison */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison of Rounding Methods</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Standard Rounding</div>
                  <div className="text-lg font-mono text-blue-600">{result.examples.standard}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Round Up (Ceiling)</div>
                  <div className="text-lg font-mono text-green-600">{result.examples.up}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Round Down (Floor)</div>
                  <div className="text-lg font-mono text-orange-600">{result.examples.down}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Toward Zero</div>
                  <div className="text-lg font-mono text-purple-600">{result.examples.towardZero}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Away from Zero</div>
                  <div className="text-lg font-mono text-red-600">{result.examples.awayZero}</div>
                </div>
              </div>
            </div>

            {/* Significant Figures */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Significant Figures</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {result.significantFigures.map((sig: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3 text-center">
                    <div className="text-xs text-gray-600 mb-1">{sig.figures} sig fig{sig.figures !== 1 ? 's' : ''}</div>
                    <div className="text-sm font-mono text-blue-600">{sig.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Process</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Rounding Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Standard Rounding</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• If digit is 5 or greater, round up</li>
                <li>• If digit is less than 5, round down</li>
                <li>• Most common method in mathematics</li>
                <li>• Also called "round half up"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Financial calculations (currency)</li>
                <li>• Scientific measurements</li>
                <li>• Statistical reporting</li>
                <li>• Engineering tolerances</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoundingCalculator;