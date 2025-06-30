import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, FunctionSquare } from 'lucide-react';

const EquationSolver: React.FC = () => {
  const [equationType, setEquationType] = useState<'linear' | 'quadratic' | 'cubic'>('linear');
  const [coefficients, setCoefficients] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<any>(null);

  const solveLinear = (a: number, b: number) => {
    if (a === 0) {
      if (b === 0) {
        return { type: 'infinite', message: 'Infinite solutions (0 = 0)' };
      } else {
        return { type: 'no-solution', message: 'No solution (contradiction)' };
      }
    }
    const x = -b / a;
    return {
      type: 'solution',
      solutions: [x],
      steps: [
        `Original equation: ${a}x + ${b} = 0`,
        `Subtract ${b} from both sides: ${a}x = ${-b}`,
        `Divide by ${a}: x = ${-b}/${a}`,
        `Solution: x = ${x.toFixed(6)}`
      ]
    };
  };

  const solveQuadratic = (a: number, b: number, c: number) => {
    if (a === 0) {
      return solveLinear(b, c);
    }

    const discriminant = b * b - 4 * a * c;
    const steps = [
      `Original equation: ${a}x² + ${b}x + ${c} = 0`,
      `Using quadratic formula: x = (-b ± √(b² - 4ac)) / (2a)`,
      `Discriminant: Δ = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`
    ];

    if (discriminant > 0) {
      const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
      const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
      steps.push(`Two real solutions:`);
      steps.push(`x₁ = (${-b} + √${discriminant}) / ${2 * a} = ${x1.toFixed(6)}`);
      steps.push(`x₂ = (${-b} - √${discriminant}) / ${2 * a} = ${x2.toFixed(6)}`);
      return {
        type: 'solution',
        solutions: [x1, x2],
        discriminant,
        nature: 'Two real and distinct roots',
        steps
      };
    } else if (discriminant === 0) {
      const x = -b / (2 * a);
      steps.push(`One real solution (repeated root):`);
      steps.push(`x = ${-b} / ${2 * a} = ${x.toFixed(6)}`);
      return {
        type: 'solution',
        solutions: [x],
        discriminant,
        nature: 'One real root (repeated)',
        steps
      };
    } else {
      const realPart = -b / (2 * a);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * a);
      steps.push(`Two complex solutions:`);
      steps.push(`x₁ = ${realPart.toFixed(6)} + ${imaginaryPart.toFixed(6)}i`);
      steps.push(`x₂ = ${realPart.toFixed(6)} - ${imaginaryPart.toFixed(6)}i`);
      return {
        type: 'complex',
        solutions: [
          { real: realPart, imaginary: imaginaryPart },
          { real: realPart, imaginary: -imaginaryPart }
        ],
        discriminant,
        nature: 'Two complex roots',
        steps
      };
    }
  };

  const solveCubic = (a: number, b: number, c: number, d: number) => {
    if (a === 0) {
      return solveQuadratic(b, c, d);
    }

    // Simplified cubic solver using Cardano's method (basic implementation)
    // For demonstration purposes, we'll use a numerical approach
    const steps = [
      `Original equation: ${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
      `Using numerical methods to find roots...`
    ];

    // Numerical root finding using Newton's method
    const f = (x: number) => a * x * x * x + b * x * x + c * x + d;
    const df = (x: number) => 3 * a * x * x + 2 * b * x + c;

    const findRoot = (start: number) => {
      let x = start;
      for (let i = 0; i < 100; i++) {
        const fx = f(x);
        const dfx = df(x);
        if (Math.abs(fx) < 1e-10) break;
        if (Math.abs(dfx) < 1e-10) break;
        x = x - fx / dfx;
      }
      return x;
    };

    const roots = [];
    // Try different starting points
    for (let start = -10; start <= 10; start += 0.5) {
      const root = findRoot(start);
      if (Math.abs(f(root)) < 1e-6) {
        const isNew = !roots.some(r => Math.abs(r - root) < 1e-6);
        if (isNew) {
          roots.push(root);
        }
      }
    }

    steps.push(`Found ${roots.length} real root(s)`);
    roots.forEach((root, i) => {
      steps.push(`x${i + 1} = ${root.toFixed(6)}`);
    });

    return {
      type: 'solution',
      solutions: roots,
      steps
    };
  };

  const solveEquation = () => {
    const a = parseFloat(coefficients.a) || 0;
    const b = parseFloat(coefficients.b) || 0;
    const c = parseFloat(coefficients.c) || 0;
    const d = parseFloat(coefficients.d) || 0;

    let solution;
    switch (equationType) {
      case 'linear':
        solution = solveLinear(a, b);
        break;
      case 'quadratic':
        solution = solveQuadratic(a, b, c);
        break;
      case 'cubic':
        solution = solveCubic(a, b, c, d);
        break;
      default:
        return;
    }

    setResult(solution);
  };

  const updateCoefficient = (key: string, value: string) => {
    setCoefficients(prev => ({ ...prev, [key]: value }));
  };

  const getEquationDisplay = () => {
    const a = coefficients.a || 'a';
    const b = coefficients.b || 'b';
    const c = coefficients.c || 'c';
    const d = coefficients.d || 'd';

    switch (equationType) {
      case 'linear':
        return `${a}x + ${b} = 0`;
      case 'quadratic':
        return `${a}x² + ${b}x + ${c} = 0`;
      case 'cubic':
        return `${a}x³ + ${b}x² + ${c}x + ${d} = 0`;
      default:
        return '';
    }
  };

  const formatSolution = (solution: any) => {
    if (typeof solution === 'number') {
      return solution.toFixed(6);
    } else if (solution.real !== undefined) {
      const sign = solution.imaginary >= 0 ? '+' : '-';
      return `${solution.real.toFixed(6)} ${sign} ${Math.abs(solution.imaginary).toFixed(6)}i`;
    }
    return solution.toString();
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
        <span className="text-gray-900 font-medium">Equation Solver</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FunctionSquare className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Equation Solver</h1>
        </div>

        {/* Equation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Equation Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { id: 'linear', name: 'Linear', example: 'ax + b = 0' },
              { id: 'quadratic', name: 'Quadratic', example: 'ax² + bx + c = 0' },
              { id: 'cubic', name: 'Cubic', example: 'ax³ + bx² + cx + d = 0' }
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setEquationType(type.id as any);
                  setCoefficients({});
                  setResult(null);
                }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  equationType === type.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{type.name}</div>
                <div className="text-sm opacity-75 font-mono">{type.example}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Equation Display */}
        <div className="bg-gray-50 rounded-lg p-4 mb-8 text-center">
          <div className="text-2xl font-mono text-gray-800">
            {getEquationDisplay()}
          </div>
        </div>

        {/* Coefficient Inputs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coefficient {equationType === 'linear' ? 'a' : equationType === 'quadratic' ? 'a' : 'a'} 
              {equationType === 'cubic' && ' (x³)'}
              {equationType === 'quadratic' && ' (x²)'}
              {equationType === 'linear' && ' (x)'}
            </label>
            <input
              type="number"
              value={coefficients.a || ''}
              onChange={(e) => updateCoefficient('a', e.target.value)}
              placeholder="Enter coefficient"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coefficient {equationType === 'linear' ? 'b' : 'b'}
              {equationType === 'cubic' && ' (x²)'}
              {equationType === 'quadratic' && ' (x)'}
              {equationType === 'linear' && ' (constant)'}
            </label>
            <input
              type="number"
              value={coefficients.b || ''}
              onChange={(e) => updateCoefficient('b', e.target.value)}
              placeholder="Enter coefficient"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>

          {(equationType === 'quadratic' || equationType === 'cubic') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coefficient c
                {equationType === 'cubic' && ' (x)'}
                {equationType === 'quadratic' && ' (constant)'}
              </label>
              <input
                type="number"
                value={coefficients.c || ''}
                onChange={(e) => updateCoefficient('c', e.target.value)}
                placeholder="Enter coefficient"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          )}

          {equationType === 'cubic' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coefficient d (constant)
              </label>
              <input
                type="number"
                value={coefficients.d || ''}
                onChange={(e) => updateCoefficient('d', e.target.value)}
                placeholder="Enter coefficient"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          )}
        </div>

        {/* Solve Button */}
        <button
          onClick={solveEquation}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold mb-8"
        >
          Solve Equation
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.type === 'solution' && (
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Solution</h3>
                
                <div className="text-center mb-6">
                  {result.solutions.length === 1 ? (
                    <div className="text-3xl font-bold text-blue-600">
                      x = {formatSolution(result.solutions[0])}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {result.solutions.map((sol: any, index: number) => (
                        <div key={index} className="text-2xl font-bold text-blue-600">
                          x{index + 1} = {formatSolution(sol)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {result.nature && (
                  <div className="text-center mb-4">
                    <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {result.nature}
                    </span>
                  </div>
                )}

                {result.discriminant !== undefined && (
                  <div className="text-center mb-4">
                    <div className="text-sm text-gray-600">
                      Discriminant: {result.discriminant.toFixed(4)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {result.type === 'complex' && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Complex Solutions</h3>
                <div className="text-center space-y-2">
                  {result.solutions.map((sol: any, index: number) => (
                    <div key={index} className="text-2xl font-bold text-purple-600">
                      x{index + 1} = {formatSolution(sol)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(result.type === 'infinite' || result.type === 'no-solution') && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Special Case</h3>
                <div className="text-xl font-bold text-orange-600">
                  {result.message}
                </div>
              </div>
            )}

            {/* Steps */}
            {result.steps && (
              <div className="bg-gray-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
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
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Equation Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Linear Equations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Form: ax + b = 0</li>
                <li>• One solution (if a ≠ 0)</li>
                <li>• No solution or infinite solutions (if a = 0)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Quadratic Equations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Form: ax² + bx + c = 0</li>
                <li>• Uses quadratic formula</li>
                <li>• 0, 1, or 2 real solutions</li>
                <li>• May have complex solutions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Cubic Equations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Form: ax³ + bx² + cx + d = 0</li>
                <li>• Uses numerical methods</li>
                <li>• 1 to 3 real solutions</li>
                <li>• More complex to solve</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquationSolver;