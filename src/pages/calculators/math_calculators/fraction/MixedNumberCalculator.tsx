import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Calculator, Plus, Minus, X, Divide } from 'lucide-react';

interface MixedNumber {
  whole: number;
  numerator: number;
  denominator: number;
}

interface Fraction {
  numerator: number;
  denominator: number;
}

const MixedNumberCalculator: React.FC = () => {
  const [mixed1, setMixed1] = useState({ whole: '', numerator: '', denominator: '' });
  const [mixed2, setMixed2] = useState({ whole: '', numerator: '', denominator: '' });
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState<any>(null);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs((a * b) / gcd(a, b));
  };

  const simplifyFraction = (num: number, den: number): Fraction => {
    if (den === 0) throw new Error("Cannot divide by zero");
    const divisor = gcd(num, den);
    const sign = den < 0 ? -1 : 1;
    return {
      numerator: (sign * num) / divisor,
      denominator: Math.abs(den) / divisor
    };
  };

  const mixedToImproper = (mixed: { whole: string; numerator: string; denominator: string }): Fraction => {
    const w = parseInt(mixed.whole) || 0;
    const n = parseInt(mixed.numerator) || 0;
    const d = parseInt(mixed.denominator) || 1;
    
    if (d === 0) throw new Error("Denominator cannot be zero");
    
    const improperNum = Math.abs(w) * d + n;
    return {
      numerator: w < 0 ? -improperNum : improperNum,
      denominator: d
    };
  };

  const improperToMixed = (fraction: Fraction): MixedNumber => {
    const whole = Math.floor(Math.abs(fraction.numerator) / fraction.denominator);
    const remainder = Math.abs(fraction.numerator) % fraction.denominator;
    
    return {
      whole: fraction.numerator < 0 ? -whole : whole,
      numerator: remainder,
      denominator: fraction.denominator
    };
  };

  const addFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenom = lcm(f1.denominator, f2.denominator);
    return {
      numerator: (f1.numerator * (commonDenom / f1.denominator)) + 
                (f2.numerator * (commonDenom / f2.denominator)),
      denominator: commonDenom
    };
  };

  const subtractFractions = (f1: Fraction, f2: Fraction): Fraction => {
    const commonDenom = lcm(f1.denominator, f2.denominator);
    return {
      numerator: (f1.numerator * (commonDenom / f1.denominator)) - 
                (f2.numerator * (commonDenom / f2.denominator)),
      denominator: commonDenom
    };
  };

  const multiplyFractions = (f1: Fraction, f2: Fraction): Fraction => ({
    numerator: f1.numerator * f2.numerator,
    denominator: f1.denominator * f2.denominator
  });

  const divideFractions = (f1: Fraction, f2: Fraction): Fraction => {
    if (f2.numerator === 0) throw new Error("Cannot divide by zero");
    return {
      numerator: f1.numerator * f2.denominator,
      denominator: f1.denominator * f2.numerator
    };
  };

  const calculateMixedNumbers = () => {
    try {
      const f1 = mixedToImproper(mixed1);
      const f2 = mixedToImproper(mixed2);

      let resultFraction: Fraction;

      switch (operation) {
        case '+':
          resultFraction = addFractions(f1, f2);
          break;
        case '-':
          resultFraction = subtractFractions(f1, f2);
          break;
        case '*':
          resultFraction = multiplyFractions(f1, f2);
          break;
        case '/':
          resultFraction = divideFractions(f1, f2);
          break;
        default:
          throw new Error("Invalid operation");
      }

      const simplified = simplifyFraction(resultFraction.numerator, resultFraction.denominator);
      const mixedResult = improperToMixed(simplified);
      const decimal = simplified.numerator / simplified.denominator;

      // Generate steps
      const steps = generateSteps(f1, f2, operation, simplified, mixedResult);

      setResult({
        improperFraction: simplified,
        mixedNumber: mixedResult,
        decimal: decimal,
        percentage: decimal * 100,
        steps: steps
      });
    } catch (error: any) {
      setResult({ error: error.message });
    }
  };

  const generateSteps = (f1: Fraction, f2: Fraction, op: string, result: Fraction, mixed: MixedNumber): string[] => {
    const steps: string[] = [];
    
    steps.push(`Step 1: Convert mixed numbers to improper fractions`);
    steps.push(`First mixed number: ${f1.numerator}/${f1.denominator}`);
    steps.push(`Second mixed number: ${f2.numerator}/${f2.denominator}`);
    
    if (op === '+' || op === '-') {
      const commonDenom = lcm(f1.denominator, f2.denominator);
      steps.push(`Step 2: Find common denominator (LCM of ${f1.denominator} and ${f2.denominator} = ${commonDenom})`);
      steps.push(`Step 3: ${op === '+' ? 'Add' : 'Subtract'} the fractions`);
    } else if (op === '*') {
      steps.push(`Step 2: Multiply the fractions`);
      steps.push(`(${f1.numerator} × ${f2.numerator}) / (${f1.denominator} × ${f2.denominator})`);
    } else if (op === '/') {
      steps.push(`Step 2: Multiply by the reciprocal`);
      steps.push(`${f1.numerator}/${f1.denominator} × ${f2.denominator}/${f2.numerator}`);
    }
    
    steps.push(`Step 4: Simplify the result: ${result.numerator}/${result.denominator}`);
    steps.push(`Step 5: Convert back to mixed number: ${formatMixed(mixed)}`);
    
    return steps;
  };

  useEffect(() => {
    calculateMixedNumbers();
  }, [mixed1, mixed2, operation]);

  const formatMixed = (mixed: MixedNumber): string => {
    if (mixed.numerator === 0) return mixed.whole.toString();
    if (mixed.whole === 0) return `${mixed.numerator}/${mixed.denominator}`;
    return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
  };

  const formatFraction = (f: Fraction): string => {
    if (f.denominator === 1) return f.numerator.toString();
    return `${f.numerator}/${f.denominator}`;
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
        <span className="text-gray-900 font-medium">Mixed Number Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Calculator className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Mixed Number Calculator</h1>
        </div>

        {/* Calculator Interface */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* First Mixed Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">First Mixed Number</label>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-2">
                <input
                  type="number"
                  value={mixed1.whole}
                  onChange={(e) => setMixed1({...mixed1, whole: e.target.value})}
                  placeholder="Whole"
                  className="w-full text-center text-lg font-mono bg-transparent border-b border-gray-300 pb-2"
                />
                <div className="flex space-x-2 items-center">
                  <input
                    type="number"
                    value={mixed1.numerator}
                    onChange={(e) => setMixed1({...mixed1, numerator: e.target.value})}
                    placeholder="Num"
                    className="w-full text-center text-lg font-mono bg-transparent"
                  />
                  <span className="text-lg font-bold">/</span>
                  <input
                    type="number"
                    value={mixed1.denominator}
                    onChange={(e) => setMixed1({...mixed1, denominator: e.target.value})}
                    placeholder="Den"
                    className="w-full text-center text-lg font-mono bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Operation */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="text-2xl font-bold bg-green-100 rounded-lg p-3 border-2 border-green-300 w-16 h-16 text-center"
              >
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
            </div>

            {/* Second Mixed Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Mixed Number</label>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-2">
                <input
                  type="number"
                  value={mixed2.whole}
                  onChange={(e) => setMixed2({...mixed2, whole: e.target.value})}
                  placeholder="Whole"
                  className="w-full text-center text-lg font-mono bg-transparent border-b border-gray-300 pb-2"
                />
                <div className="flex space-x-2 items-center">
                  <input
                    type="number"
                    value={mixed2.numerator}
                    onChange={(e) => setMixed2({...mixed2, numerator: e.target.value})}
                    placeholder="Num"
                    className="w-full text-center text-lg font-mono bg-transparent"
                  />
                  <span className="text-lg font-bold">/</span>
                  <input
                    type="number"
                    value={mixed2.denominator}
                    onChange={(e) => setMixed2({...mixed2, denominator: e.target.value})}
                    placeholder="Den"
                    className="w-full text-center text-lg font-mono bg-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Equals */}
            <div className="text-center">
              <span className="text-2xl font-bold text-gray-600">=</span>
            </div>

            {/* Result */}
            <div className="md:col-span-2">
              {result?.error ? (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
                  <p className="text-red-600 text-sm">{result.error}</p>
                </div>
              ) : result && (
                <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                  <div className="text-lg font-mono text-green-800">
                    {formatMixed(result.mixedNumber)}
                  </div>
                  <div className="text-sm text-green-600 mt-1">
                    {formatFraction(result.improperFraction)}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Multiple Representations */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Result Representations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mixed Number</div>
                  <div className="text-xl font-mono text-green-600">{formatMixed(result.mixedNumber)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Improper Fraction</div>
                  <div className="text-xl font-mono text-blue-600">{formatFraction(result.improperFraction)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Decimal</div>
                  <div className="text-xl font-mono text-purple-600">{result.decimal.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Percentage</div>
                  <div className="text-xl font-mono text-orange-600">{result.percentage.toFixed(2)}%</div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-3">
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
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Mixed Numbers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">What are Mixed Numbers?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Combination of whole number and fraction</li>
                <li>• Example: 2 1/3 = 2 + 1/3</li>
                <li>• Also called mixed fractions</li>
                <li>• Easier to visualize than improper fractions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Calculation Process</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Convert to improper fractions</li>
                <li>• Perform the operation</li>
                <li>• Simplify the result</li>
                <li>• Convert back to mixed number</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MixedNumberCalculator;