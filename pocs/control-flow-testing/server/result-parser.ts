import type { TestCase } from "../src/types/flow.ts";

interface JestAssertionResult {
  fullName: string;
  status: "passed" | "failed" | "pending";
  failureMessages: string[];
}

interface JestTestResult {
  testResults: Array<{
    assertionResults: JestAssertionResult[];
  }>;
}

export function parseResults(jestJson: JestTestResult, originalTests: TestCase[]): TestCase[] {
  const resultMap = new Map<string, JestAssertionResult>();
  for (const suite of jestJson.testResults || []) {
    for (const assertion of suite.assertionResults || []) {
      resultMap.set(assertion.fullName, assertion);
    }
  }

  return originalTests.map((tc) => {
    const result = resultMap.get(tc.id);
    if (!result) {
      return { ...tc, status: "failed" as const, actual: "fail" as const, error: "Test not found in results" };
    }
    if (result.status === "passed") {
      return { ...tc, status: "passed" as const, actual: "pass" as const };
    }
    const errMsg = result.failureMessages?.[0]?.split("\n")[0]?.substring(0, 200) || "Test failed";
    return { ...tc, status: "failed" as const, actual: "fail" as const, error: errMsg };
  });
}
