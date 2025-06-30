import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calculator, Search, Menu, X, ChevronDown } from 'lucide-react';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);

  const calculators = {
    math: [
      { name: 'Basic Calculator', path: '/basic-calculator' },
      { name: 'Scientific Calculator', path: '/scientific-calculator' },
      { name: 'Percentage Calculator', path: '/percentage-calculator' },
      { name: 'Fraction Calculator', path: '/fraction-calculator' },
      { name: 'Mixed Number Calculator', path: '/mixed-number-calculator' },
      { name: 'Simplify Fractions Calculator', path: '/simplify-fractions-calculator' },
      { name: 'Decimal to Fraction Calculator', path: '/decimal-to-fraction-calculator' },
      { name: 'Fraction to Decimal Calculator', path: '/fraction-to-decimal-calculator' },
      { name: 'Big Number Fraction Calculator', path: '/big-number-fraction-calculator' },
      { name: 'Ratio Calculator', path: '/ratio-calculator' },
      { name: 'Proportion Calculator', path: '/proportion-calculator' },
      { name: 'Average Calculator', path: '/average-calculator' },
      { name: 'Area Calculator', path: '/area-calculator' },
      { name: 'Volume Calculator', path: '/volume-calculator' },
      { name: 'Perimeter Calculator', path: '/perimeter-calculator' },
      { name: 'Quadratic Formula Calculator', path: '/quadratic-formula' },
      { name: 'Statistics Calculator', path: '/statistics-calculator' },
      { name: 'Prime Number Calculator', path: '/prime-number-calculator' },
      { name: 'Triangle Calculator', path: '/triangle-calculator' },
      { name: 'Matrix Calculator', path: '/matrix-calculator' },
      { name: 'Logarithm Calculator', path: '/logarithm-calculator' },
      { name: 'Root Calculator', path: '/root-calculator' },
      { name: 'Binary Calculator', path: '/binary-calculator' },
      { name: 'Factorial Calculator', path: '/factorial-calculator' },
      { name: 'GCD Calculator', path: '/gcd-calculator' },
      { name: 'LCM Calculator', path: '/lcm-calculator' },
      { name: 'Fibonacci Calculator', path: '/fibonacci-calculator' },
      { name: 'Scientific Notation Calculator', path: '/scientific-notation-calculator' },
      { name: 'Random Number Generator', path: '/random-number-generator' },
      { name: 'Rounding Calculator', path: '/rounding-calculator' },
      { name: 'Big Number Calculator', path: '/big-number-calculator' },
      { name: 'Common Denominator Calculator', path: '/common-denominator-calculator' },
      { name: 'Long Division Calculator', path: '/long-division-calculator' },
    ],
    health: [
      { name: 'BMI Calculator', path: '/bmi-calculator' },
      { name: 'Body Fat Calculator', path: '/body-fat-calculator' },
      { name: 'Calorie Calculator', path: '/calorie-calculator' },
      { name: 'Heart Rate Calculator', path: '/heart-rate-calculator' },
      { name: 'Pregnancy Calculator', path: '/pregnancy-calculator' },
      { name: 'Water Intake Calculator', path: '/water-intake-calculator' },
    ],
    financial: [
      { name: 'Mortgage Calculator', path: '/mortgage-calculator' },
      { name: 'Loan Calculator', path: '/loan-calculator' },
      { name: 'Investment Calculator', path: '/investment-calculator' },
      { name: 'Compound Interest Calculator', path: '/compound-interest-calculator' },
      { name: 'Retirement Calculator', path: '/retirement-calculator' },
      { name: 'Tax Calculator', path: '/tax-calculator' },
      { name: 'Tip Calculator', path: '/tip-calculator' },
      { name: 'Currency Converter', path: '/currency-converter' },
    ],
    conversion: [
      { name: 'Unit Converter', path: '/unit-converter' },
      { name: 'Temperature Converter', path: '/temperature-converter' },
      { name: 'Length Converter', path: '/length-converter' },
      { name: 'Weight Converter', path: '/weight-converter' },
      { name: 'Volume Converter', path: '/volume-converter' },
      { name: 'Area Converter', path: '/area-converter' },
      { name: 'Speed Converter', path: '/speed-converter' },
      { name: 'Energy Converter', path: '/energy-converter' },
    ],
    datetime: [
      { name: 'Date Calculator', path: '/date-calculator' },
      { name: 'Age Calculator', path: '/age-calculator' },
      { name: 'Time Zone Converter', path: '/time-zone-converter' },
      { name: 'Business Days Calculator', path: '/business-days-calculator' },
      { name: 'Time Duration Calculator', path: '/time-duration-calculator' },
      { name: 'Countdown Calculator', path: '/countdown-calculator' },
    ],
    education: [
      { name: 'Grade Calculator', path: '/grade-calculator' },
      { name: 'GPA Calculator', path: '/gpa-calculator' },
      { name: 'Test Score Calculator', path: '/test-score-calculator' },
      { name: 'Study Time Calculator', path: '/study-time-calculator' },
      { name: 'Reading Time Calculator', path: '/reading-time-calculator' },
    ]
  };

  const allCalculators = Object.values(calculators).flat();

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Math Calculators', path: '/math-calculators', dropdown: 'math' },
    { name: 'Health & Fitness', path: '/health-fitness', dropdown: 'health' },
    { name: 'Financial', path: '/financial', dropdown: 'financial' },
    { name: 'Conversion Tools', path: '/conversion-tools', dropdown: 'conversion' },
    { name: 'Date & Time', path: '/date-time', dropdown: 'datetime' },
    { name: 'Education', path: '/education', dropdown: 'education' },
  ];

  // Filter suggestions based on search query
  const suggestions = searchQuery.length > 0 
    ? allCalculators.filter(calc => 
        calc.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8) // Limit to 8 suggestions
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const targetCalc = selectedSuggestion >= 0 ? suggestions[selectedSuggestion] : suggestions[0];
      navigate(targetCalc.path);
      setSearchQuery('');
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
      setIsMenuOpen(false);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    setSelectedSuggestion(-1);
  };

  const handleSuggestionClick = (calc: { name: string; path: string }) => {
    navigate(calc.path);
    setSearchQuery('');
    setShowSuggestions(false);
    setSelectedSuggestion(-1);
    setIsMenuOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestion(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestion(-1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestion >= 0) {
          handleSuggestionClick(suggestions[selectedSuggestion]);
        } else if (suggestions.length > 0) {
          handleSuggestionClick(suggestions[0]);
        }
        break;
    }
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const SearchSuggestions: React.FC<{ isMobile?: boolean }> = ({ isMobile = false }) => (
    showSuggestions && suggestions.length > 0 && (
      <div className={`absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 ${isMobile ? 'max-h-64' : 'max-h-80'} overflow-y-auto`}>
        {suggestions.map((calc, index) => (
          <button
            key={calc.path}
            onClick={() => handleSuggestionClick(calc)}
            className={`w-full text-left px-4 py-2 hover:bg-blue-50 transition-colors ${
              selectedSuggestion === index ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-gray-400" />
              <span className="text-sm">{calc.name}</span>
            </div>
          </button>
        ))}
        {searchQuery && suggestions.length === 0 && (
          <div className="px-4 py-2 text-sm text-gray-500">
            No calculators found for "{searchQuery}"
          </div>
        )}
      </div>
    )
  );

  return (
    <header className="bg-white shadow-lg border-b border-blue-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
            <Calculator className="w-8 h-8" />
            <span className="text-xl font-bold">TheCalcUniverse</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8" ref={searchRef}>
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search calculators..."
                  value={searchQuery}
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoComplete="off"
                />
              </div>
              <SearchSuggestions />
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" ref={dropdownRef}>
            {menuItems.map((item) => (
              <div key={item.name} className="relative">
                {item.dropdown ? (
                  <button
                    onClick={() => handleDropdownToggle(item.dropdown)}
                    className="flex items-center space-x-1 px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    <span>{item.name}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      activeDropdown === item.dropdown ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    to={item.path}
                    className="px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors rounded-lg hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                )}

                {/* Dropdown Menu */}
                {item.dropdown && activeDropdown === item.dropdown && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="max-h-96 overflow-y-auto">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <Link
                          to={item.path}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                          onClick={() => setActiveDropdown(null)}
                        >
                          View All {item.name} →
                        </Link>
                      </div>
                      <div className="grid grid-cols-1 gap-1 p-2">
                        {calculators[item.dropdown as keyof typeof calculators]?.map((calc) => (
                          <Link
                            key={calc.path}
                            to={calc.path}
                            className="px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {calc.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            {/* Mobile Search */}
            <div className="mb-4 relative" ref={mobileSearchRef}>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search calculators..."
                    value={searchQuery}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoComplete="off"
                  />
                </div>
              </form>
              <SearchSuggestions isMobile />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.name}>
                  {item.dropdown ? (
                    <div>
                      <button
                        onClick={() => handleDropdownToggle(item.dropdown)}
                        className="flex items-center justify-between w-full py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      >
                        <span>{item.name}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${
                          activeDropdown === item.dropdown ? 'rotate-180' : ''
                        }`} />
                      </button>
                      
                      {activeDropdown === item.dropdown && (
                        <div className="pl-4 mt-2 space-y-1 border-l-2 border-blue-100">
                          <Link
                            to={item.path}
                            className="block py-1 text-sm font-medium text-blue-600 hover:text-blue-700"
                            onClick={() => {
                              setActiveDropdown(null);
                              setIsMenuOpen(false);
                            }}
                          >
                            View All {item.name} →
                          </Link>
                          {calculators[item.dropdown as keyof typeof calculators]?.slice(0, 8).map((calc) => (
                            <Link
                              key={calc.path}
                              to={calc.path}
                              className="block py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                              onClick={() => {
                                setActiveDropdown(null);
                                setIsMenuOpen(false);
                              }}
                            >
                              {calc.name}
                            </Link>
                          ))}
                          {calculators[item.dropdown as keyof typeof calculators]?.length > 8 && (
                            <div className="text-xs text-gray-500 py-1">
                              +{calculators[item.dropdown as keyof typeof calculators].length - 8} more...
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;