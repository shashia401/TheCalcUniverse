import React, { useState } from "react";

const units = [
  { label: "Meters (m)", value: "m" },
  { label: "Kilometers (km)", value: "km" },
  { label: "Centimeters (cm)", value: "cm" },
  { label: "Millimeters (mm)", value: "mm" },
  { label: "Miles (mi)", value: "mi" },
  { label: "Yards (yd)", value: "yd" },
  { label: "Feet (ft)", value: "ft" },
  { label: "Inches (in)", value: "in" },
];

const toMeters = {
  m: 1,
  km: 1000,
  cm: 0.01,
  mm: 0.001,
  mi: 1609.344,
  yd: 0.9144,
  ft: 0.3048,
  in: 0.0254,
};

function convertLength(value: number, from: string, to: string): number {
  return value * toMeters[from] / toMeters[to];
}

const LengthConverter = () => {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("m");
  const [to, setTo] = useState("km");
  const value = parseFloat(input);
  const result =
    input === "" || isNaN(value)
      ? ""
      : convertLength(value, from, to).toFixed(6);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Length Converter</h1>
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

export default LengthConverter; 