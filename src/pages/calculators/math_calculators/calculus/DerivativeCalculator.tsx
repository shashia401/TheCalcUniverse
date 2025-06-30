import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp } from 'lucide-react';

const DerivativeCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [result, setResult] = useState<any>(null);

  const calculateDerivative = () => {
    if (!expression.trim()) {
      setResult(null);
      return;
    }

    try {
      // Parse the expression and calculate derivative
      const parsedExpression = parseExpression(expression);
      const derivative = findDerivative(parsedExpression, variable);
      
      setResult({
        original: expression,
        derivative: derivative.expression,
        steps: derivative.steps,
        variable
      });
    } catch (error: any) {
      setResult({ error: error.message || "Error calculating derivative" });
    }
  };

  // Simple expression parser for basic functions
  const parseExpression = (expr: string) => {
    // Clean up the expression
    const cleaned = expr.replace(/\s+/g, '');
    return cleaned;
  };

  // Find the derivative of an expression
  const findDerivative = (expr: string, variable: string) => {
    const steps: string[] = [];
    steps.push(`Finding the derivative of ${expr} with respect to ${variable}`);
    
    // Check for constant
    if (!expr.includes(variable)) {
      steps.push(`${expr} is a constant with respect to ${variable}`);
      steps.push(`The derivative of a constant is 0`);
      return { expression: '0', steps };
    }
    
    // Check for power function: x^n
    const powerRegex = new RegExp(`${variable}\\^(\\d+)`, 'g');
    const powerMatch = powerRegex.exec(expr);
    if (powerMatch) {
      const power = parseInt(powerMatch[1]);
      const coefficient = expr.split(variable)[0] || '1';
      
      steps.push(`Identify the function as a power function: ${coefficient}${variable}^${power}`);
      steps.push(`Apply the power rule: d/dx[x^n] = n·x^(n-1)`);
      
      if (power === 1) {
        steps.push(`d/dx[${coefficient}${variable}] = ${coefficient}`);
        return { expression: coefficient === '1' ? '1' : coefficient, steps };
      }
      
      const newPower = power - 1;
      const newCoefficient = coefficient === '1' ? power : `${coefficient}·${power}`;
      
      steps.push(`d/dx[${coefficient}${variable}^${power}] = ${newCoefficient}·${variable}^${newPower}`);
      
      const result = newPower === 0 
        ? newCoefficient 
        : newPower === 1 
          ? `${newCoefficient}${variable}` 
          : `${newCoefficient}${variable}^${newPower}`;
      
      return { expression: result, steps };
    }
    
    // Check for polynomial: ax^n + bx^m + ...
    if (/[\+\-]/.test(expr)) {
      steps.push(`Identify the function as a sum/difference of terms`);
      steps.push(`Apply the sum rule: d/dx[f(x) + g(x)] = d/dx[f(x)] + d/dx[g(x)]`);
      
      const terms = expr.replace(/\-/g, '+-').split('+').filter(term => term);
      const derivedTerms = terms.map(term => {
        const termDerivative = findDerivative(term, variable);
        return termDerivative.expression;
      });
      
      const result = derivedTerms.join(' + ').replace(/\+ \-/g, '- ');
      steps.push(`Combine the derivatives of each term: ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for sin(x)
    if (expr.includes(`sin(${variable})`)) {
      const coefficient = expr.split(`sin(${variable})`)[0] || '1';
      steps.push(`Identify the function as sine: ${coefficient}sin(${variable})`);
      steps.push(`Apply the rule: d/dx[sin(x)] = cos(x)`);
      
      const result = coefficient === '1' ? `cos(${variable})` : `${coefficient}cos(${variable})`;
      steps.push(`d/dx[${coefficient}sin(${variable})] = ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for cos(x)
    if (expr.includes(`cos(${variable})`)) {
      const coefficient = expr.split(`cos(${variable})`)[0] || '1';
      steps.push(`Identify the function as cosine: ${coefficient}cos(${variable})`);
      steps.push(`Apply the rule: d/dx[cos(x)] = -sin(x)`);
      
      const result = coefficient === '1' ? `-sin(${variable})` : `-${coefficient}sin(${variable})`;
      steps.push(`d/dx[${coefficient}cos(${variable})] = ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for e^x
    if (expr.includes(`e^${variable}`)) {
      const coefficient = expr.split(`e^${variable}`)[0] || '1';
      steps.push(`Identify the function as exponential: ${coefficient}e^${variable}`);
      steps.push(`Apply the rule: d/dx[e^x] = e^x`);
      
      const result = coefficient === '1' ? `e^${variable}` : `${coefficient}e^${variable}`;
      steps.push(`d/dx[${coefficient}e^${variable}] = ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for ln(x)
    if (expr.includes(`ln(${variable})`)) {
      const coefficient = expr.split(`ln(${variable})`)[0] || '1';
      steps.push(`Identify the function as natural logarithm: ${coefficient}ln(${variable})`);
      steps.push(`Apply the rule: d/dx[ln(x)] = 1/x`);
      
      const result = coefficient === '1' ? `1/${variable}` : `${coefficient}/${variable}`;
      steps.push(`d/dx[${coefficient}ln(${variable})] = ${result}`);
      
      return { expression: result, steps };
    }
    
    // If we can't identify the function, return an error
    throw new Error(`Cannot find derivative of ${expr}`);
  };

  const examples = [
    { expression: 'x^2', result: '2x' },
    { expression: '3x^4', result: '12x^3' },
    { expression: 'x^2 + 3x + 5', result: '2x + 3' },
    { expression: 'sin(x)', result: 'cos(x)' },
    { expression: '2cos(x)', result: '-2sin(x)' },
    { expression: 'e^x', result: 'e^x' },
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
        <span className="text-gray-900 font-medium">Derivative Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Derivative Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter a Function
            </label>
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., x^2 + 3x + 5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg font-mono"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateDerivative}
          className="w-full md:w-auto px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate Derivative
        </button>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm">
                    <span className="text-gray-600">d/dx[{ex.expression}]</span>
                    <span className="text-gray-400 mx-2">=</span>
                    <span className="text-green-600">{ex.result}</span>
                  </div>
                  <button
                    onClick={() => setExpression(ex.expression)}
                    className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
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
                <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Derivative Result</h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-green-600 mb-2 font-mono">
                      {result.derivative}
                    </div>
                    <div className="text-gray-600 font-mono">
                      d/d{result.variable}[{result.original}] = {result.derivative}
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
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
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Derivative Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Rules</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Constant Rule: d/dx[c] = 0</li>
                <li>• Power Rule: d/dx[x^n] = n·x^(n-1)</li>
                <li>• Sum Rule: d/dx[f(x) + g(x)] = f'(x) + g'(x)</li>
                <li>• Product Rule: d/dx[f(x)·g(x)] = f'(x)·g(x) + f(x)·g'(x)</li>
                <li>• Quotient Rule: d/dx[f(x)/g(x)] = [f'(x)·g(x) - f(x)·g'(x)]/[g(x)]²</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Common Functions</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• d/dx[sin(x)] = cos(x)</li>
                <li>• d/dx[cos(x)] = -sin(x)</li>
                <li>• d/dx[tan(x)] = sec²(x)</li>
                <li>• d/dx[e^x] = e^x</li>
                <li>• d/dx[ln(x)] = 1/x</li>
                <li>• d/dx[a^x] = a^x·ln(a)</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 rounded-lg p-4 text-yellow-800 text-sm">
          <p className="font-semibold">Note:</p>
          <p>This calculator handles basic derivatives including polynomials, trigonometric functions, and exponentials. For more complex functions or chain rule applications, please use a more advanced calculator.</p>
        </div>
      </div>
    </div>
  );
};

export default DerivativeCalculator;