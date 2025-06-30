import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, GitBranch } from 'lucide-react';

const GCDCalculator: React.FC = () => {
  const [numbers, setNumbers] = useState(['', '']);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateGCD();
  }, [numbers]);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const gcdMultiple = (nums: number[]): number => {
    return nums.reduce((acc, num) => gcd(acc, num));
  };

  const extendedGCD = (a: number, b: number): { gcd: number; x: number; y: number; steps: string[] } => {
    const steps: string[] = [];
    let oldR = a, r = b;
    let oldS = 1, s = 0;
    let oldT = 0, t = 1;

    steps.push(`Extended Euclidean Algorithm for ${a} and ${b}:`);
    steps.push(`Initial: r₀ = ${oldR}, r₁ = ${r}`);
    steps.push(`Initial: s₀ = ${oldS}, s₁ = ${s}`);
    steps.push(`Initial: t₀ = ${oldT}, t₁ = ${t}`);

    while (r !== 0) {
      const quotient = Math.floor(oldR / r);
      steps.push(`q = ⌊${oldR}/${r}⌋ = ${quotient}`);

      [oldR, r] = [r, oldR - quotient * r];
      [oldS, s] = [s, oldS - quotient * s];
      [oldT, t] = [t, oldT - quotient * t];

      steps.push(`New r = ${oldR}, s = ${oldS}, t = ${oldT}`);
    }

    steps.push(`GCD(${a}, ${b}) = ${oldR}`);
    steps.push(`${a} × ${oldS} + ${b} × ${oldT} = ${oldR}`);

    return { gcd: oldR, x: oldS, y: oldT, steps };
  };

  const calculateGCD = () => {
    const validNumbers = numbers
      .filter(n => n !== '' && !isNaN(parseInt(n)))
      .map(n => Math.abs(parseInt(n)))
      .filter(n => n > 0);

    if (validNumbers.length < 2) {
      setResult(null);
      return;
    }

    const gcdResult = gcdMultiple(validNumbers);
    const steps = [];

    if (validNumbers.length === 2) {
      const [a, b] = validNumbers;
      let tempA = a, tempB = b;
      
      steps.push(`Finding GCD of ${a} and ${b} using Euclidean Algorithm:`);
      
      while (tempB !== 0) {
        const quotient = Math.floor(tempA / tempB);
        const remainder = tempA % tempB;
        steps.push(`${tempA} = ${tempB} × ${quotient} + ${remainder}`);
        tempA = tempB;
        tempB = remainder;
      }
      
      steps.push(`GCD(${a}, ${b}) = ${tempA}`);

      // Extended GCD for two numbers
      const extended = extendedGCD(a, b);

      setResult({
        numbers: validNumbers,
        gcd: gcdResult,
        steps,
        extended: extended,
        factors: getFactors(gcdResult),
        lcm: (a * b) / gcdResult
      });
    } else {
      steps.push(`Finding GCD of ${validNumbers.join(', ')}:`);
      
      let currentGCD = validNumbers[0];
      for (let i = 1; i < validNumbers.length; i++) {
        const nextGCD = gcd(currentGCD, validNumbers[i]);
        steps.push(`GCD(${currentGCD}, ${validNumbers[i]}) = ${nextGCD}`);
        currentGCD = nextGCD;
      }
      
      steps.push(`Final GCD = ${currentGCD}`);

      setResult({
        numbers: validNumbers,
        gcd: gcdResult,
        steps,
        factors: getFactors(gcdResult)
      });
    }
  };

  const getFactors = (n: number): number[] => {
    const factors = [];
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
        <span className="text-gray-900 font-medium">GCD Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <GitBranch className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Greatest Common Divisor (GCD) Calculator</h1>
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
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
                <button
                  onClick={() => removeNumber(index)}
                  disabled={numbers.length === 2}
                  className="p-3 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <GitBranch className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={addNumber}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Number
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Greatest Common Divisor</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                GCD({result.numbers.join(', ')}) = {result.gcd}
              </div>
              {result.lcm && (
                <div className="text-lg text-gray-600 mt-4">
                  LCM({result.numbers.join(', ')}) = {result.lcm}
                </div>
              )}
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Euclidean Algorithm Steps</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Extended GCD */}
            {result.extended && (
              <div className="bg-green-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Extended Euclidean Algorithm</h3>
                <div className="text-center mb-4">
                  <div className="text-lg font-mono text-green-600">
                    {result.numbers[0]} × {result.extended.x} + {result.numbers[1]} × {result.extended.y} = {result.extended.gcd}
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  {result.extended.steps.slice(0, 10).map((step: string, index: number) => (
                    <div key={index} className="text-gray-700 font-mono">{step}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Factors */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Factors of GCD ({result.gcd})</h3>
              <div className="flex flex-wrap gap-2">
                {result.factors.map((factor: number, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-lg font-mono"
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About GCD</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• GCD(a, b) = GCD(b, a)</li>
                <li>• GCD(a, 0) = a</li>
                <li>• GCD(a, b) = GCD(a-b, b)</li>
                <li>• GCD(a, b) × LCM(a, b) = a × b</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Simplifying fractions</li>
                <li>• Cryptography (RSA algorithm)</li>
                <li>• Number theory problems</li>
                <li>• Finding common factors</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GCDCalculator;