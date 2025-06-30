import React, { useState } from "react";

const units = [
  { label: "Liters (L)", value: "L" },
  { label: "Milliliters (mL)", value: "mL" },
  { label: "Cubic meters (m³)", value: "m3" },
  { label: "Cubic centimeters (cm³)", value: "cm3" },
  { label: "Gallons (US)", value: "gal" },
  { label: "Quarts (US)", value: "qt" },
  { label: "Pints (US)", value: "pt" },
  { label: "Cups (US)", value: "cup" },
  { label: "Fluid ounces (US)", value: "fl_oz" },
];

const toLiter = {
  L: 1,
  mL: 0.001,
  m3: 1000,
  cm3: 0.001,
  gal: 3.78541,
  qt: 0.946353,
  pt: 0.473176,
  cup: 0.24,
  fl_oz: 0.0295735,
};

function convertVolume(value: number, from: string, to: string): number {
  return value * toLiter[from] / toLiter[to];
}

const VolumeConverter = () => {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("L");
  const [to, setTo] = useState("gal");
  const value = parseFloat(input);
  const result =
    input === "" || isNaN(value)
      ? ""
      : convertVolume(value, from, to).toFixed(6);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Volume Converter</h1>
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

export default VolumeConverter; 