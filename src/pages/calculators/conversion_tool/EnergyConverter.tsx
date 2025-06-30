import React, { useState } from "react";

const units = [
  { label: "Joules (J)", value: "J" },
  { label: "Kilojoules (kJ)", value: "kJ" },
  { label: "Calories (cal)", value: "cal" },
  { label: "Kilocalories (kcal)", value: "kcal" },
  { label: "Watt-hours (Wh)", value: "Wh" },
  { label: "Kilowatt-hours (kWh)", value: "kWh" },
  { label: "Electronvolts (eV)", value: "eV" },
];

const toJoule = {
  J: 1,
  kJ: 1000,
  cal: 4.184,
  kcal: 4184,
  Wh: 3600,
  kWh: 3.6e6,
  eV: 1.60218e-19,
};

function convertEnergy(value: number, from: string, to: string): number {
  return value * toJoule[from] / toJoule[to];
}

const EnergyConverter = () => {
  const [input, setInput] = useState("");
  const [from, setFrom] = useState("J");
  const [to, setTo] = useState("kJ");
  const value = parseFloat(input);
  const result =
    input === "" || isNaN(value)
      ? ""
      : convertEnergy(value, from, to).toExponential(6);

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Energy Converter</h1>
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

export default EnergyConverter;