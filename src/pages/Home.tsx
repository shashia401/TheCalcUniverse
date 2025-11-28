import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calculator,
  Activity,
  DollarSign,
  Ruler,
  Calendar,
  GraduationCap,
  Percent,
  TrendingUp,
  Heart,
  Home as HomeIcon,
  Zap,
  Target,
  BarChart3,
  Divide,
  Square,
  Triangle,
  Hash,
  Binary,
  Shuffle
} from 'lucide-react';
import SearchBar from '../components/SearchBar';

const Home: React.FC = () => {
  const calculatorCategories = [
    {
      title: 'Math Calculators',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      link: '/math-calculators',
      calculators: [
        { name: 'Basic Calculator', path: '/basic-calculator', description: 'Simple arithmetic operations', icon: Calculator },
        { name: 'Scientific Calculator', path: '/scientific-calculator', description: 'Advanced mathematical functions', icon: Zap },
        { name: 'Percentage Calculator', path: '/percentage-calculator', description: 'Calculate percentages easily', icon: Percent },
      ]
    },
    {
      title: 'Health & Fitness',
      icon: Activity,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      link: '/health-fitness',
      calculators: [
        { name: 'BMI Calculator', path: '/bmi-calculator', description: 'Body Mass Index calculator', icon: Heart },
        { name: 'Calorie Calculator', path: '/calorie-calculator', description: 'Daily calorie needs', icon: Activity },
        { name: 'Body Fat Calculator', path: '/body-fat-calculator', description: 'Body fat percentage', icon: Target },
      ]
    },
    {
      title: 'Financial',
      icon: DollarSign,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      link: '/financial',
      calculators: [
        { name: 'Mortgage Calculator', path: '/mortgage-calculator', description: 'Home loan calculations', icon: HomeIcon },
        { name: 'Loan Calculator', path: '/loan-calculator', description: 'Personal loan calculator', icon: DollarSign },
        { name: 'Investment Calculator', path: '/investment-calculator', description: 'ROI and compound interest', icon: TrendingUp },
      ]
    },
    {
      title: 'Conversion Tools',
      icon: Ruler,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      link: '/conversion-tools',
      calculators: [
        { name: 'Unit Converter', path: '/unit-converter', description: 'Convert between units', icon: Ruler },
        { name: 'Currency Converter', path: '/currency-converter', description: 'Exchange rates', icon: DollarSign },
        { name: 'Temperature Converter', path: '/temperature-converter', description: 'Celsius, Fahrenheit, Kelvin', icon: Activity },
      ]
    },
    {
      title: 'Date & Time',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      link: '/date-time',
      calculators: [
        { name: 'Date Calculator', path: '/date-calculator', description: 'Date difference calculator', icon: Calendar },
        { name: 'Age Calculator', path: '/age-calculator', description: 'Calculate your exact age', icon: Calendar },
        { name: 'Time Zone Converter', path: '/time-zone-converter', description: 'Convert time zones', icon: Calendar },
      ]
    },
    {
      title: 'Education',
      icon: GraduationCap,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      link: '/education',
      calculators: [
        { name: 'Grade Calculator', path: '/grade-calculator', description: 'GPA and grade calculations', icon: GraduationCap },
        { name: 'Statistics Calculator', path: '/statistics-calculator', description: 'Mean, median, mode', icon: BarChart3 },
        { name: 'Equation Solver', path: '/equation-solver', description: 'Solve mathematical equations', icon: Calculator },
      ]
    }
  ];

  const featuredCalculators = [
    { name: 'Basic Calculator', path: '/basic-calculator', icon: Calculator, users: '2.1M', color: 'from-blue-500 to-blue-600' },
    { name: 'BMI Calculator', path: '/bmi-calculator', icon: Heart, users: '1.8M', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Mortgage Calculator', path: '/mortgage-calculator', icon: HomeIcon, users: '1.5M', color: 'from-green-500 to-green-600' },
    { name: 'Unit Converter', path: '/unit-converter', icon: Zap, users: '1.2M', color: 'from-purple-500 to-purple-600' },
  ];

  return (
    <div className="space-y-12">
      <div className="max-w-2xl mx-auto">
        <SearchBar className="w-full" placeholder="Search calculators..." />
      </div>

      {/* Hero Section */}
      <section className="text-center py-12">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            Free Online
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Calculators</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Over 300 free calculators covering math, finance, health, conversion, and more.
            Fast, accurate, and easy to use for all your calculation needs.
          </p>
        </div>

        <div
          className="grid gap-6 mb-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}
        >
          {featuredCalculators.map((calc, index) => (
            <Link
              key={index}
              to={calc.path}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${calc.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <calc.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                  {calc.name}
                </h3>
                <p className="text-sm text-gray-500">{calc.users} monthly users</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Calculator Categories */}
      <section>
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Calculator Categories
        </h2>

        <div
          className="grid gap-8"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}
        >
          {calculatorCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${category.color} flex items-center justify-center mb-6`}>
                <category.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-6">
                {category.title}
              </h3>

              <div className="space-y-4">
                {category.calculators.map((calc, calcIndex) => (
                  <Link
                    key={calcIndex}
                    to={calc.path}
                    className="group block"
                  >
                    <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 ${category.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <calc.icon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {calc.name}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {calc.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                {category.link ? (
                  <Link
                    to={category.link}
                    className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
                  >
                    View all in {category.title} →
                  </Link>
                ) : (
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors">
                    View all in {category.title} →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-blue-100 text-lg">
            Join millions of users who rely on our calculators daily
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">300+</div>
            <div className="text-blue-100">Calculators</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">50M+</div>
            <div className="text-blue-100">Monthly Users</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">1B+</div>
            <div className="text-blue-100">Calculations</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold mb-2">99.9%</div>
            <div className="text-blue-100">Accuracy</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-12">
          Why Choose Our Calculators?
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Accurate Results</h3>
            <p className="text-gray-600 leading-relaxed">
              Our calculators use precise algorithms to ensure accurate results every time.
            </p>
          </div>

          <div className="p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-green-600" />
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

export default Home;