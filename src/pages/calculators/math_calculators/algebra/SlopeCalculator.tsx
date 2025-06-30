import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp } from 'lucide-react';

const SlopeCalculator: React.FC = () => {
  const [x1, setX1] = useState('');
  const [y1, setY1] = useState('');
  const [x2, setX2] = useState('');
  const [y2, setY2] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateSlope();
  }, [x1, y1, x2, y2]);

  const calculateSlope = () => {
    const point1X = parseFloat(x1);
    const point1Y = parseFloat(y1);
    const point2X = parseFloat(x2);
    const point2Y = parseFloat(y2);

    if (isNaN(point1X) || isNaN(point1Y) || isNaN(point2X) || isNaN(point2Y)) {
      setResult(null);
      return;
    }

    if (point1X === point2X && point1Y === point2Y) {
      setResult({
        error: "Points are identical. Slope is undefined for identical points."
      });
      return;
    }

    if (point1X === point2X) {
      setResult({
        slope: "Undefined",
        isVertical: true,
        equation: `x = ${point1X}`,
        steps: [
          `Given points: (${point1X}, ${point1Y}) and (${point2X}, ${point2Y})`,
          `Since x₁ = x₂ = ${point1X}, the line is vertical`,
          `Slope is undefined for vertical lines`,
          `Equation of the line: x = ${point1X}`
        ],
        angle: 90,
        perpendicular: 0
      });
      return;
    }

    const slope = (point2Y - point1Y) / (point2X - point1X);
    const yIntercept = point1Y - slope * point1X;
    
    // Calculate angle with x-axis in degrees
    const angleRadians = Math.atan(slope);
    const angleDegrees = angleRadians * (180 / Math.PI);
    
    // Calculate perpendicular slope
    const perpendicularSlope = slope !== 0 ? -1 / slope : "Undefined";
    
    // Generate equation of the line
    let equation = '';
    if (slope === 0) {
      equation = `y = ${yIntercept}`;
    } else {
      const formattedSlope = Number.isInteger(slope) ? slope : slope.toFixed(4);
      const formattedIntercept = Number.isInteger(yIntercept) ? yIntercept : yIntercept.toFixed(4);
      
      if (yIntercept === 0) {
        equation = `y = ${formattedSlope}x`;
      } else if (yIntercept > 0) {
        equation = `y = ${formattedSlope}x + ${formattedIntercept}`;
      } else {
        equation = `y = ${formattedSlope}x - ${Math.abs(yIntercept).toFixed(4)}`;
      }
    }
    
    // Generate point-slope form
    const pointSlopeForm = `y - ${point1Y} = ${slope.toFixed(4)}(x - ${point1X})`;
    
    // Generate steps
    const steps = [
      `Given points: (${point1X}, ${point1Y}) and (${point2X}, ${point2Y})`,
      `Calculate slope using the formula: m = (y₂ - y₁) / (x₂ - x₁)`,
      `m = (${point2Y} - ${point1Y}) / (${point2X} - ${point1X})`,
      `m = ${point2Y - point1Y} / ${point2X - point1X}`,
      `m = ${slope.toFixed(6)}`,
      `Calculate y-intercept using point-slope form: y - y₁ = m(x - x₁)`,
      `Substitute point (${point1X}, ${point1Y}) and m = ${slope.toFixed(4)}:`,
      `y - ${point1Y} = ${slope.toFixed(4)}(x - ${point1X})`,
      `Solve for y: y = ${slope.toFixed(4)}x + ${yIntercept.toFixed(4)}`,
      `Equation of the line: ${equation}`
    ];
    
    setResult({
      slope: slope,
      yIntercept: yIntercept,
      equation: equation,
      pointSlopeForm: pointSlopeForm,
      angle: angleDegrees,
      perpendicular: perpendicularSlope,
      steps: steps
    });
  };

  const examples = [
    { x1: '1', y1: '2', x2: '4', y2: '8', description: 'Positive slope' },
    { x1: '2', y1: '5', x2: '6', y2: '1', description: 'Negative slope' },
    { x1: '0', y1: '3', x2: '5', y2: '3', description: 'Horizontal line' },
    { x1: '4', y1: '0', x2: '4', y2: '7', description: 'Vertical line' },
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
        <span className="text-gray-900 font-medium">Slope Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Slope Calculator</h1>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Enter Two Points</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Point 1</h4>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">x₁</label>
                  <input
                    type="number"
                    value={x1}
                    onChange={(e) => setX1(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">y₁</label>
                  <input
                    type="number"
                    value={y1}
                    onChange={(e) => setY1(e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Point 2</h4>
              <div className="flex space-x-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">x₂</label>
                  <input
                    type="number"
                    value={x2}
                    onChange={(e) => setX2(e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">y₂</label>
                  <input
                    type="number"
                    value={y2}
                    onChange={(e) => setY2(e.target.value)}
                    placeholder="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examples.map((ex, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="text-sm mb-2">
                  <span className="font-medium">{ex.description}:</span>
                  <span className="ml-2 font-mono">({ex.x1}, {ex.y1}) to ({ex.x2}, {ex.y2})</span>
                </div>
                <button
                  onClick={() => {
                    setX1(ex.x1);
                    setY1(ex.y1);
                    setX2(ex.x2);
                    setY2(ex.y2);
                  }}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  Try This Example
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {result.error}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Slope Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">Slope (m)</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {result.isVertical ? 'Undefined' : typeof result.slope === 'number' ? result.slope.toFixed(4) : result.slope}
                    </div>
                    {!result.isVertical && (
                      <div className="mt-2 text-sm text-gray-600">
                        {result.slope > 0 ? 'Increasing' : result.slope < 0 ? 'Decreasing' : 'Horizontal'}
                      </div>
                    )}
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 text-center">
                    <div className="text-sm text-gray-600 mb-2">Angle with x-axis</div>
                    <div className="text-3xl font-bold text-cyan-600">
                      {result.angle.toFixed(2)}°
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-sm text-gray-600 mb-2">Equation of the Line</div>
                    <div className="text-xl font-mono text-blue-600 text-center">
                      {result.equation}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6">
                    <div className="text-sm text-gray-600 mb-2">Point-Slope Form</div>
                    <div className="text-xl font-mono text-cyan-600 text-center">
                      {result.isVertical ? 'N/A' : result.pointSlopeForm}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-6">
                  <div className="text-sm text-gray-600 mb-2">Perpendicular Slope</div>
                  <div className="text-xl font-mono text-purple-600 text-center">
                    {typeof result.perpendicular === 'number' ? result.perpendicular.toFixed(4) : result.perpendicular}
                  </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Slope Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Slope Formula</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• m = (y₂ - y₁) / (x₂ - x₁)</li>
                <li>• Measures steepness of a line</li>
                <li>• Rise over run</li>
                <li>• Undefined for vertical lines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Line Equations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Slope-intercept: y = mx + b</li>
                <li>• Point-slope: y - y₁ = m(x - x₁)</li>
                <li>• General form: Ax + By + C = 0</li>
                <li>• Vertical line: x = a</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Slope Interpretations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Positive: Line rises from left to right</li>
                <li>• Negative: Line falls from left to right</li>
                <li>• Zero: Horizontal line</li>
                <li>• Undefined: Vertical line</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Perpendicular & Parallel Lines</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Parallel lines: Same slope</li>
                <li>• Perpendicular lines: Product of slopes = -1</li>
                <li>• Perpendicular slope = -1/m</li>
                <li>• Horizontal ⊥ Vertical</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SlopeCalculator;