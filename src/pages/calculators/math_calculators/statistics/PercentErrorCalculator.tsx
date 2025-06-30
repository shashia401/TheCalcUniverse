import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, AlertCircle, Percent } from 'lucide-react';

const PercentErrorCalculator: React.FC = () => {
  const [measuredValue, setMeasuredValue] = useState('');
  const [actualValue, setActualValue] = useState('');
  const [errorType, setErrorType] = useState<'absolute' | 'relative'>('relative');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculatePercentError();
  }, [measuredValue, actualValue, errorType]);

  const calculatePercentError = () => {
    const measured = parseFloat(measuredValue);
    const actual = parseFloat(actualValue);
    
    if (!measuredValue || !actualValue || isNaN(measured) || isNaN(actual)) {
      setResult(null);
      return;
    }

    if (errorType === 'relative' && actual === 0) {
      setResult({ error: "Actual value cannot be zero for relative percent error" });
      return;
    }

    try {
      let absoluteError: number;
      let relativeError: number;
      let percentError: number;
      
      // Calculate absolute error
      absoluteError = Math.abs(measured - actual);
      
      // Calculate relative error
      if (errorType === 'relative') {
        relativeError = absoluteError / Math.abs(actual);
      } else {
        relativeError = absoluteError / 1; // For absolute error, denominator is 1 unit
      }
      
      // Calculate percent error
      percentError = relativeError * 100;
      
      // Generate steps
      const steps = [
        `Step 1: Identify the measured and actual values`,
        `- Measured value: ${measured}`,
        `- Actual value: ${actual}`,
        
        `Step 2: Calculate the absolute error`,
        `- Absolute error = |Measured value - Actual value|`,
        `- Absolute error = |${measured} - ${actual}|`,
        `- Absolute error = |${measured - actual}|`,
        `- Absolute error = ${absoluteError.toFixed(6)}`,
        
        `Step 3: Calculate the relative error`,
      ];
      
      if (errorType === 'relative') {
        steps.push(`- Relative error = Absolute error / |Actual value|`);
        steps.push(`- Relative error = ${absoluteError.toFixed(6)} / |${actual}|`);
        steps.push(`- Relative error = ${absoluteError.toFixed(6)} / ${Math.abs(actual)}`);
        steps.push(`- Relative error = ${relativeError.toFixed(6)}`);
      } else {
        steps.push(`- For absolute percent error, the relative error is simply the absolute error`);
        steps.push(`- Relative error = ${absoluteError.toFixed(6)}`);
      }
      
      steps.push(`Step 4: Convert to percent error`);
      steps.push(`- Percent error = Relative error × 100%`);
      steps.push(`- Percent error = ${relativeError.toFixed(6)} × 100%`);
      steps.push(`- Percent error = ${percentError.toFixed(6)}%`);
      
      // Determine accuracy level
      let accuracyLevel = '';
      if (percentError < 1) {
        accuracyLevel = 'Excellent';
      } else if (percentError < 5) {
        accuracyLevel = 'Very Good';
      } else if (percentError < 10) {
        accuracyLevel = 'Good';
      } else if (percentError < 20) {
        accuracyLevel = 'Fair';
      } else {
        accuracyLevel = 'Poor';
      }
      
      setResult({
        measured,
        actual,
        absoluteError,
        relativeError,
        percentError,
        accuracyLevel,
        errorType,
        steps
      });
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

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
        <span className="text-gray-900 font-medium">Percent Error Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Percent className="w-8 h-8 text-red-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Percent Error Calculator</h1>
        </div>

        {/* Error Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Error Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setErrorType('relative')}
              className={`p-4 rounded-lg border-2 transition-all ${
                errorType === 'relative'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Relative Percent Error</div>
              <div className="text-sm opacity-75">Error relative to the actual value</div>
            </button>
            <button
              onClick={() => setErrorType('absolute')}
              className={`p-4 rounded-lg border-2 transition-all ${
                errorType === 'absolute'
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Absolute Percent Error</div>
              <div className="text-sm opacity-75">Error in absolute terms</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Measured Value
            </label>
            <input
              type="number"
              value={measuredValue}
              onChange={(e) => setMeasuredValue(e.target.value)}
              placeholder="e.g., 9.8"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
            <div className="mt-1 text-sm text-gray-600">
              The value you measured or calculated
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actual Value
            </label>
            <input
              type="number"
              value={actualValue}
              onChange={(e) => setActualValue(e.target.value)}
              placeholder="e.g., 10"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-lg"
            />
            <div className="mt-1 text-sm text-gray-600">
              The true or accepted value
            </div>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Percent Error</h3>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-red-600 mb-2">
                  {result.percentError.toFixed(2)}%
                </div>
                <div className="text-gray-600">
                  {result.errorType === 'relative' ? 'Relative' : 'Absolute'} Percent Error
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Absolute Error</div>
                  <div className="text-xl font-bold text-gray-800">{result.absoluteError.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Relative Error</div>
                  <div className="text-xl font-bold text-gray-800">{result.relativeError.toFixed(6)}</div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Accuracy Level</div>
                  <div className="text-xl font-bold text-gray-800">{result.accuracyLevel}</div>
                </div>
              </div>
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interpretation</h3>
              <p className="text-gray-700 mb-4">
                The {result.errorType === 'relative' ? 'relative' : 'absolute'} percent error is {result.percentError.toFixed(2)}%, 
                which indicates {result.accuracyLevel.toLowerCase()} accuracy.
              </p>
              <p className="text-gray-700">
                {result.measured > result.actual 
                  ? `The measured value is ${((result.measured / result.actual - 1) * 100).toFixed(2)}% higher than the actual value.`
                  : result.measured < result.actual
                    ? `The measured value is ${((1 - result.measured / result.actual) * 100).toFixed(2)}% lower than the actual value.`
                    : `The measured value is exactly equal to the actual value.`
                }
              </p>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Calculation</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    {step.startsWith('-') ? (
                      <div className="ml-6 text-gray-700 font-mono text-sm">{step}</div>
                    ) : (
                      <>
                        <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="text-gray-700 font-mono text-sm">{step}</div>
                      </>
                    )}
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Percent Error</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Relative Percent Error</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Formula: |Measured - Actual| / |Actual| × 100%</li>
                <li>• Most commonly used form of percent error</li>
                <li>• Expresses error relative to the actual value</li>
                <li>• Cannot be used when actual value is zero</li>
                <li>• Used in most scientific and engineering applications</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Absolute Percent Error</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Formula: |Measured - Actual| × 100%</li>
                <li>• Expresses error in absolute terms</li>
                <li>• Can be used when actual value is zero</li>
                <li>• Used in certain specialized applications</li>
                <li>• Less common than relative percent error</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Laboratory experiments</li>
                <li>• Quality control in manufacturing</li>
                <li>• Scientific measurements</li>
                <li>• Weather forecasting</li>
                <li>• Economic predictions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Accuracy Levels</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• &lt;1%: Excellent accuracy</li>
                <li>• 1-5%: Very good accuracy</li>
                <li>• 5-10%: Good accuracy</li>
                <li>• 10-20%: Fair accuracy</li>
                <li>• &gt;20%: Poor accuracy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PercentErrorCalculator;