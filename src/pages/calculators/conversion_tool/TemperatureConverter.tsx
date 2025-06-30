import React, { useState } from "react";

const units = [
  { label: "Celsius (°C)", value: "C" },
  { label: "Fahrenheit (°F)", value: "F" },
  { label: "Kelvin (K)", value: "K" },
];

function convertTemperature(value: number, from: string, to: string): number {
  if (from === to) return value;
  let celsius: number;
  // Convert from source to Celsius
  if (from === "C") celsius = value;
  else if (from === "F") celsius = (value - 32) * (5 / 9);
  else celsius = value - 273.15;
  // Convert from Celsius to target
  if (to === "C") return celsius;
  if (to === "F") return celsius * (9 / 5) + 32;
  return celsius + 273.15;
}

const TemperatureConverter = () => {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("C");
  const [to, setTo] = useState("F");
  const value = parseFloat(input);
  const result =
    input === "" || isNaN(value)
      ? ""
      : convertTemperature(value, from, to).toFixed(2);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Temperature Converter</h1>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block mb-1 font-medium">Value</label>
          <input
            type="number"
            value={input}
            onChange={e => setInput(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            placeholder="Enter value"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">From</label>
          <select
            value={from}
            onChange={e => setFrom(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            {units.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">To</label>
          <select
            value={to}
            onChange={e => setTo(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          >
            {units.map(u => (
              <option key={u.value} value={u.value}>{u.label}</option>
            ))}
          </select>
        </div>
      </form>
      {result !== "" && (
        <div className="mt-6 text-xl font-semibold">
          Result: <span className="text-blue-700">{result}</span>
        </div>
      )}
    </div>
  );
};

export default TemperatureConverter;