import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Shuffle, RefreshCw } from 'lucide-react';

const RandomNumberGenerator: React.FC = () => {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [allowDuplicates, setAllowDuplicates] = useState(true);
  const [generatedNumbers, setGeneratedNumbers] = useState<number[]>([]);
  const [generationType, setGenerationType] = useState<'integer' | 'decimal'>('integer');
  const [decimalPlaces, setDecimalPlaces] = useState('2');

  const generateNumbers = () => {
    const minVal = parseFloat(min);
    const maxVal = parseFloat(max);
    const countVal = parseInt(count);

    if (minVal >= maxVal || countVal <= 0) return;

    const numbers: number[] = [];
    const usedNumbers = new Set<number>();

    for (let i = 0; i < countVal; i++) {
      let randomNum: number;
      
      if (generationType === 'integer') {
        do {
          randomNum = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
        } while (!allowDuplicates && usedNumbers.has(randomNum) && usedNumbers.size < (maxVal - minVal + 1));
      } else {
        do {
          randomNum = Math.random() * (maxVal - minVal) + minVal;
          randomNum = parseFloat(randomNum.toFixed(parseInt(decimalPlaces)));
        } while (!allowDuplicates && usedNumbers.has(randomNum));
      }

      if (allowDuplicates || !usedNumbers.has(randomNum)) {
        numbers.push(randomNum);
        usedNumbers.add(randomNum);
      }
    }

    setGeneratedNumbers(numbers);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedNumbers.join(', '));
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
        <span className="text-gray-900 font-medium">Random Number Generator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Shuffle className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Random Number Generator</h1>
        </div>

        {/* Generation Type */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Number Type</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setGenerationType('integer')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                generationType === 'integer'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Integer
            </button>
            <button
              onClick={() => setGenerationType('decimal')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                generationType === 'decimal'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Decimal
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Value</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Value</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Count</label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="1000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>

          {generationType === 'decimal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Decimal Places</label>
              <input
                type="number"
                value={decimalPlaces}
                onChange={(e) => setDecimalPlaces(e.target.value)}
                min="1"
                max="10"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={allowDuplicates}
              onChange={(e) => setAllowDuplicates(e.target.checked)}
              className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700">Allow duplicate numbers</span>
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateNumbers}
          className="w-full md:w-auto flex items-center justify-center space-x-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-lg font-semibold mb-6"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Generate Numbers</span>
        </button>

        {/* Results */}
        {generatedNumbers.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generated Numbers</h3>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Copy to Clipboard
              </button>
            </div>
            
            <div className="bg-white rounded-lg p-4 mb-4">
              <div className="flex flex-wrap gap-2">
                {generatedNumbers.map((num, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-mono text-lg"
                  >
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Count</div>
                <div className="text-xl font-bold text-purple-600">{generatedNumbers.length}</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Sum</div>
                <div className="text-xl font-bold text-blue-600">
                  {generatedNumbers.reduce((sum, num) => sum + num, 0).toFixed(2)}
                </div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Average</div>
                <div className="text-xl font-bold text-green-600">
                  {(generatedNumbers.reduce((sum, num) => sum + num, 0) / generatedNumbers.length).toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RandomNumberGenerator;