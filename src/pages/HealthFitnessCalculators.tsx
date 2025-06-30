import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Heart, Activity, Target, Droplet } from "lucide-react";

const calculators = [
  {
    name: "BMI Calculator",
    path: "/bmi-calculator",
    description: "Body Mass Index calculator",
    icon: Heart,
    color: "from-emerald-500 to-emerald-600",
  },
  {
    name: "Calorie Calculator",
    path: "/calorie-calculator",
    description: "Daily calorie needs",
    icon: Activity,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Body Fat Calculator",
    path: "/body-fat-calculator",
    description: "Body fat percentage",
    icon: Target,
    color: "from-pink-500 to-pink-600",
  },
  {
    name: "Water Intake Calculator",
    path: "/water-intake-calculator",
    description: "Recommended daily water intake",
    icon: Droplet,
    color: "from-cyan-500 to-cyan-600",
  },
  // Add more calculators as needed
];

const HealthFitnessCalculators: React.FC = () => (
  <div className="max-w-7xl mx-auto">
    {/* Breadcrumb */}
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Health & Fitness Calculators</span>
    </nav>

    {/* Header Section */}
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <Heart className="w-10 h-10 text-emerald-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Health & Fitness Calculators</h1>
      </div>
      <p className="text-lg text-gray-600">
        Tools to help you track, analyze, and improve your health and fitness.
      </p>
    </div>

    {/* Calculator List */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {calculators.map((calc, index) => (
        <Link
          key={index}
          to={calc.path}
          className="group bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
        >
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${calc.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
              <calc.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors mb-2">
              {calc.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default HealthFitnessCalculators;