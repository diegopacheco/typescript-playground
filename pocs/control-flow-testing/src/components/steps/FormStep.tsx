import { useState } from "react";
import type { StepConfig } from "../../types/flow";

interface Props {
  step: StepConfig;
  initialValue?: Record<string, unknown>;
  onComplete: (data: Record<string, unknown>) => void;
}

export function FormStep({ step, initialValue, onComplete }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    step.fields?.forEach((f) => {
      init[f.name] = (initialValue?.[f.name] as string) || "";
    });
    return init;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    step.fields?.forEach((f) => {
      if (f.required && !values[f.name]?.trim()) {
        newErrors[f.name] = `${f.name} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onComplete(values);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3>{step.name}</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "16px" }}>
        {step.fields?.map((field) => (
          <div key={field.name}>
            <label style={{ display: "block", marginBottom: "4px", fontWeight: 500, fontSize: "14px" }}>
              {field.name} {field.required && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <input
              type={field.type}
              value={values[field.name] || ""}
              onChange={(e) => setValues((prev) => ({ ...prev, [field.name]: e.target.value }))}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: errors[field.name] ? "2px solid #ef4444" : "2px solid #e5e7eb",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
            {errors[field.name] && (
              <p style={{ color: "#ef4444", fontSize: "12px", marginTop: "4px" }}>{errors[field.name]}</p>
            )}
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        style={{
          marginTop: "20px",
          padding: "10px 24px",
          background: "#4f46e5",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Confirm
      </button>
    </div>
  );
}
