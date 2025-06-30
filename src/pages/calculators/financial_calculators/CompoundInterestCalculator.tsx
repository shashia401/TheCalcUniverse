import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const CompoundInterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('1000');
  const [interestRate, setInterestRate] = useState('5');
  const [compoundingFrequency, setCompoundingFrequency] = useState<'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily'>('annually');
  const [timeYears, setTimeYears] = useState('10');
  const [additionalContribution, setAdditionalContribution] = useState('100');
  const [contributionFrequency, setContributionFrequency] = useState<'monthly' | 'quarterly' | 'annually'>('monthly');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateCompoundInterest();
  }, [principal, interestRate, compoundingFrequency, timeYears, additionalContribution, contributionFrequency]);

  const calculateCompoundInterest = () => {
    const initialPrincipal = parseFloat(principal);
    const rate = parseFloat(interestRate) / 100;
    const time = parseFloat(timeYears);
    const contribution = parseFloat(additionalContribution);

    if (isNaN(initialPrincipal) || isNaN(rate) || isNaN(time) || isNaN(contribution) || 
        initialPrincipal < 0 || rate < 0 || time <= 0 || contribution < 0) {
      setResults(null);
      return;
    }

    // Determine compounding periods per year
    let periodsPerYear: number;
    switch (compoundingFrequency) {
      case 'annually': periodsPerYear = 1; break;
      case 'semiannually': periodsPerYear = 2; break;
      case 'quarterly': periodsPerYear = 4; break;
      case 'monthly': periodsPerYear = 12; break;
      case 'daily': periodsPerYear = 365; break;
      default: periodsPerYear = 1;
    }

    // Determine contribution periods per year
    let contributionsPerYear: number;
    switch (contributionFrequency) {
      case 'annually': contributionsPerYear = 1; break;
      case 'quarterly': contributionsPerYear = 4; break;
      case 'monthly': contributionsPerYear = 12; break;
      default: contributionsPerYear = 12;
    }

    const totalPeriods = time * periodsPerYear;
    const ratePerPeriod = rate / periodsPerYear;
    
    // Calculate contribution per period
    const contributionPerPeriod = contribution * (contributionsPerYear / periodsPerYear);

    // Calculate future value with compound interest and regular contributions
    let futureValue = initialPrincipal;
    let totalContributions = initialPrincipal;
    let totalInterest = 0;

    // Generate yearly breakdown
    const yearlyBreakdown = [];
    
    for (let year = 1; year <= time; year++) {
      let yearEndBalance = 0;
      let yearStartBalance = 0;
      let yearContributions = 0;
      let yearInterest = 0;
      
      // Calculate for each period within the year
      for (let period = 1; period <= periodsPerYear; period++) {
        const periodNumber = (year - 1) * periodsPerYear + period;
        
        if (periodNumber === 1) {
          yearStartBalance = initialPrincipal;
        }
        
        // Calculate interest for this period
        const interestEarned = futureValue * ratePerPeriod;
        
        // Add contribution and interest
        futureValue += interestEarned + contributionPerPeriod;
        
        // Track contributions and interest for this year
        yearContributions += contributionPerPeriod;
        yearInterest += interestEarned;
        
        if (period === periodsPerYear) {
          yearEndBalance = futureValue;
        }
      }
      
      totalContributions += yearContributions;
      totalInterest += yearInterest;
      
      yearlyBreakdown.push({
        year,
        startBalance: yearStartBalance,
        contributions: yearContributions,
        interest: yearInterest,
        endBalance: yearEndBalance
      });
    }

    // Calculate effective annual rate
    const effectiveAnnualRate = Math.pow(1 + rate / periodsPerYear, periodsPerYear) - 1;

    // Calculate doubling time using the Rule of 72 (approximation)
    const doublingTime = 72 / (rate * 100);

    setResults({
      futureValue,
      totalContributions,
      totalInterest,
      effectiveAnnualRate,
      doublingTime,
      yearlyBreakdown
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCurrencyDetailed = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
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
        <Link to="/financial" className="hover:text-blue-600 transition-colors">Financial Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Compound Interest Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Compound Interest Calculator</h1>
            </div>

            <div className="space-y-6">
              {/* Principal Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Principal</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={principal}
                    onChange={(e) => setPrincipal(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.01"
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Compounding Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="annually">Annually</option>
                  <option value="semiannually">Semi-annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              {/* Time Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (Years)</label>
                <input
                  type="number"
                  value={timeYears}
                  onChange={(e) => setTimeYears(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Additional Contribution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Regular Contribution</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={additionalContribution}
                    onChange={(e) => setAdditionalContribution(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Contribution Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contribution Frequency</label>
                <select
                  value={contributionFrequency}
                  onChange={(e) => setContributionFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-8">
          {results && (
            <>
              {/* Future Value Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Future Value Summary</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {formatCurrency(results.futureValue)}
                      </div>
                      <div className="text-gray-600">Future Value</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Initial Principal</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(parseFloat(principal))}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Total Contributions</span>
                        <span className="font-semibold text-green-600">{formatCurrency(results.totalContributions)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Total Interest Earned</span>
                        <span className="font-semibold text-purple-600">{formatCurrency(results.totalInterest)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Interest Breakdown</h3>
                      
                      <div className="relative w-full h-48 mb-4">
                        <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke="#3B82F6"
                            strokeWidth="10"
                            className="transition-all duration-500"
                            strokeDasharray={`${(parseFloat(principal) / results.futureValue) * 100} 100`}
                            strokeDashoffset="0"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke="#10B981"
                            strokeWidth="10"
                            className="transition-all duration-500"
                            strokeDasharray={`${((results.totalContributions - parseFloat(principal)) / results.futureValue) * 100} 100`}
                            strokeDashoffset={`${-(parseFloat(principal) / results.futureValue) * 100}`}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke="#8B5CF6"
                            strokeWidth="10"
                            className="transition-all duration-500"
                            strokeDasharray={`${(results.totalInterest / results.futureValue) * 100} 100`}
                            strokeDashoffset={`${-((results.totalContributions) / results.futureValue) * 100}`}
                          />
                        </svg>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span>Initial Principal</span>
                          </div>
                          <span className="font-medium">{((parseFloat(principal) / results.futureValue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                            <span>Additional Contributions</span>
                          </div>
                          <span className="font-medium">{(((results.totalContributions - parseFloat(principal)) / results.futureValue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                            <span>Interest Earned</span>
                          </div>
                          <span className="font-medium">{((results.totalInterest / results.futureValue) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yearly Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Yearly Breakdown</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-semibold">Year</th>
                        <th className="text-left p-3 font-semibold">Starting Balance</th>
                        <th className="text-left p-3 font-semibold">Contributions</th>
                        <th className="text-left p-3 font-semibold">Interest Earned</th>
                        <th className="text-left p-3 font-semibold">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.yearlyBreakdown.map((year: any, index: number) => (
                        <tr key={year.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-3">{year.year}</td>
                          <td className="p-3 font-mono">{formatCurrency(year.startBalance)}</td>
                          <td className="p-3 font-mono text-green-600">{formatCurrency(year.contributions)}</td>
                          <td className="p-3 font-mono text-purple-600">{formatCurrency(year.interest)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrency(year.endBalance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Additional Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Interest Analysis</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Compound Interest Details</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effective Annual Rate:</span>
                        <span className="font-semibold">{(results.effectiveAnnualRate * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doubling Time (Rule of 72):</span>
                        <span className="font-semibold">{results.doublingTime.toFixed(1)} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest Earned:</span>
                        <span className="font-semibold">{formatCurrency(results.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest to Principal Ratio:</span>
                        <span className="font-semibold">{(results.totalInterest / parseFloat(principal)).toFixed(2)}x</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Compound Interest Power</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Initial Investment:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(principal))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Contributions:</span>
                        <span className="font-semibold">{formatCurrency(results.totalContributions)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Money Growth Factor:</span>
                        <span className="font-semibold">{(results.futureValue / results.totalContributions).toFixed(2)}x</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Interest % of Final Amount:</span>
                        <span className="font-semibold">{((results.totalInterest / results.futureValue) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips and Information */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Compound Interest Tips</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-900 mb-4">Maximizing Compound Interest</h3>
                    <ul className="space-y-3 text-purple-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Start investing as early as possible to maximize time in the market</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Increase your contribution amount whenever possible</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Choose more frequent compounding when available</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Reinvest dividends and interest payments</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4">Key Concepts</h3>
                    <ul className="space-y-3 text-indigo-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Rule of 72: Divide 72 by your interest rate to estimate doubling time</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Time value of money: A dollar today is worth more than a dollar tomorrow</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Effective annual rate accounts for compounding frequency</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>The power of compound interest grows exponentially over time</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompoundInterestCalculator;