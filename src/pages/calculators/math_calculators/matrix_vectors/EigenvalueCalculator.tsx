import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Grid3X3 } from 'lucide-react';

const EigenvalueCalculator: React.FC = () => {
  const [matrixSize, setMatrixSize] = useState<2 | 3>(2);
  const [matrix, setMatrix] = useState<string[][]>([
    ['3', '1'],
    ['1', '3']
  ]);
  const [result, setResult] = useState<any>(null);

  const updateMatrix = (row: number, col: number, value: string) => {
    const newMatrix = [...matrix];
    newMatrix[row][col] = value;
    setMatrix(newMatrix);
  };

  const changeMatrixSize = (size: 2 | 3) => {
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

  const calculateEigenvalues = () => {
    try {
      const numericMatrix = parseMatrix(matrix);
      const steps: string[] = [];
      
      if (matrixSize === 2) {
        // For 2x2 matrix
        const a = numericMatrix[0][0];
        const b = numericMatrix[0][1];
        const c = numericMatrix[1][0];
        const d = numericMatrix[1][1];
        
        steps.push(`Step 1: Identify the matrix elements`);
        steps.push(`A = [${a} ${b}]`);
        steps.push(`    [${c} ${d}]`);
        
        steps.push(`Step 2: Find the characteristic polynomial using det(A - λI) = 0`);
        steps.push(`det([${a} - λ    ${b}   ]) = 0`);
        steps.push(`    [${c}      ${d} - λ  ]`);
        
        steps.push(`Step 3: Calculate the determinant`);
        steps.push(`det = (${a} - λ)(${d} - λ) - ${b}×${c}`);
        steps.push(`det = (${a} - λ)(${d} - λ) - ${b*c}`);
        steps.push(`det = λ² - ${a+d}λ + ${a*d} - ${b*c}`);
        steps.push(`det = λ² - ${a+d}λ + ${a*d-b*c}`);
        
        // Characteristic polynomial coefficients
        const trace = a + d;
        const determinant = a * d - b * c;
        
        steps.push(`Step 4: Solve the quadratic equation λ² - ${trace}λ + ${determinant} = 0`);
        
        // Calculate eigenvalues using the quadratic formula
        const discriminant = trace * trace - 4 * determinant;
        steps.push(`Using the quadratic formula: λ = (${trace} ± √(${trace}² - 4×${determinant})) / 2`);
        steps.push(`Discriminant = ${trace}² - 4×${determinant} = ${discriminant}`);
        
        if (discriminant < 0) {
          // Complex eigenvalues
          const realPart = trace / 2;
          const imagPart = Math.sqrt(-discriminant) / 2;
          
          steps.push(`Since the discriminant is negative, the eigenvalues are complex:`);
          steps.push(`λ₁ = ${realPart} + ${imagPart}i`);
          steps.push(`λ₂ = ${realPart} - ${imagPart}i`);
          
          setResult({
            eigenvalues: [
              { real: realPart, imaginary: imagPart },
              { real: realPart, imaginary: -imagPart }
            ],
            steps,
            trace,
            determinant
          });
        } else {
          // Real eigenvalues
          const lambda1 = (trace + Math.sqrt(discriminant)) / 2;
          const lambda2 = (trace - Math.sqrt(discriminant)) / 2;
          
          steps.push(`λ₁ = (${trace} + √${discriminant}) / 2 = ${lambda1}`);
          steps.push(`λ₂ = (${trace} - √${discriminant}) / 2 = ${lambda2}`);
          
          // Calculate eigenvectors
          const eigenvectors = [];
          
          // For λ₁
          steps.push(`Step 5: Find the eigenvector for λ₁ = ${lambda1}`);
          steps.push(`Solve (A - λ₁I)v = 0:`);
          steps.push(`[${a} - ${lambda1}    ${b}   ][v₁] = [0]`);
          steps.push(`[${c}      ${d} - ${lambda1}  ][v₂]   [0]`);
          
          const a11 = a - lambda1;
          const a22 = d - lambda1;
          
          if (Math.abs(a11) > Math.abs(b)) {
            // Use the first row
            const v2 = 1; // Set v2 = 1
            const v1 = -b / a11 * v2;
            steps.push(`Setting v₂ = 1, we get v₁ = -${b}/${a11} = ${v1}`);
            eigenvectors.push([v1, v2]);
          } else {
            // Use the second row
            const v1 = 1; // Set v1 = 1
            const v2 = -c / a22 * v1;
            steps.push(`Setting v₁ = 1, we get v₂ = -${c}/${a22} = ${v2}`);
            eigenvectors.push([v1, v2]);
          }
          
          // For λ₂
          steps.push(`Step 6: Find the eigenvector for λ₂ = ${lambda2}`);
          steps.push(`Solve (A - λ₂I)v = 0:`);
          steps.push(`[${a} - ${lambda2}    ${b}   ][v₁] = [0]`);
          steps.push(`[${c}      ${d} - ${lambda2}  ][v₂]   [0]`);
          
          const b11 = a - lambda2;
          const b22 = d - lambda2;
          
          if (Math.abs(b11) > Math.abs(b)) {
            // Use the first row
            const v2 = 1; // Set v2 = 1
            const v1 = -b / b11 * v2;
            steps.push(`Setting v₂ = 1, we get v₁ = -${b}/${b11} = ${v1}`);
            eigenvectors.push([v1, v2]);
          } else {
            // Use the second row
            const v1 = 1; // Set v1 = 1
            const v2 = -c / b22 * v1;
            steps.push(`Setting v₁ = 1, we get v₂ = -${c}/${b22} = ${v2}`);
            eigenvectors.push([v1, v2]);
          }
          
          setResult({
            eigenvalues: [lambda1, lambda2],
            eigenvectors,
            steps,
            trace,
            determinant
          });
        }
      } else {
        // For 3x3 matrix
        const a = numericMatrix[0][0];
        const b = numericMatrix[0][1];
        const c = numericMatrix[0][2];
        const d = numericMatrix[1][0];
        const e = numericMatrix[1][1];
        const f = numericMatrix[1][2];
        const g = numericMatrix[2][0];
        const h = numericMatrix[2][1];
        const i = numericMatrix[2][2];
        
        steps.push(`Step 1: Identify the matrix elements`);
        steps.push(`A = [${a} ${b} ${c}]`);
        steps.push(`    [${d} ${e} ${f}]`);
        steps.push(`    [${g} ${h} ${i}]`);
        
        steps.push(`Step 2: Find the characteristic polynomial using det(A - λI) = 0`);
        
        // Calculate coefficients of the characteristic polynomial
        // For a 3x3 matrix, the characteristic polynomial is λ³ - trace(A)λ² + ...
        const trace = a + e + i;
        
        // Sum of principal minors
        const minor1 = a * e - b * d;
        const minor2 = a * i - c * g;
        const minor3 = e * i - f * h;
        const sumOfMinors = minor1 + minor2 + minor3;
        
        // Determinant
        const determinant = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
        
        steps.push(`Step 3: The characteristic polynomial is:`);
        steps.push(`P(λ) = λ³ - ${trace}λ² + ${sumOfMinors}λ - ${determinant}`);
        
        steps.push(`Step 4: For 3×3 matrices, finding exact eigenvalues requires solving a cubic equation.`);
        steps.push(`This calculator uses numerical methods to approximate the eigenvalues.`);
        
        // For a 3x3 matrix, we'll use a numerical method to find eigenvalues
        // This is a simplified implementation of the QR algorithm
        // In a real application, you would use a more robust numerical method
        
        // We'll use a simple power iteration to find the dominant eigenvalue
        // and then deflate the matrix to find the others
        
        // This is a very simplified approach and may not work well for all matrices
        // For educational purposes only
        
        // Estimate eigenvalues using the characteristic equation coefficients
        // This is not accurate but gives a rough approximation
        const p = -trace;
        const q = sumOfMinors;
        const r = -determinant;
        
        // Use Cardano's method for cubic equation
        const a0 = 1;
        const a1 = p;
        const a2 = q;
        const a3 = r;
        
        // Reduced form: t³ + pt + q = 0 where t = x + a1/(3a0)
        const p1 = (3 * a0 * a2 - a1 * a1) / (3 * a0 * a0);
        const q1 = (2 * a1 * a1 * a1 - 9 * a0 * a1 * a2 + 27 * a0 * a0 * a3) / (27 * a0 * a0 * a0);
        
        // Discriminant
        const delta = q1 * q1 / 4 + p1 * p1 * p1 / 27;
        
        let eigenvalues: number[] = [];
        
        if (delta > 0) {
          // One real root and two complex conjugate roots
          const u = Math.cbrt(-q1 / 2 + Math.sqrt(delta));
          const v = Math.cbrt(-q1 / 2 - Math.sqrt(delta));
          
          const root1 = u + v - a1 / (3 * a0);
          const realPart = -(u + v) / 2 - a1 / (3 * a0);
          const imagPart = (u - v) * Math.sqrt(3) / 2;
          
          steps.push(`The cubic equation has one real root and two complex conjugate roots:`);
          steps.push(`λ₁ = ${root1.toFixed(4)}`);
          steps.push(`λ₂ = ${realPart.toFixed(4)} + ${imagPart.toFixed(4)}i`);
          steps.push(`λ₃ = ${realPart.toFixed(4)} - ${imagPart.toFixed(4)}i`);
          
          setResult({
            eigenvalues: [
              root1,
              { real: realPart, imaginary: imagPart },
              { real: realPart, imaginary: -imagPart }
            ],
            steps,
            trace,
            determinant
          });
        } else {
          // Three real roots
          const angle = Math.acos(-q1 / 2 / Math.sqrt(-p1 * p1 * p1 / 27));
          const root1 = 2 * Math.sqrt(-p1 / 3) * Math.cos(angle / 3) - a1 / (3 * a0);
          const root2 = 2 * Math.sqrt(-p1 / 3) * Math.cos((angle + 2 * Math.PI) / 3) - a1 / (3 * a0);
          const root3 = 2 * Math.sqrt(-p1 / 3) * Math.cos((angle + 4 * Math.PI) / 3) - a1 / (3 * a0);
          
          steps.push(`The cubic equation has three real roots:`);
          steps.push(`λ₁ = ${root1.toFixed(4)}`);
          steps.push(`λ₂ = ${root2.toFixed(4)}`);
          steps.push(`λ₃ = ${root3.toFixed(4)}`);
          
          setResult({
            eigenvalues: [root1, root2, root3],
            steps,
            trace,
            determinant
          });
        }
      }
    } catch (error) {
      setResult({ error: 'Error calculating eigenvalues' });
    }
  };

  const formatEigenvalue = (eigenvalue: number | { real: number, imaginary: number }): string => {
    if (typeof eigenvalue === 'number') {
      return eigenvalue.toFixed(4);
    } else {
      const { real, imaginary } = eigenvalue;
      const sign = imaginary >= 0 ? '+' : '';
      return `${real.toFixed(4)}${sign}${imaginary.toFixed(4)}i`;
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
        <span className="text-gray-900 font-medium">Eigenvalue Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Grid3X3 className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Eigenvalue Calculator</h1>
        </div>

        {/* Matrix Size Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Matrix Size</label>
          <div className="grid grid-cols-2 gap-3">
            {[2, 3].map((size) => (
              <button
                key={size}
                onClick={() => changeMatrixSize(size as 2 | 3)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  matrixSize === size
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
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
                    className="w-16 h-12 text-center border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500"
                  />
                ))
              ))}
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateEigenvalues}
          className="w-full md:w-auto px-8 py-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate Eigenvalues
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
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Eigenvalues</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {result.eigenvalues.map((eigenvalue: any, index: number) => (
                      <div key={index} className="bg-white rounded-lg p-4 text-center">
                        <div className="text-sm text-gray-600 mb-1">λ{index + 1}</div>
                        <div className="text-xl font-bold text-indigo-600">
                          {formatEigenvalue(eigenvalue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Matrix Properties */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Matrix Properties</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Trace</span>
                      <span className="font-medium">{result.trace}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Determinant</span>
                      <span className="font-medium">{result.determinant}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Sum of Eigenvalues</span>
                      <span className="font-medium">{result.trace}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">Product of Eigenvalues</span>
                      <span className="font-medium">{result.determinant}</span>
                    </div>
                  </div>
                </div>

                {/* Eigenvectors (only for 2x2 with real eigenvalues) */}
                {matrixSize === 2 && result.eigenvectors && (
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Eigenvectors</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.eigenvectors.map((vector: number[], index: number) => (
                        <div key={index} className="bg-white rounded-lg p-4 text-center">
                          <div className="text-sm text-gray-600 mb-1">Eigenvector for λ{index + 1}</div>
                          <div className="text-lg font-mono text-blue-600">
                            v{index + 1} = [{vector[0].toFixed(4)}, {vector[1].toFixed(4)}]
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Eigenvalues</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Eigenvalues (λ) are scalars that satisfy Av = λv</li>
                <li>• v is the corresponding eigenvector</li>
                <li>• Found by solving the characteristic equation: det(A - λI) = 0</li>
                <li>• A square matrix of size n has n eigenvalues (counting multiplicity)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Properties</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Sum of eigenvalues = trace of matrix</li>
                <li>• Product of eigenvalues = determinant of matrix</li>
                <li>• Eigenvalues may be real or complex</li>
                <li>• Symmetric matrices have all real eigenvalues</li>
                <li>• Similar matrices have the same eigenvalues</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Principal component analysis (PCA)</li>
                <li>• Stability analysis in dynamical systems</li>
                <li>• Quantum mechanics (energy levels)</li>
                <li>• Google's PageRank algorithm</li>
                <li>• Vibration analysis in engineering</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Calculation Methods</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Direct solution of characteristic polynomial (for small matrices)</li>
                <li>• Power iteration</li>
                <li>• QR algorithm</li>
                <li>• Jacobi method (for symmetric matrices)</li>
                <li>• Lanczos algorithm (for sparse matrices)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EigenvalueCalculator;