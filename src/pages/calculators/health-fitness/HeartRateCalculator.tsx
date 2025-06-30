import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const HeartRateCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [resting, setResting] = useState('');
  const [maxHR, setMaxHR] = useState<number | null>(null);
  const [targetZone, setTargetZone] = useState<{low: number, high: number} | null>(null);

  const calculate = (e: React.FormEvent) => {
    e.preventDefault();
    const a = parseInt(age);
    const r = parseInt(resting);
    if (!isNaN(a)) {
      const max = 220 - a;
      setMaxHR(max);
      if (!isNaN(r)) {
        // Karvonen formula for target zone (50-85%)
        setTargetZone({
          low: Math.round(((max - r) * 0.5) + r),
          high: Math.round(((max - r) * 0.85) + r)
        });
      } else {
        setTargetZone(null);
      }
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
        <span className="text-gray-900 font-medium">Heart Rate Calculator</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Heart Rate Calculator</h1>
      <p className="text-gray-600 mb-4">
        Calculate your estimated maximum heart rate and target exercise heart rate zone.
      </p>
      <form onSubmit={calculate}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Age</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={age} onChange={e => setAge(e.target.value)} min={1} required />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Resting Heart Rate (optional)</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={resting} onChange={e => setResting(e.target.value)} min={1} />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Calculate</button>
      </form>
      {maxHR !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded text-blue-800 font-semibold">
          Max Heart Rate: {maxHR} bpm
          {targetZone && (
            <div className="mt-2 text-blue-900 font-normal">
              Target Zone: {targetZone.low} - {targetZone.high} bpm (50-85% of max)
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HeartRateCalculator;