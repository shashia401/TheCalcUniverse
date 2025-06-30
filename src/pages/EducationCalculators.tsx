import React from "react";
import { Link } from "react-router-dom";
import { Home, ChevronRight, BookOpen, GraduationCap, Calculator, Clock } from "lucide-react";

const calculators = [
  {
    name: "Grade Calculator",
    path: "/grade-calculator",
    description: "Calculate your course grade",
    icon: Calculator,
    color: "from-blue-500 to-blue-600",
  },
  {
    name: "GPA Calculator",
    path: "/gpa-calculator",
    description: "Calculate your GPA",
    icon: GraduationCap,
    color: "from-green-500 to-green-600",
  },
  {
    name: "Test Score Calculator",
    path: "/test-score-calculator",
    description: "Find your test percentage",
    icon: BookOpen,
    color: "from-yellow-500 to-yellow-600",
  },
  {
    name: "Study Time Calculator",
    path: "/study-time-calculator",
    description: "Plan your study sessions",
    icon: Clock,
    color: "from-indigo-500 to-indigo-600",
  },
  {
    name: "Reading Time Calculator",
    path: "/reading-time-calculator",
    description: "Estimate reading time",
    icon: BookOpen,
    color: "from-pink-500 to-pink-600",
  },
];

const EducationCalculators: React.FC = () => (
  <div className="max-w-7xl mx-auto">
    {/* Breadcrumb */}
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
        <Home className="w-4 h-4 mr-1" />
        Home
      </Link>
      <ChevronRight className="w-4 h-4" />
      <span className="text-gray-900 font-medium">Education Calculators</span>
    </nav>

    {/* Header Section */}
    <div className="text-center mb-12">
      <div className="flex items-center justify-center mb-4">
        <GraduationCap className="w-10 h-10 text-green-600 mr-2" />
        <h1 className="text-3xl font-bold text-gray-900">Education Calculators</h1>
      </div>
      <p className="text-lg text-gray-600">
        Tools to help you succeed in your studies and exams.
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
            <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors mb-2">
              {calc.name}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{calc.description}</p>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default EducationCalculators;