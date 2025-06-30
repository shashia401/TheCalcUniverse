import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Grid3X3 } from 'lucide-react';

const SystemOfEquations: React.FC = () => {
  const [systemSize, setSystemSize] = useState<2 | 3>(2);
  const [coefficients, setCoefficients] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<any>(null);

  const solve2x2System = (a1: number, b1: number, c1: number, a2: number, b2: number, c2: number) => {
    const determinant = a1 * b2 - a2 * b1;
    
    const steps = [
      `System of equations:`,
      `${a1}x + ${b1}y = ${c1}`,
      `${a2}x + ${b2}y = ${c2}`,
      ``,
      `Using Cramer's rule:`,
      `Main determinant: D = |${a1} ${b1}| = ${a1}(${b2}) - ${b1}(${a2}) = ${determinant}`,
      `                      |${a2} ${b2}|`
    ];

    if (Math.abs(determinant) < 1e-10) {
      // Check if system is inconsistent or has infinite solutions
      const ratio1 = Math.abs(a2) > 1e-10 ? a1 / a2 : (Math.abs(a1) > 1e-10 ? Infinity : 1);
      const ratio2 = Math.abs(b2) > 1e-10 ? b1 / b2 : (Math.abs(b1) > 1e-10 ? Infinity : 1);
      const ratio3 = Math.abs(c2) > 1e-10 ? c1 / c2 : (Math.abs(c1) > 1e-10 ? Infinity : 1);

      if (Math.abs(ratio1 - ratio2) < 1e-10 && Math.abs(ratio2 - ratio3) < 1e-10) {
        steps.push(`D = 0 and ratios are equal: Infinite solutions`);
        return { type: 'infinite', steps };
      } else {
        steps.push(`D = 0 and ratios are not equal: No solution`);
        return { type: 'no-solution', steps };
      }
    }

    const dx = c1 * b2 - c2 * b1;
    const dy = a1 * c2 - a2 * c1;
    
    const x = dx / determinant;
    const y = dy / determinant;

    steps.push(`Dx = |${c1} ${b1}| = ${c1}(${b2}) - ${b1}(${c2}) = ${dx}`);
    steps.push(`     |${c2} ${b2}|`);
    steps.push(`Dy = |${a1} ${c1}| = ${a1}(${c2}) - ${c1}(${a2}) = ${dy}`);
    steps.push(`     |${a2} ${c2}|`);
    steps.push(`x = Dx/D = ${dx}/${determinant} = ${x.toFixed(6)}`);
    steps.push(`y = Dy/D = ${dy}/${determinant} = ${y.toFixed(6)}`);

    // Verification
    const check1 = a1 * x + b1 * y;
    const check2 = a2 * x + b2 * y;
    steps.push(`Verification:`);
    steps.push(`Equation 1: ${a1}(${x.toFixed(6)}) + ${b1}(${y.toFixed(6)}) = ${check1.toFixed(6)} ≈ ${c1}`);
    steps.push(`Equation 2: ${a2}(${x.toFixed(6)}) + ${b2}(${y.toFixed(6)}) = ${check2.toFixed(6)} ≈ ${c2}`);

    return {
      type: 'solution',
      solutions: { x, y },
      determinant,
      steps
    };
  };

  const solve3x3System = (
    a1: number, b1: number, c1: number, d1: number,
    a2: number, b2: number, c2: number, d2: number,
    a3: number, b3: number, c3: number, d3: number
  ) => {
    // Calculate main determinant using cofactor expansion
    const det = a1 * (b2 * c3 - b3 * c2) - b1 * (a2 * c3 - a3 * c2) + c1 * (a2 * b3 - a3 * b2);
    
    const steps = [
      `System of equations:`,
      `${a1}x + ${b1}y + ${c1}z = ${d1}`,
      `${a2}x + ${b2}y + ${c2}z = ${d2}`,
      `${a3}x + ${b3}y + ${c3}z = ${d3}`,
      ``,
      `Main determinant D = ${det.toFixed(6)}`
    ];

    if (Math.abs(det) < 1e-10) {
      steps.push(`D ≈ 0: System has no unique solution`);
      return { type: 'no-unique-solution', steps };
    }

    // Calculate determinants for x, y, z using Cramer's rule
    const detX = d1 * (b2 * c3 - b3 * c2) - b1 * (d2 * c3 - d3 * c2) + c1 * (d2 * b3 - d3 * b2);
    const detY = a1 * (d2 * c3 - d3 * c2) - d1 * (a2 * c3 - a3 * c2) + c1 * (a2 * d3 - a3 * d2);
    const detZ = a1 * (b2 * d3 - b3 * d2) - b1 * (a2 * d3 - a3 * d2) + d1 * (a2 * b3 - a3 * b2);

    const x = detX / det;
    const y = detY / det;
    const z = detZ / det;

    steps.push(`Using Cramer's rule:`);
    steps.push(`Dx = ${detX.toFixed(6)}`);
    steps.push(`Dy = ${detY.toFixed(6)}`);
    steps.push(`Dz = ${detZ.toFixed(6)}`);
    steps.push(`x = Dx/D = ${x.toFixed(6)}`);
    steps.push(`y = Dy/D = ${y.toFixed(6)}`);
    steps.push(`z = Dz/D = ${z.toFixed(6)}`);

    // Verification
    const check1 = a1 * x + b1 * y + c1 * z;
    const check2 = a2 * x + b2 * y + c2 * z;
    const check3 = a3 * x + b3 * y + c3 * z;
    steps.push(`Verification:`);
    steps.push(`Equation 1: ${check1.toFixed(6)} ≈ ${d1}`);
    steps.push(`Equation 2: ${check2.toFixed(6)} ≈ ${d2}`);
    steps.push(`Equation 3: ${check3.toFixed(6)} ≈ ${d3}`);

    return {
      type: 'solution',
      solutions: { x, y, z },
      determinant: det,
      steps
    };
  };

  const solveSystem = () => {
    if (systemSize === 2) {
      const a1 = parseFloat(coefficients.a1) || 0;
      const b1 = parseFloat(coefficients.b1) || 0;
      const c1 = parseFloat(coefficients.c1) || 0;
      const a2 = parseFloat(coefficients.a2) || 0;
      const b2 = parseFloat(coefficients.b2) || 0;
      const c2 = parseFloat(coefficients.c2) || 0;

      const solution = solve2x2System(a1, b1, c1, a2, b2, c2);
      setResult(solution);
    } else {
      const a1 = parseFloat(coefficients.a1) || 0;
      const b1 = parseFloat(coefficients.b1) || 0;
      const c1 = parseFloat(coefficients.c1) || 0;
      const d1 = parseFloat(coefficients.d1) || 0;
      const a2 = parseFloat(coefficients.a2) || 0;
      const b2 = parseFloat(coefficients.b2) || 0;
      const c2 = parseFloat(coefficients.c2) || 0;
      const d2 = parseFloat(coefficients.d2) || 0;
      const a3 = parseFloat(coefficients.a3) || 0;
      const b3 = parseFloat(coefficients.b3) || 0;
      const c3 = parseFloat(coefficients.c3) || 0;
      const d3 = parseFloat(coefficients.d3) || 0;

      const solution = solve3x3System(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3);
      setResult(solution);
    }
  };

  const updateCoefficient = (key: string, value: string) => {
    setCoefficients(prev => ({ ...prev, [key]: value }));
  };

  const getSystemDisplay = () => {
    if (systemSize === 2) {
      const a1 = coefficients.a1 || 'a₁';
      const b1 = coefficients.b1 || 'b₁';
      const c1 = coefficients.c1 || 'c₁';
      const a2 = coefficients.a2 || 'a₂';
      const b2 = coefficients.b2 || 'b₂';
      const c2 = coefficients.c2 || 'c₂';
      
      return [
        `${a1}x + ${b1}y = ${c1}`,
        `${a2}x + ${b2}y = ${c2}`
      ];
    } else {
      const a1 = coefficients.a1 || 'a₁';
      const b1 = coefficients.b1 || 'b₁';
      const c1 = coefficients.c1 || 'c₁';
      const d1 = coefficients.d1 || 'd₁';
      const a2 = coefficients.a2 || 'a₂';
      const b2 = coefficients.b2 || 'b₂';
      const c2 = coefficients.c2 || 'c₂';
      const d2 = coefficients.d2 || 'd₂';
      const a3 = coefficients.a3 || 'a₃';
      const b3 = coefficients.b3 || 'b₃';
      const c3 = coefficients.c3 || 'c₃';
      const d3 = coefficients.d3 || 'd₃';
      
      return [
        `${a1}x + ${b1}y + ${c1}z = ${d1}`,
        `${a2}x + ${b2}y + ${c2}z = ${d2}`,
        `${a3}x + ${b3}y + ${c3}z = ${d3}`
      ];
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
        <span className="text-gray-900 font-medium">System of Equations</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Grid3X3 className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">System of Equations Solver</h1>
        </div>

        {/* System Size Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">System Size</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => {
                setSystemSize(2);
                setCoefficients({});
                setResult(null);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                systemSize === 2
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">2×2 System</div>
              <div className="text-sm opacity-75">Two equations, two unknowns (x, y)</div>
            </button>
            <button
              onClick={() => {
                setSystemSize(3);
                setCoefficients({});
                setResult(null);
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                systemSize === 3
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">3×3 System</div>
              <div className="text-sm opacity-75">Three equations, three unknowns (x, y, z)</div>
            </button>
          </div>
        </div>

        {/* System Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">System of Equations</h3>
          <div className="space-y-2 font-mono text-lg text-gray-800">
            {getSystemDisplay().map((equation, index) => (
              <div key={index} className="text-center">
                {equation}
              </div>
            ))}
          </div>
        </div>

        {/* Coefficient Inputs */}
        <div className="space-y-6 mb-8">
          {systemSize === 2 ? (
            <>
              {/* First equation */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">First Equation</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">a₁ (coefficient of x)</label>
                    <input
                      type="number"
                      value={coefficients.a1 || ''}
                      onChange={(e) => updateCoefficient('a1', e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">b₁ (coefficient of y)</label>
                    <input
                      type="number"
                      value={coefficients.b1 || ''}
                      onChange={(e) => updateCoefficient('b1', e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">c₁ (constant)</label>
                    <input
                      type="number"
                      value={coefficients.c1 || ''}
                      onChange={(e) => updateCoefficient('c1', e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Second equation */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Second Equation</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">a₂ (coefficient of x)</label>
                    <input
                      type="number"
                      value={coefficients.a2 || ''}
                      onChange={(e) => updateCoefficient('a2', e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">b₂ (coefficient of y)</label>
                    <input
                      type="number"
                      value={coefficients.b2 || ''}
                      onChange={(e) => updateCoefficient('b2', e.target.value)}
                      placeholder="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">c₂ (constant)</label>
                    <input
                      type="number"
                      value={coefficients.c2 || ''}
                      onChange={(e) => updateCoefficient('c2', e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Three equations for 3x3 system */}
              {[1, 2, 3].map((eq) => (
                <div key={eq}>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Equation {eq}</h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">a{eq} (coeff. of x)</label>
                      <input
                        type="number"
                        value={coefficients[`a${eq}`] || ''}
                        onChange={(e) => updateCoefficient(`a${eq}`, e.target.value)}
                        placeholder="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">b{eq} (coeff. of y)</label>
                      <input
                        type="number"
                        value={coefficients[`b${eq}`] || ''}
                        onChange={(e) => updateCoefficient(`b${eq}`, e.target.value)}
                        placeholder="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">c{eq} (coeff. of z)</label>
                      <input
                        type="number"
                        value={coefficients[`c${eq}`] || ''}
                        onChange={(e) => updateCoefficient(`c${eq}`, e.target.value)}
                        placeholder="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">d{eq} (constant)</label>
                      <input
                        type="number"
                        value={coefficients[`d${eq}`] || ''}
                        onChange={(e) => updateCoefficient(`d${eq}`, e.target.value)}
                        placeholder="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Solve Button */}
        <button
          onClick={solveSystem}
          className="w-full md:w-auto px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-lg font-semibold mb-8"
        >
          Solve System
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.type === 'solution' && (
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Solution</h3>
                
                <div className="text-center space-y-2 mb-6">
                  <div className="text-2xl font-bold text-green-600">
                    x = {result.solutions.x.toFixed(6)}
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    y = {result.solutions.y.toFixed(6)}
                  </div>
                  {result.solutions.z !== undefined && (
                    <div className="text-2xl font-bold text-purple-600">
                      z = {result.solutions.z.toFixed(6)}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <div className="text-sm text-gray-600">
                    Determinant: {result.determinant.toFixed(6)}
                  </div>
                </div>
              </div>
            )}

            {(result.type === 'infinite' || result.type === 'no-solution' || result.type === 'no-unique-solution') && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Case</h3>
                <div className="text-xl font-bold text-orange-600">
                  {result.type === 'infinite' && 'Infinite Solutions'}
                  {result.type === 'no-solution' && 'No Solution'}
                  {result.type === 'no-unique-solution' && 'No Unique Solution'}
                </div>
              </div>
            )}

            {/* Steps */}
            {result.steps && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
                <div className="space-y-2">
                  {result.steps.map((step: string, index: number) => (
                    <div key={index} className="font-mono text-sm text-gray-700">
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Solution Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Cramer's Rule</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Uses determinants to solve systems</li>
                <li>• Works when main determinant ≠ 0</li>
                <li>• Provides exact solutions</li>
                <li>• Efficient for small systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">System Types</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Consistent: Has at least one solution</li>
                <li>• Inconsistent: Has no solution</li>
                <li>• Dependent: Has infinite solutions</li>
                <li>• Independent: Has a unique solution</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemOfEquations;