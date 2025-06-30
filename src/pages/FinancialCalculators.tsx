import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Home as HomeIcon, TrendingUp, PiggyBank, Percent, Calculator, Coins, CreditCard, ArrowUpRight, ChevronRight, Target, Zap } from 'lucide-react';

// Financial Calculators Page
const financialCalculators = [
  {
    name: 'Mortgage Calculator',
    path: '/mortgage-calculator',
    description: 'Home loan calculations',
    icon: HomeIcon,
  },
  {
    name: 'Loan Calculator',
    path: '/loan-calculator',
    description: 'Personal loan calculator',
    icon: DollarSign,
  },
  {
    name: 'Investment Calculator',
    path: '/investment-calculator',
    description: 'ROI and compound interest',
    icon: TrendingUp,
  },
  {
    name: 'Compound Interest Calculator',
    path: '/compound-interest-calculator',
    description: 'Calculate compound interest',
    icon: Percent,
  },
  {
    name: 'Retirement Calculator',
    path: '/retirement-calculator',
    description: 'Plan your retirement savings',
    icon: PiggyBank,
  },
  {
    name: 'Tax Calculator',
    path: '/tax-calculator',
    description: 'Estimate your taxes',
    icon: Calculator,
  },
  {
    name: 'Tip Calculator',
    path: '/tip-calculator',
    description: 'Calculate tips easily',
    icon: Coins,
  },
  {
    name: 'Currency Converter',
    path: '/currency-converter',
    description: 'Convert between currencies',
    icon: CreditCard,
  },
];

const Financial: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <HomeIcon className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Financial Calculators</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-2xl mr-4">
            <DollarSign className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Financial Calculators
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Calculate mortgages, loans, investments, and more with our free financial tools.
        </p>
      </div>

      {/* Financial Calculators List */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Popular Financial Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {financialCalculators.map((calc, idx) => (
            <Link
              key={idx}
              to={calc.path}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <calc.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
                  {calc.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {calc.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white mb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-green-100 text-lg">
            Join millions of users who rely on our calculators daily
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">50+</div>
            <div className="text-green-100">Financial Calculators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">10M+</div>
            <div className="text-green-100">Monthly Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">100M+</div>
            <div className="text-green-100">Calculations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">99.9%</div>
            <div className="text-green-100">Accuracy</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Why Use Our Financial Calculators?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Accurate Results</h3>
            <p className="text-gray-600 leading-relaxed">
              Our calculators use precise algorithms to ensure accurate results every time.
            </p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Get instant results with our optimized calculators that work at the speed of thought.
            </p>
          </div>
          <div className="p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Always Free</h3>
            <p className="text-gray-600 leading-relaxed">
              All our calculators are completely free to use with no hidden fees or subscriptions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Financial;