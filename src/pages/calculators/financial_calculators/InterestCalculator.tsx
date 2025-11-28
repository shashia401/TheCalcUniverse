import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Percent, DollarSign, Calendar } from 'lucide-react';

const InterestCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState('10000');
  const [rate, setRate] = useState('5');
  const [time, setTime] = useState('5');
  const [interestType, setInterestType] = useState<'simple' | 'compound'>('simple');
  const [compoundFrequency, setCompoundFrequency] = useState<'annually' | 'semiannually' | 'quarterly' | 'monthly' | 'daily'>('annually');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateInterest();
  }, [principal, rate, time, interestType, compoundFrequency]);

  const calculateInterest = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(time);

    if (isNaN(p) || isNaN(r) || isNaN(t) || p <= 0 || r < 0 || t <= 0) {
      setResults(null);
      return;
    }

    if (interestType === 'simple') {
      const interest = p * r * t;
      const totalAmount = p + interest;

      setResults({
        interest: interest.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        principal: p.toFixed(2),
      });
    } else {
      let n: number;
      switch (compoundFrequency) {
        case 'annually': n = 1; break;
        case 'semiannually': n = 2; break;
        case 'quarterly': n = 4; break;
        case 'monthly': n = 12; break;
        case 'daily': n = 365; break;
        default: n = 1;
      }

      const totalAmount = p * Math.pow(1 + r / n, n * t);
      const interest = totalAmount - p;

      setResults({
        interest: interest.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        principal: p.toFixed(2),
      });
    }
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
        <span className="text-gray-900 font-medium">Interest Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <Percent className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interest Calculator</h1>
            <p className="text-gray-600">Calculate simple and compound interest</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Type
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setInterestType('simple')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    interestType === 'simple'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Simple
                </button>
                <button
                  onClick={() => setInterestType('compound')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    interestType === 'compound'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Compound
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Principal Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="10000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Rate (% per year)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                  step="0.1"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5"
                />
              </div>
            </div>

            {interestType === 'compound' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compounding Frequency
                </label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="annually">Annually</option>
                  <option value="semiannually">Semi-annually</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="monthly">Monthly</option>
                  <option value="daily">Daily</option>
                </select>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Calculation Results</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Principal Amount</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${parseFloat(results.principal).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Interest</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${parseFloat(results.interest).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Amount</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${parseFloat(results.totalAmount).toLocaleString()}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Interest Calculator</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            <strong>Simple Interest:</strong> Interest calculated on the principal amount only.
          </p>
          <p className="ml-4">Formula: I = P × r × t</p>
          <p>
            <strong>Compound Interest:</strong> Interest calculated on principal plus accumulated interest.
          </p>
          <p className="ml-4">Formula: A = P(1 + r/n)^(nt)</p>
          <p className="text-sm">
            Where: P = Principal, r = Rate, t = Time, n = Compounding frequency, A = Total amount
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterestCalculator;
