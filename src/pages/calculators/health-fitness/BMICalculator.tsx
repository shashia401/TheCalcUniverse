import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, Activity } from 'lucide-react';

const BMICalculator: React.FC = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState('');

  useEffect(() => {
    if (height && weight) {
      calculateBMI();
    }
  }, [height, weight, unit]);

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);

    if (h <= 0 || w <= 0) return;

    let bmiValue: number;

    if (unit === 'metric') {
      // height in cm, weight in kg
      const heightInM = h / 100;
      bmiValue = w / (heightInM * heightInM);
    } else {
      // height in inches, weight in pounds
      bmiValue = (w / (h * h)) * 703;
    }

    setBmi(parseFloat(bmiValue.toFixed(1)));
    
    // Determine category
    if (bmiValue < 18.5) {
      setCategory('Underweight');
    } else if (bmiValue < 25) {
      setCategory('Normal weight');
    } else if (bmiValue < 30) {
      setCategory('Overweight');
    } else {
      setCategory('Obese');
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Underweight':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Normal weight':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Overweight':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Obese':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const bmiRanges = [
    { range: '< 18.5', category: 'Underweight', color: 'bg-blue-500' },
    { range: '18.5 - 24.9', category: 'Normal weight', color: 'bg-green-500' },
    { range: '25.0 - 29.9', category: 'Overweight', color: 'bg-yellow-500' },
    { range: '≥ 30.0', category: 'Obese', color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/health-fitness" className="hover:text-blue-600 transition-colors">Health Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">BMI Calculator</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <Activity className="w-8 h-8 text-emerald-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">BMI Calculator</h1>
            </div>

            {/* Unit Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6 w-fit">
              <button
                onClick={() => setUnit('metric')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  unit === 'metric' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Metric
              </button>
              <button
                onClick={() => setUnit('imperial')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  unit === 'imperial' 
                    ? 'bg-white text-gray-900 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Imperial
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Height Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Height {unit === 'metric' ? '(cm)' : '(inches)'}
                </label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder={unit === 'metric' ? '170' : '67'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                />
              </div>

              {/* Weight Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Weight {unit === 'metric' ? '(kg)' : '(lbs)'}
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === 'metric' ? '70' : '154'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg"
                />
              </div>
            </div>

            {/* Results */}
            {bmi && (
              <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-gray-900 mb-2">{bmi}</div>
                  <div className="text-lg text-gray-600 mb-4">Body Mass Index</div>
                  <div className={`inline-flex items-center px-4 py-2 rounded-full border text-sm font-medium ${getCategoryColor(category)}`}>
                    {category}
                  </div>
                </div>
              </div>
            )}

            {/* BMI Scale */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">BMI Categories</h3>
              <div className="space-y-3">
                {bmiRanges.map((range, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      category === range.category ? 'bg-white shadow-sm border-2 border-emerald-200' : 'bg-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${range.color}`}></div>
                      <span className="font-medium text-gray-900">{range.category}</span>
                    </div>
                    <span className="text-gray-600 font-mono text-sm">{range.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About BMI</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Body Mass Index (BMI) is a measure of body fat based on height and weight. 
              It's a screening tool to identify potential weight-related health problems.
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <h3 className="font-semibold text-gray-800">Formula</h3>
                <p className="text-gray-600">BMI = weight (kg) / height² (m²)</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Applications</h3>
                <p className="text-gray-600">Health screening, fitness tracking</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Note</h3>
            <p className="text-yellow-800 text-sm leading-relaxed">
              BMI is a screening tool and doesn't diagnose body fatness or health. 
              Consult with a healthcare provider for health assessments.
            </p>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-emerald-900 mb-3">Healthy Tips</h3>
            <ul className="text-emerald-800 text-sm space-y-2">
              <li>• Maintain regular physical activity</li>
              <li>• Eat a balanced, nutritious diet</li>
              <li>• Stay hydrated throughout the day</li>
              <li>• Get adequate sleep (7-9 hours)</li>
              <li>• Monitor your weight regularly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;