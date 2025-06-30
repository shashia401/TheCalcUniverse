import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Shuffle } from 'lucide-react';

const PermutationCombinationCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'combination' | 'permutation' | 'both' | 'multiset' | 'circular'>('both');
  const [n, setN] = useState('');
  const [r, setR] = useState('');
  const [repetitionAllowed, setRepetitionAllowed] = useState(false);
  const [multisetItems, setMultisetItems] = useState<string[]>(['', '', '']);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateResult();
  }, [calculationType, n, r, repetitionAllowed, multisetItems]);

  const factorial = (num: number): bigint => {
    if (num < 0) return BigInt(0);
    if (num === 0 || num === 1) return BigInt(1);
    
    let result = BigInt(1);
    for (let i = 2; i <= num; i++) {
      result *= BigInt(i);
    }
    return result;
  };

  const calculateCombination = (n: number, r: number, withRepetition: boolean = false): bigint => {
    if (r > n && !withRepetition) return BigInt(0);
    if (r === 0 || (r === n && !withRepetition)) return BigInt(1);
    
    if (withRepetition) {
      // Combination with repetition: (n+r-1)! / (r! * (n-1)!)
      return calculateCombination(n + r - 1, r, false);
    }
    
    // Calculate nCr = n! / (r! * (n-r)!)
    // To avoid overflow, use: nCr = (n * (n-1) * ... * (n-r+1)) / (r * (r-1) * ... * 1)
    let result = BigInt(1);
    for (let i = 1; i <= r; i++) {
      result = (result * BigInt(n - r + i)) / BigInt(i);
    }
    return result;
  };

  const calculatePermutation = (n: number, r: number, withRepetition: boolean = false): bigint => {
    if (r > n && !withRepetition) return BigInt(0);
    if (r === 0) return BigInt(1);
    
    if (withRepetition) {
      // Permutation with repetition: n^r
      return BigInt(Math.pow(n, r));
    }
    
    // Calculate nPr = n! / (n-r)!
    let result = BigInt(1);
    for (let i = 0; i < r; i++) {
      result *= BigInt(n - i);
    }
    return result;
  };

  const calculateMultisetPermutation = (): bigint => {
    // For multiset permutation, we need the counts of each item
    const counts = multisetItems
      .filter(item => item !== '')
      .map(item => parseInt(item))
      .filter(count => !isNaN(count) && count > 0);
    
    if (counts.length === 0) return BigInt(0);
    
    const totalItems = counts.reduce((sum, count) => sum + count, 0);
    
    // Formula: n! / (n₁! * n₂! * ... * nₖ!)
    let denominator = BigInt(1);
    for (const count of counts) {
      denominator *= factorial(count);
    }
    
    return factorial(totalItems) / denominator;
  };

  const calculateCircularPermutation = (n: number): bigint => {
    // Circular permutation formula: (n-1)!
    return factorial(n - 1);
  };

  const calculateResult = () => {
    try {
      if (calculationType === 'multiset') {
        const multisetResult = calculateMultisetPermutation();
        
        const counts = multisetItems
          .filter(item => item !== '')
          .map(item => parseInt(item))
          .filter(count => !isNaN(count) && count > 0);
        
        const totalItems = counts.reduce((sum, count) => sum + count, 0);
        
        const steps = [
          `Multiset Permutation: Arrangement of items with repetition`,
          `Total items: ${totalItems}`,
          `Item counts: ${counts.join(', ')}`,
          `Formula: n! / (n₁! × n₂! × ... × nₖ!)`,
          `${totalItems}! / (${counts.join('! × ')}!)`,
        ];
        
        if (totalItems <= 20) {
          steps.push(`${totalItems}! = ${factorial(totalItems).toString()}`);
          
          let denominatorSteps = '';
          let denominatorResult = BigInt(1);
          for (const count of counts) {
            denominatorSteps += `${count}! × `;
            denominatorResult *= factorial(count);
          }
          denominatorSteps = denominatorSteps.slice(0, -3); // Remove trailing " × "
          
          steps.push(`Denominator = ${denominatorSteps} = ${denominatorResult.toString()}`);
          steps.push(`Result = ${factorial(totalItems).toString()} / ${denominatorResult.toString()} = ${multisetResult.toString()}`);
        } else {
          steps.push(`Using optimized calculation to avoid factorial overflow...`);
          steps.push(`Result = ${multisetResult.toString()}`);
        }
        
        setResult({
          multiset: {
            totalItems,
            counts,
            result: multisetResult
          },
          steps
        });
        return;
      }
      
      if (calculationType === 'circular') {
        const nValue = parseInt(n);
        
        if (!n || isNaN(nValue) || nValue <= 0) {
          setResult(null);
          return;
        }
        
        const circularResult = calculateCircularPermutation(nValue);
        
        const steps = [
          `Circular Permutation: Arrangement of ${nValue} items in a circle`,
          `Formula: (n-1)!`,
          `(${nValue}-1)! = ${(nValue-1)}!`,
        ];
        
        if (nValue <= 21) {
          steps.push(`${nValue-1}! = ${circularResult.toString()}`);
        } else {
          steps.push(`Using optimized calculation to avoid factorial overflow...`);
          steps.push(`Result = ${circularResult.toString()}`);
        }
        
        setResult({
          circular: {
            n: nValue,
            result: circularResult
          },
          steps
        });
        return;
      }
      
      const nValue = parseInt(n);
      const rValue = parseInt(r);

      if (!n || !r || isNaN(nValue) || isNaN(rValue) || nValue < 0 || rValue < 0) {
        setResult(null);
        return;
      }

      const combinationResult = calculateCombination(nValue, rValue, repetitionAllowed);
      const permutationResult = calculatePermutation(nValue, rValue, repetitionAllowed);
      
      const steps = [];
      
      if (calculationType === 'combination' || calculationType === 'both') {
        steps.push(`Combination${repetitionAllowed ? ' with repetition' : ''}: ${nValue} choose ${rValue}`);
        
        if (repetitionAllowed) {
          steps.push(`Formula for combination with repetition: C(n+r-1,r) = (n+r-1)! / (r! × (n-1)!)`);
          steps.push(`C(${nValue},${rValue}) = C(${nValue+rValue-1},${rValue}) = (${nValue+rValue-1})! / (${rValue}! × (${nValue}-1)!)`);
        } else {
          steps.push(`Formula: C(n,r) = n! / (r! × (n-r)!)`);
          steps.push(`C(${nValue},${rValue}) = ${nValue}! / (${rValue}! × (${nValue}-${rValue})!)`);
        }
        
        if (nValue <= 20) {
          if (!repetitionAllowed) {
            steps.push(`${nValue}! = ${factorial(nValue).toString()}`);
            steps.push(`${rValue}! = ${factorial(rValue).toString()}`);
            steps.push(`${nValue-rValue}! = ${factorial(nValue-rValue).toString()}`);
            steps.push(`C(${nValue},${rValue}) = ${factorial(nValue).toString()} / (${factorial(rValue).toString()} × ${factorial(nValue-rValue).toString()})`);
          }
        } else {
          steps.push(`Using optimized calculation to avoid factorial overflow...`);
        }
        
        steps.push(`C(${nValue},${rValue}) = ${combinationResult.toString()}`);
      }
      
      if (calculationType === 'permutation' || calculationType === 'both') {
        if (calculationType === 'both') steps.push('');
        
        steps.push(`Permutation${repetitionAllowed ? ' with repetition' : ''}: Arrangements of ${rValue} items from ${nValue} items`);
        
        if (repetitionAllowed) {
          steps.push(`Formula for permutation with repetition: P(n,r) = n^r`);
          steps.push(`P(${nValue},${rValue}) = ${nValue}^${rValue} = ${permutationResult.toString()}`);
        } else {
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
      }
      
      setResult({
        n: nValue,
        r: rValue,
        repetitionAllowed,
        combination: combinationResult,
        permutation: permutationResult,
        steps
      });
    } catch (error) {
      setResult({ error: "Error in calculation. Values may be too large." });
    }
  };

  const addMultisetItem = () => {
    setMultisetItems([...multisetItems, '']);
  };

  const removeMultisetItem = (index: number) => {
    if (multisetItems.length > 1) {
      setMultisetItems(multisetItems.filter((_, i) => i !== index));
    }
  };

  const updateMultisetItem = (index: number, value: string) => {
    const newItems = [...multisetItems];
    newItems[index] = value;
    setMultisetItems(newItems);
  };

  const examples = [
    { type: 'combination', n: 5, r: 3, repetition: false, description: "5 choose 3 (e.g., committees of 3 from 5 people)" },
    { type: 'permutation', n: 5, r: 3, repetition: false, description: "Arranging 3 people from 5 in a line" },
    { type: 'combination', n: 4, r: 2, repetition: true, description: "Selecting 2 ice cream flavors from 4 (can repeat)" },
    { type: 'permutation', n: 4, r: 3, repetition: true, description: "Creating 3-digit codes using digits 1-4 (can repeat)" },
    { type: 'circular', n: 5, r: 0, repetition: false, description: "Arranging 5 people around a circular table" },
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
        <span className="text-gray-900 font-medium">Permutation and Combination Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Shuffle className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Permutation and Combination Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Calculation Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
            <button
              onClick={() => setCalculationType('both')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'both'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Both</div>
              <div className="text-sm opacity-75">nCr and nPr</div>
            </button>
            <button
              onClick={() => setCalculationType('combination')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'combination'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Combination</div>
              <div className="text-sm opacity-75">nCr</div>
            </button>
            <button
              onClick={() => setCalculationType('permutation')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'permutation'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Permutation</div>
              <div className="text-sm opacity-75">nPr</div>
            </button>
            <button
              onClick={() => setCalculationType('multiset')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'multiset'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Multiset</div>
              <div className="text-sm opacity-75">Permutation with repetition</div>
            </button>
            <button
              onClick={() => setCalculationType('circular')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'circular'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Circular</div>
              <div className="text-sm opacity-75">Circular permutation</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        {calculationType !== 'multiset' && (
          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {calculationType === 'circular' ? (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    n (number of items to arrange in a circle)
                  </label>
                  <input
                    type="number"
                    value={n}
                    onChange={(e) => setN(e.target.value)}
                    placeholder="e.g., 5"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                </div>
              ) : (
                <>
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
                </>
              )}
            </div>
            
            {calculationType !== 'circular' && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="repetition"
                  checked={repetitionAllowed}
                  onChange={(e) => setRepetitionAllowed(e.target.checked)}
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <label htmlFor="repetition" className="ml-2 text-sm text-gray-700">
                  Allow repetition (items can be selected more than once)
                </label>
              </div>
            )}
          </div>
        )}

        {/* Multiset Input */}
        {calculationType === 'multiset' && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter the count of each item type
            </label>
            <div className="space-y-3">
              {multisetItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={item}
                    onChange={(e) => updateMultisetItem(index, e.target.value)}
                    placeholder={`Count of item type ${index + 1}`}
                    min="1"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <button
                    onClick={() => removeMultisetItem(index)}
                    disabled={multisetItems.length === 1}
                    className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            
            <button
              onClick={addMultisetItem}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Add Item Type
            </button>
            
            <div className="mt-4 text-sm text-gray-600">
              <p>Example: For the word "MISSISSIPPI", enter:</p>
              <p>1 (for M), 4 (for I), 4 (for S), 2 (for P)</p>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples
              .filter(ex => ex.type === calculationType || calculationType === 'both' || 
                (ex.type === 'combination' && calculationType === 'combination') || 
                (ex.type === 'permutation' && calculationType === 'permutation') ||
                (ex.type === 'circular' && calculationType === 'circular'))
              .map((ex, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm mb-2">
                    <span className="font-medium">{ex.description}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ex.type !== 'circular' && (
                      <>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">n = {ex.n}</span>
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">r = {ex.r}</span>
                      </>
                    )}
                    {ex.type === 'circular' && (
                      <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">n = {ex.n}</span>
                    )}
                    {ex.repetition && (
                      <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">With repetition</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      setCalculationType(ex.type as any);
                      setN(ex.n.toString());
                      if (ex.r !== undefined) setR(ex.r.toString());
                      setRepetitionAllowed(ex.repetition);
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
              
              {calculationType === 'multiset' && result.multiset && (
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Multiset Permutation</div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {result.multiset.result.toString()}
                  </div>
                  <div className="text-gray-600">
                    Number of ways to arrange {result.multiset.totalItems} items with counts {result.multiset.counts.join(', ')}
                  </div>
                </div>
              )}
              
              {calculationType === 'circular' && result.circular && (
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">Circular Permutation</div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {result.circular.result.toString()}
                  </div>
                  <div className="text-gray-600">
                    Number of ways to arrange {result.circular.n} items in a circle
                  </div>
                </div>
              )}
              
              {(calculationType === 'combination' || calculationType === 'both') && result.combination && (
                <div className={`bg-white rounded-lg p-6 text-center ${calculationType === 'both' ? 'mb-6' : ''}`}>
                  <div className="text-sm text-gray-600 mb-2">
                    Combination {result.repetitionAllowed ? 'with repetition' : ''}
                  </div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {result.combination.toString()}
                  </div>
                  <div className="text-gray-600">
                    {result.repetitionAllowed 
                      ? `Number of ways to select ${result.r} items from ${result.n} items (with repetition, order doesn't matter)`
                      : `Number of ways to select ${result.r} items from ${result.n} items (order doesn't matter)`
                    }
                  </div>
                </div>
              )}
              
              {(calculationType === 'permutation' || calculationType === 'both') && result.permutation && (
                <div className="bg-white rounded-lg p-6 text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    Permutation {result.repetitionAllowed ? 'with repetition' : ''}
                  </div>
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    {result.permutation.toString()}
                  </div>
                  <div className="text-gray-600">
                    {result.repetitionAllowed 
                      ? `Number of ways to arrange ${result.r} items from ${result.n} items (with repetition, order matters)`
                      : `Number of ways to arrange ${result.r} items from ${result.n} items (order matters)`
                    }
                  </div>
                </div>
              )}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Permutations and Combinations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Combinations (nCr)</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Order doesn't matter</li>
                <li>• Without repetition: C(n,r) = n! / (r! × (n-r)!)</li>
                <li>• With repetition: C(n+r-1,r) = (n+r-1)! / (r! × (n-1)!)</li>
                <li>• Example: Selecting a committee of 3 from 10 people</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Permutations (nPr)</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Order matters</li>
                <li>• Without repetition: P(n,r) = n! / (n-r)!</li>
                <li>• With repetition: P(n,r) = n^r</li>
                <li>• Example: Arranging 3 people in a line from 10 people</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Multiset Permutation</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Arranging items where some items are identical</li>
                <li>• Formula: n! / (n₁! × n₂! × ... × nₖ!)</li>
                <li>• n = total number of items</li>
                <li>• nᵢ = number of items of type i</li>
                <li>• Example: Arranging letters in "MISSISSIPPI"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Circular Permutation</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Arranging n items in a circle</li>
                <li>• Formula: (n-1)!</li>
                <li>• Rotations of the same arrangement are considered identical</li>
                <li>• Example: Seating 5 people around a round table</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermutationCombinationCalculator;