import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Target } from 'lucide-react';

const DotProduct: React.FC = () => {
  const [dimension, setDimension] = useState<'2d' | '3d'>('3d');
  const [vector1, setVector1] = useState({ x: '', y: '', z: '' });
  const [vector2, setVector2] = useState({ x: '', y: '', z: '' });
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateDotProduct();
  }, [dimension, vector1, vector2]);

  const calculateDotProduct = () => {
    try {
      const v1 = {
        x: parseFloat(vector1.x) || 0,
        y: parseFloat(vector1.y) || 0,
        z: dimension === '3d' ? (parseFloat(vector1.z) || 0) : 0
      };
      
      const v2 = {
        x: parseFloat(vector2.x) || 0,
        y: parseFloat(vector2.y) || 0,
        z: dimension === '3d' ? (parseFloat(vector2.z) || 0) : 0
      };
      
      // Calculate dot product
      const dotProduct = v1.x * v2.x + v1.y * v2.y + (dimension === '3d' ? v1.z * v2.z : 0);
      
      // Calculate magnitudes
      const magV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + (dimension === '3d' ? v1.z * v1.z : 0));
      const magV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + (dimension === '3d' ? v2.z * v2.z : 0));
      
      // Calculate angle between vectors
      let angle = 0;
      let areOrthogonal = false;
      let areParallel = false;
      
      if (magV1 > 0 && magV2 > 0) {
        const cosTheta = dotProduct / (magV1 * magV2);
        // Clamp cosTheta to [-1, 1] to avoid numerical errors
        angle = Math.acos(Math.min(Math.max(cosTheta, -1), 1)) * (180 / Math.PI);
        
        // Check if vectors are orthogonal or parallel
        areOrthogonal = Math.abs(dotProduct) < 1e-10;
        areParallel = Math.abs(Math.abs(cosTheta) - 1) < 1e-10;
      }
      
      // Calculate vector projection
      let projection = null;
      if (magV2 > 0) {
        const scalarProjection = dotProduct / magV2;
        projection = {
          scalar: scalarProjection,
          vector: {
            x: (scalarProjection * v2.x) / magV2,
            y: (scalarProjection * v2.y) / magV2,
            z: dimension === '3d' ? (scalarProjection * v2.z) / magV2 : 0
          }
        };
      }
      
      // Generate steps
      const steps = [
        `Step 1: Identify the vectors`,
        dimension === '2d' 
          ? `v₁ = [${v1.x}, ${v1.y}]`
          : `v₁ = [${v1.x}, ${v1.y}, ${v1.z}]`,
        dimension === '2d' 
          ? `v₂ = [${v2.x}, ${v2.y}]`
          : `v₂ = [${v2.x}, ${v2.y}, ${v2.z}]`,
        
        `Step 2: Calculate the dot product using the formula:`,
        dimension === '2d'
          ? `v₁ · v₂ = v₁.x×v₂.x + v₁.y×v₂.y`
          : `v₁ · v₂ = v₁.x×v₂.x + v₁.y×v₂.y + v₁.z×v₂.z`,
        
        `Step 3: Compute the dot product`,
        dimension === '2d'
          ? `v₁ · v₂ = ${v1.x}×${v2.x} + ${v1.y}×${v2.y}`
          : `v₁ · v₂ = ${v1.x}×${v2.x} + ${v1.y}×${v2.y} + ${v1.z}×${v2.z}`,
        dimension === '2d'
          ? `v₁ · v₂ = ${v1.x * v2.x} + ${v1.y * v2.y}`
          : `v₁ · v₂ = ${v1.x * v2.x} + ${v1.y * v2.y} + ${v1.z * v2.z}`,
        `v₁ · v₂ = ${dotProduct}`,
        
        `Step 4: Calculate the magnitudes of the vectors`,
        dimension === '2d'
          ? `|v₁| = √(${v1.x}² + ${v1.y}²) = √(${v1.x * v1.x} + ${v1.y * v1.y}) = ${magV1}`
          : `|v₁| = √(${v1.x}² + ${v1.y}² + ${v1.z}²) = √(${v1.x * v1.x} + ${v1.y * v1.y} + ${v1.z * v1.z}) = ${magV1}`,
        dimension === '2d'
          ? `|v₂| = √(${v2.x}² + ${v2.y}²) = √(${v2.x * v2.x} + ${v2.y * v2.y}) = ${magV2}`
          : `|v₂| = √(${v2.x}² + ${v2.y}² + ${v2.z}²) = √(${v2.x * v2.x} + ${v2.y * v2.y} + ${v2.z * v2.z}) = ${magV2}`,
        
        `Step 5: Calculate the angle between the vectors`,
        `cos(θ) = (v₁ · v₂) / (|v₁| × |v₂|) = ${dotProduct} / (${magV1} × ${magV2}) = ${dotProduct / (magV1 * magV2)}`,
        `θ = arccos(${dotProduct / (magV1 * magV2)}) = ${angle}°`
      ];
      
      if (projection) {
        steps.push(`Step 6: Calculate the projection of v₁ onto v₂`);
        steps.push(`Scalar projection = (v₁ · v₂) / |v₂| = ${dotProduct} / ${magV2} = ${projection.scalar}`);
        steps.push(`Vector projection = (scalar projection / |v₂|) × v₂`);
        if (dimension === '2d') {
          steps.push(`Vector projection = [${projection.vector.x}, ${projection.vector.y}]`);
        } else {
          steps.push(`Vector projection = [${projection.vector.x}, ${projection.vector.y}, ${projection.vector.z}]`);
        }
      }
      
      setResult({
        dotProduct,
        angle,
        areOrthogonal,
        areParallel,
        projection,
        steps,
        v1,
        v2,
        magV1,
        magV2,
        dimension
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
    { v1: { x: 1, y: 0, z: 0 }, v2: { x: 0, y: 1, z: 0 }, description: "Orthogonal vectors" },
    { v1: { x: 1, y: 2, z: 3 }, v2: { x: 4, y: 5, z: 6 }, description: "General vectors" },
    { v1: { x: 2, y: 0, z: 0 }, v2: { x: 3, y: 0, z: 0 }, description: "Parallel vectors" },
    { v1: { x: 1, y: 1, z: 1 }, v2: { x: 1, y: -1, z: 0 }, description: "Mixed components" },
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
        <span className="text-gray-900 font-medium">Dot Product</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Target className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Dot Product Calculator</h1>
        </div>

        {/* Dimension Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Dimension</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setDimension('2d')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                dimension === '2d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              2D Vectors
            </button>
            <button
              onClick={() => setDimension('3d')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                dimension === '3d'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              3D Vectors
            </button>
          </div>
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">y component</label>
                <input
                  type="number"
                  value={vector1.y}
                  onChange={(e) => updateVector('v1', 'y', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {dimension === '3d' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">z component</label>
                  <input
                    type="number"
                    value={vector1.z}
                    onChange={(e) => updateVector('v1', 'z', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">y component</label>
                <input
                  type="number"
                  value={vector2.y}
                  onChange={(e) => updateVector('v2', 'y', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              {dimension === '3d' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">z component</label>
                  <input
                    type="number"
                    value={vector2.z}
                    onChange={(e) => updateVector('v2', 'z', e.target.value)}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
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
                    [{ex.v1.x}, {ex.v1.y}, {ex.v1.z}] · [{ex.v2.x}, {ex.v2.y}, {ex.v2.z}]
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
                    setDimension('3d');
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
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Dot Product Result</h3>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {result.dotProduct.toFixed(4)}
                </div>
                <div className="text-gray-600">
                  v₁ · v₂ = {result.dotProduct.toFixed(4)}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Angle Between Vectors</div>
                  <div className="text-xl font-bold text-indigo-600">{result.angle.toFixed(2)}°</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Orthogonal</div>
                  <div className="text-xl font-bold text-green-600">{result.areOrthogonal ? 'Yes' : 'No'}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Parallel</div>
                  <div className="text-xl font-bold text-purple-600">{result.areParallel ? 'Yes' : 'No'}</div>
                </div>
              </div>
            </div>

            {/* Projection */}
            {result.projection && (
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Vector Projection</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Scalar Projection of v₁ onto v₂</div>
                    <div className="text-xl font-bold text-green-600">{result.projection.scalar.toFixed(4)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Vector Projection</div>
                    <div className="text-lg font-mono text-teal-600">
                      {result.dimension === '2d' 
                        ? `[${result.projection.vector.x.toFixed(4)}, ${result.projection.vector.y.toFixed(4)}]`
                        : `[${result.projection.vector.x.toFixed(4)}, ${result.projection.vector.y.toFixed(4)}, ${result.projection.vector.z.toFixed(4)}]`
                      }
                    </div>
                  </div>
                </div>
              </div>
            )}

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

        {/* Error Display */}
        {result?.error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {result.error}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Dot Product</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• The dot product of two vectors is a scalar value</li>
                <li>• Denoted as v₁ · v₂</li>
                <li>• Calculated by multiplying corresponding components and summing</li>
                <li>• Also equals |v₁|×|v₂|×cos(θ) where θ is the angle between vectors</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Commutative: v₁ · v₂ = v₂ · v₁</li>
                <li>• Distributive: v₁ · (v₂ + v₃) = v₁ · v₂ + v₁ · v₃</li>
                <li>• Scalar multiplication: (kv₁) · v₂ = k(v₁ · v₂)</li>
                <li>• Orthogonal vectors have dot product = 0</li>
                <li>• Parallel vectors have dot product = |v₁|×|v₂|</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Formula</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• 2D: v₁ · v₂ = v₁.x×v₂.x + v₁.y×v₂.y</li>
                <li>• 3D: v₁ · v₂ = v₁.x×v₂.x + v₁.y×v₂.y + v₁.z×v₂.z</li>
                <li>• Angle: cos(θ) = (v₁ · v₂) / (|v₁|×|v₂|)</li>
                <li>• Scalar projection: proj_v₂(v₁) = (v₁ · v₂) / |v₂|</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Finding the angle between vectors</li>
                <li>• Projecting one vector onto another</li>
                <li>• Calculating work in physics (F · d)</li>
                <li>• Testing orthogonality</li>
                <li>• Computing the similarity between vectors (in machine learning)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DotProduct;