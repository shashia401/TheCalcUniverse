import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Calendar } from 'lucide-react';

const DateCalculator: React.FC = () => {
  const [calculationType, setCalculationType] = useState<'difference' | 'add' | 'subtract'>('difference');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [baseDate, setBaseDate] = useState('');
  const [years, setYears] = useState('');
  const [months, setMonths] = useState('');
  const [days, setDays] = useState('');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    calculateDate();
  }, [calculationType, startDate, endDate, baseDate, years, months, days]);

  const calculateDate = () => {
    try {
      if (calculationType === 'difference' && startDate && endDate) {
        calculateDateDifference();
      } else if ((calculationType === 'add' || calculationType === 'subtract') && baseDate) {
        calculateDateAddSubtract();
      }
    } catch (error) {
      setResult({ error: 'Invalid date calculation' });
    }
  };

  const calculateDateDifference = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      setResult({ error: 'Start date must be before end date' });
      return;
    }

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const diffYears = end.getFullYear() - start.getFullYear();

    // More precise calculation
    let yearsDiff = diffYears;
    let monthsDiff = end.getMonth() - start.getMonth();
    let daysDiff = end.getDate() - start.getDate();

    if (daysDiff < 0) {
      monthsDiff--;
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      daysDiff += prevMonth.getDate();
    }

    if (monthsDiff < 0) {
      yearsDiff--;
      monthsDiff += 12;
    }

    setResult({
      totalDays: diffDays,
      totalWeeks: diffWeeks,
      totalMonths: diffMonths,
      totalYears: Math.floor(diffDays / 365.25),
      precise: {
        years: yearsDiff,
        months: monthsDiff,
        days: daysDiff
      }
    });
  };

  const calculateDateAddSubtract = () => {
    const base = new Date(baseDate);
    const yearsToAdd = parseInt(years) || 0;
    const monthsToAdd = parseInt(months) || 0;
    const daysToAdd = parseInt(days) || 0;

    const multiplier = calculationType === 'add' ? 1 : -1;

    const resultDate = new Date(base);
    resultDate.setFullYear(resultDate.getFullYear() + (yearsToAdd * multiplier));
    resultDate.setMonth(resultDate.getMonth() + (monthsToAdd * multiplier));
    resultDate.setDate(resultDate.getDate() + (daysToAdd * multiplier));

    setResult({
      resultDate: resultDate.toISOString().split('T')[0],
      formattedDate: resultDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    });
  };

  const formatDuration = (years: number, months: number, days: number) => {
    const parts = [];
    if (years > 0) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
    if (months > 0) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
    if (days > 0) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
    return parts.join(', ');
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
        <Link to="/date-time-calculators" className="hover:text-blue-600 transition-colors">Date & Time Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Date Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Calendar className="w-8 h-8 text-orange-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Date Calculator</h1>
            </div>

            {/* Calculation Type Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Calculation Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setCalculationType('difference')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    calculationType === 'difference'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Date Difference</div>
                  <div className="text-sm opacity-75">Calculate time between dates</div>
                </button>
                <button
                  onClick={() => setCalculationType('add')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    calculationType === 'add'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Add Time</div>
                  <div className="text-sm opacity-75">Add time to a date</div>
                </button>
                <button
                  onClick={() => setCalculationType('subtract')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    calculationType === 'subtract'
                      ? 'border-orange-500 bg-orange-50 text-orange-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="font-medium">Subtract Time</div>
                  <div className="text-sm opacity-75">Subtract time from a date</div>
                </button>
              </div>
            </div>

            {/* Date Difference Inputs */}
            {calculationType === 'difference' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>

                {/* Results */}
                {result && !result.error && (
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Difference</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{result.totalDays}</div>
                        <div className="text-sm text-gray-600">Total Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{result.totalWeeks}</div>
                        <div className="text-sm text-gray-600">Total Weeks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{result.totalMonths}</div>
                        <div className="text-sm text-gray-600">Total Months</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{result.totalYears}</div>
                        <div className="text-sm text-gray-600">Total Years</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-lg font-semibold text-gray-900">
                        {formatDuration(result.precise.years, result.precise.months, result.precise.days)}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Add/Subtract Time Inputs */}
            {(calculationType === 'add' || calculationType === 'subtract') && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Base Date
                  </label>
                  <input
                    type="date"
                    value={baseDate}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Years
                    </label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Months
                    </label>
                    <input
                      type="number"
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Days
                    </label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      placeholder="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg"
                    />
                  </div>
                </div>

                {/* Result Date */}
                {result && result.resultDate && (
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Result Date</h3>
                    <div className="text-3xl font-bold text-orange-600 mb-2">
                      {result.resultDate}
                    </div>
                    <div className="text-lg text-gray-700">
                      {result.formattedDate}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Error Display */}
            {result && result.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {result.error}
              </div>
            )}
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Date Calculator Uses</h2>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800">Age Calculation</h3>
                <p className="text-gray-600">Calculate exact age in years, months, days</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Project Planning</h3>
                <p className="text-gray-600">Calculate project durations and deadlines</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Event Planning</h3>
                <p className="text-gray-600">Plan events and calculate time until dates</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Legal & Business</h3>
                <p className="text-gray-600">Calculate contract periods and deadlines</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-orange-900 mb-3">Quick Tips</h3>
            <ul className="text-orange-800 text-sm space-y-2">
              <li>• Accounts for leap years automatically</li>
              <li>• Handles different month lengths</li>
              <li>• Provides multiple time unit results</li>
              <li>• Works with past and future dates</li>
              <li>• Precise to the day calculation</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Examples</h3>
            <div className="text-blue-800 text-sm space-y-2">
              <div>• Days until vacation</div>
              <div>• Age in exact years/months/days</div>
              <div>• Project completion date</div>
              <div>• Time since important events</div>
              <div>• Contract expiration dates</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateCalculator;