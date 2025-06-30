import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Hash } from 'lucide-react';

const FactorialCalculator: React.FC = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateFactorial();
  }, [number]);

  const factorial = (n: number): bigint => {
    if (n < 0) throw new Error('Factorial is not defined for negative numbers');
    if (n === 0 || n === 1) return BigInt(1);
    
    let result = BigInt(1);
    for (let i = 2; i <= n; i++) {
      result *= BigInt(i);
    }
    return result;
  };

  const calculateFactorial = () => {
    const num = parseInt(number);
    
    if (!number || isNaN(num)) {
      setResult(null);
      return;
    }

    if (num < 0) {
      setResult({ error: 'Factorial is not defined for negative numbers' });
      return;
    }

    if (num > 170) {
      setResult({ error: 'Number too large. Please enter a number ≤ 170' });
      return;
    }

    try {
      const factorialResult = factorial(num);
      const steps = [];
      
      if (num === 0) {
        steps.push('0! = 1 (by definition)');
      } else if (num === 1) {
        steps.push('1! = 1');
      } else {
        steps.push(`${num}! = ${Array.from({length: num}, (_, i) => i + 1).join(' × ')}`);
        
        // Show intermediate calculations for small numbers
        if (num <= 10) {
          let temp = 1;
          for (let i = 1; i <= num; i++) {
            temp *= i;
            steps.push(`${i}! = ${temp}`);
          }
        }
      }

      setResult({
        number: num,
        factorial: factorialResult.toString(),
        steps,
        approximation: num > 20 ? stirlingApproximation(num) : null
      });
    } catch (error) {
      setResult({ error: 'Error calculating factorial' });
    }
  };

  const stirlingApproximation = (n: number): string => {
    // Stirling's approximation: n! ≈ √(2πn) * (n/e)^n
    const result = Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
    return result.toExponential(4);
  };

  const factorialFacts = [
    { n: 0, fact: '1', description: 'By definition' },
    { n: 1, fact: '1', description: 'Base case' },
    { n: 2, fact: '2', description: '2 × 1' },
    { n: 3, fact: '6', description: '3 × 2 × 1' },
    { n: 4, fact: '24', description: '4 × 3 × 2 × 1' },
    { n: 5, fact: '120', description: '5 × 4 × 3 × 2 × 1' },
    { n: 6, fact: '720', description: '6!' },
    { n: 7, fact: '5040', description: '7!' },
    { n: 8, fact: '40320', description: '8!' },
    { n: 9, fact: '362880', description: '9!' },
    { n: 10, fact: '3628800', description: '10!' },
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
        <span className="text-gray-900 font-medium">Factorial Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Hash className="w-8 h-8 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Factorial Calculator</h1>
        </div>

        {/* Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter a non-negative integer (n ≤ 170)
          </label>
          <input
            type="number"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            placeholder="Enter number (e.g., 5)"
            min="0"
            max="170"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {result.error}
              </div>
            ) : (
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
                  <div className="text-2xl font-bold text-red-600 mb-2">
                    {result.number}! = {result.factorial}
                  </div>
                  {result.approximation && (
                    <div className="text-sm text-gray-600 mt-4">
                      Stirling's Approximation: ≈ {result.approximation}
                    </div>
                  )}
                </div>

                {/* Steps */}
                {result.steps && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Steps</h3>
                    <div className="space-y-2">
                      {result.steps.map((step: string, index: number) => (
                        <div key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <div className="text-gray-700 font-mono text-sm">{step}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Factorial Table */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Factorial Reference Table</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {factorialFacts.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-center">
                <div className="text-lg font-mono text-red-600">{item.n}! = {item.fact}</div>
                <div className="text-xs text-gray-500">{item.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Factorials</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• n! = n × (n-1) × (n-2) × ... × 2 × 1</li>
                <li>• 0! = 1 (by definition)</li>
                <li>• Only defined for non-negative integers</li>
                <li>• Grows very rapidly</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Permutations and combinations</li>
                <li>• Probability calculations</li>
                <li>• Series expansions</li>
                <li>• Gamma function</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactorialCalculator;