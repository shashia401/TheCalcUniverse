import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Box } from 'lucide-react';

const SurfaceAreaCalculator: React.FC = () => {
  const [shape, setShape] = useState('cube');
  const [dimensions, setDimensions] = useState<{ [key: string]: string }>({});
  const [result, setResult] = useState<number | null>(null);

  const shapes = {
    cube: { name: 'Cube', fields: ['side'] },
    rectangular: { name: 'Rectangular Prism', fields: ['length', 'width', 'height'] },
    sphere: { name: 'Sphere', fields: ['radius'] },
    cylinder: { name: 'Cylinder', fields: ['radius', 'height'] },
    cone: { name: 'Cone', fields: ['radius', 'slantHeight'] },
    pyramid: { name: 'Square Pyramid', fields: ['baseSide', 'slantHeight'] },
    triangularPrism: { name: 'Triangular Prism', fields: ['baseLength', 'baseHeight', 'prismHeight'] },
    tetrahedron: { name: 'Regular Tetrahedron', fields: ['side'] },
  };

  useEffect(() => {
    calculateSurfaceArea();
  }, [shape, dimensions]);

  const calculateSurfaceArea = () => {
    const values = Object.values(dimensions).map(v => parseFloat(v)).filter(v => !isNaN(v));
    const requiredFields = shapes[shape as keyof typeof shapes].fields.length;
    
    if (values.length !== requiredFields) {
      setResult(null);
      return;
    }

    let surfaceArea: number = 0;

    switch (shape) {
      case 'cube':
        surfaceArea = 6 * Math.pow(values[0], 2);
        break;
      case 'rectangular':
        surfaceArea = 2 * (values[0] * values[1] + values[1] * values[2] + values[0] * values[2]);
        break;
      case 'sphere':
        surfaceArea = 4 * Math.PI * Math.pow(values[0], 2);
        break;
      case 'cylinder':
        // 2πr² + 2πrh
        surfaceArea = 2 * Math.PI * Math.pow(values[0], 2) + 2 * Math.PI * values[0] * values[1];
        break;
      case 'cone':
        // πr² + πr × slant height
        surfaceArea = Math.PI * Math.pow(values[0], 2) + Math.PI * values[0] * values[1];
        break;
      case 'pyramid':
        // base area + 4 triangular faces
        const baseArea = Math.pow(values[0], 2);
        const triangularFace = 0.5 * values[0] * values[1];
        surfaceArea = baseArea + 4 * triangularFace;
        break;
      case 'triangularPrism':
        // 2 triangular bases + 3 rectangular faces
        const triangleBase = 0.5 * values[0] * values[1];
        const rectangularFaces = values[0] * values[2] + values[1] * values[2] + Math.sqrt(Math.pow(values[0], 2) + Math.pow(values[1], 2)) * values[2];
        surfaceArea = 2 * triangleBase + rectangularFaces;
        break;
      case 'tetrahedron':
        // 4 equilateral triangles
        surfaceArea = Math.sqrt(3) * Math.pow(values[0], 2);
        break;
    }

    setResult(surfaceArea);
  };

  const updateDimension = (field: string, value: string) => {
    setDimensions(prev => ({ ...prev, [field]: value }));
  };

  const getFieldLabel = (field: string) => {
    const labels: { [key: string]: string } = {
      side: 'Side Length',
      length: 'Length',
      width: 'Width',
      height: 'Height',
      radius: 'Radius',
      slantHeight: 'Slant Height',
      baseSide: 'Base Side Length',
      baseLength: 'Base Length',
      baseHeight: 'Base Height',
      prismHeight: 'Prism Height',
    };
    return labels[field] || field;
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
        <span className="text-gray-900 font-medium">Surface Area Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Box className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Surface Area Calculator</h1>
        </div>

        {/* Shape Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">Select 3D Shape</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(shapes).map(([key, shapeInfo]) => (
              <button
                key={key}
                onClick={() => {
                  setShape(key);
                  setDimensions({});
                }}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  shape === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {shapeInfo.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dimension Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {shapes[shape as keyof typeof shapes].fields.map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {getFieldLabel(field)}
              </label>
              <input
                type="number"
                value={dimensions[field] || ''}
                onChange={(e) => updateDimension(field, e.target.value)}
                placeholder="Enter value"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              />
            </div>
          ))}
        </div>

        {/* Result */}
        {result !== null && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Surface Area Result</h3>
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {result.toFixed(4)}
            </div>
            <div className="text-gray-600">square units</div>
            
            {/* Additional conversions */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Square Meters</div>
                <div className="text-lg font-semibold text-gray-800">{result.toFixed(4)} m²</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Square Feet</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 10.764).toFixed(4)} ft²</div>
              </div>
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">Square Inches</div>
                <div className="text-lg font-semibold text-gray-800">{(result * 1550).toFixed(2)} in²</div>
              </div>
            </div>
          </div>
        )}

        {/* Formula Display */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Formula</h3>
          <div className="font-mono text-gray-700">
            {shape === 'cube' && 'Surface Area = 6 × side²'}
            {shape === 'rectangular' && 'Surface Area = 2(length × width + width × height + length × height)'}
            {shape === 'sphere' && 'Surface Area = 4π × radius²'}
            {shape === 'cylinder' && 'Surface Area = 2π × radius² + 2π × radius × height'}
            {shape === 'cone' && 'Surface Area = π × radius² + π × radius × slant height'}
            {shape === 'pyramid' && 'Surface Area = base side² + 4 × (½ × base side × slant height)'}
            {shape === 'triangularPrism' && 'Surface Area = 2 × (½ × base length × base height) + 3 rectangular faces'}
            {shape === 'tetrahedron' && 'Surface Area = √3 × side²'}
          </div>
        </div>

        {/* Shape Information */}
        <div className="mt-6 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About {shapes[shape as keyof typeof shapes].name}</h3>
          <div className="text-sm text-gray-700 space-y-2">
            {shape === 'cube' && (
              <>
                <p>A cube is a three-dimensional solid object bounded by six square faces, with three meeting at each vertex.</p>
                <p>All faces of a cube are identical squares, and all edges have the same length.</p>
                <p>The surface area represents the total area of all six faces.</p>
              </>
            )}
            {shape === 'rectangular' && (
              <>
                <p>A rectangular prism (or cuboid) is a three-dimensional shape with six rectangular faces.</p>
                <p>Opposite faces are identical rectangles, and adjacent faces meet at right angles.</p>
                <p>The surface area is the sum of the areas of all six rectangular faces.</p>
              </>
            )}
            {shape === 'sphere' && (
              <>
                <p>A sphere is a perfectly round three-dimensional object where every point on its surface is equidistant from its center.</p>
                <p>The surface area of a sphere depends only on its radius.</p>
                <p>The formula 4πr² gives the total area of the curved surface.</p>
              </>
            )}
            {shape === 'cylinder' && (
              <>
                <p>A cylinder has two circular bases connected by a curved rectangular surface.</p>
                <p>The surface area includes both circular bases and the curved surface.</p>
                <p>The formula accounts for both the top and bottom circles (2πr²) and the curved surface (2πrh).</p>
              </>
            )}
            {shape === 'cone' && (
              <>
                <p>A cone has a circular base connected to a single vertex by a curved surface.</p>
                <p>The slant height is the distance from the edge of the base to the vertex.</p>
                <p>The surface area includes the circular base (πr²) and the curved surface (πr × slant height).</p>
              </>
            )}
            {shape === 'pyramid' && (
              <>
                <p>A square pyramid has a square base and four triangular faces that meet at a single vertex.</p>
                <p>The slant height is the height of each triangular face from base to apex.</p>
                <p>The surface area includes the square base and the four triangular faces.</p>
              </>
            )}
            {shape === 'triangularPrism' && (
              <>
                <p>A triangular prism has two triangular bases connected by three rectangular faces.</p>
                <p>The surface area includes the two triangular bases and the three rectangular faces.</p>
                <p>The base length and height refer to the dimensions of the triangular base.</p>
              </>
            )}
            {shape === 'tetrahedron' && (
              <>
                <p>A regular tetrahedron has four equilateral triangular faces, with three faces meeting at each vertex.</p>
                <p>All edges of a regular tetrahedron have the same length.</p>
                <p>The surface area is the sum of the areas of the four equilateral triangular faces.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurfaceAreaCalculator;