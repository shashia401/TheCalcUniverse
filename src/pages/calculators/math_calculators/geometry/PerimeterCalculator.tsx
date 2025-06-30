import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Hexagon } from 'lucide-react';

const PerimeterCalculator: React.FC = () => {
  const [shape, setShape] = useState('rectangle');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<number | null>(null);

  const shapes = {
    rectangle: { name: 'Rectangle', fields: ['length', 'width'] },
    square: { name: 'Square', fields: ['side'] },
    circle: { name: 'Circle (Circumference)', fields: ['radius'] },
    triangle: { name: 'Triangle', fields: ['side1', 'side2', 'side3'] },
    pentagon: { name: 'Regular Pentagon', fields: ['side'] },
    hexagon: { name: 'Regular Hexagon', fields: ['side'] },
    octagon: { name: 'Regular Octagon', fields: ['side'] },
    parallelogram: { name: 'Parallelogram', fields: ['side1', 'side2'] },
    rhombus: { name: 'Rhombus', fields: ['side'] },
    trapezoid: { name: 'Trapezoid', fields: ['side1', 'side2', 'side3', 'side4'] },
  };

  useEffect(() => {
    calculatePerimeter();
  }, [shape, dimensions]);

  const calculatePerimeter = () => {
    const values = Object.values(dimensions).map(v => parseFloat(v)).filter(v => !isNaN(v));
    const requiredFields = shapes[shape as keyof typeof shapes].fields.length;
    
    if (values.length !== requiredFields) {
      setResult(null);
      return;
    }

    let perimeter: number = 0;

    switch (shape) {
      case 'rectangle':
        perimeter = 2 * (values[0] + values[1]);
        break;
      case 'square':
        perimeter = 4 * values[0];
        break;
      case 'circle':
        perimeter = 2 * Math.PI * values[0];
        break;
      case 'triangle':
        perimeter = values[0] + values[1] + values[2];
        break;
      case 'pentagon':
        perimeter = 5 * values[0];
        break;
      case 'hexagon':
        perimeter = 6 * values[0];
        break;
      case 'octagon':
        perimeter = 8 * values[0];
        break;
      case 'parallelogram':
        perimeter = 2 * (values[0] + values[1]);
        break;
      case 'rhombus':
        perimeter = 4 * values[0];
        break;
      case 'trapezoid':
        perimeter = values[0] + values[1] + values[2] + values[3];
        break;
    }

    setResult(perimeter);
  };

  const updateDimension = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      length: 'Length',
      width: 'Width',
      side: 'Side Length',
      side1: 'Side 1',
      side2: 'Side 2',
      side3: 'Side 3',
      side4: 'Side 4',
      radius: 'Radius',
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
        <span className="text-gray-900 font-medium">Perimeter Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Hexagon className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Perimeter Calculator</h1>
        </div>

        {/* Shape Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select Shape</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Object.entries(shapes).map(([key, shapeInfo]) => (
              <button
                key={key}
                onClick={() => {
                  setShape(key);
                  setDimensions({});
                }}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  shape === key
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {shapeInfo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
              />
            </div>
          ))}
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {shape === 'circle' ? 'Circumference' : 'Perimeter'} Result
            </h3>
            <div className="text-4xl font-bold text-green-600 mb-2">
              {result.toFixed(4)}
            </div>
            <div className="text-gray-600">linear units</div>
            
            {/* Additional conversions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Meters</div>
                <div className="text-lg font-semibold text-gray-800">{result.toFixed(4)} m</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Feet</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 3.28084).toFixed(4)} ft</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Inches</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 39.3701).toFixed(2)} in</div>
              </div>
            </div>
          </div>
        )}

        {/* Formula Display */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Formula</h3>
          <div className="font-mono text-gray-700">
            {shape === 'rectangle' && 'Perimeter = 2 × (length + width)'}
            {shape === 'square' && 'Perimeter = 4 × side'}
            {shape === 'circle' && 'Circumference = 2 × π × radius'}
            {shape === 'triangle' && 'Perimeter = side₁ + side₂ + side₃'}
            {shape === 'pentagon' && 'Perimeter = 5 × side'}
            {shape === 'hexagon' && 'Perimeter = 6 × side'}
            {shape === 'octagon' && 'Perimeter = 8 × side'}
            {shape === 'parallelogram' && 'Perimeter = 2 × (side₁ + side₂)'}
            {shape === 'rhombus' && 'Perimeter = 4 × side'}
            {shape === 'trapezoid' && 'Perimeter = side₁ + side₂ + side₃ + side₄'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerimeterCalculator;