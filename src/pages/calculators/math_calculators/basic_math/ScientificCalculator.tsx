import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const ScientificCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [memory, setMemory] = useState(0);
  const [isRadians, setIsRadians] = useState(true);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperation = (op: string) => {
    try {
      let result: number;
      const value = parseFloat(display);

      switch (op) {
        case 'sin':
          result = isRadians ? Math.sin(value) : Math.sin(value * Math.PI / 180);
          break;
        case 'cos':
          result = isRadians ? Math.cos(value) : Math.cos(value * Math.PI / 180);
          break;
        case 'tan':
          result = isRadians ? Math.tan(value) : Math.tan(value * Math.PI / 180);
          break;
        case 'log':
          result = Math.log10(value);
          break;
        case 'ln':
          result = Math.log(value);
          break;
        case 'sqrt':
          result = Math.sqrt(value);
          break;
        case 'square':
          result = value * value;
          break;
        case 'factorial':
          result = factorial(Math.floor(value));
          break;
        case 'pi':
          result = Math.PI;
          break;
        case 'e':
          result = Math.E;
          break;
        default:
          return;
      }

      setDisplay(result.toString());
    } catch (error) {
      setDisplay('Error');
    }
  };

  const factorial = (n: number): number => {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  };

  const clear = () => setDisplay('0');

  const Button: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ 
    onClick, 
    className = '', 
    children 
  }) => (
    <button
      onClick={onClick}
      className={`h-12 text-sm font-semibold rounded-lg transition-all duration-200 transform active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">Math Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Scientific Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Scientific Calculator</h1>
            
            <div className="bg-gray-900 rounded-2xl p-6 mb-6">
              <div className="text-right">
                <div className="text-3xl font-mono text-white break-all">
                  {display}
                </div>
                <div className="text-sm text-gray-400 mt-2">
                  Mode: {isRadians ? 'Radians' : 'Degrees'} | Memory: {memory}
                </div>
              </div>
            </div>

            <div className="mb-4 flex space-x-2">
              <button
                onClick={() => setIsRadians(!isRadians)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRadians 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {isRadians ? 'RAD' : 'DEG'}
              </button>
            </div>

            <div className="grid grid-cols-8 gap-2">
              {/* Row 1 - Memory and Clear */}
              <Button onClick={clear} className="col-span-2 bg-red-500 hover:bg-red-600 text-white">
                Clear
              </Button>
              <Button onClick={() => setMemory(parseFloat(display))} className="bg-purple-500 hover:bg-purple-600 text-white">
                MS
              </Button>
              <Button onClick={() => setDisplay(memory.toString())} className="bg-purple-500 hover:bg-purple-600 text-white">
                MR
              </Button>
              <Button onClick={() => setMemory(0)} className="bg-purple-500 hover:bg-purple-600 text-white">
                MC
              </Button>
              <Button onClick={() => handleOperation('pi')} className="bg-orange-500 hover:bg-orange-600 text-white">
                π
              </Button>
              <Button onClick={() => handleOperation('e')} className="bg-orange-500 hover:bg-orange-600 text-white">
                e
              </Button>
              <Button onClick={() => handleOperation('factorial')} className="bg-orange-500 hover:bg-orange-600 text-white">
                n!
              </Button>

              {/* Row 2 - Trig Functions */}
              <Button onClick={() => handleOperation('sin')} className="bg-green-500 hover:bg-green-600 text-white">
                sin
              </Button>
              <Button onClick={() => handleOperation('cos')} className="bg-green-500 hover:bg-green-600 text-white">
                cos
              </Button>
              <Button onClick={() => handleOperation('tan')} className="bg-green-500 hover:bg-green-600 text-white">
                tan
              </Button>
              <Button onClick={() => handleOperation('log')} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                log
              </Button>
              <Button onClick={() => handleOperation('ln')} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                ln
              </Button>
              <Button onClick={() => handleOperation('sqrt')} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                √
              </Button>
              <Button onClick={() => handleOperation('square')} className="bg-yellow-500 hover:bg-yellow-600 text-white">
                x²
              </Button>
              <Button onClick={() => setDisplay(prev => prev.includes('-') ? prev.slice(1) : '-' + prev)} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
                ±
              </Button>

              {/* Rows 3-6 - Numbers and Basic Operations */}
              {[7, 8, 9].map(num => (
                <Button key={num} onClick={() => handleNumber(num.toString())} className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                  {num}
                </Button>
              ))}
              <Button onClick={() => setDisplay(prev => prev + '/')} className="bg-blue-500 hover:bg-blue-600 text-white">
                ÷
              </Button>
              <Button onClick={() => setDisplay(prev => prev + '(')} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
                (
              </Button>
              <Button onClick={() => setDisplay(prev => prev + ')')} className="bg-gray-300 hover:bg-gray-400 text-gray-800">
                )
              </Button>
              <Button onClick={() => setDisplay(prev => prev + '^')} className="bg-blue-500 hover:bg-blue-600 text-white">
                ^
              </Button>
              <Button onClick={() => setDisplay(prev => prev + '%')} className="bg-blue-500 hover:bg-blue-600 text-white">
                %
              </Button>

              {[4, 5, 6].map(num => (
                <Button key={num} onClick={() => handleNumber(num.toString())} className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                  {num}
                </Button>
              ))}
              <Button onClick={() => setDisplay(prev => prev + '*')} className="bg-blue-500 hover:bg-blue-600 text-white">
                ×
              </Button>
              <Button onClick={() => setDisplay('0')} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                AC
              </Button>
              <Button onClick={() => setDisplay(prev => prev.slice(0, -1) || '0')} className="bg-gray-200 hover:bg-gray-300 text-gray-800">
                ⌫
              </Button>
              <Button onClick={() => setDisplay(prev => prev + '+')} className="bg-blue-500 hover:bg-blue-600 text-white">
                +
              </Button>
              <Button onClick={() => setDisplay(prev => prev + '-')} className="bg-blue-500 hover:bg-blue-600 text-white">
                -
              </Button>

              {[1, 2, 3].map(num => (
                <Button key={num} onClick={() => handleNumber(num.toString())} className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                  {num}
                </Button>
              ))}
              <Button onClick={() => setDisplay(prev => prev + '+')} className="row-span-2 bg-blue-500 hover:bg-blue-600 text-white">
                +
              </Button>
              <Button onClick={() => handleNumber('00')} className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                00
              </Button>
              <Button onClick={() => setDisplay(prev => prev + '.')} className="bg-gray-100 hover:bg-gray-200 text-gray-800">
                .
              </Button>
              <Button onClick={() => {
                try {
                  const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
                  setDisplay(result.toString());
                } catch {
                  setDisplay('Error');
                }
              }} className="bg-green-500 hover:bg-green-600 text-white">
                =
              </Button>
              <Button onClick={() => {
                try {
                  const result = eval(display.replace(/×/g, '*').replace(/÷/g, '/').replace(/\^/g, '**'));
                  setDisplay(result.toString());
                } catch {
                  setDisplay('Error');
                }
              }} className="bg-green-500 hover:bg-green-600 text-white">
                Enter
              </Button>

              <Button onClick={() => handleNumber('0')} className="col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-800">
                0
              </Button>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Scientific Functions</h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800">Trigonometric</h3>
                <p className="text-gray-600">sin, cos, tan</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Logarithmic</h3>
                <p className="text-gray-600">log, ln</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Powers & Roots</h3>
                <p className="text-gray-600">x², √, ^</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Constants</h3>
                <p className="text-gray-600">π, e</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Features</h3>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• Angle modes (Radians/Degrees)</li>
              <li>• Memory functions (MS, MR, MC)</li>
              <li>• Scientific notation</li>
              <li>• Complex expressions</li>
              <li>• High precision calculations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientificCalculator;