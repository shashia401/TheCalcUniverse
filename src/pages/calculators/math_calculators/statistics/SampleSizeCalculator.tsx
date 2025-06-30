import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Users, Calculator } from 'lucide-react';

const SampleSizeCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'proportion' | 'mean'>('proportion');
  
  // Common inputs
  const [confidenceLevel, setConfidenceLevel] = useState('95');
  const [marginOfError, setMarginOfError] = useState('5');
  
  // Proportion-specific inputs
  const [populationProportion, setPopulationProportion] = useState('50');
  
  // Mean-specific inputs
  const [standardDeviation, setStandardDeviation] = useState('');
  
  // Optional input
  const [populationSize, setPopulationSize] = useState('');
  
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateSampleSize();
  }, [
    calculationType, 
    confidenceLevel, 
    marginOfError, 
    populationProportion, 
    standardDeviation, 
    populationSize
  ]);

  const calculateSampleSize = () => {
    try {
      // Parse inputs
      const confidence = parseFloat(confidenceLevel);
      const error = parseFloat(marginOfError) / 100; // Convert from percentage to proportion
      const population = populationSize ? parseInt(populationSize) : null;
      
      // Validate inputs
      if (isNaN(confidence) || confidence <= 0 || confidence >= 100) {
        setResult(null);
        return;
      }
      
      if (isNaN(error) || error <= 0 || error >= 1) {
        setResult(null);
        return;
      }
      
      // Calculate Z-score based on confidence level
      const zScore = getZScore(confidence);
      
      let sampleSize: number;
      let steps: string[] = [];
      
      if (calculationType === 'proportion') {
        // Parse proportion-specific inputs
        const proportion = parseFloat(populationProportion) / 100; // Convert from percentage to proportion
        
        if (isNaN(proportion) || proportion < 0 || proportion > 1) {
          setResult(null);
          return;
        }
        
        // Calculate sample size for proportion
        steps.push(`Step 1: Identify the parameters`);
        steps.push(`- Confidence level: ${confidence}%`);
        steps.push(`- Z-score for ${confidence}% confidence: ${zScore.toFixed(4)}`);
        steps.push(`- Margin of error (E): ${(error * 100).toFixed(2)}%`);
        steps.push(`- Estimated proportion (p): ${(proportion * 100).toFixed(2)}%`);
        
        // Calculate sample size without finite population correction
        const uncorrectedSampleSize = Math.ceil((zScore * zScore * proportion * (1 - proportion)) / (error * error));
        steps.push(`Step 2: Calculate the sample size using the formula`);
        steps.push(`n = (Z²p(1-p)) / E²`);
        steps.push(`n = (${zScore.toFixed(4)}² × ${proportion.toFixed(4)} × ${(1 - proportion).toFixed(4)}) / ${error.toFixed(4)}²`);
        steps.push(`n = (${(zScore * zScore).toFixed(4)} × ${(proportion * (1 - proportion)).toFixed(4)}) / ${(error * error).toFixed(8)}`);
        steps.push(`n = ${(zScore * zScore * proportion * (1 - proportion)).toFixed(6)} / ${(error * error).toFixed(8)}`);
        steps.push(`n = ${uncorrectedSampleSize.toFixed(2)} ≈ ${uncorrectedSampleSize}`);
        
        // Apply finite population correction if population size is provided
        if (population) {
          const correctedSampleSize = Math.ceil((uncorrectedSampleSize * population) / (uncorrectedSampleSize + population - 1));
          steps.push(`Step 3: Apply finite population correction`);
          steps.push(`n' = (n × N) / (n + N - 1)`);
          steps.push(`n' = (${uncorrectedSampleSize} × ${population}) / (${uncorrectedSampleSize} + ${population} - 1)`);
          steps.push(`n' = ${uncorrectedSampleSize * population} / ${uncorrectedSampleSize + population - 1}`);
          steps.push(`n' = ${correctedSampleSize.toFixed(2)} ≈ ${correctedSampleSize}`);
          sampleSize = correctedSampleSize;
        } else {
          sampleSize = uncorrectedSampleSize;
        }
      } else {
        // Parse mean-specific inputs
        const stdDev = parseFloat(standardDeviation);
        
        if (isNaN(stdDev) || stdDev <= 0) {
          setResult(null);
          return;
        }
        
        // Calculate sample size for mean
        steps.push(`Step 1: Identify the parameters`);
        steps.push(`- Confidence level: ${confidence}%`);
        steps.push(`- Z-score for ${confidence}% confidence: ${zScore.toFixed(4)}`);
        steps.push(`- Margin of error (E): ${(error).toFixed(4)}`);
        steps.push(`- Standard deviation (σ): ${stdDev.toFixed(4)}`);
        
        // Calculate sample size without finite population correction
        const uncorrectedSampleSize = Math.ceil((zScore * zScore * stdDev * stdDev) / (error * error));
        steps.push(`Step 2: Calculate the sample size using the formula`);
        steps.push(`n = (Z²σ²) / E²`);
        steps.push(`n = (${zScore.toFixed(4)}² × ${stdDev.toFixed(4)}²) / ${error.toFixed(4)}²`);
        steps.push(`n = (${(zScore * zScore).toFixed(4)} × ${(stdDev * stdDev).toFixed(4)}) / ${(error * error).toFixed(8)}`);
        steps.push(`n = ${(zScore * zScore * stdDev * stdDev).toFixed(6)} / ${(error * error).toFixed(8)}`);
        steps.push(`n = ${uncorrectedSampleSize.toFixed(2)} ≈ ${uncorrectedSampleSize}`);
        
        // Apply finite population correction if population size is provided
        if (population) {
          const correctedSampleSize = Math.ceil((uncorrectedSampleSize * population) / (uncorrectedSampleSize + population - 1));
          steps.push(`Step 3: Apply finite population correction`);
          steps.push(`n' = (n × N) / (n + N - 1)`);
          steps.push(`n' = (${uncorrectedSampleSize} × ${population}) / (${uncorrectedSampleSize} + ${population} - 1)`);
          steps.push(`n' = ${uncorrectedSampleSize * population} / ${uncorrectedSampleSize + population - 1}`);
          steps.push(`n' = ${correctedSampleSize.toFixed(2)} ≈ ${correctedSampleSize}`);
          sampleSize = correctedSampleSize;
        } else {
          sampleSize = uncorrectedSampleSize;
        }
      }
      
      setResult({
        sampleSize,
        zScore,
        steps,
        parameters: {
          confidenceLevel: confidence,
          marginOfError: error * 100,
          populationProportion: calculationType === 'proportion' ? parseFloat(populationProportion) : null,
          standardDeviation: calculationType === 'mean' ? parseFloat(standardDeviation) : null,
          populationSize: population
        }
      });
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  const getZScore = (confidenceLevel: number): number => {
    // Common Z-scores for confidence levels
    if (confidenceLevel === 90) return 1.645;
    if (confidenceLevel === 95) return 1.96;
    if (confidenceLevel === 99) return 2.576;
    
    // Calculate Z-score for other confidence levels
    const alpha = 1 - confidenceLevel / 100;
    // This is an approximation of the inverse of the standard normal CDF
    const z = Math.sqrt(2) * inverseErf(1 - alpha);
    return z;
  };

  // Approximation of the inverse error function
  const inverseErf = (x: number): number => {
    const a = 0.147;
    const y = 2 * x - 1;
    const term1 = Math.log(1 - y * y);
    const term2 = 2 / (Math.PI * a) + term1 / 2;
    return y * Math.sqrt(Math.sqrt(term2 * term2 - term1 / a) - term2);
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
        <span className="text-gray-900 font-medium">Sample Size Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Users className="w-8 h-8 text-indigo-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Sample Size Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What are you estimating?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setCalculationType('proportion')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'proportion'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Population Proportion</div>
              <div className="text-sm opacity-75">For percentages, proportions, or categorical data</div>
            </button>
            <button
              onClick={() => setCalculationType('mean')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'mean'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Population Mean</div>
              <div className="text-sm opacity-75">For continuous data like heights, weights, etc.</div>
            </button>
          </div>
        </div>

        {/* Common Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confidence Level (%)
            </label>
            <select
              value={confidenceLevel}
              onChange={(e) => setConfidenceLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            >
              <option value="90">90%</option>
              <option value="95">95%</option>
              <option value="99">99%</option>
              <option value="99.9">99.9%</option>
            </select>
            <div className="mt-1 text-xs text-gray-500">
              How confident you want to be in your results
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Margin of Error {calculationType === 'proportion' ? '(%)' : ''}
            </label>
            <input
              type="number"
              value={marginOfError}
              onChange={(e) => setMarginOfError(e.target.value)}
              placeholder={calculationType === 'proportion' ? "e.g., 5" : "e.g., 0.5"}
              step="any"
              min="0.001"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
            />
            <div className="mt-1 text-xs text-gray-500">
              {calculationType === 'proportion' 
                ? 'The percentage points of error you can tolerate' 
                : 'The amount of error you can tolerate in the same units as your data'}
            </div>
          </div>
        </div>

        {/* Type-Specific Inputs */}
        <div className="mb-8">
          {calculationType === 'proportion' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Proportion (%)
              </label>
              <input
                type="number"
                value={populationProportion}
                onChange={(e) => setPopulationProportion(e.target.value)}
                placeholder="e.g., 50"
                min="0"
                max="100"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
              <div className="mt-1 text-xs text-gray-500">
                Your expected proportion (use 50 if unsure for most conservative estimate)
              </div>
            </div>
          )}

          {calculationType === 'mean' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Standard Deviation
              </label>
              <input
                type="number"
                value={standardDeviation}
                onChange={(e) => setStandardDeviation(e.target.value)}
                placeholder="e.g., 10"
                min="0.001"
                step="any"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
              />
              <div className="mt-1 text-xs text-gray-500">
                Estimated standard deviation of the population (from pilot study or prior research)
              </div>
            </div>
          )}
        </div>

        {/* Optional Input */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Population Size (optional)
            </label>
            <span className="text-xs text-gray-500">Leave blank for infinite population</span>
          </div>
          <input
            type="number"
            value={populationSize}
            onChange={(e) => setPopulationSize(e.target.value)}
            placeholder="e.g., 10000"
            min="1"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg"
          />
          <div className="mt-1 text-xs text-gray-500">
            Only needed for small populations (applies finite population correction)
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Sample Size</h3>
              <div className="text-5xl font-bold text-indigo-600 mb-4">
                {result.sampleSize}
              </div>
              <div className="text-gray-600">
                Minimum number of samples needed
              </div>
            </div>

            {/* Parameters Summary */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Parameters Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Confidence Level:</span>
                  <span className="font-medium">{result.parameters.confidenceLevel}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Z-Score:</span>
                  <span className="font-medium">{result.zScore.toFixed(4)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margin of Error:</span>
                  <span className="font-medium">
                    {calculationType === 'proportion' ? `${result.parameters.marginOfError}%` : result.parameters.marginOfError}
                  </span>
                </div>
                {calculationType === 'proportion' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Proportion:</span>
                    <span className="font-medium">{result.parameters.populationProportion}%</span>
                  </div>
                )}
                {calculationType === 'mean' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Standard Deviation:</span>
                    <span className="font-medium">{result.parameters.standardDeviation}</span>
                  </div>
                )}
                {result.parameters.populationSize && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Population Size:</span>
                    <span className="font-medium">{result.parameters.populationSize}</span>
                  </div>
                )}
              </div>
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
                        <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Sample Size Calculation</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Key Concepts</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Confidence Level:</strong> The probability that the true value falls within the margin of error</li>
                <li>• <strong>Margin of Error:</strong> The amount of error you're willing to accept</li>
                <li>• <strong>Population Proportion:</strong> Expected percentage of the population with a particular attribute</li>
                <li>• <strong>Standard Deviation:</strong> A measure of the amount of variation in the population</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">When to Use</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>Proportion:</strong> For surveys, polls, and categorical data</li>
                <li>• <strong>Mean:</strong> For continuous data like measurements, test scores, etc.</li>
                <li>• <strong>Population Size:</strong> Only needed for small populations (typically &lt;10,000)</li>
                <li>• <strong>Higher Confidence:</strong> Requires larger sample size</li>
                <li>• <strong>Smaller Margin of Error:</strong> Requires larger sample size</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Formulas</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• <strong>For Proportion:</strong> n = (Z²p(1-p)) / E²</li>
                <li>• <strong>For Mean:</strong> n = (Z²σ²) / E²</li>
                <li>• <strong>Finite Population Correction:</strong> n' = (n×N) / (n+N-1)</li>
                <li>• Where Z is the z-score, p is the proportion, σ is the standard deviation, E is the margin of error, and N is the population size</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Common Z-Scores</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• 90% confidence: Z = 1.645</li>
                <li>• 95% confidence: Z = 1.96</li>
                <li>• 99% confidence: Z = 2.576</li>
                <li>• 99.9% confidence: Z = 3.291</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SampleSizeCalculator;