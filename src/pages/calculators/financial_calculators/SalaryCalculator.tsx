import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Wallet, DollarSign, Calendar } from 'lucide-react';

const SalaryCalculator: React.FC = () => {
  const [salary, setSalary] = useState('75000');
  const [payFrequency, setPayFrequency] = useState<'yearly' | 'monthly' | 'biweekly' | 'weekly' | 'hourly'>('yearly');
  const [hoursPerWeek, setHoursPerWeek] = useState('40');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateSalary();
  }, [salary, payFrequency, hoursPerWeek]);

  const calculateSalary = () => {
    const amount = parseFloat(salary);
    const hours = parseFloat(hoursPerWeek);

    if (isNaN(amount) || amount < 0 || (payFrequency === 'hourly' && (isNaN(hours) || hours <= 0))) {
      setResults(null);
      return;
    }

    let yearlyAmount: number;

    switch (payFrequency) {
      case 'yearly':
        yearlyAmount = amount;
        break;
      case 'monthly':
        yearlyAmount = amount * 12;
        break;
      case 'biweekly':
        yearlyAmount = amount * 26;
        break;
      case 'weekly':
        yearlyAmount = amount * 52;
        break;
      case 'hourly':
        yearlyAmount = amount * hours * 52;
        break;
      default:
        yearlyAmount = amount;
    }

    setResults({
      yearly: yearlyAmount.toFixed(2),
      monthly: (yearlyAmount / 12).toFixed(2),
      biweekly: (yearlyAmount / 26).toFixed(2),
      weekly: (yearlyAmount / 52).toFixed(2),
      daily: (yearlyAmount / 260).toFixed(2),
      hourly: (yearlyAmount / (hours * 52)).toFixed(2),
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
        <span className="text-gray-900 font-medium">Salary Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Salary Calculator</h1>
            <p className="text-gray-600">Convert salary to different pay periods</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pay Frequency
              </label>
              <select
                value={payFrequency}
                onChange={(e) => setPayFrequency(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="yearly">Yearly</option>
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {payFrequency === 'yearly' && 'Annual Salary ($)'}
                {payFrequency === 'monthly' && 'Monthly Salary ($)'}
                {payFrequency === 'biweekly' && 'Bi-weekly Salary ($)'}
                {payFrequency === 'weekly' && 'Weekly Salary ($)'}
                {payFrequency === 'hourly' && 'Hourly Rate ($)'}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="75000"
                  step="0.01"
                />
              </div>
            </div>

            {payFrequency === 'hourly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hours Per Week
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="40"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Breakdown</h3>
            {results ? (
              <div className="space-y-3">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Yearly</div>
                  <div className="text-xl font-bold text-gray-900">
                    ${parseFloat(results.yearly).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Monthly</div>
                  <div className="text-lg font-bold text-blue-600">
                    ${parseFloat(results.monthly).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Bi-weekly</div>
                  <div className="text-lg font-bold text-green-600">
                    ${parseFloat(results.biweekly).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Weekly</div>
                  <div className="text-lg font-bold text-orange-600">
                    ${parseFloat(results.weekly).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Daily</div>
                  <div className="text-lg font-bold text-gray-700">
                    ${parseFloat(results.daily).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Hourly</div>
                  <div className="text-lg font-bold text-cyan-600">
                    ${parseFloat(results.hourly).toLocaleString()}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Salary Calculation</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            This calculator converts your salary between different pay periods to help you understand your income better.
          </p>
          <p>
            <strong>Assumptions:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>52 weeks per year</li>
            <li>26 bi-weekly pay periods per year</li>
            <li>260 working days per year (52 weeks × 5 days)</li>
          </ul>
          <p className="text-sm text-gray-600">
            Note: These are gross amounts before taxes and deductions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalaryCalculator;
