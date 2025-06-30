import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Shuffle } from 'lucide-react';

const CombinationCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'combination' | 'permutation' | 'both'>('both');
  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateResult();
  }, [calculationType, n, r]);

  const factorial = (num: number): bigint => {
    if (num < 0) return BigInt(0);
    if (num === 0 || num === 1) return BigInt(1);
    
    let result = BigInt(1);
    for (let i = 2; i <= num; i++) {
      result *= BigInt(i);
    }
    return result;
  };

  const calculateCombination = (n: number, r: number): bigint => {
    if (r > n) return BigInt(0);
    if (r === 0 || r === n) return BigInt(1);
    
    // Calculate nCr = n! / (r! * (n-r)!)
    // To avoid overflow, use: nCr = (n * (n-1) * ... * (n-r+1)) / (r * (r-1) * ... * 1)
    let result = BigInt(1);
    for (let i = 1; i <= r; i++) {
      result = (result * BigInt(n - r + i)) / BigInt(i);
    }
    return result;
  };

  const calculatePermutation = (n: number, r: number): bigint => {
    if (r > n) return BigInt(0);
    if (r === 0) return BigInt(1);
    
    // Calculate nPr = n! / (n-r)!
    let result = BigInt(1);
    for (let i = 0; i < r; i++) {
      result *= BigInt(n - i);
    }
    return result;
  };

  const calculateResult = () => {
    const nValue = parseInt(n);
    const rValue = parseInt(r);

    if (!n || !r || isNaN(nValue) || isNaN(rValue) || nValue < 0 || rValue < 0) {
      setResult(null);
      return;
    }

    try {
      const combinationResult = calculateCombination(nValue, rValue);
      const permutationResult = calculatePermutation(nValue, rValue);
      
      const steps = [];
      
      if (calculationType === 'combination' || calculationType === 'both') {
        steps.push(`Combination (nCr): ${nValue} choose ${rValue}`);
        steps.push(`Formula: C(n,r) = n! / (r! × (n-r)!)`);
        steps.push(`C(${nValue},${rValue}) = ${nValue}! / (${rValue}! × (${nValue}-${rValue})!)`);
        steps.push(`C(${nValue},${rValue}) = ${nValue}! / (${rValue}! × ${nValue-rValue}!)`);
        
        if (nValue <= 20) {
          steps.push(`${nValue}! = ${factorial(nValue).toString()}`);
          steps.push(`${rValue}! = ${factorial(rValue).toString()}`);
          steps.push(`${nValue-rValue}! = ${factorial(nValue-rValue).toString()}`);
          steps.push(`C(${nValue},${rValue}) = ${factorial(nValue).toString()} / (${factorial(rValue).toString()} × ${factorial(nValue-rValue).toString()})`);
        } else {
          steps.push(`Using optimized calculation to avoid factorial overflow...`);
        }
        
        steps.push(`C(${nValue},${rValue}) = ${combinationResult.toString()}`);
      }
      
      if (calculationType === 'permutation' || calculationType === 'both') {
        if (calculationType === 'both') steps.push('');
        
        steps.push(`Permutation (nPr): Arrangements of ${rValue} items from ${nValue} items`);
        steps.push(`Formula: P(n,r) = n! / (n-r)!`);
        steps.push(`P(${nValue},${rValue}) = ${nValue}! / (${nValue}-${rValue})!`);
        
        if (nValue <= 20) {
          steps.push(`${nValue}! = ${factorial(nValue).toString()}`);
          steps.push(`${nValue-rValue}! = ${factorial(nValue-rValue).toString()}`);
          steps.push(`P(${nValue},${rValue}) = ${factorial(nValue).toString()} / ${factorial(nValue-rValue).toString()}`);
        } else {
          steps.push(`Using optimized calculation to avoid factorial overflow...`);
        }
        
        steps.push(`P(${nValue},${rValue}) = ${permutationResult.toString()}`);
      }
      
      setResult({
        n: nValue,
        r: rValue,
        combination: combinationResult,
        permutation: permutationResult,
        steps
      });
    } catch (error) {
      setResult({ error: "Error in calculation. Values may be too large." });
    }
  };

  const examples = [
    { n: 5, r: 3, description: "5 choose 3 (e.g., committees of 3 from 5 people)" },
    { n: 52, r: 5, description: "Poker hands (5 cards from 52-card deck)" },
    { n: 10, r: 10, description: "All items selected (10 choose 10)" },
    { n: 20, r: 0, description: "Empty selection (20 choose 0)" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">Math Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Combination Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Shuffle className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Combination & Permutation Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Calculation Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCalculationType('both')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'both'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Both</div>
              <div className="text-sm opacity-75">Calculate nCr and nPr</div>
            </button>
            <button
              onClick={() => setCalculationType('combination')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'combination'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Combination (nCr)</div>
              <div className="text-sm opacity-75">Order doesn't matter</div>
            </button>
            <button
              onClick={() => setCalculationType('permutation')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'permutation'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Permutation (nPr)</div>
              <div className="text-sm opacity-75">Order matters</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              n (total number of items)
            </label>
            <input
              type="number"
              value={n}
              onChange={(e) => setN(e.target.value)}
              placeholder="e.g., 5"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              r (number of items to select)
            </label>
            <input
              type="number"
              value={r}
              onChange={(e) => setR(e.target.value)}
              placeholder="e.g., 3"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm mb-2">
                  <span className="font-medium">{ex.description}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">n = {ex.n}</span>
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">r = {ex.r}</span>
                </div>
                <button
                  onClick={() => {
                    setN(ex.n.toString());
                    setR(ex.r.toString());
                  }}
                  className="mt-2 text-xs px-2 py-1 bg-purple-200 text-purple-700 rounded hover:bg-purple-300 transition-colors"
                >
                  Try This Example
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Results</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(calculationType === 'combination' || calculationType === 'both') && (
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">Combination (nCr)</div>
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {result.combination.toString()}
                    </div>
                    <div className="text-gray-600">
                      C({result.n},{result.r}) = {result.n}! / ({result.r}! × {result.n-result.r}!)
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Number of ways to select {result.r} items from {result.n} items (order doesn't matter)
                    </div>
                  </div>
                )}
                
                {(calculationType === 'permutation' || calculationType === 'both') && (
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">Permutation (nPr)</div>
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {result.permutation.toString()}
                    </div>
                    <div className="text-gray-600">
                      P({result.n},{result.r}) = {result.n}! / ({result.n-result.r}!)
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Number of ways to arrange {result.r} items from {result.n} items (order matters)
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Combinations vs. Permutations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Combinations (nCr)</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Order doesn't matter</li>
                <li>• Formula: C(n,r) = n! / (r! × (n-r)!)</li>
                <li>• Example: Selecting a committee of 3 people from 10 people</li>
                <li>• Example: Poker hands (5 cards from 52)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Permutations (nPr)</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Order matters</li>
                <li>• Formula: P(n,r) = n! / (n-r)!</li>
                <li>• Example: Arranging 3 people in a line from 10 people</li>
                <li>• Example: PIN codes (selecting and arranging digits)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">When to Use Combination</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Selecting team members</li>
                <li>• Lottery numbers</li>
                <li>• Card hands (poker, bridge)</li>
                <li>• Selecting items when order doesn't matter</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">When to Use Permutation</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Ranking contestants</li>
                <li>• Arranging people in a line</li>
                <li>• Creating passwords or PINs</li>
                <li>• Scheduling events in a specific order</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CombinationCalculator;