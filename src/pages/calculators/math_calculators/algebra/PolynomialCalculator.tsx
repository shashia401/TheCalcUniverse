import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, FunctionSquare, Plus, Minus, X, Divide } from 'lucide-react';

interface Term {
  coefficient: number;
  exponent: number;
}

interface Polynomial {
  terms: Term[];
}

const PolynomialCalculator: React.FC = () => {
  const [polynomial1, setPolynomial1] = useState('');
  const [polynomial2, setPolynomial2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add');
  const [result, setResult] = useState<any>(null);

  const parsePolynomial = (input: string): Polynomial => {
    // Clean up the input
    const cleaned = input.replace(/\s+/g, '');
    
    // Match terms like +3x^2, -4x, 5, etc.
    const termRegex = /([+-]?\d*\.?\d*)x(?:\^(\d+))?|([+-]?\d+)/g;
    const terms: Term[] = [];
    
    let match;
    while ((match = termRegex.exec(cleaned)) !== null) {
      if (match[3]) {
        // Constant term
        terms.push({
          coefficient: parseFloat(match[3]),
          exponent: 0
        });
      } else {
        // Term with x
        let coefficient = match[1];
        if (coefficient === '+' || coefficient === '-' || coefficient === '') {
          coefficient = coefficient + '1';
        }
        terms.push({
          coefficient: parseFloat(coefficient),
          exponent: match[2] ? parseInt(match[2]) : 1
        });
      }
    }
    
    // Sort by descending exponent
    terms.sort((a, b) => b.exponent - a.exponent);
    
    return { terms };
  };

  const formatPolynomial = (poly: Polynomial): string => {
    if (poly.terms.length === 0) return '0';
    
    return poly.terms.map((term, index) => {
      let termStr = '';
      
      // Add sign
      if (index === 0) {
        if (term.coefficient < 0) termStr += '-';
      } else {
        termStr += term.coefficient < 0 ? ' - ' : ' + ';
      }
      
      // Add coefficient (absolute value)
      const absCoeff = Math.abs(term.coefficient);
      if (absCoeff !== 1 || term.exponent === 0) {
        termStr += absCoeff;
      }
      
      // Add variable and exponent
      if (term.exponent > 0) {
        termStr += 'x';
        if (term.exponent > 1) {
          termStr += `^${term.exponent}`;
        }
      }
      
      return termStr;
    }).join('');
  };

  const addPolynomials = (poly1: Polynomial, poly2: Polynomial): Polynomial => {
    const result: Term[] = [...poly1.terms];
    
    // Add terms from poly2
    poly2.terms.forEach(term2 => {
      const existingTerm = result.find(term => term.exponent === term2.exponent);
      if (existingTerm) {
        existingTerm.coefficient += term2.coefficient;
      } else {
        result.push({ ...term2 });
      }
    });
    
    // Remove terms with zero coefficient
    const filteredTerms = result.filter(term => term.coefficient !== 0);
    
    // Sort by descending exponent
    filteredTerms.sort((a, b) => b.exponent - a.exponent);
    
    return { terms: filteredTerms };
  };

  const subtractPolynomials = (poly1: Polynomial, poly2: Polynomial): Polynomial => {
    const negatedPoly2: Polynomial = {
      terms: poly2.terms.map(term => ({
        coefficient: -term.coefficient,
        exponent: term.exponent
      }))
    };
    
    return addPolynomials(poly1, negatedPoly2);
  };

  const multiplyPolynomials = (poly1: Polynomial, poly2: Polynomial): Polynomial => {
    const result: Term[] = [];
    
    // Multiply each term from poly1 with each term from poly2
    poly1.terms.forEach(term1 => {
      poly2.terms.forEach(term2 => {
        const newTerm: Term = {
          coefficient: term1.coefficient * term2.coefficient,
          exponent: term1.exponent + term2.exponent
        };
        
        // Check if there's already a term with this exponent
        const existingTerm = result.find(term => term.exponent === newTerm.exponent);
        if (existingTerm) {
          existingTerm.coefficient += newTerm.coefficient;
        } else {
          result.push(newTerm);
        }
      });
    });
    
    // Remove terms with zero coefficient
    const filteredTerms = result.filter(term => term.coefficient !== 0);
    
    // Sort by descending exponent
    filteredTerms.sort((a, b) => b.exponent - a.exponent);
    
    return { terms: filteredTerms };
  };

  const dividePolynomials = (poly1: Polynomial, poly2: Polynomial): any => {
    // Check if divisor is zero
    if (poly2.terms.length === 0 || (poly2.terms.length === 1 && poly2.terms[0].coefficient === 0)) {
      return { error: "Cannot divide by zero polynomial" };
    }
    
    // Sort terms by descending exponent
    const dividend = [...poly1.terms].sort((a, b) => b.exponent - a.exponent);
    const divisor = [...poly2.terms].sort((a, b) => b.exponent - a.exponent);
    
    // Check if leading coefficient of divisor is zero
    if (divisor[0].coefficient === 0) {
      return { error: "Leading coefficient of divisor cannot be zero" };
    }
    
    const quotientTerms: Term[] = [];
    const remainderTerms = [...dividend];
    const steps: string[] = [];
    
    steps.push(`Dividend: ${formatPolynomial({ terms: dividend })}`);
    steps.push(`Divisor: ${formatPolynomial({ terms: divisor })}`);
    
    // Long division process
    while (remainderTerms.length > 0 && remainderTerms[0].exponent >= divisor[0].exponent) {
      // Calculate the new quotient term
      const quotientCoeff = remainderTerms[0].coefficient / divisor[0].coefficient;
      const quotientExp = remainderTerms[0].exponent - divisor[0].exponent;
      
      const quotientTerm: Term = {
        coefficient: quotientCoeff,
        exponent: quotientExp
      };
      
      quotientTerms.push(quotientTerm);
      
      steps.push(`Step: Divide leading terms: ${remainderTerms[0].coefficient}x^${remainderTerms[0].exponent} ÷ ${divisor[0].coefficient}x^${divisor[0].exponent} = ${quotientCoeff}x^${quotientExp}`);
      
      // Multiply divisor by the new quotient term and subtract from remainder
      const subtractTerms: Term[] = [];
      divisor.forEach(divTerm => {
        subtractTerms.push({
          coefficient: divTerm.coefficient * quotientCoeff,
          exponent: divTerm.exponent + quotientExp
        });
      });
      
      steps.push(`Multiply divisor by ${quotientCoeff}x^${quotientExp} and subtract from remainder`);
      
      // Remove the first term (it will be canceled out)
      remainderTerms.shift();
      
      // Subtract the rest of the terms
      subtractTerms.slice(1).forEach(subTerm => {
        const existingIndex = remainderTerms.findIndex(term => term.exponent === subTerm.exponent);
        if (existingIndex >= 0) {
          remainderTerms[existingIndex].coefficient -= subTerm.coefficient;
          // Remove if coefficient becomes zero
          if (Math.abs(remainderTerms[existingIndex].coefficient) < 1e-10) {
            remainderTerms.splice(existingIndex, 1);
          }
        } else {
          remainderTerms.push({
            coefficient: -subTerm.coefficient,
            exponent: subTerm.exponent
          });
        }
      });
      
      // Sort remainder terms
      remainderTerms.sort((a, b) => b.exponent - a.exponent);
      
      steps.push(`New remainder: ${formatPolynomial({ terms: remainderTerms }) || '0'}`);
    }
    
    // Sort quotient terms
    quotientTerms.sort((a, b) => b.exponent - a.exponent);
    
    return {
      quotient: { terms: quotientTerms },
      remainder: { terms: remainderTerms },
      steps
    };
  };

  const calculateResult = () => {
    try {
      const poly1 = parsePolynomial(polynomial1);
      const poly2 = parsePolynomial(polynomial2);
      
      let resultPoly;
      let steps = [];
      
      steps.push(`First polynomial: ${formatPolynomial(poly1)}`);
      steps.push(`Second polynomial: ${formatPolynomial(poly2)}`);
      
      switch (operation) {
        case 'add':
          resultPoly = addPolynomials(poly1, poly2);
          steps.push(`Adding the polynomials term by term`);
          steps.push(`Result: ${formatPolynomial(resultPoly)}`);
          setResult({ polynomial: resultPoly, formatted: formatPolynomial(resultPoly), steps });
          break;
          
        case 'subtract':
          resultPoly = subtractPolynomials(poly1, poly2);
          steps.push(`Subtracting the polynomials term by term`);
          steps.push(`Result: ${formatPolynomial(resultPoly)}`);
          setResult({ polynomial: resultPoly, formatted: formatPolynomial(resultPoly), steps });
          break;
          
        case 'multiply':
          resultPoly = multiplyPolynomials(poly1, poly2);
          steps.push(`Multiplying each term of the first polynomial by each term of the second`);
          steps.push(`Combining like terms`);
          steps.push(`Result: ${formatPolynomial(resultPoly)}`);
          setResult({ polynomial: resultPoly, formatted: formatPolynomial(resultPoly), steps });
          break;
          
        case 'divide':
          const divisionResult = dividePolynomials(poly1, poly2);
          
          if (divisionResult.error) {
            setResult({ error: divisionResult.error, steps: [divisionResult.error] });
          } else {
            const quotientFormatted = formatPolynomial(divisionResult.quotient);
            const remainderFormatted = formatPolynomial(divisionResult.remainder);
            
            steps = [...divisionResult.steps];
            steps.push(`Quotient: ${quotientFormatted}`);
            
            if (divisionResult.remainder.terms.length > 0) {
              steps.push(`Remainder: ${remainderFormatted}`);
              setResult({
                quotient: divisionResult.quotient,
                remainder: divisionResult.remainder,
                formatted: `${quotientFormatted} + (${remainderFormatted}) / (${formatPolynomial(poly2)})`,
                steps
              });
            } else {
              setResult({
                quotient: divisionResult.quotient,
                remainder: divisionResult.remainder,
                formatted: quotientFormatted,
                steps
              });
            }
          }
          break;
      }
    } catch (error) {
      setResult({ error: "Invalid polynomial format", steps: ["Error: Please check the format of your polynomials"] });
    }
  };

  const examples = [
    { poly1: '3x^2 + 2x - 5', poly2: 'x^2 - 3x + 1', operation: 'add' },
    { poly1: '4x^3 - 2x + 7', poly2: '2x^3 + 3x^2 - 5', operation: 'subtract' },
    { poly1: 'x^2 + 3', poly2: 'x - 2', operation: 'multiply' },
    { poly1: 'x^3 - 2x^2 + 3x - 4', poly2: 'x - 1', operation: 'divide' },
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
        <span className="text-gray-900 font-medium">Polynomial Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FunctionSquare className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Polynomial Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="space-y-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Polynomial
            </label>
            <input
              type="text"
              value={polynomial1}
              onChange={(e) => setPolynomial1(e.target.value)}
              placeholder="e.g., 3x^2 + 2x - 5"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: 'add', name: 'Add', icon: Plus },
                { id: 'subtract', name: 'Subtract', icon: Minus },
                { id: 'multiply', name: 'Multiply', icon: X },
                { id: 'divide', name: 'Divide', icon: Divide },
              ].map((op) => (
                <button
                  key={op.id}
                  onClick={() => setOperation(op.id as any)}
                  className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                    operation === op.id
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <op.icon className="w-5 h-5 mr-2" />
                  {op.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Polynomial
            </label>
            <input
              type="text"
              value={polynomial2}
              onChange={(e) => setPolynomial2(e.target.value)}
              placeholder="e.g., x^2 - 3x + 1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg font-mono"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateResult}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate
        </button>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm mb-2">
                  <span className="font-mono text-gray-600">{ex.poly1}</span>
                  <span className="mx-2 text-indigo-600">
                    {ex.operation === 'add' && '+'}
                    {ex.operation === 'subtract' && '-'}
                    {ex.operation === 'multiply' && '×'}
                    {ex.operation === 'divide' && '÷'}
                  </span>
                  <span className="font-mono text-gray-600">{ex.poly2}</span>
                </div>
                <button
                  onClick={() => {
                    setPolynomial1(ex.poly1);
                    setPolynomial2(ex.poly2);
                    setOperation(ex.operation as any);
                  }}
                  className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200 transition-colors"
                >
                  Try This Example
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
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Result</h3>
                
                <div className="text-center mb-6">
                  <div className="text-2xl font-bold text-indigo-600 font-mono">
                    {result.formatted}
                  </div>
                </div>
                
                {operation === 'divide' && result.remainder && result.remainder.terms.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Quotient</div>
                      <div className="text-lg font-mono text-indigo-600">
                        {formatPolynomial(result.quotient)}
                      </div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Remainder</div>
                      <div className="text-lg font-mono text-purple-600">
                        {formatPolynomial(result.remainder)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
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
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Polynomial Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Addition & Subtraction</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Combine like terms (terms with same exponent)</li>
                <li>• For subtraction, negate all terms in second polynomial</li>
                <li>• Result has same degree as highest degree polynomial</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Multiplication</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Multiply each term in first by each in second</li>
                <li>• Combine like terms in the result</li>
                <li>• Degree of result = sum of degrees of inputs</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Division</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Uses polynomial long division</li>
                <li>• May have a remainder</li>
                <li>• Result = quotient + remainder/divisor</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Input Format</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Use x as the variable</li>
                <li>• Use ^ for exponents (e.g., x^2)</li>
                <li>• Include all terms, even with zero coefficients</li>
                <li>• Example: 3x^2 + 0x - 5</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolynomialCalculator;