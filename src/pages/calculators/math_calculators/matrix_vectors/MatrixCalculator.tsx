import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Grid3X3, Plus, Minus, X } from 'lucide-react';

const MatrixCalculator: React.FC = () => {
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'determinant' | 'inverse' | 'transpose'>('add');
  const [matrixA, setMatrixA] = useState([
    ['1', '2'], 
    ['3', '4']
  ]);
  const [matrixB, setMatrixB] = useState([
    ['5', '6'], 
    ['7', '8']
  ]);
  const [result, setResult] = useState<any>(null);

  const updateMatrixA = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixA];
    newMatrix[row][col] = value;
    setMatrixA(newMatrix);
  };

  const updateMatrixB = (row: number, col: number, value: string) => {
    const newMatrix = [...matrixB];
    newMatrix[row][col] = value;
    setMatrixB(newMatrix);
  };

  const addRow = (matrix: 'A' | 'B') => {
    if (matrix === 'A') {
      const newRow = new Array(matrixA[0].length).fill('0');
      setMatrixA([...matrixA, newRow]);
    } else {
      const newRow = new Array(matrixB[0].length).fill('0');
      setMatrixB([...matrixB, newRow]);
    }
  };

  const addColumn = (matrix: 'A' | 'B') => {
    if (matrix === 'A') {
      setMatrixA(matrixA.map(row => [...row, '0']));
    } else {
      setMatrixB(matrixB.map(row => [...row, '0']));
    }
  };

  const removeRow = (matrix: 'A' | 'B') => {
    if (matrix === 'A' && matrixA.length > 1) {
      setMatrixA(matrixA.slice(0, -1));
    } else if (matrix === 'B' && matrixB.length > 1) {
      setMatrixB(matrixB.slice(0, -1));
    }
  };

  const removeColumn = (matrix: 'A' | 'B') => {
    if (matrix === 'A' && matrixA[0].length > 1) {
      setMatrixA(matrixA.map(row => row.slice(0, -1)));
    } else if (matrix === 'B' && matrixB[0].length > 1) {
      setMatrixB(matrixB.map(row => row.slice(0, -1)));
    }
  };

  const parseMatrix = (matrix: string[][]) => {
    return matrix.map(row => row.map(cell => parseFloat(cell) || 0));
  };

  const calculateResult = () => {
    try {
      const A = parseMatrix(matrixA);
      const B = parseMatrix(matrixB);

      switch (operation) {
        case 'add':
          if (A.length === B.length && A[0].length === B[0].length) {
            const result = A.map((row, i) => row.map((cell, j) => cell + B[i][j]));
            setResult({ matrix: result, operation: 'Addition' });
          } else {
            setResult({ error: 'Matrices must have the same dimensions for addition' });
          }
          break;

        case 'subtract':
          if (A.length === B.length && A[0].length === B[0].length) {
            const result = A.map((row, i) => row.map((cell, j) => cell - B[i][j]));
            setResult({ matrix: result, operation: 'Subtraction' });
          } else {
            setResult({ error: 'Matrices must have the same dimensions for subtraction' });
          }
          break;

        case 'multiply':
          if (A[0].length === B.length) {
            const result = Array(A.length).fill(0).map(() => Array(B[0].length).fill(0));
            for (let i = 0; i < A.length; i++) {
              for (let j = 0; j < B[0].length; j++) {
                for (let k = 0; k < B.length; k++) {
                  result[i][j] += A[i][k] * B[k][j];
                }
              }
            }
            setResult({ matrix: result, operation: 'Multiplication' });
          } else {
            setResult({ error: 'Number of columns in Matrix A must equal number of rows in Matrix B' });
          }
          break;

        case 'determinant':
          if (A.length === A[0].length) {
            const det = calculateDeterminant(A);
            setResult({ determinant: det, operation: 'Determinant' });
          } else {
            setResult({ error: 'Matrix must be square to calculate determinant' });
          }
          break;

        case 'transpose':
          const transposed = A[0].map((_, colIndex) => A.map(row => row[colIndex]));
          setResult({ matrix: transposed, operation: 'Transpose' });
          break;

        case 'inverse':
          if (A.length === A[0].length) {
            const det = calculateDeterminant(A);
            if (Math.abs(det) < 1e-10) {
              setResult({ error: 'Matrix is not invertible (determinant is zero)' });
            } else {
              const inv = calculateInverse(A);
              setResult({ matrix: inv, operation: 'Inverse' });
            }
          } else {
            setResult({ error: 'Matrix must be square to calculate inverse' });
          }
          break;
      }
    } catch (error) {
      setResult({ error: 'Error in calculation' });
    }
  };

  const calculateDeterminant = (matrix: number[][]): number => {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    
    let det = 0;
    for (let i = 0; i < n; i++) {
      const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
      det += Math.pow(-1, i) * matrix[0][i] * calculateDeterminant(subMatrix);
    }
    return det;
  };

  const calculateInverse = (matrix: number[][]): number[][] => {
    const n = matrix.length;
    const augmented = matrix.map((row, i) => [...row, ...Array(n).fill(0).map((_, j) => i === j ? 1 : 0)]);
    
    // Gaussian elimination
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
          maxRow = k;
        }
      }
      [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
      
      for (let k = i + 1; k < n; k++) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
    
    // Back substitution
    for (let i = n - 1; i >= 0; i--) {
      for (let k = i - 1; k >= 0; k--) {
        const factor = augmented[k][i] / augmented[i][i];
        for (let j = i; j < 2 * n; j++) {
          augmented[k][j] -= factor * augmented[i][j];
        }
      }
    }
    
    // Normalize
    for (let i = 0; i < n; i++) {
      const divisor = augmented[i][i];
      for (let j = 0; j < 2 * n; j++) {
        augmented[i][j] /= divisor;
      }
    }
    
    return augmented.map(row => row.slice(n));
  };

  const MatrixInput: React.FC<{ matrix: string[][]; label: string; onUpdate: (row: number, col: number, value: string) => void; matrixId: 'A' | 'B' }> = ({ matrix, label, onUpdate, matrixId }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Matrix {label}</h3>
        <div className="flex space-x-2">
          <button onClick={() => addRow(matrixId)} className="px-2 py-1 bg-blue-500 text-white rounded text-sm">+Row</button>
          <button onClick={() => removeRow(matrixId)} className="px-2 py-1 bg-red-500 text-white rounded text-sm">-Row</button>
          <button onClick={() => addColumn(matrixId)} className="px-2 py-1 bg-green-500 text-white rounded text-sm">+Col</button>
          <button onClick={() => removeColumn(matrixId)} className="px-2 py-1 bg-orange-500 text-white rounded text-sm">-Col</button>
        </div>
      </div>
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
        {matrix.map((row, i) =>
          row.map((cell, j) => (
            <input
              key={`${i}-${j}`}
              type="number"
              value={cell}
              onChange={(e) => onUpdate(i, j, e.target.value)}
              className="w-16 h-12 text-center border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
            />
          ))
        )}
      </div>
    </div>
  );

  const ResultMatrix: React.FC<{ matrix: number[][] }> = ({ matrix }) => (
    <div className="bg-white rounded-lg p-4">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}>
        {matrix.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className="w-16 h-12 flex items-center justify-center bg-blue-50 border border-blue-200 rounded font-mono text-sm"
            >
              {cell.toFixed(3)}
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">Math Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Matrix Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Grid3X3 className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Matrix Calculator</h1>
        </div>

        {/* Operation Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">Matrix Operation</label>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {[
              { id: 'add', name: 'Add', icon: Plus },
              { id: 'subtract', name: 'Subtract', icon: Minus },
              { id: 'multiply', name: 'Multiply', icon: X },
              { id: 'determinant', name: 'Determinant', icon: Grid3X3 },
              { id: 'transpose', name: 'Transpose', icon: Grid3X3 },
              { id: 'inverse', name: 'Inverse', icon: Grid3X3 },
            ].map((op) => (
              <button
                key={op.id}
                onClick={() => setOperation(op.id as any)}
                className={`p-3 rounded-lg border-2 transition-all flex items-center justify-center ${
                  operation === op.id
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <op.icon className="w-4 h-4 mr-2" />
                {op.name}
              </button>
            ))}
          </div>
        </div>

        {/* Matrix Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MatrixInput matrix={matrixA} label="A" onUpdate={updateMatrixA} matrixId="A" />
          {['add', 'subtract', 'multiply'].includes(operation) && (
            <MatrixInput matrix={matrixB} label="B" onUpdate={updateMatrixB} matrixId="B" />
          )}
        </div>

        {/* Calculate Button */}
        <button
          onClick={calculateResult}
          className="w-full md:w-auto px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-lg font-semibold mb-8"
        >
          Calculate {operation.charAt(0).toUpperCase() + operation.slice(1)}
        </button>

        {/* Results */}
        {result && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Result: {result.operation}</h3>
            
            {result.error ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {result.error}
              </div>
            ) : result.matrix ? (
              <ResultMatrix matrix={result.matrix} />
            ) : result.determinant !== undefined ? (
              <div className="bg-white rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">{result.determinant.toFixed(6)}</div>
                <div className="text-gray-600">Determinant</div>
              </div>
            ) : null}
          </div>
        )}

        {/* Information */}
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Matrix Operations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Addition/Subtraction</h4>
              <p className="text-gray-600">Matrices must have the same dimensions</p>
            </div>
            <div>
              <h4 className="font-semibold">Multiplication</h4>
              <p className="text-gray-600">Columns of A must equal rows of B</p>
            </div>
            <div>
              <h4 className="font-semibold">Determinant</h4>
              <p className="text-gray-600">Only defined for square matrices</p>
            </div>
            <div>
              <h4 className="font-semibold">Inverse</h4>
              <p className="text-gray-600">Only exists if determinant ≠ 0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatrixCalculator;