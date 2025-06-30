import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Repeat, Thermometer, Ruler, Weight, Droplet, Square, Zap, Gauge } from "lucide-react";

const calculators = [
  {
    name: "Unit Converter",
    path: "/unit-converter",
    description: "Convert between different units of measurement",
    icon: Repeat,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Temperature Converter",
    path: "/temperature-converter",
    description: "Convert Celsius, Fahrenheit, and Kelvin",
    icon: Thermometer,
    color: "from-red-500 to-orange-500",
  },
  {
    name: "Length Converter",
    path: "/length-converter",
    description: "Convert meters, feet, inches, and more",
    icon: Ruler,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Weight Converter",
    path: "/weight-converter",
    description: "Convert kilograms, pounds, ounces, and more",
    icon: Weight,
    color: "from-pink-500 to-pink-600",
  },
  {
    name: "Volume Converter",
    path: "/volume-converter",
    description: "Convert liters, gallons, cups, and more",
    icon: Droplet,
    color: "from-cyan-500 to-cyan-600",
  },
  {
    name: "Area Converter",
    path: "/area-converter",
    description: "Convert square meters, acres, and more",
    icon: Square,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    name: "Speed Converter",
    path: "/speed-converter",
    description: "Convert km/h, mph, m/s, and more",
    icon: Gauge,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Energy Converter",
    path: "/energy-converter",
    description: "Convert joules, calories, kWh, and more",
    icon: Zap,
    color: "from-purple-500 to-purple-600",
  },
];

const ConversionTools: React.FC = () => (
  <div className="max-w-7xl mx-auto">
    {/* Breadcrumb */}
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Conversion Tools</span>
    </nav>

    {/* Header Section */}
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <Repeat className="w-10 h-10 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Conversion Tools</h1>
      </div>
      <p className="text-lg text-gray-600">
        Easily convert between units for temperature, length, weight, and more.
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
            <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
              {calc.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default ConversionTools;