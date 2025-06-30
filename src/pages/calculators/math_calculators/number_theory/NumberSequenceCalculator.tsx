import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp, List } from 'lucide-react';

const NumberSequenceCalculator: React.FC = () => {
  const [sequence, setSequence] = useState('');
  const [terms, setTerms] = useState('');
  const [result, setResult] = useState<any>(null);

  const analyzeSequence = () => {
    // Parse the input sequence
    const sequenceArray = sequence
      .split(',')
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => {
        const parsed = parseFloat(s);
        if (isNaN(parsed)) {
          throw new Error(`Invalid number: ${s}`);
        }
        return parsed;
      });
    
    if (sequenceArray.length < 3) {
      setResult({ error: "Please enter at least 3 terms to analyze the sequence" });
      return;
    }
    
    // Check for arithmetic sequence
    const firstDifferences: number[] = [];
    for (let i = 1; i < sequenceArray.length; i++) {
      firstDifferences.push(sequenceArray[i] - sequenceArray[i - 1]);
    }
    
    const isArithmetic = firstDifferences.every(diff => Math.abs(diff - firstDifferences[0]) < 1e-10);
    const commonDifference = isArithmetic ? firstDifferences[0] : null;
    
    // Check for geometric sequence
    const ratios: number[] = [];
    for (let i = 1; i < sequenceArray.length; i++) {
      if (sequenceArray[i - 1] !== 0) {
        ratios.push(sequenceArray[i] / sequenceArray[i - 1]);
      }
    }
    
    const isGeometric = ratios.length > 0 && ratios.every(ratio => Math.abs(ratio - ratios[0]) < 1e-10);
    const commonRatio = isGeometric ? ratios[0] : null;
    
    // Check for Fibonacci-like sequence
    let isFibonacciLike = true;
    for (let i = 2; i < sequenceArray.length; i++) {
      if (Math.abs(sequenceArray[i] - (sequenceArray[i - 1] + sequenceArray[i - 2])) > 1e-10) {
        isFibonacciLike = false;
        break;
      }
    }
    
    // Check for quadratic sequence (second differences are constant)
    const secondDifferences: number[] = [];
    for (let i = 1; i < firstDifferences.length; i++) {
      secondDifferences.push(firstDifferences[i] - firstDifferences[i - 1]);
    }
    
    const isQuadratic = secondDifferences.length > 0 && 
                        secondDifferences.every(diff => Math.abs(diff - secondDifferences[0]) < 1e-10);
    
    // Generate next terms
    const numTermsToGenerate = parseInt(terms) || 5;
    const nextTerms: number[] = [];
    
    if (isArithmetic) {
      const lastTerm = sequenceArray[sequenceArray.length - 1];
      for (let i = 1; i <= numTermsToGenerate; i++) {
        nextTerms.push(lastTerm + i * commonDifference!);
      }
    } else if (isGeometric) {
      const lastTerm = sequenceArray[sequenceArray.length - 1];
      for (let i = 1; i <= numTermsToGenerate; i++) {
        nextTerms.push(lastTerm * Math.pow(commonRatio!, i));
      }
    } else if (isFibonacciLike) {
      const secondLast = sequenceArray[sequenceArray.length - 2];
      const last = sequenceArray[sequenceArray.length - 1];
      let prev = secondLast;
      let current = last;
      
      for (let i = 1; i <= numTermsToGenerate; i++) {
        const next = prev + current;
        nextTerms.push(next);
        prev = current;
        current = next;
      }
    } else if (isQuadratic) {
      // For quadratic sequences, we can use the formula a*n^2 + b*n + c
      // We need to solve for a, b, c using the first three terms
      // This is a simplified approach and might not work for all quadratic sequences
      const a = secondDifferences[0] / 2;
      const b = firstDifferences[0] - 3 * a;
      const c = sequenceArray[0] - a - b;
      
      const formula = `${a !== 0 ? a !== 1 ? `${a}n²` : 'n²' : ''}${b > 0 ? ` + ${b}n` : b < 0 ? ` - ${-b}n` : ''}${c > 0 ? ` + ${c}` : c < 0 ? ` - ${-c}` : ''}`;
      
      for (let i = 1; i <= numTermsToGenerate; i++) {
        const n = sequenceArray.length + i;
        nextTerms.push(a * n * n + b * n + c);
      }
      
      setResult({
        sequence: sequenceArray,
        type: 'quadratic',
        formula,
        nextTerms,
        a, b, c
      });
      return;
    } else {
      // If no pattern is detected, we can't predict next terms
      nextTerms.push(...Array(numTermsToGenerate).fill('?'));
    }
    
    // Determine the sequence type
    let type = 'unknown';
    let formula = '';
    
    if (isArithmetic) {
      type = 'arithmetic';
      formula = `a_n = ${sequenceArray[0]} + (n-1) × ${commonDifference}`;
    } else if (isGeometric) {
      type = 'geometric';
      formula = `a_n = ${sequenceArray[0]} × ${commonRatio}^(n-1)`;
    } else if (isFibonacciLike) {
      type = 'fibonacci-like';
      formula = `a_n = a_(n-1) + a_(n-2), where a_1 = ${sequenceArray[0]} and a_2 = ${sequenceArray[1]}`;
    }
    
    setResult({
      sequence: sequenceArray,
      type,
      isArithmetic,
      isGeometric,
      isFibonacciLike,
      commonDifference,
      commonRatio,
      formula,
      nextTerms,
      firstDifferences,
      secondDifferences
    });
  };

  const examples = [
    { sequence: '2, 4, 6, 8, 10', type: 'Arithmetic (d=2)' },
    { sequence: '3, 6, 12, 24, 48', type: 'Geometric (r=2)' },
    { sequence: '0, 1, 1, 2, 3, 5, 8', type: 'Fibonacci' },
    { sequence: '1, 4, 9, 16, 25', type: 'Quadratic (n²)' },
    { sequence: '2, 6, 12, 20, 30', type: 'Quadratic (n²+n)' },
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
        <span className="text-gray-900 font-medium">Number Sequence Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <List className="w-8 h-8 text-cyan-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Number Sequence Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter a Sequence (comma separated)
          </label>
          <textarea
            value={sequence}
            onChange={(e) => setSequence(e.target.value)}
            placeholder="e.g., 2, 4, 6, 8, 10"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg font-mono"
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Next Terms to Generate
          </label>
          <input
            type="number"
            value={terms}
            onChange={(e) => setTerms(e.target.value)}
            placeholder="5"
            min="1"
            max="20"
            className="w-full md:w-1/3 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Calculate Button */}
        <button
          onClick={analyzeSequence}
          className="w-full md:w-auto px-8 py-4 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors text-lg font-semibold mb-8"
        >
          Analyze Sequence
        </button>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm font-semibold text-gray-800 mb-1">{ex.type}</div>
                <div className="font-mono text-xs text-gray-600 mb-2 truncate">
                  {ex.sequence}
                </div>
                <button
                  onClick={() => setSequence(ex.sequence)}
                  className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded hover:bg-cyan-200 transition-colors"
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
                {/* Sequence Type */}
                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Sequence Analysis</h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-cyan-600 mb-2 capitalize">
                      {result.type === 'unknown' ? 'Pattern Not Recognized' : `${result.type} Sequence`}
                    </div>
                    {result.formula && (
                      <div className="text-lg font-mono text-gray-700 mb-4">
                        Formula: {result.formula}
                      </div>
                    )}
                    {result.type === 'arithmetic' && (
                      <div className="text-gray-600">
                        Common difference (d): {result.commonDifference}
                      </div>
                    )}
                    {result.type === 'geometric' && (
                      <div className="text-gray-600">
                        Common ratio (r): {result.commonRatio}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-6">
                    <div className="text-sm text-gray-600 mb-2">Original Sequence</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {result.sequence.map((term: number, index: number) => (
                        <div key={index} className="px-3 py-2 bg-gray-100 rounded-lg font-mono">
                          {term}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-2">Next Terms</div>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {result.nextTerms.map((term: number | string, index: number) => (
                        <div 
                          key={index} 
                          className={`px-3 py-2 rounded-lg font-mono ${
                            term === '?' ? 'bg-gray-100 text-gray-500' : 'bg-cyan-100 text-cyan-800'
                          }`}
                        >
                          {typeof term === 'number' ? term.toFixed(term % 1 === 0 ? 0 : 2) : term}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Differences Analysis */}
                {(result.firstDifferences || result.secondDifferences) && (
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Differences Analysis</h3>
                    
                    {result.firstDifferences && (
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">First Differences</div>
                        <div className="flex flex-wrap gap-2">
                          {result.firstDifferences.map((diff: number, index: number) => (
                            <div key={index} className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-mono">
                              {diff}
                            </div>
                          ))}
                        </div>
                        {result.isArithmetic && (
                          <div className="text-sm text-green-600 mt-2">
                            ✓ First differences are constant: Arithmetic sequence
                          </div>
                        )}
                      </div>
                    )}
                    
                    {result.secondDifferences && result.secondDifferences.length > 0 && (
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-2">Second Differences</div>
                        <div className="flex flex-wrap gap-2">
                          {result.secondDifferences.map((diff: number, index: number) => (
                            <div key={index} className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-mono">
                              {diff}
                            </div>
                          ))}
                        </div>
                        {result.isQuadratic && (
                          <div className="text-sm text-green-600 mt-2">
                            ✓ Second differences are constant: Quadratic sequence
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Quadratic Formula */}
                {result.type === 'quadratic' && (
                  <div className="bg-purple-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quadratic Formula</h3>
                    <div className="text-center">
                      <div className="text-xl font-mono text-purple-600 mb-2">
                        a_n = {result.formula}
                      </div>
                      <div className="text-sm text-gray-600">
                        Where n is the position in the sequence (starting from 1)
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Sequence Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Arithmetic Sequence</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Each term differs from the previous by a constant value</li>
                <li>• Formula: a_n = a_1 + (n-1)d</li>
                <li>• Example: 2, 5, 8, 11, 14, ... (d = 3)</li>
                <li>• First differences are constant</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Geometric Sequence</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Each term is a constant multiple of the previous</li>
                <li>• Formula: a_n = a_1 × r^(n-1)</li>
                <li>• Example: 3, 6, 12, 24, 48, ... (r = 2)</li>
                <li>• Ratios between consecutive terms are constant</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Fibonacci-like Sequence</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Each term is the sum of the two previous terms</li>
                <li>• Formula: a_n = a_(n-1) + a_(n-2)</li>
                <li>• Example: 0, 1, 1, 2, 3, 5, 8, ...</li>
                <li>• Requires two initial terms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Quadratic Sequence</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Based on a quadratic formula: an² + bn + c</li>
                <li>• Example: 1, 4, 9, 16, 25, ... (n²)</li>
                <li>• Second differences are constant</li>
                <li>• Often found in physical and mathematical models</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberSequenceCalculator;