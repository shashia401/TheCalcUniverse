import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, DollarSign, Calendar, Percent } from 'lucide-react';

const LoanCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('10000');
  const [interestRate, setInterestRate] = useState('5');
  const [loanTerm, setLoanTerm] = useState('3');
  const [paymentFrequency, setPaymentFrequency] = useState<'monthly' | 'biweekly' | 'weekly'>('monthly');
  const [extraPayment, setExtraPayment] = useState('0');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateLoan();
  }, [loanAmount, interestRate, loanTerm, paymentFrequency, extraPayment]);

  const calculateLoan = () => {
    const principal = parseFloat(loanAmount);
    const annualRate = parseFloat(interestRate) / 100;
    const years = parseFloat(loanTerm);
    const additionalPayment = parseFloat(extraPayment) || 0;

    if (isNaN(principal) || isNaN(annualRate) || isNaN(years) || principal <= 0 || annualRate < 0 || years <= 0) {
      setResults(null);
      return;
    }

    // Calculate number of payments based on frequency
    let numberOfPayments: number;
    let ratePerPeriod: number;
    
    if (paymentFrequency === 'monthly') {
      numberOfPayments = years * 12;
      ratePerPeriod = annualRate / 12;
    } else if (paymentFrequency === 'biweekly') {
      numberOfPayments = years * 26;
      ratePerPeriod = annualRate / 26;
    } else { // weekly
      numberOfPayments = years * 52;
      ratePerPeriod = annualRate / 52;
    }

    // Calculate regular payment amount (without extra payment)
    const regularPayment = (principal * ratePerPeriod * Math.pow(1 + ratePerPeriod, numberOfPayments)) / 
                          (Math.pow(1 + ratePerPeriod, numberOfPayments) - 1);
    
    // Calculate amortization schedule
    const schedule = [];
    let balance = principal;
    let totalInterest = 0;
    let totalPrincipal = 0;
    let paymentNumber = 1;
    let actualNumberOfPayments = 0;

    while (balance > 0 && paymentNumber <= numberOfPayments * 2) { // Safety limit to prevent infinite loops
      const interestPayment = balance * ratePerPeriod;
      let principalPayment = regularPayment - interestPayment;
      
      // Add extra payment
      principalPayment += additionalPayment;
      
      // Adjust for final payment
      if (principalPayment > balance) {
        principalPayment = balance;
      }
      
      const totalPayment = interestPayment + principalPayment;
      balance -= principalPayment;
      
      totalInterest += interestPayment;
      totalPrincipal += principalPayment;
      
      schedule.push({
        paymentNumber,
        payment: totalPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
        totalInterest: totalInterest
      });
      
      if (balance <= 0) {
        break;
      }
      
      paymentNumber++;
    }
    
    actualNumberOfPayments = schedule.length;
    
    // Calculate time saved
    const originalTerm = numberOfPayments;
    const timeSaved = originalTerm - actualNumberOfPayments;
    
    // Calculate interest saved
    const originalTotalInterest = principal * ratePerPeriod * numberOfPayments - principal;
    const interestSaved = originalTotalInterest - totalInterest;

    setResults({
      regularPayment,
      totalPayment: regularPayment * numberOfPayments,
      totalInterest,
      totalPrincipal,
      numberOfPayments: actualNumberOfPayments,
      schedule,
      timeSaved,
      interestSaved,
      paymentFrequency,
      originalTerm
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

  const getPaymentPeriodText = () => {
    switch (paymentFrequency) {
      case 'monthly': return 'month';
      case 'biweekly': return '2 weeks';
      case 'weekly': return 'week';
    }
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
        <span className="text-gray-900 font-medium">Loan Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Loan Calculator</h1>
            </div>

            <div className="space-y-6">
              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                <div className="relative">
                  <input
                    type="number"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    step="0.01"
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term (Years)</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  min="0.5"
                  step="0.5"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Payment Frequency */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Frequency</label>
                <select
                  value={paymentFrequency}
                  onChange={(e) => setPaymentFrequency(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="monthly">Monthly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              {/* Extra Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Extra Payment (per period)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={extraPayment}
                    onChange={(e) => setExtraPayment(e.target.value)}
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Additional amount to pay each period to reduce loan term
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-8">
          {results && (
            <>
              {/* Payment Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Calendar className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Payment Summary</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {formatCurrency(results.regularPayment)}
                      </div>
                      <div className="text-gray-600">Per {getPaymentPeriodText()}</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Total Payments</span>
                        <span className="font-semibold text-blue-600">{results.numberOfPayments}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Loan Amount</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(loanAmount))}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Total Interest</span>
                        <span className="font-semibold">{formatCurrency(results.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Total Cost</span>
                        <span className="font-semibold">{formatCurrency(results.totalPrincipal + results.totalInterest)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Savings with Extra Payments</h3>
                      
                      {parseFloat(extraPayment) > 0 ? (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Time Saved</span>
                            <span className="font-semibold text-green-600">
                              {results.timeSaved} {results.paymentFrequency === 'monthly' ? 'months' : 
                                results.paymentFrequency === 'biweekly' ? 'bi-weekly payments' : 'weeks'}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Interest Saved</span>
                            <span className="font-semibold text-green-600">{formatCurrency(results.interestSaved)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Original Term</span>
                            <span className="font-semibold">{results.originalTerm} payments</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">New Term</span>
                            <span className="font-semibold">{results.numberOfPayments} payments</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-600 py-4">
                          Add an extra payment amount to see potential savings
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amortization Schedule */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Percent className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Amortization Schedule</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-semibold">Payment #</th>
                        <th className="text-left p-3 font-semibold">Payment</th>
                        <th className="text-left p-3 font-semibold">Principal</th>
                        <th className="text-left p-3 font-semibold">Interest</th>
                        <th className="text-left p-3 font-semibold">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.schedule.slice(0, 12).map((payment: any, index: number) => (
                        <tr key={payment.paymentNumber} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="p-3">{payment.paymentNumber}</td>
                          <td className="p-3 font-mono">{formatCurrencyDetailed(payment.payment)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrencyDetailed(payment.principal)}</td>
                          <td className="p-3 font-mono text-red-600">{formatCurrencyDetailed(payment.interest)}</td>
                          <td className="p-3 font-mono">{formatCurrencyDetailed(payment.balance)}</td>
                        </tr>
                      ))}
                      {results.schedule.length > 12 && (
                        <tr className="bg-gray-100">
                          <td colSpan={5} className="p-3 text-center text-gray-500">
                            ... {results.schedule.length - 12} more payments ...
                          </td>
                        </tr>
                      )}
                      {results.schedule.length > 12 && (
                        <tr className="bg-green-50">
                          <td className="p-3">{results.schedule[results.schedule.length - 1].paymentNumber}</td>
                          <td className="p-3 font-mono">{formatCurrencyDetailed(results.schedule[results.schedule.length - 1].payment)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrencyDetailed(results.schedule[results.schedule.length - 1].principal)}</td>
                          <td className="p-3 font-mono text-red-600">{formatCurrencyDetailed(results.schedule[results.schedule.length - 1].interest)}</td>
                          <td className="p-3 font-mono">{formatCurrencyDetailed(results.schedule[results.schedule.length - 1].balance)}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Loan Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Loan Breakdown</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Pie Chart Visualization */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Principal */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#3B82F6"
                          strokeWidth="10"
                          strokeDasharray="100 100"
                          strokeDashoffset="0"
                        />
                        {/* Interest */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#EF4444"
                          strokeWidth="10"
                          strokeDasharray={`${(results.totalInterest / (parseFloat(loanAmount) + results.totalInterest)) * 100} 100`}
                          strokeDashoffset="0"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(parseFloat(loanAmount) + results.totalInterest)}</div>
                          <div className="text-xs text-gray-600">Total Cost</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                        <span>Principal: {formatCurrency(parseFloat(loanAmount))}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                        <span>Interest: {formatCurrency(results.totalInterest)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Loan Details */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Loan Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loan Amount:</span>
                          <span className="font-semibold">{formatCurrency(parseFloat(loanAmount))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="font-semibold">{interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loan Term:</span>
                          <span className="font-semibold">{loanTerm} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Frequency:</span>
                          <span className="font-semibold capitalize">{paymentFrequency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Extra Payment:</span>
                          <span className="font-semibold">{formatCurrency(parseFloat(extraPayment))}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Payment Analysis</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Principal:</span>
                          <span className="font-semibold">{formatCurrency(parseFloat(loanAmount))}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Interest:</span>
                          <span className="font-semibold">{formatCurrency(results.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Cost:</span>
                          <span className="font-semibold">{formatCurrency(parseFloat(loanAmount) + results.totalInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest to Principal Ratio:</span>
                          <span className="font-semibold">{(results.totalInterest / parseFloat(loanAmount) * 100).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips and Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Loan Tips & Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Money-Saving Tips</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Make extra payments to reduce total interest and loan term</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider bi-weekly payments instead of monthly to make an extra payment each year</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Refinance if interest rates drop significantly</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Avoid extending your loan term when refinancing</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Key Considerations</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Check if your loan has prepayment penalties before making extra payments</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Compare APR, not just interest rates, when shopping for loans</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider the total cost of the loan, not just the monthly payment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Maintain good credit to qualify for better interest rates</span>
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

export default LoanCalculator;