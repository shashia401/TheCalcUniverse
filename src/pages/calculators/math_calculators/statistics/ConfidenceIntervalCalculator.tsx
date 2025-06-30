import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, BarChart3, Plus, Trash2 } from 'lucide-react';

const ConfidenceIntervalCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'mean' | 'proportion'>('mean');
  const [confidenceLevel, setConfidenceLevel] = useState('95');
  
  // Mean-specific inputs
  const [dataPoints, setDataPoints] = useState<string[]>(['', '', '', '', '']);
  const [mean, setMean] = useState('');
  const [stdDev, setStdDev] = useState('');
  const [sampleSize, setSampleSize] = useState('');
  const [useDataPoints, setUseDataPoints] = useState(true);
  
  // Proportion-specific inputs
  const [successes, setSuccesses] = useState('');
  const [trials, setTrials] = useState('');
  
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateConfidenceInterval();
  }, [
    calculationType, 
    confidenceLevel, 
    dataPoints, 
    mean, 
    stdDev, 
    sampleSize, 
    useDataPoints,
    successes,
    trials
  ]);

  const addDataPoint = () => {
    setDataPoints([...dataPoints, '']);
  };

  const removeDataPoint = (index: number) => {
    if (dataPoints.length > 1) {
      setDataPoints(dataPoints.filter((_, i) => i !== index));
    }
  };

  const updateDataPoint = (index: number, value: string) => {
    const newDataPoints = [...dataPoints];
    newDataPoints[index] = value;
    setDataPoints(newDataPoints);
  };

  const calculateConfidenceInterval = () => {
    try {
      if (calculationType === 'mean') {
        if (useDataPoints) {
          // Calculate from data points
          const validDataPoints = dataPoints
            .filter(point => point !== '' && !isNaN(parseFloat(point)))
            .map(point => parseFloat(point));
          
          if (validDataPoints.length < 2) {
            setResult(null);
            return;
          }
          
          const n = validDataPoints.length;
          const calculatedMean = validDataPoints.reduce((sum, val) => sum + val, 0) / n;
          const calculatedStdDev = Math.sqrt(
            validDataPoints.reduce((sum, val) => sum + Math.pow(val - calculatedMean, 2), 0) / (n - 1)
          );
          
          calculateMeanCI(calculatedMean, calculatedStdDev, n);
        } else {
          // Calculate from summary statistics
          const meanValue = parseFloat(mean);
          const stdDevValue = parseFloat(stdDev);
          const n = parseInt(sampleSize);
          
          if (isNaN(meanValue) || isNaN(stdDevValue) || isNaN(n) || n < 2) {
            setResult(null);
            return;
          }
          
          calculateMeanCI(meanValue, stdDevValue, n);
        }
      } else {
        // Calculate for proportion
        const successCount = parseInt(successes);
        const trialCount = parseInt(trials);
        
        if (isNaN(successCount) || isNaN(trialCount) || successCount < 0 || trialCount <= 0 || successCount > trialCount) {
          setResult(null);
          return;
        }
        
        calculateProportionCI(successCount, trialCount);
      }
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  const calculateMeanCI = (meanValue: number, stdDevValue: number, n: number) => {
    const confidence = parseFloat(confidenceLevel);
    if (isNaN(confidence) || confidence <= 0 || confidence >= 100) {
      setResult(null);
      return;
    }
    
    // Get z-score or t-score based on sample size
    const useT = n < 30;
    const criticalValue = useT ? getTScore(confidence, n - 1) : getZScore(confidence);
    
    // Calculate standard error
    const standardError = stdDevValue / Math.sqrt(n);
    
    // Calculate margin of error
    const marginOfError = criticalValue * standardError;
    
    // Calculate confidence interval
    const lowerBound = meanValue - marginOfError;
    const upperBound = meanValue + marginOfError;
    
    // Generate steps
    const steps = [
      `Step 1: Identify the parameters`,
      `- Sample mean (x̄): ${meanValue.toFixed(4)}`,
      `- Sample standard deviation (s): ${stdDevValue.toFixed(4)}`,
      `- Sample size (n): ${n}`,
      `- Confidence level: ${confidence}%`,
      
      `Step 2: Determine the critical value`,
      useT 
        ? `- Using t-distribution with df = n - 1 = ${n - 1} (since n < 30)`
        : `- Using z-distribution (since n ≥ 30)`,
      `- Critical value for ${confidence}% confidence: ${criticalValue.toFixed(4)}`,
      
      `Step 3: Calculate the standard error`,
      `- Standard error (SE) = s / √n`,
      `- SE = ${stdDevValue.toFixed(4)} / √${n}`,
      `- SE = ${stdDevValue.toFixed(4)} / ${Math.sqrt(n).toFixed(4)}`,
      `- SE = ${standardError.toFixed(6)}`,
      
      `Step 4: Calculate the margin of error`,
      `- Margin of error = Critical value × Standard error`,
      `- Margin of error = ${criticalValue.toFixed(4)} × ${standardError.toFixed(6)}`,
      `- Margin of error = ${marginOfError.toFixed(6)}`,
      
      `Step 5: Calculate the confidence interval`,
      `- Lower bound = x̄ - Margin of error`,
      `- Lower bound = ${meanValue.toFixed(4)} - ${marginOfError.toFixed(6)}`,
      `- Lower bound = ${lowerBound.toFixed(6)}`,
      
      `- Upper bound = x̄ + Margin of error`,
      `- Upper bound = ${meanValue.toFixed(4)} + ${marginOfError.toFixed(6)}`,
      `- Upper bound = ${upperBound.toFixed(6)}`,
      
      `Step 6: Express the confidence interval`,
      `- ${confidence}% Confidence Interval: (${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)})`
    ];
    
    setResult({
      type: 'mean',
      mean: meanValue,
      stdDev: stdDevValue,
      n,
      confidence,
      criticalValue,
      standardError,
      marginOfError,
      lowerBound,
      upperBound,
      useT,
      steps
    });
  };

  const calculateProportionCI = (successCount: number, trialCount: number) => {
    const confidence = parseFloat(confidenceLevel);
    if (isNaN(confidence) || confidence <= 0 || confidence >= 100) {
      setResult(null);
      return;
    }
    
    // Calculate sample proportion
    const proportion = successCount / trialCount;
    
    // Get z-score
    const zScore = getZScore(confidence);
    
    // Check if normal approximation is appropriate
    const normalApproximationValid = trialCount * proportion >= 5 && trialCount * (1 - proportion) >= 5;
    
    // Calculate standard error
    const standardError = Math.sqrt((proportion * (1 - proportion)) / trialCount);
    
    // Calculate margin of error
    const marginOfError = zScore * standardError;
    
    // Calculate confidence interval
    const lowerBound = Math.max(0, proportion - marginOfError);
    const upperBound = Math.min(1, proportion + marginOfError);
    
    // Generate steps
    const steps = [
      `Step 1: Identify the parameters`,
      `- Number of successes (x): ${successCount}`,
      `- Number of trials (n): ${trialCount}`,
      `- Sample proportion (p̂): x/n = ${successCount}/${trialCount} = ${proportion.toFixed(6)}`,
      `- Confidence level: ${confidence}%`,
      
      `Step 2: Check if normal approximation is appropriate`,
      `- np̂ = ${trialCount} × ${proportion.toFixed(6)} = ${(trialCount * proportion).toFixed(2)}`,
      `- n(1-p̂) = ${trialCount} × ${(1 - proportion).toFixed(6)} = ${(trialCount * (1 - proportion)).toFixed(2)}`,
      `- Normal approximation is ${normalApproximationValid ? 'valid' : 'not valid'} (both values should be ≥ 5)`,
      
      `Step 3: Determine the critical value`,
      `- Z-score for ${confidence}% confidence: ${zScore.toFixed(4)}`,
      
      `Step 4: Calculate the standard error`,
      `- Standard error (SE) = √[p̂(1-p̂)/n]`,
      `- SE = √[${proportion.toFixed(6)} × ${(1 - proportion).toFixed(6)} / ${trialCount}]`,
      `- SE = √[${(proportion * (1 - proportion)).toFixed(6)} / ${trialCount}]`,
      `- SE = √${(proportion * (1 - proportion) / trialCount).toFixed(8)}`,
      `- SE = ${standardError.toFixed(6)}`,
      
      `Step 5: Calculate the margin of error`,
      `- Margin of error = Z × Standard error`,
      `- Margin of error = ${zScore.toFixed(4)} × ${standardError.toFixed(6)}`,
      `- Margin of error = ${marginOfError.toFixed(6)}`,
      
      `Step 6: Calculate the confidence interval`,
      `- Lower bound = p̂ - Margin of error`,
      `- Lower bound = ${proportion.toFixed(6)} - ${marginOfError.toFixed(6)}`,
      `- Lower bound = ${(proportion - marginOfError).toFixed(6)}`,
      `- Lower bound (adjusted) = ${lowerBound.toFixed(6)} (cannot be less than 0)`,
      
      `- Upper bound = p̂ + Margin of error`,
      `- Upper bound = ${proportion.toFixed(6)} + ${marginOfError.toFixed(6)}`,
      `- Upper bound = ${(proportion + marginOfError).toFixed(6)}`,
      `- Upper bound (adjusted) = ${upperBound.toFixed(6)} (cannot exceed 1)`,
      
      `Step 7: Express the confidence interval`,
      `- ${confidence}% Confidence Interval: (${lowerBound.toFixed(4)}, ${upperBound.toFixed(4)})`,
      `- As percentage: (${(lowerBound * 100).toFixed(2)}%, ${(upperBound * 100).toFixed(2)}%)`
    ];
    
    setResult({
      type: 'proportion',
      successes: successCount,
      trials: trialCount,
      proportion,
      confidence,
      zScore,
      standardError,
      marginOfError,
      lowerBound,
      upperBound,
      normalApproximationValid,
      steps
    });
  };

  const getZScore = (confidenceLevel: number): number => {
    // Common Z-scores for confidence levels
    if (confidenceLevel === 90) return 1.645;
    if (confidenceLevel === 95) return 1.96;
    if (confidenceLevel === 99) return 2.576;
    if (confidenceLevel === 99.9) return 3.291;
    
    // Calculate Z-score for other confidence levels
    const alpha = 1 - confidenceLevel / 100;
    // This is an approximation of the inverse of the standard normal CDF
    const z = Math.sqrt(2) * inverseErf(1 - alpha / 2);
    return z;
  };

  const getTScore = (confidenceLevel: number, df: number): number => {
    // This is a simplified approximation of the t-distribution critical values
    // For more accurate values, a proper t-distribution table or function should be used
    const z = getZScore(confidenceLevel);
    
    // Adjust z-score based on degrees of freedom
    if (df >= 30) return z;
    if (df >= 10) return z + 0.08;
    if (df >= 5) return z + 0.3;
    return z + 0.5; // Very small sample size
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
        <span className="text-gray-900 font-medium">Confidence Interval Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <BarChart3 className="w-8 h-8 text-teal-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Confidence Interval Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What are you estimating?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => setCalculationType('mean')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'mean'
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Population Mean</div>
              <div className="text-sm opacity-75">For continuous data like heights, weights, etc.</div>
            </button>
            <button
              onClick={() => setCalculationType('proportion')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'proportion'
                  ? 'border-teal-500 bg-teal-50 text-teal-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Population Proportion</div>
              <div className="text-sm opacity-75">For percentages, proportions, or categorical data</div>
            </button>
          </div>
        </div>

        {/* Confidence Level Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Level
          </label>
          <select
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
          >
            <option value="90">90%</option>
            <option value="95">95%</option>
            <option value="99">99%</option>
            <option value="99.9">99.9%</option>
          </select>
          <div className="mt-1 text-sm text-gray-600">
            How confident you want to be that the true population parameter falls within your interval
          </div>
        </div>

        {/* Type-Specific Inputs */}
        {calculationType === 'mean' && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Mean Confidence Interval</h3>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={useDataPoints}
                    onChange={() => setUseDataPoints(true)}
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enter data points</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!useDataPoints}
                    onChange={() => setUseDataPoints(false)}
                    className="w-4 h-4 text-teal-600 border-gray-300 focus:ring-teal-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enter summary statistics</span>
                </label>
              </div>
            </div>

            {useDataPoints ? (
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Data Points
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {dataPoints.map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={point}
                        onChange={(e) => updateDataPoint(index, e.target.value)}
                        placeholder={`Value ${index + 1}`}
                        step="any"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                      <button
                        onClick={() => removeDataPoint(index)}
                        disabled={dataPoints.length <= 1}
                        className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={addDataPoint}
                  className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Data Point</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Mean
                  </label>
                  <input
                    type="number"
                    value={mean}
                    onChange={(e) => setMean(e.target.value)}
                    placeholder="e.g., 75.2"
                    step="any"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Standard Deviation
                  </label>
                  <input
                    type="number"
                    value={stdDev}
                    onChange={(e) => setStdDev(e.target.value)}
                    placeholder="e.g., 12.4"
                    step="any"
                    min="0.001"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sample Size
                  </label>
                  <input
                    type="number"
                    value={sampleSize}
                    onChange={(e) => setSampleSize(e.target.value)}
                    placeholder="e.g., 30"
                    min="2"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {calculationType === 'proportion' && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Proportion Confidence Interval</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Successes
                </label>
                <input
                  type="number"
                  value={successes}
                  onChange={(e) => setSuccesses(e.target.value)}
                  placeholder="e.g., 42"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                />
                <div className="mt-1 text-sm text-gray-600">
                  Number of items with the characteristic of interest
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Trials
                </label>
                <input
                  type="number"
                  value={trials}
                  onChange={(e) => setTrials(e.target.value)}
                  placeholder="e.g., 100"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-lg"
                />
                <div className="mt-1 text-sm text-gray-600">
                  Total sample size
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Confidence Interval</h3>
              
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {result.type === 'mean' 
                    ? `(${result.lowerBound.toFixed(4)}, ${result.upperBound.toFixed(4)})`
                    : `(${(result.lowerBound * 100).toFixed(2)}%, ${(result.upperBound * 100).toFixed(2)}%)`
                  }
                </div>
                <div className="text-gray-600">
                  {result.confidence}% Confidence Interval for the Population {result.type === 'mean' ? 'Mean' : 'Proportion'}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Margin of Error</div>
                  <div className="text-xl font-bold text-teal-600">
                    {result.type === 'mean' 
                      ? result.marginOfError.toFixed(4)
                      : `${(result.marginOfError * 100).toFixed(2)}%`
                    }
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {result.type === 'mean' ? 'Sample Mean' : 'Sample Proportion'}
                  </div>
                  <div className="text-xl font-bold text-cyan-600">
                    {result.type === 'mean' 
                      ? result.mean.toFixed(4)
                      : `${(result.proportion * 100).toFixed(2)}%`
                    }
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">
                    {result.type === 'mean' 
                      ? (result.useT ? 't-value' : 'z-value')
                      : 'z-value'
                    }
                  </div>
                  <div className="text-xl font-bold text-blue-600">
                    {result.type === 'mean' ? result.criticalValue.toFixed(4) : result.zScore.toFixed(4)}
                  </div>
                </div>
              </div>
              
              {result.type === 'proportion' && !result.normalApproximationValid && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                  <strong>Warning:</strong> The normal approximation may not be valid for this sample. 
                  For accurate results, both np ≥ 5 and n(1-p) ≥ 5 should be satisfied.
                </div>
              )}
            </div>

            {/* Interpretation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Interpretation</h3>
              <p className="text-gray-700 mb-4">
                We are {result.confidence}% confident that the true population {result.type === 'mean' ? 'mean' : 'proportion'} 
                falls between {result.type === 'mean' 
                  ? `${result.lowerBound.toFixed(4)} and ${result.upperBound.toFixed(4)}`
                  : `${(result.lowerBound * 100).toFixed(2)}% and ${(result.upperBound * 100).toFixed(2)}%`
                }.
              </p>
              <p className="text-gray-700">
                This means that if we were to take many random samples of the same size from the same population, 
                about {result.confidence}% of the resulting confidence intervals would contain the true population 
                {result.type === 'mean' ? ' mean' : ' proportion'}.
              </p>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Calculation</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index}>
                    {step.startsWith('-') ? (
                      <div className="ml-6 text-gray-700 font-mono text-sm">{step}</div>
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <div className="text-gray-700 font-mono text-sm">{step}</div>
                      </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Confidence Intervals</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">What is a Confidence Interval?</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• A range of values that is likely to contain the true population parameter</li>
                <li>• Expresses the uncertainty associated with a sample statistic</li>
                <li>• Wider intervals indicate less precision</li>
                <li>• Higher confidence levels result in wider intervals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Confidence Level</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Represents the probability that the interval contains the true parameter</li>
                <li>• Common levels: 90%, 95%, 99%</li>
                <li>• 95% means that if you took 100 different samples, about 95 of the resulting intervals would contain the true value</li>
                <li>• Higher confidence requires wider intervals</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">For Means</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Uses t-distribution for small samples (n &lt; 30)</li>
                <li>• Uses z-distribution for large samples (n ≥ 30)</li>
                <li>• Formula: x̄ ± (critical value × s/√n)</li>
                <li>• Assumes data is approximately normally distributed</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">For Proportions</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Uses normal approximation to binomial distribution</li>
                <li>• Formula: p̂ ± z × √[p̂(1-p̂)/n]</li>
                <li>• Valid when np ≥ 5 and n(1-p) ≥ 5</li>
                <li>• p̂ is the sample proportion (successes/trials)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceIntervalCalculator;