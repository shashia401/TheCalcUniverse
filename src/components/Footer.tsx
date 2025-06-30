import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Calculator className="w-6 h-6 text-blue-400" />
              <span className="text-xl font-bold">TheCalcUniverse</span>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your comprehensive source for free online calculators. From basic math to complex financial calculations, 
              we provide accurate and easy-to-use tools for all your calculation needs.
            </p>
            <p className="text-gray-400 text-sm">
              © 2024 TheCalcUniverse.com. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Popular Calculators</h3>
            <ul className="space-y-2">
              <li><Link to="/basic-calculator" className="text-gray-300 hover:text-blue-400 transition-colors">Basic Calculator</Link></li>
              <li><Link to="/scientific-calculator" className="text-gray-300 hover:text-blue-400 transition-colors">Scientific Calculator</Link></li>
              <li><Link to="/bmi-calculator" className="text-gray-300 hover:text-blue-400 transition-colors">BMI Calculator</Link></li>
              <li><Link to="/mortgage-calculator" className="text-gray-300 hover:text-blue-400 transition-colors">Mortgage Calculator</Link></li>
              <li><Link to="/percentage-calculator" className="text-gray-300 hover:text-blue-400 transition-colors">Percentage Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><Link to="/math-calculators" className="text-gray-300 hover:text-blue-400 transition-colors">Math Calculators</Link></li>
              <li><Link to="/financial" className="text-gray-300 hover:text-blue-400 transition-colors">Finance Calculators</Link></li>
              <li><Link to="/health-fitness" className="text-gray-300 hover:text-blue-400 transition-colors">Health Calculators</Link></li>
              <li><Link to="/conversion-tools" className="text-gray-300 hover:text-blue-400 transition-colors">Conversion Tools</Link></li>
              <li><Link to="/date-time" className="text-gray-300 hover:text-blue-400 transition-colors">Date Calculators</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 flex items-center justify-center space-x-1">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500" />
            <span>for calculation enthusiasts worldwide</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;