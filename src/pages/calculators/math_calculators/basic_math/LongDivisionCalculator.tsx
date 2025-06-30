import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Divide } from 'lucide-react';

const LongDivisionCalculator: React.FC = () => {
  const [dividend, setDividend] = useState('');
  const [divisor, setDivisor] = useState('');
  const [result, setResult] = useState<any>(null);

  const performLongDivision = () => {
    const dividendNum = parseInt(dividend);
    const divisorNum = parseInt(divisor);

    if (!dividend || !divisor || isNaN(dividendNum) || isNaN(divisorNum) || divisorNum === 0) {
      setResult(null);
      return;
    }

    if (divisorNum === 0) {
      setResult({ error: 'Cannot divide by zero' });
      return;
    }

    const quotient = Math.floor(Math.abs(dividendNum) / Math.abs(divisorNum));
    const remainder = Math.abs(dividendNum) % Math.abs(divisorNum);
    
    // Handle signs
    const isNegative = (dividendNum < 0) !== (divisorNum < 0);
    const finalQuotient = isNegative ? -quotient : quotient;
    const finalRemainder = dividendNum < 0 ? -remainder : remainder;

    // Generate step-by-step long division
    const steps = generateLongDivisionSteps(Math.abs(dividendNum), Math.abs(divisorNum));

    setResult({
      dividend: dividendNum,
      divisor: divisorNum,
      quotient: finalQuotient,
      remainder: finalRemainder,
      decimal: dividendNum / divisorNum,
      steps,
      verification: (finalQuotient * divisorNum) + finalRemainder,
      mixedNumber: quotient > 0 && remainder > 0 ? {
        whole: Math.abs(finalQuotient),
        numerator: Math.abs(finalRemainder),
        denominator: Math.abs(divisorNum),
        sign: isNegative ? '-' : ''
      } : null
    });
  };

  const generateLongDivisionSteps = (dividend: number, divisor: number): any[] => {
    const steps = [];
    const dividendStr = dividend.toString();
    let currentDividend = 0;
    let quotientStr = '';
    let position = 0;

    steps.push({
      type: 'setup',
      dividend: dividend,
      divisor: divisor,
      description: `Dividing ${dividend} by ${divisor}`
    });

    while (position < dividendStr.length) {
      // Bring down the next digit
      currentDividend = currentDividend * 10 + parseInt(dividendStr[position]);
      
      steps.push({
        type: 'bring-down',
        digit: dividendStr[position],
        currentDividend: currentDividend,
        position: position,
        description: `Bring down ${dividendStr[position]}, making ${currentDividend}`
      });

      // Calculate how many times divisor goes into current dividend
      const quotientDigit = Math.floor(currentDividend / divisor);
      const subtractValue = quotientDigit * divisor;
      const newRemainder = currentDividend - subtractValue;

      quotientStr += quotientDigit.toString();

      steps.push({
        type: 'divide',
        currentDividend: currentDividend,
        divisor: divisor,
        quotientDigit: quotientDigit,
        subtractValue: subtractValue,
        remainder: newRemainder,
        description: `${divisor} goes into ${currentDividend} ${quotientDigit} time${quotientDigit !== 1 ? 's' : ''}`
      });

      if (subtractValue > 0) {
        steps.push({
          type: 'subtract',
          minuend: currentDividend,
          subtrahend: subtractValue,
          difference: newRemainder,
          description: `${currentDividend} - ${subtractValue} = ${newRemainder}`
        });
      }

      currentDividend = newRemainder;
      position++;
    }

    steps.push({
      type: 'final',
      quotient: quotientStr,
      remainder: currentDividend,
      description: `Final answer: ${quotientStr} remainder ${currentDividend}`
    });

    return steps;
  };

  const examples = [
    { dividend: '156', divisor: '12', description: 'Basic division' },
    { dividend: '1234', divisor: '56', description: 'Larger numbers' },
    { dividend: '999', divisor: '37', description: 'With remainder' },
    { dividend: '5000', divisor: '125', description: 'Even division' },
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
        <span className="text-gray-900 font-medium">Long Division Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Divide className="w-8 h-8 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Long Division Calculator</h1>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dividend (number being divided)
            </label>
            <input
              type="number"
              value={dividend}
              onChange={(e) => setDividend(e.target.value)}
              placeholder="Enter dividend (e.g., 156)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Divisor (number dividing by)
            </label>
            <input
              type="number"
              value={divisor}
              onChange={(e) => setDivisor(e.target.value)}
              placeholder="Enter divisor (e.g., 12)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Division Expression */}
        {dividend && divisor && (
          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
            <div className="text-2xl font-mono text-blue-800">
              {dividend} ÷ {divisor}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={performLongDivision}
          className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold mb-8"
        >
          Perform Long Division
        </button>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Division Result</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Quotient</div>
                  <div className="text-2xl font-bold text-red-600">{result.quotient}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Remainder</div>
                  <div className="text-2xl font-bold text-orange-600">{result.remainder}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Decimal</div>
                  <div className="text-lg font-mono text-blue-600">{result.decimal.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Verification</div>
                  <div className="text-lg font-mono text-green-600">{result.verification}</div>
                </div>
              </div>

              {result.mixedNumber && (
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mixed Number</div>
                  <div className="text-xl font-mono text-purple-600">
                    {result.mixedNumber.sign}{result.mixedNumber.whole} {result.mixedNumber.numerator}/{result.mixedNumber.denominator}
                  </div>
                </div>
              )}
            </div>

            {/* Step-by-Step Long Division */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Long Division</h3>
              <div className="space-y-4">
                {result.steps.map((step: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-700 mb-2">{step.description}</div>
                        
                        {step.type === 'setup' && (
                          <div className="font-mono text-lg bg-gray-50 p-3 rounded">
                            <div className="text-center">
                              <div className="border-b-2 border-gray-400 inline-block px-4">
                                {step.divisor}
                              </div>
                              <span className="ml-2">)</span>
                              <span className="ml-2">{step.dividend}</span>
                            </div>
                          </div>
                        )}
                        
                        {step.type === 'divide' && (
                          <div className="font-mono text-sm bg-blue-50 p-2 rounded">
                            {step.divisor} × {step.quotientDigit} = {step.subtractValue}
                          </div>
                        )}
                        
                        {step.type === 'subtract' && (
                          <div className="font-mono text-sm bg-green-50 p-2 rounded">
                            {step.minuend} - {step.subtrahend} = {step.difference}
                          </div>
                        )}
                        
                        {step.type === 'final' && (
                          <div className="font-mono text-lg bg-yellow-50 p-3 rounded font-semibold">
                            Answer: {step.quotient} R {step.remainder}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
              <div className="text-center">
                <div className="text-lg font-mono text-gray-700 mb-2">
                  ({result.quotient} × {result.divisor}) + {result.remainder} = {result.verification}
                </div>
                <div className="text-lg font-semibold text-green-600">
                  {result.verification === result.dividend ? '✓ Correct!' : '✗ Error in calculation'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800 mb-1">{example.description}</div>
                <div className="font-mono text-lg text-red-600 mb-2">
                  {example.dividend} ÷ {example.divisor}
                </div>
                <button
                  onClick={() => {
                    setDividend(example.dividend);
                    setDivisor(example.divisor);
                  }}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Try This
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Long Division</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Process</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Divide: How many times does divisor go into dividend?</li>
                <li>• Multiply: Multiply quotient digit by divisor</li>
                <li>• Subtract: Subtract result from dividend</li>
                <li>• Bring down: Bring down next digit and repeat</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Understanding division algorithm</li>
                <li>• Finding exact quotients and remainders</li>
                <li>• Converting to mixed numbers</li>
                <li>• Foundation for polynomial division</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LongDivisionCalculator;