import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingUp, DollarSign, Calendar } from 'lucide-react';

const SIPCalculator: React.FC = () => {
  const [monthlyInvestment, setMonthlyInvestment] = useState('5000');
  const [expectedReturn, setExpectedReturn] = useState('12');
  const [timePeriod, setTimePeriod] = useState('10');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateSIP();
  }, [monthlyInvestment, expectedReturn, timePeriod]);

  const calculateSIP = () => {
    const monthly = parseFloat(monthlyInvestment);
    const rate = parseFloat(expectedReturn) / 100 / 12;
    const months = parseFloat(timePeriod) * 12;

    if (isNaN(monthly) || isNaN(rate) || isNaN(months) || monthly <= 0 || months <= 0) {
      setResults(null);
      return;
    }

    const futureValue = monthly * (((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate));
    const totalInvestment = monthly * months;
    const totalReturns = futureValue - totalInvestment;

    setResults({
      futureValue: futureValue.toFixed(2),
      totalInvestment: totalInvestment.toFixed(2),
      totalReturns: totalReturns.toFixed(2),
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
        <span className="text-gray-900 font-medium">SIP Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 rounded-xl mr-4">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">SIP Calculator</h1>
            <p className="text-gray-600">Calculate Systematic Investment Plan returns</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Monthly Investment (₹)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={monthlyInvestment}
                  onChange={(e) => setMonthlyInvestment(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="12"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Investment Summary</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Investment</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ₹{parseFloat(results.totalInvestment).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Returns</div>
                  <div className="text-2xl font-bold text-green-600">
                    ₹{parseFloat(results.totalReturns).toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Future Value</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{parseFloat(results.futureValue).toLocaleString('en-IN')}
                  </div>
                </div>
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About SIP Calculator</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            A Systematic Investment Plan (SIP) is a method of investing in mutual funds where you invest a fixed amount regularly (monthly, quarterly, etc.).
          </p>
          <p>
            <strong>Benefits of SIP:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Rupee cost averaging - reduces market timing risk</li>
            <li>Power of compounding over long term</li>
            <li>Disciplined approach to investing</li>
            <li>Flexible investment amounts</li>
          </ul>
          <p>
            <strong>Formula:</strong> FV = P × ((1 + r)^n - 1) / r × (1 + r)
          </p>
          <p className="text-sm">
            Where P = Monthly investment, r = Monthly rate of return, n = Number of months
          </p>
        </div>
      </div>
    </div>
  );
};

export default SIPCalculator;
