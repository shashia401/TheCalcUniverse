import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Binary } from 'lucide-react';

const BinaryCalculator: React.FC = () => {
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide' | 'convert'>('add');
  const [binary1, setBinary1] = useState('1010');
  const [binary2, setBinary2] = useState('1100');
  const [decimal, setDecimal] = useState('');
  const [result, setResult] = useState<any>(null);

  const validateBinary = (binary: string): boolean => {
    return /^[01]+$/.test(binary);
  };

  const binaryToDecimal = (binary: string): number => {
    return parseInt(binary, 2);
  };

  const decimalToBinary = (decimal: number): string => {
    return decimal.toString(2);
  };

  const calculateBinary = () => {
    if (operation === 'convert') {
      if (decimal) {
        const dec = parseInt(decimal);
        if (!isNaN(dec) && dec >= 0) {
          setResult({
            type: 'conversion',
            decimal: dec,
            binary: decimalToBinary(dec),
            hex: dec.toString(16).toUpperCase(),
            octal: dec.toString(8)
          });
        }
      }
      return;
    }

    if (!validateBinary(binary1) || !validateBinary(binary2)) {
      setResult({ error: 'Please enter valid binary numbers (only 0s and 1s)' });
      return;
    }

    const dec1 = binaryToDecimal(binary1);
    const dec2 = binaryToDecimal(binary2);
    let resultDecimal: number;
    let operationSymbol: string;

    switch (operation) {
      case 'add':
        resultDecimal = dec1 + dec2;
        operationSymbol = '+';
        break;
      case 'subtract':
        resultDecimal = dec1 - dec2;
        operationSymbol = '-';
        break;
      case 'multiply':
        resultDecimal = dec1 * dec2;
        operationSymbol = '×';
        break;
      case 'divide':
        if (dec2 === 0) {
          setResult({ error: 'Cannot divide by zero' });
          return;
        }
        resultDecimal = Math.floor(dec1 / dec2);
        operationSymbol = '÷';
        break;
      default:
        return;
    }

    setResult({
      type: 'calculation',
      binary1,
      binary2,
      decimal1: dec1,
      decimal2: dec2,
      operation: operationSymbol,
      resultDecimal,
      resultBinary: resultDecimal >= 0 ? decimalToBinary(resultDecimal) : 'Negative result',
      steps: generateSteps(dec1, dec2, resultDecimal, operationSymbol)
    });
  };

  const generateSteps = (dec1: number, dec2: number, result: number, op: string): string[] => {
    return [
      `Convert binary to decimal:`,
      `${binary1}₂ = ${dec1}₁₀`,
      `${binary2}₂ = ${dec2}₁₀`,
      `Perform operation in decimal:`,
      `${dec1} ${op} ${dec2} = ${result}`,
      `Convert result back to binary:`,
      `${result}₁₀ = ${result >= 0 ? decimalToBinary(result) : 'N/A'}₂`
    ];
  };

  const operations = [
    { id: 'add', name: 'Addition', symbol: '+' },
    { id: 'subtract', name: 'Subtraction', symbol: '-' },
    { id: 'multiply', name: 'Multiplication', symbol: '×' },
    { id: 'divide', name: 'Division', symbol: '÷' },
    { id: 'convert', name: 'Convert', symbol: '⇄' },
  ];

  const binaryExamples = [
    { binary: '1010', decimal: 10, description: 'Ten' },
    { binary: '1111', decimal: 15, description: 'Fifteen' },
    { binary: '10000', decimal: 16, description: 'Sixteen' },
    { binary: '11111111', decimal: 255, description: 'Max 8-bit' },
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
        <span className="text-gray-900 font-medium">Binary Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Binary className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Binary Calculator</h1>
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
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
        {operation === 'convert' ? (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">Decimal Number</label>
            <input
              type="number"
              value={decimal}
              onChange={(e) => setDecimal(e.target.value)}
              placeholder="Enter decimal number"
              min="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Binary Number 1</label>
              <input
                type="text"
                value={binary1}
                onChange={(e) => setBinary1(e.target.value.replace(/[^01]/g, ''))}
                placeholder="Enter binary number (e.g., 1010)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
              />
              {binary1 && validateBinary(binary1) && (
                <div className="text-sm text-gray-600 mt-1">
                  Decimal: {binaryToDecimal(binary1)}
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Binary Number 2</label>
              <input
                type="text"
                value={binary2}
                onChange={(e) => setBinary2(e.target.value.replace(/[^01]/g, ''))}
                placeholder="Enter binary number (e.g., 1100)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-mono"
              />
              {binary2 && validateBinary(binary2) && (
                <div className="text-sm text-gray-600 mt-1">
                  Decimal: {binaryToDecimal(binary2)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        <button
          onClick={calculateBinary}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold mb-8"
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
            ) : result.type === 'conversion' ? (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Number Conversion</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Decimal</div>
                    <div className="text-xl font-mono text-blue-600">{result.decimal}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Binary</div>
                    <div className="text-xl font-mono text-green-600">{result.binary}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Hexadecimal</div>
                    <div className="text-xl font-mono text-purple-600">{result.hex}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Octal</div>
                    <div className="text-xl font-mono text-orange-600">{result.octal}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Main Result */}
                <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Binary Calculation Result</h3>
                  <div className="text-center mb-6">
                    <div className="text-2xl font-mono text-gray-800 mb-2">
                      {result.binary1} {result.operation} {result.binary2} = {result.resultBinary}
                    </div>
                    <div className="text-lg text-gray-600">
                      ({result.decimal1} {result.operation} {result.decimal2} = {result.resultDecimal} in decimal)
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Binary Result</div>
                      <div className="text-xl font-mono text-blue-600">{result.resultBinary}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Decimal Result</div>
                      <div className="text-xl font-mono text-green-600">{result.resultDecimal}</div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Hexadecimal</div>
                      <div className="text-xl font-mono text-purple-600">
                        {result.resultDecimal >= 0 ? result.resultDecimal.toString(16).toUpperCase() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step-by-Step */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
                  <div className="space-y-2">
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
              </div>
            )}
          </div>
        )}

        {/* Binary Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Binary Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {binaryExamples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center">
                <div className="text-lg font-mono text-blue-600 mb-1">{example.binary}₂</div>
                <div className="text-sm text-gray-600 mb-1">= {example.decimal}₁₀</div>
                <div className="text-xs text-gray-500">{example.description}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Binary Number System</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Concepts</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Base-2 number system (only 0 and 1)</li>
                <li>• Each digit represents a power of 2</li>
                <li>• Used in computer systems</li>
                <li>• Rightmost digit is 2⁰ = 1</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Conversion Tips</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• 1010₂ = 1×8 + 0×4 + 1×2 + 0×1 = 10₁₀</li>
                <li>• To convert decimal to binary, divide by 2</li>
                <li>• Read remainders from bottom to top</li>
                <li>• Practice with small numbers first</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BinaryCalculator;