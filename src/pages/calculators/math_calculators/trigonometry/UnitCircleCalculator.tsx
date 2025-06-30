import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Circle } from 'lucide-react';

const UnitCircleCalculator: React.FC = () => {
  const [angle, setAngle] = useState('0');
  const [angleUnit, setAngleUnit] = useState<'degrees' | 'radians'>('degrees');
  const [results, setResults] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    calculateUnitCircle();
  }, [angle, angleUnit]);

  useEffect(() => {
    if (results) {
      drawUnitCircle();
    }
  }, [results]);

  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;

  const calculateUnitCircle = () => {
    const angleValue = parseFloat(angle);
    if (isNaN(angleValue)) {
      setResults(null);
      return;
    }

    const radians = angleUnit === 'degrees' ? toRadians(angleValue) : angleValue;
    const degrees = angleUnit === 'radians' ? toDegrees(angleValue) : angleValue;

    // Normalize angle to [0, 2π) or [0, 360°)
    const normalizedRadians = ((radians % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const normalizedDegrees = ((degrees % 360) + 360) % 360;

    // Calculate coordinates
    const x = Math.cos(radians);
    const y = Math.sin(radians);

    // Determine quadrant
    let quadrant: number;
    if (normalizedDegrees >= 0 && normalizedDegrees < 90) quadrant = 1;
    else if (normalizedDegrees >= 90 && normalizedDegrees < 180) quadrant = 2;
    else if (normalizedDegrees >= 180 && normalizedDegrees < 270) quadrant = 3;
    else quadrant = 4;

    // Reference angle
    let referenceAngle: number;
    if (quadrant === 1) referenceAngle = normalizedDegrees;
    else if (quadrant === 2) referenceAngle = 180 - normalizedDegrees;
    else if (quadrant === 3) referenceAngle = normalizedDegrees - 180;
    else referenceAngle = 360 - normalizedDegrees;

    // Calculate trig functions
    const sin = Math.sin(radians);
    const cos = Math.cos(radians);
    const tan = Math.tan(radians);
    const csc = 1 / sin;
    const sec = 1 / cos;
    const cot = 1 / tan;

    setResults({
      angle: angleValue,
      angleUnit,
      radians: radians,
      degrees: degrees,
      normalizedRadians,
      normalizedDegrees,
      coordinates: { x, y },
      quadrant,
      referenceAngle,
      trigFunctions: { sin, cos, tan, csc, sec, cot }
    });
  };

  const drawUnitCircle = () => {
    const canvas = canvasRef.current;
    if (!canvas || !results) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw coordinate axes
    ctx.beginPath();
    ctx.strokeStyle = '#CBD5E0';
    ctx.lineWidth = 1;
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw unit circle
    ctx.beginPath();
    ctx.strokeStyle = '#4A5568';
    ctx.lineWidth = 2;
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();

    // Draw angle
    const angle = results.normalizedRadians;
    const x = centerX + radius * Math.cos(angle);
    const y = centerY - radius * Math.sin(angle);

    // Draw angle arc
    ctx.beginPath();
    ctx.strokeStyle = '#3182CE';
    ctx.lineWidth = 2;
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius / 4, 0, -angle, angle > 0);
    ctx.stroke();

    // Draw radius line
    ctx.beginPath();
    ctx.strokeStyle = '#E53E3E';
    ctx.lineWidth = 2;
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(x, y);
    ctx.stroke();

    // Draw point on circle
    ctx.beginPath();
    ctx.fillStyle = '#38A169';
    ctx.arc(x, y, 6, 0, 2 * Math.PI);
    ctx.fill();

    // Draw coordinates
    ctx.beginPath();
    ctx.strokeStyle = '#718096';
    ctx.setLineDash([5, 5]);
    ctx.moveTo(x, centerY);
    ctx.lineTo(x, y);
    ctx.moveTo(centerX, y);
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label coordinates
    ctx.fillStyle = '#2D3748';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`(${results.coordinates.x.toFixed(2)}, ${results.coordinates.y.toFixed(2)})`, x, y - 15);

    // Label quadrant
    ctx.font = '16px Arial';
    ctx.fillText(`Quadrant ${results.quadrant}`, centerX + radius * 0.7 * (results.quadrant === 1 || results.quadrant === 4 ? 1 : -1), 
                                               centerY + radius * 0.7 * (results.quadrant === 3 || results.quadrant === 4 ? 1 : -1));
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
    { degrees: 210, radians: 7 * Math.PI / 6, name: '210°' },
    { degrees: 225, radians: 5 * Math.PI / 4, name: '225°' },
    { degrees: 240, radians: 4 * Math.PI / 3, name: '240°' },
    { degrees: 270, radians: 3 * Math.PI / 2, name: '270°' },
    { degrees: 300, radians: 5 * Math.PI / 3, name: '300°' },
    { degrees: 315, radians: 7 * Math.PI / 4, name: '315°' },
    { degrees: 330, radians: 11 * Math.PI / 6, name: '330°' },
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
        <span className="text-gray-900 font-medium">Unit Circle Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Circle className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Unit Circle Calculator</h1>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
            <select
              value={angleUnit}
              onChange={(e) => setAngleUnit(e.target.value as 'degrees' | 'radians')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
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

        {/* Unit Circle Visualization */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Circle Visualization</h3>
          <div className="bg-white border border-gray-200 rounded-lg p-4 flex justify-center">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={400} 
              className="max-w-full"
            />
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="space-y-8">
            {/* Angle Information */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Angle Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Degrees</div>
                  <div className="text-lg font-mono text-blue-600">{formatAngle(results.degrees, 'degrees')}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Radians</div>
                  <div className="text-lg font-mono text-indigo-600">{formatAngle(results.radians, 'radians')}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Quadrant</div>
                  <div className="text-lg font-bold text-purple-600">{results.quadrant}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Reference Angle</div>
                  <div className="text-lg font-mono text-green-600">{formatAngle(results.referenceAngle, 'degrees')}</div>
                </div>
              </div>
            </div>

            {/* Coordinates */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Circle Coordinates</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">x-coordinate (cos θ)</div>
                  <div className="text-xl font-mono text-green-600">{formatValue(results.coordinates.x)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">y-coordinate (sin θ)</div>
                  <div className="text-xl font-mono text-teal-600">{formatValue(results.coordinates.y)}</div>
                </div>
              </div>
              <div className="mt-4 text-center">
                <div className="text-lg font-mono text-gray-700">
                  Point on Unit Circle: ({formatValue(results.coordinates.x)}, {formatValue(results.coordinates.y)})
                </div>
              </div>
            </div>

            {/* Trigonometric Functions */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Trigonometric Functions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">sin(θ)</div>
                  <div className="text-lg font-mono text-purple-600">{formatValue(results.trigFunctions.sin)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">cos(θ)</div>
                  <div className="text-lg font-mono text-blue-600">{formatValue(results.trigFunctions.cos)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">tan(θ)</div>
                  <div className="text-lg font-mono text-green-600">{formatValue(results.trigFunctions.tan)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">csc(θ)</div>
                  <div className="text-lg font-mono text-red-600">{formatValue(results.trigFunctions.csc)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">sec(θ)</div>
                  <div className="text-lg font-mono text-orange-600">{formatValue(results.trigFunctions.sec)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">cot(θ)</div>
                  <div className="text-lg font-mono text-pink-600">{formatValue(results.trigFunctions.cot)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Unit Circle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Circle with radius 1 centered at origin (0,0)</li>
                <li>• x-coordinate = cos(θ)</li>
                <li>• y-coordinate = sin(θ)</li>
                <li>• Any point (x,y) on unit circle: x² + y² = 1</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Visualizing trigonometric functions</li>
                <li>• Finding exact values at special angles</li>
                <li>• Understanding periodic behavior</li>
                <li>• Foundation for trigonometric identities</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitCircleCalculator;