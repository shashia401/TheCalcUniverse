import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Box } from 'lucide-react';

const VolumeCalculator: React.FC = () => {
  const [shape, setShape] = useState('cube');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<number | null>(null);

  const shapes = {
    cube: { name: 'Cube', fields: ['side'] },
    rectangular: { name: 'Rectangular Prism', fields: ['length', 'width', 'height'] },
    sphere: { name: 'Sphere', fields: ['radius'] },
    cylinder: { name: 'Cylinder', fields: ['radius', 'height'] },
    cone: { name: 'Cone', fields: ['radius', 'height'] },
    pyramid: { name: 'Pyramid', fields: ['base', 'height'] },
    triangularPrism: { name: 'Triangular Prism', fields: ['base', 'triangleHeight', 'length'] },
    ellipsoid: { name: 'Ellipsoid', fields: ['radiusA', 'radiusB', 'radiusC'] },
  };

  useEffect(() => {
    calculateVolume();
  }, [shape, dimensions]);

  const calculateVolume = () => {
    const values = Object.values(dimensions).map(v => parseFloat(v)).filter(v => !isNaN(v));
    const requiredFields = shapes[shape as keyof typeof shapes].fields.length;
    
    if (values.length !== requiredFields) {
      setResult(null);
      return;
    }

    let volume: number = 0;

    switch (shape) {
      case 'cube':
        volume = Math.pow(values[0], 3);
        break;
      case 'rectangular':
        volume = values[0] * values[1] * values[2];
        break;
      case 'sphere':
        volume = (4/3) * Math.PI * Math.pow(values[0], 3);
        break;
      case 'cylinder':
        volume = Math.PI * Math.pow(values[0], 2) * values[1];
        break;
      case 'cone':
        volume = (1/3) * Math.PI * Math.pow(values[0], 2) * values[1];
        break;
      case 'pyramid':
        volume = (1/3) * Math.pow(values[0], 2) * values[1];
        break;
      case 'triangularPrism':
        volume = 0.5 * values[0] * values[1] * values[2];
        break;
      case 'ellipsoid':
        volume = (4/3) * Math.PI * values[0] * values[1] * values[2];
        break;
    }

    setResult(volume);
  };

  const updateDimension = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      side: 'Side Length',
      length: 'Length',
      width: 'Width',
      height: 'Height',
      radius: 'Radius',
      base: 'Base Side',
      triangleHeight: 'Triangle Height',
      radiusA: 'Radius A',
      radiusB: 'Radius B',
      radiusC: 'Radius C',
    };
    return labels[field] || field;
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
        <span className="text-gray-900 font-medium">Volume Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Box className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Volume Calculator</h1>
        </div>

        {/* Shape Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select 3D Shape</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(shapes).map(([key, shapeInfo]) => (
              <button
                key={key}
                onClick={() => {
                  setShape(key);
                  setDimensions({});
                }}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  shape === key
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {shapeInfo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {shapes[shape as keyof typeof shapes].fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getFieldLabel(field)}
              </label>
              <input
                type="number"
                value={dimensions[field] || ''}
                onChange={(e) => updateDimension(field, e.target.value)}
                placeholder="Enter value"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
              />
            </div>
          ))}
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Volume Result</h3>
            <div className="text-4xl font-bold text-purple-600 mb-2">
              {result.toFixed(4)}
            </div>
            <div className="text-gray-600">cubic units</div>
            
            {/* Additional conversions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Cubic Meters</div>
                <div className="text-lg font-semibold text-gray-800">{result.toFixed(4)} m³</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Liters</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 1000).toFixed(2)} L</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Cubic Feet</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 35.314).toFixed(4)} ft³</div>
              </div>
            </div>
          </div>
        )}

        {/* Formula Display */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Formula</h3>
          <div className="font-mono text-gray-700">
            {shape === 'cube' && 'Volume = side³'}
            {shape === 'rectangular' && 'Volume = length × width × height'}
            {shape === 'sphere' && 'Volume = (4/3) × π × radius³'}
            {shape === 'cylinder' && 'Volume = π × radius² × height'}
            {shape === 'cone' && 'Volume = (1/3) × π × radius² × height'}
            {shape === 'pyramid' && 'Volume = (1/3) × base² × height'}
            {shape === 'triangularPrism' && 'Volume = (1/2) × base × triangle height × length'}
            {shape === 'ellipsoid' && 'Volume = (4/3) × π × radius A × radius B × radius C'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolumeCalculator;