import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, DollarSign, RefreshCw, ArrowRight, Copy } from 'lucide-react';

// List of supported currencies
const currencyNames: { [key: string]: string } = {
  'USD': 'US Dollar',
  'EUR': 'Euro',
  'GBP': 'British Pound',
  'JPY': 'Japanese Yen',
  'CAD': 'Canadian Dollar',
  'AUD': 'Australian Dollar',
  'CHF': 'Swiss Franc',
  'CNY': 'Chinese Yuan',
  'INR': 'Indian Rupee',
  'MXN': 'Mexican Peso',
  'BRL': 'Brazilian Real'
};

const currencySymbols: { [key: string]: string } = {
  'USD': '$',
  'EUR': '€',
  'GBP': '£',
  'JPY': '¥',
  'CAD': 'C$',
  'AUD': 'A$',
  'CHF': 'CHF',
  'CNY': '¥',
  'INR': '₹',
  'MXN': '$',
  'BRL': 'R$'
};

const commonPairs = [
  { from: 'USD', to: 'EUR', name: 'USD to EUR' },
  { from: 'EUR', to: 'USD', name: 'EUR to USD' },
  { from: 'USD', to: 'GBP', name: 'USD to GBP' },
  { from: 'USD', to: 'JPY', name: 'USD to JPY' },
  { from: 'USD', to: 'CAD', name: 'USD to CAD' },
  { from: 'EUR', to: 'GBP', name: 'EUR to GBP' },
];

// Helper function to provide information about currencies
const getCurrencyInfo = (currency: string): string => {
  const currencyInfo: { [key: string]: string } = {
    'USD': 'The US Dollar is the official currency of the United States and several other countries. It is the world\'s primary reserve currency.',
    'EUR': 'The Euro is the official currency of 19 of the 27 member states of the European Union. It is the second most traded currency in the world.',
    'GBP': 'The British Pound Sterling is the official currency of the United Kingdom and its territories. It is one of the oldest currencies still in use.',
    'JPY': 'The Japanese Yen is the official currency of Japan. It is the third most traded currency in the foreign exchange market.',
    'CAD': 'The Canadian Dollar is the official currency of Canada. It is a commodity currency, meaning its value is influenced by commodity prices.',
    'AUD': 'The Australian Dollar is the official currency of Australia. It is a popular currency for forex trading due to its high interest rates.',
    'CHF': 'The Swiss Franc is the official currency of Switzerland and Liechtenstein. It is known for its stability and is considered a safe-haven currency.',
    'CNY': 'The Chinese Yuan (Renminbi) is the official currency of China. It is the 8th most traded currency in the world.',
    'INR': 'The Indian Rupee is the official currency of India. It is the 20th most traded currency in the world.',
    'MXN': 'The Mexican Peso is the official currency of Mexico. It is the most traded currency in Latin America.',
    'BRL': 'The Brazilian Real is the official currency of Brazil. It was introduced in 1994 as part of the Plano Real to stabilize the Brazilian economy.'
  };
  return currencyInfo[currency] || 'No additional information available.';
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [conversionRate, setConversionRate] = useState<number | null>(null);
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Fetch live rates from Google Finance (via exchangerate.host, a free and reliable API)
  useEffect(() => {
    const fetchRate = async () => {
      if (fromCurrency === toCurrency) {
        setConversionRate(1);
        setError(null);
        setLastUpdated(new Date().toLocaleString());
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}`
        );
        const data = await res.json();
        if (data && data.rates && data.rates[toCurrency]) {
          setConversionRate(data.rates[toCurrency]);
          setLastUpdated(data.date + ' ' + new Date().toLocaleTimeString());
        } else {
          setError('Could not fetch conversion rate.');
          setConversionRate(null);
        }
      } catch {
        setError('Failed to fetch rates. Please try again later.');
        setConversionRate(null);
      }
      setLoading(false);
    };
    fetchRate();
  }, [fromCurrency, toCurrency]);

  // Calculate converted amount
  useEffect(() => {
    const amountValue = parseFloat(amount);
    if (
      isNaN(amountValue) ||
      amountValue < 0 ||
      conversionRate === null ||
      error
    ) {
      setConvertedAmount(null);
      return;
    }
    setConvertedAmount(amountValue * conversionRate);
  }, [amount, conversionRate, error]);

  // Memoize conversion table for performance
  const conversionTable = useMemo(() => {
    if (conversionRate === null) return [];
    return [1, 5, 10, 25, 50, 100, 500, 1000].map((multiplier) => ({
      from: formatCurrency(multiplier, fromCurrency),
      to: formatCurrency(multiplier * conversionRate, toCurrency),
    }));
  }, [conversionRate, fromCurrency, toCurrency]);

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleCopy = () => {
    if (convertedAmount !== null) {
      navigator.clipboard.writeText(convertedAmount.toFixed(2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
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
        <span className="text-gray-900 font-medium">Currency Converter</span>
      </nav>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center mb-8">
          <DollarSign className="w-8 h-8 text-blue-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Currency Converter</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Converter Section */}
          <div>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Amount Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      {currencySymbols[fromCurrency] || fromCurrency}
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                      aria-label="Amount"
                    />
                  </div>
                </div>

                {/* Currency Selection */}
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                    <select
                      value={fromCurrency}
                      onChange={(e) => setFromCurrency(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="From currency"
                    >
                      {Object.keys(currencyNames).map((currency) => (
                        <option key={`from-${currency}`} value={currency}>
                          {currency} - {currencyNames[currency]}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-center">
                    <button
                      onClick={swapCurrencies}
                      className="p-3 bg-blue-100 hover:bg-blue-200 rounded-full transition-colors"
                      aria-label="Swap currencies"
                      title="Swap currencies"
                      type="button"
                    >
                      <RefreshCw className="w-6 h-6 text-blue-600" />
                    </button>
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      aria-label="To currency"
                    >
                      {Object.keys(currencyNames).map((currency) => (
                        <option key={`to-${currency}`} value={currency}>
                          {currency} - {currencyNames[currency]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Result Section */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">
                {error}
              </div>
            )}
            {loading && (
              <div className="text-blue-600 mb-4">Fetching latest rates...</div>
            )}
            {convertedAmount !== null && !loading && !error && (
              <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-lg font-medium text-gray-700">
                    {formatCurrency(parseFloat(amount), fromCurrency)}
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                  <div className="text-2xl font-bold text-blue-600">
                    {formatCurrency(convertedAmount, toCurrency)}
                  </div>
                  <button
                    aria-label="Copy converted amount"
                    className="ml-2 p-2 bg-gray-100 rounded hover:bg-gray-200"
                    onClick={handleCopy}
                    type="button"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  {copied && (
                    <span className="ml-2 text-green-600 text-xs">Copied!</span>
                  )}
                </div>
                <div className="text-sm text-gray-600">
                  1 {fromCurrency} = {conversionRate?.toFixed(4)} {toCurrency}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Last updated: {lastUpdated}
                </div>
              </div>
            )}

            {/* Common Currency Pairs */}
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Common Currency Pairs</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {commonPairs.map((pair, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setFromCurrency(pair.from);
                      setToCurrency(pair.to);
                    }}
                    className="p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm transition-colors"
                    type="button"
                  >
                    {pair.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Information Section */}
          <div className="space-y-6">
            {/* Conversion Table */}
            {convertedAmount !== null && !loading && !error && (
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversion Table</h3>
                <div className="space-y-2">
                  {conversionTable.map((row, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-gray-100">
                      <span>{row.from}</span>
                      <span>{row.to}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Currency Information */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Currency Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{fromCurrency} - {currencyNames[fromCurrency]}</h4>
                  <div className="text-sm text-gray-600">
                    {getCurrencyInfo(fromCurrency)}
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{toCurrency} - {currencyNames[toCurrency]}</h4>
                  <div className="text-sm text-gray-600">
                    {getCurrencyInfo(toCurrency)}
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 rounded-lg p-4 text-sm text-yellow-800">
              <p className="font-medium mb-1">Disclaimer</p>
              <p>Exchange rates are provided by exchangerate.host and may not reflect current market rates. For actual transactions, please check with financial institutions or official currency exchange services.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CurrencyConverter;