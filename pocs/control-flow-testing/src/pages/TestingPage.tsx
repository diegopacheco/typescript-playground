import { useState, useCallback, useRef } from "react";
import { useFlow } from "../context/FlowContext";
import { TestResultsTable } from "../components/TestResultsTable";
import { generateAllTests } from "../engine/test-generator";
import { runTestsViaBackend } from "../engine/test-runner-client";
import type { TestCase } from "../types/flow";

export function TestingPage() {
  const { definition } = useFlow();
  const [tests, setTests] = useState<TestCase[]>([]);
  const [generated, setGenerated] = useState(false);
  const [running, setRunning] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const testsRef = useRef<TestCase[]>([]);

  const handleGenerate = useCallback(() => {
    const allTests = generateAllTests(definition);
    testsRef.current = allTests;
    setTests(allTests);
    setGenerated(true);
  }, [definition]);

  const handleRunAll = useCallback(async () => {
    setRunning(true);
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const snapshot = testsRef.current.map((t) => ({ ...t, status: "running" as const, actual: undefined, error: undefined }));
    setTests([...snapshot]);
    try {
      const results = await runTestsViaBackend(snapshot, definition, controller.signal);
      setTests(results);
    } catch (err: unknown) {
      if ((err as Error).name !== "AbortError") {
        setTests(snapshot.map((t) => ({ ...t, status: "failed" as const, actual: "fail" as const, error: (err as Error).message })));
      }
    }
    setRunning(false);
    abortControllerRef.current = null;
  }, [definition]);

  const handleStop = useCallback(() => {
    abortControllerRef.current?.abort();
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
          <span style={{ fontSize: "13px", color: "#6b7280" }}>Running tests on server...</span>
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
