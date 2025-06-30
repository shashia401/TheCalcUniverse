import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Triangle } from 'lucide-react';

const LawOfSinesCalculator: React.FC = () => {
  const [knownValues, setKnownValues] = useState({
    a: '', A: '', b: '', B: '', c: '', C: ''
  });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    solveLawOfSines();
  }, [knownValues]);

  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const toDegrees = (radians: number) => radians * 180 / Math.PI;

  const solveLawOfSines = () => {
    const values = {
      a: parseFloat(knownValues.a) || null,
      A: parseFloat(knownValues.A) || null,
      b: parseFloat(knownValues.b) || null,
      B: parseFloat(knownValues.B) || null,
      c: parseFloat(knownValues.c) || null,
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

      // Check for angle sum
      if (knownAngles >= 2) {
        const angleSum = (solved.A || 0) + (solved.B || 0) + (solved.C || 0);
        if (knownAngles === 2) {
          if (!solved.A) solved.A = 180 - (solved.B! + solved.C!);
          if (!solved.B) solved.B = 180 - (solved.A! + solved.C!);
          if (!solved.C) solved.C = 180 - (solved.A! + solved.B!);
          steps.push(`Using angle sum: A + B + C = 180°`);
        }
      }

      // ASA or AAS case
      if (knownAngles >= 2 && knownSides >= 1) {
        solutionType = 'ASA/AAS';
        steps.push('Solving using ASA/AAS case');
        
        // Find the ratio using known side and its opposite angle
        let ratio = 0;
        if (solved.a && solved.A) {
          ratio = solved.a / Math.sin(toRadians(solved.A));
          steps.push(`Ratio = a/sin(A) = ${solved.a}/sin(${solved.A}°) = ${ratio.toFixed(4)}`);
        } else if (solved.b && solved.B) {
          ratio = solved.b / Math.sin(toRadians(solved.B));
          steps.push(`Ratio = b/sin(B) = ${solved.b}/sin(${solved.B}°) = ${ratio.toFixed(4)}`);
        } else if (solved.c && solved.C) {
          ratio = solved.c / Math.sin(toRadians(solved.C));
          steps.push(`Ratio = c/sin(C) = ${solved.c}/sin(${solved.C}°) = ${ratio.toFixed(4)}`);
        }

        // Calculate missing sides
        if (!solved.a && solved.A) {
          solved.a = ratio * Math.sin(toRadians(solved.A));
          steps.push(`a = ratio × sin(A) = ${ratio.toFixed(4)} × sin(${solved.A}°) = ${solved.a.toFixed(4)}`);
        }
        if (!solved.b && solved.B) {
          solved.b = ratio * Math.sin(toRadians(solved.B));
          steps.push(`b = ratio × sin(B) = ${ratio.toFixed(4)} × sin(${solved.B}°) = ${solved.b.toFixed(4)}`);
        }
        if (!solved.c && solved.C) {
          solved.c = ratio * Math.sin(toRadians(solved.C));
          steps.push(`c = ratio × sin(C) = ${ratio.toFixed(4)} × sin(${solved.C}°) = ${solved.c.toFixed(4)}`);
        }
      }
      // SSA case (ambiguous case)
      else if (knownSides === 2 && knownAngles === 1) {
        solutionType = 'SSA (Ambiguous Case)';
        steps.push('Solving using SSA case (potentially ambiguous)');

        // Find which angle is known and solve accordingly
        if (solved.A && solved.a && solved.b) {
          const sinB = (solved.b * Math.sin(toRadians(solved.A))) / solved.a;
          if (sinB > 1) {
            setResult({ error: 'No solution exists (sinB > 1)' });
            return;
          }
          solved.B = toDegrees(Math.asin(sinB));
          solved.C = 180 - solved.A - solved.B;
          solved.c = (solved.a * Math.sin(toRadians(solved.C))) / Math.sin(toRadians(solved.A));
          
          steps.push(`sin(B) = b×sin(A)/a = ${solved.b}×sin(${solved.A}°)/${solved.a} = ${sinB.toFixed(4)}`);
          steps.push(`B = arcsin(${sinB.toFixed(4)}) = ${solved.B.toFixed(2)}°`);
          
          // Check for second solution
          if (sinB < 1 && solved.A < 90) {
            const B2 = 180 - solved.B;
            const C2 = 180 - solved.A - B2;
            if (C2 > 0) {
              steps.push(`Second solution: B = ${B2.toFixed(2)}°, C = ${C2.toFixed(2)}°`);
            }
          }
        }
      }
      // SAS case - use Law of Cosines first, then Law of Sines
      else if (knownSides === 2 && knownAngles === 1) {
        solutionType = 'SAS';
        steps.push('Use Law of Cosines first, then Law of Sines');
        // This would require Law of Cosines implementation
      }

      // Calculate area using formula: Area = (1/2)ab*sin(C)
      let area = 0;
      if (solved.a && solved.b && solved.C) {
        area = 0.5 * solved.a * solved.b * Math.sin(toRadians(solved.C));
      } else if (solved.b && solved.c && solved.A) {
        area = 0.5 * solved.b * solved.c * Math.sin(toRadians(solved.A));
      } else if (solved.a && solved.c && solved.B) {
        area = 0.5 * solved.a * solved.c * Math.sin(toRadians(solved.B));
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
      setResult({ error: 'Unable to solve with given values' });
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
        <span className="text-gray-900 font-medium">Law of Sines Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Triangle className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Law of Sines Calculator</h1>
        </div>

        {/* Formula Display */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Law of Sines Formula</h3>
          <div className="text-2xl font-mono text-blue-800">
            a/sin(A) = b/sin(B) = c/sin(C)
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side b</label>
                <input
                  type="number"
                  value={knownValues.b}
                  onChange={(e) => updateValue('b', e.target.value)}
                  placeholder="Enter side b"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Side c</label>
                <input
                  type="number"
                  value={knownValues.c}
                  onChange={(e) => updateValue('c', e.target.value)}
                  placeholder="Enter side c"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  value={knownValues.A}
                  onChange={(e) => updateValue('A', e.target.value)}
                  placeholder="Enter angle A"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle B</label>
                <input
                  type="number"
                  value={knownValues.B}
                  onChange={(e) => updateValue('B', e.target.value)}
                  placeholder="Enter angle B"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Angle C</label>
                <input
                  type="number"
                  value={knownValues.C}
                  onChange={(e) => updateValue('C', e.target.value)}
                  placeholder="Enter angle C"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
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
                  <div className="text-xl font-bold text-blue-600">{result.area}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Perimeter</div>
                  <div className="text-xl font-bold text-green-600">{result.perimeter}</div>
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Solution Steps</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">When to Use Law of Sines</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Applicable Cases</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• ASA: Two angles and included side</li>
                <li>• AAS: Two angles and non-included side</li>
                <li>• SSA: Two sides and non-included angle (ambiguous)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Requirements</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• At least 3 known values</li>
                <li>• At least one side-angle pair</li>
                <li>• Angles must sum to 180°</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawOfSinesCalculator;