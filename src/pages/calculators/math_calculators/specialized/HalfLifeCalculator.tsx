import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Clock } from 'lucide-react';

const HalfLifeCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'remaining' | 'elapsed' | 'halflife'>('remaining');
  
  // Common inputs
  const [initialAmount, setInitialAmount] = useState('');
  const [halfLife, setHalfLife] = useState('');
  const [timeUnit, setTimeUnit] = useState<'seconds' | 'minutes' | 'hours' | 'days' | 'years'>('years');
  
  // Type-specific inputs
  const [finalAmount, setFinalAmount] = useState('');
  const [elapsedTime, setElapsedTime] = useState('');
  
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateHalfLife();
  }, [calculationType, initialAmount, halfLife, finalAmount, elapsedTime, timeUnit]);

  const calculateHalfLife = () => {
    try {
      const initial = parseFloat(initialAmount);
      
      if (!initialAmount || isNaN(initial) || initial <= 0) {
        setResult(null);
        return;
      }

      let steps: string[] = [];
      
      if (calculationType === 'remaining') {
        // Calculate remaining amount after elapsed time
        const halfLifeValue = parseFloat(halfLife);
        const time = parseFloat(elapsedTime);
        
        if (!halfLife || !elapsedTime || isNaN(halfLifeValue) || isNaN(time) || halfLifeValue <= 0 || time < 0) {
          setResult(null);
          return;
        }
        
        // Calculate number of half-lives
        const numHalfLives = time / halfLifeValue;
        
        // Calculate remaining amount
        const remaining = initial * Math.pow(0.5, numHalfLives);
        
        // Calculate decay constant
        const decayConstant = Math.log(2) / halfLifeValue;
        
        // Calculate percentage remaining
        const percentRemaining = (remaining / initial) * 100;
        
        steps = [
          `Step 1: Identify the parameters`,
          `- Initial amount (N₀): ${initial}`,
          `- Half-life (t₁/₂): ${halfLifeValue} ${timeUnit}`,
          `- Elapsed time (t): ${time} ${timeUnit}`,
          
          `Step 2: Calculate the number of half-lives that have passed`,
          `- Number of half-lives = Elapsed time / Half-life`,
          `- Number of half-lives = ${time} / ${halfLifeValue} = ${numHalfLives.toFixed(6)}`,
          
          `Step 3: Calculate the remaining amount using the decay formula`,
          `- N(t) = N₀ × (1/2)^(t/t₁/₂)`,
          `- N(t) = ${initial} × (1/2)^${numHalfLives.toFixed(6)}`,
          `- N(t) = ${initial} × ${Math.pow(0.5, numHalfLives).toFixed(10)}`,
          `- N(t) = ${remaining.toFixed(6)}`,
          
          `Step 4: Calculate the decay constant`,
          `- λ = ln(2) / t₁/₂`,
          `- λ = ${Math.log(2).toFixed(6)} / ${halfLifeValue} = ${decayConstant.toFixed(6)} per ${timeUnit}`,
          
          `Step 5: Calculate the percentage remaining`,
          `- Percentage remaining = (N(t) / N₀) × 100%`,
          `- Percentage remaining = (${remaining.toFixed(6)} / ${initial}) × 100%`,
          `- Percentage remaining = ${percentRemaining.toFixed(6)}%`
        ];
        
        setResult({
          type: 'remaining',
          initial,
          halfLife: halfLifeValue,
          elapsedTime: time,
          remaining,
          decayConstant,
          percentRemaining,
          numHalfLives,
          timeUnit,
          steps
        });
      } else if (calculationType === 'elapsed') {
        // Calculate elapsed time given final amount
        const halfLifeValue = parseFloat(halfLife);
        const final = parseFloat(finalAmount);
        
        if (!halfLife || !finalAmount || isNaN(halfLifeValue) || isNaN(final) || halfLifeValue <= 0 || final <= 0 || final > initial) {
          setResult(null);
          return;
        }
        
        // Calculate number of half-lives
        const numHalfLives = Math.log(initial / final) / Math.log(2);
        
        // Calculate elapsed time
        const elapsed = numHalfLives * halfLifeValue;
        
        // Calculate decay constant
        const decayConstant = Math.log(2) / halfLifeValue;
        
        // Calculate percentage remaining
        const percentRemaining = (final / initial) * 100;
        
        steps = [
          `Step 1: Identify the parameters`,
          `- Initial amount (N₀): ${initial}`,
          `- Final amount (N): ${final}`,
          `- Half-life (t₁/₂): ${halfLifeValue} ${timeUnit}`,
          
          `Step 2: Calculate the number of half-lives using the decay formula`,
          `- N = N₀ × (1/2)^(t/t₁/₂)`,
          `- ${final} = ${initial} × (1/2)^(t/t₁/₂)`,
          `- ${final}/${initial} = (1/2)^(t/t₁/₂)`,
          `- ${(final/initial).toFixed(10)} = (1/2)^(t/t₁/₂)`,
          
          `Step 3: Solve for the number of half-lives`,
          `- Take the logarithm of both sides: log(${(final/initial).toFixed(10)}) = log((1/2)^(t/t₁/₂))`,
          `- Using the logarithm property: log(${(final/initial).toFixed(10)}) = (t/t₁/₂) × log(1/2)`,
          `- log(${(final/initial).toFixed(10)}) = (t/t₁/₂) × (-log(2))`,
          `- t/t₁/₂ = log(${(final/initial).toFixed(10)}) / (-log(2))`,
          `- t/t₁/₂ = ${Math.log(final/initial).toFixed(10)} / ${(-Math.log(0.5)).toFixed(10)}`,
          `- Number of half-lives = ${numHalfLives.toFixed(6)}`,
          
          `Step 4: Calculate the elapsed time`,
          `- Elapsed time = Number of half-lives × Half-life`,
          `- Elapsed time = ${numHalfLives.toFixed(6)} × ${halfLifeValue} = ${elapsed.toFixed(6)} ${timeUnit}`,
          
          `Step 5: Calculate the decay constant`,
          `- λ = ln(2) / t₁/₂`,
          `- λ = ${Math.log(2).toFixed(6)} / ${halfLifeValue} = ${decayConstant.toFixed(6)} per ${timeUnit}`,
          
          `Step 6: Calculate the percentage remaining`,
          `- Percentage remaining = (N / N₀) × 100%`,
          `- Percentage remaining = (${final} / ${initial}) × 100%`,
          `- Percentage remaining = ${percentRemaining.toFixed(6)}%`
        ];
        
        setResult({
          type: 'elapsed',
          initial,
          halfLife: halfLifeValue,
          final,
          elapsed,
          decayConstant,
          percentRemaining,
          numHalfLives,
          timeUnit,
          steps
        });
      } else if (calculationType === 'halflife') {
        // Calculate half-life given elapsed time and final amount
        const final = parseFloat(finalAmount);
        const time = parseFloat(elapsedTime);
        
        if (!finalAmount || !elapsedTime || isNaN(final) || isNaN(time) || final <= 0 || time <= 0 || final > initial) {
          setResult(null);
          return;
        }
        
        // Calculate number of half-lives
        const numHalfLives = Math.log(initial / final) / Math.log(2);
        
        // Calculate half-life
        const halfLifeValue = time / numHalfLives;
        
        // Calculate decay constant
        const decayConstant = Math.log(2) / halfLifeValue;
        
        // Calculate percentage remaining
        const percentRemaining = (final / initial) * 100;
        
        steps = [
          `Step 1: Identify the parameters`,
          `- Initial amount (N₀): ${initial}`,
          `- Final amount (N): ${final}`,
          `- Elapsed time (t): ${time} ${timeUnit}`,
          
          `Step 2: Calculate the number of half-lives using the decay formula`,
          `- N = N₀ × (1/2)^(t/t₁/₂)`,
          `- ${final} = ${initial} × (1/2)^(t/t₁/₂)`,
          `- ${final}/${initial} = (1/2)^(t/t₁/₂)`,
          `- ${(final/initial).toFixed(10)} = (1/2)^(t/t₁/₂)`,
          
          `Step 3: Solve for the number of half-lives`,
          `- Take the logarithm of both sides: log(${(final/initial).toFixed(10)}) = log((1/2)^(t/t₁/₂))`,
          `- Using the logarithm property: log(${(final/initial).toFixed(10)}) = (t/t₁/₂) × log(1/2)`,
          `- log(${(final/initial).toFixed(10)}) = (t/t₁/₂) × (-log(2))`,
          `- t/t₁/₂ = log(${(final/initial).toFixed(10)}) / (-log(2))`,
          `- Number of half-lives = ${numHalfLives.toFixed(6)}`,
          
          `Step 4: Calculate the half-life`,
          `- Half-life = Elapsed time / Number of half-lives`,
          `- Half-life = ${time} / ${numHalfLives.toFixed(6)} = ${halfLifeValue.toFixed(6)} ${timeUnit}`,
          
          `Step 5: Calculate the decay constant`,
          `- λ = ln(2) / t₁/₂`,
          `- λ = ${Math.log(2).toFixed(6)} / ${halfLifeValue.toFixed(6)} = ${decayConstant.toFixed(6)} per ${timeUnit}`,
          
          `Step 6: Calculate the percentage remaining`,
          `- Percentage remaining = (N / N₀) × 100%`,
          `- Percentage remaining = (${final} / ${initial}) × 100%`,
          `- Percentage remaining = ${percentRemaining.toFixed(6)}%`
        ];
        
        setResult({
          type: 'halflife',
          initial,
          final,
          elapsedTime: time,
          halfLife: halfLifeValue,
          decayConstant,
          percentRemaining,
          numHalfLives,
          timeUnit,
          steps
        });
      }
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

  const commonHalfLives = [
    { element: 'Carbon-14', halfLife: 5730, unit: 'years', description: 'Used in radiocarbon dating' },
    { element: 'Uranium-238', halfLife: 4.5, unit: 'billion years', description: 'Common uranium isotope' },
    { element: 'Iodine-131', halfLife: 8.02, unit: 'days', description: 'Used in medical treatments' },
    { element: 'Plutonium-239', halfLife: 24100, unit: 'years', description: 'Used in nuclear weapons' },
    { element: 'Technetium-99m', halfLife: 6.01, unit: 'hours', description: 'Used in medical imaging' },
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
        <span className="text-gray-900 font-medium">Half-Life Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <Clock className="w-8 h-8 text-amber-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Half-Life Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            What do you want to calculate?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCalculationType('remaining')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'remaining'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Remaining Amount</div>
              <div className="text-sm opacity-75">After a given time</div>
            </button>
            <button
              onClick={() => setCalculationType('elapsed')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'elapsed'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Elapsed Time</div>
              <div className="text-sm opacity-75">To reach a given amount</div>
            </button>
            <button
              onClick={() => setCalculationType('halflife')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'halflife'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Half-Life</div>
              <div className="text-sm opacity-75">From initial and final amounts</div>
            </button>
          </div>
        </div>

        {/* Common Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Initial Amount
            </label>
            <input
              type="number"
              value={initialAmount}
              onChange={(e) => setInitialAmount(e.target.value)}
              placeholder="e.g., 100"
              min="0.000001"
              step="any"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
            />
            <div className="mt-1 text-sm text-gray-600">
              The starting quantity of the substance
            </div>
          </div>
          
          {calculationType !== 'halflife' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Half-Life
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={halfLife}
                  onChange={(e) => setHalfLife(e.target.value)}
                  placeholder="e.g., 5730"
                  min="0.000001"
                  step="any"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                >
                  <option value="seconds">seconds</option>
                  <option value="minutes">minutes</option>
                  <option value="hours">hours</option>
                  <option value="days">days</option>
                  <option value="years">years</option>
                </select>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Time required for half of the substance to decay
              </div>
            </div>
          )}
        </div>

        {/* Type-Specific Inputs */}
        <div className="mb-8">
          {calculationType === 'remaining' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Elapsed Time
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  value={elapsedTime}
                  onChange={(e) => setElapsedTime(e.target.value)}
                  placeholder="e.g., 10000"
                  min="0"
                  step="any"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                  disabled
                >
                  <option value={timeUnit}>{timeUnit}</option>
                </select>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Time that has passed since the initial amount
              </div>
            </div>
          )}

          {calculationType === 'elapsed' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Final Amount
              </label>
              <input
                type="number"
                value={finalAmount}
                onChange={(e) => setFinalAmount(e.target.value)}
                placeholder="e.g., 25"
                min="0.000001"
                max={initialAmount || undefined}
                step="any"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
              />
              <div className="mt-1 text-sm text-gray-600">
                The remaining quantity of the substance (must be less than initial amount)
              </div>
            </div>
          )}

          {calculationType === 'halflife' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Final Amount
                </label>
                <input
                  type="number"
                  value={finalAmount}
                  onChange={(e) => setFinalAmount(e.target.value)}
                  placeholder="e.g., 25"
                  min="0.000001"
                  max={initialAmount || undefined}
                  step="any"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                />
                <div className="mt-1 text-sm text-gray-600">
                  The remaining quantity of the substance
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Elapsed Time
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={elapsedTime}
                    onChange={(e) => setElapsedTime(e.target.value)}
                    placeholder="e.g., 10000"
                    min="0.000001"
                    step="any"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                  />
                  <select
                    value={timeUnit}
                    onChange={(e) => setTimeUnit(e.target.value as any)}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-lg"
                  >
                    <option value="seconds">seconds</option>
                    <option value="minutes">minutes</option>
                    <option value="hours">hours</option>
                    <option value="days">days</option>
                    <option value="years">years</option>
                  </select>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  Time that has passed since the initial amount
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Common Half-Lives */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Radioactive Isotopes</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Isotope</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Half-Life</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {commonHalfLives.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 whitespace-nowrap">{item.element}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.halfLife} {item.unit}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{item.description}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <button
                        onClick={() => {
                          if (item.unit === 'years' || item.unit === 'days' || item.unit === 'hours') {
                            setHalfLife(item.halfLife.toString());
                            setTimeUnit(item.unit === 'billion years' ? 'years' : item.unit as any);
                          }
                        }}
                        className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded hover:bg-amber-200 transition-colors"
                        disabled={calculationType === 'halflife'}
                      >
                        Use
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">Results</h3>
              
              {result.type === 'remaining' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Remaining Amount</div>
                    <div className="text-3xl font-bold text-amber-600">{result.remaining.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">{result.percentRemaining.toFixed(2)}% of initial</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Number of Half-Lives</div>
                    <div className="text-3xl font-bold text-orange-600">{result.numHalfLives.toFixed(4)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Decay Constant (λ)</div>
                    <div className="text-3xl font-bold text-red-600">{result.decayConstant.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">per {result.timeUnit}</div>
                  </div>
                </div>
              )}
              
              {result.type === 'elapsed' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Elapsed Time</div>
                    <div className="text-3xl font-bold text-amber-600">{result.elapsed.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">{result.timeUnit}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Number of Half-Lives</div>
                    <div className="text-3xl font-bold text-orange-600">{result.numHalfLives.toFixed(4)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Percentage Remaining</div>
                    <div className="text-3xl font-bold text-red-600">{result.percentRemaining.toFixed(2)}%</div>
                  </div>
                </div>
              )}
              
              {result.type === 'halflife' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Half-Life</div>
                    <div className="text-3xl font-bold text-amber-600">{result.halfLife.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">{result.timeUnit}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Decay Constant (λ)</div>
                    <div className="text-3xl font-bold text-orange-600">{result.decayConstant.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">per {result.timeUnit}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Number of Half-Lives</div>
                    <div className="text-3xl font-bold text-red-600">{result.numHalfLives.toFixed(4)}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Decay Equation */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Decay Equation</h3>
              <div className="text-center">
                <div className="text-lg font-mono text-gray-800 mb-2">
                  N(t) = N₀ × e<sup>-λt</sup> = N₀ × 2<sup>-t/t₁/₂</sup>
                </div>
                <div className="text-sm text-gray-600">
                  Where N(t) is the amount at time t, N₀ is the initial amount, λ is the decay constant, and t₁/₂ is the half-life
                </div>
              </div>
            </div>

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index}>
                    {step.startsWith('-') ? (
                      <div className="ml-6 text-gray-700 font-mono text-sm">{step}</div>
                    ) : (
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About Half-Life</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Definition</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• The time required for half of a substance to decay</li>
                <li>• A measure of the rate of exponential decay</li>
                <li>• Constant for a given isotope or substance</li>
                <li>• Independent of the initial amount</li>
                <li>• Related to decay constant by t₁/₂ = ln(2)/λ</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Applications</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Radiocarbon dating in archaeology</li>
                <li>• Nuclear medicine and radiation therapy</li>
                <li>• Nuclear power and waste management</li>
                <li>• Geological dating of rocks and minerals</li>
                <li>• Drug metabolism in pharmacology</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Formulas</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• N(t) = N₀ × 2<sup>-t/t₁/₂</sup></li>
                <li>• N(t) = N₀ × e<sup>-λt</sup></li>
                <li>• λ = ln(2) / t₁/₂</li>
                <li>• t = t₁/₂ × log₂(N₀/N)</li>
                <li>• t₁/₂ = t × ln(2) / ln(N₀/N)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Key Concepts</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• After 1 half-life: 50% remains</li>
                <li>• After 2 half-lives: 25% remains</li>
                <li>• After 3 half-lives: 12.5% remains</li>
                <li>• After 10 half-lives: ~0.1% remains</li>
                <li>• Decay is exponential, not linear</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HalfLifeCalculator;