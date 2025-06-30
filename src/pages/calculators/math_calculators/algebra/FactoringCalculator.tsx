import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Divide, X } from 'lucide-react';

const FactoringCalculator: React.FC = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState<any>(null);

  const factorExpression = () => {
    if (!expression.trim()) {
      setResult(null);
      return;
    }

    try {
      // Parse the expression
      const cleanedExpression = expression.replace(/\s+/g, '');
      
      // Check if it's a quadratic expression
      const quadraticRegex = /^([+-]?\d*)?x\^2([+-]\d*)?x?([+-]\d+)?$/;
      const match = cleanedExpression.match(quadraticRegex);
      
      if (match) {
        // Extract coefficients
        let a = match[1] ? (match[1] === '+' || match[1] === '-' ? match[1] + '1' : match[1]) : '1';
        let b = match[2] ? (match[2] === '+' || match[2] === '-' ? match[2] + '1' : match[2]) : '0';
        let c = match[3] || '0';
        
        a = parseFloat(a);
        b = parseFloat(b);
        c = parseFloat(c);
        
        return factorQuadratic(a, b, c);
      }
      
      // Check if it's a difference of squares: a²-b²
      const diffSquaresRegex = /^(\d+)\^2-(\d+)\^2$/;
      const diffMatch = cleanedExpression.match(diffSquaresRegex);
      
      if (diffMatch) {
        const a = parseInt(diffMatch[1]);
        const b = parseInt(diffMatch[2]);
        return factorDifferenceOfSquares(a, b);
      }
      
      // Check if it's a perfect square trinomial: a²+2ab+b²
      const perfectSquareRegex = /^(\d+)\^2([+-])2\*(\d+)\*x\+(\d+)\^2$/;
      const perfectMatch = cleanedExpression.match(perfectSquareRegex);
      
      if (perfectMatch) {
        const a = parseInt(perfectMatch[1]);
        const sign = perfectMatch[2];
        const b = parseInt(perfectMatch[3]);
        return factorPerfectSquare(a, sign, b);
      }
      
      // If no pattern is recognized
      setResult({
        factored: null,
        steps: ["Sorry, I couldn't recognize the pattern of this expression. Please check the format."],
        error: "Unsupported expression format"
      });
    } catch (error) {
      setResult({
        factored: null,
        steps: ["Error processing the expression. Please check the format."],
        error: "Invalid expression"
      });
    }
  };

  const factorQuadratic = (a: number, b: number, c: number) => {
    const steps = [];
    steps.push(`Original expression: ${a}x² + ${b}x + ${c}`);
    
    // Check if a is not 1, factor out GCD if possible
    let gcd = findGCD(Math.abs(a), Math.abs(b), Math.abs(c));
    let factored = '';
    
    if (gcd > 1) {
      steps.push(`Factor out the GCD ${gcd}:`);
      steps.push(`${gcd} × (${a/gcd}x² + ${b/gcd}x + ${c/gcd})`);
      a = a / gcd;
      b = b / gcd;
      c = c / gcd;
      factored = `${gcd}(${a}x² + ${b}x + ${c})`;
    }
    
    // Calculate discriminant
    const discriminant = b * b - 4 * a * c;
    steps.push(`Calculate the discriminant: b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`);
    
    if (discriminant < 0) {
      steps.push(`The discriminant is negative, so this quadratic cannot be factored with real numbers.`);
      return setResult({
        factored: factored || `${a}x² + ${b}x + ${c}`,
        steps,
        error: "Cannot be factored with real numbers"
      });
    }
    
    if (discriminant === 0) {
      // Perfect square
      const root = -b / (2 * a);
      steps.push(`The discriminant is zero, so this is a perfect square trinomial.`);
      steps.push(`x = -b/(2a) = ${-b}/(2×${a}) = ${root}`);
      
      if (a === 1) {
        factored = `(x + ${-root})²`;
      } else if (a === -1) {
        factored = `-(x + ${-root})²`;
      } else {
        factored = `${a}(x + ${-root})²`;
      }
      
      steps.push(`Factored form: ${factored}`);
      return setResult({ factored, steps });
    }
    
    // Discriminant > 0, find the roots
    const sqrtDiscriminant = Math.sqrt(discriminant);
    const root1 = (-b + sqrtDiscriminant) / (2 * a);
    const root2 = (-b - sqrtDiscriminant) / (2 * a);
    
    steps.push(`The discriminant is positive, so we have two real roots.`);
    steps.push(`x₁ = (-b + √Δ)/(2a) = (${-b} + √${discriminant})/(2×${a}) = ${root1}`);
    steps.push(`x₂ = (-b - √Δ)/(2a) = (${-b} - √${discriminant})/(2×${a}) = ${root2}`);
    
    // Check if roots are integers or simple fractions
    const isInteger1 = Number.isInteger(root1);
    const isInteger2 = Number.isInteger(root2);
    
    if (isInteger1 && isInteger2) {
      steps.push(`Both roots are integers, so we can factor directly.`);
      
      if (a === 1) {
        factored = `(x + ${-root1})(x + ${-root2})`;
      } else if (a === -1) {
        factored = `-(x + ${-root1})(x + ${-root2})`;
      } else {
        factored = `${a}(x + ${-root1})(x + ${-root2})`;
      }
    } else {
      // Try to find factors of a*c that sum to b
      steps.push(`Finding factors of a×c = ${a}×${c} = ${a*c} that sum to b = ${b}`);
      
      let found = false;
      const absAC = Math.abs(a * c);
      
      for (let i = 1; i <= Math.sqrt(absAC); i++) {
        if (absAC % i === 0) {
          const factor1 = i;
          const factor2 = absAC / i;
          
          if ((factor1 + factor2) * Math.sign(a * c) === b) {
            steps.push(`Found factors: ${factor1} and ${factor2}`);
            steps.push(`Rewrite the middle term: ${b}x = ${factor1}x + ${factor2}x`);
            steps.push(`Rewrite the expression: ${a}x² + ${factor1}x + ${factor2}x + ${c}`);
            steps.push(`Group terms: (${a}x² + ${factor1}x) + (${factor2}x + ${c})`);
            
            // Continue with factoring by grouping
            const gcd1 = findGCD(a, factor1);
            const gcd2 = findGCD(factor2, c);
            
            if (gcd1 > 1 && gcd2 > 1) {
              steps.push(`Factor out common terms: ${gcd1}x(${a/gcd1}x + ${factor1/gcd1}) + ${gcd2}(${factor2/gcd2}x + ${c/gcd2})`);
              
              if ((a/gcd1) === (factor2/gcd2) && (factor1/gcd1) === (c/gcd2)) {
                factored = `(${a/gcd1}x + ${factor1/gcd1})(${gcd1}x + ${gcd2})`;
                steps.push(`Final factored form: ${factored}`);
                found = true;
                break;
              }
            }
          }
        }
      }
      
      if (!found) {
        steps.push(`Could not find simple factors. Using the roots directly.`);
        
        if (a === 1) {
          factored = `(x - ${root1})(x - ${root2})`;
        } else {
          factored = `${a}(x - ${root1})(x - ${root2})`;
        }
      }
    }
    
    steps.push(`Factored form: ${factored}`);
    return setResult({ factored, steps });
  };

  const factorDifferenceOfSquares = (a: number, b: number) => {
    const steps = [];
    steps.push(`Original expression: ${a}² - ${b}²`);
    steps.push(`This is a difference of squares: a² - b² = (a+b)(a-b)`);
    const factored = `(${a} + ${b})(${a} - ${b})`;
    steps.push(`Factored form: ${factored}`);
    return setResult({ factored, steps });
  };

  const factorPerfectSquare = (a: number, sign: string, b: number) => {
    const steps = [];
    steps.push(`Original expression: ${a}² ${sign} 2×${a}×${b} + ${b}²`);
    steps.push(`This is a perfect square trinomial: a² + 2ab + b² = (a+b)²`);
    
    const factored = sign === '+' 
      ? `(${a} + ${b})²` 
      : `(${a} - ${b})²`;
    
    steps.push(`Factored form: ${factored}`);
    return setResult({ factored, steps });
  };

  const findGCD = (...numbers: number[]): number => {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b);
    };
    
    return numbers.reduce((result, num) => gcd(result, num));
  };

  const examples = [
    { expression: 'x^2 + 5x + 6', result: '(x + 2)(x + 3)' },
    { expression: 'x^2 - 9', result: '(x + 3)(x - 3)' },
    { expression: '2x^2 + 8x + 8', result: '2(x + 2)²' },
    { expression: '3x^2 - 12', result: '3(x + 2)(x - 2)' },
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
        <span className="text-gray-900 font-medium">Factoring Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Divide className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Factoring Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter an Expression to Factor
          </label>
          <div className="flex space-x-4">
            <input
              type="text"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
              placeholder="e.g., x^2 + 5x + 6"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono"
            />
            <button
              onClick={factorExpression}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Factor
            </button>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            Supported formats: quadratics (ax² + bx + c), difference of squares (a²-b²), perfect square trinomials
          </div>
        </div>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="font-mono text-sm">
                    <span className="text-gray-600">{ex.expression}</span>
                    <span className="text-gray-400 mx-2">=</span>
                    <span className="text-purple-600">{ex.result}</span>
                  </div>
                  <button
                    onClick={() => setExpression(ex.expression)}
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
            {/* Main Result */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Factored Result</h3>
              
              {result.error ? (
                <div className="text-center">
                  <div className="text-lg text-red-600 mb-2">{result.error}</div>
                  <div className="text-gray-600">{expression}</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {result.factored}
                  </div>
                  <div className="text-gray-600">
                    Original: {expression}
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

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Factoring Techniques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Quadratic Expressions</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Find two numbers that multiply to ac and add to b</li>
                <li>• Use factoring by grouping</li>
                <li>• For ax² + bx + c, find p and q where p×q = c and p+q = b</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Special Patterns</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Difference of squares: a² - b² = (a+b)(a-b)</li>
                <li>• Perfect square: a² + 2ab + b² = (a+b)²</li>
                <li>• Sum of cubes: a³ + b³ = (a+b)(a² - ab + b²)</li>
                <li>• Difference of cubes: a³ - b³ = (a-b)(a² + ab + b²)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FactoringCalculator;