import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Scale } from 'lucide-react';

const ProportionCalculator: React.FC = () => {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [c, setC] = useState('');
  const [d, setD] = useState('');
  const [solveFor, setSolveFor] = useState<'a' | 'b' | 'c' | 'd'>('d');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    solveProportion();
  }, [a, b, c, d, solveFor]);

  const solveProportion = () => {
    const values = { a: parseFloat(a), b: parseFloat(b), c: parseFloat(c), d: parseFloat(d) };
    
    // Count how many values we have
    const filledValues = Object.values(values).filter(v => !isNaN(v)).length;
    
    if (filledValues < 3) {
      setResult(null);
      return;
    }

    let solution: number;
    let steps: string[] = [];

    try {
      switch (solveFor) {
        case 'a':
          if (!isNaN(values.b) && !isNaN(values.c) && !isNaN(values.d)) {
            solution = (values.b * values.c) / values.d;
            steps = [
              `Solving for a in the proportion: a/b = c/d`,
              `Cross multiply: a × d = b × c`,
              `a × ${values.d} = ${values.b} × ${values.c}`,
              `a × ${values.d} = ${values.b * values.c}`,
              `a = ${values.b * values.c} ÷ ${values.d}`,
              `a = ${solution.toFixed(6)}`
            ];
          } else {
            setResult(null);
            return;
          }
          break;

        case 'b':
          if (!isNaN(values.a) && !isNaN(values.c) && !isNaN(values.d)) {
            solution = (values.a * values.d) / values.c;
            steps = [
              `Solving for b in the proportion: a/b = c/d`,
              `Cross multiply: a × d = b × c`,
              `${values.a} × ${values.d} = b × ${values.c}`,
              `${values.a * values.d} = b × ${values.c}`,
              `b = ${values.a * values.d} ÷ ${values.c}`,
              `b = ${solution.toFixed(6)}`
            ];
          } else {
            setResult(null);
            return;
          }
          break;

        case 'c':
          if (!isNaN(values.a) && !isNaN(values.b) && !isNaN(values.d)) {
            solution = (values.a * values.d) / values.b;
            steps = [
              `Solving for c in the proportion: a/b = c/d`,
              `Cross multiply: a × d = b × c`,
              `${values.a} × ${values.d} = ${values.b} × c`,
              `${values.a * values.d} = ${values.b} × c`,
              `c = ${values.a * values.d} ÷ ${values.b}`,
              `c = ${solution.toFixed(6)}`
            ];
          } else {
            setResult(null);
            return;
          }
          break;

        case 'd':
          if (!isNaN(values.a) && !isNaN(values.b) && !isNaN(values.c)) {
            solution = (values.b * values.c) / values.a;
            steps = [
              `Solving for d in the proportion: a/b = c/d`,
              `Cross multiply: a × d = b × c`,
              `${values.a} × d = ${values.b} × ${values.c}`,
              `${values.a} × d = ${values.b * values.c}`,
              `d = ${values.b * values.c} ÷ ${values.a}`,
              `d = ${solution.toFixed(6)}`
            ];
          } else {
            setResult(null);
            return;
          }
          break;

        default:
          return;
      }

      // Verify the proportion
      const finalValues = { ...values };
      finalValues[solveFor] = solution;
      
      const leftRatio = finalValues.a / finalValues.b;
      const rightRatio = finalValues.c / finalValues.d;
      const isValid = Math.abs(leftRatio - rightRatio) < 1e-10;

      setResult({
        solution: solution.toFixed(6),
        solveFor,
        steps,
        verification: {
          leftRatio: leftRatio.toFixed(6),
          rightRatio: rightRatio.toFixed(6),
          isValid
        },
        proportion: `${finalValues.a.toFixed(2)}/${finalValues.b.toFixed(2)} = ${finalValues.c.toFixed(2)}/${finalValues.d.toFixed(2)}`
      });
    } catch (error) {
      setResult({ error: 'Error solving proportion. Check your values.' });
    }
  };

  const examples = [
    { description: 'Recipe scaling', proportion: '2/3 = x/9', answer: 'x = 6' },
    { description: 'Map scale', proportion: '1/50000 = 3/x', answer: 'x = 150000' },
    { description: 'Similar triangles', proportion: '4/6 = 8/x', answer: 'x = 12' },
    { description: 'Unit conversion', proportion: '1/2.54 = x/10', answer: 'x ≈ 3.94' },
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
        <span className="text-gray-900 font-medium">Proportion Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Scale className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Proportion Calculator</h1>
        </div>

        {/* Solve For Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Solve For</label>
          <div className="grid grid-cols-4 gap-3">
            {['a', 'b', 'c', 'd'].map((variable) => (
              <button
                key={variable}
                onClick={() => setSolveFor(variable as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  solveFor === variable
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-lg">{variable}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Proportion Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Proportion: a/b = c/d
          </label>
          <div className="flex items-center justify-center space-x-4">
            <div className="flex flex-col items-center">
              <input
                type="number"
                value={a}
                onChange={(e) => setA(e.target.value)}
                placeholder="a"
                disabled={solveFor === 'a'}
                className={`w-20 h-16 text-center text-lg font-mono border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  solveFor === 'a' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
                }`}
              />
              <div className="text-2xl font-bold text-gray-400 my-2">—</div>
              <input
                type="number"
                value={b}
                onChange={(e) => setB(e.target.value)}
                placeholder="b"
                disabled={solveFor === 'b'}
                className={`w-20 h-16 text-center text-lg font-mono border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  solveFor === 'b' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
                }`}
              />
            </div>

            <div className="text-3xl font-bold text-gray-600">=</div>

            <div className="flex flex-col items-center">
              <input
                type="number"
                value={c}
                onChange={(e) => setC(e.target.value)}
                placeholder="c"
                disabled={solveFor === 'c'}
                className={`w-20 h-16 text-center text-lg font-mono border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  solveFor === 'c' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
                }`}
              />
              <div className="text-2xl font-bold text-gray-400 my-2">—</div>
              <input
                type="number"
                value={d}
                onChange={(e) => setD(e.target.value)}
                placeholder="d"
                disabled={solveFor === 'd'}
                className={`w-20 h-16 text-center text-lg font-mono border-2 rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  solveFor === 'd' ? 'bg-blue-50 border-blue-300' : 'border-gray-300'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Solution</h3>
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {solveFor} = {result.solution}
              </div>
              <div className="text-lg text-gray-600">
                Complete proportion: {result.proportion}
              </div>
            </div>

            {/* Verification */}
            <div className="bg-green-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Verification</h3>
              <div className="text-center">
                <div className="text-lg font-mono text-gray-700 mb-2">
                  Left ratio: {result.verification.leftRatio}
                </div>
                <div className="text-lg font-mono text-gray-700 mb-2">
                  Right ratio: {result.verification.rightRatio}
                </div>
                <div className={`text-lg font-semibold ${
                  result.verification.isValid ? 'text-green-600' : 'text-red-600'
                }`}>
                  {result.verification.isValid ? '✓ Proportion is valid' : '✗ Check your calculations'}
                </div>
              </div>
            </div>

            {/* Steps */}
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
          </div>
        )}

        {/* Error */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Applications</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example, index) => (
              <div key={index} className="bg-white rounded-lg p-4">
                <div className="text-sm font-semibold text-gray-800 mb-1">{example.description}</div>
                <div className="font-mono text-sm text-blue-600">{example.proportion}</div>
                <div className="font-mono text-sm text-green-600">{example.answer}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Proportions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Two ratios that are equal</li>
                <li>• a/b = c/d means a×d = b×c</li>
                <li>• Cross multiplication method</li>
                <li>• Used to find missing values</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Recipe scaling and cooking</li>
                <li>• Map scales and distances</li>
                <li>• Similar triangles in geometry</li>
                <li>• Unit conversions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProportionCalculator;