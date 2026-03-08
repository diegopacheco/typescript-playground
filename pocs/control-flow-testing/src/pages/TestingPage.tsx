import { useState, useCallback } from "react";
import { useFlow } from "../context/FlowContext";
import { TestResultsTable } from "../components/TestResultsTable";
import { generateAllTests, runTest } from "../engine/test-generator";
import type { TestCase } from "../types/flow";

export function TestingPage() {
  const { definition } = useFlow();
  const [tests, setTests] = useState<TestCase[]>([]);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = useCallback(() => {
    const allTests = generateAllTests(definition);
    setTests(allTests);
    setGenerated(true);
  }, [definition]);

  const handleRunAll = useCallback(() => {
    setTests((prev) => prev.map((t) => runTest(t, definition)));
  }, [definition]);

  const passed = tests.filter((t) => t.status === "passed").length;
  const failed = tests.filter((t) => t.status === "failed").length;
  const pending = tests.filter((t) => t.status === "pending").length;

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={handleGenerate}
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
          Generate Tests
        </button>
        {generated && (
          <button
            onClick={handleRunAll}
            style={{
              padding: "8px 20px",
              background: "#059669",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Run All
          </button>
        )}
        {tests.length > 0 && (
          <div style={{ display: "flex", gap: "16px", marginLeft: "auto", fontSize: "13px" }}>
            <span>Total: <strong>{tests.length}</strong></span>
            <span style={{ color: "#16a34a" }}>Passed: <strong>{passed}</strong></span>
            <span style={{ color: "#dc2626" }}>Failed: <strong>{failed}</strong></span>
            <span style={{ color: "#6b7280" }}>Pending: <strong>{pending}</strong></span>
          </div>
        )}
      </div>
      {tests.length > 0 ? (
        <TestResultsTable tests={tests} />
      ) : (
        <div style={{ textAlign: "center", padding: "60px", color: "#9ca3af" }}>
          Click "Generate Tests" to create test cases from the current flow definition
        </div>
      )}
    </div>
  );
}
