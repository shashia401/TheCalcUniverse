import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowRight } from 'lucide-react';

const VectorCalculator: React.FC = () => {
  const [dimension, setDimension] = useState<'2d' | '3d'>('3d');
  const [operation, setOperation] = useState<'add' | 'subtract' | 'dot' | 'cross' | 'magnitude' | 'normalize' | 'angle'>('add');
  const [vector1, setVector1] = useState({ x: '', y: '', z: '' });
  const [vector2, setVector2] = useState({ x: '', y: '', z: '' });
  const [result, setResult] = useState<any>(null);

  const calculateVector = () => {
    try {
      // Parse vector components
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
      
      // Perform the selected operation
      let resultValue;
      let steps: string[] = [];
      
      switch (operation) {
        case 'add':
          resultValue = {
            x: v1.x + v2.x,
            y: v1.y + v2.y,
            z: v1.z + v2.z
          };
          
          steps = [
            `Vector addition: v₁ + v₂`,
            dimension === '2d' 
              ? `(${v1.x}, ${v1.y}) + (${v2.x}, ${v2.y})`
              : `(${v1.x}, ${v1.y}, ${v1.z}) + (${v2.x}, ${v2.y}, ${v2.z})`,
            `x component: ${v1.x} + ${v2.x} = ${resultValue.x}`,
            `y component: ${v1.y} + ${v2.y} = ${resultValue.y}`
          ];
          
          if (dimension === '3d') {
            steps.push(`z component: ${v1.z} + ${v2.z} = ${resultValue.z}`);
          }
          
          break;
          
        case 'subtract':
          resultValue = {
            x: v1.x - v2.x,
            y: v1.y - v2.y,
            z: v1.z - v2.z
          };
          
          steps = [
            `Vector subtraction: v₁ - v₂`,
            dimension === '2d' 
              ? `(${v1.x}, ${v1.y}) - (${v2.x}, ${v2.y})`
              : `(${v1.x}, ${v1.y}, ${v1.z}) - (${v2.x}, ${v2.y}, ${v2.z})`,
            `x component: ${v1.x} - ${v2.x} = ${resultValue.x}`,
            `y component: ${v1.y} - ${v2.y} = ${resultValue.y}`
          ];
          
          if (dimension === '3d') {
            steps.push(`z component: ${v1.z} - ${v2.z} = ${resultValue.z}`);
          }
          
          break;
          
        case 'dot':
          const dotProduct = v1.x * v2.x + v1.y * v2.y + (dimension === '3d' ? v1.z * v2.z : 0);
          resultValue = dotProduct;
          
          steps = [
            `Dot product: v₁ · v₂`,
            dimension === '2d' 
              ? `(${v1.x}, ${v1.y}) · (${v2.x}, ${v2.y})`
              : `(${v1.x}, ${v1.y}, ${v1.z}) · (${v2.x}, ${v2.y}, ${v2.z})`,
            `v₁ · v₂ = (${v1.x} × ${v2.x}) + (${v1.y} × ${v2.y})${dimension === '3d' ? ` + (${v1.z} × ${v2.z})` : ''}`,
            `v₁ · v₂ = ${v1.x * v2.x} + ${v1.y * v2.y}${dimension === '3d' ? ` + ${v1.z * v2.z}` : ''}`,
            `v₁ · v₂ = ${dotProduct}`
          ];
          
          // Calculate the angle between vectors
          const magV1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
          const magV2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
          
          if (magV1 > 0 && magV2 > 0) {
            const cosTheta = dotProduct / (magV1 * magV2);
            const angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1)); // Clamp to [-1, 1]
            const angleDeg = angleRad * 180 / Math.PI;
            
            steps.push(`The angle between the vectors is: cos⁻¹(${dotProduct}/(${magV1.toFixed(4)} × ${magV2.toFixed(4)})) = ${angleDeg.toFixed(2)}°`);
          }
          
          break;
          
        case 'cross':
          if (dimension === '2d') {
            setResult({ error: "Cross product is only defined for 3D vectors" });
            return;
          }
          
          resultValue = {
            x: v1.y * v2.z - v1.z * v2.y,
            y: v1.z * v2.x - v1.x * v2.z,
            z: v1.x * v2.y - v1.y * v2.x
          };
          
          steps = [
            `Cross product: v₁ × v₂`,
            `(${v1.x}, ${v1.y}, ${v1.z}) × (${v2.x}, ${v2.y}, ${v2.z})`,
            `x component: (${v1.y} × ${v2.z}) - (${v1.z} × ${v2.y}) = ${v1.y * v2.z} - ${v1.z * v2.y} = ${resultValue.x}`,
            `y component: (${v1.z} × ${v2.x}) - (${v1.x} × ${v2.z}) = ${v1.z * v2.x} - ${v1.x * v2.z} = ${resultValue.y}`,
            `z component: (${v1.x} × ${v2.y}) - (${v1.y} × ${v2.x}) = ${v1.x * v2.y} - ${v1.y * v2.x} = ${resultValue.z}`
          ];
          
          // Calculate the magnitude of the cross product
          const crossMagnitude = Math.sqrt(
            resultValue.x * resultValue.x + 
            resultValue.y * resultValue.y + 
            resultValue.z * resultValue.z
          );
          
          // Calculate the magnitudes of the input vectors
          const mag1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
          const mag2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
          
          // Calculate the area of the parallelogram
          const area = crossMagnitude;
          
          steps.push(`The magnitude of the cross product is: ${crossMagnitude.toFixed(4)}`);
          steps.push(`This equals the area of the parallelogram formed by the two vectors`);
          
          break;
          
        case 'magnitude':
          const magnitude = Math.sqrt(
            v1.x * v1.x + 
            v1.y * v1.y + 
            (dimension === '3d' ? v1.z * v1.z : 0)
          );
          
          resultValue = magnitude;
          
          steps = [
            `Magnitude of vector: |v₁|`,
            dimension === '2d' 
              ? `|(${v1.x}, ${v1.y})|`
              : `|(${v1.x}, ${v1.y}, ${v1.z})|`,
            dimension === '2d'
              ? `|v₁| = √(${v1.x}² + ${v1.y}²)`
              : `|v₁| = √(${v1.x}² + ${v1.y}² + ${v1.z}²)`,
            dimension === '2d'
              ? `|v₁| = √(${v1.x * v1.x} + ${v1.y * v1.y})`
              : `|v₁| = √(${v1.x * v1.x} + ${v1.y * v1.y} + ${v1.z * v1.z})`,
            `|v₁| = √${v1.x * v1.x + v1.y * v1.y + (dimension === '3d' ? v1.z * v1.z : 0)}`,
            `|v₁| = ${magnitude}`
          ];
          
          break;
          
        case 'normalize':
          const mag = Math.sqrt(
            v1.x * v1.x + 
            v1.y * v1.y + 
            (dimension === '3d' ? v1.z * v1.z : 0)
          );
          
          if (mag === 0) {
            setResult({ error: "Cannot normalize the zero vector" });
            return;
          }
          
          resultValue = {
            x: v1.x / mag,
            y: v1.y / mag,
            z: dimension === '3d' ? v1.z / mag : 0
          };
          
          steps = [
            `Normalizing vector: v₁/|v₁|`,
            dimension === '2d' 
              ? `(${v1.x}, ${v1.y})/|(${v1.x}, ${v1.y})|`
              : `(${v1.x}, ${v1.y}, ${v1.z})/|(${v1.x}, ${v1.y}, ${v1.z})|`,
            `|v₁| = ${mag}`,
            `x component: ${v1.x}/${mag} = ${resultValue.x}`,
            `y component: ${v1.y}/${mag} = ${resultValue.y}`
          ];
          
          if (dimension === '3d') {
            steps.push(`z component: ${v1.z}/${mag} = ${resultValue.z}`);
          }
          
          // Verify that the magnitude of the normalized vector is 1
          const normalizedMag = Math.sqrt(
            resultValue.x * resultValue.x + 
            resultValue.y * resultValue.y + 
            resultValue.z * resultValue.z
          );
          
          steps.push(`Verification: |normalized vector| = ${normalizedMag.toFixed(10)} ≈ 1`);
          
          break;
          
        case 'angle':
          const magV1Angle = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
          const magV2Angle = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);
          
          if (magV1Angle === 0 || magV2Angle === 0) {
            setResult({ error: "Cannot calculate angle with the zero vector" });
            return;
          }
          
          const dotProductAngle = v1.x * v2.x + v1.y * v2.y + (dimension === '3d' ? v1.z * v2.z : 0);
          const cosTheta = dotProductAngle / (magV1Angle * magV2Angle);
          const angleRad = Math.acos(Math.min(Math.max(cosTheta, -1), 1)); // Clamp to [-1, 1]
          const angleDeg = angleRad * 180 / Math.PI;
          
          resultValue = angleDeg;
          
          steps = [
            `Calculating angle between vectors`,
            dimension === '2d' 
              ? `Between (${v1.x}, ${v1.y}) and (${v2.x}, ${v2.y})`
              : `Between (${v1.x}, ${v1.y}, ${v1.z}) and (${v2.x}, ${v2.y}, ${v2.z})`,
            `Using the formula: cos(θ) = (v₁ · v₂)/(|v₁| × |v₂|)`,
            `v₁ · v₂ = ${dotProductAngle}`,
            `|v₁| = ${magV1Angle}`,
            `|v₂| = ${magV2Angle}`,
            `cos(θ) = ${dotProductAngle}/(${magV1Angle} × ${magV2Angle}) = ${cosTheta}`,
            `θ = cos⁻¹(${cosTheta}) = ${angleRad.toFixed(6)} radians = ${angleDeg.toFixed(2)}°`
          ];
          
          break;
      }
      
      setResult({
        operation,
        dimension,
        vector1: v1,
        vector2: v2,
        result: resultValue,
        steps
      });
    } catch (error: any) {
      setResult({ error: error.message || "Error in calculation" });
    }
  };

  // Format vector for display
  const formatVector = (vector: { x: number, y: number, z: number }, dim: '2d' | '3d'): string => {
    return dim === '2d' 
      ? `(${vector.x.toFixed(4)}, ${vector.y.toFixed(4)})`
      : `(${vector.x.toFixed(4)}, ${vector.y.toFixed(4)}, ${vector.z.toFixed(4)})`;
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
        <span className="text-gray-900 font-medium">Vector Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <ArrowRight className="w-8 h-8 text-teal-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Vector Calculator</h1>
        </div>

        {/* Dimension Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Dimension</label>
          <div className="flex space-x-4">
            <button
              onClick={() => setDimension('2d')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                dimension === '2d'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              2D Vectors
            </button>
            <button
              onClick={() => setDimension('3d')}
              className={`px-6 py-3 rounded-lg transition-colors ${
                dimension === '3d'
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              3D Vectors
            </button>
          </div>
        </div>

        {/* Operation Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Operation</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'add', name: 'Addition', symbol: '+' },
              { id: 'subtract', name: 'Subtraction', symbol: '-' },
              { id: 'dot', name: 'Dot Product', symbol: '·' },
              { id: 'cross', name: 'Cross Product', symbol: '×' },
              { id: 'magnitude', name: 'Magnitude', symbol: '|v|' },
              { id: 'normalize', name: 'Normalize', symbol: 'v/|v|' },
              { id: 'angle', name: 'Angle Between', symbol: 'θ' },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id as any)}
                className={`p-3 rounded-lg border-2 transition-all ${
                  operation === op.id
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-bold text-lg">{op.symbol}</div>
                <div className="text-sm">{op.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Vector Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Vector 1</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">x component</label>
                <input
                  type="number"
                  value={vector1.x}
                  onChange={(e) => setVector1({...vector1, x: e.target.value})}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">y component</label>
                <input
                  type="number"
                  value={vector1.y}
                  onChange={(e) => setVector1({...vector1, y: e.target.value})}
                  placeholder="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              {dimension === '3d' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">z component</label>
                  <input
                    type="number"
                    value={vector1.z}
                    onChange={(e) => setVector1({...vector1, z: e.target.value})}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          </div>

          {(operation !== 'magnitude' && operation !== 'normalize') && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vector 2</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">x component</label>
                  <input
                    type="number"
                    value={vector2.x}
                    onChange={(e) => setVector2({...vector2, x: e.target.value})}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">y component</label>
                  <input
                    type="number"
                    value={vector2.y}
                    onChange={(e) => setVector2({...vector2, y: e.target.value})}
                    placeholder="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  />
                </div>
                {dimension === '3d' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">z component</label>
                    <input
                      type="number"
                      value={vector2.z}
                      onChange={(e) => setVector2({...vector2, z: e.target.value})}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateVector}
          className="w-full md:w-auto px-8 py-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate
        </button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {result.error}
              </div>
            ) : (
              <>
                {/* Main Result */}
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Result</h3>
                  
                  <div className="text-center mb-6">
                    {typeof result.result === 'object' ? (
                      <div className="text-3xl font-bold text-teal-600 mb-2 font-mono">
                        {formatVector(result.result, result.dimension)}
                      </div>
                    ) : (
                      <div className="text-3xl font-bold text-teal-600 mb-2">
                        {typeof result.result === 'number' ? result.result.toFixed(6) : result.result}
                      </div>
                    )}
                    
                    <div className="text-gray-600">
                      {result.operation === 'add' && `${formatVector(result.vector1, result.dimension)} + ${formatVector(result.vector2, result.dimension)}`}
                      {result.operation === 'subtract' && `${formatVector(result.vector1, result.dimension)} - ${formatVector(result.vector2, result.dimension)}`}
                      {result.operation === 'dot' && `${formatVector(result.vector1, result.dimension)} · ${formatVector(result.vector2, result.dimension)}`}
                      {result.operation === 'cross' && `${formatVector(result.vector1, result.dimension)} × ${formatVector(result.vector2, result.dimension)}`}
                      {result.operation === 'magnitude' && `|${formatVector(result.vector1, result.dimension)}|`}
                      {result.operation === 'normalize' && `${formatVector(result.vector1, result.dimension)} / |${formatVector(result.vector1, result.dimension)}|`}
                      {result.operation === 'angle' && `Angle between ${formatVector(result.vector1, result.dimension)} and ${formatVector(result.vector2, result.dimension)}`}
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Steps</h3>
                  <div className="space-y-2">
                    {result.steps.map((step: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="text-gray-700 font-mono text-sm">{step}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Vector Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Operations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Addition: (a,b,c) + (d,e,f) = (a+d, b+e, c+f)</li>
                <li>• Subtraction: (a,b,c) - (d,e,f) = (a-d, b-e, c-f)</li>
                <li>• Scalar multiplication: k(a,b,c) = (ka, kb, kc)</li>
                <li>• Magnitude: |v| = √(a² + b² + c²)</li>
                <li>• Normalization: v/|v| = (a/|v|, b/|v|, c/|v|)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Products</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Dot product: (a,b,c)·(d,e,f) = ad + be + cf</li>
                <li>• Cross product: (a,b,c)×(d,e,f) = (bf-ce, cd-af, ae-bd)</li>
                <li>• Dot product properties: v₁·v₂ = |v₁|·|v₂|·cos(θ)</li>
                <li>• Cross product properties: |v₁×v₂| = |v₁|·|v₂|·sin(θ)</li>
                <li>• Perpendicular vectors: v₁·v₂ = 0</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VectorCalculator;