import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, FunctionSquare } from 'lucide-react';

const QuadraticFormulaCalculator: React.FC = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (a && b && c) {
      calculateQuadratic();
    }
  }, [a, b, c]);

  const calculateQuadratic = () => {
    const aVal = parseFloat(a);
    const bVal = parseFloat(b);
    const cVal = parseFloat(c);

    if (aVal === 0) {
      setResults({ error: 'Coefficient "a" cannot be zero for a quadratic equation' });
      return;
    }

    // Calculate discriminant
    const discriminant = bVal * bVal - 4 * aVal * cVal;

    let roots: any = {};
    let nature = '';

    if (discriminant > 0) {
      // Two real and distinct roots
      const root1 = (-bVal + Math.sqrt(discriminant)) / (2 * aVal);
      const root2 = (-bVal - Math.sqrt(discriminant)) / (2 * aVal);
      roots = { root1, root2 };
      nature = 'Two real and distinct roots';
    } else if (discriminant === 0) {
      // One real root (repeated)
      const root = -bVal / (2 * aVal);
      roots = { root1: root, root2: root };
      nature = 'One real root (repeated)';
    } else {
      // Complex roots
      const realPart = -bVal / (2 * aVal);
      const imaginaryPart = Math.sqrt(-discriminant) / (2 * aVal);
      roots = {
        root1: { real: realPart, imaginary: imaginaryPart },
        root2: { real: realPart, imaginary: -imaginaryPart }
      };
      nature = 'Two complex roots';
    }

    // Calculate vertex
    const vertexX = -bVal / (2 * aVal);
    const vertexY = aVal * vertexX * vertexX + bVal * vertexX + cVal;

    // Calculate y-intercept
    const yIntercept = cVal;

    // Calculate x-intercepts (if real roots exist)
    let xIntercepts = null;
    if (discriminant >= 0) {
      xIntercepts = discriminant === 0 ? [roots.root1] : [roots.root1, roots.root2];
    }

    setResults({
      discriminant,
      roots,
      nature,
      vertex: { x: vertexX, y: vertexY },
      yIntercept,
      xIntercepts,
      equation: `${aVal}x² ${bVal >= 0 ? '+' : ''}${bVal}x ${cVal >= 0 ? '+' : ''}${cVal} = 0`
    });
  };

  const formatRoot = (root: any) => {
    if (typeof root === 'number') {
      return root.toFixed(4);
    } else {
      const real = root.real.toFixed(4);
      const imag = Math.abs(root.imaginary).toFixed(4);
      const sign = root.imaginary >= 0 ? '+' : '-';
      return `${real} ${sign} ${imag}i`;
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
        <span className="text-gray-900 font-medium">Quadratic Formula Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <FunctionSquare className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Quadratic Formula Calculator</h1>
        </div>

        {/* Equation Display */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Standard Form</h3>
          <div className="text-2xl font-mono text-gray-800">
            ax² + bx + c = 0
          </div>
        </div>

        {/* Coefficient Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coefficient a
            </label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              placeholder="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coefficient b
            </label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Coefficient c
            </label>
            <input
              type="number"
              value={c}
              onChange={(e) => setC(e.target.value)}
              placeholder="0"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Current Equation */}
        {a && (
          <div className="bg-blue-50 rounded-lg p-4 mb-8 text-center">
            <div className="text-lg font-mono text-blue-800">
              {results?.equation || `${a}x² ${b ? (parseFloat(b) >= 0 ? '+' : '') + b : ''}x ${c ? (parseFloat(c) >= 0 ? '+' : '') + c : ''} = 0`}
            </div>
          </div>
        )}

        {/* Results */}
        {results && !results.error && (
          <div className="space-y-6">
            {/* Discriminant and Nature */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Discriminant (b² - 4ac)</div>
                  <div className="text-2xl font-bold text-purple-600">{results.discriminant.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-1">Nature of Roots</div>
                  <div className="text-lg font-semibold text-gray-800">{results.nature}</div>
                </div>
              </div>
            </div>

            {/* Roots */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Roots</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Root 1 (x₁)</div>
                  <div className="text-xl font-mono text-green-600">{formatRoot(results.roots.root1)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Root 2 (x₂)</div>
                  <div className="text-xl font-mono text-green-600">{formatRoot(results.roots.root2)}</div>
                </div>
              </div>
            </div>

            {/* Graph Properties */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Graph Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Vertex</div>
                  <div className="text-lg font-mono text-orange-600">
                    ({results.vertex.x.toFixed(4)}, {results.vertex.y.toFixed(4)})
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Y-Intercept</div>
                  <div className="text-lg font-mono text-red-600">{results.yIntercept}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Opens</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {parseFloat(a) > 0 ? 'Upward' : 'Downward'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {results?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {results.error}
          </div>
        )}

        {/* Formula Reference */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Quadratic Formula</h3>
          <div className="text-center">
            <div className="text-xl font-mono text-gray-700 mb-2">
              x = (-b ± √(b² - 4ac)) / (2a)
            </div>
            <div className="text-sm text-gray-600">
              Where the discriminant Δ = b² - 4ac determines the nature of the roots
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadraticFormulaCalculator;