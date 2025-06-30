import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Binary, Plus, Minus, X, Divide } from 'lucide-react';

const HexCalculator: React.FC = () => {
  const [hex1, setHex1] = useState('');
  const [hex2, setHex2] = useState('');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide' | 'and' | 'or' | 'xor' | 'not'>('add');
  const [result, setResult] = useState<any>(null);

  const validateHex = (hex: string): boolean => {
    return /^[0-9A-Fa-f]+$/.test(hex);
  };

  const hexToDecimal = (hex: string): number => {
    return parseInt(hex, 16);
  };

  const decimalToHex = (decimal: number): string => {
    return decimal.toString(16).toUpperCase();
  };

  const calculateHex = () => {
    if (operation === 'not') {
      if (!validateHex(hex1)) {
        setResult({ error: 'Please enter a valid hexadecimal number' });
        return;
      }
    } else {
      if (!validateHex(hex1) || !validateHex(hex2)) {
        setResult({ error: 'Please enter valid hexadecimal numbers' });
        return;
      }
    }

    const dec1 = hexToDecimal(hex1);
    const dec2 = operation !== 'not' ? hexToDecimal(hex2) : null;
    let resultDecimal: number;
    let operationSymbol: string;

    switch (operation) {
      case 'add':
        resultDecimal = dec1 + dec2!;
        operationSymbol = '+';
        break;
      case 'subtract':
        resultDecimal = dec1 - dec2!;
        operationSymbol = '-';
        break;
      case 'multiply':
        resultDecimal = dec1 * dec2!;
        operationSymbol = '×';
        break;
      case 'divide':
        if (dec2 === 0) {
          setResult({ error: 'Cannot divide by zero' });
          return;
        }
        resultDecimal = Math.floor(dec1 / dec2!);
        operationSymbol = '÷';
        break;
      case 'and':
        resultDecimal = dec1 & dec2!;
        operationSymbol = 'AND';
        break;
      case 'or':
        resultDecimal = dec1 | dec2!;
        operationSymbol = 'OR';
        break;
      case 'xor':
        resultDecimal = dec1 ^ dec2!;
        operationSymbol = 'XOR';
        break;
      case 'not':
        // Bitwise NOT with 32-bit limit
        resultDecimal = ~dec1 & 0xFFFFFFFF;
        operationSymbol = 'NOT';
        break;
      default:
        return;
    }

    const resultHex = decimalToHex(resultDecimal);
    
    // Generate binary representations for bitwise operations
    let binaryDetails = null;
    if (['and', 'or', 'xor', 'not'].includes(operation)) {
      const bin1 = dec1.toString(2).padStart(32, '0');
      const bin2 = dec2 !== null ? dec2.toString(2).padStart(32, '0') : null;
      const binResult = resultDecimal.toString(2).padStart(32, '0');
      
      binaryDetails = {
        bin1,
        bin2,
        binResult
      };
    }

    setResult({
      hex1,
      hex2,
      dec1,
      dec2,
      operation: operationSymbol,
      resultDecimal,
      resultHex,
      binaryDetails
    });
  };

  const operations = [
    { id: 'add', name: 'Addition', symbol: '+' },
    { id: 'subtract', name: 'Subtraction', symbol: '-' },
    { id: 'multiply', name: 'Multiplication', symbol: '×' },
    { id: 'divide', name: 'Division', symbol: '÷' },
    { id: 'and', name: 'Bitwise AND', symbol: '&' },
    { id: 'or', name: 'Bitwise OR', symbol: '|' },
    { id: 'xor', name: 'Bitwise XOR', symbol: '^' },
    { id: 'not', name: 'Bitwise NOT', symbol: '~' },
  ];

  const hexExamples = [
    { hex: 'FF', decimal: 255, description: '255' },
    { hex: 'A', decimal: 10, description: '10' },
    { hex: '64', decimal: 100, description: '100' },
    { hex: '100', decimal: 256, description: '256' },
    { hex: '1000', decimal: 4096, description: '4096' },
    { hex: 'FFFF', decimal: 65535, description: '65535' },
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
        <span className="text-gray-900 font-medium">Hexadecimal Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Binary className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Hexadecimal Calculator</h1>
        </div>

        {/* Operation Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Operation</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {operations.map((op) => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  operation === op.id
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">First Hexadecimal Number</label>
            <input
              type="text"
              value={hex1}
              onChange={(e) => setHex1(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
              placeholder="Enter hex number (e.g., 1A)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-mono"
            />
            {hex1 && validateHex(hex1) && (
              <div className="text-sm text-gray-600 mt-1">
                Decimal: {hexToDecimal(hex1)}
              </div>
            )}
          </div>
          
          {operation !== 'not' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Second Hexadecimal Number</label>
              <input
                type="text"
                value={hex2}
                onChange={(e) => setHex2(e.target.value.toUpperCase().replace(/[^0-9A-F]/g, ''))}
                placeholder="Enter hex number (e.g., 2B)"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg font-mono"
              />
              {hex2 && validateHex(hex2) && (
                <div className="text-sm text-gray-600 mt-1">
                  Decimal: {hexToDecimal(hex2)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateHex}
          className="w-full md:w-auto px-8 py-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-lg font-semibold mb-8"
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
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Hexadecimal Calculation Result</h3>
                
                <div className="text-center mb-6">
                  <div className="text-2xl font-mono text-gray-800 mb-2">
                    {operation === 'not' ? (
                      `NOT ${result.hex1} = ${result.resultHex}`
                    ) : (
                      `${result.hex1} ${result.operation} ${result.hex2} = ${result.resultHex}`
                    )}
                  </div>
                  <div className="text-lg text-gray-600">
                    {operation === 'not' ? (
                      `NOT ${result.dec1} = ${result.resultDecimal} in decimal`
                    ) : (
                      `(${result.dec1} ${result.operation} ${result.dec2} = ${result.resultDecimal} in decimal)`
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Hexadecimal Result</div>
                    <div className="text-xl font-mono text-orange-600">{result.resultHex}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Decimal Result</div>
                    <div className="text-xl font-mono text-blue-600">{result.resultDecimal}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Binary Result</div>
                    <div className="text-lg font-mono text-green-600">
                      {result.resultDecimal.toString(2)}
                    </div>
                  </div>
                </div>
                
                {/* Binary details for bitwise operations */}
                {result.binaryDetails && (
                  <div className="mt-6 bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Bitwise Operation Details</h4>
                    <div className="space-y-2 font-mono text-xs">
                      {operation !== 'not' && (
                        <>
                          <div className="flex">
                            <div className="w-20 text-gray-600">First:</div>
                            <div className="text-blue-600 break-all">{result.binaryDetails.bin1}</div>
                          </div>
                          <div className="flex">
                            <div className="w-20 text-gray-600">Second:</div>
                            <div className="text-green-600 break-all">{result.binaryDetails.bin2}</div>
                          </div>
                        </>
                      )}
                      <div className="flex">
                        <div className="w-20 text-gray-600">Result:</div>
                        <div className="text-orange-600 break-all">{result.binaryDetails.binResult}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Hex Reference */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hexadecimal Reference</h3>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2 text-sm">
            {hexExamples.map((hex, index) => (
              <div key={index} className="text-center p-2 bg-white rounded">
                <div className="font-mono text-orange-600">{hex.hex}<sub>16</sub></div>
                <div className="text-xs text-gray-600">{hex.decimal}<sub>10</sub></div>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Hexadecimal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Hexadecimal System</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Base-16 number system</li>
                <li>• Uses digits 0-9 and letters A-F</li>
                <li>• A=10, B=11, C=12, D=13, E=14, F=15</li>
                <li>• Each digit represents a power of 16</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Memory addresses in programming</li>
                <li>• Color codes in web design (e.g., #FF5500)</li>
                <li>• Compact representation of binary data</li>
                <li>• Assembly language and machine code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HexCalculator;