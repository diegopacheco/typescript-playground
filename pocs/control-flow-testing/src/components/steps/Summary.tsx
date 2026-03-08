import { StepConfig } from "../../types/flow";

interface Props {
  step: StepConfig;
  allData: Record<string, Record<string, unknown>>;
  steps: StepConfig[];
}

export function Summary({ allData, steps }: Props) {
  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ color: "#059669", marginBottom: "20px" }}>Order Accepted</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {steps
          .filter((s) => s.type !== "summary")
          .map((s) => {
            const data = allData[s.id];
            if (!data) return null;
            return (
              <div
                key={s.id}
                style={{
                  padding: "12px 16px",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  background: "#f9fafb",
                }}
              >
                <strong style={{ fontSize: "14px", color: "#374151" }}>{s.name}</strong>
                <div style={{ marginTop: "8px", fontSize: "14px", color: "#6b7280" }}>
                  {Object.entries(data).map(([key, val]) => (
                    <div key={key}>
                      <span style={{ fontWeight: 500 }}>{key}:</span>{" "}
                      {Array.isArray(val) ? val.join(", ") : String(val)}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
