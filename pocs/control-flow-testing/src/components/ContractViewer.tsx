import { StepConfig } from "../types/flow";

interface Props {
  steps: StepConfig[];
}

function getInputContract(step: StepConfig): string {
  switch (step.type) {
    case "single-select":
      return `{ options: [${step.options?.map((o) => `"${o}"`).join(", ")}] }`;
    case "multi-select":
      return `{ options: [${step.options?.map((o) => `"${o}"`).join(", ")}] }`;
    case "form":
      return `{ fields: [${step.fields?.map((f) => `{ name: "${f.name}", type: "${f.type}", required: ${f.required} }`).join(", ")}] }`;
    case "summary":
      return "{ allData: Record<string, Record<string, unknown>> }";
    default:
      return "unknown";
  }
}

function getOutputContract(step: StepConfig): string {
  switch (step.type) {
    case "single-select":
      return `{ selected: ${step.options?.map((o) => `"${o}"`).join(" | ")} }`;
    case "multi-select":
      return `{ selected: Array<${step.options?.map((o) => `"${o}"`).join(" | ")}> }`;
    case "form":
      return `{ ${step.fields?.map((f) => `${f.name}: string`).join("; ")} }`;
    case "summary":
      return "void";
    default:
      return "unknown";
  }
}

export function ContractViewer({ steps }: Props) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {steps.map((step) => (
        <div
          key={step.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 16px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <strong>{step.name}</strong>
              <span style={{ fontSize: "12px", color: "#6b7280", background: "#e5e7eb", padding: "2px 8px", borderRadius: "4px" }}>
                {step.type}
              </span>
              <span style={{ fontSize: "12px", color: "#6b7280" }}>
                id: {step.id} | order: {step.order}
              </span>
            </div>
          </div>
          <div style={{ padding: "12px 16px" }}>
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#4f46e5", marginBottom: "4px" }}>INPUT</div>
              <pre style={{ fontSize: "12px", background: "#f0fdf4", padding: "8px 12px", borderRadius: "4px", margin: 0, overflow: "auto" }}>
                {getInputContract(step)}
              </pre>
            </div>
            <div>
              <div style={{ fontSize: "12px", fontWeight: 600, color: "#059669", marginBottom: "4px" }}>OUTPUT</div>
              <pre style={{ fontSize: "12px", background: "#eef2ff", padding: "8px 12px", borderRadius: "4px", margin: 0, overflow: "auto" }}>
                {getOutputContract(step)}
              </pre>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
