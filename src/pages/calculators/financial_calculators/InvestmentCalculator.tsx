import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const InvestmentCalculator: React.FC = () => {
  const [initialInvestment, setInitialInvestment] = useState('10000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('8');
  const [investmentPeriod, setInvestmentPeriod] = useState('20');
  const [compoundingFrequency, setCompoundingFrequency] = useState<'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily'>('annually');
  const [inflationRate, setInflationRate] = useState('2.5');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateInvestment();
  }, [initialInvestment, monthlyContribution, annualReturn, investmentPeriod, compoundingFrequency, inflationRate]);

  const calculateInvestment = () => {
    const principal = parseFloat(initialInvestment);
    const monthlyDeposit = parseFloat(monthlyContribution);
    const annualInterestRate = parseFloat(annualReturn) / 100;
    const years = parseFloat(investmentPeriod);
    const inflation = parseFloat(inflationRate) / 100;

    if (isNaN(principal) || isNaN(monthlyDeposit) || isNaN(annualInterestRate) || isNaN(years) || isNaN(inflation) || 
        principal < 0 || monthlyDeposit < 0 || years <= 0) {
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

    const totalPeriods = years * periodsPerYear;
    const interestRatePerPeriod = annualInterestRate / periodsPerYear;
    const contributionsPerPeriod = monthlyDeposit * 12 / periodsPerYear;

    // Calculate future value
    let futureValue = principal;
    let totalContributions = principal;
    let totalInterestEarned = 0;

    // Generate yearly breakdown
    const yearlyBreakdown = [];
    
    for (let year = 1; year <= years; year++) {
      let yearEndBalance = 0;
      let yearStartBalance = 0;
      let yearContributions = 0;
      let yearInterest = 0;
      
      // Calculate for each period within the year
      for (let period = 1; period <= periodsPerYear; period++) {
        const periodNumber = (year - 1) * periodsPerYear + period;
        
        if (periodNumber === 1) {
          yearStartBalance = principal;
        }
        
        // Calculate interest for this period
        const interestEarned = futureValue * interestRatePerPeriod;
        
        // Add contribution and interest
        futureValue += interestEarned + contributionsPerPeriod;
        
        // Track contributions and interest for this year
        yearContributions += contributionsPerPeriod;
        yearInterest += interestEarned;
        
        if (period === periodsPerYear) {
          yearEndBalance = futureValue;
        }
      }
      
      totalContributions += yearContributions;
      totalInterestEarned += yearInterest;
      
      yearlyBreakdown.push({
        year,
        startBalance: yearStartBalance,
        contributions: yearContributions,
        interest: yearInterest,
        endBalance: yearEndBalance
      });
    }

    // Calculate inflation-adjusted value
    const inflationFactor = Math.pow(1 + inflation, years);
    const inflationAdjustedValue = futureValue / inflationFactor;

    setResults({
      futureValue,
      totalContributions,
      totalInterestEarned,
      inflationAdjustedValue,
      yearlyBreakdown,
      compoundingFrequency,
      effectiveAnnualRate: Math.pow(1 + annualInterestRate / periodsPerYear, periodsPerYear) - 1
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
        <span className="text-gray-900 font-medium">Investment Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center mb-6">
              <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Investment Calculator</h1>
            </div>

            <div className="space-y-6">
              {/* Initial Investment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Initial Investment</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={initialInvestment}
                    onChange={(e) => setInitialInvestment(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Monthly Contribution */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Contribution</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Annual Return */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Return (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualReturn}
                    onChange={(e) => setAnnualReturn(e.target.value)}
                    step="0.1"
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Investment Period */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Period (Years)</label>
                <input
                  type="number"
                  value={investmentPeriod}
                  onChange={(e) => setInvestmentPeriod(e.target.value)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Compounding Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
                <select
                  value={compoundingFrequency}
                  onChange={(e) => setCompoundingFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="annually">Annually</option>
                  <option value="semiannually">Semi-annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              {/* Inflation Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Inflation Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(e.target.value)}
                    step="0.1"
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-8">
          {results && (
            <>
              {/* Investment Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Investment Summary</h2>
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
                        <span className="text-gray-700">Initial Investment</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(parseFloat(initialInvestment))}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Total Contributions</span>
                        <span className="font-semibold text-green-600">{formatCurrency(results.totalContributions)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Total Interest Earned</span>
                        <span className="font-semibold text-purple-600">{formatCurrency(results.totalInterestEarned)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-gray-700">Inflation-Adjusted Value</span>
                        <span className="font-semibold text-yellow-600">{formatCurrency(results.inflationAdjustedValue)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Breakdown</h3>
                      
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
                            strokeDasharray={`${(parseFloat(initialInvestment) / results.futureValue) * 100} 100`}
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
                            strokeDasharray={`${((results.totalContributions - parseFloat(initialInvestment)) / results.futureValue) * 100} 100`}
                            strokeDashoffset={`${-(parseFloat(initialInvestment) / results.futureValue) * 100}`}
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke="#8B5CF6"
                            strokeWidth="10"
                            className="transition-all duration-500"
                            strokeDasharray={`${(results.totalInterestEarned / results.futureValue) * 100} 100`}
                            strokeDashoffset={`${-((results.totalContributions) / results.futureValue) * 100}`}
                          />
                        </svg>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span>Initial Investment</span>
                          </div>
                          <span className="font-medium">{((parseFloat(initialInvestment) / results.futureValue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                            <span>Additional Contributions</span>
                          </div>
                          <span className="font-medium">{(((results.totalContributions - parseFloat(initialInvestment)) / results.futureValue) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                            <span>Interest Earned</span>
                          </div>
                          <span className="font-medium">{((results.totalInterestEarned / results.futureValue) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yearly Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-purple-600 mr-3" />
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

              {/* Investment Details */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Investment Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Parameters</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Initial Investment:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(initialInvestment))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Contribution:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(monthlyContribution))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Return Rate:</span>
                        <span className="font-semibold">{annualReturn}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Investment Period:</span>
                        <span className="font-semibold">{investmentPeriod} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Compounding Frequency:</span>
                        <span className="font-semibold capitalize">{compoundingFrequency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Effective Annual Rate:</span>
                        <span className="font-semibold">{(results.effectiveAnnualRate * 100).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Inflation Impact</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inflation Rate:</span>
                        <span className="font-semibold">{inflationRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Future Value (Nominal):</span>
                        <span className="font-semibold">{formatCurrency(results.futureValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Future Value (Real):</span>
                        <span className="font-semibold">{formatCurrency(results.inflationAdjustedValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchasing Power Loss:</span>
                        <span className="font-semibold">{((1 - results.inflationAdjustedValue / results.futureValue) * 100).toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Real Rate of Return:</span>
                        <span className="font-semibold">{((1 + parseFloat(annualReturn) / 100) / (1 + parseFloat(inflationRate) / 100) - 1).toFixed(4) * 100}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips and Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Investment Tips & Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Investment Strategies</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Start early to maximize the power of compound interest</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consistently contribute to your investments, even in small amounts</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Diversify your portfolio to manage risk</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Reinvest dividends to accelerate growth</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Key Considerations</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Account for inflation when planning long-term investments</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Higher returns typically come with higher risk</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider tax implications of different investment vehicles</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Adjust your investment strategy as you approach your financial goals</span>
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

export default InvestmentCalculator;