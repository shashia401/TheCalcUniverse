import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Divide, Info, Calculator, ArrowRight } from 'lucide-react';

interface Fraction {
  numerator: number;
  denominator: number;
}

interface MixedNumber {
  whole: number;
  fraction: Fraction;
}

interface CalculationResult {
  original: Fraction;
  simplified: Fraction;
  mixed: MixedNumber | null;
  decimal: number;
  percentage: number;
  steps: string[];
}

const FractionCalculator: React.FC = () => {
  const [inputType, setInputType] = useState<'fraction' | 'mixed'>('fraction');
  const [fraction1, setFraction1] = useState({ numerator: '', denominator: '' });
  const [fraction2, setFraction2] = useState({ numerator: '', denominator: '' });
  const [mixed1, setMixed1] = useState({ whole: '', numerator: '', denominator: '' });
  const [mixed2, setMixed2] = useState({ whole: '', numerator: '', denominator: '' });
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Single fraction operations
  const [singleFraction, setSingleFraction] = useState({ numerator: '', denominator: '' });
  const [singleMixed, setSingleMixed] = useState({ whole: '', numerator: '', denominator: '' });
  const [singleResult, setSingleResult] = useState<any>(null);

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

  const mixedToImproper = (whole: string, num: string, den: string): Fraction => {
    const w = parseInt(whole) || 0;
    const n = parseInt(num) || 0;
    const d = parseInt(den) || 1;
    const improperNum = Math.abs(w) * d + n;
    return {
      numerator: w < 0 ? -improperNum : improperNum,
      denominator: d
    };
  };

  const improperToMixed = (fraction: Fraction): MixedNumber | null => {
    if (Math.abs(fraction.numerator) < fraction.denominator) return null;
    
    const whole = Math.floor(Math.abs(fraction.numerator) / fraction.denominator);
    const remainder = Math.abs(fraction.numerator) % fraction.denominator;
    return {
      whole: fraction.numerator < 0 ? -whole : whole,
      fraction: {
        numerator: remainder,
        denominator: fraction.denominator
      }
    };
  };

  const generateSteps = (f1: Fraction, f2: Fraction, op: string, result: Fraction): string[] => {
    const steps: string[] = [];
    
    steps.push(`Step 1: Set up the problem`);
    steps.push(`${f1.numerator}/${f1.denominator} ${op} ${f2.numerator}/${f2.denominator}`);

    if (op === '+' || op === '-') {
      const commonDenom = lcm(f1.denominator, f2.denominator);
      const newNum1 = f1.numerator * (commonDenom / f1.denominator);
      const newNum2 = f2.numerator * (commonDenom / f2.denominator);
      
      steps.push(`Step 2: Find common denominator (LCM of ${f1.denominator} and ${f2.denominator} = ${commonDenom})`);
      steps.push(`${f1.numerator}/${f1.denominator} = ${newNum1}/${commonDenom}`);
      steps.push(`${f2.numerator}/${f2.denominator} = ${newNum2}/${commonDenom}`);
      steps.push(`Step 3: ${op === '+' ? 'Add' : 'Subtract'} the numerators`);
      steps.push(`${newNum1}/${commonDenom} ${op} ${newNum2}/${commonDenom} = ${newNum1 + (op === '+' ? newNum2 : -newNum2)}/${commonDenom}`);
    } else if (op === '*') {
      steps.push(`Step 2: Multiply numerators and denominators`);
      steps.push(`(${f1.numerator} × ${f2.numerator}) / (${f1.denominator} × ${f2.denominator}) = ${f1.numerator * f2.numerator}/${f1.denominator * f2.denominator}`);
    } else if (op === '/') {
      steps.push(`Step 2: Multiply by the reciprocal`);
      steps.push(`${f1.numerator}/${f1.denominator} × ${f2.denominator}/${f2.numerator} = ${f1.numerator * f2.denominator}/${f1.denominator * f2.numerator}`);
    }

    const beforeSimplify = op === '+' || op === '-' ? 
      { numerator: f1.numerator * (lcm(f1.denominator, f2.denominator) / f1.denominator) + (op === '+' ? 1 : -1) * f2.numerator * (lcm(f1.denominator, f2.denominator) / f2.denominator), denominator: lcm(f1.denominator, f2.denominator) } :
      op === '*' ? { numerator: f1.numerator * f2.numerator, denominator: f1.denominator * f2.denominator } :
      { numerator: f1.numerator * f2.denominator, denominator: f1.denominator * f2.numerator };

    if (beforeSimplify.numerator !== result.numerator || beforeSimplify.denominator !== result.denominator) {
      const commonFactor = gcd(beforeSimplify.numerator, beforeSimplify.denominator);
      steps.push(`Step 4: Simplify by dividing by GCD(${Math.abs(beforeSimplify.numerator)}, ${beforeSimplify.denominator}) = ${commonFactor}`);
      steps.push(`${beforeSimplify.numerator}/${beforeSimplify.denominator} = ${result.numerator}/${result.denominator}`);
    }

    return steps;
  };

  const calculateFraction = () => {
    try {
      setError(null);
      let f1: Fraction, f2: Fraction;

      if (inputType === 'mixed') {
        f1 = mixedToImproper(mixed1.whole, mixed1.numerator, mixed1.denominator);
        f2 = mixedToImproper(mixed2.whole, mixed2.numerator, mixed2.denominator);
      } else {
        f1 = {
          numerator: parseInt(fraction1.numerator) || 0,
          denominator: parseInt(fraction1.denominator) || 1
        };
        f2 = {
          numerator: parseInt(fraction2.numerator) || 0,
          denominator: parseInt(fraction2.denominator) || 1
        };
      }

      if (f1.denominator === 0 || f2.denominator === 0) {
        throw new Error("Cannot divide by zero");
      }

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
          if (f2.numerator === 0) throw new Error("Cannot divide by zero");
          resultFraction = divideFractions(f1, f2);
          break;
        default:
          throw new Error("Invalid operation");
      }

      const simplified = simplifyFraction(resultFraction.numerator, resultFraction.denominator);
      const mixed = improperToMixed(simplified);
      const decimal = simplified.numerator / simplified.denominator;
      const percentage = decimal * 100;
      const steps = generateSteps(f1, f2, operation, simplified);

      setResult({
        original: resultFraction,
        simplified,
        mixed,
        decimal,
        percentage,
        steps
      });
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  const calculateSingleFraction = () => {
    try {
      let f: Fraction;

      if (inputType === 'mixed') {
        f = mixedToImproper(singleMixed.whole, singleMixed.numerator, singleMixed.denominator);
      } else {
        f = {
          numerator: parseInt(singleFraction.numerator) || 0,
          denominator: parseInt(singleFraction.denominator) || 1
        };
      }

      if (f.denominator === 0) {
        setSingleResult({ error: "Cannot divide by zero" });
        return;
      }

      const simplified = simplifyFraction(f.numerator, f.denominator);
      const mixed = improperToMixed(f);
      const decimal = f.numerator / f.denominator;
      const percentage = decimal * 100;
      const reciprocal = { numerator: f.denominator, denominator: f.numerator };

      setSingleResult({
        original: f,
        simplified,
        mixed,
        decimal,
        percentage,
        reciprocal: f.numerator !== 0 ? reciprocal : null,
        isProper: Math.abs(f.numerator) < f.denominator,
        isImproper: Math.abs(f.numerator) >= f.denominator,
        isWhole: f.numerator % f.denominator === 0
      });
    } catch (err: any) {
      setSingleResult({ error: err.message });
    }
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

  const divideFractions = (f1: Fraction, f2: Fraction): Fraction => ({
    numerator: f1.numerator * f2.denominator,
    denominator: f1.denominator * f2.numerator
  });

  useEffect(() => {
    calculateFraction();
  }, [fraction1, fraction2, mixed1, mixed2, operation, inputType]);

  useEffect(() => {
    calculateSingleFraction();
  }, [singleFraction, singleMixed, inputType]);

  const formatFraction = (f: Fraction): string => {
    if (f.denominator === 1) return f.numerator.toString();
    return `${f.numerator}/${f.denominator}`;
  };

  const formatMixed = (m: MixedNumber): string => {
    if (m.fraction.numerator === 0) return m.whole.toString();
    if (m.whole === 0) return `${m.fraction.numerator}/${m.fraction.denominator}`;
    return `${m.whole} ${m.fraction.numerator}/${m.fraction.denominator}`;
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Navigation */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">
          Math Calculators
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Fraction Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Calculator */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Divide className="w-8 h-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Fraction Calculator</h1>
            </div>

            {/* Input Type Toggle */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setInputType('fraction')}
                className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                  inputType === 'fraction'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Proper Fractions
              </button>
              <button
                onClick={() => setInputType('mixed')}
                className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                  inputType === 'mixed'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                Mixed Numbers
              </button>
            </div>

            {/* Two Fraction Calculator */}
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculate with Two Fractions</h3>
              
              {/* Calculator Grid */}
              <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
                {inputType === 'fraction' ? (
                  // Fraction Input
                  <>
                    <div className="md:col-span-2">
                      <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                        <input
                          type="number"
                          value={fraction1.numerator}
                          onChange={(e) => setFraction1({...fraction1, numerator: e.target.value})}
                          placeholder="Numerator"
                          className="w-full text-center text-lg font-mono border-b border-gray-300 pb-2 mb-2 bg-transparent"
                        />
                        <div className="border-t border-gray-400 my-2"></div>
                        <input
                          type="number"
                          value={fraction1.denominator}
                          onChange={(e) => setFraction1({...fraction1, denominator: e.target.value})}
                          placeholder="Denominator"
                          className="w-full text-center text-lg font-mono pt-2 bg-transparent"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  // Mixed Number Input
                  <>
                    <div className="md:col-span-2">
                      <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-2">
                        <input
                          type="number"
                          value={mixed1.whole}
                          onChange={(e) => setMixed1({...mixed1, whole: e.target.value})}
                          placeholder="Whole"
                          className="w-full text-center text-lg font-mono bg-transparent"
                        />
                        <div className="flex space-x-2">
                          <input
                            type="number"
                            value={mixed1.numerator}
                            onChange={(e) => setMixed1({...mixed1, numerator: e.target.value})}
                            placeholder="Num"
                            className="w-full text-center text-lg font-mono border-b border-gray-300 bg-transparent"
                          />
                          <span className="text-lg">/</span>
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
                  </>
                )}

                {/* Operation */}
                <div className="text-center">
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="text-2xl font-bold bg-blue-100 rounded-lg p-3 border-2 border-blue-300 w-16 h-16 text-center"
                  >
                    <option value="+">+</option>
                    <option value="-">−</option>
                    <option value="*">×</option>
                    <option value="/">÷</option>
                  </select>
                </div>

                {/* Second Fraction/Mixed Number */}
                {inputType === 'fraction' ? (
                  <div className="md:col-span-2">
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                      <input
                        type="number"
                        value={fraction2.numerator}
                        onChange={(e) => setFraction2({...fraction2, numerator: e.target.value})}
                        placeholder="Numerator"
                        className="w-full text-center text-lg font-mono border-b border-gray-300 pb-2 mb-2 bg-transparent"
                      />
                      <div className="border-t border-gray-400 my-2"></div>
                      <input
                        type="number"
                        value={fraction2.denominator}
                        onChange={(e) => setFraction2({...fraction2, denominator: e.target.value})}
                        placeholder="Denominator"
                        className="w-full text-center text-lg font-mono pt-2 bg-transparent"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="md:col-span-2">
                    <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-2">
                      <input
                        type="number"
                        value={mixed2.whole}
                        onChange={(e) => setMixed2({...mixed2, whole: e.target.value})}
                        placeholder="Whole"
                        className="w-full text-center text-lg font-mono bg-transparent"
                      />
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={mixed2.numerator}
                          onChange={(e) => setMixed2({...mixed2, numerator: e.target.value})}
                          placeholder="Num"
                          className="w-full text-center text-lg font-mono border-b border-gray-300 bg-transparent"
                        />
                        <span className="text-lg">/</span>
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
                )}

                {/* Equals Sign */}
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-600">=</span>
                </div>

                {/* Result */}
                <div className="md:col-span-2">
                  {error ? (
                    <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
                      <p className="text-red-600 text-sm">{error}</p>
                    </div>
                  ) : result && (
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 text-center">
                      <div className="text-lg font-mono text-green-800">
                        {formatFraction(result.simplified)}
                      </div>
                      {result.mixed && (
                        <div className="text-sm text-green-600 mt-1">
                          {formatMixed(result.mixed)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Single Fraction Analyzer */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analyze Single Fraction</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                {inputType === 'fraction' ? (
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                    <input
                      type="number"
                      value={singleFraction.numerator}
                      onChange={(e) => setSingleFraction({...singleFraction, numerator: e.target.value})}
                      placeholder="Numerator"
                      className="w-full text-center text-lg font-mono border-b border-gray-300 pb-2 mb-2 bg-transparent"
                    />
                    <div className="border-t border-gray-400 my-2"></div>
                    <input
                      type="number"
                      value={singleFraction.denominator}
                      onChange={(e) => setSingleFraction({...singleFraction, denominator: e.target.value})}
                      placeholder="Denominator"
                      className="w-full text-center text-lg font-mono pt-2 bg-transparent"
                    />
                  </div>
                ) : (
                  <div className="bg-white border-2 border-gray-300 rounded-lg p-4 space-y-2">
                    <input
                      type="number"
                      value={singleMixed.whole}
                      onChange={(e) => setSingleMixed({...singleMixed, whole: e.target.value})}
                      placeholder="Whole"
                      className="w-full text-center text-lg font-mono bg-transparent"
                    />
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={singleMixed.numerator}
                        onChange={(e) => setSingleMixed({...singleMixed, numerator: e.target.value})}
                        placeholder="Num"
                        className="w-full text-center text-lg font-mono border-b border-gray-300 bg-transparent"
                      />
                      <span className="text-lg">/</span>
                      <input
                        type="number"
                        value={singleMixed.denominator}
                        onChange={(e) => setSingleMixed({...singleMixed, denominator: e.target.value})}
                        placeholder="Den"
                        className="w-full text-center text-lg font-mono bg-transparent"
                      />
                    </div>
                  </div>
                )}

                <div className="text-center">
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
                </div>

                <div>
                  {singleResult?.error ? (
                    <div className="bg-red-50 border border-red-300 rounded-lg p-3 text-center">
                      <p className="text-red-600 text-sm">{singleResult.error}</p>
                    </div>
                  ) : singleResult && (
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3 text-center border">
                        <div className="text-sm text-gray-600">Simplified</div>
                        <div className="font-mono text-blue-600">{formatFraction(singleResult.simplified)}</div>
                      </div>
                      {singleResult.mixed && (
                        <div className="bg-white rounded-lg p-3 text-center border">
                          <div className="text-sm text-gray-600">Mixed Number</div>
                          <div className="font-mono text-green-600">{formatMixed(singleResult.mixed)}</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && !error && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Results</h2>
              
              {/* Multiple Representations */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-blue-600 mb-1">Simplified Fraction</div>
                  <div className="text-xl font-mono text-blue-800">{formatFraction(result.simplified)}</div>
                </div>
                
                {result.mixed && (
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-green-600 mb-1">Mixed Number</div>
                    <div className="text-xl font-mono text-green-800">{formatMixed(result.mixed)}</div>
                  </div>
                )}
                
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-purple-600 mb-1">Decimal</div>
                  <div className="text-xl font-mono text-purple-800">{result.decimal.toFixed(6)}</div>
                </div>
                
                <div className="bg-orange-50 rounded-lg p-4 text-center">
                  <div className="text-sm text-orange-600 mb-1">Percentage</div>
                  <div className="text-xl font-mono text-orange-800">{result.percentage.toFixed(2)}%</div>
                </div>
              </div>

              {/* Step-by-Step Solution */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
                <div className="space-y-3">
                  {result.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-1">
                        {index + 1}
                      </div>
                      <div className="text-gray-700 font-mono text-sm leading-relaxed">{step}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Single Fraction Analysis */}
          {singleResult && !singleResult.error && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Fraction Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Representations</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Original:</span>
                        <span className="font-mono">{formatFraction(singleResult.original)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Simplified:</span>
                        <span className="font-mono text-blue-600">{formatFraction(singleResult.simplified)}</span>
                      </div>
                      {singleResult.mixed && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Mixed Number:</span>
                          <span className="font-mono text-green-600">{formatMixed(singleResult.mixed)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Decimal:</span>
                        <span className="font-mono">{singleResult.decimal.toFixed(6)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Percentage:</span>
                        <span className="font-mono">{singleResult.percentage.toFixed(2)}%</span>
                      </div>
                      {singleResult.reciprocal && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Reciprocal:</span>
                          <span className="font-mono">{formatFraction(singleResult.reciprocal)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-3">Properties</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${singleResult.isProper ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Proper Fraction</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${singleResult.isImproper ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Improper Fraction</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${singleResult.isWhole ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                        <span className="text-sm">Whole Number</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Examples</h2>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-mono text-blue-600">1/2 + 1/3 = 5/6</div>
                <div className="text-gray-600 text-xs mt-1">Adding fractions</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-mono text-green-600">2 1/4 × 1/2 = 1 1/8</div>
                <div className="text-gray-600 text-xs mt-1">Mixed number multiplication</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="font-mono text-purple-600">3/4 ÷ 2/3 = 1 1/8</div>
                <div className="text-gray-600 text-xs mt-1">Fraction division</div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Fraction Rules</h3>
            <ul className="text-blue-800 text-sm space-y-2">
              <li>• To add/subtract: Find common denominator</li>
              <li>• To multiply: Multiply numerators and denominators</li>
              <li>• To divide: Multiply by reciprocal</li>
              <li>• Always simplify your answer</li>
              <li>• Mixed numbers = whole + fraction</li>
            </ul>
          </div>

          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Features</h3>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• Step-by-step solutions</li>
              <li>• Mixed number support</li>
              <li>• Automatic simplification</li>
              <li>• Multiple representations</li>
              <li>• Fraction analysis</li>
              <li>• Error checking</li>
            </ul>
          </div>

          {/* Calculator Info */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <Info className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div className="text-sm text-gray-600">
                <p className="mb-2">
                  This calculator supports:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Proper and improper fractions</li>
                  <li>Mixed numbers</li>
                  <li>All basic operations (+, −, ×, ÷)</li>
                  <li>Automatic simplification</li>
                  <li>Step-by-step solutions</li>
                  <li>Multiple result formats</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionCalculator;