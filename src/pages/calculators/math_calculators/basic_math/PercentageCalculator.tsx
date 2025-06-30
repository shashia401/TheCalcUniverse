import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Percent } from 'lucide-react';

const PercentageCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'basic' | 'increase' | 'decrease' | 'difference'>('basic');
  
  // Basic percentage calculation
  const [value, setValue] = useState('');
  const [percentage, setPercentage] = useState('');
  
  // Percentage change calculation
  const [originalValue, setOriginalValue] = useState('');
  const [newValue, setNewValue] = useState('');
  
  // Results
  const [result, setResult] = useState<number | null>(null);
  const [changeResult, setChangeResult] = useState<{percentage: number, difference: number} | null>(null);

  useEffect(() => {
    calculatePercentage();
  }, [calculationType, value, percentage, originalValue, newValue]);

  const calculatePercentage = () => {
    try {
      if (calculationType === 'basic' && value && percentage) {
        const val = parseFloat(value);
        const perc = parseFloat(percentage);
        const result = (val * perc) / 100;
        setResult(result);
        setChangeResult(null);
      } else if (calculationType === 'increase' && originalValue && percentage) {
        const original = parseFloat(originalValue);
        const perc = parseFloat(percentage);
        const increase = (original * perc) / 100;
        const newVal = original + increase;
        setResult(newVal);
        setChangeResult(null);
      } else if (calculationType === 'decrease' && originalValue && percentage) {
        const original = parseFloat(originalValue);
        const perc = parseFloat(percentage);
        const decrease = (original * perc) / 100;
        const newVal = original - decrease;
        setResult(newVal);
        setChangeResult(null);
      } else if (calculationType === 'difference' && originalValue && newValue) {
        const original = parseFloat(originalValue);
        const newVal = parseFloat(newValue);
        const difference = newVal - original;
        const percentageChange = (difference / original) * 100;
        setChangeResult({ percentage: percentageChange, difference });
        setResult(null);
      } else {
        setResult(null);
        setChangeResult(null);
      }
    } catch (error) {
      setResult(null);
      setChangeResult(null);
    }
  };

  const calculationTypes = [
    {
      id: 'basic',
      name: 'Basic Percentage',
      description: 'Calculate X% of a number',
      example: '25% of 200 = 50'
    },
    {
      id: 'increase',
      name: 'Percentage Increase',
      description: 'Add X% to a number',
      example: '200 + 25% = 250'
    },
    {
      id: 'decrease',
      name: 'Percentage Decrease',
      description: 'Subtract X% from a number',
      example: '200 - 25% = 150'
    },
    {
      id: 'difference',
      name: 'Percentage Difference',
      description: 'Find % change between two numbers',
      example: 'From 200 to 250 = +25%'
    }
  ];

  const formatNumber = (num: number) => {
    return parseFloat(num.toFixed(6)).toString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Percentage Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Percent className="w-8 h-8 text-pink-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Percentage Calculator</h1>
            </div>

            {/* Calculation Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Select Calculation Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {calculationTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setCalculationType(type.id as any)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      calculationType === type.id
                        ? 'border-pink-500 bg-pink-50 text-pink-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="font-semibold mb-1">{type.name}</div>
                    <div className="text-sm opacity-75 mb-2">{type.description}</div>
                    <div className="text-xs font-mono bg-white bg-opacity-50 px-2 py-1 rounded">
                      {type.example}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input Fields */}
            <div className="space-y-6">
              {calculationType === 'basic' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Number
                    </label>
                    <input
                      type="number"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="200"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>
              )}

              {(calculationType === 'increase' || calculationType === 'decrease') && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Value
                    </label>
                    <input
                      type="number"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                      placeholder="200"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage (%)
                    </label>
                    <input
                      type="number"
                      value={percentage}
                      onChange={(e) => setPercentage(e.target.value)}
                      placeholder="25"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>
              )}

              {calculationType === 'difference' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Value
                    </label>
                    <input
                      type="number"
                      value={originalValue}
                      onChange={(e) => setOriginalValue(e.target.value)}
                      placeholder="200"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Value
                    </label>
                    <input
                      type="number"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="250"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>
              )}

              {/* Results */}
              {result !== null && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
                  <div className="text-4xl font-bold text-pink-600 mb-2">
                    {formatNumber(result)}
                  </div>
                  <div className="text-gray-600">
                    {calculationType === 'basic' && `${percentage}% of ${value}`}
                    {calculationType === 'increase' && `${originalValue} + ${percentage}%`}
                    {calculationType === 'decrease' && `${originalValue} - ${percentage}%`}
                  </div>
                </div>
              )}

              {changeResult && (
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Percentage Change</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${
                        changeResult.percentage >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {changeResult.percentage >= 0 ? '+' : ''}{formatNumber(changeResult.percentage)}%
                      </div>
                      <div className="text-gray-600">Percentage Change</div>
                    </div>
                    <div className="text-center">
                      <div className={`text-3xl font-bold mb-2 ${
                        changeResult.difference >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {changeResult.difference >= 0 ? '+' : ''}{formatNumber(changeResult.difference)}
                      </div>
                      <div className="text-gray-600">Absolute Difference</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Percentage Formulas</h2>
            <div className="space-y-4 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800">Basic Percentage</h3>
                <p className="text-gray-600 font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                  (Number × Percentage) ÷ 100
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Percentage Increase</h3>
                <p className="text-gray-600 font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                  Original + (Original × Percentage ÷ 100)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Percentage Decrease</h3>
                <p className="text-gray-600 font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                  Original - (Original × Percentage ÷ 100)
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Percentage Change</h3>
                <p className="text-gray-600 font-mono text-xs bg-gray-50 p-2 rounded mt-1">
                  ((New - Original) ÷ Original) × 100
                </p>
              </div>
            </div>
          </div>

          <div className="bg-pink-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-pink-900 mb-3">Common Uses</h3>
            <ul className="text-pink-800 text-sm space-y-2">
              <li>• Sales tax calculations</li>
              <li>• Discount and markup pricing</li>
              <li>• Grade and test score analysis</li>
              <li>• Financial growth rates</li>
              <li>• Statistical data analysis</li>
              <li>• Tip calculations</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Quick Examples</h3>
            <div className="space-y-3 text-blue-800 text-sm">
              <div>
                <div className="font-semibold">Sales Tax (8.5%)</div>
                <div>$100 item → $108.50 total</div>
              </div>
              <div>
                <div className="font-semibold">20% Discount</div>
                <div>$50 item → $40 final price</div>
              </div>
              <div>
                <div className="font-semibold">Stock Growth</div>
                <div>$100 → $120 = +20% increase</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentageCalculator;