import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, DollarSign, Users, Percent } from 'lucide-react';

const TipCalculator: React.FC = () => {
  const [billAmount, setBillAmount] = useState('50');
  const [tipPercent, setTipPercent] = useState('15');
  const [customTipPercent, setCustomTipPercent] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('1');
  const [roundUp, setRoundUp] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateTip();
  }, [billAmount, tipPercent, customTipPercent, numberOfPeople, roundUp]);

  const calculateTip = () => {
    const bill = parseFloat(billAmount);
    const people = parseInt(numberOfPeople);
    
    // Determine tip percentage (custom or preset)
    let tip = customTipPercent ? parseFloat(customTipPercent) : parseFloat(tipPercent);
    
    if (isNaN(bill) || isNaN(tip) || isNaN(people) || bill < 0 || tip < 0 || people < 1) {
      setResults(null);
      return;
    }

    // Calculate tip amount
    let tipAmount = bill * (tip / 100);
    
    // Calculate total bill
    let totalBill = bill + tipAmount;
    
    // Round up total if selected
    if (roundUp) {
      const roundedTotal = Math.ceil(totalBill);
      tipAmount = roundedTotal - bill;
      totalBill = roundedTotal;
    }
    
    // Calculate per person amounts
    const billPerPerson = bill / people;
    const tipPerPerson = tipAmount / people;
    const totalPerPerson = totalBill / people;
    
    // Calculate effective tip percentage
    const effectiveTipPercent = (tipAmount / bill) * 100;

    setResults({
      bill,
      tipAmount,
      totalBill,
      billPerPerson,
      tipPerPerson,
      totalPerPerson,
      effectiveTipPercent,
      people
    });
  };

  const handleTipSelection = (percent: string) => {
    setTipPercent(percent);
    setCustomTipPercent('');
  };

  const handleCustomTipChange = (value: string) => {
    setCustomTipPercent(value);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
         <Link to="/financial" className="hover:text-blue-600 transition-colors">Financial Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Tip Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <DollarSign className="w-8 h-8 text-green-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Tip Calculator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <div className="space-y-6">
              {/* Bill Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bill Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={billAmount}
                    onChange={(e) => setBillAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              {/* Tip Percentage */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tip Percentage</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {['10', '15', '18', '20', '25', '30'].map((percent) => (
                    <button
                      key={percent}
                      onClick={() => handleTipSelection(percent)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        tipPercent === percent && !customTipPercent
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {percent}%
                    </button>
                  ))}
                </div>
                
                <div className="relative">
                  <input
                    type="number"
                    value={customTipPercent}
                    onChange={(e) => handleCustomTipChange(e.target.value)}
                    placeholder="Custom tip percentage"
                    min="0"
                    step="0.1"
                    className={`w-full pl-4 pr-8 py-3 border ${
                      customTipPercent ? 'border-green-300 ring-2 ring-green-500' : 'border-gray-300'
                    } rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>

              {/* Number of People */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of People</label>
                <div className="flex">
                  <button
                    onClick={() => setNumberOfPeople(Math.max(1, parseInt(numberOfPeople) - 1).toString())}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-l-lg"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(e.target.value)}
                    min="1"
                    className="flex-1 px-4 py-3 border-y border-gray-300 text-center focus:ring-2 focus:ring-green-500 focus:border-transparent text-lg"
                  />
                  <button
                    onClick={() => setNumberOfPeople((parseInt(numberOfPeople) + 1).toString())}
                    className="px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Round Up Option */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="roundUp"
                  checked={roundUp}
                  onChange={(e) => setRoundUp(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="roundUp" className="ml-2 text-sm text-gray-700">
                  Round up total to nearest dollar
                </label>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            {results && (
              <div className="space-y-8">
                {/* Main Results */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Tip Amount</div>
                      <div className="text-3xl font-bold text-green-600">{formatCurrency(results.tipAmount)}</div>
                      {results.people > 1 && (
                        <div className="text-sm text-gray-500 mt-1">{formatCurrency(results.tipPerPerson)} per person</div>
                      )}
                    </div>
                    
                    <div className="text-center p-4 bg-white rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">Total</div>
                      <div className="text-3xl font-bold text-blue-600">{formatCurrency(results.totalBill)}</div>
                      {results.people > 1 && (
                        <div className="text-sm text-gray-500 mt-1">{formatCurrency(results.totalPerPerson)} per person</div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Bill Amount:</span>
                      <span className="font-semibold">{formatCurrency(results.bill)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip Percentage:</span>
                      <span className="font-semibold">{results.effectiveTipPercent.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip Amount:</span>
                      <span className="font-semibold">{formatCurrency(results.tipAmount)}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-gray-600 font-semibold">Total Bill:</span>
                      <span className="font-semibold">{formatCurrency(results.totalBill)}</span>
                    </div>
                  </div>
                </div>

                {/* Per Person Breakdown */}
                {results.people > 1 && (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <h3 className="text-lg font-semibold text-gray-900">Per Person Breakdown</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bill per person:</span>
                        <span className="font-semibold">{formatCurrency(results.billPerPerson)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tip per person:</span>
                        <span className="font-semibold">{formatCurrency(results.tipPerPerson)}</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-gray-600 font-semibold">Total per person:</span>
                        <span className="font-semibold">{formatCurrency(results.totalPerPerson)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tipping Guide */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Percent className="w-5 h-5 text-gray-600 mr-2" />
                    <h3 className="text-lg font-semibold text-gray-900">Tipping Guide</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-gray-800">15% - Standard Service</div>
                      <div className="text-gray-600">For adequate service</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-gray-800">18% - Good Service</div>
                      <div className="text-gray-600">For attentive service</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-gray-800">20% - Great Service</div>
                      <div className="text-gray-600">For excellent service</div>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <div className="font-medium text-gray-800">25%+ - Exceptional</div>
                      <div className="text-gray-600">For outstanding service</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipCalculator;