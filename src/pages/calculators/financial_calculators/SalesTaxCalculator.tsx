import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ShoppingCart, DollarSign, Percent } from 'lucide-react';

const SalesTaxCalculator: React.FC = () => {
  const [priceBeforeTax, setPriceBeforeTax] = useState('100');
  const [taxRate, setTaxRate] = useState('8.5');
  const [mode, setMode] = useState<'add' | 'remove'>('add');
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    calculateSalesTax();
  }, [priceBeforeTax, taxRate, mode]);

  const calculateSalesTax = () => {
    const price = parseFloat(priceBeforeTax);
    const rate = parseFloat(taxRate) / 100;

    if (isNaN(price) || isNaN(rate) || price < 0 || rate < 0) {
      setResults(null);
      return;
    }

    if (mode === 'add') {
      const taxAmount = price * rate;
      const finalPrice = price + taxAmount;

      setResults({
        priceBeforeTax: price.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        finalPrice: finalPrice.toFixed(2),
      });
    } else {
      const priceBeforeTaxCalc = price / (1 + rate);
      const taxAmount = price - priceBeforeTaxCalc;

      setResults({
        priceBeforeTax: priceBeforeTaxCalc.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        finalPrice: price.toFixed(2),
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
        <span className="text-gray-900 font-medium">Sales Tax Calculator</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center mb-6">
          <div className="p-3 bg-green-100 rounded-xl mr-4">
            <ShoppingCart className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sales Tax Calculator</h1>
            <p className="text-gray-600">Calculate sales tax and final price</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Mode
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setMode('add')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    mode === 'add'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Add Tax
                </button>
                <button
                  onClick={() => setMode('remove')}
                  className={`py-3 px-4 rounded-lg font-medium transition-all ${
                    mode === 'remove'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Remove Tax
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {mode === 'add' ? 'Price Before Tax ($)' : 'Price With Tax ($)'}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={priceBeforeTax}
                  onChange={(e) => setPriceBeforeTax(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="100"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sales Tax Rate (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="number"
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="8.5"
                  step="0.1"
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tax Breakdown</h3>
            {results ? (
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Price Before Tax</div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${parseFloat(results.priceBeforeTax).toLocaleString()}
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Sales Tax Amount</div>
                  <div className="text-2xl font-bold text-orange-600">
                    ${parseFloat(results.taxAmount).toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    at {taxRate}%
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-sm text-gray-600 mb-1">Final Price</div>
                  <div className="text-3xl font-bold text-green-600">
                    ${parseFloat(results.finalPrice).toLocaleString()}
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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">About Sales Tax</h2>
        <div className="prose prose-blue max-w-none text-gray-700 space-y-3">
          <p>
            Sales tax is a consumption tax imposed by the government on the sale of goods and services.
          </p>
          <p>
            <strong>Common US Sales Tax Rates:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>California: 7.25% - 10.75%</li>
            <li>Texas: 6.25% - 8.25%</li>
            <li>Florida: 6% - 8%</li>
            <li>New York: 4% - 8.875%</li>
          </ul>
          <p className="text-sm">
            Note: Rates vary by state, county, and city. Check your local rate for accuracy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SalesTaxCalculator;
