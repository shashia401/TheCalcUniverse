import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Square } from 'lucide-react';

const AreaCalculator: React.FC = () => {
  const [shape, setShape] = useState('rectangle');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<number | null>(null);

  const shapes = {
    rectangle: { name: 'Rectangle', fields: ['length', 'width'] },
    square: { name: 'Square', fields: ['side'] },
    circle: { name: 'Circle', fields: ['radius'] },
    triangle: { name: 'Triangle', fields: ['base', 'height'] },
    parallelogram: { name: 'Parallelogram', fields: ['base', 'height'] },
    trapezoid: { name: 'Trapezoid', fields: ['base1', 'base2', 'height'] },
    ellipse: { name: 'Ellipse', fields: ['majorAxis', 'minorAxis'] },
    rhombus: { name: 'Rhombus', fields: ['diagonal1', 'diagonal2'] },
  };

  useEffect(() => {
    calculateArea();
  }, [shape, dimensions]);

  const calculateArea = () => {
    const values = Object.values(dimensions).map(v => parseFloat(v)).filter(v => !isNaN(v));
    const requiredFields = shapes[shape as keyof typeof shapes].fields.length;
    
    if (values.length !== requiredFields) {
      setResult(null);
      return;
    }

    let area: number = 0;

    switch (shape) {
      case 'rectangle':
        area = values[0] * values[1];
        break;
      case 'square':
        area = values[0] * values[0];
        break;
      case 'circle':
        area = Math.PI * values[0] * values[0];
        break;
      case 'triangle':
        area = 0.5 * values[0] * values[1];
        break;
      case 'parallelogram':
        area = values[0] * values[1];
        break;
      case 'trapezoid':
        area = 0.5 * (values[0] + values[1]) * values[2];
        break;
      case 'ellipse':
        area = Math.PI * values[0] * values[1];
        break;
      case 'rhombus':
        area = 0.5 * values[0] * values[1];
        break;
    }

    setResult(area);
  };

  const updateDimension = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      length: 'Length',
      width: 'Width',
      side: 'Side Length',
      radius: 'Radius',
      base: 'Base',
      height: 'Height',
      base1: 'Base 1',
      base2: 'Base 2',
      majorAxis: 'Major Axis',
      minorAxis: 'Minor Axis',
      diagonal1: 'Diagonal 1',
      diagonal2: 'Diagonal 2',
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
        <span className="text-gray-900 font-medium">Area Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Square className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Area Calculator</h1>
        </div>

        {/* Shape Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Shape</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(shapes).map(([key, shapeInfo]) => (
              <button
                key={key}
                onClick={() => {
                  setShape(key);
                  setDimensions({});
                }}
                className={`p-3 rounded-lg border-2 transition-all ${
                  shape === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          ))}
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Area Result</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {result.toFixed(4)}
            </div>
            <div className="text-gray-600">square units</div>
            
            {/* Additional conversions for common units */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Square Meters</div>
                <div className="text-lg font-semibold text-gray-800">{result.toFixed(4)} m²</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Square Feet</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 10.764).toFixed(4)} ft²</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Square Inches</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 1550).toFixed(2)} in²</div>
              </div>
            </div>
          </div>
        )}

        {/* Formula Display */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Formula</h3>
          <div className="font-mono text-gray-700">
            {shape === 'rectangle' && 'Area = length × width'}
            {shape === 'square' && 'Area = side²'}
            {shape === 'circle' && 'Area = π × radius²'}
            {shape === 'triangle' && 'Area = ½ × base × height'}
            {shape === 'parallelogram' && 'Area = base × height'}
            {shape === 'trapezoid' && 'Area = ½ × (base₁ + base₂) × height'}
            {shape === 'ellipse' && 'Area = π × major axis × minor axis'}
            {shape === 'rhombus' && 'Area = ½ × diagonal₁ × diagonal₂'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AreaCalculator;