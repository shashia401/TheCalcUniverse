import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, Calendar, Clock, Globe2 } from "lucide-react";

const calculators = [
  {
    name: "Date Calculator",
    path: "/date-calculator",
    description: "Add or subtract days from a date",
    icon: Calendar,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "Age Calculator",
    path: "/age-calculator",
    description: "Calculate age from date of birth",
    icon: Calendar,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Time Zone Converter",
    path: "/time-zone-converter",
    description: "Convert time between time zones",
    icon: Globe2,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Business Days Calculator",
    path: "/business-days-calculator",
    description: "Count business days between dates",
    icon: Calendar,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    name: "Time Duration Calculator",
    path: "/time-duration-calculator",
    description: "Find the duration between two dates/times",
    icon: Clock,
    color: "from-pink-500 to-pink-600",
  },
  {
    name: "Countdown Calculator",
    path: "/countdown-calculator",
    description: "Countdown to a future date/time",
    icon: Clock,
    color: "from-purple-500 to-purple-600",
  },
];

const DateTimeCalculators: React.FC = () => (
  <div className="max-w-7xl mx-auto">
    {/* Breadcrumb */}
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Date &amp; Time Calculators</span>
    </nav>

    {/* Header Section */}
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <Calendar className="w-10 h-10 text-blue-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Date &amp; Time Calculators</h1>
      </div>
      <p className="text-lg text-gray-600">
        Tools for working with dates, times, durations, and time zones.
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

export default DateTimeCalculators;