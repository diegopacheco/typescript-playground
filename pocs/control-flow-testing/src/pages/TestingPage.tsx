import { useState, useCallback, useRef } from "react";
import { useFlow } from "../context/FlowContext";
import { TestResultsTable } from "../components/TestResultsTable";
import { generateAllTests } from "../engine/test-generator";
import { executeTest } from "../engine/test-executor";
import type { TestCase } from "../types/flow";

export function TestingPage() {
  const { definition } = useFlow();
  const [tests, setTests] = useState<TestCase[]>([]);
  const [generated, setGenerated] = useState(false);
  const [running, setRunning] = useState(false);
  const abortRef = useRef(false);

  const handleGenerate = useCallback(() => {
    const allTests = generateAllTests(definition);
    setTests(allTests);
    setGenerated(true);
    abortRef.current = false;
  }, [definition]);

  const handleRunAll = useCallback(async () => {
    setRunning(true);
    abortRef.current = false;
    const current: TestCase[] = tests.map((t) => ({ ...t, status: "pending" as const, actual: undefined, error: undefined }));
    setTests(current);
    for (let i = 0; i < current.length; i++) {
      if (abortRef.current) break;
      setTests((prev) => prev.map((t, idx) => idx === i ? { ...t, status: "running" } : t));
      const result = await executeTest(current[i], definition);
      current[i] = result;
      setTests((prev) => prev.map((t, idx) => idx === i ? result : t));
    }
    setRunning(false);
  }, [tests, definition]);

  const handleStop = useCallback(() => {
    abortRef.current = true;
  }, []);

  const passed = tests.filter((t) => t.status === "passed").length;
  const failed = tests.filter((t) => t.status === "failed").length;
  const pending = tests.filter((t) => t.status === "pending" || t.status === "running").length;

  return (
    <div>
      <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "20px" }}>
        <button
          onClick={handleGenerate}
          disabled={running}
          style={{
            padding: "8px 20px",
            background: running ? "#9ca3af" : "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: running ? "not-allowed" : "pointer",
            fontWeight: 600,
            fontSize: "13px",
          }}
        >
          Generate Tests
        </button>
        {generated && !running && (
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
        {running && (
          <button
            onClick={handleStop}
            style={{
              padding: "8px 20px",
              background: "#dc2626",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: 600,
              fontSize: "13px",
            }}
          >
            Stop
          </button>
        )}
        {running && (
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Running tests...</span>
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
