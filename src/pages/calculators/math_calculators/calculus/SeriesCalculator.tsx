import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Sigma } from 'lucide-react';

const SeriesCalculator: React.FC = () => {
  const [seriesType, setSeriesType] = useState<'arithmetic' | 'geometric' | 'harmonic' | 'custom'>('arithmetic');
  const [firstTerm, setFirstTerm] = useState('');
  const [commonDifference, setCommonDifference] = useState('');
  const [commonRatio, setCommonRatio] = useState('');
  const [customExpression, setCustomExpression] = useState('');
  const [variable, setVariable] = useState('n');
  const [startIndex, setStartIndex] = useState('1');
  const [endIndex, setEndIndex] = useState('10');
  const [result, setResult] = useState<any>(null);

  const calculateSeries = () => {
    try {
      const start = parseInt(startIndex);
      const end = parseInt(endIndex);
      
      if (isNaN(start) || isNaN(end) || start > end) {
        setResult({ error: "Invalid index range" });
        return;
      }
      
      if (end - start > 1000) {
        setResult({ error: "Please limit the number of terms to 1000 or fewer" });
        return;
      }
      
      let terms: number[] = [];
      let sum = 0;
      let formula = '';
      let steps: string[] = [];
      
      switch (seriesType) {
        case 'arithmetic':
          const a = parseFloat(firstTerm);
          const d = parseFloat(commonDifference);
          
          if (isNaN(a) || isNaN(d)) {
            setResult({ error: "Please enter valid numbers for first term and common difference" });
            return;
          }
          
          formula = `a_n = ${a} + (n - 1) × ${d}`;
          steps.push(`Using arithmetic sequence formula: a_n = a + (n - 1)d`);
          steps.push(`Where a = ${a} and d = ${d}`);
          
          for (let i = start; i <= end; i++) {
            const term = a + (i - 1) * d;
            terms.push(term);
            sum += term;
          }
          
          // Calculate sum using the formula
          const n = end - start + 1;
          const formulaSum = (n / 2) * (2 * a + (n - 1) * d);
          steps.push(`Number of terms: ${n}`);
          steps.push(`Using sum formula: S_n = (n/2) × [2a + (n-1)d]`);
          steps.push(`S_${n} = (${n}/2) × [2 × ${a} + (${n}-1) × ${d}]`);
          steps.push(`S_${n} = ${formulaSum}`);
          
          break;
          
        case 'geometric':
          const g = parseFloat(firstTerm);
          const r = parseFloat(commonRatio);
          
          if (isNaN(g) || isNaN(r)) {
            setResult({ error: "Please enter valid numbers for first term and common ratio" });
            return;
          }
          
          formula = `a_n = ${g} × ${r}^(n-1)`;
          steps.push(`Using geometric sequence formula: a_n = a × r^(n-1)`);
          steps.push(`Where a = ${g} and r = ${r}`);
          
          for (let i = start; i <= end; i++) {
            const term = g * Math.pow(r, i - 1);
            terms.push(term);
            sum += term;
          }
          
          // Calculate sum using the formula
          const gn = end - start + 1;
          let formulaGSum;
          
          if (Math.abs(r - 1) < 1e-10) {
            formulaGSum = g * gn;
            steps.push(`Since r = 1, the sum formula is: S_n = a × n`);
            steps.push(`S_${gn} = ${g} × ${gn} = ${formulaGSum}`);
          } else {
            formulaGSum = g * (1 - Math.pow(r, gn)) / (1 - r);
            steps.push(`Using sum formula: S_n = a × (1 - r^n) / (1 - r)`);
            steps.push(`S_${gn} = ${g} × (1 - ${r}^${gn}) / (1 - ${r})`);
            steps.push(`S_${gn} = ${formulaGSum}`);
          }
          
          break;
          
        case 'harmonic':
          formula = `a_n = 1/n`;
          steps.push(`Using harmonic sequence formula: a_n = 1/n`);
          
          for (let i = start; i <= end; i++) {
            const term = 1 / i;
            terms.push(term);
            sum += term;
          }
          
          steps.push(`The harmonic series does not have a simple closed form for its sum`);
          steps.push(`Computing sum by adding individual terms`);
          
          break;
          
        case 'custom':
          if (!customExpression.trim()) {
            setResult({ error: "Please enter a custom expression" });
            return;
          }
          
          formula = `a_n = ${customExpression}`;
          steps.push(`Using custom expression: a_n = ${customExpression}`);
          
          for (let i = start; i <= end; i++) {
            try {
              const term = evaluateExpression(customExpression, variable, i);
              terms.push(term);
              sum += term;
            } catch (error) {
              setResult({ error: `Error evaluating term at n = ${i}` });
              return;
            }
          }
          
          steps.push(`Computing sum by adding individual terms`);
          
          break;
      }
      
      // Check for convergence of infinite series
      let convergence = null;
      if (seriesType === 'geometric' && Math.abs(parseFloat(commonRatio)) < 1) {
        const infiniteSum = parseFloat(firstTerm) / (1 - parseFloat(commonRatio));
        convergence = {
          converges: true,
          value: infiniteSum
        };
        steps.push(`For infinite geometric series with |r| < 1, the sum converges to a/(1-r)`);
        steps.push(`S_∞ = ${parseFloat(firstTerm)}/(1-${parseFloat(commonRatio)}) = ${infiniteSum}`);
      } else if (seriesType === 'geometric' && Math.abs(parseFloat(commonRatio)) >= 1) {
        convergence = {
          converges: false,
          reason: `|r| = ${Math.abs(parseFloat(commonRatio))} ≥ 1`
        };
        steps.push(`For infinite geometric series, the sum diverges when |r| ≥ 1`);
      } else if (seriesType === 'harmonic') {
        convergence = {
          converges: false,
          reason: "The harmonic series diverges"
        };
        steps.push(`The harmonic series diverges to infinity`);
      }
      
      setResult({
        seriesType,
        formula,
        terms: terms.slice(0, 20), // Limit displayed terms
        termCount: terms.length,
        sum,
        convergence,
        steps
      });
    } catch (error: any) {
      setResult({ error: error.message || "Error calculating series" });
    }
  };

  // Evaluate an expression by substituting a value for the variable
  const evaluateExpression = (expr: string, variable: string, value: number): number => {
    // This is a simplified evaluator for demonstration purposes
    // In a real application, you would use a proper math parser/evaluator
    
    // Replace the variable with its value
    let evaluatedExpr = expr.replace(new RegExp(`${variable}`, 'g'), `(${value})`);
    
    // Handle some basic functions
    if (evaluatedExpr.includes('sin(')) {
      evaluatedExpr = evaluatedExpr.replace(/sin\(([^)]+)\)/g, (_, arg) => `Math.sin(${arg})`);
    }
    if (evaluatedExpr.includes('cos(')) {
      evaluatedExpr = evaluatedExpr.replace(/cos\(([^)]+)\)/g, (_, arg) => `Math.cos(${arg})`);
    }
    if (evaluatedExpr.includes('tan(')) {
      evaluatedExpr = evaluatedExpr.replace(/tan\(([^)]+)\)/g, (_, arg) => `Math.tan(${arg})`);
    }
    if (evaluatedExpr.includes('ln(')) {
      evaluatedExpr = evaluatedExpr.replace(/ln\(([^)]+)\)/g, (_, arg) => `Math.log(${arg})`);
    }
    if (evaluatedExpr.includes('log(')) {
      evaluatedExpr = evaluatedExpr.replace(/log\(([^)]+)\)/g, (_, arg) => `Math.log10(${arg})`);
    }
    if (evaluatedExpr.includes('sqrt(')) {
      evaluatedExpr = evaluatedExpr.replace(/sqrt\(([^)]+)\)/g, (_, arg) => `Math.sqrt(${arg})`);
    }
    if (evaluatedExpr.includes('abs(')) {
      evaluatedExpr = evaluatedExpr.replace(/abs\(([^)]+)\)/g, (_, arg) => `Math.abs(${arg})`);
    }
    if (evaluatedExpr.includes('e^')) {
      evaluatedExpr = evaluatedExpr.replace(/e\^([^+\-*\/\)]+)/g, (_, arg) => `Math.exp(${arg})`);
    }
    
    // Handle power expressions
    evaluatedExpr = evaluatedExpr.replace(/([0-9.]+)\^([0-9.]+)/g, (_, base, exp) => 
      `Math.pow(${base}, ${exp})`
    );
    evaluatedExpr = evaluatedExpr.replace(/\(([^)]+)\)\^([0-9.]+)/g, (_, base, exp) => 
      `Math.pow(${base}, ${exp})`
    );
    
    // Evaluate the resulting expression
    // eslint-disable-next-line no-eval
    return eval(evaluatedExpr);
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
        <span className="text-gray-900 font-medium">Series Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Sigma className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Series Calculator</h1>
        </div>

        {/* Series Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Series Type</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() => setSeriesType('arithmetic')}
              className={`p-4 rounded-lg border-2 transition-all ${
                seriesType === 'arithmetic'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Arithmetic</div>
              <div className="text-sm opacity-75">a, a+d, a+2d, ...</div>
            </button>
            <button
              onClick={() => setSeriesType('geometric')}
              className={`p-4 rounded-lg border-2 transition-all ${
                seriesType === 'geometric'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Geometric</div>
              <div className="text-sm opacity-75">a, ar, ar², ar³, ...</div>
            </button>
            <button
              onClick={() => setSeriesType('harmonic')}
              className={`p-4 rounded-lg border-2 transition-all ${
                seriesType === 'harmonic'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Harmonic</div>
              <div className="text-sm opacity-75">1, 1/2, 1/3, 1/4, ...</div>
            </button>
            <button
              onClick={() => setSeriesType('custom')}
              className={`p-4 rounded-lg border-2 transition-all ${
                seriesType === 'custom'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Custom</div>
              <div className="text-sm opacity-75">Define your own</div>
            </button>
          </div>
        </div>

        {/* Series Parameters */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Series Parameters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {seriesType === 'arithmetic' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Term (a)
                  </label>
                  <input
                    type="number"
                    value={firstTerm}
                    onChange={(e) => setFirstTerm(e.target.value)}
                    placeholder="e.g., 1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Common Difference (d)
                  </label>
                  <input
                    type="number"
                    value={commonDifference}
                    onChange={(e) => setCommonDifference(e.target.value)}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  />
                </div>
              </>
            )}
            
            {seriesType === 'geometric' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Term (a)
                  </label>
                  <input
                    type="number"
                    value={firstTerm}
                    onChange={(e) => setFirstTerm(e.target.value)}
                    placeholder="e.g., 1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Common Ratio (r)
                  </label>
                  <input
                    type="number"
                    value={commonRatio}
                    onChange={(e) => setCommonRatio(e.target.value)}
                    placeholder="e.g., 2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
                  />
                </div>
              </>
            )}
            
            {seriesType === 'custom' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Expression (in terms of {variable})
                  </label>
                  <input
                    type="text"
                    value={customExpression}
                    onChange={(e) => setCustomExpression(e.target.value)}
                    placeholder={`e.g., ${variable}^2 or sin(${variable})`}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Variable
                  </label>
                  <input
                    type="text"
                    value={variable}
                    onChange={(e) => setVariable(e.target.value.charAt(0))}
                    maxLength={1}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
                  />
                </div>
              </>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Index
              </label>
              <input
                type="number"
                value={startIndex}
                onChange={(e) => setStartIndex(e.target.value)}
                placeholder="e.g., 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Index
              </label>
              <input
                type="number"
                value={endIndex}
                onChange={(e) => setEndIndex(e.target.value)}
                placeholder="e.g., 10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateSeries}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate Series
        </button>

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
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Series Result</h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">
                      {result.sum.toFixed(6)}
                    </div>
                    <div className="text-gray-600 font-mono">
                      Σ<sub>{startIndex}≤i≤{endIndex}</sub> {result.formula.replace('a_n', 'a_i')}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">Formula</div>
                      <div className="text-lg font-mono text-indigo-600">{result.formula}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">Number of Terms</div>
                      <div className="text-lg font-mono text-purple-600">{result.termCount}</div>
                    </div>
                  </div>
                  
                  {result.convergence && (
                    <div className="mt-6 bg-white rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">Infinite Series Behavior</div>
                      {result.convergence.converges ? (
                        <div className="text-green-600">
                          Converges to {result.convergence.value.toFixed(6)}
                        </div>
                      ) : (
                        <div className="text-red-600">
                          Diverges ({result.convergence.reason})
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Terms</h3>
                  <div className="flex flex-wrap gap-2">
                    {result.terms.map((term: number, index: number) => (
                      <div key={index} className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-mono">
                        {term.toFixed(4)}
                      </div>
                    ))}
                    {result.termCount > 20 && (
                      <div className="px-3 py-2 bg-gray-100 text-gray-800 rounded-lg font-mono">
                        ... ({result.termCount - 20} more)
                      </div>
                    )}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Method</h3>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Series Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Arithmetic Series</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Terms: a, a+d, a+2d, a+3d, ...</li>
                <li>• Formula: a_n = a + (n-1)d</li>
                <li>• Sum: S_n = (n/2)(2a + (n-1)d)</li>
                <li>• Example: 2, 5, 8, 11, ... (a=2, d=3)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Geometric Series</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Terms: a, ar, ar², ar³, ...</li>
                <li>• Formula: a_n = ar^(n-1)</li>
                <li>• Sum: S_n = a(1-r^n)/(1-r) for r≠1</li>
                <li>• Infinite sum: S_∞ = a/(1-r) for |r|&lt;1</li>
                <li>• Example: 3, 6, 12, 24, ... (a=3, r=2)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Harmonic Series</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Terms: 1, 1/2, 1/3, 1/4, ...</li>
                <li>• Formula: a_n = 1/n</li>
                <li>• The harmonic series diverges</li>
                <li>• The partial sums grow logarithmically</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Convergence Tests</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Geometric series: |r| &lt; 1</li>
                <li>• p-series: Σ 1/n^p converges for p &gt; 1</li>
                <li>• Alternating series: Terms decrease to 0</li>
                <li>• Ratio test: lim|a_(n+1)/a_n| &lt; 1</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeriesCalculator;