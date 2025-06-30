import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Grid3X3 } from 'lucide-react';

const DeterminantCalculator: React.FC = () => {
  const [matrixSize, setMatrixSize] = useState<2 | 3 | 4>(3);
  const [matrix, setMatrix] = useState<string[][]>([
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ]);
  const [result, setResult] = useState<any>(null);

  const updateMatrix = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  const changeMatrixSize = (size: 2 | 3 | 4) => {
    const newMatrix: string[][] = [];
    for (let i = 0; i < size; i++) {
      newMatrix[i] = [];
      for (let j = 0; j < size; j++) {
        // Preserve existing values when possible
        newMatrix[i][j] = (i < matrix.length && j < matrix[i].length) ? matrix[i][j] : '0';
      }
    }
    setMatrix(newMatrix);
    setMatrixSize(size);
    setResult(null);
  };

  const parseMatrix = (matrix: string[][]): number[][] => {
    return matrix.map(row => row.map(cell => parseFloat(cell) || 0));
  };

  const calculateDeterminant = () => {
    try {
      const numericMatrix = parseMatrix(matrix);
      const steps: string[] = [];
      
      // Calculate determinant
      const det = determinant(numericMatrix, steps);
      
      setResult({
        determinant: det,
        steps
      });
    } catch (error) {
      setResult({ error: 'Error calculating determinant' });
    }
  };

  const determinant = (matrix: number[][], steps: string[] = []): number => {
    const n = matrix.length;
    
    // Base case: 1x1 matrix
    if (n === 1) {
      steps.push(`Determinant of 1×1 matrix [${matrix[0][0]}] is ${matrix[0][0]}`);
      return matrix[0][0];
    }
    
    // Base case: 2x2 matrix
    if (n === 2) {
      const det = matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
      steps.push(`Determinant of 2×2 matrix:`);
      steps.push(`|${matrix[0][0]} ${matrix[0][1]}|`);
      steps.push(`|${matrix[1][0]} ${matrix[1][1]}|`);
      steps.push(`= (${matrix[0][0]} × ${matrix[1][1]}) - (${matrix[0][1]} × ${matrix[1][0]})`);
      steps.push(`= ${matrix[0][0] * matrix[1][1]} - ${matrix[0][1] * matrix[1][0]}`);
      steps.push(`= ${det}`);
      return det;
    }
    
    // For larger matrices, use cofactor expansion along the first row
    steps.push(`Determinant of ${n}×${n} matrix using cofactor expansion along the first row:`);
    
    let det = 0;
    for (let j = 0; j < n; j++) {
      // Skip calculation for zero elements
      if (matrix[0][j] === 0) {
        steps.push(`Element (1,${j+1}) is 0, so its contribution is 0`);
        continue;
      }
      
      // Create submatrix by removing first row and column j
      const subMatrix: number[][] = [];
      for (let i = 1; i < n; i++) {
        subMatrix[i-1] = [];
        for (let k = 0; k < n; k++) {
          if (k !== j) {
            subMatrix[i-1].push(matrix[i][k]);
          }
        }
      }
      
      steps.push(`For element (1,${j+1}) = ${matrix[0][j]}:`);
      steps.push(`Cofactor sign: ${(j % 2 === 0) ? '+' : '-'}`);
      
      // Recursively calculate determinant of submatrix
      const subSteps: string[] = [];
      const subDet = determinant(subMatrix, subSteps);
      
      // Indent substeps
      subSteps.forEach(step => steps.push(`  ${step}`));
      
      const cofactor = (j % 2 === 0 ? 1 : -1) * matrix[0][j] * subDet;
      steps.push(`Contribution: ${(j % 2 === 0 ? '+' : '-')}${matrix[0][j]} × ${subDet} = ${cofactor}`);
      
      det += cofactor;
    }
    
    steps.push(`Sum of all cofactors: ${det}`);
    return det;
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
        <span className="text-gray-900 font-medium">Determinant Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Grid3X3 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Determinant Calculator</h1>
        </div>

        {/* Matrix Size Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Matrix Size</label>
          <div className="grid grid-cols-3 gap-3">
            {[2, 3, 4].map((size) => (
              <button
                key={size}
                onClick={() => changeMatrixSize(size as 2 | 3 | 4)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  matrixSize === size
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">{size}×{size} Matrix</div>
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Enter Matrix Values</label>
          <div className="bg-gray-50 rounded-lg p-6 flex justify-center">
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixSize}, 1fr)` }}>
              {Array.from({ length: matrixSize }).map((_, rowIndex) => (
                Array.from({ length: matrixSize }).map((_, colIndex) => (
                  <input
                    key={`${rowIndex}-${colIndex}`}
                    type="number"
                    value={matrix[rowIndex][colIndex]}
                    onChange={(e) => updateMatrix(rowIndex, colIndex, e.target.value)}
                    className="w-16 h-12 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                ))
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateDeterminant}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate Determinant
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
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Determinant Result</h3>
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {result.determinant}
                    </div>
                    <div className="text-gray-600">
                      det(A) = {result.determinant}
                    </div>
                  </div>
                </div>

                {/* Matrix Properties */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrix Properties</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Singular Matrix</span>
                      <span className="font-medium">
                        {Math.abs(result.determinant) < 1e-10 ? 'Yes' : 'No'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Invertible</span>
                      <span className="font-medium">
                        {Math.abs(result.determinant) < 1e-10 ? 'No' : 'Yes'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Matrix Rank</span>
                      <span className="font-medium">
                        {Math.abs(result.determinant) < 1e-10 ? '< ' + matrixSize : matrixSize}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Steps */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
                  <div className="space-y-2">
                    {result.steps.map((step: string, index: number) => (
                      <div key={index} className="text-gray-700 font-mono text-sm">
                        {step}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Determinants</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• A scalar value calculated from a square matrix</li>
                <li>• Provides information about the matrix's properties</li>
                <li>• For a 2×2 matrix: det(A) = ad - bc</li>
                <li>• For larger matrices: calculated using cofactor expansion</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• det(AB) = det(A) × det(B)</li>
                <li>• det(A⁻¹) = 1/det(A)</li>
                <li>• det(Aᵀ) = det(A)</li>
                <li>• If det(A) = 0, then A is singular (not invertible)</li>
                <li>• If det(A) ≠ 0, then A is non-singular (invertible)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Solving systems of linear equations (Cramer's rule)</li>
                <li>• Finding the inverse of a matrix</li>
                <li>• Calculating the area/volume of geometric shapes</li>
                <li>• Determining if vectors are linearly independent</li>
                <li>• Eigenvalue problems and characteristic polynomials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Calculation Methods</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Cofactor expansion (used in this calculator)</li>
                <li>• Gaussian elimination</li>
                <li>• LU decomposition</li>
                <li>• Laplace expansion</li>
                <li>• Leibniz formula</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeterminantCalculator;