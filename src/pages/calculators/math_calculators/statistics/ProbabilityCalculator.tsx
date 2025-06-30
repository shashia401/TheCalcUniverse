import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, PieChart, Percent } from 'lucide-react';

const ProbabilityCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'basic' | 'conditional' | 'bayes'>('basic');
  
  // Basic probability
  const [favorableOutcomes, setFavorableOutcomes] = useState('');
  const [totalOutcomes, setTotalOutcomes] = useState('');
  
  // Conditional probability
  const [eventA, setEventA] = useState('');
  const [eventB, setEventB] = useState('');
  const [eventAandB, setEventAandB] = useState('');
  const [totalConditional, setTotalConditional] = useState('');
  
  // Bayes' theorem
  const [priorA, setPriorA] = useState('');
  const [likelihoodBA, setLikelihoodBA] = useState('');
  const [likelihoodBnotA, setLikelihoodBnotA] = useState('');
  
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateProbability();
  }, [
    calculationType, 
    favorableOutcomes, 
    totalOutcomes, 
    eventA, 
    eventB, 
    eventAandB, 
    totalConditional,
    priorA,
    likelihoodBA,
    likelihoodBnotA
  ]);

  const calculateProbability = () => {
    try {
      if (calculationType === 'basic') {
        const favorable = parseFloat(favorableOutcomes);
        const total = parseFloat(totalOutcomes);
        
        if (!favorableOutcomes || !totalOutcomes || isNaN(favorable) || isNaN(total) || total === 0) {
          setResult(null);
          return;
        }

        if (favorable > total) {
          setResult({ error: "Favorable outcomes cannot exceed total outcomes" });
          return;
        }

        const probability = favorable / total;
        const odds = favorable / (total - favorable);
        const percentage = probability * 100;
        
        setResult({
          type: 'basic',
          probability,
          odds,
          percentage,
          complement: 1 - probability,
          steps: [
            `Probability = Number of favorable outcomes / Total number of possible outcomes`,
            `Probability = ${favorable} / ${total} = ${probability.toFixed(6)}`,
            `Percentage = ${probability.toFixed(6)} × 100% = ${percentage.toFixed(2)}%`,
            `Odds = ${favorable} : ${total - favorable} = ${odds.toFixed(6)} : 1`,
            `Probability of complement (not happening) = 1 - ${probability.toFixed(6)} = ${(1 - probability).toFixed(6)}`
          ]
        });
      } else if (calculationType === 'conditional') {
        const a = parseFloat(eventA);
        const b = parseFloat(eventB);
        const aAndB = parseFloat(eventAandB);
        const total = parseFloat(totalConditional);
        
        if (!eventA || !eventB || !eventAandB || !totalConditional || 
            isNaN(a) || isNaN(b) || isNaN(aAndB) || isNaN(total) || total === 0) {
          setResult(null);
          return;
        }

        if (a > total || b > total || aAndB > total || aAndB > a || aAndB > b) {
          setResult({ error: "Invalid values. Please check your inputs." });
          return;
        }

        const probA = a / total;
        const probB = b / total;
        const probAandB = aAndB / total;
        const probAgivenB = aAndB / b;
        const probBgivenA = aAndB / a;
        const areIndependent = Math.abs(probAandB - (probA * probB)) < 0.0000001;
        
        setResult({
          type: 'conditional',
          probA,
          probB,
          probAandB,
          probAgivenB,
          probBgivenA,
          areIndependent,
          steps: [
            `P(A) = ${a} / ${total} = ${probA.toFixed(6)}`,
            `P(B) = ${b} / ${total} = ${probB.toFixed(6)}`,
            `P(A ∩ B) = ${aAndB} / ${total} = ${probAandB.toFixed(6)}`,
            `P(A|B) = P(A ∩ B) / P(B) = ${aAndB} / ${b} = ${probAgivenB.toFixed(6)}`,
            `P(B|A) = P(A ∩ B) / P(A) = ${aAndB} / ${a} = ${probBgivenA.toFixed(6)}`,
            `For independent events: P(A ∩ B) = P(A) × P(B)`,
            `P(A) × P(B) = ${probA.toFixed(6)} × ${probB.toFixed(6)} = ${(probA * probB).toFixed(6)}`,
            `Events A and B are ${areIndependent ? 'independent' : 'dependent'}`
          ]
        });
      } else if (calculationType === 'bayes') {
        const pA = parseFloat(priorA) / 100; // Convert from percentage
        const pBA = parseFloat(likelihoodBA) / 100;
        const pBnotA = parseFloat(likelihoodBnotA) / 100;
        
        if (!priorA || !likelihoodBA || !likelihoodBnotA || 
            isNaN(pA) || isNaN(pBA) || isNaN(pBnotA) || 
            pA < 0 || pA > 1 || pBA < 0 || pBA > 1 || pBnotA < 0 || pBnotA > 1) {
          setResult(null);
          return;
        }

        const pNotA = 1 - pA;
        const pB = pBA * pA + pBnotA * pNotA;
        const pAgivenB = (pBA * pA) / pB;
        
        setResult({
          type: 'bayes',
          pA,
          pBA,
          pBnotA,
          pB,
          pAgivenB,
          steps: [
            `Prior probability: P(A) = ${pA.toFixed(6)}`,
            `Likelihood: P(B|A) = ${pBA.toFixed(6)}`,
            `Likelihood: P(B|not A) = ${pBnotA.toFixed(6)}`,
            `P(not A) = 1 - P(A) = 1 - ${pA.toFixed(6)} = ${pNotA.toFixed(6)}`,
            `P(B) = P(B|A) × P(A) + P(B|not A) × P(not A)`,
            `P(B) = ${pBA.toFixed(6)} × ${pA.toFixed(6)} + ${pBnotA.toFixed(6)} × ${pNotA.toFixed(6)} = ${pB.toFixed(6)}`,
            `P(A|B) = [P(B|A) × P(A)] / P(B)`,
            `P(A|B) = [${pBA.toFixed(6)} × ${pA.toFixed(6)}] / ${pB.toFixed(6)} = ${pAgivenB.toFixed(6)}`,
            `Posterior probability: P(A|B) = ${(pAgivenB * 100).toFixed(2)}%`
          ]
        });
      }
    } catch (error) {
      setResult({ error: "Error in calculation. Please check your inputs." });
    }
  };

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
        <span className="text-gray-900 font-medium">Probability Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <PieChart className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Probability Calculator</h1>
        </div>

        {/* Calculation Type Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Probability Type
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => setCalculationType('basic')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'basic'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Basic Probability</div>
              <div className="text-sm opacity-75">P(A) = favorable / total</div>
            </button>
            <button
              onClick={() => setCalculationType('conditional')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'conditional'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Conditional Probability</div>
              <div className="text-sm opacity-75">P(A|B) = P(A∩B) / P(B)</div>
            </button>
            <button
              onClick={() => setCalculationType('bayes')}
              className={`p-4 rounded-lg border-2 transition-all ${
                calculationType === 'bayes'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              <div className="font-medium">Bayes' Theorem</div>
              <div className="text-sm opacity-75">P(A|B) = P(B|A)P(A) / P(B)</div>
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-6 mb-8">
          {calculationType === 'basic' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Favorable Outcomes
                </label>
                <input
                  type="number"
                  value={favorableOutcomes}
                  onChange={(e) => setFavorableOutcomes(e.target.value)}
                  placeholder="e.g., 1 (for rolling a 6 on a die)"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Number of Possible Outcomes
                </label>
                <input
                  type="number"
                  value={totalOutcomes}
                  onChange={(e) => setTotalOutcomes(e.target.value)}
                  placeholder="e.g., 6 (for a standard die)"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          )}

          {calculationType === 'conditional' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Outcomes in Event A
                </label>
                <input
                  type="number"
                  value={eventA}
                  onChange={(e) => setEventA(e.target.value)}
                  placeholder="e.g., number of red cards"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Outcomes in Event B
                </label>
                <input
                  type="number"
                  value={eventB}
                  onChange={(e) => setEventB(e.target.value)}
                  placeholder="e.g., number of face cards"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Outcomes in Both A and B
                </label>
                <input
                  type="number"
                  value={eventAandB}
                  onChange={(e) => setEventAandB(e.target.value)}
                  placeholder="e.g., number of red face cards"
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total Number of Possible Outcomes
                </label>
                <input
                  type="number"
                  value={totalConditional}
                  onChange={(e) => setTotalConditional(e.target.value)}
                  placeholder="e.g., 52 (for a deck of cards)"
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          )}

          {calculationType === 'bayes' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Prior Probability of A (%)
                </label>
                <input
                  type="number"
                  value={priorA}
                  onChange={(e) => setPriorA(e.target.value)}
                  placeholder="e.g., 10 (for 10%)"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Likelihood P(B|A) (%)
                </label>
                <input
                  type="number"
                  value={likelihoodBA}
                  onChange={(e) => setLikelihoodBA(e.target.value)}
                  placeholder="e.g., 90 (for 90%)"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Likelihood P(B|not A) (%)
                </label>
                <input
                  type="number"
                  value={likelihoodBnotA}
                  onChange={(e) => setLikelihoodBnotA(e.target.value)}
                  placeholder="e.g., 20 (for 20%)"
                  min="0"
                  max="100"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {result && !result.error && (
          <div className="space-y-6">
            {/* Basic Probability Results */}
            {result.type === 'basic' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Probability Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Probability</div>
                    <div className="text-3xl font-bold text-blue-600">{result.probability.toFixed(6)}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Percentage</div>
                    <div className="text-3xl font-bold text-indigo-600">{result.percentage.toFixed(2)}%</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Odds</div>
                    <div className="text-3xl font-bold text-purple-600">{result.odds.toFixed(4)}:1</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Complement</div>
                    <div className="text-3xl font-bold text-red-600">{result.complement.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Conditional Probability Results */}
            {result.type === 'conditional' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Conditional Probability Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">P(A|B)</div>
                    <div className="text-3xl font-bold text-blue-600">{result.probAgivenB.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">Probability of A given B</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">P(B|A)</div>
                    <div className="text-3xl font-bold text-indigo-600">{result.probBgivenA.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">Probability of B given A</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">P(A∩B)</div>
                    <div className="text-3xl font-bold text-purple-600">{result.probAandB.toFixed(6)}</div>
                    <div className="text-sm text-gray-600 mt-1">Probability of A and B</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4 text-center">
                  <div className="text-sm text-gray-600 mb-1">Independence</div>
                  <div className="text-xl font-bold text-gray-900">
                    Events A and B are {result.areIndependent ? 'independent' : 'dependent'}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {result.areIndependent 
                      ? 'P(A∩B) = P(A) × P(B)' 
                      : 'P(A∩B) ≠ P(A) × P(B)'}
                  </div>
                </div>
              </div>
            )}

            {/* Bayes' Theorem Results */}
            {result.type === 'bayes' && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-6 text-center">Bayes' Theorem Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Prior Probability P(A)</div>
                    <div className="text-3xl font-bold text-blue-600">{(result.pA * 100).toFixed(2)}%</div>
                    <div className="text-sm text-gray-600 mt-1">Initial belief before evidence</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 text-center">
                    <div className="text-sm text-gray-600 mb-1">Posterior Probability P(A|B)</div>
                    <div className="text-3xl font-bold text-indigo-600">{(result.pAgivenB * 100).toFixed(2)}%</div>
                    <div className="text-sm text-gray-600 mt-1">Updated belief after evidence</div>
                  </div>
                </div>
                
                <div className="mt-6 bg-white rounded-lg p-4">
                  <div className="text-center mb-2">
                    <div className="text-sm text-gray-600">Likelihood Ratio</div>
                    <div className="text-xl font-bold text-gray-900">
                      {(result.pBA / result.pBnotA).toFixed(2)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    {result.pAgivenB > result.pA 
                      ? 'Evidence increases probability of A' 
                      : result.pAgivenB < result.pA 
                        ? 'Evidence decreases probability of A'
                        : 'Evidence does not affect probability of A'}
                  </div>
                </div>
              </div>
            )}

            {/* Steps */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Solution</h3>
              <div className="space-y-2">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Probability Concepts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold">Basic Probability</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• P(A) = Number of favorable outcomes / Total number of possible outcomes</li>
                <li>• 0 ≤ P(A) ≤ 1</li>
                <li>• P(not A) = 1 - P(A)</li>
                <li>• For mutually exclusive events: P(A or B) = P(A) + P(B)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Conditional Probability</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• P(A|B) = P(A and B) / P(B)</li>
                <li>• For independent events: P(A|B) = P(A)</li>
                <li>• For independent events: P(A and B) = P(A) × P(B)</li>
                <li>• For dependent events: P(A and B) = P(A) × P(B|A)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Bayes' Theorem</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• P(A|B) = [P(B|A) × P(A)] / P(B)</li>
                <li>• P(B) = P(B|A) × P(A) + P(B|not A) × P(not A)</li>
                <li>• Updates prior beliefs based on new evidence</li>
                <li>• Used in medical diagnosis, spam filtering, etc.</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold">Common Examples</h4>
              <ul className="text-gray-600 space-y-1 mt-2">
                <li>• Coin flip: P(heads) = 0.5</li>
                <li>• Die roll: P(rolling a 6) = 1/6</li>
                <li>• Cards: P(drawing an ace) = 4/52 = 1/13</li>
                <li>• Cards: P(drawing a heart) = 13/52 = 1/4</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProbabilityCalculator;