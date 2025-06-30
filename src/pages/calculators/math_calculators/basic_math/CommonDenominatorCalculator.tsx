import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Divide, Plus, Trash2 } from 'lucide-react';

interface Fraction {
  numerator: string;
  denominator: string;
}

const CommonDenominatorCalculator: React.FC = () => {
  const [fractions, setFractions] = useState<Fraction[]>([
    { numerator: '1', denominator: '2' },
    { numerator: '1', denominator: '3' }
  ]);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateCommonDenominator();
  }, [fractions]);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const lcm = (a: number, b: number): number => {
    return Math.abs(a * b) / gcd(a, b);
  };

  const lcmMultiple = (numbers: number[]): number => {
    return numbers.reduce((acc, num) => lcm(acc, num));
  };

  const simplifyFraction = (num: number, den: number): { numerator: number; denominator: number } => {
    const divisor = gcd(Math.abs(num), Math.abs(den));
    return {
      numerator: num / divisor,
      denominator: den / divisor
    };
  };

  const calculateCommonDenominator = () => {
    const validFractions = fractions.filter(f => 
      f.numerator && f.denominator && 
      !isNaN(parseInt(f.numerator)) && !isNaN(parseInt(f.denominator)) &&
      parseInt(f.denominator) !== 0
    );

    if (validFractions.length < 2) {
      setResult(null);
      return;
    }

    const denominators = validFractions.map(f => parseInt(f.denominator));
    const numerators = validFractions.map(f => parseInt(f.numerator));
    
    // Find LCM of all denominators
    const commonDenominator = lcmMultiple(denominators);
    
    // Convert each fraction to have the common denominator
    const convertedFractions = validFractions.map((fraction, index) => {
      const originalNum = numerators[index];
      const originalDen = denominators[index];
      const multiplier = commonDenominator / originalDen;
      const newNumerator = originalNum * multiplier;
      
      return {
        original: { numerator: originalNum, denominator: originalDen },
        converted: { numerator: newNumerator, denominator: commonDenominator },
        multiplier: multiplier
      };
    });

    // Calculate sum with common denominator
    const sumNumerator = convertedFractions.reduce((sum, frac) => sum + frac.converted.numerator, 0);
    const sumFraction = simplifyFraction(sumNumerator, commonDenominator);

    // Find steps for LCM calculation
    const steps = generateLCMSteps(denominators, commonDenominator);

    setResult({
      originalFractions: validFractions,
      commonDenominator,
      convertedFractions,
      sum: {
        numerator: sumNumerator,
        denominator: commonDenominator,
        simplified: sumFraction
      },
      steps,
      primeFactorizations: denominators.map(d => ({
        number: d,
        factors: getPrimeFactorization(d)
      }))
    });
  };

  const generateLCMSteps = (denominators: number[], lcm: number): string[] => {
    const steps = [];
    steps.push(`Finding LCM of denominators: ${denominators.join(', ')}`);
    
    if (denominators.length === 2) {
      const [a, b] = denominators;
      const gcdValue = gcd(a, b);
      steps.push(`GCD(${a}, ${b}) = ${gcdValue}`);
      steps.push(`LCM(${a}, ${b}) = (${a} × ${b}) ÷ ${gcdValue} = ${lcm}`);
    } else {
      steps.push(`Using prime factorization method:`);
      denominators.forEach(d => {
        const factors = getPrimeFactorization(d);
        steps.push(`${d} = ${formatPrimeFactorization(factors)}`);
      });
      steps.push(`LCM = ${lcm}`);
    }
    
    return steps;
  };

  const getPrimeFactorization = (n: number): { [key: number]: number } => {
    const factors: { [key: number]: number } = {};
    let divisor = 2;
    
    while (divisor * divisor <= n) {
      while (n % divisor === 0) {
        factors[divisor] = (factors[divisor] || 0) + 1;
        n /= divisor;
      }
      divisor++;
    }
    
    if (n > 1) {
      factors[n] = (factors[n] || 0) + 1;
    }
    
    return factors;
  };

  const formatPrimeFactorization = (factors: { [key: number]: number }): string => {
    return Object.entries(factors)
      .map(([prime, power]) => power === 1 ? prime : `${prime}^${power}`)
      .join(' × ');
  };

  const addFraction = () => {
    setFractions([...fractions, { numerator: '', denominator: '' }]);
  };

  const removeFraction = (index: number) => {
    if (fractions.length > 2) {
      setFractions(fractions.filter((_, i) => i !== index));
    }
  };

  const updateFraction = (index: number, field: 'numerator' | 'denominator', value: string) => {
    const newFractions = [...fractions];
    newFractions[index][field] = value;
    setFractions(newFractions);
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
        <span className="text-gray-900 font-medium">Common Denominator Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Divide className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Common Denominator Calculator</h1>
        </div>

        {/* Fraction Inputs */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Fractions</label>
          <div className="space-y-4">
            {fractions.map((fraction, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={fraction.numerator}
                    onChange={(e) => updateFraction(index, 'numerator', e.target.value)}
                    placeholder="Numerator"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  />
                  <div className="text-2xl text-gray-400">/</div>
                  <input
                    type="number"
                    value={fraction.denominator}
                    onChange={(e) => updateFraction(index, 'denominator', e.target.value)}
                    placeholder="Denominator"
                    className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center"
                  />
                </div>
                
                <button
                  onClick={() => removeFraction(index)}
                  disabled={fractions.length === 2}
                  className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          
          <button
            onClick={addFraction}
            className="mt-4 flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Fraction</span>
          </button>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Common Denominator */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Least Common Denominator</h3>
              <div className="text-4xl font-bold text-orange-600 mb-4">
                {result.commonDenominator}
              </div>
              <div className="text-gray-600">
                LCM of {result.originalFractions.map((f: any) => f.denominator).join(', ')}
              </div>
            </div>

            {/* Converted Fractions */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equivalent Fractions</h3>
              <div className="space-y-3">
                {result.convertedFractions.map((frac: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-lg font-mono">
                        {frac.original.numerator}/{frac.original.denominator}
                      </div>
                      <div className="text-gray-400">=</div>
                      <div className="text-lg font-mono text-blue-600">
                        {frac.converted.numerator}/{frac.converted.denominator}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      (multiply by {frac.multiplier})
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sum */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sum of Fractions</h3>
              <div className="text-center">
                <div className="text-2xl font-mono text-green-600 mb-2">
                  {result.sum.numerator}/{result.sum.denominator}
                </div>
                {(result.sum.simplified.numerator !== result.sum.numerator || 
                  result.sum.simplified.denominator !== result.sum.denominator) && (
                  <div className="text-lg font-mono text-green-700">
                    = {result.sum.simplified.numerator}/{result.sum.simplified.denominator} (simplified)
                  </div>
                )}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Prime Factorizations */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Prime Factorizations</h3>
              <div className="space-y-2">
                {result.primeFactorizations.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-lg p-3">
                    <span className="font-mono text-purple-600">
                      {item.number} = {formatPrimeFactorization(item.factors)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Common Denominators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Why Use Common Denominators?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Required for adding/subtracting fractions</li>
                <li>• Makes fraction comparison easier</li>
                <li>• Simplifies complex fraction operations</li>
                <li>• Foundation for algebraic operations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Methods</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Least Common Multiple (LCM)</li>
                <li>• Prime factorization</li>
                <li>• Listing multiples</li>
                <li>• Cross multiplication</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonDenominatorCalculator;