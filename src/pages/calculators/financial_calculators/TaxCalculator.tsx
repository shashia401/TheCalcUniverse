import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, DollarSign } from 'lucide-react';

const TaxCalculator: React.FC = () => {
  const [income, setIncome] = useState('50000');
  const [filingStatus, setFilingStatus] = useState<'single' | 'married' | 'head'>('single');
  const [state, setState] = useState<string>('');
  const [deductions, setDeductions] = useState('standard');
  const [itemizedDeductions, setItemizedDeductions] = useState('0');
  const [dependents, setDependents] = useState('0');
  const [retirement401k, setRetirement401k] = useState('0');
  const [traditionalIRA, setTraditionalIRA] = useState('0');
  const [hsa, setHsa] = useState('0');
  const [results, setResults] = useState<any>(null);

  // 2024 tax brackets (simplified for demonstration)
  const taxBrackets = {
    single: [
      { rate: 0.10, min: 0, max: 11600 },
      { rate: 0.12, min: 11600, max: 47150 },
      { rate: 0.22, min: 47150, max: 100525 },
      { rate: 0.24, min: 100525, max: 191950 },
      { rate: 0.32, min: 191950, max: 243725 },
      { rate: 0.35, min: 243725, max: 609350 },
      { rate: 0.37, min: 609350, max: Infinity }
    ],
    married: [
      { rate: 0.10, min: 0, max: 23200 },
      { rate: 0.12, min: 23200, max: 94300 },
      { rate: 0.22, min: 94300, max: 201050 },
      { rate: 0.24, min: 201050, max: 383900 },
      { rate: 0.32, min: 383900, max: 487450 },
      { rate: 0.35, min: 487450, max: 731200 },
      { rate: 0.37, min: 731200, max: Infinity }
    ],
    head: [
      { rate: 0.10, min: 0, max: 16550 },
      { rate: 0.12, min: 16550, max: 63100 },
      { rate: 0.22, min: 63100, max: 100500 },
      { rate: 0.24, min: 100500, max: 191950 },
      { rate: 0.32, min: 191950, max: 243700 },
      { rate: 0.35, min: 243700, max: 609350 },
      { rate: 0.37, min: 609350, max: Infinity }
    ]
  };

  // State tax rates (simplified for demonstration)
  const stateTaxRates: { [key: string]: number } = {
    'alabama': 0.05,
    'alaska': 0.00,
    'arizona': 0.0459,
    'arkansas': 0.055,
    'california': 0.0930,
    'colorado': 0.0455,
    'connecticut': 0.0699,
    'delaware': 0.066,
    'florida': 0.00,
    'georgia': 0.0575,
    'hawaii': 0.11,
    'idaho': 0.06,
    'illinois': 0.0495,
    'indiana': 0.0323,
    'iowa': 0.0575,
    'kansas': 0.057,
    'kentucky': 0.05,
    'louisiana': 0.0425,
    'maine': 0.0715,
    'maryland': 0.0575,
    'massachusetts': 0.05,
    'michigan': 0.0425,
    'minnesota': 0.0985,
    'mississippi': 0.05,
    'missouri': 0.0495,
    'montana': 0.0675,
    'nebraska': 0.0684,
    'nevada': 0.00,
    'new hampshire': 0.05,
    'new jersey': 0.1075,
    'new mexico': 0.059,
    'new york': 0.109,
    'north carolina': 0.0475,
    'north dakota': 0.0290,
    'ohio': 0.0399,
    'oklahoma': 0.0475,
    'oregon': 0.099,
    'pennsylvania': 0.0307,
    'rhode island': 0.0599,
    'south carolina': 0.07,
    'south dakota': 0.00,
    'tennessee': 0.00,
    'texas': 0.00,
    'utah': 0.0495,
    'vermont': 0.0875,
    'virginia': 0.0575,
    'washington': 0.00,
    'west virginia': 0.065,
    'wisconsin': 0.0765,
    'wyoming': 0.00,
    'district of columbia': 0.0995
  };

  useEffect(() => {
    calculateTaxes();
  }, [income, filingStatus, state, deductions, itemizedDeductions, dependents, retirement401k, traditionalIRA, hsa]);

  const calculateTaxes = () => {
    const grossIncome = parseFloat(income);
    const numDependents = parseInt(dependents);
    const retirement401kContribution = parseFloat(retirement401k);
    const iraContribution = parseFloat(traditionalIRA);
    const hsaContribution = parseFloat(hsa);
    const itemizedDeductionAmount = parseFloat(itemizedDeductions);

    if (isNaN(grossIncome) || grossIncome < 0) {
      setResults(null);
      return;
    }

    // Calculate adjustments
    const totalAdjustments = retirement401kContribution + iraContribution + hsaContribution;
    const adjustedGrossIncome = Math.max(0, grossIncome - totalAdjustments);

    // Calculate standard deduction based on filing status
    let standardDeduction = 0;
    switch (filingStatus) {
      case 'single':
        standardDeduction = 14600;
        break;
      case 'married':
        standardDeduction = 29200;
        break;
      case 'head':
        standardDeduction = 21900;
        break;
    }

    // Determine which deduction to use
    const deductionToUse = deductions === 'standard' ? 
      standardDeduction : 
      Math.max(itemizedDeductionAmount, 0);

    // Calculate dependent exemption
    const dependentExemption = numDependents * 2000; // Child tax credit

    // Calculate taxable income
    const taxableIncome = Math.max(0, adjustedGrossIncome - deductionToUse);

    // Calculate federal income tax
    let federalTax = 0;
    const brackets = taxBrackets[filingStatus];
    
    for (let i = 0; i < brackets.length; i++) {
      const bracket = brackets[i];
      if (taxableIncome > bracket.min) {
        const taxableAmountInBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        federalTax += taxableAmountInBracket * bracket.rate;
      }
    }

    // Apply dependent tax credit (simplified)
    federalTax = Math.max(0, federalTax - dependentExemption);

    // Calculate FICA taxes (Social Security and Medicare)
    const socialSecurityTaxRate = 0.062;
    const medicareTaxRate = 0.0145;
    const socialSecurityWageCap = 168600; // 2024 wage base limit
    
    const socialSecurityTax = Math.min(grossIncome, socialSecurityWageCap) * socialSecurityTaxRate;
    const medicareTax = grossIncome * medicareTaxRate;
    const ficaTax = socialSecurityTax + medicareTax;

    // Calculate state tax if applicable
    let stateTax = 0;
    let stateRate = 0;
    if (state && stateTaxRates[state.toLowerCase()] !== undefined) {
      stateRate = stateTaxRates[state.toLowerCase()];
      stateTax = taxableIncome * stateRate;
    }

    // Calculate total tax
    const totalTax = federalTax + ficaTax + stateTax;

    // Calculate after-tax income
    const afterTaxIncome = grossIncome - totalTax;

    // Calculate effective tax rates
    const effectiveFederalRate = federalTax / grossIncome;
    const effectiveFicaRate = ficaTax / grossIncome;
    const effectiveStateRate = stateTax / grossIncome;
    const effectiveTotalRate = totalTax / grossIncome;

    // Calculate marginal tax rate (federal only)
    let marginalRate = 0;
    for (let i = brackets.length - 1; i >= 0; i--) {
      if (taxableIncome >= brackets[i].min) {
        marginalRate = brackets[i].rate;
        break;
      }
    }

    // Calculate tax breakdown
    const taxBreakdown = [
      { name: 'Federal Income Tax', amount: federalTax, rate: effectiveFederalRate },
      { name: 'Social Security', amount: socialSecurityTax, rate: socialSecurityTax / grossIncome },
      { name: 'Medicare', amount: medicareTax, rate: medicareTax / grossIncome },
      { name: 'State Income Tax', amount: stateTax, rate: effectiveStateRate }
    ];

    // Calculate monthly take-home pay
    const monthlyTakeHome = afterTaxIncome / 12;

    setResults({
      grossIncome,
      adjustedGrossIncome,
      taxableIncome,
      federalTax,
      stateTax,
      stateRate,
      ficaTax,
      socialSecurityTax,
      medicareTax,
      totalTax,
      afterTaxIncome,
      effectiveFederalRate,
      effectiveFicaRate,
      effectiveStateRate,
      effectiveTotalRate,
      marginalRate,
      taxBreakdown,
      monthlyTakeHome,
      standardDeduction,
      deductionToUse,
      dependentExemption
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

  const formatPercent = (rate: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(rate);
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
        <span className="text-gray-900 font-medium">Tax Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
            <div className="flex items-center mb-6">
              <DollarSign className="w-6 h-6 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Tax Calculator</h1>
            </div>

            <div className="space-y-6">
              {/* Annual Income */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Gross Income</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    min="0"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filing Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Filing Status</label>
                <select
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value as any)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="single">Single</option>
                  <option value="married">Married Filing Jointly</option>
                  <option value="head">Head of Household</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Select State</option>
                  <option value="alabama">Alabama</option>
                  <option value="alaska">Alaska</option>
                  <option value="arizona">Arizona</option>
                  <option value="arkansas">Arkansas</option>
                  <option value="california">California</option>
                  <option value="colorado">Colorado</option>
                  <option value="connecticut">Connecticut</option>
                  <option value="delaware">Delaware</option>
                  <option value="florida">Florida</option>
                  <option value="georgia">Georgia</option>
                  <option value="hawaii">Hawaii</option>
                  <option value="idaho">Idaho</option>
                  <option value="illinois">Illinois</option>
                  <option value="indiana">Indiana</option>
                  <option value="iowa">Iowa</option>
                  <option value="kansas">Kansas</option>
                  <option value="kentucky">Kentucky</option>
                  <option value="louisiana">Louisiana</option>
                  <option value="maine">Maine</option>
                  <option value="maryland">Maryland</option>
                  <option value="massachusetts">Massachusetts</option>
                  <option value="michigan">Michigan</option>
                  <option value="minnesota">Minnesota</option>
                  <option value="mississippi">Mississippi</option>
                  <option value="missouri">Missouri</option>
                  <option value="montana">Montana</option>
                  <option value="nebraska">Nebraska</option>
                  <option value="nevada">Nevada</option>
                  <option value="new hampshire">New Hampshire</option>
                  <option value="new jersey">New Jersey</option>
                  <option value="new mexico">New Mexico</option>
                  <option value="new york">New York</option>
                  <option value="north carolina">North Carolina</option>
                  <option value="north dakota">North Dakota</option>
                  <option value="ohio">Ohio</option>
                  <option value="oklahoma">Oklahoma</option>
                  <option value="oregon">Oregon</option>
                  <option value="pennsylvania">Pennsylvania</option>
                  <option value="rhode island">Rhode Island</option>
                  <option value="south carolina">South Carolina</option>
                  <option value="south dakota">South Dakota</option>
                  <option value="tennessee">Tennessee</option>
                  <option value="texas">Texas</option>
                  <option value="utah">Utah</option>
                  <option value="vermont">Vermont</option>
                  <option value="virginia">Virginia</option>
                  <option value="washington">Washington</option>
                  <option value="west virginia">West Virginia</option>
                  <option value="wisconsin">Wisconsin</option>
                  <option value="wyoming">Wyoming</option>
                  <option value="district of columbia">District of Columbia</option>
                </select>
              </div>

              {/* Deductions */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deductions</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={deductions === 'standard'}
                      onChange={() => setDeductions('standard')}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Standard</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={deductions === 'itemized'}
                      onChange={() => setDeductions('itemized')}
                      className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Itemized</span>
                  </label>
                </div>
                
                {deductions === 'itemized' && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Itemized Deductions Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={itemizedDeductions}
                        onChange={(e) => setItemizedDeductions(e.target.value)}
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Dependents */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Dependents</label>
                <input
                  type="number"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Pre-tax Contributions */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">Pre-tax Contributions</h3>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">401(k) Contribution</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={retirement401k}
                        onChange={(e) => setRetirement401k(e.target.value)}
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Traditional IRA Contribution</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={traditionalIRA}
                        onChange={(e) => setTraditionalIRA(e.target.value)}
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">HSA Contribution</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={hsa}
                        onChange={(e) => setHsa(e.target.value)}
                        min="0"
                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
              {/* Tax Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-green-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Tax Summary</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="text-center mb-6">
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {formatCurrency(results.afterTaxIncome)}
                      </div>
                      <div className="text-gray-600">Annual Take-Home Pay</div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-gray-700">Monthly Take-Home Pay</span>
                        <span className="font-semibold text-blue-600">{formatCurrency(results.monthlyTakeHome)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Gross Income</span>
                        <span className="font-semibold">{formatCurrency(results.grossIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Adjusted Gross Income</span>
                        <span className="font-semibold">{formatCurrency(results.adjustedGrossIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-700">Taxable Income</span>
                        <span className="font-semibold">{formatCurrency(results.taxableIncome)}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-gray-700">Total Tax</span>
                        <span className="font-semibold text-red-600">{formatCurrency(results.totalTax)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Rates</h3>
                      
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Marginal Tax Rate</span>
                          <span className="font-semibold text-blue-600">{formatPercent(results.marginalRate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Effective Federal Rate</span>
                          <span className="font-semibold text-green-600">{formatPercent(results.effectiveFederalRate)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-700">Effective FICA Rate</span>
                          <span className="font-semibold text-purple-600">{formatPercent(results.effectiveFicaRate)}</span>
                        </div>
                        {state && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-700">Effective State Rate</span>
                            <span className="font-semibold text-orange-600">{formatPercent(results.effectiveStateRate)}</span>
                          </div>
                        )}
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-gray-700 font-semibold">Effective Total Rate</span>
                          <span className="font-semibold text-red-600">{formatPercent(results.effectiveTotalRate)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Tax Breakdown</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Tax Breakdown Chart */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="relative w-48 h-48">
                      <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                        {/* Federal Tax */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#3B82F6"
                          strokeWidth="10"
                          className="transition-all duration-500"
                          strokeDasharray="100 100"
                          strokeDashoffset="0"
                        />
                        {/* FICA Tax */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#8B5CF6"
                          strokeWidth="10"
                          className="transition-all duration-500"
                          strokeDasharray={`${(results.ficaTax / results.totalTax) * 100} 100`}
                          strokeDashoffset="0"
                        />
                        {/* State Tax */}
                        <circle
                          cx="50"
                          cy="50"
                          r="45"
                          fill="transparent"
                          stroke="#F59E0B"
                          strokeWidth="10"
                          className="transition-all duration-500"
                          strokeDasharray={`${(results.stateTax / results.totalTax) * 100} 100`}
                          strokeDashoffset={`${-(results.ficaTax / results.totalTax) * 100}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">{formatCurrency(results.totalTax)}</div>
                          <div className="text-xs text-gray-600">Total Tax</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                        <span>Federal: {formatCurrency(results.federalTax)}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded mr-2"></div>
                        <span>FICA: {formatCurrency(results.ficaTax)}</span>
                      </div>
                      {results.stateTax > 0 && (
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-amber-500 rounded mr-2"></div>
                          <span>State: {formatCurrency(results.stateTax)}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tax Details */}
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Federal Tax Details</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Federal Income Tax:</span>
                          <span className="font-semibold">{formatCurrency(results.federalTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Social Security Tax:</span>
                          <span className="font-semibold">{formatCurrency(results.socialSecurityTax)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Medicare Tax:</span>
                          <span className="font-semibold">{formatCurrency(results.medicareTax)}</span>
                        </div>
                        {results.stateTax > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">State Income Tax:</span>
                            <span className="font-semibold">{formatCurrency(results.stateTax)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900 mb-3">Deductions & Credits</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Standard Deduction:</span>
                          <span className="font-semibold">{formatCurrency(results.standardDeduction)}</span>
                        </div>
                        {deductions === 'itemized' && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Itemized Deductions:</span>
                            <span className="font-semibold">{formatCurrency(parseFloat(itemizedDeductions))}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-600">Deduction Used:</span>
                          <span className="font-semibold">{formatCurrency(results.deductionToUse)}</span>
                        </div>
                        {parseInt(dependents) > 0 && (
                          <div className="flex justify-between">
                            <span className="text-gray-600">Dependent Credits:</span>
                            <span className="font-semibold">{formatCurrency(results.dependentExemption)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tax Bracket Breakdown */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-purple-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Tax Bracket Breakdown</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left p-3 font-semibold">Tax Bracket</th>
                        <th className="text-left p-3 font-semibold">Rate</th>
                        <th className="text-left p-3 font-semibold">Income in Bracket</th>
                        <th className="text-left p-3 font-semibold">Tax in Bracket</th>
                      </tr>
                    </thead>
                    <tbody>
                      {taxBrackets[filingStatus].map((bracket, index) => {
                        const incomeInBracket = Math.max(0, Math.min(results.taxableIncome - bracket.min, bracket.max - bracket.min));
                        const taxInBracket = incomeInBracket * bracket.rate;
                        const isInBracket = results.taxableIncome > bracket.min;
                        
                        return (
                          <tr 
                            key={index} 
                            className={`${isInBracket ? 'bg-green-50' : 'bg-gray-50'} ${results.taxableIncome >= bracket.min && results.taxableIncome < bracket.max ? 'font-semibold' : ''}`}
                          >
                            <td className="p-3">
                              {formatCurrency(bracket.min)} - {bracket.max === Infinity ? '+' : formatCurrency(bracket.max)}
                            </td>
                            <td className="p-3">{formatPercent(bracket.rate)}</td>
                            <td className="p-3">{formatCurrency(incomeInBracket)}</td>
                            <td className="p-3">{formatCurrency(taxInBracket)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Tax Saving Opportunities */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8">
                <div className="flex items-center mb-6">
                  <DollarSign className="w-6 h-6 text-blue-600 mr-3" />
                  <h2 className="text-2xl font-bold text-gray-900">Tax Saving Opportunities</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Retirement Contributions</h3>
                    <ul className="space-y-3 text-blue-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Maximize 401(k) contributions (2024 limit: $23,000)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider traditional IRA contributions (2024 limit: $7,000)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>If over 50, take advantage of catch-up contributions</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-indigo-900 mb-4">Other Tax Strategies</h3>
                    <ul className="space-y-3 text-indigo-800">
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Contribute to an HSA if eligible (2024 limit: $4,150 individual, $8,300 family)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Consider itemizing deductions if they exceed your standard deduction</span>
                      </li>
                      <li className="flex items-start">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span>Look into tax credits you may qualify for (education, child care, etc.)</span>
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

export default TaxCalculator;