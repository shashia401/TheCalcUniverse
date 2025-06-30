import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowRight, Calculator } from 'lucide-react';

const FractionToDecimalCalculator: React.FC = () => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [result, setResult] = useState<any>(null);

  const convertFractionToDecimal = () => {
    const num = parseInt(numerator);
    const den = parseInt(denominator);

    if (!numerator || !denominator || isNaN(num) || isNaN(den) || den === 0) {
      setResult(null);
      return;
    }

    const decimal = num / den;
    const isNegative = (num < 0) !== (den < 0);
    
    // Detect if it's a repeating decimal
    const repeatingInfo = detectRepeatingDecimal(num, den);
    
    // Generate long division steps
    const longDivisionSteps = generateLongDivision(Math.abs(num), Math.abs(den));
    
    setResult({
      numerator: num,
      denominator: den,
      decimal: decimal,
      isNegative: isNegative,
      isRepeating: repeatingInfo.isRepeating,
      repeatingPattern: repeatingInfo.pattern,
      repeatingStart: repeatingInfo.start,
      formattedDecimal: formatDecimal(decimal, repeatingInfo),
      percentage: decimal * 100,
      longDivision: longDivisionSteps,
      steps: generateSteps(num, den, decimal, repeatingInfo)
    });
  };

  const detectRepeatingDecimal = (num: number, den: number) => {
    const absNum = Math.abs(num);
    const absDen = Math.abs(den);
    
    // Perform long division to detect repeating pattern
    const remainders = new Map();
    let remainder = absNum % absDen;
    let position = 0;
    let decimalDigits = '';
    
    while (remainder !== 0 && !remainders.has(remainder) && position < 50) {
      remainders.set(remainder, position);
      remainder *= 10;
      const digit = Math.floor(remainder / absDen);
      decimalDigits += digit;
      remainder = remainder % absDen;
      position++;
    }
    
    if (remainder !== 0 && remainders.has(remainder)) {
      const repeatStart = remainders.get(remainder);
      const repeatingPart = decimalDigits.substring(repeatStart);
      return {
        isRepeating: true,
        pattern: repeatingPart,
        start: repeatStart,
        nonRepeating: decimalDigits.substring(0, repeatStart)
      };
    }
    
    return {
      isRepeating: false,
      pattern: '',
      start: -1,
      nonRepeating: decimalDigits
    };
  };

  const formatDecimal = (decimal: number, repeatingInfo: any) => {
    if (!repeatingInfo.isRepeating) {
      return decimal.toFixed(10).replace(/\.?0+$/, '');
    }
    
    const wholePart = Math.floor(Math.abs(decimal));
    const sign = decimal < 0 ? '-' : '';
    
    if (repeatingInfo.nonRepeating) {
      return `${sign}${wholePart}.${repeatingInfo.nonRepeating}(${repeatingInfo.pattern})`;
    } else {
      return `${sign}${wholePart}.(${repeatingInfo.pattern})`;
    }
  };

  const generateLongDivision = (num: number, den: number) => {
    const steps = [];
    let remainder = num;
    let quotient = '';
    let step = 1;
    
    // Integer part
    const integerPart = Math.floor(remainder / den);
    quotient = integerPart.toString();
    remainder = remainder % den;
    
    steps.push({
      step: step++,
      description: `${den} goes into ${num} ${integerPart} times`,
      calculation: `${integerPart} × ${den} = ${integerPart * den}`,
      remainder: remainder
    });
    
    if (remainder === 0) {
      return steps;
    }
    
    // Decimal part
    quotient += '.';
    let decimalPosition = 0;
    const maxSteps = 10;
    
    while (remainder !== 0 && decimalPosition < maxSteps) {
      remainder *= 10;
      const digit = Math.floor(remainder / den);
      quotient += digit;
      
      steps.push({
        step: step++,
        description: `Bring down 0, divide ${remainder} by ${den}`,
        calculation: `${remainder} ÷ ${den} = ${digit} remainder ${remainder % den}`,
        remainder: remainder % den
      });
      
      remainder = remainder % den;
      decimalPosition++;
    }
    
    return steps;
  };

  const generateSteps = (num: number, den: number, decimal: number, repeatingInfo: any): string[] => {
    const steps = [];
    
    steps.push(`Original fraction: ${num}/${den}`);
    steps.push(`Divide numerator by denominator: ${num} ÷ ${den}`);
    
    if (repeatingInfo.isRepeating) {
      steps.push(`Performing long division reveals a repeating pattern`);
      steps.push(`Repeating decimal: ${formatDecimal(decimal, repeatingInfo)}`);
      steps.push(`Pattern "${repeatingInfo.pattern}" repeats indefinitely`);
    } else {
      steps.push(`Result: ${decimal}`);
      steps.push(`This is a terminating decimal`);
    }
    
    return steps;
  };

  useEffect(() => {
    convertFractionToDecimal();
  }, [numerator, denominator]);

  const examples = [
    { num: '1', den: '2', decimal: '0.5', description: 'Simple half' },
    { num: '1', den: '4', decimal: '0.25', description: 'Quarter' },
    { num: '1', den: '3', decimal: '0.333...', description: 'Repeating third' },
    { num: '2', den: '3', decimal: '0.666...', description: 'Two thirds' },
    { num: '1', den: '8', decimal: '0.125', description: 'One eighth' },
    { num: '5', den: '6', decimal: '0.8333...', description: 'Five sixths' },
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
        <span className="text-gray-900 font-medium">Fraction to Decimal Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Calculator className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Fraction to Decimal Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Fraction</label>
              <div className="text-center">
                <input
                  type="number"
                  value={numerator}
                  onChange={(e) => setNumerator(e.target.value)}
                  placeholder="Numerator"
                  className="w-full text-center text-2xl font-mono border-b-2 border-gray-300 pb-2 mb-2 bg-transparent"
                />
                <div className="border-t-2 border-gray-400 my-2"></div>
                <input
                  type="number"
                  value={denominator}
                  onChange={(e) => setDenominator(e.target.value)}
                  placeholder="Denominator"
                  className="w-full text-center text-2xl font-mono pt-2 bg-transparent"
                />
              </div>
            </div>

            <ArrowRight className="w-8 h-8 text-gray-400" />

            <div className="bg-white border-2 border-green-300 rounded-lg p-6 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-2 text-center">Decimal</label>
              <div className="text-center">
                {result ? (
                  <div className="text-2xl font-mono text-green-600">
                    {result.formattedDecimal}
                  </div>
                ) : (
                  <div className="text-2xl font-mono text-gray-400">?</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Conversion Result</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Original Fraction</div>
                  <div className="text-xl font-mono text-gray-800">
                    {result.numerator}/{result.denominator}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Decimal</div>
                  <div className="text-xl font-mono text-green-600">{result.formattedDecimal}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Percentage</div>
                  <div className="text-xl font-mono text-blue-600">{result.percentage.toFixed(4)}%</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Type</div>
                  <div className={`text-sm font-semibold ${result.isRepeating ? 'text-orange-600' : 'text-green-600'}`}>
                    {result.isRepeating ? 'Repeating' : 'Terminating'}
                  </div>
                </div>
              </div>

              {result.isRepeating && (
                <div className="bg-orange-100 border border-orange-300 rounded-lg p-4">
                  <div className="text-center">
                    <div className="text-orange-800 font-semibold mb-2">Repeating Decimal Detected</div>
                    <div className="text-sm text-orange-700">
                      Pattern: "{result.repeatingPattern}" repeats indefinitely
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Solution */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Conversion</h3>
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

            {/* Long Division */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Long Division Process</h3>
              <div className="space-y-3">
                {result.longDivision.slice(0, 8).map((step: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {step.step}
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-700 text-sm mb-1">{step.description}</div>
                        <div className="font-mono text-sm text-blue-600">{step.calculation}</div>
                        <div className="text-xs text-gray-500">Remainder: {step.remainder}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {result.longDivision.length > 8 && (
                  <div className="text-center text-gray-500 text-sm">
                    ... and {result.longDivision.length - 8} more steps
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Fraction to Decimal Conversions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800 mb-1">{example.description}</div>
                <div className="font-mono text-lg text-green-600 mb-2">
                  {example.num}/{example.den} = {example.decimal}
                </div>
                <button
                  onClick={() => {
                    setNumerator(example.num);
                    setDenominator(example.den);
                  }}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Try This
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Fraction to Decimal Conversion</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Terminating Decimals</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Result when denominator has only factors of 2 and 5</li>
                <li>• Examples: 1/2 = 0.5, 1/4 = 0.25</li>
                <li>• Have a finite number of decimal places</li>
                <li>• Division process ends with remainder 0</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Repeating Decimals</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Result when denominator has factors other than 2 and 5</li>
                <li>• Examples: 1/3 = 0.333..., 1/7 = 0.142857...</li>
                <li>• Pattern repeats indefinitely</li>
                <li>• Shown with parentheses: 0.(3) or 0.(142857)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FractionToDecimalCalculator;