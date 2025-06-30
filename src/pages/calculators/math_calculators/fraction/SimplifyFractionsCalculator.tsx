import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Minimize2, ArrowRight } from 'lucide-react';

const SimplifyFractionsCalculator: React.FC = () => {
  const [numerator, setNumerator] = useState('');
  const [denominator, setDenominator] = useState('');
  const [result, setResult] = useState<any>(null);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? Math.abs(a) : gcd(b, a % b);
  };

  const simplifyFraction = () => {
    const num = parseInt(numerator);
    const den = parseInt(denominator);

    if (!numerator || !denominator || isNaN(num) || isNaN(den) || den === 0) {
      setResult(null);
      return;
    }

    const commonFactor = gcd(num, den);
    const simplifiedNum = num / commonFactor;
    const simplifiedDen = den / commonFactor;

    // Handle negative signs
    const finalNum = simplifiedDen < 0 ? -simplifiedNum : simplifiedNum;
    const finalDen = Math.abs(simplifiedDen);

    // Check if it's already simplified
    const isAlreadySimplified = commonFactor === 1;

    // Convert to mixed number if improper
    const isImproper = Math.abs(finalNum) >= finalDen;
    let mixedNumber = null;
    if (isImproper && finalDen !== 1) {
      const whole = Math.floor(Math.abs(finalNum) / finalDen);
      const remainder = Math.abs(finalNum) % finalDen;
      mixedNumber = {
        whole: finalNum < 0 ? -whole : whole,
        numerator: remainder,
        denominator: finalDen
      };
    }

    // Generate all factors
    const factors = findFactors(Math.abs(num), Math.abs(den));

    setResult({
      original: { numerator: num, denominator: den },
      simplified: { numerator: finalNum, denominator: finalDen },
      commonFactor: commonFactor,
      isAlreadySimplified: isAlreadySimplified,
      decimal: finalNum / finalDen,
      percentage: (finalNum / finalDen) * 100,
      mixedNumber: mixedNumber,
      factors: factors,
      steps: generateSteps(num, den, commonFactor, finalNum, finalDen)
    });
  };

  const findFactors = (num: number, den: number) => {
    const numFactors = [];
    const denFactors = [];
    
    for (let i = 1; i <= Math.abs(num); i++) {
      if (num % i === 0) numFactors.push(i);
    }
    
    for (let i = 1; i <= Math.abs(den); i++) {
      if (den % i === 0) denFactors.push(i);
    }
    
    const commonFactors = numFactors.filter(f => denFactors.includes(f));
    
    return {
      numeratorFactors: numFactors,
      denominatorFactors: denFactors,
      commonFactors: commonFactors
    };
  };

  const generateSteps = (num: number, den: number, gcdValue: number, finalNum: number, finalDen: number): string[] => {
    const steps = [];
    
    steps.push(`Original fraction: ${num}/${den}`);
    
    if (gcdValue === 1) {
      steps.push(`The fraction is already in its simplest form`);
      steps.push(`GCD(${Math.abs(num)}, ${Math.abs(den)}) = 1`);
    } else {
      steps.push(`Find GCD of ${Math.abs(num)} and ${Math.abs(den)}`);
      steps.push(`GCD(${Math.abs(num)}, ${Math.abs(den)}) = ${gcdValue}`);
      steps.push(`Divide both numerator and denominator by ${gcdValue}`);
      steps.push(`${num} ÷ ${gcdValue} = ${finalNum}`);
      steps.push(`${den} ÷ ${gcdValue} = ${finalDen}`);
      steps.push(`Simplified fraction: ${finalNum}/${finalDen}`);
    }
    
    return steps;
  };

  useEffect(() => {
    simplifyFraction();
  }, [numerator, denominator]);

  const formatMixed = (mixed: any): string => {
    if (mixed.numerator === 0) return mixed.whole.toString();
    if (mixed.whole === 0) return `${mixed.numerator}/${mixed.denominator}`;
    return `${mixed.whole} ${mixed.numerator}/${mixed.denominator}`;
  };

  const examples = [
    { num: '12', den: '16', simplified: '3/4', description: 'Common fraction' },
    { num: '15', den: '25', simplified: '3/5', description: 'Reduce by 5' },
    { num: '24', den: '36', simplified: '2/3', description: 'Reduce by 12' },
    { num: '100', den: '150', simplified: '2/3', description: 'Large numbers' },
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
        <span className="text-gray-900 font-medium">Simplify Fractions Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Minimize2 className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Simplify Fractions Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-center space-x-6">
            <div className="bg-white border-2 border-gray-300 rounded-lg p-6 min-w-[120px]">
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

            <ArrowRight className="w-8 h-8 text-gray-400" />

            <div className="bg-white border-2 border-purple-300 rounded-lg p-6 min-w-[120px]">
              {result ? (
                <div className="text-center">
                  <div className="text-2xl font-mono text-purple-600 mb-2">
                    {result.simplified.numerator}
                  </div>
                  <div className="border-t-2 border-purple-400 my-2"></div>
                  <div className="text-2xl font-mono text-purple-600 pt-2">
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
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Simplification Result</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Simplified Fraction</div>
                  <div className="text-xl font-mono text-purple-600">
                    {result.simplified.numerator}/{result.simplified.denominator}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Decimal</div>
                  <div className="text-xl font-mono text-blue-600">{result.decimal.toFixed(6)}</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Percentage</div>
                  <div className="text-xl font-mono text-green-600">{result.percentage.toFixed(2)}%</div>
                </div>
                
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Common Factor</div>
                  <div className="text-xl font-mono text-orange-600">{result.commonFactor}</div>
                </div>
              </div>

              {result.mixedNumber && (
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Mixed Number</div>
                  <div className="text-xl font-mono text-indigo-600">{formatMixed(result.mixedNumber)}</div>
                </div>
              )}

              {result.isAlreadySimplified && (
                <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
                  <div className="text-green-800 font-semibold">✓ This fraction is already in its simplest form!</div>
                </div>
              )}
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
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Factor Analysis */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Factor Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Numerator Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.factors.numeratorFactors.map((factor: number, index: number) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Denominator Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.factors.denominatorFactors.map((factor: number, index: number) => (
                      <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Common Factors</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.factors.commonFactors.map((factor: number, index: number) => (
                      <span key={index} className={`px-2 py-1 rounded text-sm ${
                        factor === result.commonFactor 
                          ? 'bg-purple-100 text-purple-800 font-bold' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Try These Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800 mb-1">{example.description}</div>
                <div className="font-mono text-lg text-purple-600 mb-2">
                  {example.num}/{example.den} = {example.simplified}
                </div>
                <button
                  onClick={() => {
                    setNumerator(example.num);
                    setDenominator(example.den);
                  }}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                >
                  Try This
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Simplifying Fractions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">What is Simplifying?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Reducing a fraction to its lowest terms</li>
                <li>• Dividing numerator and denominator by their GCD</li>
                <li>• The value remains the same</li>
                <li>• Makes fractions easier to work with</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">When is a Fraction Simplified?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• When GCD of numerator and denominator is 1</li>
                <li>• No common factors except 1</li>
                <li>• Cannot be reduced further</li>
                <li>• Also called "lowest terms"</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimplifyFractionsCalculator;