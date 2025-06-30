import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Activity, DollarSign, Ruler, Calendar, GraduationCap, Percent, TrendingUp, Heart, Home, Zap, Target, BarChart3, Divide, Square, Triangle, Hash, Binary, Shuffle, RotateCcw, Infinity, FunctionSquare as Function, Hexagon as Hex, Database, Circle, Compass, PieChart, AlertCircle, TrendingDown, Clock, ChevronRight, Square as SquareRoot, Sigma } from 'lucide-react';

const MathCalculators: React.FC = () => {
  const calculatorCategories = [
    {
      title: 'Basic Math',
      icon: Calculator,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      calculators: [
        { name: 'Basic Calculator', path: '/basic-calculator', description: 'Addition, subtraction, multiplication, division', icon: Calculator },
        { name: 'Scientific Calculator', path: '/scientific-calculator', description: 'Advanced mathematical functions', icon: Zap },
        { name: 'Fraction Calculator', path: '/fraction-calculator', description: 'Add, subtract, multiply, divide fractions', icon: Divide },
        { name: 'Percentage Calculator', path: '/percentage-calculator', description: 'Calculate percentages and percentage change', icon: Percent },
        { name: 'Ratio Calculator', path: '/ratio-calculator', description: 'Calculate and simplify ratios', icon: BarChart3 },
        { name: 'Proportion Calculator', path: '/proportion-calculator', description: 'Solve proportions and cross multiplication', icon: Target },
        { name: 'Average Calculator', path: '/average-calculator', description: 'Calculate mean, median, mode averages', icon: TrendingUp },
        { name: 'Rounding Calculator', path: '/rounding-calculator', description: 'Round numbers to specified decimal places', icon: RotateCcw },
        { name: 'Big Number Calculator', path: '/big-number-calculator', description: 'Calculate with very large numbers', icon: Infinity },
        { name: 'Common Denominator Calculator', path: '/common-denominator-calculator', description: 'Find common denominators for fractions', icon: Divide },
        { name: 'Long Division Calculator', path: '/long-division-calculator', description: 'Perform long division with steps', icon: Divide },
      ]
    },
    {
      title: 'Algebra',
      icon: Function,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      calculators: [
        { name: 'Equation Solver', path: '/equation-solver', description: 'Solve linear and quadratic equations', icon: Function },
        { name: 'System of Equations', path: '/system-of-equations', description: 'Solve systems of linear equations', icon: Function },
        { name: 'Quadratic Formula Calculator', path: '/quadratic-formula', description: 'Find roots using quadratic formula', icon: Function },
        { name: 'Factoring Calculator', path: '/factoring-calculator', description: 'Factor polynomials and expressions', icon: Function },
        { name: 'Polynomial Calculator', path: '/polynomial-calculator', description: 'Add, subtract, multiply polynomials', icon: Function },
        { name: 'Logarithm Calculator', path: '/logarithm-calculator', description: 'Calculate natural and common logarithms', icon: TrendingUp },
        { name: 'Log Calculator', path: '/log-calculator', description: 'Calculate logarithms with any base', icon: TrendingUp },
        { name: 'Exponent Calculator', path: '/exponent-calculator', description: 'Calculate powers and exponents', icon: TrendingUp },
        { name: 'Root Calculator', path: '/root-calculator', description: 'Calculate square roots, cube roots, nth roots', icon: SquareRoot },
        { name: 'Slope Calculator', path: '/slope-calculator', description: 'Calculate slope between two points', icon: TrendingUp },
      ]
    },
    {
      title: 'Geometry',
      icon: Triangle,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      calculators: [
        { name: 'Area Calculator', path: '/area-calculator', description: 'Calculate area of various shapes', icon: Square },
        { name: 'Perimeter Calculator', path: '/perimeter-calculator', description: 'Calculate perimeter of shapes', icon: Hex },
        { name: 'Volume Calculator', path: '/volume-calculator', description: 'Calculate volume of 3D shapes', icon: Database },
        { name: 'Surface Area Calculator', path: '/surface-area-calculator', description: 'Calculate surface area of 3D shapes', icon: Database },
        { name: 'Triangle Calculator', path: '/triangle-calculator', description: 'Calculate triangle properties', icon: Triangle },
        { name: 'Right Triangle Calculator', path: '/right-triangle-calculator', description: 'Solve right triangle problems', icon: Triangle },
        { name: 'Circle Calculator', path: '/circle-calculator', description: 'Calculate circle area, circumference', icon: Circle },
        { name: 'Pythagorean Theorem Calculator', path: '/pythagorean-theorem', description: 'Calculate triangle sides using Pythagorean theorem', icon: Triangle },
        { name: 'Distance Calculator', path: '/distance-calculator', description: 'Calculate distance between two points', icon: Compass },
      ]
    },
    {
      title: 'Trigonometry',
      icon: Activity,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-50',
      iconColor: 'text-red-600',
      calculators: [
        { name: 'Trigonometry Calculator', path: '/trigonometry-calculator', description: 'Calculate sin, cos, tan functions', icon: Activity },
        { name: 'Law of Sines', path: '/law-of-sines', description: 'Solve triangles using law of sines', icon: Triangle },
        { name: 'Law of Cosines', path: '/law-of-cosines', description: 'Solve triangles using law of cosines', icon: Triangle },
        { name: 'Unit Circle Calculator', path: '/unit-circle-calculator', description: 'Find coordinates on unit circle', icon: Circle },
        { name: 'Inverse Trig Calculator', path: '/inverse-trig-calculator', description: 'Calculate arcsin, arccos, arctan', icon: Activity },
      ]
    },
    {
      title: 'Statistics',
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      calculators: [
        { name: 'Statistics Calculator', path: '/statistics-calculator', description: 'Mean, median, mode, standard deviation', icon: BarChart3 },
        { name: 'Mean, Median, Mode, Range Calculator', path: '/mean-median-mode-calculator', description: 'Calculate central tendency measures', icon: BarChart3 },
        { name: 'Standard Deviation Calculator', path: '/standard-deviation-calculator', description: 'Calculate population and sample standard deviation', icon: BarChart3 },
        { name: 'Central Tendency Calculator', path: '/central-tendency-calculator', description: 'Calculate various types of averages', icon: BarChart3 },
        { name: 'Descriptive Statistics Calculator', path: '/descriptive-statistics-calculator', description: 'Comprehensive statistical analysis', icon: BarChart3 },
        { name: 'Probability Calculator', path: '/probability-calculator', description: 'Calculate probability and combinations', icon: PieChart },
        { name: 'Combination Calculator', path: '/combination-calculator', description: 'Calculate combinations and permutations', icon: Shuffle },
        { name: 'Permutation and Combination Calculator', path: '/permutation-combination-calculator', description: 'Calculate permutations and combinations', icon: Shuffle },
        { name: 'Z-score Calculator', path: '/z-score-calculator', description: 'Calculate z-scores and probabilities', icon: BarChart3 },
        { name: 'Correlation Calculator', path: '/correlation-calculator', description: 'Calculate correlation coefficient', icon: TrendingUp },
        { name: 'Sample Size Calculator', path: '/sample-size-calculator', description: 'Calculate required sample size', icon: BarChart3 },
        { name: 'Confidence Interval Calculator', path: '/confidence-interval-calculator', description: 'Calculate confidence intervals', icon: BarChart3 },
        { name: 'P-value Calculator', path: '/p-value-calculator', description: 'Calculate statistical p-values', icon: BarChart3 },
        { name: 'Percent Error Calculator', path: '/percent-error-calculator', description: 'Calculate percentage error in measurements', icon: AlertCircle },
      ]
    },
    {
      title: 'Number Theory',
      icon: Hash,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50',
      iconColor: 'text-indigo-600',
      calculators: [
        { name: 'Prime Number Calculator', path: '/prime-number-calculator', description: 'Check if number is prime, find primes', icon: Hash },
        { name: 'Prime Factorization Calculator', path: '/prime-factorization-calculator', description: 'Find prime factors of numbers', icon: Hash },
        { name: 'Factor Calculator', path: '/factor-calculator', description: 'Find all factors of a number', icon: Hash },
        { name: 'Greatest Common Factor Calculator', path: '/gcd-calculator', description: 'Greatest common divisor calculator', icon: Hash },
        { name: 'Least Common Multiple Calculator', path: '/lcm-calculator', description: 'Least common multiple calculator', icon: Hash },
        { name: 'Factorial Calculator', path: '/factorial-calculator', description: 'Calculate factorial of numbers', icon: Hash },
        { name: 'Fibonacci Calculator', path: '/fibonacci-calculator', description: 'Generate Fibonacci sequence', icon: TrendingUp },
        { name: 'Number Sequence Calculator', path: '/number-sequence-calculator', description: 'Find patterns in number sequences', icon: TrendingUp },
        { name: 'Random Number Generator', path: '/random-number-generator', description: 'Generate random numbers', icon: Shuffle },
      ]
    },
    {
      title: 'Number Systems',
      icon: Binary,
      color: 'from-cyan-500 to-cyan-600',
      bgColor: 'bg-cyan-50',
      iconColor: 'text-cyan-600',
      calculators: [
        { name: 'Number Base Converter', path: '/number-base-converter', description: 'Convert between number bases', icon: Binary },
        { name: 'Binary Calculator', path: '/binary-calculator', description: 'Perform calculations in binary', icon: Binary },
        { name: 'Hex Calculator', path: '/hex-calculator', description: 'Perform calculations in hexadecimal', icon: Hex },
        { name: 'Scientific Notation Calculator', path: '/scientific-notation-calculator', description: 'Convert to and from scientific notation', icon: Zap },
      ]
    },
    {
      title: 'Calculus',
      icon: Infinity,
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600',
      calculators: [
        { name: 'Derivative Calculator', path: '/derivative-calculator', description: 'Calculate derivatives of functions', icon: TrendingUp },
        { name: 'Integral Calculator', path: '/integral-calculator', description: 'Calculate definite and indefinite integrals', icon: TrendingDown },
        { name: 'Limit Calculator', path: '/limit-calculator', description: 'Calculate limits of functions', icon: Target },
        { name: 'Series Calculator', path: '/series-calculator', description: 'Calculate infinite series and sequences', icon: Infinity },
        { name: 'Taylor Series', path: '/taylor-series', description: 'Generate Taylor series expansions', icon: Function },
      ]
    },
    {
      title: 'Matrix & Vectors',
      icon: Square,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50',
      iconColor: 'text-teal-600',
      calculators: [
        { name: 'Matrix Calculator', path: '/matrix-calculator', description: 'Matrix operations: add, multiply, determinant', icon: Square },
        { name: 'Vector Calculator', path: '/vector-calculator', description: 'Vector operations and calculations', icon: TrendingUp },
        { name: 'Determinant Calculator', path: '/determinant-calculator', description: 'Calculate matrix determinant', icon: Square },
        { name: 'Eigenvalue Calculator', path: '/eigenvalue-calculator', description: 'Find eigenvalues and eigenvectors', icon: Square },
        { name: 'Cross Product', path: '/cross-product', description: 'Calculate vector cross product', icon: TrendingUp },
        { name: 'Dot Product', path: '/dot-product', description: 'Calculate vector dot product', icon: Target },
      ]
    },
    {
      title: 'Specialized',
      icon: Clock,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
      calculators: [
        { name: 'Half-Life Calculator', path: '/half-life-calculator', description: 'Calculate radioactive decay and half-life', icon: Clock },
      ]
    }
  ];

  const popularCalculators = [
    { name: 'Basic Calculator', path: '/basic-calculator', icon: Calculator, description: 'Simple arithmetic operations', color: 'from-blue-500 to-blue-600' },
    { name: 'Scientific Calculator', path: '/scientific-calculator', icon: Zap, description: 'Advanced mathematical functions', color: 'from-purple-500 to-purple-600' },
    { name: 'Percentage Calculator', path: '/percentage-calculator', icon: Percent, description: 'Calculate percentages', color: 'from-green-500 to-green-600' },
    { name: 'Fraction Calculator', path: '/fraction-calculator', icon: Divide, description: 'Fraction operations', color: 'from-orange-500 to-orange-600' },
    { name: 'Area Calculator', path: '/area-calculator', icon: Square, description: 'Calculate area of shapes', color: 'from-red-500 to-red-600' },
    { name: 'Statistics Calculator', path: '/statistics-calculator', icon: BarChart3, description: 'Statistical calculations', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Quadratic Formula Calculator', path: '/quadratic-formula', icon: Function, description: 'Solve quadratic equations', color: 'from-pink-500 to-pink-600' },
    { name: 'Triangle Calculator', path: '/triangle-calculator', icon: Triangle, description: 'Triangle calculations', color: 'from-teal-500 to-teal-600' },
    { name: 'Random Number Generator', path: '/random-number-generator', icon: Shuffle, description: 'Generate random numbers', color: 'from-cyan-500 to-cyan-600' },
    { name: 'Prime Number Calculator', path: '/prime-number-calculator', icon: Hash, description: 'Check prime numbers', color: 'from-amber-500 to-amber-600' },
    { name: 'Binary Calculator', path: '/binary-calculator', icon: Binary, description: 'Binary arithmetic', color: 'from-emerald-500 to-emerald-600' },
    { name: 'Matrix Calculator', path: '/matrix-calculator', icon: Square, description: 'Matrix operations', color: 'from-violet-500 to-violet-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Math Calculators</span>
      </nav>

      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-blue-100 rounded-2xl mr-4">
            <Calculator className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Math Calculators
          </h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Comprehensive collection of over 80 mathematical calculators for students, teachers, and professionals. 
          From basic arithmetic to advanced calculus, find the right tool for your mathematical needs.
        </p>
      </div>

      {/* Popular Calculators */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Most Popular Math Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {popularCalculators.map((calc, index) => (
            <Link
              key={index}
              to={calc.path}
              className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
            >
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${calc.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  <calc.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
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

      {/* Calculator Categories */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Complete Math Calculator Collection
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {calculatorCategories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex items-center mb-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center mr-4`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {category.title}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.calculators.map((calc, calcIndex) => (
                  <Link
                    key={calcIndex}
                    to={calc.path}
                    className="group block p-4 rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-md"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 ${category.bgColor} rounded-lg group-hover:scale-110 transition-transform duration-300`}>
                        <calc.icon className={`w-5 h-5 ${category.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors mb-1 text-sm">
                          {calc.name}
                        </h4>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {calc.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white mb-16">
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

export default MathCalculators;