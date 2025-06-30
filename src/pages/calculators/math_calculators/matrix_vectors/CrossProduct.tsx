import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowRight } from 'lucide-react';

const CrossProduct: React.FC = () => {
  const [vector1, setVector1] = useState({ x: '', y: '', z: '' });
  const [vector2, setVector2] = useState({ x: '', y: '', z: '' });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateCrossProduct();
  }, [vector1, vector2]);

  const calculateCrossProduct = () => {
    try {
      const v1 = {
        x: parseFloat(vector1.x) || 0,
        y: parseFloat(vector1.y) || 0,
        z: parseFloat(vector1.z) || 0
      };
      
      const v2 = {
        x: parseFloat(vector2.x) || 0,
        y: parseFloat(vector2.y) || 0,
        z: parseFloat(vector2.z) || 0
      };
      
      // Calculate cross product
      const crossProduct = {
        x: v1.y * v2.z - v1.z * v2.y,
        y: v1.z * v2.x - v1.x * v2.z,
        z: v1.x * v2.y - v1.y * v2.x
      };
      
      // Calculate magnitude of cross product
      const magnitude = Math.sqrt(
        crossProduct.x * crossProduct.x + 
        crossProduct.y * crossProduct.y + 
        crossProduct.z * crossProduct.z
      );
      
      // Calculate magnitudes of input vectors
      const magV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
      const magV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
      
      // Calculate the angle between vectors
      const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
      const cosTheta = dotProduct / (magV1 * magV2);
      const angle = Math.acos(Math.min(Math.max(cosTheta, -1), 1)) * (180 / Math.PI);
      
      // Calculate the area of the parallelogram
      const area = magnitude;
      
      // Generate steps
      const steps = [
        `Step 1: Identify the vectors`,
        `v₁ = [${v1.x}, ${v1.y}, ${v1.z}]`,
        `v₂ = [${v2.x}, ${v2.y}, ${v2.z}]`,
        
        `Step 2: Calculate the cross product using the formula:`,
        `v₁ × v₂ = [v₁.y×v₂.z - v₁.z×v₂.y, v₁.z×v₂.x - v₁.x×v₂.z, v₁.x×v₂.y - v₁.y×v₂.x]`,
        
        `Step 3: Compute each component`,
        `x-component = v₁.y×v₂.z - v₁.z×v₂.y = ${v1.y}×${v2.z} - ${v1.z}×${v2.y} = ${crossProduct.x}`,
        `y-component = v₁.z×v₂.x - v₁.x×v₂.z = ${v1.z}×${v2.x} - ${v1.x}×${v2.z} = ${crossProduct.y}`,
        `z-component = v₁.x×v₂.y - v₁.y×v₂.x = ${v1.x}×${v2.y} - ${v1.y}×${v2.x} = ${crossProduct.z}`,
        
        `Step 4: The cross product is [${crossProduct.x}, ${crossProduct.y}, ${crossProduct.z}]`,
        
        `Step 5: Calculate the magnitude of the cross product`,
        `|v₁ × v₂| = √(${crossProduct.x}² + ${crossProduct.y}² + ${crossProduct.z}²)`,
        `|v₁ × v₂| = √(${crossProduct.x * crossProduct.x} + ${crossProduct.y * crossProduct.y} + ${crossProduct.z * crossProduct.z})`,
        `|v₁ × v₂| = √${crossProduct.x * crossProduct.x + crossProduct.y * crossProduct.y + crossProduct.z * crossProduct.z}`,
        `|v₁ × v₂| = ${magnitude}`
      ];
      
      setResult({
        crossProduct,
        magnitude,
        angle,
        area,
        steps,
        v1,
        v2,
        magV1,
        magV2
      });
    } catch (error) {
      setResult({ error: "Error in calculation" });
    }
  };

  const updateVector = (vector: 'v1' | 'v2', component: 'x' | 'y' | 'z', value: string) => {
    if (vector === 'v1') {
      setVector1({ ...vector1, [component]: value });
    } else {
      setVector2({ ...vector2, [component]: value });
    }
  };

  const examples = [
    { v1: { x: 1, y: 0, z: 0 }, v2: { x: 0, y: 1, z: 0 }, description: "i × j = k" },
    { v1: { x: 0, y: 1, z: 0 }, v2: { x: 0, y: 0, z: 1 }, description: "j × k = i" },
    { v1: { x: 0, y: 0, z: 1 }, v2: { x: 1, y: 0, z: 0 }, description: "k × i = j" },
    { v1: { x: 2, y: 3, z: 4 }, v2: { x: 5, y: 6, z: 7 }, description: "General vectors" },
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
        <span className="text-gray-900 font-medium">Cross Product</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <ArrowRight className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Cross Product Calculator</h1>
        </div>

        {/* Vector Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vector 1</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">x component</label>
                <input
                  type="number"
                  value={vector1.x}
                  onChange={(e) => updateVector('v1', 'x', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">y component</label>
                <input
                  type="number"
                  value={vector1.y}
                  onChange={(e) => updateVector('v1', 'y', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">z component</label>
                <input
                  type="number"
                  value={vector1.z}
                  onChange={(e) => updateVector('v1', 'z', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vector 2</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">x component</label>
                <input
                  type="number"
                  value={vector2.x}
                  onChange={(e) => updateVector('v2', 'x', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">y component</label>
                <input
                  type="number"
                  value={vector2.y}
                  onChange={(e) => updateVector('v2', 'y', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">z component</label>
                <input
                  type="number"
                  value={vector2.z}
                  onChange={(e) => updateVector('v2', 'z', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
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
                  <span className="ml-2 font-mono">
                    [{ex.v1.x}, {ex.v1.y}, {ex.v1.z}] × [{ex.v2.x}, {ex.v2.y}, {ex.v2.z}]
                  </span>
                </div>
                <button
                  onClick={() => {
                    setVector1({
                      x: ex.v1.x.toString(),
                      y: ex.v1.y.toString(),
                      z: ex.v1.z.toString()
                    });
                    setVector2({
                      x: ex.v2.x.toString(),
                      y: ex.v2.y.toString(),
                      z: ex.v2.z.toString()
                    });
                  }}
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Try This Example
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Cross Product Result</h3>
              
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-green-600 mb-2 font-mono">
                  [{result.crossProduct.x.toFixed(4)}, {result.crossProduct.y.toFixed(4)}, {result.crossProduct.z.toFixed(4)}]
                </div>
                <div className="text-gray-600">
                  v₁ × v₂ = [{result.v1.x}, {result.v1.y}, {result.v1.z}] × [{result.v2.x}, {result.v2.y}, {result.v2.z}]
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Magnitude</div>
                  <div className="text-xl font-bold text-green-600">{result.magnitude.toFixed(4)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle Between Vectors</div>
                  <div className="text-xl font-bold text-teal-600">{result.angle.toFixed(2)}°</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Parallelogram Area</div>
                  <div className="text-xl font-bold text-blue-600">{result.area.toFixed(4)}</div>
                </div>
              </div>
            </div>

            {/* Geometric Interpretation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Geometric Interpretation</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Direction</span>
                  <span className="font-medium">Perpendicular to both input vectors</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Magnitude</span>
                  <span className="font-medium">
                    |v₁|×|v₂|×sin(θ) = {result.magV1.toFixed(4)}×{result.magV2.toFixed(4)}×sin({result.angle.toFixed(2)}°)
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Right-Hand Rule</span>
                  <span className="font-medium">
                    Curl fingers from v₁ to v₂, thumb points in cross product direction
                  </span>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Cross Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• The cross product of two vectors is a vector perpendicular to both</li>
                <li>• Denoted as v₁ × v₂</li>
                <li>• Only defined for 3D vectors</li>
                <li>• Direction follows the right-hand rule</li>
                <li>• Magnitude equals the area of the parallelogram formed by the two vectors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Anti-commutative: v₁ × v₂ = -(v₂ × v₁)</li>
                <li>• Distributive: v₁ × (v₂ + v₃) = v₁ × v₂ + v₁ × v₃</li>
                <li>• Not associative: (v₁ × v₂) × v₃ ≠ v₁ × (v₂ × v₃)</li>
                <li>• Scalar multiplication: (kv₁) × v₂ = k(v₁ × v₂)</li>
                <li>• Parallel vectors have zero cross product</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Formula</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• v₁ × v₂ = [v₁.y×v₂.z - v₁.z×v₂.y, v₁.z×v₂.x - v₁.x×v₂.z, v₁.x×v₂.y - v₁.y×v₂.x]</li>
                <li>• Determinant form:
                  <pre className="mt-1">
                    |i  j  k |<br/>
                    |x₁ y₁ z₁|<br/>
                    |x₂ y₂ z₂|
                  </pre>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Finding normal vectors to planes</li>
                <li>• Calculating torque in physics</li>
                <li>• Computing angular momentum</li>
                <li>• Determining orientation in 3D graphics</li>
                <li>• Finding areas of parallelograms and triangles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossProduct;