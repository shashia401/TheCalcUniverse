import React, { useState } from "react";

const units = [
  { label: "Meters/second (m/s)", value: "mps" },
  { label: "Kilometers/hour (km/h)", value: "kmph" },
  { label: "Miles/hour (mph)", value: "mph" },
  { label: "Feet/second (ft/s)", value: "fps" },
  { label: "Knots (kt)", value: "kt" },
];

const toMps = {
  mps: 1,
  kmph: 0.277778,
  mph: 0.44704,
  fps: 0.3048,
  kt: 0.514444,
};

function convertSpeed(value: number, from: string, to: string): number {
  return value * toMps[from] / toMps[to];
}

const SpeedConverter = () => {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("kmph");
  const [to, setTo] = useState("mph");
  const value = parseFloat(input);
  const result =
    input === "" || isNaN(value)
      ? ""
      : convertSpeed(value, from, to).toFixed(6);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Speed Converter</h1>
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

export default SpeedConverter;