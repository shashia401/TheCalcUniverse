
import React, { useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight } from 'lucide-react';

const activityLevels = [
  { label: 'Sedentary (little or no exercise)', value: 1.2 },
  { label: 'Lightly active (light exercise/sports 1-3 days/week)', value: 1.375 },
  { label: 'Moderately active (moderate exercise/sports 3-5 days/week)', value: 1.55 },
  { label: 'Very active (hard exercise/sports 6-7 days a week)', value: 1.725 },
  { label: 'Super active (very hard exercise & physical job)', value: 1.9 },
];

const CalorieCalculator: React.FC = () => {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState(activityLevels[0].value);
  const [result, setResult] = useState<number | null>(null);
  const [advice, setAdvice] = useState<ReactNode>(''); // <-- Change here

  const calculateCalories = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * w + 6.25 * h - 5 * a + 5;
    } else if (gender === 'female') {
      bmr = 10 * w + 6.25 * h - 5 * a - 161;
    }
    const tdee = bmr * Number(activity);
    const rounded = Number.isFinite(tdee) ? Math.round(tdee) : null;
    setResult(rounded);

    // Give advice based on result
    if (rounded) {
      setAdvice(
        <>
          <div>
            <strong>Tips for Weight Loss:</strong>
            <ul className="list-disc ml-5">
              <li>Reduce your daily calorie intake by 500-750 kcal for gradual weight loss.</li>
              <li>Focus on whole foods: fruits, vegetables, lean proteins, and whole grains.</li>
              <li>Increase your physical activity—aim for at least 150 minutes of moderate exercise per week.</li>
              <li>Stay hydrated and get enough sleep.</li>
            </ul>
          </div>
          <div className="mt-2">
            <strong>Tips for Weight Gain:</strong>
            <ul className="list-disc ml-5">
              <li>Increase your calorie intake by 300-500 kcal above your daily needs.</li>
              <li>Choose nutrient-dense foods like nuts, seeds, dairy, and healthy oils.</li>
              <li>Incorporate strength training to build muscle mass.</li>
              <li>Eat more frequent, balanced meals throughout the day.</li>
            </ul>
          </div>
          <div className="mt-2">
            <em>Always consult a healthcare professional for personalized advice.</em>
          </div>
        </>
      );
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
        <span className="text-gray-900 font-medium">Calorie Calculator</span>
      </nav>
      <h1 className="text-2xl font-bold mb-4">Calorie Calculator</h1>
      <p className="text-gray-600 mb-4">
        Estimate your daily calorie needs based on your age, gender, weight, height, and activity level. This helps you plan for weight loss, maintenance, or gain.
      </p>
      <form onSubmit={calculateCalories}>
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
          <label className="block mb-1 font-medium">Weight (kg)</label>
          <input
            type="number"
            className="w-full border rounded px-3 py-2"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            min={1}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Activity Level</label>
          <select
            className="w-full border rounded px-3 py-2"
            value={activity}
            onChange={e => setActivity(Number(e.target.value))}
            required
          >
            {activityLevels.map((level, idx) => (
              <option key={idx} value={level.value}>
                {level.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Calculate
        </button>
      </form>
      {result !== null && (
        <div className="mt-6 p-4 bg-blue-50 rounded text-blue-800 font-semibold">
          Estimated Daily Calories: {result} kcal
          <div className="mt-4 text-sm text-blue-900 font-normal">{advice}</div>
        </div>
      )}
    </div>
  );
};

export default CalorieCalculator;