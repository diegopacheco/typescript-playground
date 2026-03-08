import { useState } from "react";
import { StepConfig } from "../../types/flow";

interface Props {
  step: StepConfig;
  initialValue?: string;
  onComplete: (data: Record<string, unknown>) => void;
}

export function SingleSelect({ step, initialValue, onComplete }: Props) {
  const [selected, setSelected] = useState<string>(initialValue || "");

  return (
    <div style={{ padding: "20px" }}>
      <h3>{step.name}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
        {step.options?.map((option) => (
          <label
            key={option}
            style={{
              padding: "12px 16px",
              border: selected === option ? "2px solid #4f46e5" : "2px solid #e5e7eb",
              borderRadius: "8px",
              cursor: "pointer",
              background: selected === option ? "#eef2ff" : "#fff",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <input
              type="radio"
              name={step.id}
              value={option}
              checked={selected === option}
              onChange={() => setSelected(option)}
            />
            {option}
          </label>
        ))}
      </div>
      <button
        onClick={() => onComplete({ selected })}
        disabled={!selected}
        style={{
          marginTop: "20px",
          padding: "10px 24px",
          background: selected ? "#4f46e5" : "#d1d5db",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: selected ? "pointer" : "not-allowed",
          fontSize: "14px",
        }}
      >
        Confirm
      </button>
    </div>
  );
}
