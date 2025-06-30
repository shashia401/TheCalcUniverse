import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3 } from 'lucide-react';

const RatioCalculator: React.FC = () => {
  const [ratio1, setRatio1] = useState('');
  const [ratio2, setRatio2] = useState('');
  const [total, setTotal] = useState('');
  const [calculationType, setCalculationType] = useState<'simplify' | 'proportion' | 'parts'>('simplify');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateRatio();
  }, [ratio1, ratio2, total, calculationType]);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const calculateRatio = () => {
    const r1 = parseFloat(ratio1);
    const r2 = parseFloat(ratio2);
    const t = parseFloat(total);

    if (calculationType === 'simplify' && r1 && r2) {
      const divisor = gcd(r1, r2);
      setResult({
        simplified: `${r1/divisor}:${r2/divisor}`,
        decimal: (r1/r2).toFixed(4),
        percentage: `${((r1/(r1+r2)) * 100).toFixed(2)}% : ${((r2/(r1+r2)) * 100).toFixed(2)}%`
      });
    } else if (calculationType === 'parts' && r1 && r2 && t) {
      const totalParts = r1 + r2;
      const part1 = (r1 / totalParts) * t;
      const part2 = (r2 / totalParts) * t;
      setResult({
        part1: part1.toFixed(2),
        part2: part2.toFixed(2),
        verification: `${part1.toFixed(2)} + ${part2.toFixed(2)} = ${(part1 + part2).toFixed(2)}`
      });
    }
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
        <span className="text-gray-900 font-medium">Ratio Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Ratio Calculator</h1>
        </div>

        {/* Calculation Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCalculationType('simplify')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'simplify'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Simplify Ratio</div>
              <div className="text-sm opacity-75">Reduce ratio to lowest terms</div>
            </button>
            <button
              onClick={() => setCalculationType('parts')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'parts'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Divide by Ratio</div>
              <div className="text-sm opacity-75">Split total by ratio</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Value</label>
            <input
              type="number"
              value={ratio1}
              onChange={(e) => setRatio1(e.target.value)}
              placeholder="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Second Value</label>
            <input
              type="number"
              value={ratio2}
              onChange={(e) => setRatio2(e.target.value)}
              placeholder="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          {calculationType === 'parts' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total to Divide</label>
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Results</h3>
            
            {calculationType === 'simplify' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Simplified Ratio</div>
                  <div className="text-xl font-bold text-purple-600">{result.simplified}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Decimal Form</div>
                  <div className="text-xl font-bold text-blue-600">{result.decimal}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Percentage</div>
                  <div className="text-lg font-bold text-green-600">{result.percentage}</div>
                </div>
              </div>
            )}

            {calculationType === 'parts' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">First Part</div>
                    <div className="text-2xl font-bold text-purple-600">{result.part1}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Second Part</div>
                    <div className="text-2xl font-bold text-blue-600">{result.part2}</div>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Verification</div>
                  <div className="text-lg font-mono text-gray-800">{result.verification}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RatioCalculator;