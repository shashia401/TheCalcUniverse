import React, { useState } from "react";

const units = [
  { label: "Kilograms (kg)", value: "kg" },
  { label: "Grams (g)", value: "g" },
  { label: "Milligrams (mg)", value: "mg" },
  { label: "Pounds (lb)", value: "lb" },
  { label: "Ounces (oz)", value: "oz" },
  { label: "Tons (t)", value: "t" },
];

const toKg = {
  kg: 1,
  g: 0.001,
  mg: 0.000001,
  lb: 0.45359237,
  oz: 0.0283495231,
  t: 1000,
};

function convertWeight(value: number, from: string, to: string): number {
  return value * toKg[from] / toKg[to];
}

const WeightConverter = () => {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("kg");
  const [to, setTo] = useState("lb");
  const value = parseFloat(input);
  const result =
    input === "" || isNaN(value)
      ? ""
      : convertWeight(value, from, to).toFixed(6);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Weight Converter</h1>
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

export default WeightConverter;