import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3 } from 'lucide-react';

const PValueCalculator: React.FC = () => {
  const [testType, setTestType] = useState<'z' | 't' | 'chi' | 'f'>('z');
  const [tailType, setTailType] = useState<'left' | 'right' | 'two'>('two');
  const [testStatistic, setTestStatistic] = useState('');
  const [degreesOfFreedom, setDegreesOfFreedom] = useState('');
  const [degreesOfFreedom2, setDegreesOfFreedom2] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculatePValue();
  }, [testType, tailType, testStatistic, degreesOfFreedom, degreesOfFreedom2]);

  const calculatePValue = () => {
    try {
      const statistic = parseFloat(testStatistic);
      
      if (!testStatistic || isNaN(statistic)) {
        setResult(null);
        return;
      }

      let pValue: number;
      let steps: string[] = [];
      
      if (testType === 'z') {
        // Z-test p-value calculation
        pValue = calculateZTestPValue(statistic, tailType);
        
        steps = [
          `Step 1: Identify the test statistic and tail type`,
          `- Test statistic (z): ${statistic.toFixed(4)}`,
          `- Tail type: ${tailType === 'left' ? 'Left-tailed' : tailType === 'right' ? 'Right-tailed' : 'Two-tailed'}`,
          
          `Step 2: Calculate the p-value using the standard normal distribution`,
        ];
        
        if (tailType === 'left') {
          steps.push(`- For a left-tailed test, p-value = P(Z ≤ ${statistic.toFixed(4)})`);
          steps.push(`- p-value = ${pValue.toFixed(6)}`);
        } else if (tailType === 'right') {
          steps.push(`- For a right-tailed test, p-value = P(Z ≥ ${statistic.toFixed(4)})`);
          steps.push(`- p-value = 1 - P(Z < ${statistic.toFixed(4)})`);
          steps.push(`- p-value = 1 - ${(1 - pValue).toFixed(6)}`);
          steps.push(`- p-value = ${pValue.toFixed(6)}`);
        } else {
          steps.push(`- For a two-tailed test, p-value = 2 × P(Z ≥ |${statistic.toFixed(4)}|)`);
          steps.push(`- p-value = 2 × P(Z ≥ ${Math.abs(statistic).toFixed(4)})`);
          steps.push(`- p-value = 2 × ${(pValue / 2).toFixed(6)}`);
          steps.push(`- p-value = ${pValue.toFixed(6)}`);
        }
      } else if (testType === 't') {
        // T-test p-value calculation
        const df = parseInt(degreesOfFreedom);
        
        if (!degreesOfFreedom || isNaN(df) || df < 1) {
          setResult(null);
          return;
        }
        
        pValue = calculateTTestPValue(statistic, df, tailType);
        
        steps = [
          `Step 1: Identify the test statistic, degrees of freedom, and tail type`,
          `- Test statistic (t): ${statistic.toFixed(4)}`,
          `- Degrees of freedom: ${df}`,
          `- Tail type: ${tailType === 'left' ? 'Left-tailed' : tailType === 'right' ? 'Right-tailed' : 'Two-tailed'}`,
          
          `Step 2: Calculate the p-value using the t-distribution with ${df} degrees of freedom`,
        ];
        
        if (tailType === 'left') {
          steps.push(`- For a left-tailed test, p-value = P(T ≤ ${statistic.toFixed(4)})`);
          steps.push(`- p-value = ${pValue.toFixed(6)}`);
        } else if (tailType === 'right') {
          steps.push(`- For a right-tailed test, p-value = P(T ≥ ${statistic.toFixed(4)})`);
          steps.push(`- p-value = ${pValue.toFixed(6)}`);
        } else {
          steps.push(`- For a two-tailed test, p-value = 2 × P(T ≥ |${statistic.toFixed(4)}|)`);
          steps.push(`- p-value = 2 × P(T ≥ ${Math.abs(statistic).toFixed(4)})`);
          steps.push(`- p-value = 2 × ${(pValue / 2).toFixed(6)}`);
          steps.push(`- p-value = ${pValue.toFixed(6)}`);
        }
      } else if (testType === 'chi') {
        // Chi-square test p-value calculation
        const df = parseInt(degreesOfFreedom);
        
        if (!degreesOfFreedom || isNaN(df) || df < 1) {
          setResult(null);
          return;
        }
        
        if (statistic < 0) {
          setResult({ error: "Chi-square statistic must be non-negative" });
          return;
        }
        
        pValue = calculateChiSquarePValue(statistic, df);
        
        steps = [
          `Step 1: Identify the test statistic and degrees of freedom`,
          `- Chi-square statistic (χ²): ${statistic.toFixed(4)}`,
          `- Degrees of freedom: ${df}`,
          
          `Step 2: Calculate the p-value using the chi-square distribution`,
          `- For a chi-square test, p-value = P(χ² ≥ ${statistic.toFixed(4)})`,
          `- p-value = ${pValue.toFixed(6)}`
        ];
      } else if (testType === 'f') {
        // F-test p-value calculation
        const df1 = parseInt(degreesOfFreedom);
        const df2 = parseInt(degreesOfFreedom2);
        
        if (!degreesOfFreedom || !degreesOfFreedom2 || isNaN(df1) || isNaN(df2) || df1 < 1 || df2 < 1) {
          setResult(null);
          return;
        }
        
        if (statistic < 0) {
          setResult({ error: "F statistic must be non-negative" });
          return;
        }
        
        pValue = calculateFTestPValue(statistic, df1, df2);
        
        steps = [
          `Step 1: Identify the test statistic and degrees of freedom`,
          `- F statistic: ${statistic.toFixed(4)}`,
          `- Numerator degrees of freedom (df1): ${df1}`,
          `- Denominator degrees of freedom (df2): ${df2}`,
          
          `Step 2: Calculate the p-value using the F-distribution`,
          `- For an F-test, p-value = P(F ≥ ${statistic.toFixed(4)})`,
          `- p-value = ${pValue.toFixed(6)}`
        ];
      }
      
      // Interpret the p-value
      let interpretation = '';
      if (pValue < 0.001) {
        interpretation = 'Very strong evidence against the null hypothesis';
      } else if (pValue < 0.01) {
        interpretation = 'Strong evidence against the null hypothesis';
      } else if (pValue < 0.05) {
        interpretation = 'Moderate evidence against the null hypothesis';
      } else if (pValue < 0.1) {
        interpretation = 'Weak evidence against the null hypothesis';
      } else {
        interpretation = 'Little to no evidence against the null hypothesis';
      }
      
      steps.push(`Step 3: Interpret the p-value`);
      steps.push(`- p-value = ${pValue.toFixed(6)}`);
      steps.push(`- Interpretation: ${interpretation}`);
      
      if (pValue < 0.05) {
        steps.push(`- At the 5% significance level, we would reject the null hypothesis`);
      } else {
        steps.push(`- At the 5% significance level, we would fail to reject the null hypothesis`);
      }
      
      setResult({
        pValue,
        interpretation,
        steps,
        testType,
        tailType,
        statistic,
        degreesOfFreedom: testType === 'z' ? null : parseInt(degreesOfFreedom),
        degreesOfFreedom2: testType === 'f' ? parseInt(degreesOfFreedom2) : null
      });
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  // Z-test p-value calculation
  const calculateZTestPValue = (z: number, tail: 'left' | 'right' | 'two'): number => {
    const standardNormalCDF = (x: number): number => {
      // Approximation of the standard normal CDF
      if (x < -6) return 0;
      if (x > 6) return 1;
      
      let sum = 0;
      let term = x;
      let i = 3;
      
      while (Math.abs(term) > 1e-10) {
        sum += term;
        term = term * x * x / i;
        i += 2;
      }
      
      return 0.5 + sum * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
    };
    
    if (tail === 'left') {
      return standardNormalCDF(z);
    } else if (tail === 'right') {
      return 1 - standardNormalCDF(z);
    } else {
      // Two-tailed test
      return 2 * (1 - standardNormalCDF(Math.abs(z)));
    }
  };

  // T-test p-value calculation
  const calculateTTestPValue = (t: number, df: number, tail: 'left' | 'right' | 'two'): number => {
    // This is a simplified approximation of the t-distribution p-value
    // For more accurate values, a proper t-distribution function should be used
    
    // Convert t to z using degrees of freedom adjustment
    let z = t;
    if (df < 30) {
      // Approximate adjustment for small df
      z = t * (1 - 1 / (4 * df));
    }
    
    // Use z-distribution as approximation
    const pValue = calculateZTestPValue(z, tail);
    
    return pValue;
  };

  // Chi-square test p-value calculation
  const calculateChiSquarePValue = (chiSquare: number, df: number): number => {
    // This is a simplified approximation of the chi-square p-value
    // For more accurate values, a proper chi-square distribution function should be used
    
    // For df > 30, chi-square distribution can be approximated by normal distribution
    if (df > 30) {
      const z = Math.sqrt(2 * chiSquare) - Math.sqrt(2 * df - 1);
      return 1 - calculateZTestPValue(z, 'left');
    }
    
    // For smaller df, use a lookup table or approximation
    // This is a very rough approximation
    const pValue = Math.exp(-0.5 * chiSquare) * Math.pow(chiSquare / 2, df / 2) / 
                  (Math.pow(2, df / 2) * gamma(df / 2));
    
    return Math.min(1, Math.max(0, 1 - pValue));
  };

  // F-test p-value calculation
  const calculateFTestPValue = (f: number, df1: number, df2: number): number => {
    // This is a simplified approximation of the F-distribution p-value
    // For more accurate values, a proper F-distribution function should be used
    
    // For large df, F-distribution can be approximated
    if (df1 > 100 && df2 > 100) {
      const z = Math.sqrt(2 * Math.log(f)) - Math.sqrt(2 * df1 - 1);
      return 1 - calculateZTestPValue(z, 'left');
    }
    
    // For smaller df, use a lookup table or approximation
    // This is a very rough approximation
    const pValue = 0.5 - 0.5 * Math.tanh((f - 1) * Math.sqrt(df1 / (2 * df2)));
    
    return Math.min(1, Math.max(0, pValue));
  };

  // Gamma function approximation for chi-square calculation
  const gamma = (z: number): number => {
    // Approximation of the gamma function for positive values
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    
    z -= 1;
    let x = 0.99999999999980993;
    const p = [
      676.5203681218851, -1259.1392167224028, 771.32342877765313,
      -176.61502916214059, 12.507343278686905, -0.13857109526572012,
      9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    
    for (let i = 0; i < p.length; i++) {
      x += p[i] / (z + i + 1);
    }
    
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  };

  const significanceLevels = [
    { level: 0.001, description: 'Very strong evidence against null hypothesis' },
    { level: 0.01, description: 'Strong evidence against null hypothesis' },
    { level: 0.05, description: 'Moderate evidence against null hypothesis' },
    { level: 0.1, description: 'Weak evidence against null hypothesis' },
  ];

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
        <span className="text-gray-900 font-medium">P-Value Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-purple-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">P-Value Calculator</h1>
        </div>

        {/* Test Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Statistical Test
          </label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <button
              onClick={() => setTestType('z')}
              className={`p-4 rounded-lg border-2 transition-all ${
                testType === 'z'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Z-Test</div>
              <div className="text-sm opacity-75">Normal distribution</div>
            </button>
            <button
              onClick={() => setTestType('t')}
              className={`p-4 rounded-lg border-2 transition-all ${
                testType === 't'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">t-Test</div>
              <div className="text-sm opacity-75">Small samples</div>
            </button>
            <button
              onClick={() => setTestType('chi')}
              className={`p-4 rounded-lg border-2 transition-all ${
                testType === 'chi'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Chi-Square</div>
              <div className="text-sm opacity-75">Categorical data</div>
            </button>
            <button
              onClick={() => setTestType('f')}
              className={`p-4 rounded-lg border-2 transition-all ${
                testType === 'f'
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">F-Test</div>
              <div className="text-sm opacity-75">Variance comparison</div>
            </button>
          </div>
        </div>

        {/* Tail Type Selection (only for z and t tests) */}
        {(testType === 'z' || testType === 't') && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tail Type
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => setTailType('left')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tailType === 'left'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">Left-Tailed</div>
                <div className="text-sm opacity-75">H₁: μ &lt; μ₀</div>
              </button>
              <button
                onClick={() => setTailType('right')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tailType === 'right'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">Right-Tailed</div>
                <div className="text-sm opacity-75">H₁: μ &gt; μ₀</div>
              </button>
              <button
                onClick={() => setTailType('two')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  tailType === 'two'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="font-medium">Two-Tailed</div>
                <div className="text-sm opacity-75">H₁: μ ≠ μ₀</div>
              </button>
            </div>
          </div>
        )}

        {/* Test Statistic Input */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Statistic ({testType === 'z' ? 'z' : testType === 't' ? 't' : testType === 'chi' ? 'χ²' : 'F'})
          </label>
          <input
            type="number"
            value={testStatistic}
            onChange={(e) => setTestStatistic(e.target.value)}
            placeholder={`Enter ${testType}-statistic`}
            step="any"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Degrees of Freedom Input */}
        {testType !== 'z' && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {testType === 'f' ? 'Numerator Degrees of Freedom (df1)' : 'Degrees of Freedom'}
            </label>
            <input
              type="number"
              value={degreesOfFreedom}
              onChange={(e) => setDegreesOfFreedom(e.target.value)}
              placeholder="e.g., 10"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            {testType === 't' && (
              <div className="mt-1 text-sm text-gray-600">
                For a t-test, df = n - 1 for one-sample test, df = n₁ + n₂ - 2 for two-sample test
              </div>
            )}
            {testType === 'chi' && (
              <div className="mt-1 text-sm text-gray-600">
                For a chi-square test, df = (rows - 1) × (columns - 1) for independence test, df = categories - 1 for goodness of fit
              </div>
            )}
          </div>
        )}

        {/* Second Degrees of Freedom Input (for F-test) */}
        {testType === 'f' && (
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Denominator Degrees of Freedom (df2)
            </label>
            <input
              type="number"
              value={degreesOfFreedom2}
              onChange={(e) => setDegreesOfFreedom2(e.target.value)}
              placeholder="e.g., 20"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
            <div className="mt-1 text-sm text-gray-600">
              For ANOVA, df1 = k - 1 (groups - 1) and df2 = N - k (total observations - groups)
            </div>
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">P-Value Result</h3>
              
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-purple-600 mb-2">
                  {result.pValue.toFixed(6)}
                </div>
                <div className="text-gray-600">
                  {result.pValue < 0.0001 ? 'p < 0.0001' : `p = ${result.pValue.toFixed(4)}`}
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-sm text-gray-600 mb-1">Interpretation</div>
                <div className="text-lg font-medium text-gray-900">{result.interpretation}</div>
                <div className="mt-2 text-sm text-gray-600">
                  {result.pValue < 0.05 
                    ? 'At the 5% significance level, reject the null hypothesis.' 
                    : 'At the 5% significance level, fail to reject the null hypothesis.'}
                </div>
              </div>
            </div>

            {/* Significance Levels */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Significance Levels</h3>
              <div className="space-y-3">
                {significanceLevels.map((level, index) => (
                  <div 
                    key={index} 
                    className={`flex justify-between items-center p-3 rounded-lg ${
                      result.pValue < level.level 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        result.pValue < level.level ? 'bg-green-500' : 'bg-gray-300'
                      }`}></div>
                      <span className="ml-3 text-gray-700">α = {level.level}</span>
                    </div>
                    <span className={`font-medium ${
                      result.pValue < level.level ? 'text-green-600' : 'text-gray-500'
                    }`}>
                      {result.pValue < level.level ? 'Significant' : 'Not significant'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Calculation</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About P-Values</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">What is a P-Value?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• The probability of obtaining results at least as extreme as the observed results, assuming the null hypothesis is true</li>
                <li>• Smaller p-values indicate stronger evidence against the null hypothesis</li>
                <li>• Common threshold (α) for significance is 0.05</li>
                <li>• If p &lt; α, we reject the null hypothesis</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Test Types</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Z-test:</strong> Used when population standard deviation is known or sample size is large</li>
                <li>• <strong>t-test:</strong> Used for small samples or when population standard deviation is unknown</li>
                <li>• <strong>Chi-square test:</strong> Used for categorical data and goodness of fit tests</li>
                <li>• <strong>F-test:</strong> Used for comparing variances or in ANOVA</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Tail Types</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Left-tailed:</strong> Tests if parameter is less than specified value</li>
                <li>• <strong>Right-tailed:</strong> Tests if parameter is greater than specified value</li>
                <li>• <strong>Two-tailed:</strong> Tests if parameter is different from specified value</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Common Misinterpretations</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• P-value is NOT the probability that the null hypothesis is true</li>
                <li>• P-value is NOT the probability of making a mistake by rejecting the null</li>
                <li>• Statistical significance does not always imply practical significance</li>
                <li>• Small p-values don't indicate large effect sizes</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PValueCalculator;