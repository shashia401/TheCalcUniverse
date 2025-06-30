import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const RetirementCalculator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState('30');
  const [retirementAge, setRetirementAge] = useState('65');
  const [currentSavings, setCurrentSavings] = useState('50000');
  const [monthlyContribution, setMonthlyContribution] = useState('500');
  const [annualReturn, setAnnualReturn] = useState('7');
  const [annualReturnRetirement, setAnnualReturnRetirement] = useState('5');
  const [annualInflation, setAnnualInflation] = useState('2.5');
  const [annualIncome, setAnnualIncome] = useState('40000');
  const [lifeExpectancy, setLifeExpectancy] = useState('90');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateRetirement();
  }, [
    currentAge, retirementAge, currentSavings, monthlyContribution,
    annualReturn, annualReturnRetirement, annualInflation, annualIncome, lifeExpectancy
  ]);

  const calculateRetirement = () => {
    const age = parseInt(currentAge);
    const retireAge = parseInt(retirementAge);
    const savings = parseFloat(currentSavings);
    const contribution = parseFloat(monthlyContribution);
    const returnRate = parseFloat(annualReturn) / 100;
    const retirementReturnRate = parseFloat(annualReturnRetirement) / 100;
    const inflation = parseFloat(annualInflation) / 100;
    const income = parseFloat(annualIncome);
    const lifeAge = parseInt(lifeExpectancy);

    if (isNaN(age) || isNaN(retireAge) || isNaN(savings) || isNaN(contribution) ||
      isNaN(returnRate) || isNaN(retirementReturnRate) || isNaN(inflation) ||
      isNaN(income) || isNaN(lifeAge) ||
      age < 0 || retireAge <= age || lifeAge <= retireAge) {
      setResults(null);
      return;
    }

    // Calculate accumulation phase (pre-retirement)
    const yearsToRetirement = retireAge - age;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturnRate = returnRate / 12;

    let retirementSavings = savings;
    let totalContributions = savings;

    // Yearly breakdown for accumulation phase
    const accumulationPhase = [];

    for (let year = 1; year <= yearsToRetirement; year++) {
      const yearAge = age + year;
      const yearStartBalance = retirementSavings;
      let yearEndBalance = retirementSavings;
      let yearContributions = 0;
      let yearInterest = 0;

      // Calculate for each month in the year
      for (let month = 1; month <= 12; month++) {
        const monthInterest = yearEndBalance * monthlyReturnRate;
        yearEndBalance += monthInterest + contribution;

        yearContributions += contribution;
        yearInterest += monthInterest;
      }

      totalContributions += yearContributions;

      accumulationPhase.push({
        year,
        age: yearAge,
        startBalance: yearStartBalance,
        contributions: yearContributions,
        interest: yearInterest,
        endBalance: yearEndBalance
      });

      retirementSavings = yearEndBalance;
    }

    // Calculate distribution phase (post-retirement)
    const yearsInRetirement = lifeAge - retireAge;
    const monthlyRetirementReturnRate = retirementReturnRate / 12;
    const monthlyInflationRate = inflation / 12;

    // Calculate inflation-adjusted monthly withdrawal
    const monthlyIncome = income / 12;
    let currentMonthlyIncome = monthlyIncome;

    // Yearly breakdown for distribution phase
    const distributionPhase = [];
    let retirementFunds = retirementSavings;
    let fundsDepletedAge = null;

    for (let year = 1; year <= yearsInRetirement; year++) {
      const yearAge = retireAge + year;
      const yearStartBalance = retirementFunds;
      let yearEndBalance = retirementFunds;
      let yearWithdrawals = 0;
      let yearInterest = 0;

      // Calculate for each month in the year
      for (let month = 1; month <= 12; month++) {
        // Adjust income for inflation
        currentMonthlyIncome = monthlyIncome * Math.pow(1 + monthlyInflationRate, (year - 1) * 12 + month - 1);

        // Calculate interest
        const monthInterest = yearEndBalance * monthlyRetirementReturnRate;

        // Withdraw income
        yearEndBalance += monthInterest - currentMonthlyIncome;

        yearWithdrawals += currentMonthlyIncome;
        yearInterest += monthInterest;

        // Check if funds are depleted
        if (yearEndBalance <= 0 && fundsDepletedAge === null) {
          fundsDepletedAge = yearAge + (month - 1) / 12;
          yearEndBalance = 0;
          break;
        }
      }

      distributionPhase.push({
        year,
        age: yearAge,
        startBalance: yearStartBalance,
        withdrawals: yearWithdrawals,
        interest: yearInterest,
        endBalance: Math.max(0, yearEndBalance)
      });

      retirementFunds = yearEndBalance;

      if (retirementFunds <= 0) {
        break;
      }
    }

    // Calculate retirement statistics
    const totalSavingsAtRetirement = retirementSavings;
    const totalInterestAccumulation = totalSavingsAtRetirement - totalContributions;
    const monthlyRetirementIncome = income / 12;
    const inflationAdjustedSavings = totalSavingsAtRetirement / Math.pow(1 + inflation, yearsToRetirement);
    const inflationAdjustedMonthlyIncome = monthlyRetirementIncome / Math.pow(1 + inflation, yearsToRetirement);

    // Calculate sustainable withdrawal rate
    const withdrawalRate = (income / totalSavingsAtRetirement) * 100;

    // Calculate if retirement savings are sufficient
    const isSufficient = fundsDepletedAge === null || fundsDepletedAge >= lifeAge;

    // Calculate shortfall or surplus
    let shortfallOrSurplus = 0;
    if (isSufficient) {
      // If sufficient, calculate surplus at life expectancy
      shortfallOrSurplus = distributionPhase.length > 0 ?
        distributionPhase[distributionPhase.length - 1].endBalance : 0;
    } else {
      // If insufficient, calculate shortfall (additional savings needed)
      const yearsShort = lifeAge - (fundsDepletedAge || retireAge);
      const monthsShort = yearsShort * 12;
      shortfallOrSurplus = -monthlyRetirementIncome * monthsShort;
    }

    setResults({
      totalSavingsAtRetirement,
      totalContributions,
      totalInterestAccumulation,
      monthlyRetirementIncome,
      inflationAdjustedSavings,
      inflationAdjustedMonthlyIncome,
      withdrawalRate,
      isSufficient,
      fundsDepletedAge,
      shortfallOrSurplus,
      accumulationPhase,
      distributionPhase,
      yearsToRetirement,
      yearsInRetirement
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
        <span className="text-gray-900 font-medium">Retirement Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center mb-6">
              <Calendar className="w-6 h-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Retirement Calculator</h1>
            </div>

            <div className="space-y-6">
              {/* Current Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  min="0"
                  max={retirementAge || '100'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Retirement Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  min={currentAge || '0'}
                  max={lifeExpectancy || '100'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Life Expectancy */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Life Expectancy</label>
                <input
                  type="number"
                  value={lifeExpectancy}
                  onChange={(e) => setLifeExpectancy(e.target.value)}
                  min={retirementAge || '0'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Current Savings */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Retirement Savings</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(e.target.value)}
                    min="0"
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
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Annual Return (Pre-Retirement) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Return Before Retirement (%)</label>
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

              {/* Annual Return (Post-Retirement) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Return During Retirement (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualReturnRetirement}
                    onChange={(e) => setAnnualReturnRetirement(e.target.value)}
                    step="0.1"
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Annual Inflation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Inflation (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={annualInflation}
                    onChange={(e) => setAnnualInflation(e.target.value)}
                    step="0.1"
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Annual Retirement Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desired Annual Retirement Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={annualIncome}
                    onChange={(e) => setAnnualIncome(e.target.value)}
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-8">
          {results && (
            <>
              {/* Retirement Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Retirement Summary</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {formatCurrency(results.totalSavingsAtRetirement)}
                      </div>
                      <div className="text-gray-600">Retirement Savings at Age {retirementAge}</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Years Until Retirement</span>
                        <span className="font-semibold text-blue-600">{results.yearsToRetirement}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-gray-700">Monthly Retirement Income</span>
                        <span className="font-semibold text-green-600">{formatCurrency(results.monthlyRetirementIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                        <span className="text-gray-700">Withdrawal Rate</span>
                        <span className="font-semibold text-purple-600">{results.withdrawalRate.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className={`bg-gradient-to-r ${results.isSufficient ? 'from-green-50 to-emerald-50' : 'from-red-50 to-orange-50'} rounded-xl p-6`}>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Retirement Outlook</h3>

                      <div className="text-center mb-4">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full ${results.isSufficient ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                          {results.isSufficient ? 'Savings Sufficient' : 'Savings Insufficient'}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {results.isSufficient ? (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Funds Will Last Until</span>
                              <span className="font-semibold text-green-600">Age {lifeExpectancy}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Estimated Surplus</span>
                              <span className="font-semibold text-green-600">{formatCurrency(results.shortfallOrSurplus)}</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Funds Will Deplete At</span>
                              <span className="font-semibold text-red-600">Age {results.fundsDepletedAge?.toFixed(1) || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Estimated Shortfall</span>
                              <span className="font-semibold text-red-600">{formatCurrency(Math.abs(results.shortfallOrSurplus))}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-700">Years Short</span>
                              <span className="font-semibold text-red-600">{(parseInt(lifeExpectancy) - (results.fundsDepletedAge || parseInt(retirementAge))).toFixed(1)}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retirement Timeline */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Retirement Timeline</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-semibold">Age</th>
                        <th className="text-left p-3 font-semibold">Year</th>
                        <th className="text-left p-3 font-semibold">Starting Balance</th>
                        <th className="text-left p-3 font-semibold">{results.accumulationPhase.length > 0 ? 'Contributions' : 'Withdrawals'}</th>
                        <th className="text-left p-3 font-semibold">Interest Earned</th>
                        <th className="text-left p-3 font-semibold">Ending Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Accumulation Phase */}
                      {results.accumulationPhase.slice(0, 5).map((year: any, index: number) => (
                        <tr key={`acc-${year.year}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-3">{year.age}</td>
                          <td className="p-3">{new Date().getFullYear() + year.year - 1}</td>
                          <td className="p-3 font-mono">{formatCurrency(year.startBalance)}</td>
                          <td className="p-3 font-mono text-green-600">{formatCurrency(year.contributions)}</td>
                          <td className="p-3 font-mono text-purple-600">{formatCurrency(year.interest)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrency(year.endBalance)}</td>
                        </tr>
                      ))}

                      {results.accumulationPhase.length > 5 && (
                        <tr className="bg-gray-100">
                          <td colSpan={6} className="p-3 text-center text-gray-500">
                            ... {results.accumulationPhase.length - 5} more years of accumulation ...
                          </td>
                        </tr>
                      )}

                      {/* Last year of accumulation */}
                      {results.accumulationPhase.length > 5 && (
                        <tr className="bg-blue-50">
                          <td className="p-3">{results.accumulationPhase[results.accumulationPhase.length - 1].age}</td>
                          <td className="p-3">{new Date().getFullYear() + results.accumulationPhase[results.accumulationPhase.length - 1].year - 1}</td>
                          <td className="p-3 font-mono">{formatCurrency(results.accumulationPhase[results.accumulationPhase.length - 1].startBalance)}</td>
                          <td className="p-3 font-mono text-green-600">{formatCurrency(results.accumulationPhase[results.accumulationPhase.length - 1].contributions)}</td>
                          <td className="p-3 font-mono text-purple-600">{formatCurrency(results.accumulationPhase[results.accumulationPhase.length - 1].interest)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrency(results.accumulationPhase[results.accumulationPhase.length - 1].endBalance)}</td>
                        </tr>
                      )}

                      {/* Distribution Phase */}
                      {results.distributionPhase.slice(0, 5).map((year: any, index: number) => (
                        <tr key={`dist-${year.year}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-3">{year.age}</td>
                          <td className="p-3">{new Date().getFullYear() + results.yearsToRetirement + year.year - 1}</td>
                          <td className="p-3 font-mono">{formatCurrency(year.startBalance)}</td>
                          <td className="p-3 font-mono text-red-600">-{formatCurrency(year.withdrawals)}</td>
                          <td className="p-3 font-mono text-purple-600">{formatCurrency(year.interest)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrency(year.endBalance)}</td>
                        </tr>
                      ))}

                      {results.distributionPhase.length > 5 && (
                        <tr className="bg-gray-100">
                          <td colSpan={6} className="p-3 text-center text-gray-500">
                            ... {results.distributionPhase.length - 5} more years of retirement ...
                          </td>
                        </tr>
                      )}

                      {/* Last year of distribution */}
                      {results.distributionPhase.length > 5 && (
                        <tr className={results.distributionPhase[results.distributionPhase.length - 1].endBalance > 0 ? 'bg-green-50' : 'bg-red-50'}>
                          <td className="p-3">{results.distributionPhase[results.distributionPhase.length - 1].age}</td>
                          <td className="p-3">{new Date().getFullYear() + results.yearsToRetirement + results.distributionPhase[results.distributionPhase.length - 1].year - 1}</td>
                          <td className="p-3 font-mono">{formatCurrency(results.distributionPhase[results.distributionPhase.length - 1].startBalance)}</td>
                          <td className="p-3 font-mono text-red-600">-{formatCurrency(results.distributionPhase[results.distributionPhase.length - 1].withdrawals)}</td>
                          <td className="p-3 font-mono text-purple-600">{formatCurrency(results.distributionPhase[results.distributionPhase.length - 1].interest)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrency(results.distributionPhase[results.distributionPhase.length - 1].endBalance)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Retirement Analysis */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Retirement Analysis</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Savings:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(currentSavings))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Contributions:</span>
                        <span className="font-semibold">{formatCurrency(results.totalContributions - parseFloat(currentSavings))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest Earned:</span>
                        <span className="font-semibold">{formatCurrency(results.totalInterestAccumulation)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600 font-semibold">Total at Retirement:</span>
                        <span className="font-semibold">{formatCurrency(results.totalSavingsAtRetirement)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Retirement Income</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual Income:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(annualIncome))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Income:</span>
                        <span className="font-semibold">{formatCurrency(results.monthlyRetirementIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Withdrawal Rate:</span>
                        <span className={`font-semibold ${results.withdrawalRate > 4 ? 'text-red-600' : 'text-green-600'}`}>
                          {results.withdrawalRate.toFixed(2)}%
                          {results.withdrawalRate > 4 && ' (High)'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Retirement Duration:</span>
                        <span className="font-semibold">{results.yearsInRetirement} years</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 bg-purple-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Inflation Impact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Inflation Rate:</span>
                        <span className="font-semibold">{annualInflation}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Today's Dollars at Retirement:</span>
                        <span className="font-semibold">{formatCurrency(results.inflationAdjustedSavings)}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Monthly Income (Today's Dollars):</span>
                        <span className="font-semibold">{formatCurrency(results.inflationAdjustedMonthlyIncome)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Purchasing Power Loss:</span>
                        <span className="font-semibold">{((1 - results.inflationAdjustedSavings / results.totalSavingsAtRetirement) * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Retirement Recommendations */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Retirement Recommendations</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Savings Strategies</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Maximize tax-advantaged accounts like 401(k)s and IRAs</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider catch-up contributions if you're over 50</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Automate your savings to ensure consistent contributions</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Gradually increase your savings rate as your income grows</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4">Retirement Planning Tips</h3>
                    <ul className="space-y-3 text-indigo-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Aim for a withdrawal rate of 4% or less for sustainability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider healthcare costs in your retirement budget</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Adjust your investment risk as you approach retirement</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Review and adjust your plan annually</span>
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

export default RetirementCalculator;