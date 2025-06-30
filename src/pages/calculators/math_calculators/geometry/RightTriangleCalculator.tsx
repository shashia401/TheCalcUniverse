import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Triangle } from 'lucide-react';

const RightTriangleCalculator: React.FC = () => {
  const [inputType, setInputType] = useState<'legs' | 'leg-hypotenuse' | 'leg-angle'>('legs');
  const [values, setValues] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<any>(null);

  const calculateTriangle = () => {
    try {
      let a, b, c, angleA, angleB;
      const steps: string[] = [];
      
      switch (inputType) {
        case 'legs':
          a = parseFloat(values.a);
          b = parseFloat(values.b);
          
          if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
            setResult({ error: "Please enter valid positive values for both legs" });
            return;
          }
          
          // Calculate hypotenuse using Pythagorean theorem
          c = Math.sqrt(a * a + b * b);
          
          // Calculate angles using inverse trigonometric functions
          angleA = Math.atan(a / b) * (180 / Math.PI);
          angleB = Math.atan(b / a) * (180 / Math.PI);
          
          steps.push(`Given legs: a = ${a}, b = ${b}`);
          steps.push(`Using the Pythagorean theorem: c² = a² + b²`);
          steps.push(`c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a + b*b}`);
          steps.push(`c = √${a*a + b*b} = ${c.toFixed(6)}`);
          steps.push(`Angle A = arctan(a/b) = arctan(${a}/${b}) = ${angleA.toFixed(2)}°`);
          steps.push(`Angle B = arctan(b/a) = arctan(${b}/${a}) = ${angleB.toFixed(2)}°`);
          steps.push(`Angle C = 90° (right angle)`);
          break;
          
        case 'leg-hypotenuse':
          a = parseFloat(values.a);
          c = parseFloat(values.c);
          
          if (isNaN(a) || isNaN(c) || a <= 0 || c <= 0) {
            setResult({ error: "Please enter valid positive values for leg and hypotenuse" });
            return;
          }
          
          if (a >= c) {
            setResult({ error: "Hypotenuse must be greater than the leg" });
            return;
          }
          
          // Calculate the other leg using Pythagorean theorem
          b = Math.sqrt(c * c - a * a);
          
          // Calculate angles
          angleA = Math.asin(a / c) * (180 / Math.PI);
          angleB = Math.asin(b / c) * (180 / Math.PI);
          
          steps.push(`Given leg a = ${a} and hypotenuse c = ${c}`);
          steps.push(`Using the Pythagorean theorem: a² + b² = c²`);
          steps.push(`Solving for b: b² = c² - a²`);
          steps.push(`b² = ${c}² - ${a}² = ${c*c} - ${a*a} = ${c*c - a*a}`);
          steps.push(`b = √${c*c - a*a} = ${b.toFixed(6)}`);
          steps.push(`Angle A = arcsin(a/c) = arcsin(${a}/${c}) = ${angleA.toFixed(2)}°`);
          steps.push(`Angle B = arcsin(b/c) = arcsin(${b}/${c}) = ${angleB.toFixed(2)}°`);
          steps.push(`Angle C = 90° (right angle)`);
          break;
          
        case 'leg-angle':
          a = parseFloat(values.a);
          angleA = parseFloat(values.angleA);
          
          if (isNaN(a) || isNaN(angleA) || a <= 0 || angleA <= 0 || angleA >= 90) {
            setResult({ error: "Please enter valid values (leg > 0, 0° < angle < 90°)" });
            return;
          }
          
          // Calculate other parts using trigonometry
          angleB = 90 - angleA;
          b = a / Math.tan(angleA * Math.PI / 180);
          c = a / Math.sin(angleA * Math.PI / 180);
          
          steps.push(`Given leg a = ${a} and angle A = ${angleA}°`);
          steps.push(`In a right triangle, angles sum to 180°`);
          steps.push(`Angle B = 90° - ${angleA}° = ${angleB}°`);
          steps.push(`Using trigonometry:`);
          steps.push(`tan(A) = a/b, so b = a/tan(A) = ${a}/tan(${angleA}°) = ${b.toFixed(6)}`);
          steps.push(`sin(A) = a/c, so c = a/sin(A) = ${a}/sin(${angleA}°) = ${c.toFixed(6)}`);
          steps.push(`Verifying with Pythagorean theorem: a² + b² = ${a*a} + ${b*b} ≈ ${c*c} = c²`);
          break;
      }
      
      // Calculate area and perimeter
      const area = 0.5 * a * b;
      const perimeter = a + b + c;
      
      // Calculate other properties
      const inradius = (a + b - c) / 2; // Inradius of the right triangle
      const circumradius = c / 2; // Circumradius of the right triangle
      
      steps.push(`Area = (1/2) × a × b = (1/2) × ${a} × ${b} = ${area.toFixed(6)}`);
      steps.push(`Perimeter = a + b + c = ${a} + ${b} + ${c} = ${perimeter.toFixed(6)}`);
      
      setResult({
        legs: { a, b },
        hypotenuse: c,
        angles: { A: angleA, B: angleB, C: 90 },
        area,
        perimeter,
        inradius,
        circumradius,
        steps
      });
      
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  const updateValue = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const handleInputTypeChange = (type: 'legs' | 'leg-hypotenuse' | 'leg-angle') => {
    setInputType(type);
    setValues({});
    setResult(null);
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
        <span className="text-gray-900 font-medium">Right Triangle Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Triangle className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Right Triangle Calculator</h1>
        </div>

        {/* Input Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Input Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => handleInputTypeChange('legs')}
              className={`p-4 rounded-lg border-2 transition-all ${
                inputType === 'legs'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Two Legs</div>
              <div className="text-sm opacity-75">Enter both legs (a and b)</div>
            </button>
            <button
              onClick={() => handleInputTypeChange('leg-hypotenuse')}
              className={`p-4 rounded-lg border-2 transition-all ${
                inputType === 'leg-hypotenuse'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Leg and Hypotenuse</div>
              <div className="text-sm opacity-75">Enter one leg and hypotenuse</div>
            </button>
            <button
              onClick={() => handleInputTypeChange('leg-angle')}
              className={`p-4 rounded-lg border-2 transition-all ${
                inputType === 'leg-angle'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Leg and Angle</div>
              <div className="text-sm opacity-75">Enter one leg and one acute angle</div>
            </button>
          </div>
        </div>

        {/* Triangle Diagram */}
        <div className="mb-8 flex justify-center">
          <div className="bg-gray-50 p-6 rounded-lg w-64 h-64 relative">
            <div className="absolute bottom-4 left-4 right-4 top-4">
              <div className="w-full h-full relative">
                {/* Right angle marker */}
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-400"></div>
                
                {/* Triangle sides */}
                <div className="absolute bottom-0 left-0 right-0 border-b-2 border-blue-500">
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-blue-600 font-medium">b</div>
                </div>
                <div className="absolute bottom-0 left-0 top-0 border-l-2 border-green-500">
                  <div className="absolute top-1/2 -left-6 transform -translate-y-1/2 text-green-600 font-medium">a</div>
                </div>
                <div className="absolute bottom-0 right-0 top-0 transform rotate-45 origin-bottom-left border-r-2 border-red-500">
                  <div className="absolute top-1/2 right-0 transform translate-x-6 -translate-y-1/2 text-red-600 font-medium">c</div>
                </div>
                
                {/* Angle labels */}
                <div className="absolute bottom-2 left-8 text-purple-600 font-medium">C = 90°</div>
                <div className="absolute bottom-8 right-4 text-purple-600 font-medium">B</div>
                <div className="absolute top-4 left-4 text-purple-600 font-medium">A</div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {inputType === 'legs' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leg a (vertical)
                </label>
                <input
                  type="number"
                  value={values.a || ''}
                  onChange={(e) => updateValue('a', e.target.value)}
                  placeholder="Enter length"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leg b (horizontal)
                </label>
                <input
                  type="number"
                  value={values.b || ''}
                  onChange={(e) => updateValue('b', e.target.value)}
                  placeholder="Enter length"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
            </>
          )}
          
          {inputType === 'leg-hypotenuse' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leg a
                </label>
                <input
                  type="number"
                  value={values.a || ''}
                  onChange={(e) => updateValue('a', e.target.value)}
                  placeholder="Enter length"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hypotenuse c
                </label>
                <input
                  type="number"
                  value={values.c || ''}
                  onChange={(e) => updateValue('c', e.target.value)}
                  placeholder="Enter length"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
            </>
          )}
          
          {inputType === 'leg-angle' && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Leg a
                </label>
                <input
                  type="number"
                  value={values.a || ''}
                  onChange={(e) => updateValue('a', e.target.value)}
                  placeholder="Enter length"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Angle A (degrees)
                </label>
                <input
                  type="number"
                  value={values.angleA || ''}
                  onChange={(e) => updateValue('angleA', e.target.value)}
                  placeholder="Enter angle"
                  min="0"
                  max="90"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                />
              </div>
            </>
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateTriangle}
          className="w-full md:w-auto px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate
        </button>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Triangle Properties</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Leg a</div>
                  <div className="text-2xl font-bold text-green-600">{result.legs.a.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Leg b</div>
                  <div className="text-2xl font-bold text-blue-600">{result.legs.b.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Hypotenuse c</div>
                  <div className="text-2xl font-bold text-red-600">{result.hypotenuse.toFixed(4)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle A</div>
                  <div className="text-2xl font-bold text-purple-600">{result.angles.A.toFixed(2)}°</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle B</div>
                  <div className="text-2xl font-bold text-purple-600">{result.angles.B.toFixed(2)}°</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle C</div>
                  <div className="text-2xl font-bold text-purple-600">90°</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Area</div>
                  <div className="text-2xl font-bold text-teal-600">{result.area.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Perimeter</div>
                  <div className="text-2xl font-bold text-orange-600">{result.perimeter.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Additional Properties */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Inradius (radius of inscribed circle)</div>
                  <div className="text-lg font-mono text-indigo-600">{result.inradius.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Circumradius (radius of circumscribed circle)</div>
                  <div className="text-lg font-mono text-indigo-600">{result.circumradius.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-gray-700 font-mono text-sm">{step}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Right Triangle Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Pythagorean Theorem</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• a² + b² = c²</li>
                <li>• c is the hypotenuse (longest side)</li>
                <li>• a and b are the legs (shorter sides)</li>
                <li>• The legs are perpendicular to each other</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Trigonometry</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• sin(A) = opposite/hypotenuse = a/c</li>
                <li>• cos(A) = adjacent/hypotenuse = b/c</li>
                <li>• tan(A) = opposite/adjacent = a/b</li>
                <li>• A + B + C = 180° (where C = 90°)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Area</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Area = (1/2) × a × b</li>
                <li>• Area = (1/2) × c² × sin(A) × sin(B)</li>
                <li>• Area = (a × b × sin(C))/2 (where C = 90°)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Special Right Triangles</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• 30°-60°-90° triangle: sides in ratio 1:√3:2</li>
                <li>• 45°-45°-90° triangle: sides in ratio 1:1:√2</li>
                <li>• Pythagorean triples: (3,4,5), (5,12,13), (8,15,17)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightTriangleCalculator;