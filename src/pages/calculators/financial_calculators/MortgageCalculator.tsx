import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, DollarSign, TrendingUp, PieChart, BarChart3, Calculator, Info } from 'lucide-react';

interface PaymentBreakdown {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
  totalInterest: number;
}

// Utility functions moved outside component
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
  }).format(amount);
};

// Chart components moved outside main component
const PieChartComponent: React.FC<{ data: { label: string; value: number; color: string }[] }> = ({ data }) => {
  if (!data || !Array.isArray(data)) {
    return null;
  }
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativePercentage = 0;

  return (
    <div className="relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -cumulativePercentage;
          cumulativePercentage += percentage;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r="15.915"
              fill="transparent"
              stroke={item.color}
              strokeWidth="31.83"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-300"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{formatCurrency(total)}</div>
          <div className="text-xs text-gray-600">Total</div>
        </div>
      </div>
    </div>
  );
};

const AmortizationChart: React.FC<{ amortizationSchedule: PaymentBreakdown[] }> = ({ amortizationSchedule }) => {
  if (!amortizationSchedule.length) return null;

  const years = Math.ceil(amortizationSchedule.length / 12);
  const yearlyData = [];

  for (let year = 1; year <= years; year++) {
    const startMonth = (year - 1) * 12;
    const endMonth = Math.min(year * 12, amortizationSchedule.length);
    const yearPayments = amortizationSchedule.slice(startMonth, endMonth);
    
    const totalPrincipal = yearPayments.reduce((sum, payment) => sum + payment.principal, 0);
    const totalInterest = yearPayments.reduce((sum, payment) => sum + payment.interest, 0);
    
    yearlyData.push({
      year,
      principal: totalPrincipal,
      interest: totalInterest,
      balance: yearPayments[yearPayments.length - 1]?.balance || 0
    });
  }

  const maxAmount = Math.max(...yearlyData.map(d => d.principal + d.interest));

  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">Annual Principal vs Interest</h4>
      <div className="flex items-end justify-between h-48 space-x-1">
        {yearlyData.map((data, index) => {
          const totalHeight = 192; // h-48 in pixels
          const principalHeight = (data.principal / maxAmount) * totalHeight;
          const interestHeight = (data.interest / maxAmount) * totalHeight;

          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div className="flex flex-col justify-end h-48 w-full max-w-8">
                <div 
                  className="bg-blue-500 rounded-t"
                  style={{ height: `${principalHeight}px` }}
                  title={`Principal: ${formatCurrency(data.principal)}`}
                />
                <div 
                  className="bg-red-400"
                  style={{ height: `${interestHeight}px` }}
                  title={`Interest: ${formatCurrency(data.interest)}`}
                />
              </div>
              <div className="text-xs text-gray-600 mt-1">{data.year}</div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-center space-x-4 mt-4 text-xs">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
          <span>Principal</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-400 rounded mr-1"></div>
          <span>Interest</span>
        </div>
      </div>
    </div>
  );
};

const BalanceChart: React.FC<{ amortizationSchedule: PaymentBreakdown[]; loanAmount: string }> = ({ amortizationSchedule, loanAmount }) => {
  if (!amortizationSchedule.length) return null;

  const yearlyBalances = [];
  const totalYears = Math.ceil(amortizationSchedule.length / 12);
  
  for (let year = 0; year <= totalYears; year++) {
    const monthIndex = year * 12 - 1;
    if (year === 0) {
      yearlyBalances.push({ year: 0, balance: parseFloat(loanAmount) });
    } else if (monthIndex < amortizationSchedule.length) {
      yearlyBalances.push({ 
        year, 
        balance: amortizationSchedule[monthIndex].balance 
      });
    }
  }

  const maxBalance = parseFloat(loanAmount);

  return (
    <div className="w-full h-64 bg-gray-50 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-900 mb-4">Loan Balance Over Time</h4>
      <div className="relative h-48">
        <svg viewBox="0 0 400 200" className="w-full h-full">
          <defs>
            <linearGradient id="balanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map(percent => (
            <line
              key={percent}
              x1="0"
              y1={200 - (percent * 2)}
              x2="400"
              y2={200 - (percent * 2)}
              stroke="#E5E7EB"
              strokeWidth="1"
            />
          ))}
          
          {/* Balance line */}
          <polyline
            fill="url(#balanceGradient)"
            stroke="#3B82F6"
            strokeWidth="2"
            points={yearlyBalances.map((point, index) => {
              const x = (index / (yearlyBalances.length - 1)) * 400;
              const y = 200 - ((point.balance / maxBalance) * 200);
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Close the area */}
          <polyline
            fill="url(#balanceGradient)"
            stroke="none"
            points={[
              ...yearlyBalances.map((point, index) => {
                const x = (index / (yearlyBalances.length - 1)) * 400;
                const y = 200 - ((point.balance / maxBalance) * 200);
                return `${x},${y}`;
              }),
              `400,200`,
              `0,200`
            ].join(' ')}
          />
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 -ml-12">
          <span>{formatCurrency(maxBalance)}</span>
          <span>{formatCurrency(maxBalance * 0.75)}</span>
          <span>{formatCurrency(maxBalance * 0.5)}</span>
          <span>{formatCurrency(maxBalance * 0.25)}</span>
          <span>$0</span>
        </div>
      </div>
      
      {/* X-axis labels */}
      <div className="flex justify-between text-xs text-gray-600 mt-2">
        <span>0</span>
        <span>{Math.floor(totalYears / 4)} yrs</span>
        <span>{Math.floor(totalYears / 2)} yrs</span>
        <span>{Math.floor(3 * totalYears / 4)} yrs</span>
        <span>{totalYears} yrs</span>
      </div>
    </div>
  );
};

const MortgageCalculator: React.FC = () => {
  const [homePrice, setHomePrice] = useState('400000');
  const [downPayment, setDownPayment] = useState('80000');
  const [downPaymentPercent, setDownPaymentPercent] = useState('20');
  const [loanAmount, setLoanAmount] = useState('320000');
  const [interestRate, setInterestRate] = useState('6.5');
  const [loanTerm, setLoanTerm] = useState('30');
  const [propertyTax, setPropertyTax] = useState('4800');
  const [homeInsurance, setHomeInsurance] = useState('1200');
  const [pmi, setPmi] = useState('200');
  const [hoaFees, setHoaFees] = useState('0');
  
  const [results, setResults] = useState<any>(null);
  const [amortizationSchedule, setAmortizationSchedule] = useState<PaymentBreakdown[]>([]);
  const [showFullSchedule, setShowFullSchedule] = useState(false);

  useEffect(() => {
    calculateMortgage();
  }, [homePrice, downPayment, downPaymentPercent, loanAmount, interestRate, loanTerm, propertyTax, homeInsurance, pmi, hoaFees]);

  const updateDownPayment = (value: string, isPercent: boolean) => {
    const price = parseFloat(homePrice) || 0;
    if (isPercent) {
      setDownPaymentPercent(value);
      const dpAmount = (price * parseFloat(value)) / 100;
      setDownPayment(dpAmount.toString());
      setLoanAmount((price - dpAmount).toString());
    } else {
      setDownPayment(value);
      const dpPercent = price > 0 ? ((parseFloat(value) / price) * 100).toFixed(1) : '0';
      setDownPaymentPercent(dpPercent);
      setLoanAmount((price - parseFloat(value)).toString());
    }
  };

  const calculateMortgage = () => {
    const principal = parseFloat(loanAmount) || 0;
    const monthlyRate = (parseFloat(interestRate) || 0) / 100 / 12;
    const numberOfPayments = (parseFloat(loanTerm) || 0) * 12;
    const monthlyPropertyTax = (parseFloat(propertyTax) || 0) / 12;
    const monthlyInsurance = (parseFloat(homeInsurance) || 0) / 12;
    const monthlyPMI = parseFloat(downPaymentPercent) < 20 ? (parseFloat(pmi) || 0) : 0;
    const monthlyHOA = (parseFloat(hoaFees) || 0) / 12;

    if (principal <= 0 || monthlyRate <= 0 || numberOfPayments <= 0) {
      setResults(null);
      setAmortizationSchedule([]);
      return;
    }

    // Calculate monthly principal and interest payment
    const monthlyPI = principal * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    const totalMonthlyPayment = monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyPMI + monthlyHOA;
    const totalPayments = monthlyPI * numberOfPayments;
    const totalInterest = totalPayments - principal;
    const totalCost = parseFloat(homePrice) + totalInterest;

    // Generate amortization schedule
    const schedule: PaymentBreakdown[] = [];
    let remainingBalance = principal;
    let cumulativeInterest = 0;

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = monthlyPI - interestPayment;
      remainingBalance -= principalPayment;
      cumulativeInterest += interestPayment;

      schedule.push({
        month,
        payment: monthlyPI,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, remainingBalance),
        totalInterest: cumulativeInterest
      });
    }

    setResults({
      monthlyPI: monthlyPI,
      monthlyPropertyTax,
      monthlyInsurance,
      monthlyPMI,
      monthlyHOA,
      totalMonthlyPayment,
      totalInterest,
      totalPayments,
      totalCost,
      loanToValue: ((principal / parseFloat(homePrice)) * 100).toFixed(1),
      payoffDate: new Date(Date.now() + numberOfPayments * 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
      effectiveRate: ((totalInterest / principal) * 100).toFixed(2)
    });

    setAmortizationSchedule(schedule);
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/financial" className="hover:text-blue-600 transition-colors">Financial Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Mortgage Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Mortgage Calculator</h1>
            </div>

            <div className="space-y-6">
              {/* Home Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Home Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={homePrice}
                    onChange={(e) => {
                      setHomePrice(e.target.value);
                      const price = parseFloat(e.target.value) || 0;
                      const dpAmount = (price * parseFloat(downPaymentPercent)) / 100;
                      setDownPayment(dpAmount.toString());
                      setLoanAmount((price - dpAmount).toString());
                    }}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Down Payment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Down Payment</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => updateDownPayment(e.target.value, false)}
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => updateDownPayment(e.target.value, true)}
                      className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                  </div>
                </div>
              </div>

              {/* Loan Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50"
                    readOnly
                  />
                </div>
              </div>

              {/* Interest Rate */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    className="w-full pl-4 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Loan Term */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Term</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>

              {/* Additional Costs */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Monthly Costs</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Property Tax (Annual)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={propertyTax}
                        onChange={(e) => setPropertyTax(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Home Insurance (Annual)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={homeInsurance}
                        onChange={(e) => setHomeInsurance(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {parseFloat(downPaymentPercent) < 20 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">PMI (Monthly)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          value={pmi}
                          onChange={(e) => setPmi(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HOA Fees (Annual)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={hoaFees}
                        onChange={(e) => setHoaFees(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-8">
          {results && (
            <>
              {/* Monthly Payment Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <Calculator className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Monthly Payment Breakdown</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {formatCurrency(results.totalMonthlyPayment)}
                      </div>
                      <div className="text-gray-600">Total Monthly Payment</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Principal & Interest</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(results.monthlyPI)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Property Tax</span>
                        <span className="font-semibold">{formatCurrency(results.monthlyPropertyTax)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Home Insurance</span>
                        <span className="font-semibold">{formatCurrency(results.monthlyInsurance)}</span>
                      </div>
                      {results.monthlyPMI > 0 && (
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="text-gray-700">PMI</span>
                          <span className="font-semibold text-yellow-600">{formatCurrency(results.monthlyPMI)}</span>
                        </div>
                      )}
                      {results.monthlyHOA > 0 && (
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-gray-700">HOA Fees</span>
                          <span className="font-semibold">{formatCurrency(results.monthlyHOA)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Payment Composition</h3>
                    <PieChartComponent data={[
                      { label: 'Principal & Interest', value: results.monthlyPI, color: '#3B82F6' },
                      { label: 'Property Tax', value: results.monthlyPropertyTax, color: '#10B981' },
                      { label: 'Insurance', value: results.monthlyInsurance, color: '#F59E0B' },
                      ...(results.monthlyPMI > 0 ? [{ label: 'PMI', value: results.monthlyPMI, color: '#EF4444' }] : []),
                      ...(results.monthlyHOA > 0 ? [{ label: 'HOA', value: results.monthlyHOA, color: '#8B5CF6' }] : []),
                    ]} />
                    
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                        <span>Principal & Interest</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                        <span>Property Tax</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                        <span>Insurance</span>
                      </div>
                      {results.monthlyPMI > 0 && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                          <span>PMI</span>
                        </div>
                      )}
                      {results.monthlyHOA > 0 && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                          <span>HOA</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <TrendingUp className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Loan Summary</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {formatCurrency(results.totalInterest)}
                    </div>
                    <div className="text-sm text-gray-600">Total Interest</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {formatCurrency(results.totalPayments)}
                    </div>
                    <div className="text-sm text-gray-600">Total Payments</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600 mb-1">
                      {results.loanToValue}%
                    </div>
                    <div className="text-sm text-gray-600">Loan-to-Value</div>
                  </div>
                  
                  <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl">
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      {results.payoffDate}
                    </div>
                    <div className="text-sm text-gray-600">Payoff Date</div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Details</h3>
                    <div className="space-y-3">
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
                        <span className="text-gray-600">Total Payments:</span>
                        <span className="font-semibold">{parseFloat(loanTerm) * 12}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Analysis</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Home Price:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(homePrice))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Down Payment:</span>
                        <span className="font-semibold">{formatCurrency(parseFloat(downPayment))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Interest:</span>
                        <span className="font-semibold text-red-600">{formatCurrency(results.totalInterest)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600 font-semibold">Total Cost:</span>
                        <span className="font-bold">{formatCurrency(results.totalCost)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts - Updated to display in two rows */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <BarChart3 className="w-6 h-6 text-indigo-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Payment Analysis</h2>
                </div>

                <div className="space-y-8">
                  <AmortizationChart amortizationSchedule={amortizationSchedule} />
                  <BalanceChart amortizationSchedule={amortizationSchedule} loanAmount={loanAmount} />
                </div>
              </div>

              {/* Amortization Schedule */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <PieChart className="w-6 h-6 text-green-600 mr-3" />
                    <h2 className="text-2xl font-bold text-gray-900">Amortization Schedule</h2>
                  </div>
                  <button
                    onClick={() => setShowFullSchedule(!showFullSchedule)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {showFullSchedule ? 'Show Summary' : 'Show Full Schedule'}
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-semibold">Payment #</th>
                        <th className="text-left p-3 font-semibold">Payment</th>
                        <th className="text-left p-3 font-semibold">Principal</th>
                        <th className="text-left p-3 font-semibold">Interest</th>
                        <th className="text-left p-3 font-semibold">Balance</th>
                        <th className="text-left p-3 font-semibold">Total Interest</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(showFullSchedule ? amortizationSchedule : amortizationSchedule.filter((_, index) => index % 12 === 0 || index === amortizationSchedule.length - 1))
                        .map((payment, index) => (
                        <tr key={payment.month} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="p-3">{payment.month}</td>
                          <td className="p-3 font-mono">{formatCurrencyDetailed(payment.payment)}</td>
                          <td className="p-3 font-mono text-blue-600">{formatCurrencyDetailed(payment.principal)}</td>
                          <td className="p-3 font-mono text-red-600">{formatCurrencyDetailed(payment.interest)}</td>
                          <td className="p-3 font-mono">{formatCurrencyDetailed(payment.balance)}</td>
                          <td className="p-3 font-mono text-gray-600">{formatCurrencyDetailed(payment.totalInterest)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tips and Information */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <Info className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Mortgage Tips & Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Money-Saving Tips</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Make extra principal payments to reduce total interest</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider bi-weekly payments to pay off loan faster</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Shop around for the best interest rates</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Improve credit score before applying</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Key Considerations</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>PMI is required if down payment is less than 20%</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Property taxes vary by location and property value</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Home insurance protects your investment</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Factor in maintenance and repair costs</span>
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

export default MortgageCalculator;