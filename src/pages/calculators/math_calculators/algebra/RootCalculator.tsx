import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Square as SquareRoot } from 'lucide-react';

const RootCalculator: React.FC = () => {
  const [number, setNumber] = useState('');
  const [rootIndex, setRootIndex] = useState('2');
  const [result, setResult] = useState<number | null>(null);
  const [isPerfectRoot, setIsPerfectRoot] = useState(false);
  const [approximations, setApproximations] = useState<any>(null);

  useEffect(() => {
    calculateRoot();
  }, [number, rootIndex]);

  const calculateRoot = () => {
    const num = parseFloat(number);
    const index = parseFloat(rootIndex);

    if (!num || !index || index === 0) {
      setResult(null);
      setIsPerfectRoot(false);
      setApproximations(null);
      return;
    }

    // Handle negative numbers
    if (num < 0 && index % 2 === 0) {
      setResult(null);
      setIsPerfectRoot(false);
      setApproximations(null);
      return;
    }

    let calculatedResult: number;
    
    if (num < 0 && index % 2 !== 0) {
      // Odd root of negative number
      calculatedResult = -Math.pow(-num, 1 / index);
    } else {
      calculatedResult = Math.pow(num, 1 / index);
    }

    setResult(calculatedResult);

    // Check if it's a perfect root
    const rounded = Math.round(calculatedResult);
    const isPerfect = Math.abs(Math.pow(rounded, index) - num) < 1e-10;
    setIsPerfectRoot(isPerfect);

    // Calculate various approximations
    setApproximations({
      decimal: calculatedResult,
      fraction: convertToFraction(calculatedResult),
      scientific: calculatedResult.toExponential(4),
      rounded: {
        whole: Math.round(calculatedResult),
        oneDecimal: Math.round(calculatedResult * 10) / 10,
        twoDecimal: Math.round(calculatedResult * 100) / 100,
        threeDecimal: Math.round(calculatedResult * 1000) / 1000,
      }
    });
  };

  const convertToFraction = (decimal: number): string => {
    if (Math.abs(decimal - Math.round(decimal)) < 1e-10) {
      return Math.round(decimal).toString();
    }

    const tolerance = 1e-6;
    let numerator = 1;
    let denominator = 1;
    let bestNumerator = 1;
    let bestDenominator = 1;
    let bestError = Math.abs(decimal - 1);

    for (denominator = 1; denominator <= 1000; denominator++) {
      numerator = Math.round(decimal * denominator);
      const error = Math.abs(decimal - numerator / denominator);
      
      if (error < bestError) {
        bestNumerator = numerator;
        bestDenominator = denominator;
        bestError = error;
      }
      
      if (error < tolerance) break;
    }

    if (bestDenominator === 1) {
      return bestNumerator.toString();
    }
    
    return `${bestNumerator}/${bestDenominator}`;
  };

  const commonRoots = [
    { index: '2', name: 'Square Root', symbol: '√' },
    { index: '3', name: 'Cube Root', symbol: '∛' },
    { index: '4', name: 'Fourth Root', symbol: '∜' },
    { index: '5', name: 'Fifth Root', symbol: '⁵√' },
  ];

  const perfectSquares = [1, 4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144, 169, 196, 225, 256, 289, 324, 361, 400];
  const perfectCubes = [1, 8, 27, 64, 125, 216, 343, 512, 729, 1000];

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
        <span className="text-gray-900 font-medium">Root Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <SquareRoot className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Root Calculator</h1>
        </div>

        {/* Common Root Types */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Common Root Types</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {commonRoots.map((root) => (
              <button
                key={root.index}
                onClick={() => setRootIndex(root.index)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  rootIndex === root.index
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-lg">{root.symbol}</div>
                <div className="text-sm">{root.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Root Index (n)</label>
            <input
              type="number"
              value={rootIndex}
              onChange={(e) => setRootIndex(e.target.value)}
              placeholder="Enter root index"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            <div className="text-sm text-gray-600 mt-1">
              n = 2 for square root, n = 3 for cube root, etc.
            </div>
          </div>
        </div>

        {/* Current Expression */}
        {number && rootIndex && (
          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
            <div className="text-lg font-mono text-blue-800">
              {rootIndex === '2' ? '√' : rootIndex === '3' ? '∛' : `${rootIndex}√`}{number}
              {rootIndex !== '2' && rootIndex !== '3' && ` = ${number}^(1/${rootIndex})`}
            </div>
          </div>
        )}

        {/* Results */}
        {result !== null && approximations && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {approximations.decimal.toFixed(8)}
              </div>
              {isPerfectRoot && (
                <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Perfect {rootIndex === '2' ? 'Square' : rootIndex === '3' ? 'Cube' : 'Root'}!
                </div>
              )}
            </div>

            {/* Different Representations */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Different Representations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Exact Decimal</div>
                  <div className="text-lg font-mono text-gray-800">{approximations.decimal.toFixed(12)}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Scientific Notation</div>
                  <div className="text-lg font-mono text-gray-800">{approximations.scientific}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Fraction Approximation</div>
                  <div className="text-lg font-mono text-gray-800">{approximations.fraction}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Rounded (3 decimals)</div>
                  <div className="text-lg font-mono text-gray-800">{approximations.rounded.threeDecimal}</div>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
              <div className="text-center">
                <div className="text-lg text-gray-700 mb-2">
                  ({result.toFixed(6)})^{rootIndex} = {Math.pow(result, parseFloat(rootIndex)).toFixed(6)}
                </div>
                <div className="text-sm text-gray-600">
                  Original number: {number}
                </div>
                <div className="text-sm text-gray-600">
                  Difference: {Math.abs(Math.pow(result, parseFloat(rootIndex)) - parseFloat(number)).toFixed(8)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {number && rootIndex && result === null && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {parseFloat(number) < 0 && parseFloat(rootIndex) % 2 === 0 
              ? 'Cannot calculate even roots of negative numbers in real numbers'
              : 'Invalid input. Please check your values.'}
          </div>
        )}

        {/* Perfect Roots Reference */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect Squares</h3>
            <div className="grid grid-cols-5 gap-2 text-sm">
              {perfectSquares.map((square, index) => (
                <div key={square} className="text-center p-2 bg-white rounded">
                  <div className="font-mono">{Math.sqrt(square)}² = {square}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Perfect Cubes</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {perfectCubes.map((cube, index) => (
                <div key={cube} className="text-center p-2 bg-white rounded">
                  <div className="font-mono">{Math.cbrt(cube)}³ = {cube}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Root Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• ⁿ√(ab) = ⁿ√a × ⁿ√b</li>
                <li>• ⁿ√(a/b) = ⁿ√a / ⁿ√b</li>
                <li>• ⁿ√(aᵐ) = a^(m/n)</li>
                <li>• (ⁿ√a)ⁿ = a</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Special Cases</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Even roots of negative numbers are complex</li>
                <li>• Odd roots of negative numbers are negative</li>
                <li>• ⁿ√0 = 0 for any positive n</li>
                <li>• ⁿ√1 = 1 for any positive n</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RootCalculator;