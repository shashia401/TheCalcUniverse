import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';

const InverseTrigCalculator: React.FC = () => {
  const [value, setValue] = useState('');
  const [function_, setFunction] = useState<'arcsin' | 'arccos' | 'arctan' | 'arccsc' | 'arcsec' | 'arccot'>('arcsin');
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateInverseTrig();
  }, [value, function_, angleUnit]);

  const toDegrees = (radians: number) => radians * 180 / Math.PI;

  const calculateInverseTrig = () => {
    const inputValue = parseFloat(value);
    if (!value || isNaN(inputValue)) {
      setResult(null);
      return;
    }

    try {
      let radians: number;
      let domain: [number, number] = [0, 0];
      let range: [number, number] = [0, 0];
      let isInDomain = true;
      let steps: string[] = [];

      switch (function_) {
        case 'arcsin':
          domain = [-1, 1];
          range = [-Math.PI/2, Math.PI/2];
          isInDomain = inputValue >= -1 && inputValue <= 1;
          
          if (isInDomain) {
            radians = Math.asin(inputValue);
            steps = [
              `arcsin(${inputValue}) calculates the angle whose sine equals ${inputValue}`,
              `Domain of arcsin is [-1, 1]`,
              `Range of arcsin is [-π/2, π/2] or [-90°, 90°]`,
              `arcsin(${inputValue}) = ${radians.toFixed(6)} radians`
            ];
          }
          break;
          
        case 'arccos':
          domain = [-1, 1];
          range = [0, Math.PI];
          isInDomain = inputValue >= -1 && inputValue <= 1;
          
          if (isInDomain) {
            radians = Math.acos(inputValue);
            steps = [
              `arccos(${inputValue}) calculates the angle whose cosine equals ${inputValue}`,
              `Domain of arccos is [-1, 1]`,
              `Range of arccos is [0, π] or [0°, 180°]`,
              `arccos(${inputValue}) = ${radians.toFixed(6)} radians`
            ];
          }
          break;
          
        case 'arctan':
          domain = [-Infinity, Infinity];
          range = [-Math.PI/2, Math.PI/2];
          radians = Math.atan(inputValue);
          steps = [
            `arctan(${inputValue}) calculates the angle whose tangent equals ${inputValue}`,
            `Domain of arctan is all real numbers`,
            `Range of arctan is (-π/2, π/2) or (-90°, 90°)`,
            `arctan(${inputValue}) = ${radians.toFixed(6)} radians`
          ];
          break;
          
        case 'arccsc':
          domain = [-Infinity, -1].concat([1, Infinity]);
          isInDomain = Math.abs(inputValue) >= 1;
          
          if (isInDomain) {
            radians = Math.asin(1 / inputValue);
            steps = [
              `arccsc(${inputValue}) calculates the angle whose cosecant equals ${inputValue}`,
              `Domain of arccsc is (-∞, -1] ∪ [1, ∞)`,
              `Range of arccsc is [-π/2, 0) ∪ (0, π/2] or [-90°, 0°) ∪ (0°, 90°]`,
              `arccsc(${inputValue}) = arcsin(1/${inputValue}) = ${radians.toFixed(6)} radians`
            ];
          }
          break;
          
        case 'arcsec':
          domain = [-Infinity, -1].concat([1, Infinity]);
          isInDomain = Math.abs(inputValue) >= 1;
          
          if (isInDomain) {
            radians = Math.acos(1 / inputValue);
            steps = [
              `arcsec(${inputValue}) calculates the angle whose secant equals ${inputValue}`,
              `Domain of arcsec is (-∞, -1] ∪ [1, ∞)`,
              `Range of arcsec is [0, π/2) ∪ (π/2, π] or [0°, 90°) ∪ (90°, 180°]`,
              `arcsec(${inputValue}) = arccos(1/${inputValue}) = ${radians.toFixed(6)} radians`
            ];
          }
          break;
          
        case 'arccot':
          domain = [-Infinity, Infinity];
          range = [0, Math.PI];
          radians = Math.atan(1 / inputValue);
          if (radians < 0) radians += Math.PI;
          steps = [
            `arccot(${inputValue}) calculates the angle whose cotangent equals ${inputValue}`,
            `Domain of arccot is all real numbers except 0`,
            `Range of arccot is (0, π) or (0°, 180°)`,
            `arccot(${inputValue}) = arctan(1/${inputValue}) = ${radians.toFixed(6)} radians`
          ];
          break;
          
        default:
          return;
      }

      if (!isInDomain) {
        setResult({ error: `Value ${inputValue} is outside the domain of ${function_}` });
        return;
      }

      const degrees = toDegrees(radians);
      
      if (angleUnit === 'degrees') {
        steps.push(`Converting to degrees: ${radians.toFixed(6)} × (180/π) = ${degrees.toFixed(6)}°`);
      }

      // Calculate exact value if possible
      const exactValue = getExactValue(inputValue, function_);

      setResult({
        value: inputValue,
        function: function_,
        radians,
        degrees,
        angleUnit,
        steps,
        exactValue
      });
    } catch (error) {
      setResult({ error: 'Error in calculation' });
    }
  };

  const getExactValue = (value: number, func: string): string | null => {
    // Common exact values for inverse trig functions
    const exactValues: Record<string, Record<number, string>> = {
      arcsin: {
        0: '0',
        0.5: 'π/6 (30°)',
        [Math.sqrt(2)/2]: 'π/4 (45°)',
        [Math.sqrt(3)/2]: 'π/3 (60°)',
        1: 'π/2 (90°)',
        [-0.5]: '-π/6 (-30°)',
        [-Math.sqrt(2)/2]: '-π/4 (-45°)',
        [-Math.sqrt(3)/2]: '-π/3 (-60°)',
        [-1]: '-π/2 (-90°)'
      },
      arccos: {
        1: '0',
        [Math.sqrt(3)/2]: 'π/6 (30°)',
        [Math.sqrt(2)/2]: 'π/4 (45°)',
        0.5: 'π/3 (60°)',
        0: 'π/2 (90°)',
        [-0.5]: '2π/3 (120°)',
        [-Math.sqrt(2)/2]: '3π/4 (135°)',
        [-Math.sqrt(3)/2]: '5π/6 (150°)',
        [-1]: 'π (180°)'
      },
      arctan: {
        0: '0',
        [1/Math.sqrt(3)]: 'π/6 (30°)',
        1: 'π/4 (45°)',
        [Math.sqrt(3)]: 'π/3 (60°)',
        [-1/Math.sqrt(3)]: '-π/6 (-30°)',
        [-1]: '-π/4 (-45°)',
        [-Math.sqrt(3)]: '-π/3 (-60°)'
      }
    };

    // Check for exact values with a small tolerance
    const tolerance = 1e-10;
    const exactValueMap = exactValues[func];
    
    if (exactValueMap) {
      for (const [exactValue, representation] of Object.entries(exactValueMap)) {
        if (Math.abs(parseFloat(exactValue) - value) < tolerance) {
          return representation;
        }
      }
    }

    return null;
  };

  const formatValue = (value: number): string => {
    if (isNaN(value)) return 'undefined';
    if (!isFinite(value)) return value > 0 ? '+∞' : '-∞';
    return value.toFixed(6);
  };

  const commonValues = [
    { value: '0', label: '0' },
    { value: '0.5', label: '0.5' },
    { value: '0.7071', label: '√2/2' },
    { value: '0.866', label: '√3/2' },
    { value: '1', label: '1' },
    { value: '-0.5', label: '-0.5' },
    { value: '-0.7071', label: '-√2/2' },
    { value: '-0.866', label: '-√3/2' },
    { value: '-1', label: '-1' },
    { value: '2', label: '2' },
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
        <span className="text-gray-900 font-medium">Inverse Trigonometric Functions Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <ArrowLeft className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Inverse Trigonometric Functions</h1>
        </div>

        {/* Function Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Function</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { id: 'arcsin', name: 'arcsin', symbol: 'sin⁻¹' },
              { id: 'arccos', name: 'arccos', symbol: 'cos⁻¹' },
              { id: 'arctan', name: 'arctan', symbol: 'tan⁻¹' },
              { id: 'arccsc', name: 'arccsc', symbol: 'csc⁻¹' },
              { id: 'arcsec', name: 'arcsec', symbol: 'sec⁻¹' },
              { id: 'arccot', name: 'arccot', symbol: 'cot⁻¹' },
            ].map((func) => (
              <button
                key={func.id}
                onClick={() => setFunction(func.id as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  function_ === func.id
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-lg">{func.symbol}</div>
                <div className="text-xs">{func.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Value</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Enter value for ${function_}`}
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {commonValues.map((val, index) => (
                <button
                  key={index}
                  onClick={() => setValue(val.value)}
                  className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                >
                  {val.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Angle Unit</label>
            <select
              value={angleUnit}
              onChange={(e) => setAngleUnit(e.target.value as 'degrees' | 'radians')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            >
              <option value="degrees">Degrees</option>
              <option value="radians">Radians</option>
            </select>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Result</h3>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {angleUnit === 'degrees' ? `${result.degrees.toFixed(4)}°` : `${result.radians.toFixed(6)} rad`}
              </div>
              <div className="text-lg text-gray-600">
                {function_}({result.value}) = {angleUnit === 'degrees' ? `${result.degrees.toFixed(4)}°` : `${result.radians.toFixed(6)} rad`}
              </div>
              {result.exactValue && (
                <div className="mt-2 text-sm bg-purple-100 text-purple-800 px-4 py-2 rounded-full inline-block">
                  Exact value: {result.exactValue}
                </div>
              )}
            </div>

            {/* Alternative Representation */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Representation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">In Degrees</div>
                  <div className="text-xl font-mono text-blue-600">{result.degrees.toFixed(6)}°</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">In Radians</div>
                  <div className="text-xl font-mono text-indigo-600">{result.radians.toFixed(6)}</div>
                </div>
              </div>
            </div>

            {/* Calculation Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Steps</h3>
              <div className="space-y-2">
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
          </div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Inverse Trigonometric Functions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Domains and Ranges</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• arcsin(x): Domain [-1, 1], Range [-π/2, π/2]</li>
                <li>• arccos(x): Domain [-1, 1], Range [0, π]</li>
                <li>• arctan(x): Domain ℝ, Range (-π/2, π/2)</li>
                <li>• arccsc(x): Domain (-∞, -1] ∪ [1, ∞), Range [-π/2, 0) ∪ (0, π/2]</li>
                <li>• arcsec(x): Domain (-∞, -1] ∪ [1, ∞), Range [0, π/2) ∪ (π/2, π]</li>
                <li>• arccot(x): Domain ℝ, Range (0, π)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Relationships</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• arccsc(x) = arcsin(1/x)</li>
                <li>• arcsec(x) = arccos(1/x)</li>
                <li>• arccot(x) = arctan(1/x)</li>
                <li>• arcsin(x) + arccos(x) = π/2</li>
                <li>• arctan(x) + arccot(x) = π/2</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InverseTrigCalculator;