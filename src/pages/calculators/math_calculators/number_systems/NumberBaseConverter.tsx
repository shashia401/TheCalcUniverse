import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Binary, RefreshCw } from 'lucide-react';

const NumberBaseConverter: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [inputBase, setInputBase] = useState('10');
  const [outputBase, setOutputBase] = useState('2');
  const [result, setResult] = useState<any>(null);

  const convertBase = () => {
    try {
      if (!inputValue.trim()) {
        setResult(null);
        return;
      }

      const inBase = parseInt(inputBase);
      const outBase = parseInt(outputBase);
      
      // Validate bases
      if (inBase < 2 || inBase > 36 || outBase < 2 || outBase > 36) {
        setResult({ error: "Bases must be between 2 and 36" });
        return;
      }
      
      // Clean input value
      const cleanedInput = inputValue.trim().toUpperCase();
      
      // Validate input for the given base
      const validChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".substring(0, inBase);
      for (const char of cleanedInput) {
        if (!validChars.includes(char)) {
          setResult({ error: `Invalid character '${char}' for base ${inBase}` });
          return;
        }
      }
      
      // Convert to decimal first
      const decimalValue = parseInt(cleanedInput, inBase);
      
      // Then convert to target base
      const convertedValue = decimalValue.toString(outBase).toUpperCase();
      
      // Generate steps
      const steps = [];
      
      if (inBase !== 10) {
        steps.push(`Step 1: Convert ${cleanedInput} (base ${inBase}) to decimal`);
        
        // Show the calculation for converting to decimal
        const digits = cleanedInput.split('').reverse();
        let calculation = '';
        let sum = 0;
        
        digits.forEach((digit, index) => {
          const digitValue = parseInt(digit, 36);
          const positionValue = digitValue * Math.pow(inBase, index);
          sum += positionValue;
          
          calculation += `${digitValue} × ${inBase}^${index} = ${positionValue}`;
          if (index < digits.length - 1) calculation += ' + ';
        });
        
        steps.push(`${calculation} = ${decimalValue}`);
        steps.push(`Decimal value: ${decimalValue}`);
      } else {
        steps.push(`Decimal value: ${decimalValue}`);
      }
      
      if (outBase !== 10) {
        steps.push(`Step ${inBase !== 10 ? '2' : '1'}: Convert ${decimalValue} (decimal) to base ${outBase}`);
        
        // Show the calculation for converting from decimal
        let quotient = decimalValue;
        const remainders: number[] = [];
        const quotients: number[] = [];
        
        while (quotient > 0) {
          quotients.push(quotient);
          const remainder = quotient % outBase;
          remainders.push(remainder);
          quotient = Math.floor(quotient / outBase);
        }
        
        // Show division steps
        quotients.forEach((q, index) => {
          const remainder = remainders[index];
          const nextQuotient = index < quotients.length - 1 ? quotients[index + 1] : 0;
          const remainderChar = remainder < 10 ? remainder.toString() : String.fromCharCode(55 + remainder);
          
          steps.push(`${q} ÷ ${outBase} = ${nextQuotient} remainder ${remainder} (${remainderChar})`);
        });
        
        // Show how to read the result
        steps.push(`Read remainders from bottom to top: ${convertedValue}`);
      }
      
      steps.push(`Result: ${cleanedInput} (base ${inBase}) = ${convertedValue} (base ${outBase})`);
      
      setResult({
        inputValue: cleanedInput,
        inputBase: inBase,
        outputBase: outBase,
        decimalValue,
        convertedValue,
        steps
      });
    } catch (error) {
      setResult({ error: "Error in conversion. Please check your input." });
    }
  };

  const commonBases = [
    { value: '2', name: 'Binary' },
    { value: '8', name: 'Octal' },
    { value: '10', name: 'Decimal' },
    { value: '16', name: 'Hexadecimal' },
    { value: '36', name: 'Base36' },
  ];

  const examples = [
    { input: '1010', inBase: '2', outBase: '10', result: '10' },
    { input: '255', inBase: '10', outBase: '16', result: 'FF' },
    { input: 'FF', inBase: '16', outBase: '2', result: '11111111' },
    { input: '777', inBase: '8', outBase: '16', result: '1FF' },
  ];

  const swapBases = () => {
    setInputBase(outputBase);
    setOutputBase(inputBase);
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
        <span className="text-gray-900 font-medium">Number Base Converter</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Binary className="w-8 h-8 text-amber-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Number Base Converter</h1>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number to Convert
            </label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter a number"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg font-mono"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              From Base
            </label>
            <select
              value={inputBase}
              onChange={(e) => setInputBase(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
            >
              {Array.from({ length: 35 }, (_, i) => i + 2).map(base => (
                <option key={`from-${base}`} value={base}>
                  {base} {commonBases.find(b => b.value === base.toString())?.name ? `(${commonBases.find(b => b.value === base.toString())?.name})` : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center justify-center">
            <button
              onClick={swapBases}
              className="p-3 bg-amber-100 hover:bg-amber-200 rounded-full transition-colors"
            >
              <RefreshCw className="w-6 h-6 text-amber-600" />
            </button>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              To Base
            </label>
            <select
              value={outputBase}
              onChange={(e) => setOutputBase(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
            >
              {Array.from({ length: 35 }, (_, i) => i + 2).map(base => (
                <option key={`to-${base}`} value={base}>
                  {base} {commonBases.find(b => b.value === base.toString())?.name ? `(${commonBases.find(b => b.value === base.toString())?.name})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={convertBase}
          className="w-full md:w-auto px-8 py-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-lg font-semibold mb-8"
        >
          Convert
        </button>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm mb-2">
                  <span className="font-mono text-gray-600">{ex.input}</span>
                  <span className="text-xs text-gray-500 mx-1">(Base {ex.inBase})</span>
                  <span className="mx-2">→</span>
                  <span className="font-mono text-amber-600">{ex.result}</span>
                  <span className="text-xs text-gray-500 mx-1">(Base {ex.outBase})</span>
                </div>
                <button
                  onClick={() => {
                    setInputValue(ex.input);
                    setInputBase(ex.inBase);
                    setOutputBase(ex.outBase);
                  }}
                  className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
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
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Conversion Result</h3>
                  
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-amber-600 mb-2 font-mono">
                      {result.convertedValue}
                    </div>
                    <div className="text-gray-600">
                      {result.inputValue}<sub>{result.inputBase}</sub> = {result.convertedValue}<sub>{result.outputBase}</sub>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Original Value</div>
                      <div className="text-lg font-mono text-gray-800">{result.inputValue}<sub>{result.inputBase}</sub></div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Decimal Value</div>
                      <div className="text-lg font-mono text-blue-600">{result.decimalValue}<sub>10</sub></div>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <div className="text-sm text-gray-600 mb-1">Converted Value</div>
                      <div className="text-lg font-mono text-amber-600">{result.convertedValue}<sub>{result.outputBase}</sub></div>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Conversion</h3>
                  <div className="space-y-2">
                    {result.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="text-gray-700 font-mono text-sm">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Number Base Systems</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Common Number Bases</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Binary (Base 2): Uses 0 and 1 only</li>
                <li>• Octal (Base 8): Uses digits 0-7</li>
                <li>• Decimal (Base 10): Uses digits 0-9</li>
                <li>• Hexadecimal (Base 16): Uses 0-9 and A-F</li>
                <li>• Base36: Uses 0-9 and A-Z</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Binary: Computer memory and operations</li>
                <li>• Hexadecimal: Memory addresses, color codes</li>
                <li>• Octal: Unix file permissions</li>
                <li>• Base64: Data encoding for transmission</li>
                <li>• Base36: Short URLs and identifiers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NumberBaseConverter;