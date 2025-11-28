import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowDownCircle, DollarSign, Calendar } from 'lucide-react';

const SWPCalculator: React.FC = () => {
  const [totalInvestment, setTotalInvestment] = useState('500000');
  const [monthlyWithdrawal, setMonthlyWithdrawal] = useState('5000');
  const [expectedReturn, setExpectedReturn] = useState('10');
  const [timePeriod, setTimePeriod] = useState('10');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateSWP();
  }, [totalInvestment, monthlyWithdrawal, expectedReturn, timePeriod]);

  const calculateSWP = () => {
    const investment = parseFloat(totalInvestment);
    const withdrawal = parseFloat(monthlyWithdrawal);
    const rate = parseFloat(expectedReturn) / 100 / 12;
    const months = parseFloat(timePeriod) * 12;

    if (isNaN(investment) || isNaN(withdrawal) || isNaN(rate) || isNaN(months) ||
        investment <= 0 || withdrawal <= 0 || months <= 0) {
      setResults(null);
      return;
    }

    let balance = investment;
    let totalWithdrawn = 0;
    let totalReturns = 0;

    for (let i = 0; i < months; i++) {
      const returns = balance * rate;
      balance += returns;
      balance -= withdrawal;
      totalWithdrawn += withdrawal;
      totalReturns += returns;

      if (balance < 0) {
        break;
      }
    }

    const finalBalance = Math.max(0, balance);

    setResults({
      finalBalance: finalBalance.toFixed(2),
      totalWithdrawn: totalWithdrawn.toFixed(2),
      totalReturns: totalReturns.toFixed(2),
      remainingMonths: balance > 0 ? months : Math.floor(totalWithdrawn / withdrawal),
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/financial" className="hover:text-blue-600 transition-colors">
          Financial Calculators
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">SWP Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-orange-100 rounded-xl mr-4">
            <ArrowDownCircle className="w-8 h-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SWP Calculator</h1>
            <p className="text-gray-600">Calculate Systematic Withdrawal Plan</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Investment (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={totalInvestment}
                  onChange={(e) => setTotalInvestment(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="500000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Withdrawal (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={monthlyWithdrawal}
                  onChange={(e) => setMonthlyWithdrawal(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Annual Return (%)
              </label>
              <input
                type="number"
                value={expectedReturn}
                onChange={(e) => setExpectedReturn(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10"
                step="0.1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period (Years)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={timePeriod}
                  onChange={(e) => setTimePeriod(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal Summary</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Withdrawn</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{parseFloat(results.totalWithdrawn).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Returns Earned</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{parseFloat(results.totalReturns).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Final Balance</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{parseFloat(results.finalBalance).toLocaleString('en-IN')}
                  </div>
                </div>
                {parseFloat(results.finalBalance) === 0 && (
                  <div className="bg-red-100 border border-red-200 rounded-lg p-4">
                    <div className="text-sm text-red-700">
                      ⚠️ Investment depleted after {results.remainingMonths} months
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Enter values to see results
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About SWP Calculator</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            A Systematic Withdrawal Plan (SWP) allows you to withdraw a fixed amount from your mutual fund investments at regular intervals.
          </p>
          <p>
            <strong>Benefits of SWP:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Regular income stream from investments</li>
            <li>Tax-efficient withdrawal strategy</li>
            <li>Flexibility to adjust withdrawal amount</li>
            <li>Remaining corpus continues to grow</li>
          </ul>
          <p>
            This calculator helps you plan your withdrawals and see how long your investment will last based on your withdrawal rate and expected returns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SWPCalculator;
