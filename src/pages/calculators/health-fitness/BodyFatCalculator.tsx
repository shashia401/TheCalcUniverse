import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const BodyFatCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [neck, setNeck] = useState('');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [advice, setAdvice] = useState<string>('');

  // Reference ranges (approximate, for adults)
  const fatRanges = {
    male: { low: 6, high: 24 },    // 6-24% is normal for men
    female: { low: 14, high: 31 }, // 14-31% is normal for women
  };

  // U.S. Navy Method
  const calculateBodyFat = (e: React.FormEvent) => {
    e.preventDefault();
    const h = parseFloat(height);
    const n = parseFloat(neck);
    const w = parseFloat(waist);
    const hp = parseFloat(hip);

    let bodyFat = 0;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(w - n) + 0.15456 * Math.log10(h)) - 450;
    } else if (gender === 'female') {
      bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(w + hp - n) + 0.22100 * Math.log10(h)) - 450;
    }
    const rounded = Number.isFinite(bodyFat) ? parseFloat(bodyFat.toFixed(2)) : null;
    setResult(rounded);

        // Give advice based on result
    if (rounded !== null && gender) {
      if (rounded > fatRanges[gender as 'male' | 'female'].high) {
        setAdvice(
          "Your body fat percentage is above the recommended range. Consider regular exercise, a balanced diet, and consulting a healthcare professional for personalized fat loss strategies."
        );
      } else if (rounded < fatRanges[gender as 'male' | 'female'].low) {
        setAdvice(
          "Your body fat percentage is below the recommended range. Low body fat can impact health. Ensure you're eating enough and maintaining a healthy weight. Consult a healthcare provider if needed."
        );
      } else {
        setAdvice(
          "Your body fat percentage is within the healthy range. Keep up your healthy habits and stay active!"
        );
      }
    } else {
      setAdvice('');
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
        <span className="text-gray-900 font-medium">Body Fat Calculator</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Body Fat Calculator</h1>
      <p className="text-gray-600 mb-4">
        Estimate your body fat percentage using the U.S. Navy Method. Enter your age, gender, and measurements in centimeters. For females, hip measurement is required.
      </p>
      <form onSubmit={calculateBodyFat}>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Age</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={age}
            onChange={e => setAge(e.target.value)}
            min={1}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Gender</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={gender}
            onChange={e => setGender(e.target.value)}
            required
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Height (cm)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={height}
            onChange={e => setHeight(e.target.value)}
            min={1}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Neck circumference (cm)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={neck}
            onChange={e => setNeck(e.target.value)}
            min={1}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Waist circumference (cm)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={waist}
            onChange={e => setWaist(e.target.value)}
            min={1}
            required
          />
        </div>
        {gender === 'female' && (
          <div className="mb-4">
            <label className="block mb-1 font-medium">Hip circumference (cm)</label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={hip}
              onChange={e => setHip(e.target.value)}
              min={1}
              required
            />
          </div>
        )}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Calculate
        </button>
      </form>
      {result !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded text-blue-800 font-semibold">
          Estimated Body Fat: {result}% 
          <div className="mt-2 text-sm text-blue-900 font-normal">{advice}</div>
        </div>
      )}
    </div>
  );
};

export default BodyFatCalculator;