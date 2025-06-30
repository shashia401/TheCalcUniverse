import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Triangle } from 'lucide-react';

const TriangleCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'sss' | 'sas' | 'asa' | 'aas' | 'ssa'>('sss');
  const [sides, setSides] = useState({ a: '', b: '', c: '' });
  const [angles, setAngles] = useState({ A: '', B: '', C: '' });
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateTriangle();
  }, [calculationType, sides, angles]);

  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;

  const calculateTriangle = () => {
    try {
      let a = parseFloat(sides.a) || 0;
      let b = parseFloat(sides.b) || 0;
      let c = parseFloat(sides.c) || 0;
      let A = parseFloat(angles.A) || 0;
      let B = parseFloat(angles.B) || 0;
      let C = parseFloat(angles.C) || 0;

      let solved = false;
      let area = 0;
      let perimeter = 0;

      if (calculationType === 'sss' && a && b && c) {
        // Side-Side-Side
        if (a + b > c && b + c > a && a + c > b) {
          A = toDegrees(Math.acos((b*b + c*c - a*a) / (2*b*c)));
          B = toDegrees(Math.acos((a*a + c*c - b*b) / (2*a*c)));
          C = 180 - A - B;
          solved = true;
        }
      } else if (calculationType === 'sas' && a && b && C) {
        // Side-Angle-Side
        c = Math.sqrt(a*a + b*b - 2*a*b*Math.cos(toRadians(C)));
        A = toDegrees(Math.asin(a * Math.sin(toRadians(C)) / c));
        B = 180 - A - C;
        solved = true;
      } else if (calculationType === 'asa' && a && A && B) {
        // Angle-Side-Angle
        C = 180 - A - B;
        b = a * Math.sin(toRadians(B)) / Math.sin(toRadians(A));
        c = a * Math.sin(toRadians(C)) / Math.sin(toRadians(A));
        solved = true;
      } else if (calculationType === 'aas' && a && A && C) {
        // Angle-Angle-Side
        B = 180 - A - C;
        b = a * Math.sin(toRadians(B)) / Math.sin(toRadians(A));
        c = a * Math.sin(toRadians(C)) / Math.sin(toRadians(A));
        solved = true;
      } else if (calculationType === 'ssa' && a && b && A) {
        // Side-Side-Angle (ambiguous case)
        const h = b * Math.sin(toRadians(A));
        if (a >= h) {
          B = toDegrees(Math.asin(b * Math.sin(toRadians(A)) / a));
          C = 180 - A - B;
          c = a * Math.sin(toRadians(C)) / Math.sin(toRadians(A));
          solved = true;
        }
      }

      if (solved) {
        area = 0.5 * a * b * Math.sin(toRadians(C));
        perimeter = a + b + c;

        setResults({
          sides: { a: a.toFixed(4), b: b.toFixed(4), c: c.toFixed(4) },
          angles: { A: A.toFixed(2), B: B.toFixed(2), C: C.toFixed(2) },
          area: area.toFixed(4),
          perimeter: perimeter.toFixed(4),
          type: getTriangleType(A, B, C, a, b, c)
        });
      } else {
        setResults(null);
      }
    } catch (error) {
      setResults(null);
    }
  };

  const getTriangleType = (A: number, B: number, C: number, a: number, b: number, c: number) => {
    const types = [];
    
    // By angles
    if (Math.abs(A - 90) < 0.01 || Math.abs(B - 90) < 0.01 || Math.abs(C - 90) < 0.01) {
      types.push('Right Triangle');
    } else if (A > 90 || B > 90 || C > 90) {
      types.push('Obtuse Triangle');
    } else {
      types.push('Acute Triangle');
    }

    // By sides
    const sides = [a, b, c].sort((x, y) => x - y);
    if (Math.abs(sides[0] - sides[1]) < 0.01 && Math.abs(sides[1] - sides[2]) < 0.01) {
      types.push('Equilateral Triangle');
    } else if (Math.abs(sides[0] - sides[1]) < 0.01 || Math.abs(sides[1] - sides[2]) < 0.01) {
      types.push('Isosceles Triangle');
    } else {
      types.push('Scalene Triangle');
    }

    return types.join(', ');
  };

  const calculationTypes = [
    { id: 'sss', name: 'SSS', description: 'Three sides known' },
    { id: 'sas', name: 'SAS', description: 'Two sides and included angle' },
    { id: 'asa', name: 'ASA', description: 'Two angles and included side' },
    { id: 'aas', name: 'AAS', description: 'Two angles and non-included side' },
    { id: 'ssa', name: 'SSA', description: 'Two sides and non-included angle' },
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
        <span className="text-gray-900 font-medium">Triangle Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Triangle className="w-8 h-8 text-orange-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Triangle Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Triangle Solution Method</label>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {calculationTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setCalculationType(type.id as any)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  calculationType === type.id
                    ? 'border-orange-500 bg-orange-50 text-orange-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-lg">{type.name}</div>
                <div className="text-xs opacity-75">{type.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Sides */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sides</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side a</label>
                <input
                  type="number"
                  value={sides.a}
                  onChange={(e) => setSides({...sides, a: e.target.value})}
                  placeholder="Enter side a"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side b</label>
                <input
                  type="number"
                  value={sides.b}
                  onChange={(e) => setSides({...sides, b: e.target.value})}
                  placeholder="Enter side b"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side c</label>
                <input
                  type="number"
                  value={sides.c}
                  onChange={(e) => setSides({...sides, c: e.target.value})}
                  placeholder="Enter side c"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Angles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Angles (degrees)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle A</label>
                <input
                  type="number"
                  value={angles.A}
                  onChange={(e) => setAngles({...angles, A: e.target.value})}
                  placeholder="Enter angle A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle B</label>
                <input
                  type="number"
                  value={angles.B}
                  onChange={(e) => setAngles({...angles, B: e.target.value})}
                  placeholder="Enter angle B"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle C</label>
                <input
                  type="number"
                  value={angles.C}
                  onChange={(e) => setAngles({...angles, C: e.target.value})}
                  placeholder="Enter angle C"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {results && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Triangle Solution</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Sides</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Side a:</span>
                    <span className="font-mono">{results.sides.a}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Side b:</span>
                    <span className="font-mono">{results.sides.b}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Side c:</span>
                    <span className="font-mono">{results.sides.c}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Angles</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Angle A:</span>
                    <span className="font-mono">{results.angles.A}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Angle B:</span>
                    <span className="font-mono">{results.angles.B}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Angle C:</span>
                    <span className="font-mono">{results.angles.C}°</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Area</div>
                <div className="text-xl font-bold text-orange-600">{results.area}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Perimeter</div>
                <div className="text-xl font-bold text-blue-600">{results.perimeter}</div>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Type</div>
                <div className="text-sm font-semibold text-green-600">{results.type}</div>
              </div>
            </div>
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Triangle Solution Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">SSS (Side-Side-Side)</h4>
              <p className="text-gray-600">All three sides are known. Uses Law of Cosines.</p>
            </div>
            <div>
              <h4 className="font-semibold">SAS (Side-Angle-Side)</h4>
              <p className="text-gray-600">Two sides and the included angle are known.</p>
            </div>
            <div>
              <h4 className="font-semibold">ASA (Angle-Side-Angle)</h4>
              <p className="text-gray-600">Two angles and the included side are known.</p>
            </div>
            <div>
              <h4 className="font-semibold">AAS (Angle-Angle-Side)</h4>
              <p className="text-gray-600">Two angles and a non-included side are known.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriangleCalculator;