import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp } from 'lucide-react';

const ExponentCalculator: React.FC = () => {
  const [base, setBase] = useState('');
  const [exponent, setExponent] = useState('');
  const [calculationType, setCalculationType] = useState<'power' | 'root' | 'log'>('power');
  const [result, setResult] = useState<any>(null);

  const calculateResult = () => {
    const baseNum = parseFloat(base);
    const expNum = parseFloat(exponent);
    
    if (isNaN(baseNum) || isNaN(expNum)) {
      setResult({ error: "Please enter valid numbers" });
      return;
    }
    
    try {
      switch (calculationType) {
        case 'power':
          calculatePower(baseNum, expNum);
          break;
        case 'root':
          calculateRoot(baseNum, expNum);
          break;
        case 'log':
          calculateLog(baseNum, expNum);
          break;
      }
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  const calculatePower = (baseNum: number, expNum: number) => {
    // Handle special cases
    if (baseNum === 0 && expNum === 0) {
      setResult({ 
        error: "0⁰ is indeterminate", 
        steps: ["0 raised to the power of 0 is mathematically indeterminate."] 
      });
      return;
    }
    
    if (baseNum < 0 && !Number.isInteger(expNum)) {
      setResult({ 
        error: "Cannot calculate non-integer powers of negative numbers in the real domain", 
        steps: ["Negative numbers raised to non-integer powers result in complex numbers."] 
      });
      return;
    }
    
    const steps = [];
    steps.push(`Calculate ${baseNum}^${expNum}`);
    
    // For integer exponents, show step-by-step calculation
    if (Number.isInteger(expNum) && expNum > 0 && expNum <= 10) {
      steps.push(`${baseNum} multiplied by itself ${expNum} times:`);
      let calculation = `${baseNum}`;
      let currentResult = baseNum;
      
      for (let i = 1; i < expNum; i++) {
        currentResult *= baseNum;
        calculation += ` × ${baseNum}`;
        if (i % 3 === 2) {  // Show intermediate results every 3 steps
          steps.push(`${calculation} = ${currentResult}`);
          calculation = `${currentResult}`;
        }
      }
      
      if (calculation !== `${currentResult}`) {
        steps.push(`${calculation} = ${currentResult}`);
      }
    } else if (expNum === 0) {
      steps.push(`Any number raised to the power of 0 equals 1 (except 0⁰ which is indeterminate)`);
      steps.push(`${baseNum}^0 = 1`);
    } else if (expNum < 0) {
      const positiveExp = -expNum;
      const intermediateResult = Math.pow(baseNum, positiveExp);
      steps.push(`Negative exponent means reciprocal: ${baseNum}^(${expNum}) = 1/(${baseNum}^${positiveExp})`);
      steps.push(`Calculate ${baseNum}^${positiveExp} = ${intermediateResult}`);
      steps.push(`Final result: 1/${intermediateResult} = ${1/intermediateResult}`);
    } else if (!Number.isInteger(expNum)) {
      steps.push(`For non-integer exponents, we use the formula: a^b = e^(b×ln(a))`);
      const lnBase = Math.log(baseNum);
      steps.push(`ln(${baseNum}) = ${lnBase.toFixed(6)}`);
      steps.push(`${expNum} × ln(${baseNum}) = ${(expNum * lnBase).toFixed(6)}`);
      steps.push(`e^(${expNum} × ln(${baseNum})) = ${Math.pow(baseNum, expNum).toFixed(10)}`);
    } else {
      // For large integer exponents
      steps.push(`Using direct calculation for large exponent`);
      steps.push(`${baseNum}^${expNum} = ${Math.pow(baseNum, expNum)}`);
    }
    
    const finalResult = Math.pow(baseNum, expNum);
    
    setResult({
      value: finalResult,
      steps,
      scientific: finalResult.toExponential(6),
      decimal: finalResult.toFixed(10)
    });
  };

  const calculateRoot = (baseNum: number, rootNum: number) => {
    // Handle special cases
    if (baseNum < 0 && rootNum % 2 === 0) {
      setResult({ 
        error: "Even roots of negative numbers are not real numbers", 
        steps: ["Cannot calculate even roots of negative numbers in the real domain."] 
      });
      return;
    }
    
    if (rootNum === 0) {
      setResult({ 
        error: "Cannot calculate 0th root", 
        steps: ["The 0th root is undefined."] 
      });
      return;
    }
    
    const steps = [];
    steps.push(`Calculate the ${rootNum}th root of ${baseNum}`);
    steps.push(`This is equivalent to ${baseNum}^(1/${rootNum})`);
    
    let result;
    if (baseNum < 0) {
      // For negative base with odd root
      result = -Math.pow(-baseNum, 1/rootNum);
      steps.push(`For negative numbers with odd roots: -(-${baseNum})^(1/${rootNum})`);
    } else {
      result = Math.pow(baseNum, 1/rootNum);
    }
    
    steps.push(`Using the power formula: ${baseNum}^(1/${rootNum}) = ${result.toFixed(10)}`);
    
    // Check if it's a perfect root
    const perfectRoot = Math.pow(Math.round(Math.pow(baseNum, 1/rootNum)), rootNum);
    const isPerfect = Math.abs(perfectRoot - baseNum) < 1e-10;
    
    if (isPerfect) {
      steps.push(`This is a perfect ${rootNum}th root!`);
    }
    
    setResult({
      value: result,
      steps,
      scientific: result.toExponential(6),
      decimal: result.toFixed(10),
      isPerfect
    });
  };

  const calculateLog = (baseNum: number, logBase: number) => {
    // Handle special cases
    if (baseNum <= 0) {
      setResult({ 
        error: "Cannot calculate logarithm of non-positive numbers", 
        steps: ["Logarithms are only defined for positive numbers."] 
      });
      return;
    }
    
    if (logBase <= 0 || logBase === 1) {
      setResult({ 
        error: "Invalid logarithm base", 
        steps: ["Logarithm base must be positive and not equal to 1."] 
      });
      return;
    }
    
    const steps = [];
    steps.push(`Calculate log base ${logBase} of ${baseNum}`);
    steps.push(`Using the change of base formula: log_${logBase}(${baseNum}) = ln(${baseNum}) / ln(${logBase})`);
    
    const lnBase = Math.log(baseNum);
    const lnLogBase = Math.log(logBase);
    const result = lnBase / lnLogBase;
    
    steps.push(`ln(${baseNum}) = ${lnBase.toFixed(6)}`);
    steps.push(`ln(${logBase}) = ${lnLogBase.toFixed(6)}`);
    steps.push(`ln(${baseNum}) / ln(${logBase}) = ${lnBase.toFixed(6)} / ${lnLogBase.toFixed(6)} = ${result.toFixed(10)}`);
    
    // Check if it's an integer or simple fraction
    if (Math.abs(result - Math.round(result)) < 1e-10) {
      steps.push(`This is an integer result: ${Math.round(result)}`);
      steps.push(`This means ${logBase}^${Math.round(result)} = ${baseNum}`);
    }
    
    setResult({
      value: result,
      steps,
      scientific: result.toExponential(6),
      decimal: result.toFixed(10)
    });
  };

  const calculationTypes = [
    { id: 'power', name: 'Power', description: 'Calculate base^exponent', baseLabel: 'Base', exponentLabel: 'Exponent' },
    { id: 'root', name: 'Root', description: 'Calculate nth root of a number', baseLabel: 'Number', exponentLabel: 'Root index' },
    { id: 'log', name: 'Logarithm', description: 'Calculate logarithm with custom base', baseLabel: 'Number', exponentLabel: 'Log base' },
  ];

  const examples = [
    { type: 'power', base: '2', exponent: '8', result: '256' },
    { type: 'power', base: '10', exponent: '-2', result: '0.01' },
    { type: 'root', base: '16', exponent: '2', result: '4' },
    { type: 'root', base: '27', exponent: '3', result: '3' },
    { type: 'log', base: '100', exponent: '10', result: '2' },
    { type: 'log', base: '8', exponent: '2', result: '3' },
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
        <span className="text-gray-900 font-medium">Exponent Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-teal-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Exponent Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {calculationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setCalculationType(type.id as any);
                  setResult(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === type.id
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{type.name}</div>
                <div className="text-sm opacity-75">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {calculationTypes.find(t => t.id === calculationType)?.baseLabel || 'Base'}
            </label>
            <input
              type="number"
              value={base}
              onChange={(e) => setBase(e.target.value)}
              placeholder={calculationType === 'power' ? 'e.g., 2' : calculationType === 'root' ? 'e.g., 16' : 'e.g., 100'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {calculationTypes.find(t => t.id === calculationType)?.exponentLabel || 'Exponent'}
            </label>
            <input
              type="number"
              value={exponent}
              onChange={(e) => setExponent(e.target.value)}
              placeholder={calculationType === 'power' ? 'e.g., 3' : calculationType === 'root' ? 'e.g., 2' : 'e.g., 10'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateResult}
          className="w-full md:w-auto px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate
        </button>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {examples.filter(ex => ex.type === calculationType).map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm mb-2">
                  {calculationType === 'power' && (
                    <span className="font-mono">{ex.base}^{ex.exponent} = {ex.result}</span>
                  )}
                  {calculationType === 'root' && (
                    <span className="font-mono">{ex.exponent}√{ex.base} = {ex.result}</span>
                  )}
                  {calculationType === 'log' && (
                    <span className="font-mono">log_{ex.exponent}({ex.base}) = {ex.result}</span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setBase(ex.base);
                    setExponent(ex.exponent);
                  }}
                  className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded hover:bg-teal-200 transition-colors"
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
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Result</h3>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-teal-600 mb-2">
                    {result.value.toString()}
                  </div>
                  <div className="text-gray-600">
                    {calculationType === 'power' && `${base}^${exponent}`}
                    {calculationType === 'root' && `${exponent}√${base}`}
                    {calculationType === 'log' && `log_${exponent}(${base})`}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Scientific Notation</div>
                    <div className="text-lg font-mono text-teal-600">{result.scientific}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Decimal Form</div>
                    <div className="text-lg font-mono text-cyan-600">{result.decimal}</div>
                  </div>
                </div>
                
                {result.isPerfect && (
                  <div className="mt-4 bg-green-100 text-green-800 p-3 rounded-lg text-center">
                    This is a perfect {exponent}th root!
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
                    <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Exponent Rules</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Rules</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• x^a × x^b = x^(a+b)</li>
                <li>• x^a ÷ x^b = x^(a-b)</li>
                <li>• (x^a)^b = x^(a×b)</li>
                <li>• x^0 = 1 (if x ≠ 0)</li>
                <li>• x^(-a) = 1/(x^a)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Special Cases</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• 0^0 is indeterminate</li>
                <li>• Negative numbers with non-integer exponents may give complex results</li>
                <li>• n√x = x^(1/n)</li>
                <li>• log_b(x) = ln(x) / ln(b)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExponentCalculator;