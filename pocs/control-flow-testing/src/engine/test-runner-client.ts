import type { TestCase, FlowDefinition } from "../types/flow";

export async function runTestsViaBackend(
  tests: TestCase[],
  definition: FlowDefinition,
  signal?: AbortSignal
): Promise<TestCase[]> {
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tests, definition }),
    signal,
  });
  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }
  const data = await res.json();
  return data.results;
}
