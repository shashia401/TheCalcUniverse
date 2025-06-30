import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Infinity, Calculator } from 'lucide-react';

const BigNumberFractionCalculator: React.FC = () => {
  const [inputType, setInputType] = useState<'fraction' | 'mixed'>('fraction');
  const [fraction1, setFraction1] = useState({ numerator: '', denominator: '' });
  const [fraction2, setFraction2] = useState({ numerator: '', denominator: '' });
  const [operation, setOperation] = useState('+');
  const [result, setResult] = useState<any>(null);

  // BigInt GCD function
  const gcdBig = (a: bigint, b: bigint): bigint => {
    return b === 0n ? (a < 0n ? -a : a) : gcdBig(b, a % b);
  };

  // BigInt LCM function
  const lcmBig = (a: bigint, b: bigint): bigint => {
    return (a * b) / gcdBig(a, b);
  };

  const simplifyBigFraction = (num: bigint, den: bigint): { numerator: bigint; denominator: bigint } => {
    if (den === 0n) throw new Error("Cannot divide by zero");
    
    const divisor = gcdBig(num, den);
    const sign = den < 0n ? -1n : 1n;
    
    return {
      numerator: (sign * num) / divisor,
      denominator: (den < 0n ? -den : den) / divisor
    };
  };

  const addBigFractions = (f1: any, f2: any) => {
    const commonDenom = lcmBig(f1.denominator, f2.denominator);
    return {
      numerator: (f1.numerator * (commonDenom / f1.denominator)) + 
                (f2.numerator * (commonDenom / f2.denominator)),
      denominator: commonDenom
    };
  };

  const subtractBigFractions = (f1: any, f2: any) => {
    const commonDenom = lcmBig(f1.denominator, f2.denominator);
    return {
      numerator: (f1.numerator * (commonDenom / f1.denominator)) - 
                (f2.numerator * (commonDenom / f2.denominator)),
      denominator: commonDenom
    };
  };

  const multiplyBigFractions = (f1: any, f2: any) => ({
    numerator: f1.numerator * f2.numerator,
    denominator: f1.denominator * f2.denominator
  });

  const divideBigFractions = (f1: any, f2: any) => {
    if (f2.numerator === 0n) throw new Error("Cannot divide by zero");
    return {
      numerator: f1.numerator * f2.denominator,
      denominator: f1.denominator * f2.numerator
    };
  };

  const calculateBigFraction = () => {
    try {
      // Parse inputs as BigInt
      const f1 = {
        numerator: BigInt(fraction1.numerator || '0'),
        denominator: BigInt(fraction1.denominator || '1')
      };
      const f2 = {
        numerator: BigInt(fraction2.numerator || '0'),
        denominator: BigInt(fraction2.denominator || '1')
      };

      if (f1.denominator === 0n || f2.denominator === 0n) {
        throw new Error("Cannot divide by zero");
      }

      let resultFraction: any;

      switch (operation) {
        case '+':
          resultFraction = addBigFractions(f1, f2);
          break;
        case '-':
          resultFraction = subtractBigFractions(f1, f2);
          break;
        case '*':
          resultFraction = multiplyBigFractions(f1, f2);
          break;
        case '/':
          resultFraction = divideBigFractions(f1, f2);
          break;
        default:
          throw new Error("Invalid operation");
      }

      const simplified = simplifyBigFraction(resultFraction.numerator, resultFraction.denominator);
      
      // Convert to mixed number if improper
      let mixedNumber = null;
      if (simplified.denominator !== 1n && simplified.numerator >= simplified.denominator) {
        const whole = simplified.numerator / simplified.denominator;
        const remainder = simplified.numerator % simplified.denominator;
        mixedNumber = {
          whole: whole.toString(),
          numerator: remainder.toString(),
          denominator: simplified.denominator.toString()
        };
      }

      // Calculate decimal approximation (limited precision)
      let decimal = 0;
      try {
        decimal = Number(simplified.numerator) / Number(simplified.denominator);
      } catch {
        decimal = NaN; // For very large numbers
      }

      setResult({
        original: {
          numerator: resultFraction.numerator.toString(),
          denominator: resultFraction.denominator.toString()
        },
        simplified: {
          numerator: simplified.numerator.toString(),
          denominator: simplified.denominator.toString()
        },
        mixedNumber: mixedNumber,
        decimal: isNaN(decimal) ? 'Too large to display' : decimal,
        steps: generateBigSteps(f1, f2, operation, simplified),
        digitCount: {
          numerator: simplified.numerator.toString().replace('-', '').length,
          denominator: simplified.denominator.toString().length
        }
      });
    } catch (err: any) {
      setResult({ error: err.message });
    }
  };

  const generateBigSteps = (f1: any, f2: any, op: string, result: any): string[] => {
    const steps: string[] = [];
    
    steps.push(`Step 1: Set up the problem with big numbers`);
    steps.push(`${f1.numerator.toString()}/${f1.denominator.toString()} ${op} ${f2.numerator.toString()}/${f2.denominator.toString()}`);

    if (op === '+' || op === '-') {
      const commonDenom = lcmBig(f1.denominator, f2.denominator);
      steps.push(`Step 2: Find LCM of denominators`);
      steps.push(`LCM(${f1.denominator.toString()}, ${f2.denominator.toString()}) = ${commonDenom.toString()}`);
      steps.push(`Step 3: ${op === '+' ? 'Add' : 'Subtract'} the numerators`);
    } else if (op === '*') {
      steps.push(`Step 2: Multiply numerators and denominators`);
      steps.push(`(${f1.numerator.toString()} × ${f2.numerator.toString()}) / (${f1.denominator.toString()} × ${f2.denominator.toString()})`);
    } else if (op === '/') {
      steps.push(`Step 2: Multiply by the reciprocal`);
      steps.push(`${f1.numerator.toString()}/${f1.denominator.toString()} × ${f2.denominator.toString()}/${f2.numerator.toString()}`);
    }

    steps.push(`Step 4: Simplify using GCD`);
    steps.push(`Result: ${result.numerator.toString()}/${result.denominator.toString()}`);
    
    return steps;
  };

  useEffect(() => {
    calculateBigFraction();
  }, [fraction1, fraction2, operation]);

  const formatMixed = (mixed: any): string => {
    if (mixed.numerator === '0') return mixed.whole;
    if (mixed.whole === '0') return `${mixed.numerator}/${mixed.denominator}`;
    return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
  };

  const examples = [
    {
      description: 'Large Fibonacci fractions',
      f1: { num: '1134903170', den: '701408733' },
      f2: { num: '1836311903', den: '1134903170' },
      op: '+'
    },
    {
      description: 'Factorial fractions',
      f1: { num: '479001600', den: '362880' },
      f2: { num: '3628800', den: '40320' },
      op: '*'
    },
    {
      description: 'Very large numbers',
      f1: { num: '123456789012345', den: '987654321098765' },
      f2: { num: '111111111111111', den: '222222222222222' },
      op: '/'
    }
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
        <span className="text-gray-900 font-medium">Big Number Fraction Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Infinity className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Big Number Fraction Calculator</h1>
        </div>

        {/* Calculator Interface */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* First Fraction */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">First Fraction</label>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                <textarea
                  value={fraction1.numerator}
                  onChange={(e) => setFraction1({...fraction1, numerator: e.target.value})}
                  placeholder="Large numerator"
                  rows={2}
                  className="w-full text-center text-lg font-mono border-b border-gray-300 pb-2 mb-2 bg-transparent resize-none"
                />
                <div className="border-t border-gray-400 my-2"></div>
                <textarea
                  value={fraction1.denominator}
                  onChange={(e) => setFraction1({...fraction1, denominator: e.target.value})}
                  placeholder="Large denominator"
                  rows={2}
                  className="w-full text-center text-lg font-mono pt-2 bg-transparent resize-none"
                />
              </div>
            </div>

            {/* Operation */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">Operation</label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="text-2xl font-bold bg-purple-100 rounded-lg p-3 border-2 border-purple-300 w-16 h-16 text-center"
              >
                <option value="+">+</option>
                <option value="-">−</option>
                <option value="*">×</option>
                <option value="/">÷</option>
              </select>
            </div>

            {/* Second Fraction */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Fraction</label>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                <textarea
                  value={fraction2.numerator}
                  onChange={(e) => setFraction2({...fraction2, numerator: e.target.value})}
                  placeholder="Large numerator"
                  rows={2}
                  className="w-full text-center text-lg font-mono border-b border-gray-300 pb-2 mb-2 bg-transparent resize-none"
                />
                <div className="border-t border-gray-400 my-2"></div>
                <textarea
                  value={fraction2.denominator}
                  onChange={(e) => setFraction2({...fraction2, denominator: e.target.value})}
                  placeholder="Large denominator"
                  rows={2}
                  className="w-full text-center text-lg font-mono pt-2 bg-transparent resize-none"
                />
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
                <div className="bg-purple-50 border-2 border-purple-300 rounded-lg p-4 text-center">
                  <div className="text-sm font-mono text-purple-800 break-all">
                    {result.simplified.numerator}
                  </div>
                  <div className="border-t border-purple-400 my-2"></div>
                  <div className="text-sm font-mono text-purple-800 break-all">
                    {result.simplified.denominator}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Big Number Result</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Numerator Digits</div>
                  <div className="text-xl font-bold text-purple-600">{result.digitCount.numerator}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Denominator Digits</div>
                  <div className="text-xl font-bold text-blue-600">{result.digitCount.denominator}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Decimal (approx)</div>
                  <div className="text-lg font-mono text-green-600">
                    {typeof result.decimal === 'number' ? result.decimal.toFixed(6) : result.decimal}
                  </div>
                </div>
                
                {result.mixedNumber && (
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Mixed Number</div>
                    <div className="text-lg font-mono text-orange-600">{formatMixed(result.mixedNumber)}</div>
                  </div>
                )}
              </div>

              {/* Full Result Display */}
              <div className="bg-white rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-3">Complete Fraction</h4>
                <div className="bg-gray-50 rounded p-4">
                  <div className="text-center">
                    <div className="font-mono text-sm text-purple-600 break-all mb-2">
                      {result.simplified.numerator}
                    </div>
                    <div className="border-t-2 border-purple-400 my-2"></div>
                    <div className="font-mono text-sm text-purple-600 break-all">
                      {result.simplified.denominator}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step-by-Step Solution */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-3">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm break-all">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Big Number Examples</h3>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800 mb-2">{example.description}</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono text-gray-600 mb-3">
                  <div>Num1: {example.f1.num}</div>
                  <div>Den1: {example.f1.den}</div>
                  <div>Op: {example.op}</div>
                  <div>Num2: {example.f2.num}</div>
                  <div>Den2: {example.f2.den}</div>
                </div>
                <button
                  onClick={() => {
                    setFraction1({ numerator: example.f1.num, denominator: example.f1.den });
                    setFraction2({ numerator: example.f2.num, denominator: example.f2.den });
                    setOperation(example.op);
                  }}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                >
                  Try This Example
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Big Number Fractions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Capabilities</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Handles arbitrarily large integers</li>
                <li>• Exact arithmetic (no rounding errors)</li>
                <li>• Automatic simplification using GCD</li>
                <li>• Support for all basic operations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Use Cases</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Mathematical research</li>
                <li>• Cryptography calculations</li>
                <li>• High-precision scientific computing</li>
                <li>• Number theory problems</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigNumberFractionCalculator;