import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, TrendingDown, DollarSign, Calendar, Percent } from 'lucide-react';

const InflationCalculator: React.FC = () => {
  const [currentAmount, setCurrentAmount] = useState('100');
  const [inflationRate, setInflationRate] = useState('3');
  const [years, setYears] = useState('10');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateInflation();
  }, [currentAmount, inflationRate, years]);

  const calculateInflation = () => {
    const amount = parseFloat(currentAmount);
    const rate = parseFloat(inflationRate) / 100;
    const time = parseFloat(years);

    if (isNaN(amount) || isNaN(rate) || isNaN(time) || amount <= 0 || time <= 0) {
      setResults(null);
      return;
    }

    const futureValue = amount * Math.pow(1 + rate, time);
    const purchasingPower = amount / Math.pow(1 + rate, time);
    const totalInflation = futureValue - amount;

    setResults({
      futureValue: futureValue.toFixed(2),
      purchasingPower: purchasingPower.toFixed(2),
      totalInflation: totalInflation.toFixed(2),
      inflationPercentage: ((futureValue / amount - 1) * 100).toFixed(2),
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
        <span className="text-gray-900 font-medium">Inflation Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-red-100 rounded-xl mr-4">
            <TrendingDown className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Inflation Calculator</h1>
            <p className="text-gray-600">Calculate the impact of inflation on purchasing power</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="100"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Inflation Rate (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="3"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Years
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inflation Impact</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Equivalent Future Value</div>
                  <div className="text-2xl font-bold text-red-600">
                    ${parseFloat(results.futureValue).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    To maintain same purchasing power
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Current Purchasing Power</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${parseFloat(results.purchasingPower).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    What ${currentAmount} will be worth in {years} years
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Inflation Impact</div>
                  <div className="text-xl font-bold text-orange-600">
                    {results.inflationPercentage}%
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Inflation</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power over time.
          </p>
          <p>
            <strong>Formula:</strong> Future Value = Present Value × (1 + inflation rate)^years
          </p>
          <p>
            Understanding inflation helps you plan investments and savings to maintain purchasing power over time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InflationCalculator;
