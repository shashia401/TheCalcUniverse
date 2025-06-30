import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Triangle } from 'lucide-react';

const LawOfCosinesCalculator: React.FC = () => {
  const [knownValues, setKnownValues] = useState({
    a: '', b: '', c: '', A: '', B: '', C: ''
  });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    solveLawOfCosines();
  }, [knownValues]);

  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;

  const solveLawOfCosines = () => {
    const values = {
      a: parseFloat(knownValues.a) || null,
      b: parseFloat(knownValues.b) || null,
      c: parseFloat(knownValues.c) || null,
      A: parseFloat(knownValues.A) || null,
      B: parseFloat(knownValues.B) || null,
      C: parseFloat(knownValues.C) || null,
    };

    // Count known values
    const knownSides = [values.a, values.b, values.c].filter(v => v !== null).length;
    const knownAngles = [values.A, values.B, values.C].filter(v => v !== null).length;
    const totalKnown = knownSides + knownAngles;

    if (totalKnown < 3) {
      setResult(null);
      return;
    }

    try {
      let solved = { ...values };
      let steps: string[] = [];
      let solutionType = '';

      // SSS case - all three sides known
      if (knownSides === 3) {
        solutionType = 'SSS (Three Sides)';
        steps.push('Solving using SSS case - all three sides known');
        
        // Calculate angle A using: cos(A) = (b² + c² - a²) / (2bc)
        if (!solved.A) {
          const cosA = (solved.b! * solved.b! + solved.c! * solved.c! - solved.a! * solved.a!) / (2 * solved.b! * solved.c!);
          solved.A = toDegrees(Math.acos(cosA));
          steps.push(`cos(A) = (b² + c² - a²) / (2bc) = (${solved.b}² + ${solved.c}² - ${solved.a}²) / (2×${solved.b}×${solved.c})`);
          steps.push(`cos(A) = ${cosA.toFixed(6)}`);
          steps.push(`A = arccos(${cosA.toFixed(6)}) = ${solved.A.toFixed(2)}°`);
        }

        // Calculate angle B using: cos(B) = (a² + c² - b²) / (2ac)
        if (!solved.B) {
          const cosB = (solved.a! * solved.a! + solved.c! * solved.c! - solved.b! * solved.b!) / (2 * solved.a! * solved.c!);
          solved.B = toDegrees(Math.acos(cosB));
          steps.push(`cos(B) = (a² + c² - b²) / (2ac) = (${solved.a}² + ${solved.c}² - ${solved.b}²) / (2×${solved.a}×${solved.c})`);
          steps.push(`cos(B) = ${cosB.toFixed(6)}`);
          steps.push(`B = arccos(${cosB.toFixed(6)}) = ${solved.B.toFixed(2)}°`);
        }

        // Calculate angle C using angle sum
        if (!solved.C) {
          solved.C = 180 - solved.A! - solved.B!;
          steps.push(`C = 180° - A - B = 180° - ${solved.A!.toFixed(2)}° - ${solved.B!.toFixed(2)}° = ${solved.C.toFixed(2)}°`);
        }
      }
      // SAS case - two sides and included angle
      else if (knownSides === 2 && knownAngles === 1) {
        solutionType = 'SAS (Two Sides and Included Angle)';
        steps.push('Solving using SAS case - two sides and included angle');

        // Find which angle is known and calculate the opposite side
        if (solved.A && solved.b && solved.c) {
          // Calculate side a using: a² = b² + c² - 2bc×cos(A)
          const a_squared = solved.b * solved.b + solved.c * solved.c - 2 * solved.b * solved.c * Math.cos(toRadians(solved.A));
          solved.a = Math.sqrt(a_squared);
          steps.push(`a² = b² + c² - 2bc×cos(A)`);
          steps.push(`a² = ${solved.b}² + ${solved.c}² - 2×${solved.b}×${solved.c}×cos(${solved.A}°)`);
          steps.push(`a² = ${a_squared.toFixed(6)}`);
          steps.push(`a = √${a_squared.toFixed(6)} = ${solved.a.toFixed(4)}`);
        } else if (solved.B && solved.a && solved.c) {
          // Calculate side b
          const b_squared = solved.a * solved.a + solved.c * solved.c - 2 * solved.a * solved.c * Math.cos(toRadians(solved.B));
          solved.b = Math.sqrt(b_squared);
          steps.push(`b² = a² + c² - 2ac×cos(B) = ${b_squared.toFixed(6)}`);
          steps.push(`b = ${solved.b.toFixed(4)}`);
        } else if (solved.C && solved.a && solved.b) {
          // Calculate side c
          const c_squared = solved.a * solved.a + solved.b * solved.b - 2 * solved.a * solved.b * Math.cos(toRadians(solved.C));
          solved.c = Math.sqrt(c_squared);
          steps.push(`c² = a² + b² - 2ab×cos(C) = ${c_squared.toFixed(6)}`);
          steps.push(`c = ${solved.c.toFixed(4)}`);
        }

        // Now use Law of Sines to find remaining angles
        if (solved.a && solved.b && solved.c) {
          if (!solved.A) {
            const cosA = (solved.b * solved.b + solved.c * solved.c - solved.a * solved.a) / (2 * solved.b * solved.c);
            solved.A = toDegrees(Math.acos(cosA));
            steps.push(`Using Law of Cosines to find A: A = ${solved.A.toFixed(2)}°`);
          }
          if (!solved.B) {
            const cosB = (solved.a * solved.a + solved.c * solved.c - solved.b * solved.b) / (2 * solved.a * solved.c);
            solved.B = toDegrees(Math.acos(cosB));
            steps.push(`Using Law of Cosines to find B: B = ${solved.B.toFixed(2)}°`);
          }
          if (!solved.C) {
            solved.C = 180 - solved.A! - solved.B!;
            steps.push(`C = 180° - A - B = ${solved.C.toFixed(2)}°`);
          }
        }
      }
      // SSA case - use Law of Cosines after Law of Sines
      else if (knownSides === 2 && knownAngles === 1) {
        solutionType = 'SSA (Two Sides and Non-included Angle)';
        steps.push('This case may require Law of Sines first, then Law of Cosines');
        // This would be handled by Law of Sines calculator primarily
      }

      // Validate triangle inequality
      if (solved.a && solved.b && solved.c) {
        const valid = (solved.a + solved.b > solved.c) && 
                     (solved.b + solved.c > solved.a) && 
                     (solved.a + solved.c > solved.b);
        if (!valid) {
          setResult({ error: 'Invalid triangle: sides do not satisfy triangle inequality' });
          return;
        }
      }

      // Calculate area using Heron's formula or SAS formula
      let area = 0;
      if (solved.a && solved.b && solved.c) {
        const s = (solved.a + solved.b + solved.c) / 2; // semi-perimeter
        area = Math.sqrt(s * (s - solved.a) * (s - solved.b) * (s - solved.c));
        steps.push(`Area using Heron's formula: s = ${s.toFixed(4)}, Area = ${area.toFixed(4)}`);
      } else if (solved.a && solved.b && solved.C) {
        area = 0.5 * solved.a * solved.b * Math.sin(toRadians(solved.C));
        steps.push(`Area = ½ab×sin(C) = ${area.toFixed(4)}`);
      }

      // Calculate perimeter
      const perimeter = (solved.a || 0) + (solved.b || 0) + (solved.c || 0);

      setResult({
        sides: {
          a: solved.a?.toFixed(4) || 'Unknown',
          b: solved.b?.toFixed(4) || 'Unknown',
          c: solved.c?.toFixed(4) || 'Unknown'
        },
        angles: {
          A: solved.A?.toFixed(2) || 'Unknown',
          B: solved.B?.toFixed(2) || 'Unknown',
          C: solved.C?.toFixed(2) || 'Unknown'
        },
        area: area.toFixed(4),
        perimeter: perimeter.toFixed(4),
        solutionType,
        steps
      });
    } catch (error) {
      setResult({ error: 'Unable to solve with given values. Check that values form a valid triangle.' });
    }
  };

  const updateValue = (key: string, value: string) => {
    setKnownValues(prev => ({ ...prev, [key]: value }));
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
        <span className="text-gray-900 font-medium">Law of Cosines Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Triangle className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Law of Cosines Calculator</h1>
        </div>

        {/* Formula Display */}
        <div className="bg-green-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Law of Cosines Formulas</h3>
          <div className="space-y-2 font-mono text-green-800">
            <div>a² = b² + c² - 2bc×cos(A)</div>
            <div>b² = a² + c² - 2ac×cos(B)</div>
            <div>c² = a² + b² - 2ab×cos(C)</div>
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Sides */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sides</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side a</label>
                <input
                  type="number"
                  value={knownValues.a}
                  onChange={(e) => updateValue('a', e.target.value)}
                  placeholder="Enter side a"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side b</label>
                <input
                  type="number"
                  value={knownValues.b}
                  onChange={(e) => updateValue('b', e.target.value)}
                  placeholder="Enter side b"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side c</label>
                <input
                  type="number"
                  value={knownValues.c}
                  onChange={(e) => updateValue('c', e.target.value)}
                  placeholder="Enter side c"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Angles */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Angles (degrees)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle A (opposite side a)</label>
                <input
                  type="number"
                  value={knownValues.A}
                  onChange={(e) => updateValue('A', e.target.value)}
                  placeholder="Enter angle A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle B (opposite side b)</label>
                <input
                  type="number"
                  value={knownValues.B}
                  onChange={(e) => updateValue('B', e.target.value)}
                  placeholder="Enter angle B"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle C (opposite side c)</label>
                <input
                  type="number"
                  value={knownValues.C}
                  onChange={(e) => updateValue('C', e.target.value)}
                  placeholder="Enter angle C"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Solution Type */}
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-lg font-semibold text-green-800">
                Solution Type: {result.solutionType}
              </div>
            </div>

            {/* Triangle Properties */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Triangle Solution</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Sides</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Side a:</span>
                      <span className="font-mono">{result.sides.a}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Side b:</span>
                      <span className="font-mono">{result.sides.b}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Side c:</span>
                      <span className="font-mono">{result.sides.c}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Angles</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Angle A:</span>
                      <span className="font-mono">{result.angles.A}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Angle B:</span>
                      <span className="font-mono">{result.angles.B}°</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Angle C:</span>
                      <span className="font-mono">{result.angles.C}°</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Area</div>
                  <div className="text-xl font-bold text-green-600">{result.area}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Perimeter</div>
                  <div className="text-xl font-bold text-blue-600">{result.perimeter}</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Solution Steps</h3>
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

        {/* Error */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">When to Use Law of Cosines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Applicable Cases</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• SSS: Three sides known</li>
                <li>• SAS: Two sides and included angle</li>
                <li>• SSA: Two sides and non-included angle (use with caution)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Advantages</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Works for any triangle (not just right triangles)</li>
                <li>• Can find sides directly without angles</li>
                <li>• More versatile than Law of Sines in some cases</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawOfCosinesCalculator;