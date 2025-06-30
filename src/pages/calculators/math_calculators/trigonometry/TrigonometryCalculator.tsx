import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Activity } from 'lucide-react';

const TrigonometryCalculator: React.FC = () => {
  const [angle, setAngle] = useState('');
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateTrigFunctions();
  }, [angle, angleUnit]);

  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;

  const calculateTrigFunctions = () => {
    const angleValue = parseFloat(angle);
    if (!angle || isNaN(angleValue)) {
      setResults(null);
      return;
    }

    const radians = angleUnit === 'degrees' ? toRadians(angleValue) : angleValue;
    const degrees = angleUnit === 'radians' ? toDegrees(angleValue) : angleValue;

    // Calculate primary trig functions
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const tan = Math.tan(radians);

    // Calculate reciprocal functions
    const csc = 1 / sin;
    const sec = 1 / cos;
    const cot = 1 / tan;

    // Calculate inverse functions
    const arcsin = Math.asin(Math.abs(sin) <= 1 ? sin : NaN);
    const arccos = Math.acos(Math.abs(cos) <= 1 ? cos : NaN);
    const arctan = Math.atan(tan);

    // Determine quadrant
    const normalizedAngle = ((degrees % 360) + 360) % 360;
    let quadrant: number;
    if (normalizedAngle >= 0 && normalizedAngle < 90) quadrant = 1;
    else if (normalizedAngle >= 90 && normalizedAngle < 180) quadrant = 2;
    else if (normalizedAngle >= 180 && normalizedAngle < 270) quadrant = 3;
    else quadrant = 4;

    // Reference angle
    let referenceAngle: number;
    if (quadrant === 1) referenceAngle = normalizedAngle;
    else if (quadrant === 2) referenceAngle = 180 - normalizedAngle;
    else if (quadrant === 3) referenceAngle = normalizedAngle - 180;
    else referenceAngle = 360 - normalizedAngle;

    setResults({
      angle: angleValue,
      angleUnit,
      radians: radians,
      degrees: degrees,
      quadrant,
      referenceAngle,
      primary: { sin, cos, tan },
      reciprocal: { csc, sec, cot },
      inverse: { arcsin, arccos, arctan },
      coordinates: { x: cos, y: sin }
    });
  };

  const formatValue = (value: number): string => {
    if (isNaN(value)) return 'undefined';
    if (!isFinite(value)) return value > 0 ? '+∞' : '-∞';
    return value.toFixed(6);
  };

  const formatAngle = (value: number, unit: 'degrees' | 'radians'): string => {
    if (isNaN(value)) return 'undefined';
    return unit === 'degrees' ? `${value.toFixed(2)}°` : `${value.toFixed(6)} rad`;
  };

  const specialAngles = [
    { degrees: 0, radians: 0, name: '0°' },
    { degrees: 30, radians: Math.PI / 6, name: '30°' },
    { degrees: 45, radians: Math.PI / 4, name: '45°' },
    { degrees: 60, radians: Math.PI / 3, name: '60°' },
    { degrees: 90, radians: Math.PI / 2, name: '90°' },
    { degrees: 120, radians: 2 * Math.PI / 3, name: '120°' },
    { degrees: 135, radians: 3 * Math.PI / 4, name: '135°' },
    { degrees: 150, radians: 5 * Math.PI / 6, name: '150°' },
    { degrees: 180, radians: Math.PI, name: '180°' },
    { degrees: 270, radians: 3 * Math.PI / 2, name: '270°' },
    { degrees: 360, radians: 2 * Math.PI, name: '360°' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">Math Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Trigonometry Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Activity className="w-8 h-8 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Trigonometry Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Angle</label>
            <input
              type="number"
              value={angle}
              onChange={(e) => setAngle(e.target.value)}
              placeholder="Enter angle"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select
              value={angleUnit}
              onChange={(e) => setAngleUnit(e.target.value as 'degrees' | 'radians')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            >
              <option value="degrees">Degrees</option>
              <option value="radians">Radians</option>
            </select>
          </div>
        </div>

        {/* Special Angles */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Common Angles</label>
          <div className="flex flex-wrap gap-2">
            {specialAngles.map((specialAngle, index) => (
              <button
                key={index}
                onClick={() => {
                  setAngle(angleUnit === 'degrees' ? specialAngle.degrees.toString() : specialAngle.radians.toString());
                }}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
              >
                {specialAngle.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Angle Information */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Angle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Degrees</div>
                  <div className="text-lg font-mono text-red-600">{formatAngle(results.degrees, 'degrees')}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Radians</div>
                  <div className="text-lg font-mono text-orange-600">{formatAngle(results.radians, 'radians')}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Quadrant</div>
                  <div className="text-lg font-bold text-blue-600">{results.quadrant}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Reference Angle</div>
                  <div className="text-lg font-mono text-green-600">{formatAngle(results.referenceAngle, 'degrees')}</div>
                </div>
              </div>
            </div>

            {/* Primary Trigonometric Functions */}
            <div className="bg-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">sin({results.angle}°)</div>
                  <div className="text-xl font-mono text-blue-600">{formatValue(results.primary.sin)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">cos({results.angle}°)</div>
                  <div className="text-xl font-mono text-green-600">{formatValue(results.primary.cos)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">tan({results.angle}°)</div>
                  <div className="text-xl font-mono text-purple-600">{formatValue(results.primary.tan)}</div>
                </div>
              </div>
            </div>

            {/* Reciprocal Functions */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Reciprocal Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">csc({results.angle}°)</div>
                  <div className="text-xl font-mono text-red-600">{formatValue(results.reciprocal.csc)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">sec({results.angle}°)</div>
                  <div className="text-xl font-mono text-orange-600">{formatValue(results.reciprocal.sec)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">cot({results.angle}°)</div>
                  <div className="text-xl font-mono text-indigo-600">{formatValue(results.reciprocal.cot)}</div>
                </div>
              </div>
            </div>

            {/* Unit Circle Coordinates */}
            <div className="bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Circle Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">x-coordinate (cos)</div>
                  <div className="text-xl font-mono text-blue-600">{formatValue(results.coordinates.x)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">y-coordinate (sin)</div>
                  <div className="text-xl font-mono text-green-600">{formatValue(results.coordinates.y)}</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-mono text-gray-700">
                  ({formatValue(results.coordinates.x)}, {formatValue(results.coordinates.y)})
                </div>
              </div>
            </div>

            {/* Inverse Functions */}
            <div className="bg-yellow-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Inverse Functions (in radians)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">arcsin({formatValue(results.primary.sin)})</div>
                  <div className="text-xl font-mono text-yellow-600">{formatValue(results.inverse.arcsin)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">arccos({formatValue(results.primary.cos)})</div>
                  <div className="text-xl font-mono text-amber-600">{formatValue(results.inverse.arccos)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">arctan({formatValue(results.primary.tan)})</div>
                  <div className="text-xl font-mono text-orange-600">{formatValue(results.inverse.arctan)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Trigonometric Functions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Primary Functions</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• sin(θ) = opposite / hypotenuse</li>
                <li>• cos(θ) = adjacent / hypotenuse</li>
                <li>• tan(θ) = opposite / adjacent</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Reciprocal Functions</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• csc(θ) = 1 / sin(θ)</li>
                <li>• sec(θ) = 1 / cos(θ)</li>
                <li>• cot(θ) = 1 / tan(θ)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrigonometryCalculator;