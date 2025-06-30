import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Ruler } from 'lucide-react';

const DistanceCalculator: React.FC = () => {
  const [x1, setX1] = useState('');
  const [y1, setY1] = useState('');
  const [x2, setX2] = useState('');
  const [y2, setY2] = useState('');
  const [z1, setZ1] = useState('');
  const [z2, setZ2] = useState('');
  const [dimension, setDimension] = useState<'2d' | '3d'>('2d');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateDistance();
  }, [x1, y1, x2, y2, z1, z2, dimension]);

  const calculateDistance = () => {
    if (dimension === '2d') {
      const point1X = parseFloat(x1);
      const point1Y = parseFloat(y1);
      const point2X = parseFloat(x2);
      const point2Y = parseFloat(y2);

      if (isNaN(point1X) || isNaN(point1Y) || isNaN(point2X) || isNaN(point2Y)) {
        setResult(null);
        return;
      }

      // Calculate distance using distance formula
      const deltaX = point2X - point1X;
      const deltaY = point2Y - point1Y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Calculate midpoint
      const midpointX = (point1X + point2X) / 2;
      const midpointY = (point1Y + point2Y) / 2;
      
      // Calculate slope
      let slope: number | string;
      if (point1X === point2X) {
        slope = 'Undefined';
      } else {
        slope = (point2Y - point1Y) / (point2X - point1X);
      }
      
      // Calculate angle with x-axis
      let angle: number;
      if (typeof slope === 'number') {
        angle = Math.atan(slope) * (180 / Math.PI);
      } else {
        angle = 90; // Vertical line
      }
      
      // Generate steps
      const steps = [
        `Given points: (${point1X}, ${point1Y}) and (${point2X}, ${point2Y})`,
        `Using the distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]`,
        `d = √[(${point2X} - ${point1X})² + (${point2Y} - ${point1Y})²]`,
        `d = √[${deltaX}² + ${deltaY}²]`,
        `d = √[${deltaX * deltaX} + ${deltaY * deltaY}]`,
        `d = √${deltaX * deltaX + deltaY * deltaY}`,
        `d = ${distance.toFixed(6)}`
      ];
      
      setResult({
        distance,
        midpoint: { x: midpointX, y: midpointY },
        slope,
        angle,
        steps,
        dimension: '2d'
      });
    } else {
      // 3D distance calculation
      const point1X = parseFloat(x1);
      const point1Y = parseFloat(y1);
      const point1Z = parseFloat(z1);
      const point2X = parseFloat(x2);
      const point2Y = parseFloat(y2);
      const point2Z = parseFloat(z2);

      if (isNaN(point1X) || isNaN(point1Y) || isNaN(point1Z) || 
          isNaN(point2X) || isNaN(point2Y) || isNaN(point2Z)) {
        setResult(null);
        return;
      }

      // Calculate distance using 3D distance formula
      const deltaX = point2X - point1X;
      const deltaY = point2Y - point1Y;
      const deltaZ = point2Z - point1Z;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ);
      
      // Calculate midpoint
      const midpointX = (point1X + point2X) / 2;
      const midpointY = (point1Y + point2Y) / 2;
      const midpointZ = (point1Z + point2Z) / 2;
      
      // Generate steps
      const steps = [
        `Given points: (${point1X}, ${point1Y}, ${point1Z}) and (${point2X}, ${point2Y}, ${point2Z})`,
        `Using the 3D distance formula: d = √[(x₂ - x₁)² + (y₂ - y₁)² + (z₂ - z₁)²]`,
        `d = √[(${point2X} - ${point1X})² + (${point2Y} - ${point1Y})² + (${point2Z} - ${point1Z})²]`,
        `d = √[${deltaX}² + ${deltaY}² + ${deltaZ}²]`,
        `d = √[${deltaX * deltaX} + ${deltaY * deltaY} + ${deltaZ * deltaZ}]`,
        `d = √${deltaX * deltaX + deltaY * deltaY + deltaZ * deltaZ}`,
        `d = ${distance.toFixed(6)}`
      ];
      
      setResult({
        distance,
        midpoint: { x: midpointX, y: midpointY, z: midpointZ },
        steps,
        dimension: '3d'
      });
    }
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
        <span className="text-gray-900 font-medium">Distance Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Ruler className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Distance Calculator</h1>
        </div>

        {/* Dimension Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Dimension</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setDimension('2d')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                dimension === '2d'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              2D (x, y)
            </button>
            <button
              onClick={() => setDimension('3d')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                dimension === '3d'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              3D (x, y, z)
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Point 1</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">x₁</label>
                <input
                  type="number"
                  value={x1}
                  onChange={(e) => setX1(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">y₁</label>
                <input
                  type="number"
                  value={y1}
                  onChange={(e) => setY1(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {dimension === '3d' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">z₁</label>
                  <input
                    type="number"
                    value={z1}
                    onChange={(e) => setZ1(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Point 2</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">x₂</label>
                <input
                  type="number"
                  value={x2}
                  onChange={(e) => setX2(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">y₂</label>
                <input
                  type="number"
                  value={y2}
                  onChange={(e) => setY2(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              {dimension === '3d' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">z₂</label>
                  <input
                    type="number"
                    value={z2}
                    onChange={(e) => setZ2(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Distance Results</h3>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {result.distance.toFixed(6)}
                </div>
                <div className="text-gray-600">units</div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Midpoint</div>
                  <div className="text-lg font-mono text-indigo-600">
                    {dimension === '2d' 
                      ? `(${result.midpoint.x.toFixed(4)}, ${result.midpoint.y.toFixed(4)})` 
                      : `(${result.midpoint.x.toFixed(4)}, ${result.midpoint.y.toFixed(4)}, ${result.midpoint.z.toFixed(4)})`
                    }
                  </div>
                </div>
                
                {dimension === '2d' && (
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">Slope</div>
                    <div className="text-lg font-mono text-indigo-600">
                      {typeof result.slope === 'number' ? result.slope.toFixed(4) : result.slope}
                    </div>
                    {typeof result.slope === 'number' && (
                      <div className="text-xs text-gray-500 mt-1">
                        Angle with x-axis: {result.angle.toFixed(2)}°
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
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

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Distance Formula</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">2D Distance</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Formula: d = √[(x₂ - x₁)² + (y₂ - y₁)²]</li>
                <li>• Based on the Pythagorean theorem</li>
                <li>• Measures straight-line distance</li>
                <li>• Also called Euclidean distance</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">3D Distance</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Formula: d = √[(x₂ - x₁)² + (y₂ - y₁)² + (z₂ - z₁)²]</li>
                <li>• Extension of 2D distance to three dimensions</li>
                <li>• Used in 3D modeling and spatial analysis</li>
                <li>• Measures shortest path in 3D space</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Midpoint Formula</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• 2D: ((x₁ + x₂)/2, (y₁ + y₂)/2)</li>
                <li>• 3D: ((x₁ + x₂)/2, (y₁ + y₂)/2, (z₁ + z₂)/2)</li>
                <li>• Finds the point exactly halfway between two points</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Navigation and GPS systems</li>
                <li>• Computer graphics and game development</li>
                <li>• Physics simulations</li>
                <li>• Geographic information systems (GIS)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceCalculator;