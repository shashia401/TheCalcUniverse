import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Delete, Calculator } from 'lucide-react';

const BasicCalculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [showExpression, setShowExpression] = useState<string | null>(null);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
    if (showExpression) {
      setShowExpression(null);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
    setShowExpression(null);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(display);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const newValue = calculate(parseFloat(currentValue), inputValue, operation);

      setDisplay(String(newValue));
      setPreviousValue(String(newValue));
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
    setShowExpression(null);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return firstValue / secondValue;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleOperation = (op: string) => {
    if (op === '=') {
      if (operation && previousValue !== null) {
        const inputValue = parseFloat(display);
        const currentValue = parseFloat(previousValue);
        const newValue = calculate(currentValue, inputValue, operation);

        setShowExpression(`${previousValue} ${operation} ${display}`);
        setDisplay(String(newValue));
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      }
    } else {
      performOperation(op);
    }
  };

  const Button: React.FC<{ onClick: () => void; className?: string; children: React.ReactNode }> = ({ 
    onClick, 
    className = '', 
    children 
  }) => (
    <button
      onClick={onClick}
      className={`h-16 text-xl font-semibold rounded-xl transition-all duration-200 transform active:scale-95 ${className}`}
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/math-calculators" className="hover:text-blue-600 transition-colors">
          Math Calculators
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Basic Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Related Calculators Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <Calculator className="w-5 h-5 mr-2 text-blue-600" />
              Try Our Other Calculators
            </h2>
            <div className="space-y-2">
              <Link
                to="/scientific-calculator"
                className="block p-3 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                Scientific Calculator
              </Link>
              <Link
                to="/fraction-calculator"
                className="block p-3 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                Fraction Calculator
              </Link>
              <Link
                to="/percentage-calculator"
                className="block p-3 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                Percentage Calculator
              </Link>
              <Link
                to="/average-calculator"
                className="block p-3 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                Average Calculator
              </Link>
              <Link
                to="/ratio-calculator"
                className="block p-3 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                Ratio Calculator
              </Link>
              <Link
                to="/proportion-calculator"
                className="block p-3 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 hover:text-blue-600 text-sm font-medium"
              >
                Proportion Calculator
              </Link>
            </div>
          </div>
        </div>

        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="bg-gray-900 rounded-2xl p-6 mb-6">
              <div className="text-right">
                <div className="text-lg font-mono text-gray-400 mb-2 h-7">
                  {showExpression || (previousValue && operation ? `${previousValue} ${operation}` : '\u00A0')}
                </div>
                <div className="text-4xl font-mono text-white break-all">
                  {display}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              <Button
                onClick={clear}
                className="col-span-2 bg-red-500 hover:bg-red-600 text-white"
              >
                Clear
              </Button>
              <Button
                onClick={() => setDisplay(display.slice(0, -1) || '0')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800"
              >
                <Delete className="w-5 h-5 mx-auto" />
              </Button>
              <Button
                onClick={() => handleOperation('÷')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                ÷
              </Button>

              <Button
                onClick={() => inputNumber('7')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                7
              </Button>
              <Button
                onClick={() => inputNumber('8')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                8
              </Button>
              <Button
                onClick={() => inputNumber('9')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                9
              </Button>
              <Button
                onClick={() => handleOperation('×')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                ×
              </Button>

              <Button
                onClick={() => inputNumber('4')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                4
              </Button>
              <Button
                onClick={() => inputNumber('5')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                5
              </Button>
              <Button
                onClick={() => inputNumber('6')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                6
              </Button>
              <Button
                onClick={() => handleOperation('-')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                -
              </Button>

              <Button
                onClick={() => inputNumber('1')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                1
              </Button>
              <Button
                onClick={() => inputNumber('2')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                2
              </Button>
              <Button
                onClick={() => inputNumber('3')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                3
              </Button>
              <Button
                onClick={() => handleOperation('+')}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                +
              </Button>

              <Button
                onClick={() => inputNumber('0')}
                className="col-span-2 bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                0
              </Button>
              <Button
                onClick={inputDecimal}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800"
              >
                .
              </Button>
              <Button
                onClick={() => handleOperation('=')}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                =
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Basic Calculator</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              A free online basic calculator for quick and easy arithmetic operations. Perform addition, subtraction,
              multiplication, and division with our simple calculator interface. Perfect for students, professionals,
              and anyone needing fast calculations.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">How to Use This Calculator</h3>
            <ul className="text-gray-600 text-sm space-y-2 mb-4">
              <li>• Enter numbers by clicking the number buttons</li>
              <li>• Select an operation (+, -, ×, ÷)</li>
              <li>• Enter the second number</li>
              <li>• Press = to see your result</li>
              <li>• Use Clear to start a new calculation</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Key Features</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-32">Operations:</span>
                <span>Addition, Subtraction, Multiplication, Division</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-32">Decimal Support:</span>
                <span>Calculate with decimal numbers</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-32">Display:</span>
                <span>Shows operation history and current input</span>
              </div>
              <div className="flex items-start">
                <span className="font-medium text-gray-900 min-w-32">Backspace:</span>
                <span>Delete last digit entered</span>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Why Use Our Calculator?</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Our online calculator is completely free, requires no download, and works on any device.
              Whether you're doing homework, balancing your budget, or splitting a bill, this calculator
              provides instant, accurate results. No ads interrupting your calculations, just a clean,
              easy-to-use interface.
            </p>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          <div className="bg-blue-50 rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Need More Functions?</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              For advanced calculations including scientific functions, trigonometry, logarithms,
              and exponents, try our Scientific Calculator with extended functionality.
            </p>
            <Link
              to="/scientific-calculator"
              className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Try Scientific Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicCalculator;