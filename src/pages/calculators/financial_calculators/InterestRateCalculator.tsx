import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Percent, DollarSign, Calendar } from 'lucide-react';

const InterestRateCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('10000');
  const [futureValue, setFutureValue] = useState('15000');
  const [time, setTime] = useState('5');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateInterestRate();
  }, [principal, futureValue, time]);

  const calculateInterestRate = () => {
    const p = parseFloat(principal);
    const fv = parseFloat(futureValue);
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(fv) || isNaN(t) || p <= 0 || fv <= p || t <= 0) {
      setResults(null);
      return;
    }

    const simpleRate = ((fv - p) / (p * t)) * 100;

    const compoundRate = (Math.pow(fv / p, 1 / t) - 1) * 100;

    const totalGain = fv - p;
    const percentageGain = ((fv / p) - 1) * 100;

    setResults({
      simpleRate: simpleRate.toFixed(3),
      compoundRate: compoundRate.toFixed(3),
      totalGain: totalGain.toFixed(2),
      percentageGain: percentageGain.toFixed(2),
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
        <span className="text-gray-900 font-medium">Interest Rate Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 rounded-xl mr-4">
            <Percent className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interest Rate Calculator</h1>
            <p className="text-gray-600">Calculate the interest rate needed to reach your goal</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desired Future Value ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={futureValue}
                  onChange={(e) => setFutureValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="15000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Period (Years)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Required Interest Rates</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Simple Interest Rate</div>
                  <div className="text-3xl font-bold text-blue-600">
                    {results.simpleRate}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Annual simple interest rate needed
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Compound Interest Rate</div>
                  <div className="text-3xl font-bold text-green-600">
                    {results.compoundRate}%
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Annual compound interest rate needed
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Gain</div>
                  <div className="text-xl font-bold text-gray-900">
                    ${parseFloat(results.totalGain).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Percentage Gain</div>
                  <div className="text-xl font-bold text-orange-600">
                    {results.percentageGain}%
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Interest Rate Calculation</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            This calculator determines what interest rate you need to grow your initial investment to a desired future value.
          </p>
          <p>
            <strong>Simple Interest Formula:</strong> r = (FV - PV) / (PV × t)
          </p>
          <p>
            <strong>Compound Interest Formula:</strong> r = (FV / PV)^(1/t) - 1
          </p>
          <p className="text-sm">
            Where: PV = Present Value, FV = Future Value, r = Rate, t = Time
          </p>
          <p className="text-sm text-gray-600">
            Note: Compound interest generally requires a lower rate than simple interest to reach the same goal.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterestRateCalculator;
