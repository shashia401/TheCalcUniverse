import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Home, ChevronRight, ArrowLeftRight } from 'lucide-react';

const UnitConverter: React.FC = () => {
  const [category, setCategory] = useState('length');
  const [fromValue, setFromValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const conversions = {
    length: {
      meter: 1,
      kilometer: 0.001,
      centimeter: 100,
      millimeter: 1000,
      inch: 39.3701,
      foot: 3.28084,
      yard: 1.09361,
      mile: 0.000621371,
    },
    weight: {
      kilogram: 1,
      gram: 1000,
      pound: 2.20462,
      ounce: 35.274,
      ton: 0.001,
      stone: 0.157473,
    },
    temperature: {
      celsius: (val: number, to: string) => {
        if (to === 'fahrenheit') return (val * 9/5) + 32;
        if (to === 'kelvin') return val + 273.15;
        return val;
      },
      fahrenheit: (val: number, to: string) => {
        if (to === 'celsius') return (val - 32) * 5/9;
        if (to === 'kelvin') return (val - 32) * 5/9 + 273.15;
        return val;
      },
      kelvin: (val: number, to: string) => {
        if (to === 'celsius') return val - 273.15;
        if (to === 'fahrenheit') return (val - 273.15) * 9/5 + 32;
        return val;
      },
    },
    volume: {
      liter: 1,
      milliliter: 1000,
      gallon: 0.264172,
      quart: 1.05669,
      pint: 2.11338,
      cup: 4.22675,
      'fluid ounce': 33.814,
    },
    area: {
      'square meter': 1,
      'square kilometer': 0.000001,
      'square centimeter': 10000,
      'square foot': 10.7639,
      'square inch': 1550,
      acre: 0.000247105,
      hectare: 0.0001,
    },
  };

  const categories = {
    length: { name: 'Length', units: Object.keys(conversions.length) },
    weight: { name: 'Weight', units: Object.keys(conversions.weight) },
    temperature: { name: 'Temperature', units: Object.keys(conversions.temperature) },
    volume: { name: 'Volume', units: Object.keys(conversions.volume) },
    area: { name: 'Area', units: Object.keys(conversions.area) },
  };

  useEffect(() => {
    const units = categories[category as keyof typeof categories].units;
    setFromUnit(units[0]);
    setToUnit(units[1]);
    setResult(null);
  }, [category]);

  useEffect(() => {
    if (fromValue && fromUnit && toUnit) {
      convertUnits();
    }
  }, [fromValue, fromUnit, toUnit, category]);

  const convertUnits = () => {
    const value = parseFloat(fromValue);
    if (isNaN(value)) return;

    if (category === 'temperature') {
      const tempConversions = conversions.temperature as any;
      const convertedValue = tempConversions[fromUnit](value, toUnit);
      setResult(convertedValue);
    } else {
      const categoryConversions = conversions[category as keyof typeof conversions] as any;
      const baseValue = value / categoryConversions[fromUnit];
      const convertedValue = baseValue * categoryConversions[toUnit];
      setResult(convertedValue);
    }
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
  };

  const formatResult = (value: number) => {
    if (Math.abs(value) >= 1000000) {
      return value.toExponential(6);
    }
    return parseFloat(value.toFixed(8)).toString();
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link to="/" className="hover:text-blue-600 transition-colors flex items-center">
          <Home className="w-4 h-4 mr-1" />
          Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link to="/conversion-tools" className="hover:text-blue-600 transition-colors">Conversion Tools</Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium">Unit Converter</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Converter */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex items-center mb-6">
              <ArrowLeftRight className="w-8 h-8 text-purple-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">Unit Converter</h1>
            </div>

            {/* Category Selection */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Conversion Category
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {Object.entries(categories).map(([key, cat]) => (
                  <button
                    key={key}
                    onClick={() => setCategory(key)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      category === key
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <div className="text-sm font-medium">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Conversion Interface */}
            <div className="space-y-6">
              {/* From */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From
                  </label>
                  <input
                    type="number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    placeholder="Enter value"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={fromUnit}
                    onChange={(e) => setFromUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  >
                    {categories[category as keyof typeof categories].units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center">
                <button
                  onClick={swapUnits}
                  className="p-3 bg-purple-100 hover:bg-purple-200 rounded-full transition-colors"
                >
                  <ArrowLeftRight className="w-6 h-6 text-purple-600" />
                </button>
              </div>

              {/* To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg text-lg">
                    {result !== null ? formatResult(result) : '0'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit
                  </label>
                  <select
                    value={toUnit}
                    onChange={(e) => setToUnit(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
                  >
                    {categories[category as keyof typeof categories].units.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit.charAt(0).toUpperCase() + unit.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Result Display */}
              {result !== null && fromValue && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6">
                  <div className="text-center">
                    <div className="text-lg text-gray-600 mb-2">Conversion Result</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {fromValue} {fromUnit} = {formatResult(result)} {toUnit}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Panel */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conversion Categories</h2>
            <div className="space-y-3 text-sm">
              {Object.entries(categories).map(([key, cat]) => (
                <div key={key} className={`p-3 rounded-lg ${category === key ? 'bg-purple-50' : 'bg-gray-50'}`}>
                  <h3 className="font-semibold text-gray-800">{cat.name}</h3>
                  <p className="text-gray-600">{cat.units.length} units available</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">Common Conversions</h3>
            <div className="space-y-2 text-blue-800 text-sm">
              <div>• 1 meter = 3.28 feet</div>
              <div>• 1 kilogram = 2.20 pounds</div>
              <div>• 1 liter = 0.26 gallons</div>
              <div>• 0°C = 32°F = 273.15K</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Features</h3>
            <ul className="text-green-800 text-sm space-y-2">
              <li>• High precision calculations</li>
              <li>• Multiple unit categories</li>
              <li>• Instant conversion</li>
              <li>• Bidirectional conversion</li>
              <li>• Scientific notation support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitConverter;