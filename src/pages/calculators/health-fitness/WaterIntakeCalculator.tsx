import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const WaterIntakeCalculator: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    if (!isNaN(w) && w > 0) {
      // General guideline: 35 ml per kg body weight
      setResult(Math.round(w * 35));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-xl shadow">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/health-fitness" className="hover:text-blue-600 transition-colors">Health Calculators</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Water Intake Calculator</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Water Intake Calculator</h1>
      <p className="text-gray-600 mb-4">
        Estimate your daily water needs. A common guideline is 35 ml per kg of body weight.
      </p>
      <form onSubmit={calculate}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Weight (kg)</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={weight} onChange={e => setWeight(e.target.value)} min={1} required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate</button>
      </form>
      {result !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded text-blue-800 font-semibold">
          Recommended Daily Water Intake: {result} ml
          <div className="mt-2 text-blue-900 font-normal text-sm">
            This is a general guideline. Actual needs may vary based on activity, climate, and health. Consult your doctor for personalized advice.
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterIntakeCalculator;