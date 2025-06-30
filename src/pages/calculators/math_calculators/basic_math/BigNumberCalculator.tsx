import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Infinity } from 'lucide-react';

const BigNumberCalculator: React.FC = () => {
  const [number1, setNumber1] = useState('');
  const [number2, setNumber2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide' | 'power'>('add');
  const [result, setResult] = useState<any>(null);

  const calculateBigNumber = () => {
    try {
      const num1 = BigInt(number1.replace(/[^-0-9]/g, ''));
      const num2 = BigInt(number2.replace(/[^-0-9]/g, ''));
      
      let calculatedResult: bigint | string;
      let explanation: string;

      switch (operation) {
        case 'add':
          calculatedResult = num1 + num2;
          explanation = `${number1} + ${number2}`;
          break;
        case 'subtract':
          calculatedResult = num1 - num2;
          explanation = `${number1} - ${number2}`;
          break;
        case 'multiply':
          calculatedResult = num1 * num2;
          explanation = `${number1} × ${number2}`;
          break;
        case 'divide':
          if (num2 === BigInt(0)) {
            setResult({ error: 'Cannot divide by zero' });
            return;
          }
          calculatedResult = num1 / num2;
          const remainder = num1 % num2;
          explanation = `${number1} ÷ ${number2}`;
          setResult({
            result: calculatedResult.toString(),
            remainder: remainder.toString(),
            explanation,
            formatted: formatBigNumber(calculatedResult.toString()),
            digitCount: calculatedResult.toString().replace('-', '').length,
            scientific: toScientificNotation(calculatedResult.toString())
          });
          return;
        case 'power':
          const exp = Number(num2);
          if (exp < 0) {
            setResult({ error: 'Negative exponents not supported for big integers' });
            return;
          }
          if (exp > 1000) {
            setResult({ error: 'Exponent too large (max 1000)' });
            return;
          }
          calculatedResult = num1 ** num2;
          explanation = `${number1}^${number2}`;
          break;
        default:
          return;
      }

      setResult({
        result: calculatedResult.toString(),
        explanation,
        formatted: formatBigNumber(calculatedResult.toString()),
        digitCount: calculatedResult.toString().replace('-', '').length,
        scientific: toScientificNotation(calculatedResult.toString()),
        wordForm: numberToWords(calculatedResult.toString())
      });
    } catch (error) {
      setResult({ error: 'Invalid input. Please enter valid integers.' });
    }
  };

  const formatBigNumber = (numStr: string): string => {
    const isNegative = numStr.startsWith('-');
    const digits = isNegative ? numStr.slice(1) : numStr;
    const formatted = digits.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return isNegative ? '-' + formatted : formatted;
  };

  const toScientificNotation = (numStr: string): string => {
    const isNegative = numStr.startsWith('-');
    const digits = isNegative ? numStr.slice(1) : numStr;
    
    if (digits === '0') return '0';
    
    const firstDigit = digits[0];
    const remainingDigits = digits.slice(1);
    const exponent = digits.length - 1;
    
    let coefficient = firstDigit;
    if (remainingDigits) {
      coefficient += '.' + remainingDigits.slice(0, 6); // Show up to 6 decimal places
    }
    
    const result = `${coefficient} × 10^${exponent}`;
    return isNegative ? '-' + result : result;
  };

  const numberToWords = (numStr: string): string => {
    const isNegative = numStr.startsWith('-');
    const digits = isNegative ? numStr.slice(1) : numStr;
    
    if (digits.length <= 3) {
      return 'Small number (use regular calculator)';
    }
    
    const groups = [
      '', 'thousand', 'million', 'billion', 'trillion', 'quadrillion', 
      'quintillion', 'sextillion', 'septillion', 'octillion', 'nonillion', 
      'decillion', 'undecillion', 'duodecillion'
    ];
    
    const groupCount = Math.ceil(digits.length / 3);
    if (groupCount > groups.length) {
      return `Number with ${digits.length} digits`;
    }
    
    const groupName = groups[groupCount - 1];
    const prefix = isNegative ? 'Negative ' : '';
    
    return `${prefix}${digits.slice(0, 3)} ${groupName}${digits.length > 3 ? ' and more' : ''}`;
  };

  const operations = [
    { id: 'add', name: 'Addition', symbol: '+' },
    { id: 'subtract', name: 'Subtraction', symbol: '-' },
    { id: 'multiply', name: 'Multiplication', symbol: '×' },
    { id: 'divide', name: 'Division', symbol: '÷' },
    { id: 'power', name: 'Exponentiation', symbol: '^' },
  ];

  const examples = [
    { 
      description: 'Factorial of 100', 
      number: '93326215443944152681699238856266700490715968264381621468592963895217599993229915608941463976156518286253697920827223758251185210916864000000000000000000000000'
    },
    {
      description: 'Googol (10^100)',
      number: '10000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'
    },
    {
      description: 'Large Fibonacci number',
      number: '1146295688027634168201473240205379'
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
        <span className="text-gray-900 font-medium">Big Number Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Infinity className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Big Number Calculator</h1>
        </div>

        {/* Operation Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Operation</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {operations.map((op) => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  operation === op.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-lg">{op.symbol}</div>
                <div className="text-sm">{op.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Number
            </label>
            <textarea
              value={number1}
              onChange={(e) => setNumber1(e.target.value)}
              placeholder="Enter first large number (integers only)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Second Number
            </label>
            <textarea
              value={number2}
              onChange={(e) => setNumber2(e.target.value)}
              placeholder="Enter second large number (integers only)"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-mono resize-none"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateBigNumber}
          className="w-full md:w-auto px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {result.error}
              </div>
            ) : (
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
                  <div className="text-center mb-4">
                    <div className="text-lg text-gray-600 mb-2">{result.explanation}</div>
                    <div className="text-2xl font-bold text-purple-600 mb-4">
                      {result.digitCount} digits
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-600 mb-2">Formatted Result:</div>
                    <div className="font-mono text-sm break-all bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                      {result.formatted}
                    </div>
                  </div>

                  {result.remainder && (
                    <div className="bg-white rounded-lg p-4 mb-4">
                      <div className="text-sm text-gray-600 mb-2">Remainder:</div>
                      <div className="font-mono text-sm text-orange-600">{result.remainder}</div>
                    </div>
                  )}
                </div>

                {/* Different Representations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Scientific Notation</h3>
                    <div className="font-mono text-sm bg-white p-3 rounded break-all">
                      {result.scientific}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Word Form</h3>
                    <div className="text-sm bg-white p-3 rounded">
                      {result.wordForm}
                    </div>
                  </div>
                </div>

                {/* Raw Result */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Raw Result (Copy/Paste)</h3>
                  <textarea
                    value={result.result}
                    readOnly
                    rows={6}
                    className="w-full font-mono text-sm bg-white border border-gray-300 rounded p-3 resize-none"
                  />
                </div>
              </>
            )}
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Large Numbers</h3>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800 mb-2">{example.description}</div>
                <div className="font-mono text-xs bg-gray-50 p-2 rounded break-all">
                  {example.number}
                </div>
                <button
                  onClick={() => setNumber1(example.number)}
                  className="mt-2 px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors"
                >
                  Use as Number 1
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Big Number Calculations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Capabilities</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Unlimited precision integer arithmetic</li>
                <li>• Numbers with thousands of digits</li>
                <li>• Exact calculations (no rounding errors)</li>
                <li>• Supports negative numbers</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Limitations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Integers only (no decimals)</li>
                <li>• Division gives integer quotient</li>
                <li>• Large calculations may be slow</li>
                <li>• Exponents limited to 1000</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigNumberCalculator;