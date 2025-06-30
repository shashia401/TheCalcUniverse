import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Hash, Divide } from 'lucide-react';

const PrimeFactorizationCalculator: React.FC = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState<any>(null);

  const findPrimeFactors = (n: number): number[] => {
    const factors: number[] = [];
    let divisor = 2;
    
    while (n > 1) {
      while (n % divisor === 0) {
        factors.push(divisor);
        n /= divisor;
      }
      divisor++;
      
      // Optimization: if divisor > sqrt(n), then n is prime
      if (divisor * divisor > n && n > 1) {
        factors.push(n);
        break;
      }
    }
    
    return factors;
  };

  const calculateFactorization = () => {
    const num = parseInt(number);
    
    if (!number || isNaN(num) || num <= 0) {
      setResult({ error: "Please enter a positive integer" });
      return;
    }
    
    if (num === 1) {
      setResult({
        number: 1,
        factors: [],
        isPrime: false,
        steps: ["1 has no prime factors"],
        exponentForm: "1"
      });
      return;
    }
    
    const factors = findPrimeFactors(num);
    const isPrime = factors.length === 1 && factors[0] === num;
    
    // Generate steps
    const steps = [];
    steps.push(`Finding prime factorization of ${num}:`);
    
    if (isPrime) {
      steps.push(`${num} is a prime number and cannot be factored further.`);
    } else {
      let currentNumber = num;
      let currentFactors: number[] = [];
      let divisor = 2;
      
      while (currentNumber > 1) {
        if (currentNumber % divisor === 0) {
          currentFactors.push(divisor);
          currentNumber /= divisor;
          steps.push(`${divisor} is a factor. ${num} = ${currentFactors.join(' × ')} × ${currentNumber === 1 ? '' : currentNumber}`);
        } else {
          divisor++;
          
          // Optimization: if divisor > sqrt(currentNumber), then currentNumber is prime
          if (divisor * divisor > currentNumber && currentNumber > 1) {
            currentFactors.push(currentNumber);
            steps.push(`${currentNumber} is a prime factor. ${num} = ${currentFactors.join(' × ')}`);
            break;
          }
        }
      }
    }
    
    // Generate exponent form
    const exponentForm = generateExponentForm(factors);
    
    // Find factor pairs
    const factorPairs = findFactorPairs(num);
    
    setResult({
      number: num,
      factors,
      isPrime,
      steps,
      exponentForm,
      factorPairs
    });
  };

  const generateExponentForm = (factors: number[]): string => {
    if (factors.length === 0) return "1";
    
    const counts: { [key: number]: number } = {};
    factors.forEach(factor => {
      counts[factor] = (counts[factor] || 0) + 1;
    });
    
    return Object.entries(counts)
      .map(([factor, count]) => count === 1 ? factor : `${factor}^${count}`)
      .join(' × ');
  };

  const findFactorPairs = (n: number): [number, number][] => {
    const pairs: [number, number][] = [];
    
    for (let i = 1; i <= Math.sqrt(n); i++) {
      if (n % i === 0) {
        pairs.push([i, n / i]);
      }
    }
    
    return pairs;
  };

  const examples = [
    { number: 12, result: '2² × 3' },
    { number: 60, result: '2² × 3 × 5' },
    { number: 100, result: '2² × 5²' },
    { number: 2310, result: '2 × 3 × 5 × 7 × 11' },
    { number: 997, result: '997 (prime)' },
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
        <span className="text-gray-900 font-medium">Prime Factorization Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Divide className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Prime Factorization Calculator</h1>
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
              placeholder="e.g., 60"
              min="1"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
            <button
              onClick={calculateFactorization}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              Factorize
            </button>
          </div>
        </div>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm">
                    <span className="text-gray-600">{ex.number}</span>
                    <span className="text-gray-400 mx-2">=</span>
                    <span className="text-indigo-600">{ex.result}</span>
                  </div>
                  <button
                    onClick={() => setNumber(ex.number.toString())}
                    className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                  >
                    Try
                  </button>
                </div>
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
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Prime Factorization</h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {result.exponentForm}
                    </div>
                    <div className="text-gray-600">
                      {result.number} = {result.factors.join(' × ') || '1'}
                    </div>
                    {result.isPrime && (
                      <div className="mt-2 inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        Prime Number
                      </div>
                    )}
                  </div>
                  
                  {/* Factor Tree Visualization */}
                  {!result.isPrime && result.factors.length > 0 && (
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-2">Prime Factors</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {result.factors.map((factor: number, index: number) => (
                          <div key={index} className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-mono">
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Factor Pairs */}
                {result.factorPairs && result.factorPairs.length > 0 && (
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">All Factor Pairs</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {result.factorPairs.map((pair: [number, number], index: number) => (
                        <div key={index} className="bg-white rounded-lg p-3 text-center">
                          <div className="font-mono text-blue-600">
                            {pair[0]} × {pair[1]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Steps */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
                  <div className="space-y-2">
                    {result.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="text-gray-700 font-mono text-sm">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Prime Factorization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">What is Prime Factorization?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Breaking down a number into a product of prime numbers</li>
                <li>• Every integer greater than 1 has a unique prime factorization</li>
                <li>• Prime numbers have exactly one prime factorization (themselves)</li>
                <li>• The number 1 has no prime factorization</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Finding GCD and LCM</li>
                <li>• Simplifying fractions</li>
                <li>• Cryptography (RSA algorithm)</li>
                <li>• Number theory problems</li>
                <li>• Divisibility tests</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeFactorizationCalculator;