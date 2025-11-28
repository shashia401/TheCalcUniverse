import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, FileText, DollarSign, Calendar, Percent } from 'lucide-react';

interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const AmortizationCalculator: React.FC = () => {
  const [loanAmount, setLoanAmount] = useState('200000');
  const [interestRate, setInterestRate] = useState('4.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [results, setResults] = useState<any>(null);
  const [schedule, setSchedule] = useState<AmortizationRow[]>([]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  useEffect(() => {
    calculateAmortization();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm) * 12;

    if (isNaN(principal) || isNaN(rate) || isNaN(months) || principal <= 0 || months <= 0) {
      setResults(null);
      setSchedule([]);
      return;
    }

    const monthlyPayment = principal * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - principal;

    let balance = principal;
    const scheduleData: AmortizationRow[] = [];

    for (let month = 1; month <= months; month++) {
      const interestPayment = balance * rate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      scheduleData.push({
        month,
        payment: monthlyPayment,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance),
      });
    }

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: principal.toFixed(2),
    });
    setSchedule(scheduleData);
  };

  const displaySchedule = showFullSchedule ? schedule : schedule.slice(0, 12);

  return (
    <div className="max-w-6xl mx-auto">
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
        <span className="text-gray-900 font-medium">Amortization Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Amortization Calculator</h1>
            <p className="text-gray-600">Calculate loan amortization schedule</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="200000"
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
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="4.5"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term (Years)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Monthly Payment</div>
                  <div className="text-3xl font-bold text-blue-600">
                    ${parseFloat(results.monthlyPayment).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Principal</div>
                  <div className="text-xl font-bold text-gray-900">
                    ${parseFloat(results.principal).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Interest</div>
                  <div className="text-xl font-bold text-orange-600">
                    ${parseFloat(results.totalInterest).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Payment</div>
                  <div className="text-xl font-bold text-green-600">
                    ${parseFloat(results.totalPayment).toLocaleString()}
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

        {schedule.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Amortization Schedule</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Month</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Payment</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Principal</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Interest</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 border-b">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {displaySchedule.map((row) => (
                    <tr key={row.month} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-900 border-b">{row.month}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 border-b">${row.payment.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-blue-600 border-b">${row.principal.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-orange-600 border-b">${row.interest.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm text-right text-gray-900 border-b">${row.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {schedule.length > 12 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowFullSchedule(!showFullSchedule)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {showFullSchedule ? 'Show Less' : `Show All ${schedule.length} Months`}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Amortization</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            Amortization is the process of paying off a loan through regular payments over time. Each payment covers both interest and principal.
          </p>
          <p>
            <strong>Key points:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Early payments are mostly interest, later payments are mostly principal</li>
            <li>The amortization schedule shows exactly how your loan will be paid off</li>
            <li>Making extra principal payments can significantly reduce total interest</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AmortizationCalculator;
