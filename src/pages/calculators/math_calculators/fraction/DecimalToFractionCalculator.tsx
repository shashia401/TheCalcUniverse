import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowRight, RefreshCw } from 'lucide-react';

const DecimalToFractionCalculator: React.FC = () => {
  const [decimal, setDecimal] = useState('');
  const [result, setResult] = useState<any>(null);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const convertDecimalToFraction = () => {
    const decimalValue = parseFloat(decimal);
    
    if (!decimal || isNaN(decimalValue)) {
      setResult(null);
      return;
    }

    // Handle whole numbers
    if (decimalValue % 1 === 0) {
      setResult({
        decimal: decimalValue,
        fraction: { numerator: Math.floor(decimalValue), denominator: 1 },
        simplified: { numerator: Math.floor(decimalValue), denominator: 1 },
        mixedNumber: null,
        steps: [`${decimalValue} is a whole number`, `Fraction: ${Math.floor(decimalValue)}/1`],
        isExact: true
      });
      return;
    }

    // Determine if it's a repeating decimal
    const decimalStr = decimal.toString();
    const isRepeating = detectRepeatingDecimal(decimalStr);
    
    let fraction;
    let steps = [];
    
    if (isRepeating.isRepeating) {
      fraction = convertRepeatingDecimal(decimalStr, isRepeating);
      steps = generateRepeatingSteps(decimalStr, isRepeating, fraction);
    } else {
      fraction = convertTerminatingDecimal(decimalValue);
      steps = generateTerminatingSteps(decimalValue, fraction);
    }

    // Simplify the fraction
    const commonFactor = gcd(Math.abs(fraction.numerator), fraction.denominator);
    const simplified = {
      numerator: fraction.numerator / commonFactor,
      denominator: fraction.denominator / commonFactor
    };

    // Convert to mixed number if improper
    let mixedNumber = null;
    if (Math.abs(simplified.numerator) >= simplified.denominator && simplified.denominator !== 1) {
      const whole = Math.floor(Math.abs(simplified.numerator) / simplified.denominator);
      const remainder = Math.abs(simplified.numerator) % simplified.denominator;
      mixedNumber = {
        whole: simplified.numerator < 0 ? -whole : whole,
        numerator: remainder,
        denominator: simplified.denominator
      };
    }

    setResult({
      decimal: decimalValue,
      fraction: fraction,
      simplified: simplified,
      mixedNumber: mixedNumber,
      steps: steps,
      isExact: !isRepeating.isRepeating,
      isRepeating: isRepeating.isRepeating,
      commonFactor: commonFactor
    });
  };

  const detectRepeatingDecimal = (decimalStr: string) => {
    // Simple detection for common repeating patterns
    const afterDecimal = decimalStr.split('.')[1] || '';
    
    // Check for common repeating patterns
    const patterns = ['3333', '6666', '1666', '8333', '1111', '2222', '4444', '5555', '7777', '8888', '9999'];
    
    for (const pattern of patterns) {
      if (afterDecimal.includes(pattern)) {
        return { isRepeating: true, pattern: pattern[0], position: afterDecimal.indexOf(pattern) };
      }
    }
    
    return { isRepeating: false, pattern: null, position: -1 };
  };

  const convertRepeatingDecimal = (decimalStr: string, repeatingInfo: any) => {
    // Simplified conversion for common repeating decimals
    const decimalValue = parseFloat(decimalStr);
    
    // Use approximation method for repeating decimals
    const denominator = Math.pow(10, 6); // Use 6 decimal places for approximation
    const numerator = Math.round(decimalValue * denominator);
    
    return { numerator, denominator };
  };

  const convertTerminatingDecimal = (decimalValue: number) => {
    const decimalStr = decimalValue.toString();
    const afterDecimal = decimalStr.split('.')[1] || '';
    const decimalPlaces = afterDecimal.length;
    
    const denominator = Math.pow(10, decimalPlaces);
    const numerator = Math.round(decimalValue * denominator);
    
    return { numerator, denominator };
  };

  const generateTerminatingSteps = (decimalValue: number, fraction: any): string[] => {
    const steps = [];
    const decimalStr = decimalValue.toString();
    const afterDecimal = decimalStr.split('.')[1] || '';
    const decimalPlaces = afterDecimal.length;
    
    steps.push(`Original decimal: ${decimalValue}`);
    steps.push(`Count decimal places: ${decimalPlaces}`);
    steps.push(`Multiply by 10^${decimalPlaces} = ${Math.pow(10, decimalPlaces)}`);
    steps.push(`Numerator: ${decimalValue} × ${Math.pow(10, decimalPlaces)} = ${fraction.numerator}`);
    steps.push(`Denominator: ${Math.pow(10, decimalPlaces)}`);
    steps.push(`Fraction: ${fraction.numerator}/${fraction.denominator}`);
    
    return steps;
  };

  const generateRepeatingSteps = (decimalStr: string, repeatingInfo: any, fraction: any): string[] => {
    const steps = [];
    
    steps.push(`Original decimal: ${decimalStr}`);
    steps.push(`Detected repeating pattern: ${repeatingInfo.pattern}`);
    steps.push(`Using approximation method for repeating decimal`);
    steps.push(`Approximate fraction: ${fraction.numerator}/${fraction.denominator}`);
    
    return steps;
  };

  useEffect(() => {
    convertDecimalToFraction();
  }, [decimal]);

  const formatMixed = (mixed: any): string => {
    if (mixed.numerator === 0) return mixed.whole.toString();
    if (mixed.whole === 0) return `${mixed.numerator}/${mixed.denominator}`;
    return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
  };

  const examples = [
    { decimal: '0.5', fraction: '1/2', description: 'Simple half' },
    { decimal: '0.25', fraction: '1/4', description: 'Quarter' },
    { decimal: '0.75', fraction: '3/4', description: 'Three quarters' },
    { decimal: '0.125', fraction: '1/8', description: 'One eighth' },
    { decimal: '0.333', fraction: '≈ 1/3', description: 'Repeating third' },
    { decimal: '1.5', fraction: '3/2', description: 'Mixed number' },
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
        <span className="text-gray-900 font-medium">Decimal to Fraction Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <RefreshCw className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Decimal to Fraction Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Decimal Number</label>
              <input
                type="number"
                step="any"
                value={decimal}
                onChange={(e) => setDecimal(e.target.value)}
                placeholder="0.75"
                className="w-full text-center text-2xl font-mono bg-transparent border-b-2 border-gray-300 pb-2"
              />
            </div>

            <ArrowRight className="w-8 h-8 text-gray-400" />

            <div className="bg-white border-2 border-blue-300 rounded-lg p-6 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Fraction</label>
              {result ? (
                <div className="text-center">
                  <div className="text-2xl font-mono text-blue-600 mb-2">
                    {result.simplified.numerator}
                  </div>
                  <div className="border-t-2 border-blue-400 my-2"></div>
                  <div className="text-2xl font-mono text-blue-600 pt-2">
                    {result.simplified.denominator}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-2xl font-mono mb-2">?</div>
                  <div className="border-t-2 border-gray-300 my-2"></div>
                  <div className="text-2xl font-mono pt-2">?</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Conversion Result</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Original Decimal</div>
                  <div className="text-xl font-mono text-gray-800">{result.decimal}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Simplified Fraction</div>
                  <div className="text-xl font-mono text-blue-600">
                    {result.simplified.numerator}/{result.simplified.denominator}
                  </div>
                </div>
                
                {result.mixedNumber && (
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Mixed Number</div>
                    <div className="text-xl font-mono text-green-600">{formatMixed(result.mixedNumber)}</div>
                  </div>
                )}
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Accuracy</div>
                  <div className={`text-sm font-semibold ${result.isExact ? 'text-green-600' : 'text-orange-600'}`}>
                    {result.isExact ? 'Exact' : 'Approximate'}
                  </div>
                </div>
              </div>

              {result.isRepeating && (
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 text-center">
                  <div className="text-orange-800 font-semibold">⚠ Repeating decimal detected - result is approximate</div>
                </div>
              )}
            </div>

            {/* Step-by-Step Solution */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Conversion</h3>
              <div className="space-y-3">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
              <div className="text-center">
                <div className="text-lg font-mono text-gray-700 mb-2">
                  {result.simplified.numerator} ÷ {result.simplified.denominator} = {(result.simplified.numerator / result.simplified.denominator).toFixed(8)}
                </div>
                <div className="text-sm text-gray-600">
                  Original decimal: {result.decimal}
                </div>
                <div className="text-sm text-gray-600">
                  Difference: {Math.abs(result.decimal - (result.simplified.numerator / result.simplified.denominator)).toExponential(2)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Decimal to Fraction Conversions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800 mb-1">{example.description}</div>
                <div className="font-mono text-lg text-blue-600 mb-2">
                  {example.decimal} = {example.fraction}
                </div>
                <button
                  onClick={() => setDecimal(example.decimal)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Try This
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Decimal to Fraction Conversion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Terminating Decimals</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Have a finite number of digits</li>
                <li>• Can be converted exactly to fractions</li>
                <li>• Examples: 0.5, 0.25, 0.125</li>
                <li>• Use powers of 10 as denominators</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Repeating Decimals</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Have repeating digit patterns</li>
                <li>• Examples: 0.333..., 0.666...</li>
                <li>• Require special conversion methods</li>
                <li>• Results may be approximations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DecimalToFractionCalculator;