import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp } from 'lucide-react';

const LogarithmCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'log' | 'ln' | 'antilog' | 'change-base'>('log');
  const [number, setNumber] = useState('');
  const [base, setBase] = useState('10');
  const [newBase, setNewBase] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    calculateLogarithm();
  }, [calculationType, number, base, newBase]);

  const calculateLogarithm = () => {
    const num = parseFloat(number);
    const baseNum = parseFloat(base);
    const newBaseNum = parseFloat(newBase);

    if (!num || num <= 0) {
      setResult(null);
      setSteps([]);
      return;
    }

    let calculatedResult: number;
    let calculationSteps: string[] = [];

    try {
      switch (calculationType) {
        case 'log':
          if (baseNum <= 0 || baseNum === 1) {
            setResult(null);
            setSteps(['Error: Base must be positive and not equal to 1']);
            return;
          }
          calculatedResult = Math.log(num) / Math.log(baseNum);
          calculationSteps = [
            `Calculate log₍${baseNum}₎(${num})`,
            `Using change of base formula: log₍${baseNum}₎(${num}) = ln(${num}) / ln(${baseNum})`,
            `ln(${num}) = ${Math.log(num).toFixed(6)}`,
            `ln(${baseNum}) = ${Math.log(baseNum).toFixed(6)}`,
            `Result = ${Math.log(num).toFixed(6)} / ${Math.log(baseNum).toFixed(6)} = ${calculatedResult.toFixed(6)}`
          ];
          break;

        case 'ln':
          calculatedResult = Math.log(num);
          calculationSteps = [
            `Calculate ln(${num})`,
            `Natural logarithm (base e) of ${num}`,
            `Result = ${calculatedResult.toFixed(6)}`
          ];
          break;

        case 'antilog':
          if (baseNum <= 0 || baseNum === 1) {
            setResult(null);
            setSteps(['Error: Base must be positive and not equal to 1']);
            return;
          }
          calculatedResult = Math.pow(baseNum, num);
          calculationSteps = [
            `Calculate antilog₍${baseNum}₎(${num})`,
            `This means: ${baseNum}^${num}`,
            `Result = ${calculatedResult.toFixed(6)}`
          ];
          break;

        case 'change-base':
          if (baseNum <= 0 || baseNum === 1 || newBaseNum <= 0 || newBaseNum === 1) {
            setResult(null);
            setSteps(['Error: Both bases must be positive and not equal to 1']);
            return;
          }
          const originalLog = Math.log(num) / Math.log(baseNum);
          calculatedResult = Math.log(num) / Math.log(newBaseNum);
          calculationSteps = [
            `Convert log₍${baseNum}₎(${num}) to log₍${newBaseNum}₎(${num})`,
            `Original: log₍${baseNum}₎(${num}) = ${originalLog.toFixed(6)}`,
            `Using change of base: log₍${newBaseNum}₎(${num}) = ln(${num}) / ln(${newBaseNum})`,
            `ln(${num}) = ${Math.log(num).toFixed(6)}`,
            `ln(${newBaseNum}) = ${Math.log(newBaseNum).toFixed(6)}`,
            `Result = ${calculatedResult.toFixed(6)}`
          ];
          break;

        default:
          return;
      }

      setResult(calculatedResult);
      setSteps(calculationSteps);
    } catch (error) {
      setResult(null);
      setSteps(['Error in calculation']);
    }
  };

  const calculationTypes = [
    { id: 'log', name: 'Logarithm', description: 'log_b(x)' },
    { id: 'ln', name: 'Natural Log', description: 'ln(x)' },
    { id: 'antilog', name: 'Antilogarithm', description: 'b^x' },
    { id: 'change-base', name: 'Change Base', description: 'Convert between bases' },
  ];

  const commonBases = [
    { value: '2', name: 'Base 2 (Binary)' },
    { value: '10', name: 'Base 10 (Common)' },
    { value: '2.718281828', name: 'Base e (Natural)' },
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
        <span className="text-gray-900 font-medium">Logarithm Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Logarithm Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {calculationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setCalculationType(type.id as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === type.id
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{type.name}</div>
                <div className="text-sm opacity-75 font-mono">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {calculationType === 'antilog' ? 'Exponent' : 'Number'}
            </label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={calculationType === 'antilog' ? 'Enter exponent' : 'Enter number'}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
            />
          </div>

          {calculationType !== 'ln' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {calculationType === 'change-base' ? 'Original Base' : 'Base'}
              </label>
              <input
                type="number"
                value={base}
                onChange={(e) => setBase(e.target.value)}
                placeholder="Enter base"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {commonBases.map((commonBase) => (
                  <button
                    key={commonBase.value}
                    onClick={() => setBase(commonBase.value)}
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    {commonBase.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {calculationType === 'change-base' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Base</label>
              <input
                type="number"
                value={newBase}
                onChange={(e) => setNewBase(e.target.value)}
                placeholder="Enter new base"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>
          )}
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {result.toFixed(8)}
              </div>
              <div className="text-gray-600">
                {calculationType === 'log' && `log₍${base}₎(${number})`}
                {calculationType === 'ln' && `ln(${number})`}
                {calculationType === 'antilog' && `${base}^${number}`}
                {calculationType === 'change-base' && `log₍${newBase}₎(${number})`}
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Scientific Notation</div>
                <div className="text-lg font-mono text-gray-800">{result.toExponential(4)}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Rounded (6 decimals)</div>
                <div className="text-lg font-mono text-gray-800">{result.toFixed(6)}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Rounded (2 decimals)</div>
                <div className="text-lg font-mono text-gray-800">{result.toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Solution */}
        {steps.length > 0 && (
          <div className="bg-gray-50 rounded-2xl p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div className="text-gray-700 font-mono text-sm">{step}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Logarithm Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• log_b(xy) = log_b(x) + log_b(y)</li>
                <li>• log_b(x/y) = log_b(x) - log_b(y)</li>
                <li>• log_b(x^n) = n × log_b(x)</li>
                <li>• log_b(b) = 1</li>
                <li>• log_b(1) = 0</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Change of Base Formula</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• log_b(x) = ln(x) / ln(b)</li>
                <li>• log_b(x) = log_c(x) / log_c(b)</li>
                <li>• Common logarithm: log₁₀(x)</li>
                <li>• Natural logarithm: ln(x) = log_e(x)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogarithmCalculator;