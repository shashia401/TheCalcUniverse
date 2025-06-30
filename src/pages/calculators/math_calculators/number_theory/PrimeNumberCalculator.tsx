import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Hash, CheckCircle, XCircle } from 'lucide-react';

const PrimeNumberCalculator: React.FC = () => {
  const [number, setNumber] = useState('');
  const [range, setRange] = useState({ start: '', end: '' });
  const [calculationType, setCalculationType] = useState<'check' | 'list' | 'nth'>('check');
  const [nthPrime, setNthPrime] = useState('');
  const [result, setResult] = useState<any>(null);

  const isPrime = (n: number): boolean => {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    
    for (let i = 3; i <= Math.sqrt(n); i += 2) {
      if (n % i === 0) return false;
    }
    return true;
  };

  const getPrimeFactors = (n: number): number[] => {
    const factors: number[] = [];
    let divisor = 2;
    
    while (divisor * divisor <= n) {
      while (n % divisor === 0) {
        factors.push(divisor);
        n /= divisor;
      }
      divisor++;
    }
    
    if (n > 1) {
      factors.push(n);
    }
    
    return factors;
  };

  const generatePrimes = (start: number, end: number): number[] => {
    const primes: number[] = [];
    for (let i = Math.max(2, start); i <= end; i++) {
      if (isPrime(i)) {
        primes.push(i);
      }
    }
    return primes;
  };

  const getNthPrime = (n: number): number => {
    if (n < 1) return 0;
    
    const primes: number[] = [2];
    let candidate = 3;
    
    while (primes.length < n) {
      if (isPrime(candidate)) {
        primes.push(candidate);
      }
      candidate += 2;
    }
    
    return primes[n - 1];
  };

  const handleCalculation = () => {
    if (calculationType === 'check') {
      const num = parseInt(number);
      if (isNaN(num) || num < 1) return;
      
      const prime = isPrime(num);
      const factors = getPrimeFactors(num);
      
      setResult({
        type: 'check',
        number: num,
        isPrime: prime,
        factors: factors,
        nextPrime: prime ? null : generatePrimes(num + 1, num + 100)[0],
        previousPrime: num > 2 ? generatePrimes(Math.max(2, num - 100), num - 1).slice(-1)[0] : null
      });
    } else if (calculationType === 'list') {
      const start = parseInt(range.start) || 1;
      const end = parseInt(range.end) || 100;
      
      if (start > end || end - start > 10000) return;
      
      const primes = generatePrimes(start, end);
      
      setResult({
        type: 'list',
        start,
        end,
        primes,
        count: primes.length
      });
    } else if (calculationType === 'nth') {
      const n = parseInt(nthPrime);
      if (isNaN(n) || n < 1 || n > 10000) return;
      
      const prime = getNthPrime(n);
      
      setResult({
        type: 'nth',
        position: n,
        prime
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
        <span className="text-gray-900 font-medium">Prime Number Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Hash className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Prime Number Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCalculationType('check')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'check'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Check Prime</div>
              <div className="text-sm opacity-75">Test if a number is prime</div>
            </button>
            <button
              onClick={() => setCalculationType('list')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'list'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">List Primes</div>
              <div className="text-sm opacity-75">Find primes in a range</div>
            </button>
            <button
              onClick={() => setCalculationType('nth')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'nth'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Nth Prime</div>
              <div className="text-sm opacity-75">Find the nth prime number</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="mb-8">
          {calculationType === 'check' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number to Check
              </label>
              <input
                type="number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder="Enter a number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            </div>
          )}

          {calculationType === 'list' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Range
                </label>
                <input
                  type="number"
                  value={range.start}
                  onChange={(e) => setRange({...range, start: e.target.value})}
                  placeholder="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Range
                </label>
                <input
                  type="number"
                  value={range.end}
                  onChange={(e) => setRange({...range, end: e.target.value})}
                  placeholder="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          )}

          {calculationType === 'nth' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position (n)
              </label>
              <input
                type="number"
                value={nthPrime}
                onChange={(e) => setNthPrime(e.target.value)}
                placeholder="Enter position (e.g., 10 for 10th prime)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={handleCalculation}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.type === 'check' && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6">
                <div className="flex items-center justify-center mb-6">
                  {result.isPrime ? (
                    <CheckCircle className="w-16 h-16 text-green-500 mr-4" />
                  ) : (
                    <XCircle className="w-16 h-16 text-red-500 mr-4" />
                  )}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{result.number}</div>
                    <div className={`text-xl font-semibold ${result.isPrime ? 'text-green-600' : 'text-red-600'}`}>
                      {result.isPrime ? 'IS PRIME' : 'IS NOT PRIME'}
                    </div>
                  </div>
                </div>

                {!result.isPrime && (
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Prime Factorization</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.factors.map((factor: number, index: number) => (
                        <span key={index} className="px-3 py-1 bg-red-100 text-red-800 rounded-lg font-mono">
                          {factor}
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      {result.number} = {result.factors.join(' × ')}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.previousPrime && (
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Previous Prime</div>
                      <div className="text-2xl font-bold text-blue-600">{result.previousPrime}</div>
                    </div>
                  )}
                  {result.nextPrime && (
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Next Prime</div>
                      <div className="text-2xl font-bold text-green-600">{result.nextPrime}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {result.type === 'list' && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Prime Numbers from {result.start} to {result.end}
                </h3>
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-center mb-4">
                    <span className="text-2xl font-bold text-blue-600">{result.count}</span>
                    <span className="text-gray-600 ml-2">prime numbers found</span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto">
                    {result.primes.map((prime: number, index: number) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg font-mono">
                        {prime}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {result.type === 'nth' && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  The {result.position}{result.position === 1 ? 'st' : result.position === 2 ? 'nd' : result.position === 3 ? 'rd' : 'th'} Prime Number
                </h3>
                <div className="text-4xl font-bold text-green-600 mb-2">{result.prime}</div>
                <div className="text-gray-600">Position #{result.position} in the sequence of prime numbers</div>
              </div>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Prime Numbers</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <p>• A prime number is a natural number greater than 1 that has no positive divisors other than 1 and itself.</p>
            <p>• The first few prime numbers are: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47...</p>
            <p>• 2 is the only even prime number; all other primes are odd.</p>
            <p>• There are infinitely many prime numbers (proven by Euclid around 300 BC).</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimeNumberCalculator;