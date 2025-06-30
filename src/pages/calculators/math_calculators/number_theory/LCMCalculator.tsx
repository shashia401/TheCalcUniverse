import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Merge } from 'lucide-react';

const LCMCalculator: React.FC = () => {
  const [numbers, setNumbers] = useState(['', '']);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateLCM();
  }, [numbers]);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const lcmMultiple = (nums: number[]): number => {
    return nums.reduce((acc, num) => lcm(acc, num));
  };

  const primeFactorization = (n: number): { [key: number]: number } => {
    const factors: { [key: number]: number } = {};
    let divisor = 2;
    
    while (divisor * divisor <= n) {
      while (n % divisor === 0) {
        factors[divisor] = (factors[divisor] || 0) + 1;
        n /= divisor;
      }
      divisor++;
    }
    
    if (n > 1) {
      factors[n] = (factors[n] || 0) + 1;
    }
    
    return factors;
  };

  const calculateLCM = () => {
    const validNumbers = numbers
      .filter(n => n !== '' && !isNaN(parseInt(n)))
      .map(n => Math.abs(parseInt(n)))
      .filter(n => n > 0);

    if (validNumbers.length < 2) {
      setResult(null);
      return;
    }

    const lcmResult = lcmMultiple(validNumbers);
    const gcdResult = validNumbers.reduce((acc, num) => gcd(acc, num));
    
    // Calculate step by step for two numbers
    const steps = [];
    if (validNumbers.length === 2) {
      const [a, b] = validNumbers;
      steps.push(`Finding LCM of ${a} and ${b}:`);
      steps.push(`Method 1: LCM(a,b) = (a × b) / GCD(a,b)`);
      steps.push(`GCD(${a}, ${b}) = ${gcd(a, b)}`);
      steps.push(`LCM(${a}, ${b}) = (${a} × ${b}) / ${gcd(a, b)}`);
      steps.push(`LCM(${a}, ${b}) = ${a * b} / ${gcd(a, b)} = ${lcmResult}`);
    } else {
      steps.push(`Finding LCM of ${validNumbers.join(', ')}:`);
      let currentLCM = validNumbers[0];
      for (let i = 1; i < validNumbers.length; i++) {
        const nextLCM = lcm(currentLCM, validNumbers[i]);
        steps.push(`LCM(${currentLCM}, ${validNumbers[i]}) = ${nextLCM}`);
        currentLCM = nextLCM;
      }
      steps.push(`Final LCM = ${currentLCM}`);
    }

    // Prime factorization method
    const factorizations = validNumbers.map(num => ({
      number: num,
      factors: primeFactorization(num)
    }));

    // Find LCM using prime factorization
    const allPrimes = new Set<number>();
    factorizations.forEach(f => {
      Object.keys(f.factors).forEach(prime => allPrimes.add(parseInt(prime)));
    });

    const lcmFactors: { [key: number]: number } = {};
    allPrimes.forEach(prime => {
      const maxPower = Math.max(...factorizations.map(f => f.factors[prime] || 0));
      if (maxPower > 0) {
        lcmFactors[prime] = maxPower;
      }
    });

    setResult({
      numbers: validNumbers,
      lcm: lcmResult,
      gcd: gcdResult,
      steps,
      factorizations,
      lcmFactors,
      multiples: getFirstMultiples(lcmResult)
    });
  };

  const getFirstMultiples = (lcm: number): number[] => {
    return Array.from({ length: 10 }, (_, i) => lcm * (i + 1));
  };

  const addNumber = () => {
    setNumbers([...numbers, '']);
  };

  const removeNumber = (index: number) => {
    if (numbers.length > 2) {
      setNumbers(numbers.filter((_, i) => i !== index));
    }
  };

  const updateNumber = (index: number, value: string) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  const formatFactorization = (factors: { [key: number]: number }): string => {
    return Object.entries(factors)
      .map(([prime, power]) => power === 1 ? prime : `${prime}^${power}`)
      .join(' × ');
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
        <span className="text-gray-900 font-medium">LCM Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Merge className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Least Common Multiple (LCM) Calculator</h1>
        </div>

        {/* Input Numbers */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Numbers</label>
          <div className="space-y-3">
            {numbers.map((number, index) => (
              <div key={index} className="flex items-center space-x-3">
                <input
                  type="number"
                  value={number}
                  onChange={(e) => updateNumber(index, e.target.value)}
                  placeholder={`Number ${index + 1}`}
                  min="1"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={() => removeNumber(index)}
                  disabled={numbers.length === 2}
                  className="p-3 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Merge className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={addNumber}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Number
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Least Common Multiple</h3>
              <div className="text-4xl font-bold text-green-600 mb-2">
                LCM({result.numbers.join(', ')}) = {result.lcm}
              </div>
              <div className="text-lg text-gray-600 mt-4">
                GCD({result.numbers.join(', ')}) = {result.gcd}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Steps</h3>
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

            {/* Prime Factorization */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prime Factorization Method</h3>
              <div className="space-y-3">
                {result.factorizations.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <span className="font-mono text-blue-600">
                      {item.number} = {formatFactorization(item.factors)}
                    </span>
                  </div>
                ))}
                <div className="bg-white rounded-lg p-3 border-2 border-blue-200">
                  <span className="font-mono text-blue-800 font-semibold">
                    LCM = {formatFactorization(result.lcmFactors)} = {result.lcm}
                  </span>
                </div>
              </div>
            </div>

            {/* First Few Multiples */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">First 10 Multiples of LCM</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {result.multiples.map((multiple: number, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-600">{index + 1} × {result.lcm}</div>
                    <div className="text-lg font-mono text-purple-600">{multiple}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About LCM</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• LCM(a, b) = LCM(b, a)</li>
                <li>• LCM(a, 1) = a</li>
                <li>• LCM(a, b) ≥ max(a, b)</li>
                <li>• LCM(a, b) × GCD(a, b) = a × b</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Adding fractions with different denominators</li>
                <li>• Scheduling problems</li>
                <li>• Finding common periods</li>
                <li>• Solving Diophantine equations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LCMCalculator;