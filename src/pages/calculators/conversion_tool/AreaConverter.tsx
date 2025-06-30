import React, { useState } from "react";

const units = [
  { label: "Square meters (m²)", value: "m2" },
  { label: "Square kilometers (km²)", value: "km2" },
  { label: "Square centimeters (cm²)", value: "cm2" },
  { label: "Square millimeters (mm²)", value: "mm2" },
  { label: "Square miles (mi²)", value: "mi2" },
  { label: "Square yards (yd²)", value: "yd2" },
  { label: "Square feet (ft²)", value: "ft2" },
  { label: "Square inches (in²)", value: "in2" },
  { label: "Acres", value: "ac" },
  { label: "Hectares", value: "ha" },
];

const toM2 = {
  m2: 1,
  km2: 1e6,
  cm2: 0.0001,
  mm2: 0.000001,
  mi2: 2.59e6,
  yd2: 0.836127,
  ft2: 0.092903,
  in2: 0.00064516,
  ac: 4046.86,
  ha: 10000,
};

function convertArea(value: number, from: string, to: string): number {
  return value * toM2[from] / toM2[to];
}

const AreaConverter = () => {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("m2");
  const [to, setTo] = useState("ft2");
  const value = parseFloat(input);
  const result =
    input === "" || isNaN(value)
      ? ""
      : convertArea(value, from, to).toFixed(6);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Area Converter</h1>
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

export default AreaConverter;