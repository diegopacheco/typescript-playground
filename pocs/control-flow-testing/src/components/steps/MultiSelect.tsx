import { useState } from "react";
import type { StepConfig } from "../../types/flow";

interface Props {
  step: StepConfig;
  initialValue?: string[];
  onComplete: (data: Record<string, unknown>) => void;
}

export function MultiSelect({ step, initialValue, onComplete }: Props) {
  const [selected, setSelected] = useState<string[]>(initialValue || []);

  const toggle = (option: string) => {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    );
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>{step.name}</h3>
      <p style={{ color: "#6b7280", fontSize: "14px" }}>Select one or more</p>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
        {step.options?.map((option) => (
          <label
            key={option}
            style={{
              padding: "12px 16px",
              border: selected.includes(option) ? "2px solid #4f46e5" : "2px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              background: selected.includes(option) ? "#eef2ff" : "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <button
        onClick={() => onComplete({ selected })}
        disabled={selected.length === 0}
        style={{
          marginTop: "20px",
          padding: "10px 24px",
          background: selected.length > 0 ? "#4f46e5" : "#d1d5db",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: selected.length > 0 ? "pointer" : "not-allowed",
          fontSize: "14px",
        }}
      >
        Confirm
      </button>
    </div>
  );
}
