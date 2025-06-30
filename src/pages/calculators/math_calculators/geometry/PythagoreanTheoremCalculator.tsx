import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Triangle } from 'lucide-react';

const PythagoreanTheoremCalculator: React.FC = () => {
  const [sideA, setSideA] = useState('');
  const [sideB, setSideB] = useState('');
  const [sideC, setSideC] = useState('');
  const [solveFor, setSolveFor] = useState<'a' | 'b' | 'c'>('c');
  const [result, setResult] = useState<any>(null);

  const calculateSide = () => {
    try {
      let a = parseFloat(sideA);
      let b = parseFloat(sideB);
      let c = parseFloat(sideC);
      
      const steps: string[] = [];
      let calculatedValue: number;
      
      switch (solveFor) {
        case 'a':
          if (isNaN(b) || isNaN(c) || b <= 0 || c <= 0) {
            setResult({ error: "Please enter positive values for sides b and c" });
            return;
          }
          
          if (b >= c) {
            setResult({ error: "Hypotenuse (c) must be greater than leg (b)" });
            return;
          }
          
          steps.push(`Using the Pythagorean theorem: a² + b² = c²`);
          steps.push(`Solving for a: a² = c² - b²`);
          steps.push(`a² = ${c}² - ${b}² = ${c*c} - ${b*b} = ${c*c - b*b}`);
          
          calculatedValue = Math.sqrt(c*c - b*b);
          steps.push(`a = √(${c*c - b*b}) = ${calculatedValue.toFixed(6)}`);
          
          a = calculatedValue;
          break;
          
        case 'b':
          if (isNaN(a) || isNaN(c) || a <= 0 || c <= 0) {
            setResult({ error: "Please enter positive values for sides a and c" });
            return;
          }
          
          if (a >= c) {
            setResult({ error: "Hypotenuse (c) must be greater than leg (a)" });
            return;
          }
          
          steps.push(`Using the Pythagorean theorem: a² + b² = c²`);
          steps.push(`Solving for b: b² = c² - a²`);
          steps.push(`b² = ${c}² - ${a}² = ${c*c} - ${a*a} = ${c*c - a*a}`);
          
          calculatedValue = Math.sqrt(c*c - a*a);
          steps.push(`b = √(${c*c - a*a}) = ${calculatedValue.toFixed(6)}`);
          
          b = calculatedValue;
          break;
          
        case 'c':
          if (isNaN(a) || isNaN(b) || a <= 0 || b <= 0) {
            setResult({ error: "Please enter positive values for sides a and b" });
            return;
          }
          
          steps.push(`Using the Pythagorean theorem: a² + b² = c²`);
          steps.push(`Solving for c: c² = a² + b²`);
          steps.push(`c² = ${a}² + ${b}² = ${a*a} + ${b*b} = ${a*a + b*b}`);
          
          calculatedValue = Math.sqrt(a*a + b*b);
          steps.push(`c = √(${a*a + b*b}) = ${calculatedValue.toFixed(6)}`);
          
          c = calculatedValue;
          break;
      }
      
      // Check if it's a Pythagorean triple
      const isPythagoreanTriple = Number.isInteger(a) && Number.isInteger(b) && Number.isInteger(c);
      
      // Check if it's a special right triangle
      const isSpecial45 = Math.abs(a - b) < 0.0001 && Math.abs(c - Math.sqrt(2) * a) < 0.0001;
      const isSpecial30 = (Math.abs(a - b/Math.sqrt(3)) < 0.0001 || Math.abs(b - a/Math.sqrt(3)) < 0.0001) && 
                          (Math.abs(c - 2*a) < 0.0001 || Math.abs(c - 2*b) < 0.0001);
      
      // Calculate angles
      const angleA = Math.atan(a / b) * (180 / Math.PI);
      const angleB = Math.atan(b / a) * (180 / Math.PI);
      
      // Calculate area
      const area = 0.5 * a * b;
      
      // Calculate perimeter
      const perimeter = a + b + c;
      
      steps.push(`Area of the triangle = (1/2) × a × b = (1/2) × ${a.toFixed(4)} × ${b.toFixed(4)} = ${area.toFixed(6)}`);
      steps.push(`Perimeter of the triangle = a + b + c = ${a.toFixed(4)} + ${b.toFixed(4)} + ${c.toFixed(4)} = ${perimeter.toFixed(6)}`);
      
      if (isPythagoreanTriple) {
        steps.push(`This is a Pythagorean triple! (${a}, ${b}, ${c}) are all integers that satisfy a² + b² = c²`);
      }
      
      if (isSpecial45) {
        steps.push(`This is a 45°-45°-90° triangle (isosceles right triangle)`);
      } else if (isSpecial30) {
        steps.push(`This is a 30°-60°-90° triangle`);
      }
      
      setResult({
        a,
        b,
        c,
        angleA,
        angleB,
        area,
        perimeter,
        isPythagoreanTriple,
        isSpecial45,
        isSpecial30,
        steps
      });
      
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  const handleSolveForChange = (side: 'a' | 'b' | 'c') => {
    setSolveFor(side);
    setSideA('');
    setSideB('');
    setSideC('');
    setResult(null);
  };

  const pythagoreanTriples = [
    { a: 3, b: 4, c: 5 },
    { a: 5, b: 12, c: 13 },
    { a: 8, b: 15, c: 17 },
    { a: 7, b: 24, c: 25 },
    { a: 9, b: 40, c: 41 },
    { a: 11, b: 60, c: 61 },
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
        <span className="text-gray-900 font-medium">Pythagorean Theorem Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Triangle className="w-8 h-8 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Pythagorean Theorem Calculator</h1>
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
                
                {/* Formula */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-gray-700 font-medium">
                  a² + b² = c²
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Solve For Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Solve For</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleSolveForChange('a')}
              className={`p-4 rounded-lg border-2 transition-all ${
                solveFor === 'a'
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-bold text-lg">a</div>
              <div className="text-xs opacity-75">Leg (vertical)</div>
            </button>
            <button
              onClick={() => handleSolveForChange('b')}
              className={`p-4 rounded-lg border-2 transition-all ${
                solveFor === 'b'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-bold text-lg">b</div>
              <div className="text-xs opacity-75">Leg (horizontal)</div>
            </button>
            <button
              onClick={() => handleSolveForChange('c')}
              className={`p-4 rounded-lg border-2 transition-all ${
                solveFor === 'c'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-bold text-lg">c</div>
              <div className="text-xs opacity-75">Hypotenuse</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Side a {solveFor === 'a' && '(to solve)'}
            </label>
            <input
              type="number"
              value={sideA}
              onChange={(e) => setSideA(e.target.value)}
              placeholder={solveFor === 'a' ? 'To be calculated' : 'Enter length'}
              disabled={solveFor === 'a'}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg ${
                solveFor === 'a' ? 'bg-gray-100' : ''
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Side b {solveFor === 'b' && '(to solve)'}
            </label>
            <input
              type="number"
              value={sideB}
              onChange={(e) => setSideB(e.target.value)}
              placeholder={solveFor === 'b' ? 'To be calculated' : 'Enter length'}
              disabled={solveFor === 'b'}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg ${
                solveFor === 'b' ? 'bg-gray-100' : ''
              }`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Side c {solveFor === 'c' && '(to solve)'}
            </label>
            <input
              type="number"
              value={sideC}
              onChange={(e) => setSideC(e.target.value)}
              placeholder={solveFor === 'c' ? 'To be calculated' : 'Enter length'}
              disabled={solveFor === 'c'}
              className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg ${
                solveFor === 'c' ? 'bg-gray-100' : ''
              }`}
            />
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateSide}
          className="w-full md:w-auto px-8 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate
        </button>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Triangle Properties</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Side a</div>
                  <div className="text-2xl font-bold text-green-600">{result.a.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Side b</div>
                  <div className="text-2xl font-bold text-blue-600">{result.b.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Side c (hypotenuse)</div>
                  <div className="text-2xl font-bold text-red-600">{result.c.toFixed(4)}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle A</div>
                  <div className="text-xl font-bold text-purple-600">{result.angleA.toFixed(2)}°</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle B</div>
                  <div className="text-xl font-bold text-purple-600">{result.angleB.toFixed(2)}°</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle C</div>
                  <div className="text-xl font-bold text-purple-600">90°</div>
                </div>
              </div>
              
              {(result.isPythagoreanTriple || result.isSpecial45 || result.isSpecial30) && (
                <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                  {result.isPythagoreanTriple && (
                    <div className="text-yellow-800 font-semibold">
                      This is a Pythagorean Triple! ({result.a}, {result.b}, {result.c})
                    </div>
                  )}
                  {result.isSpecial45 && (
                    <div className="text-yellow-800 font-semibold">
                      This is a 45°-45°-90° triangle (isosceles right triangle)
                    </div>
                  )}
                  {result.isSpecial30 && (
                    <div className="text-yellow-800 font-semibold">
                      This is a 30°-60°-90° triangle
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Properties */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Area</div>
                  <div className="text-xl font-bold text-teal-600">{result.area.toFixed(4)}</div>
                  <div className="text-xs text-gray-500 mt-1">square units</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Perimeter</div>
                  <div className="text-xl font-bold text-orange-600">{result.perimeter.toFixed(4)}</div>
                  <div className="text-xs text-gray-500 mt-1">units</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
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

        {/* Pythagorean Triples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Pythagorean Triples</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {pythagoreanTriples.map((triple, index) => (
              <div key={index} className="bg-white rounded-lg p-3 text-center">
                <div className="text-sm font-medium text-gray-800">
                  {triple.a}² + {triple.b}² = {triple.c}²
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {triple.a*triple.a} + {triple.b*triple.b} = {triple.c*triple.c}
                </div>
                <button
                  onClick={() => {
                    if (solveFor === 'a') {
                      setSideB(triple.b.toString());
                      setSideC(triple.c.toString());
                    } else if (solveFor === 'b') {
                      setSideA(triple.a.toString());
                      setSideC(triple.c.toString());
                    } else {
                      setSideA(triple.a.toString());
                      setSideB(triple.b.toString());
                    }
                  }}
                  className="mt-2 px-2 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                >
                  Use This Triple
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About the Pythagorean Theorem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">The Theorem</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• In a right triangle, a² + b² = c²</li>
                <li>• a and b are the legs (shorter sides)</li>
                <li>• c is the hypotenuse (longest side)</li>
                <li>• Only works for right triangles (90° angle)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Construction and architecture</li>
                <li>• Navigation and distance calculations</li>
                <li>• Physics and engineering</li>
                <li>• Computer graphics and game development</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Special Right Triangles</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• 45°-45°-90° triangle: sides in ratio 1:1:√2</li>
                <li>• 30°-60°-90° triangle: sides in ratio 1:√3:2</li>
                <li>• Pythagorean triples: sets of integers that satisfy a² + b² = c²</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Historical Significance</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Named after Pythagoras (570-495 BCE)</li>
                <li>• Known to ancient Babylonians and Egyptians</li>
                <li>• Used in ancient construction and surveying</li>
                <li>• One of the foundational theorems in geometry</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PythagoreanTheoremCalculator;