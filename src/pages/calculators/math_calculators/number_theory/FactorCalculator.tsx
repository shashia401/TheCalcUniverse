import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Hash, Divide } from 'lucide-react';

const FactorCalculator: React.FC = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<any>(null);

  const findFactors = (n: number): number[] => {
    const factors: number[] = [];
    
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        factors.push(i);
        if (i !== n / i) {
          factors.push(n / i);
        }
      }
    }
    
    return factors.sort((a, b) => a - b);
  };

  const calculateFactors = () => {
    const num = parseInt(number);
    
    if (!number || isNaN(num) || num <= 0) {
      setResult({ error: "Please enter a positive integer" });
      return;
    }
    
    const factors = findFactors(num);
    const isPrime = factors.length === 2; // Only 1 and itself
    
    // Find prime factorization
    const primeFactors: number[] = [];
    let n = num;
    let divisor = 2;
    
    while (n > 1) {
      while (n % divisor === 0) {
        primeFactors.push(divisor);
        n /= divisor;
      }
      divisor++;
      
      // Optimization: if divisor > sqrt(n), then n is prime
      if (divisor * divisor > n && n > 1) {
        primeFactors.push(n);
        break;
      }
    }
    
    // Generate exponent form of prime factorization
    const primeFactorCounts: { [key: number]: number } = {};
    primeFactors.forEach(factor => {
      primeFactorCounts[factor] = (primeFactorCounts[factor] || 0) + 1;
    });
    
    const primeFactorizationExponent = Object.entries(primeFactorCounts)
      .map(([factor, count]) => count === 1 ? factor : `${factor}^${count}`)
      .join(' × ');
    
    // Calculate factor pairs
    const factorPairs: [number, number][] = [];
    for (let i = 0; i < factors.length / 2; i++) {
      factorPairs.push([factors[i], factors[factors.length - 1 - i]]);
    }
    
    // Calculate sum and product of factors
    const factorSum = factors.reduce((sum, factor) => sum + factor, 0);
    const properFactorSum = factorSum - num; // Sum of factors excluding the number itself
    
    // Check if it's a perfect number (sum of proper factors equals the number)
    const isPerfect = properFactorSum === num;
    
    // Check if it's a deficient or abundant number
    const abundanceType = properFactorSum < num ? 'deficient' : (properFactorSum > num ? 'abundant' : 'perfect');
    
    setResult({
      number: num,
      factors,
      factorCount: factors.length,
      isPrime,
      primeFactors,
      primeFactorizationExponent,
      factorPairs,
      factorSum,
      properFactorSum,
      isPerfect,
      abundanceType
    });
  };

  const examples = [
    { number: 12, factors: '1, 2, 3, 4, 6, 12', type: '6 factors' },
    { number: 28, factors: '1, 2, 4, 7, 14, 28', type: 'Perfect number' },
    { number: 36, factors: '1, 2, 3, 4, 6, 9, 12, 18, 36', type: '9 factors' },
    { number: 97, factors: '1, 97', type: 'Prime number' },
    { number: 120, factors: '1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60, 120', type: '16 factors' },
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
        <span className="text-gray-900 font-medium">Factor Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Hash className="w-8 h-8 text-teal-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Factor Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter a Positive Integer
          </label>
          <div className="flex space-x-4">
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g., 36"
              min="1"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
            />
            <button
              onClick={calculateFactors}
              className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-semibold"
            >
              Find Factors
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-800 mb-1">{ex.type}</div>
                <div className="font-mono text-xs text-gray-600 mb-2 truncate">
                  Factors of {ex.number}: {ex.factors}
                </div>
                <button
                  onClick={() => setNumber(ex.number.toString())}
                  className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors"
                >
                  Try This
                </button>
              </div>
            ))}
          </div>
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
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Factors of {result.number}</h3>
                  
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <div className="text-sm text-gray-600 mb-2">All Factors ({result.factorCount})</div>
                    <div className="flex flex-wrap gap-2">
                      {result.factors.map((factor: number, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-2 bg-teal-100 text-teal-800 rounded-lg font-mono"
                        >
                          {factor}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Number Type</div>
                      <div className="text-lg font-semibold text-teal-600">
                        {result.isPrime ? 'Prime Number' : 'Composite Number'}
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Sum of Factors</div>
                      <div className="text-lg font-semibold text-blue-600">{result.factorSum}</div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Abundance</div>
                      <div className="text-lg font-semibold text-purple-600 capitalize">{result.abundanceType}</div>
                    </div>
                  </div>
                </div>

                {/* Prime Factorization */}
                <div className="bg-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Prime Factorization</h3>
                  <div className="text-center">
                    <div className="text-xl font-mono text-blue-600 mb-2">
                      {result.primeFactorizationExponent}
                    </div>
                    <div className="text-gray-600">
                      {result.number} = {result.primeFactors.join(' × ')}
                    </div>
                  </div>
                </div>

                {/* Factor Pairs */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Factor Pairs</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {result.factorPairs.map((pair: [number, number], index: number) => (
                      <div key={index} className="bg-white rounded-lg p-3 text-center">
                        <div className="font-mono text-gray-800">
                          {pair[0]} × {pair[1]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Special Properties */}
                {result.isPerfect && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <div className="text-green-800 font-semibold">
                      {result.number} is a Perfect Number!
                    </div>
                    <div className="text-sm text-green-700 mt-1">
                      The sum of its proper divisors ({result.properFactorSum}) equals the number itself.
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Factors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">What are Factors?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Factors are numbers that divide another number exactly (with no remainder)</li>
                <li>• Every number has at least two factors: 1 and itself</li>
                <li>• Prime numbers have exactly two factors</li>
                <li>• Composite numbers have more than two factors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Special Number Types</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Perfect Number: Sum of proper divisors equals the number (e.g., 6, 28)</li>
                <li>• Deficient Number: Sum of proper divisors is less than the number</li>
                <li>• Abundant Number: Sum of proper divisors exceeds the number</li>
                <li>• Prime Number: Has exactly two factors (1 and itself)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactorCalculator;