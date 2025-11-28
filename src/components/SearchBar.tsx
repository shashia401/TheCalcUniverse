import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calculator } from 'lucide-react';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  className = '',
  placeholder = 'Search calculators...'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(-1);
  const navigate = useNavigate();
  const searchRef = useRef<HTMLDivElement>(null);

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
      { name: 'Auto Loan Calculator', path: '/auto-loan-calculator' },
      { name: 'Interest Calculator', path: '/interest-calculator' },
      { name: 'Compound Interest Calculator', path: '/compound-interest-calculator' },
      { name: 'Investment Calculator', path: '/investment-calculator' },
      { name: 'SIP Calculator', path: '/sip-calculator' },
      { name: 'SWP Calculator', path: '/swp-calculator' },
      { name: 'Payment Calculator', path: '/payment-calculator' },
      { name: 'Amortization Calculator', path: '/amortization-calculator' },
      { name: 'Retirement Calculator', path: '/retirement-calculator' },
      { name: 'Inflation Calculator', path: '/inflation-calculator' },
      { name: 'Income Tax Calculator', path: '/income-tax-calculator' },
      { name: 'Tax Calculator', path: '/tax-calculator' },
      { name: 'Sales Tax Calculator', path: '/sales-tax-calculator' },
      { name: 'Salary Calculator', path: '/salary-calculator' },
      { name: 'Interest Rate Calculator', path: '/interest-rate-calculator' },
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

  const suggestions = searchQuery.length > 0
    ? allCalculators.filter(calc =>
        calc.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 8)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (suggestions.length > 0) {
      const targetCalc = selectedSuggestion >= 0 ? suggestions[selectedSuggestion] : suggestions[0];
      navigate(targetCalc.path);
      setSearchQuery('');
      setShowSuggestions(false);
      setSelectedSuggestion(-1);
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      <form onSubmit={handleSearch} className="w-full">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => handleSearchInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-base"
            autoComplete="off"
          />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 max-h-80 overflow-y-auto">
          {suggestions.map((calc, index) => (
            <button
              key={calc.path}
              onClick={() => handleSuggestionClick(calc)}
              className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                selectedSuggestion === index ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Calculator className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{calc.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
