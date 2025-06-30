import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp } from 'lucide-react';

const IntegralCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [variable, setVariable] = useState('x');
  const [integrationType, setIntegrationType] = useState<'indefinite' | 'definite'>('indefinite');
  const [lowerLimit, setLowerLimit] = useState('');
  const [upperLimit, setUpperLimit] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateIntegral = () => {
    if (!expression.trim()) {
      setResult(null);
      return;
    }

    try {
      // Parse the expression and calculate integral
      const parsedExpression = parseExpression(expression);
      const integral = findIntegral(parsedExpression, variable);
      
      if (integrationType === 'definite' && lowerLimit && upperLimit) {
        const lowerVal = parseFloat(lowerLimit);
        const upperVal = parseFloat(upperLimit);
        
        if (isNaN(lowerVal) || isNaN(upperVal)) {
          throw new Error("Invalid limits");
        }
        
        const definiteResult = evaluateDefiniteIntegral(integral.expression, variable, lowerVal, upperVal);
        
        setResult({
          original: expression,
          integral: integral.expression,
          steps: integral.steps,
          variable,
          definite: {
            lowerLimit: lowerVal,
            upperLimit: upperVal,
            result: definiteResult.result,
            steps: definiteResult.steps
          }
        });
      } else {
        setResult({
          original: expression,
          integral: integral.expression,
          steps: integral.steps,
          variable
        });
      }
    } catch (error: any) {
      setResult({ error: error.message || "Error calculating integral" });
    }
  };

  // Simple expression parser for basic functions
  const parseExpression = (expr: string) => {
    // Clean up the expression
    const cleaned = expr.replace(/\s+/g, '');
    return cleaned;
  };

  // Find the integral of an expression
  const findIntegral = (expr: string, variable: string) => {
    const steps: string[] = [];
    steps.push(`Finding the integral of ${expr} with respect to ${variable}`);
    
    // Check for constant
    if (!expr.includes(variable)) {
      steps.push(`${expr} is a constant with respect to ${variable}`);
      steps.push(`The integral of a constant c is c·${variable} + C`);
      return { expression: `${expr}${variable} + C`, steps };
    }
    
    // Check for power function: x^n
    const powerRegex = new RegExp(`${variable}\\^(\\d+)`, 'g');
    const powerMatch = powerRegex.exec(expr);
    if (powerMatch) {
      const power = parseInt(powerMatch[1]);
      const coefficient = expr.split(variable)[0] || '1';
      
      steps.push(`Identify the function as a power function: ${coefficient}${variable}^${power}`);
      steps.push(`Apply the power rule: ∫x^n dx = x^(n+1)/(n+1) + C`);
      
      const newPower = power + 1;
      const newCoefficient = coefficient === '1' 
        ? `1/${newPower}` 
        : `${coefficient}/${newPower}`;
      
      steps.push(`∫${coefficient}${variable}^${power} d${variable} = ${newCoefficient}${variable}^${newPower} + C`);
      
      const result = `${newCoefficient}${variable}^${newPower} + C`;
      
      return { expression: result, steps };
    }
    
    // Check for polynomial: ax^n + bx^m + ...
    if (/[\+\-]/.test(expr)) {
      steps.push(`Identify the function as a sum/difference of terms`);
      steps.push(`Apply the sum rule: ∫[f(x) + g(x)]dx = ∫f(x)dx + ∫g(x)dx`);
      
      const terms = expr.replace(/\-/g, '+-').split('+').filter(term => term);
      const integratedTerms = terms.map(term => {
        const termIntegral = findIntegral(term, variable);
        return termIntegral.expression;
      });
      
      const result = integratedTerms.join(' + ').replace(/\+ \-/g, '- ').replace(/\+ C \+/g, '+ ').replace(/\+ C \-/g, '- ') + ' + C';
      steps.push(`Combine the integrals of each term: ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for sin(x)
    if (expr.includes(`sin(${variable})`)) {
      const coefficient = expr.split(`sin(${variable})`)[0] || '1';
      steps.push(`Identify the function as sine: ${coefficient}sin(${variable})`);
      steps.push(`Apply the rule: ∫sin(x)dx = -cos(x) + C`);
      
      const result = coefficient === '1' 
        ? `-cos(${variable}) + C` 
        : `-${coefficient}cos(${variable}) + C`;
      
      steps.push(`∫${coefficient}sin(${variable})d${variable} = ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for cos(x)
    if (expr.includes(`cos(${variable})`)) {
      const coefficient = expr.split(`cos(${variable})`)[0] || '1';
      steps.push(`Identify the function as cosine: ${coefficient}cos(${variable})`);
      steps.push(`Apply the rule: ∫cos(x)dx = sin(x) + C`);
      
      const result = coefficient === '1' 
        ? `sin(${variable}) + C` 
        : `${coefficient}sin(${variable}) + C`;
      
      steps.push(`∫${coefficient}cos(${variable})d${variable} = ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for e^x
    if (expr.includes(`e^${variable}`)) {
      const coefficient = expr.split(`e^${variable}`)[0] || '1';
      steps.push(`Identify the function as exponential: ${coefficient}e^${variable}`);
      steps.push(`Apply the rule: ∫e^x dx = e^x + C`);
      
      const result = coefficient === '1' 
        ? `e^${variable} + C` 
        : `${coefficient}e^${variable} + C`;
      
      steps.push(`∫${coefficient}e^${variable}d${variable} = ${result}`);
      
      return { expression: result, steps };
    }
    
    // Check for 1/x (natural logarithm)
    if (expr === `1/${variable}`) {
      steps.push(`Identify the function as 1/${variable}`);
      steps.push(`Apply the rule: ∫1/x dx = ln|x| + C`);
      
      const result = `ln|${variable}| + C`;
      steps.push(`∫1/${variable}d${variable} = ${result}`);
      
      return { expression: result, steps };
    }
    
    // If we can't identify the function, return an error
    throw new Error(`Cannot find integral of ${expr}`);
  };

  // Evaluate a definite integral
  const evaluateDefiniteIntegral = (integralExpr: string, variable: string, lower: number, upper: number) => {
    const steps: string[] = [];
    steps.push(`Evaluating the definite integral from ${lower} to ${upper}`);
    
    // Remove the constant of integration
    const withoutConstant = integralExpr.replace(/ \+ C$/, '');
    steps.push(`Remove the constant of integration: ${withoutConstant}`);
    
    // Substitute upper limit
    steps.push(`Substitute the upper limit: ${withoutConstant} with ${variable} = ${upper}`);
    const upperResult = evaluateExpression(withoutConstant, variable, upper);
    steps.push(`Upper limit result: ${upperResult}`);
    
    // Substitute lower limit
    steps.push(`Substitute the lower limit: ${withoutConstant} with ${variable} = ${lower}`);
    const lowerResult = evaluateExpression(withoutConstant, variable, lower);
    steps.push(`Lower limit result: ${lowerResult}`);
    
    // Calculate the difference
    const finalResult = upperResult - lowerResult;
    steps.push(`Final result: ${upperResult} - ${lowerResult} = ${finalResult}`);
    
    return { result: finalResult, steps };
  };

  // Evaluate an expression by substituting a value for the variable
  const evaluateExpression = (expr: string, variable: string, value: number): number => {
    // This is a simplified evaluator for demonstration purposes
    // In a real application, you would use a proper math parser/evaluator
    
    // Replace the variable with its value
    let evaluatedExpr = expr.replace(new RegExp(`${variable}`, 'g'), value.toString());
    
    // Handle some basic functions
    if (evaluatedExpr.includes('sin(')) {
      evaluatedExpr = evaluatedExpr.replace(/sin\(([^)]+)\)/g, (_, arg) => Math.sin(parseFloat(arg)).toString());
    }
    if (evaluatedExpr.includes('cos(')) {
      evaluatedExpr = evaluatedExpr.replace(/cos\(([^)]+)\)/g, (_, arg) => Math.cos(parseFloat(arg)).toString());
    }
    if (evaluatedExpr.includes('ln|')) {
      evaluatedExpr = evaluatedExpr.replace(/ln\|([^|]+)\|/g, (_, arg) => Math.log(Math.abs(parseFloat(arg))).toString());
    }
    if (evaluatedExpr.includes('e^')) {
      evaluatedExpr = evaluatedExpr.replace(/e\^([^+\-*\/]+)/g, (_, arg) => Math.exp(parseFloat(arg)).toString());
    }
    
    // Handle power expressions
    evaluatedExpr = evaluatedExpr.replace(/([0-9.]+)\^([0-9.]+)/g, (_, base, exp) => 
      Math.pow(parseFloat(base), parseFloat(exp)).toString()
    );
    
    // Evaluate the resulting expression
    // Note: This is a very simplified approach and won't work for complex expressions
    // eslint-disable-next-line no-eval
    return eval(evaluatedExpr);
  };

  const examples = [
    { expression: 'x^2', result: '(1/3)x^3 + C' },
    { expression: '3x^4', result: '(3/5)x^5 + C' },
    { expression: 'x^2 + 3x + 5', result: '(1/3)x^3 + (3/2)x^2 + 5x + C' },
    { expression: 'sin(x)', result: '-cos(x) + C' },
    { expression: '2cos(x)', result: '2sin(x) + C' },
    { expression: 'e^x', result: 'e^x + C' },
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
        <span className="text-gray-900 font-medium">Integral Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Integral Calculator</h1>
        </div>

        {/* Integral Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Integral Type</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setIntegrationType('indefinite')}
              className={`p-4 rounded-lg border-2 transition-all ${
                integrationType === 'indefinite'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Indefinite Integral</div>
              <div className="text-sm opacity-75">∫f(x)dx</div>
            </button>
            <button
              onClick={() => setIntegrationType('definite')}
              className={`p-4 rounded-lg border-2 transition-all ${
                integrationType === 'definite'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Definite Integral</div>
              <div className="text-sm opacity-75">∫<sub>a</sub><sup>b</sup>f(x)dx</div>
            </button>
          </div>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
            />
          </div>
        </div>

        {/* Limits for Definite Integral */}
        {integrationType === 'definite' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lower Limit
              </label>
              <input
                type="text"
                value={lowerLimit}
                onChange={(e) => setLowerLimit(e.target.value)}
                placeholder="e.g., 0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upper Limit
              </label>
              <input
                type="text"
                value={upperLimit}
                onChange={(e) => setUpperLimit(e.target.value)}
                placeholder="e.g., 1"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
              />
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={calculateIntegral}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate Integral
        </button>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm">
                    <span className="text-gray-600">∫{ex.expression}dx</span>
                    <span className="text-gray-400 mx-2">=</span>
                    <span className="text-blue-600">{ex.result}</span>
                  </div>
                  <button
                    onClick={() => setExpression(ex.expression)}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Integral Result</h3>
                  
                  <div className="text-center mb-6">
                    {integrationType === 'indefinite' ? (
                      <>
                        <div className="text-3xl font-bold text-blue-600 mb-2 font-mono">
                          {result.integral}
                        </div>
                        <div className="text-gray-600 font-mono">
                          ∫{result.original} d{result.variable} = {result.integral}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-3xl font-bold text-blue-600 mb-2 font-mono">
                          {result.definite.result.toFixed(6)}
                        </div>
                        <div className="text-gray-600 font-mono">
                          ∫<sub>{result.definite.lowerLimit}</sub><sup>{result.definite.upperLimit}</sup> {result.original} d{result.variable} = {result.definite.result.toFixed(6)}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
                  <div className="space-y-2">
                    {result.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="text-gray-700 font-mono text-sm">{step}</div>
                      </div>
                    ))}
                    
                    {integrationType === 'definite' && result.definite && (
                      <>
                        <div className="border-t border-gray-200 my-4"></div>
                        {result.definite.steps.map((step: string, index: number) => (
                          <div key={`def-${index}`} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
                              {result.steps.length + index + 1}
                            </div>
                            <div className="text-gray-700 font-mono text-sm">{step}</div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Integration Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Rules</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• ∫c dx = cx + C (constant)</li>
                <li>• ∫x^n dx = x^(n+1)/(n+1) + C (n ≠ -1)</li>
                <li>• ∫[f(x) + g(x)]dx = ∫f(x)dx + ∫g(x)dx (sum rule)</li>
                <li>• ∫[f(x) - g(x)]dx = ∫f(x)dx - ∫g(x)dx (difference rule)</li>
                <li>• ∫c·f(x)dx = c·∫f(x)dx (constant multiple rule)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Common Functions</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• ∫sin(x)dx = -cos(x) + C</li>
                <li>• ∫cos(x)dx = sin(x) + C</li>
                <li>• ∫tan(x)dx = -ln|cos(x)| + C</li>
                <li>• ∫e^x dx = e^x + C</li>
                <li>• ∫(1/x)dx = ln|x| + C</li>
                <li>• ∫a^x dx = a^x/ln(a) + C</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-yellow-50 rounded-lg p-4 text-yellow-800 text-sm">
          <p className="font-semibold">Note:</p>
          <p>This calculator handles basic integrals including polynomials, trigonometric functions, and exponentials. For more complex functions or techniques like substitution and integration by parts, please use a more advanced calculator.</p>
        </div>
      </div>
    </div>
  );
};

export default IntegralCalculator;