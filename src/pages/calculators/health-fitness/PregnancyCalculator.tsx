import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const PregnancyCalculator: React.FC = () => {
  const [lmp, setLmp] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);

  const calculateDueDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (lmp) {
      const lmpDate = new Date(lmp);
      lmpDate.setDate(lmpDate.getDate() + 280); // 40 weeks
      setDueDate(lmpDate.toLocaleDateString());
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
        <span className="text-gray-900 font-medium">Pregnancy Due Date Calculator</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Pregnancy Due Date Calculator</h1>
      <p className="text-gray-600 mb-4">
        Enter the first day of your last menstrual period (LMP) to estimate your due date.
      </p>
      <form onSubmit={calculateDueDate}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">First day of last menstrual period</label>
          <input type="date" className="w-full border rounded px-3 py-2" value={lmp} onChange={e => setLmp(e.target.value)} required />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate</button>
      </form>
      {dueDate && (
        <div className="mt-6 p-4 bg-blue-50 rounded text-blue-800 font-semibold">
          Estimated Due Date: {dueDate}
        </div>
      )}
    </div>
  );
};

export default PregnancyCalculator;