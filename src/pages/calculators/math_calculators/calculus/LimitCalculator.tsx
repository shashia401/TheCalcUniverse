import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Target } from 'lucide-react';

const LimitCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [approachValue, setApproachValue] = useState('');
  const [direction, setDirection] = useState<'both' | 'left' | 'right'>('both');
  const [result, setResult] = useState<any>(null);

  const calculateLimit = () => {
    if (!expression.trim() || !approachValue.trim()) {
      setResult(null);
      return;
    }

    try {
      // Parse the expression and calculate limit
      const parsedExpression = parseExpression(expression);
      const limit = findLimit(parsedExpression, variable, parseFloat(approachValue), direction);
      
      setResult({
        original: expression,
        variable,
        approachValue,
        direction,
        limit: limit.result,
        steps: limit.steps
      });
    } catch (error: any) {
      setResult({ error: error.message || "Error calculating limit" });
    }
  };

  // Simple expression parser for basic functions
  const parseExpression = (expr: string) => {
    // Clean up the expression
    const cleaned = expr.replace(/\s+/g, '');
    return cleaned;
  };

  // Find the limit of an expression
  const findLimit = (expr: string, variable: string, approach: number, dir: 'both' | 'left' | 'right') => {
    const steps: string[] = [];
    steps.push(`Finding the limit of ${expr} as ${variable} approaches ${approach}${dir === 'left' ? ' from the left' : dir === 'right' ? ' from the right' : ''}`);
    
    // Check for direct substitution
    try {
      const directResult = evaluateExpression(expr, variable, approach);
      
      // Check if result is valid
      if (!isNaN(directResult) && isFinite(directResult)) {
        steps.push(`Direct substitution: Replace ${variable} with ${approach}`);
        steps.push(`${expr.replace(new RegExp(variable, 'g'), approach.toString())} = ${directResult}`);
        return { result: directResult, steps };
      }
    } catch (error) {
      // If direct substitution fails, continue with other methods
    }
    
    // Check for rational function with removable discontinuity
    if (expr.includes('/')) {
      const [numerator, denominator] = expr.split('/');
      
      steps.push(`The expression is a rational function: ${numerator} / ${denominator}`);
      
      // Check if denominator becomes zero at the approach value
      try {
        const denomValue = evaluateExpression(denominator, variable, approach);
        
        if (Math.abs(denomValue) < 1e-10) {
          steps.push(`The denominator equals zero when ${variable} = ${approach}`);
          steps.push(`Check if this is a removable discontinuity by factoring`);
          
          // For demonstration, we'll handle some common cases
          
          // Case: (x-a)/(x-a) as x approaches a
          if (denominator === `(${variable}-${approach})` && numerator === denominator) {
            steps.push(`The expression simplifies to 1 for ${variable} ≠ ${approach}`);
            steps.push(`Since the limit exists as ${variable} approaches ${approach}, the limit is 1`);
            return { result: 1, steps };
          }
          
          // Case: x^2-a^2 / x-a as x approaches a
          if (denominator === `${variable}-${approach}` && 
              (numerator === `${variable}^2-${approach}^2` || numerator === `${variable}^2-${approach*approach}`)) {
            steps.push(`Factor the numerator: ${variable}^2-${approach}^2 = (${variable}-${approach})(${variable}+${approach})`);
            steps.push(`Simplify: (${variable}-${approach})(${variable}+${approach}) / (${variable}-${approach}) = ${variable}+${approach} for ${variable} ≠ ${approach}`);
            steps.push(`As ${variable} approaches ${approach}, the limit is ${approach}+${approach} = ${2*approach}`);
            return { result: 2 * approach, steps };
          }
          
          // If we can't handle the specific case, indicate that
          steps.push(`This calculator cannot fully solve this limit. Consider using l'Hôpital's rule or algebraic manipulation.`);
          return { result: "Indeterminate (0/0)", steps };
        }
      } catch (error) {
        // Continue with other methods if this approach fails
      }
    }
    
    // Check for polynomial
    const isPolynomial = !expr.includes('sin') && !expr.includes('cos') && 
                         !expr.includes('tan') && !expr.includes('e^') && 
                         !expr.includes('ln') && !expr.includes('/');
    
    if (isPolynomial) {
      steps.push(`The expression is a polynomial in ${variable}`);
      steps.push(`Polynomials are continuous, so we can directly substitute ${variable} = ${approach}`);
      
      try {
        const result = evaluateExpression(expr, variable, approach);
        steps.push(`${expr.replace(new RegExp(variable, 'g'), approach.toString())} = ${result}`);
        return { result, steps };
      } catch (error) {
        // If evaluation fails, continue with other methods
      }
    }
    
    // Check for special limits
    
    // sin(x)/x as x approaches 0
    if ((expr === `sin(${variable})/${variable}` || expr === `sin ${variable}/${variable}`) && approach === 0) {
      steps.push(`Recognize the special limit: lim_{x→0} sin(x)/x = 1`);
      return { result: 1, steps };
    }
    
    // (1+x)^(1/x) as x approaches 0
    if (expr === `(1+${variable})^(1/${variable})` && approach === 0) {
      steps.push(`Recognize the special limit: lim_{x→0} (1+x)^(1/x) = e`);
      return { result: Math.E, steps };
    }
    
    // One-sided limits for 1/x as x approaches 0
    if (expr === `1/${variable}` && approach === 0) {
      if (dir === 'left') {
        steps.push(`As ${variable} approaches 0 from the left, 1/${variable} approaches -∞`);
        return { result: "-∞", steps };
      } else if (dir === 'right') {
        steps.push(`As ${variable} approaches 0 from the right, 1/${variable} approaches ∞`);
        return { result: "∞", steps };
      } else {
        steps.push(`The limit does not exist because the left and right limits are different`);
        return { result: "Does not exist", steps };
      }
    }
    
    // Numerical approximation for complex cases
    steps.push(`Using numerical approximation to estimate the limit`);
    
    const delta = 1e-6;
    let leftApprox, rightApprox;
    
    try {
      if (dir === 'both' || dir === 'left') {
        leftApprox = evaluateExpression(expr, variable, approach - delta);
        steps.push(`Left approximation (${variable} = ${approach - delta}): ${leftApprox}`);
      }
      
      if (dir === 'both' || dir === 'right') {
        rightApprox = evaluateExpression(expr, variable, approach + delta);
        steps.push(`Right approximation (${variable} = ${approach + delta}): ${rightApprox}`);
      }
      
      if (dir === 'both') {
        if (Math.abs(leftApprox - rightApprox) < 1e-10) {
          steps.push(`Left and right approximations are equal, so the limit exists`);
          return { result: (leftApprox + rightApprox) / 2, steps };
        } else {
          steps.push(`Left and right approximations differ, so the limit may not exist`);
          return { result: "May not exist", steps };
        }
      } else if (dir === 'left') {
        return { result: leftApprox, steps };
      } else {
        return { result: rightApprox, steps };
      }
    } catch (error) {
      // If numerical approximation fails
      steps.push(`Numerical approximation failed. This limit may require advanced techniques.`);
      return { result: "Undetermined", steps };
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
    if (evaluatedExpr.includes('e^')) {
      evaluatedExpr = evaluatedExpr.replace(/e\^([^+\-*\/\)]+)/g, (_, arg) => `Math.exp(${arg})`);
    }
    if (evaluatedExpr.includes('sqrt(')) {
      evaluatedExpr = evaluatedExpr.replace(/sqrt\(([^)]+)\)/g, (_, arg) => `Math.sqrt(${arg})`);
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

  const examples = [
    { expression: 'x^2', approach: '2', result: '4' },
    { expression: '(x^2-4)/(x-2)', approach: '2', result: '4' },
    { expression: 'sin(x)/x', approach: '0', result: '1' },
    { expression: '(1-cos(x))/x', approach: '0', result: '0' },
    { expression: 'e^x', approach: '0', result: '1' },
    { expression: '(1+x)^(1/x)', approach: '0', result: 'e' },
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
        <span className="text-gray-900 font-medium">Limit Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Target className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Limit Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a Function
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., (x^2-4)/(x-2)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Approach Value
            </label>
            <input
              type="text"
              value={approachValue}
              onChange={(e) => setApproachValue(e.target.value)}
              placeholder="e.g., 0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
            />
          </div>
        </div>

        {/* Direction Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Approach Direction</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setDirection('both')}
              className={`p-3 rounded-lg border-2 transition-all ${
                direction === 'both'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Both Sides</div>
              <div className="text-sm opacity-75">lim<sub>x→a</sub> f(x)</div>
            </button>
            <button
              onClick={() => setDirection('left')}
              className={`p-3 rounded-lg border-2 transition-all ${
                direction === 'left'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">From Left</div>
              <div className="text-sm opacity-75">lim<sub>x→a<sup>-</sup></sub> f(x)</div>
            </button>
            <button
              onClick={() => setDirection('right')}
              className={`p-3 rounded-lg border-2 transition-all ${
                direction === 'right'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">From Right</div>
              <div className="text-sm opacity-75">lim<sub>x→a<sup>+</sup></sub> f(x)</div>
            </button>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateLimit}
          className="w-full md:w-auto px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate Limit
        </button>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm">
                    <span className="text-gray-600">lim<sub>x→{ex.approach}</sub> {ex.expression}</span>
                    <span className="text-gray-400 mx-2">=</span>
                    <span className="text-purple-600">{ex.result}</span>
                  </div>
                  <button
                    onClick={() => {
                      setExpression(ex.expression);
                      setApproachValue(ex.approach);
                    }}
                    className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
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
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Limit Result</h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2 font-mono">
                      {typeof result.limit === 'number' ? result.limit.toFixed(6) : result.limit}
                    </div>
                    <div className="text-gray-600 font-mono">
                      lim<sub>{result.variable}→{result.approachValue}{result.direction === 'left' ? '<sup>-</sup>' : result.direction === 'right' ? '<sup>+</sup>' : ''}</sub> {result.original} = {typeof result.limit === 'number' ? result.limit.toFixed(6) : result.limit}
                    </div>
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
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Limit Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Limit Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• lim[f(x) + g(x)] = lim[f(x)] + lim[g(x)]</li>
                <li>• lim[f(x) × g(x)] = lim[f(x)] × lim[g(x)]</li>
                <li>• lim[f(x) / g(x)] = lim[f(x)] / lim[g(x)] if lim[g(x)] ≠ 0</li>
                <li>• lim[c × f(x)] = c × lim[f(x)] for constant c</li>
                <li>• lim[f(x)^n] = (lim[f(x)])^n for integer n</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Special Limits</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• lim<sub>x→0</sub> sin(x)/x = 1</li>
                <li>• lim<sub>x→0</sub> (1-cos(x))/x = 0</li>
                <li>• lim<sub>x→0</sub> (1+x)^(1/x) = e</li>
                <li>• lim<sub>x→∞</sub> (1+1/x)^x = e</li>
                <li>• lim<sub>x→0</sub> (e^x-1)/x = 1</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 rounded-lg p-4 text-yellow-800 text-sm">
          <p className="font-semibold">Note:</p>
          <p>This calculator handles basic limits and some special cases. For more complex limits involving advanced techniques like l'Hôpital's rule, please use a more advanced calculator.</p>
        </div>
      </div>
    </div>
  );
};

export default LimitCalculator;