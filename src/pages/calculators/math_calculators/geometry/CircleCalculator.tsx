import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Circle } from 'lucide-react';

const CircleCalculator: React.FC = () => {
  const [inputType, setInputType] = useState<'radius' | 'diameter' | 'circumference' | 'area'>('radius');
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateCircle();
  }, [inputType, inputValue]);

  const calculateCircle = () => {
    const value = parseFloat(inputValue);
    
    if (!inputValue || isNaN(value) || value <= 0) {
      setResult(null);
      return;
    }

    let radius: number;
    const steps: string[] = [];
    
    switch (inputType) {
      case 'radius':
        radius = value;
        steps.push(`Given radius r = ${value}`);
        break;
      case 'diameter':
        radius = value / 2;
        steps.push(`Given diameter d = ${value}`);
        steps.push(`Radius r = d/2 = ${value}/2 = ${radius}`);
        break;
      case 'circumference':
        radius = value / (2 * Math.PI);
        steps.push(`Given circumference C = ${value}`);
        steps.push(`Circumference formula: C = 2πr`);
        steps.push(`Solving for radius: r = C/(2π) = ${value}/(2π) = ${radius.toFixed(6)}`);
        break;
      case 'area':
        radius = Math.sqrt(value / Math.PI);
        steps.push(`Given area A = ${value}`);
        steps.push(`Area formula: A = πr²`);
        steps.push(`Solving for radius: r = √(A/π) = √(${value}/π) = ${radius.toFixed(6)}`);
        break;
      default:
        return;
    }

    const diameter = 2 * radius;
    const circumference = 2 * Math.PI * radius;
    const area = Math.PI * radius * radius;
    
    // Calculate additional properties
    const arcLength1Degree = (Math.PI / 180) * radius; // Arc length for 1 degree
    const sectorArea1Degree = (Math.PI / 360) * radius * radius; // Sector area for 1 degree
    
    steps.push(`Diameter d = 2r = 2 × ${radius.toFixed(6)} = ${diameter.toFixed(6)}`);
    steps.push(`Circumference C = 2πr = 2π × ${radius.toFixed(6)} = ${circumference.toFixed(6)}`);
    steps.push(`Area A = πr² = π × ${radius.toFixed(6)}² = ${area.toFixed(6)}`);
    
    setResult({
      radius,
      diameter,
      circumference,
      area,
      arcLength1Degree,
      sectorArea1Degree,
      steps
    });
  };

  const inputTypes = [
    { id: 'radius', name: 'Radius', symbol: 'r' },
    { id: 'diameter', name: 'Diameter', symbol: 'd' },
    { id: 'circumference', name: 'Circumference', symbol: 'C' },
    { id: 'area', name: 'Area', symbol: 'A' },
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
        <span className="text-gray-900 font-medium">Circle Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Circle className="w-8 h-8 text-cyan-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Circle Calculator</h1>
        </div>

        {/* Input Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">What do you know?</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {inputTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setInputType(type.id as any);
                  setInputValue('');
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  inputType === type.id
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{type.name}</div>
                <div className="text-sm opacity-75 font-mono">{type.symbol}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Circle Diagram */}
        <div className="mb-8 flex justify-center">
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 border-4 border-cyan-500 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-1 h-1 bg-cyan-600 rounded-full"></div>
            </div>
            <div className="absolute top-1/2 left-1/2 w-1/2 h-0.5 bg-cyan-600 transform -translate-y-1/2"></div>
            <div className="absolute top-1/2 right-4 text-sm font-medium text-cyan-600">r</div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-sm font-medium text-cyan-600">d</div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs text-gray-500">O</div>
          </div>
        </div>

        {/* Input Field */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter {inputTypes.find(t => t.id === inputType)?.name}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Enter ${inputType} value`}
            min="0"
            step="any"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Circle Properties</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Radius (r)</div>
                  <div className="text-2xl font-bold text-cyan-600">{result.radius.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Diameter (d)</div>
                  <div className="text-2xl font-bold text-blue-600">{result.diameter.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Circumference (C)</div>
                  <div className="text-2xl font-bold text-green-600">{result.circumference.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Area (A)</div>
                  <div className="text-2xl font-bold text-purple-600">{result.area.toFixed(6)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Arc Length (1°)</div>
                  <div className="text-lg font-mono text-teal-600">{result.arcLength1Degree.toFixed(6)}</div>
                  <div className="text-xs text-gray-500 mt-1">Length of arc for 1 degree of central angle</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Sector Area (1°)</div>
                  <div className="text-lg font-mono text-orange-600">{result.sectorArea1Degree.toFixed(6)}</div>
                  <div className="text-xs text-gray-500 mt-1">Area of sector for 1 degree of central angle</div>
                </div>
              </div>
            </div>

            {/* Exact Values */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Exact Values (with π)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Circumference</div>
                  <div className="text-lg font-mono text-gray-800">
                    {result.diameter.toFixed(6)}π = {result.circumference.toFixed(6)}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Area</div>
                  <div className="text-lg font-mono text-gray-800">
                    {(result.radius * result.radius).toFixed(6)}π = {result.area.toFixed(6)}
                  </div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Circle Formulas</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Diameter (d) = 2 × radius (r)</li>
                <li>• Circumference (C) = 2πr = πd</li>
                <li>• Area (A) = πr²</li>
                <li>• π ≈ 3.14159265359...</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Arc and Sector</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Arc length = (θ/360°) × 2πr</li>
                <li>• Sector area = (θ/360°) × πr²</li>
                <li>• θ is the central angle in degrees</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Circle Relationships</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Inscribed angle = (1/2) × central angle</li>
                <li>• Tangent is perpendicular to radius</li>
                <li>• Inscribed quadrilateral: opposite angles are supplementary</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Wheel circumference and rotation</li>
                <li>• Circular area calculations</li>
                <li>• Circular motion and angular velocity</li>
                <li>• Architectural and engineering design</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CircleCalculator;