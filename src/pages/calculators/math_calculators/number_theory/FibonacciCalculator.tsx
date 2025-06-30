import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp } from 'lucide-react';

const FibonacciCalculator: React.FC = () => {
  const [n, setN] = useState('');
  const [calculationType, setCalculationType] = useState<'nth' | 'sequence' | 'check'>('nth');
  const [checkNumber, setCheckNumber] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateFibonacci();
  }, [n, calculationType, checkNumber]);

  const fibonacci = (num: number): bigint => {
    if (num <= 0) return BigInt(0);
    if (num === 1) return BigInt(1);
    
    let a = BigInt(0);
    let b = BigInt(1);
    
    for (let i = 2; i <= num; i++) {
      [a, b] = [b, a + b];
    }
    
    return b;
  };

  const fibonacciSequence = (count: number): bigint[] => {
    if (count <= 0) return [];
    if (count === 1) return [BigInt(0)];
    if (count === 2) return [BigInt(0), BigInt(1)];
    
    const sequence = [BigInt(0), BigInt(1)];
    
    for (let i = 2; i < count; i++) {
      sequence.push(sequence[i - 1] + sequence[i - 2]);
    }
    
    return sequence;
  };

  const isFibonacci = (num: number): { isFib: boolean; position?: number } => {
    if (num < 0) return { isFib: false };
    if (num === 0) return { isFib: true, position: 0 };
    if (num === 1) return { isFib: true, position: 1 };
    
    let a = 0;
    let b = 1;
    let position = 1;
    
    while (b < num) {
      [a, b] = [b, a + b];
      position++;
    }
    
    return b === num ? { isFib: true, position } : { isFib: false };
  };

  const goldenRatio = (1 + Math.sqrt(5)) / 2;

  const binetFormula = (num: number): number => {
    return Math.round((Math.pow(goldenRatio, num) - Math.pow(-goldenRatio, -num)) / Math.sqrt(5));
  };

  const calculateFibonacci = () => {
    if (calculationType === 'nth') {
      const num = parseInt(n);
      if (!n || isNaN(num) || num < 0) {
        setResult(null);
        return;
      }

      if (num > 1000) {
        setResult({ error: 'Number too large. Please enter n ≤ 1000' });
        return;
      }

      const fibResult = fibonacci(num);
      const binet = num <= 70 ? binetFormula(num) : null; // Binet's formula loses precision for large n

      setResult({
        type: 'nth',
        n: num,
        fibonacci: fibResult.toString(),
        binet: binet,
        ratio: num > 1 ? (Number(fibResult) / Number(fibonacci(num - 1))).toFixed(10) : null
      });
    } else if (calculationType === 'sequence') {
      const count = parseInt(n);
      if (!n || isNaN(count) || count <= 0) {
        setResult(null);
        return;
      }

      if (count > 100) {
        setResult({ error: 'Sequence too long. Please enter count ≤ 100' });
        return;
      }

      const sequence = fibonacciSequence(count);
      const ratios = [];
      
      for (let i = 2; i < sequence.length; i++) {
        const ratio = Number(sequence[i]) / Number(sequence[i - 1]);
        ratios.push(ratio);
      }

      setResult({
        type: 'sequence',
        count,
        sequence: sequence.map(f => f.toString()),
        ratios: ratios.slice(-10) // Last 10 ratios
      });
    } else if (calculationType === 'check') {
      const num = parseInt(checkNumber);
      if (!checkNumber || isNaN(num) || num < 0) {
        setResult(null);
        return;
      }

      const fibCheck = isFibonacci(num);
      
      setResult({
        type: 'check',
        number: num,
        isFibonacci: fibCheck.isFib,
        position: fibCheck.position
      });
    }
  };

  const fibonacciFacts = [
    { n: 0, fib: '0' },
    { n: 1, fib: '1' },
    { n: 2, fib: '1' },
    { n: 3, fib: '2' },
    { n: 4, fib: '3' },
    { n: 5, fib: '5' },
    { n: 6, fib: '8' },
    { n: 7, fib: '13' },
    { n: 8, fib: '21' },
    { n: 9, fib: '34' },
    { n: 10, fib: '55' },
    { n: 11, fib: '89' },
    { n: 12, fib: '144' },
    { n: 13, fib: '233' },
    { n: 14, fib: '377' },
    { n: 15, fib: '610' },
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
        <span className="text-gray-900 font-medium">Fibonacci Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Fibonacci Calculator</h1>
        </div>

        {/* Calculation Type */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCalculationType('nth')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'nth'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Nth Fibonacci</div>
              <div className="text-sm opacity-75">Find the nth number</div>
            </button>
            <button
              onClick={() => setCalculationType('sequence')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'sequence'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Sequence</div>
              <div className="text-sm opacity-75">Generate sequence</div>
            </button>
            <button
              onClick={() => setCalculationType('check')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'check'
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Check Number</div>
              <div className="text-sm opacity-75">Is it Fibonacci?</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="mb-8">
          {calculationType === 'check' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number to Check
              </label>
              <input
                type="number"
                value={checkNumber}
                onChange={(e) => setCheckNumber(e.target.value)}
                placeholder="Enter number to check"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {calculationType === 'nth' ? 'Position (n)' : 'Count'}
              </label>
              <input
                type="number"
                value={n}
                onChange={(e) => setN(e.target.value)}
                placeholder={calculationType === 'nth' ? 'Enter position (e.g., 10)' : 'Enter count (e.g., 15)'}
                min="0"
                max={calculationType === 'nth' ? '1000' : '100'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
              />
            </div>
          )}
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
                {result.type === 'nth' && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nth Fibonacci Number</h3>
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      F({result.n}) = {result.fibonacci}
                    </div>
                    {result.binet && (
                      <div className="text-sm text-gray-600 mt-4">
                        Binet's Formula Result: {result.binet}
                      </div>
                    )}
                    {result.ratio && (
                      <div className="text-sm text-gray-600 mt-2">
                        Ratio to Previous: {result.ratio} (approaching φ = 1.618...)
                      </div>
                    )}
                  </div>
                )}

                {result.type === 'sequence' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Fibonacci Sequence (First {result.count} numbers)</h3>
                      <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                        {result.sequence.map((fib: string, index: number) => (
                          <div key={index} className="bg-white rounded-lg p-2 text-center">
                            <div className="text-xs text-gray-500">F({index})</div>
                            <div className="font-mono text-sm text-orange-600">{fib}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {result.ratios.length > 0 && (
                      <div className="bg-blue-50 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Golden Ratio Convergence</h3>
                        <div className="text-sm text-gray-600 mb-3">
                          Ratios of consecutive Fibonacci numbers (last 10):
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                          {result.ratios.map((ratio: number, index: number) => (
                            <div key={index} className="bg-white rounded-lg p-2 text-center">
                              <div className="font-mono text-sm text-blue-600">{ratio.toFixed(8)}</div>
                            </div>
                          ))}
                        </div>
                        <div className="text-sm text-gray-600 mt-3">
                          Golden Ratio φ = 1.618033988...
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {result.type === 'check' && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Fibonacci Check</h3>
                    <div className="text-2xl font-bold mb-4">
                      {result.number} {result.isFibonacci ? 'IS' : 'IS NOT'} a Fibonacci number
                    </div>
                    {result.isFibonacci && (
                      <div className="text-lg text-green-600">
                        Position: F({result.position}) = {result.number}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Fibonacci Reference Table */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Fibonacci Reference Table</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2">
            {fibonacciFacts.map((item, index) => (
              <div key={index} className="bg-white rounded-lg p-2 text-center">
                <div className="text-xs text-gray-500">F({item.n})</div>
                <div className="font-mono text-sm text-orange-600">{item.fib}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Fibonacci Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• F(n) = F(n-1) + F(n-2)</li>
                <li>• F(0) = 0, F(1) = 1</li>
                <li>• Ratio approaches golden ratio φ</li>
                <li>• Every 3rd number is even</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Nature patterns (spirals, petals)</li>
                <li>• Art and architecture</li>
                <li>• Computer algorithms</li>
                <li>• Financial markets analysis</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FibonacciCalculator;