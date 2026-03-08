import { useState, useCallback } from "react";
import { useFlow } from "../context/FlowContext";
import { JsonEditor } from "../components/JsonEditor";
import { FlowGraph } from "../components/FlowGraph";
import { compileGraph } from "../engine/graph-compiler";
import { FlowDefinition, CompilationResult } from "../types/flow";

export function OrchestrationPage() {
  const { definition, setDefinition } = useFlow();
  const [jsonText, setJsonText] = useState(JSON.stringify(definition, null, 2));
  const [previewDef, setPreviewDef] = useState<FlowDefinition>(definition);
  const [parseError, setParseError] = useState(false);
  const [compilation, setCompilation] = useState<CompilationResult | null>(null);

  const handleJsonChange = useCallback((text: string) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text) as FlowDefinition;
      setPreviewDef(parsed);
      setParseError(false);
      setCompilation(null);
    } catch {
      setParseError(true);
    }
  }, []);

  const handleCompile = () => {
    try {
      const parsed = JSON.parse(jsonText) as FlowDefinition;
      const result = compileGraph(parsed);
      setCompilation(result);
      if (result.valid) {
        setDefinition(parsed);
      }
    } catch {
      setCompilation({ valid: false, errors: [{ message: "Invalid JSON" }], path: [] });
    }
  };

  const errorStepIds = compilation?.errors
    .filter((e) => e.stepId)
    .map((e) => e.stepId!) || [];

  return (
    <div style={{ display: "flex", gap: "20px", height: "calc(100vh - 120px)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <h3 style={{ margin: 0 }}>Flow JSON</h3>
          <button
            onClick={handleCompile}
            style={{
              padding: "8px 20px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Compile & Validate
          </button>
        </div>
        <JsonEditor value={jsonText} onChange={handleJsonChange} />
        {compilation && (
          <div
            style={{
              marginTop: "12px",
              padding: "12px 16px",
              borderRadius: "8px",
              background: compilation.valid ? "#f0fdf4" : "#fef2f2",
              border: compilation.valid ? "1px solid #22c55e" : "1px solid #ef4444",
            }}
          >
            <strong style={{ color: compilation.valid ? "#16a34a" : "#dc2626" }}>
              {compilation.valid ? "VALID" : "INVALID"}
            </strong>
            {compilation.valid && (
              <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#6b7280" }}>
                Path: {compilation.path.join(" → ")} → END
              </p>
            )}
            {compilation.errors.length > 0 && (
              <ul style={{ margin: "8px 0 0", paddingLeft: "20px", fontSize: "13px", color: "#dc2626" }}>
                {compilation.errors.map((e, i) => (
                  <li key={i}>{e.stepId ? `[${e.stepId}] ` : ""}{e.message}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ margin: "0 0 12px" }}>Live Preview</h3>
        <div
          style={{
            flex: 1,
            border: "2px solid #e5e7eb",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: parseError ? "#fef2f2" : "#fff",
            opacity: parseError ? 0.5 : 1,
          }}
        >
          {parseError ? (
            <p style={{ color: "#ef4444", fontWeight: 500 }}>Invalid JSON - fix to see preview</p>
          ) : (
            <FlowGraph definition={previewDef} errorStepIds={errorStepIds} mini />
          )}
        </div>
      </div>
    </div>
  );
}
