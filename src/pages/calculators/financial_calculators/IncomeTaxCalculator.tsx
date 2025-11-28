import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Calculator, DollarSign, FileText } from 'lucide-react';

const IncomeTaxCalculator: React.FC = () => {
  const [income, setIncome] = useState('75000');
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head'>('single');
  const [deductions, setDeductions] = useState('12950');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateTax();
  }, [income, filingStatus, deductions]);

  const calculateTax = () => {
    const grossIncome = parseFloat(income);
    const deduction = parseFloat(deductions);

    if (isNaN(grossIncome) || isNaN(deduction) || grossIncome < 0) {
      setResults(null);
      return;
    }

    const taxableIncome = Math.max(0, grossIncome - deduction);
    let tax = 0;

    const brackets = {
      single: [
        { limit: 11000, rate: 0.10 },
        { limit: 44725, rate: 0.12 },
        { limit: 95375, rate: 0.22 },
        { limit: 182100, rate: 0.24 },
        { limit: 231250, rate: 0.32 },
        { limit: 578125, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ],
      married: [
        { limit: 22000, rate: 0.10 },
        { limit: 89075, rate: 0.12 },
        { limit: 190750, rate: 0.22 },
        { limit: 364200, rate: 0.24 },
        { limit: 462500, rate: 0.32 },
        { limit: 693750, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ],
      head: [
        { limit: 15700, rate: 0.10 },
        { limit: 59850, rate: 0.12 },
        { limit: 95350, rate: 0.22 },
        { limit: 182100, rate: 0.24 },
        { limit: 231250, rate: 0.32 },
        { limit: 578100, rate: 0.35 },
        { limit: Infinity, rate: 0.37 },
      ],
    };

    const applicableBrackets = brackets[filingStatus];
    let previousLimit = 0;

    for (const bracket of applicableBrackets) {
      if (taxableIncome > previousLimit) {
        const taxableAtThisRate = Math.min(taxableIncome - previousLimit, bracket.limit - previousLimit);
        tax += taxableAtThisRate * bracket.rate;
        previousLimit = bracket.limit;
      } else {
        break;
      }
    }

    const effectiveRate = (tax / grossIncome) * 100;
    const afterTaxIncome = grossIncome - tax;

    setResults({
      taxableIncome: taxableIncome.toFixed(2),
      totalTax: tax.toFixed(2),
      effectiveRate: effectiveRate.toFixed(2),
      afterTaxIncome: afterTaxIncome.toFixed(2),
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
        <span className="text-gray-900 font-medium">Income Tax Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-blue-100 rounded-xl mr-4">
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Income Tax Calculator</h1>
            <p className="text-gray-600">Calculate federal income tax (2024 rates)</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Annual Income ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="75000"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filing Status
              </label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as any)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="single">Single</option>
                <option value="married">Married Filing Jointly</option>
                <option value="head">Head of Household</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Deductions ($)
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={deductions}
                  onChange={(e) => setDeductions(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="12950"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Standard deduction for single filers in 2024: $12,950
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Summary</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Taxable Income</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${parseFloat(results.taxableIncome).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Total Tax</div>
                  <div className="text-2xl font-bold text-red-600">
                    ${parseFloat(results.totalTax).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Effective Tax Rate</div>
                  <div className="text-xl font-bold text-orange-600">
                    {results.effectiveRate}%
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">After-Tax Income</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${parseFloat(results.afterTaxIncome).toLocaleString()}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Income Tax</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            This calculator uses 2024 federal income tax brackets. The US has a progressive tax system where higher income is taxed at higher rates.
          </p>
          <p className="text-sm text-gray-600">
            Note: This calculator provides an estimate only. Actual taxes may vary based on additional factors like state taxes, credits, and other deductions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default IncomeTaxCalculator;
