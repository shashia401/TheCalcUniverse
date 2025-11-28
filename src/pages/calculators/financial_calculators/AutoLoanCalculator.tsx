import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Car, DollarSign, Calendar, Percent } from 'lucide-react';

const AutoLoanCalculator: React.FC = () => {
  const [vehiclePrice, setVehiclePrice] = useState('30000');
  const [downPayment, setDownPayment] = useState('5000');
  const [interestRate, setInterestRate] = useState('6');
  const [loanTerm, setLoanTerm] = useState('60');
  const [tradeInValue, setTradeInValue] = useState('0');
  const [salesTax, setSalesTax] = useState('7');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateAutoLoan();
  }, [vehiclePrice, downPayment, interestRate, loanTerm, tradeInValue, salesTax]);

  const calculateAutoLoan = () => {
    const price = parseFloat(vehiclePrice);
    const down = parseFloat(downPayment);
    const rate = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(loanTerm);
    const tradeIn = parseFloat(tradeInValue);
    const tax = parseFloat(salesTax) / 100;

    if (isNaN(price) || isNaN(down) || isNaN(rate) || isNaN(months) ||
        isNaN(tradeIn) || isNaN(tax) || price <= 0 || months <= 0) {
      setResults(null);
      return;
    }

    const taxAmount = price * tax;
    const totalPrice = price + taxAmount;
    const loanAmount = totalPrice - down - tradeIn;

    if (loanAmount <= 0) {
      setResults({
        monthlyPayment: '0.00',
        totalLoanAmount: '0.00',
        totalInterest: '0.00',
        totalCost: totalPrice.toFixed(2),
      });
      return;
    }

    const monthlyPayment = loanAmount * (rate * Math.pow(1 + rate, months)) / (Math.pow(1 + rate, months) - 1);
    const totalPayment = monthlyPayment * months;
    const totalInterest = totalPayment - loanAmount;

    setResults({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalLoanAmount: loanAmount.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalCost: (totalPayment + down + tradeIn).toFixed(2),
      taxAmount: taxAmount.toFixed(2),
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
        <span className="text-gray-900 font-medium">Auto Loan Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <Car className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Auto Loan Calculator</h1>
            <p className="text-gray-600">Calculate car loan payments and total cost</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Vehicle Price ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={vehiclePrice}
                  onChange={(e) => setVehiclePrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="30000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Down Payment ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="5000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trade-in Value ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={tradeInValue}
                  onChange={(e) => setTradeInValue(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
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
                  placeholder="6"
                  step="0.1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Term (Months)
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="60"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales Tax (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={salesTax}
                  onChange={(e) => setSalesTax(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="7"
                  step="0.1"
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
                  <div className="text-sm text-gray-600 mb-1">Loan Amount</div>
                  <div className="text-xl font-bold text-gray-900">
                    ${parseFloat(results.totalLoanAmount).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Interest</div>
                  <div className="text-xl font-bold text-orange-600">
                    ${parseFloat(results.totalInterest).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Sales Tax</div>
                  <div className="text-xl font-bold text-gray-700">
                    ${parseFloat(results.taxAmount).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Cost</div>
                  <div className="text-xl font-bold text-green-600">
                    ${parseFloat(results.totalCost).toLocaleString()}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Auto Loan Calculator</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            This calculator helps you estimate your monthly car payment and total cost of an auto loan.
          </p>
          <p>
            <strong>Tips for auto loans:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Larger down payments reduce your monthly payment and total interest</li>
            <li>Shorter loan terms mean higher payments but less total interest</li>
            <li>Consider trade-in value to reduce the loan amount</li>
            <li>Shop around for the best interest rates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AutoLoanCalculator;
