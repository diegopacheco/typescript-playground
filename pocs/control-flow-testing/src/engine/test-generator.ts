import type { FlowDefinition, StepConfig, TestCase } from "../types/flow";
import { validateStepOutput } from "./flow-validator";

function getOrderedSteps(def: FlowDefinition): StepConfig[] {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const ordered: StepConfig[] = [];
  let current: string | null = def.steps[0]?.id;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    const step = stepMap.get(current);
    if (step) { ordered.push(step); current = step.next; } else break;
  }
  return ordered;
}

function generatePositiveTests(def: FlowDefinition): TestCase[] {
  const tests: TestCase[] = [];
  const ordered = getOrderedSteps(def);
  for (const step of ordered) {
    if (step.type === "single-select" && step.options) {
      for (const option of step.options) {
        tests.push({
          id: `pos-${step.id}-${option}`,
          name: `${step.name}: select "${option}"`,
          category: "positive",
          path: [step.id],
          input: { selected: option },
          expected: "pass",
          status: "pending",
        });
      }
    }
    if (step.type === "multi-select" && step.options) {
      tests.push({
        id: `pos-${step.id}-all`,
        name: `${step.name}: select all options`,
        category: "positive",
        path: [step.id],
        input: { selected: step.options },
        expected: "pass",
        status: "pending",
      });
      for (const option of step.options) {
        tests.push({
          id: `pos-${step.id}-${option}`,
          name: `${step.name}: select "${option}"`,
          category: "positive",
          path: [step.id],
          input: { selected: [option] },
          expected: "pass",
          status: "pending",
        });
      }
    }
    if (step.type === "form" && step.fields) {
      const validData: Record<string, string> = {};
      step.fields.forEach((f) => { validData[f.name] = `test-${f.name}`; });
      tests.push({
        id: `pos-${step.id}-valid`,
        name: `${step.name}: all fields filled`,
        category: "positive",
        path: [step.id],
        input: validData,
        expected: "pass",
        status: "pending",
      });
    }
  }
  return tests;
}

function generateNegativeTests(def: FlowDefinition): TestCase[] {
  const tests: TestCase[] = [];
  const ordered = getOrderedSteps(def);
  for (const step of ordered) {
    if (step.type === "single-select") {
      tests.push({
        id: `neg-${step.id}-empty`,
        name: `${step.name}: no selection`,
        category: "negative",
        path: [step.id],
        input: { selected: "" },
        expected: "fail",
        status: "pending",
      });
      tests.push({
        id: `neg-${step.id}-invalid`,
        name: `${step.name}: invalid option`,
        category: "negative",
        path: [step.id],
        input: { selected: "INVALID_OPTION" },
        expected: "fail",
        status: "pending",
      });
    }
    if (step.type === "multi-select") {
      tests.push({
        id: `neg-${step.id}-empty`,
        name: `${step.name}: no selection`,
        category: "negative",
        path: [step.id],
        input: { selected: [] },
        expected: "fail",
        status: "pending",
      });
      tests.push({
        id: `neg-${step.id}-invalid`,
        name: `${step.name}: invalid option in list`,
        category: "negative",
        path: [step.id],
        input: { selected: ["INVALID_OPTION"] },
        expected: "fail",
        status: "pending",
      });
    }
    if (step.type === "form" && step.fields) {
      const requiredFields = step.fields.filter((f) => f.required);
      for (const field of requiredFields) {
        const data: Record<string, string> = {};
        step.fields.forEach((f) => { data[f.name] = f.name === field.name ? "" : `test-${f.name}`; });
        tests.push({
          id: `neg-${step.id}-missing-${field.name}`,
          name: `${step.name}: missing required "${field.name}"`,
          category: "negative",
          path: [step.id],
          input: data,
          expected: "fail",
          status: "pending",
        });
      }
    }
  }
  return tests;
}

function generatePathTests(def: FlowDefinition): TestCase[] {
  const ordered = getOrderedSteps(def);
  const path = ordered.map((s) => s.id);
  const input: Record<string, unknown> = {};
  for (const step of ordered) {
    if (step.type === "single-select" && step.options) input[step.id] = { selected: step.options[0] };
    if (step.type === "multi-select" && step.options) input[step.id] = { selected: [step.options[0]] };
    if (step.type === "form" && step.fields) {
      const data: Record<string, string> = {};
      step.fields.forEach((f) => { data[f.name] = `test-${f.name}`; });
      input[step.id] = data;
    }
  }
  return [
    {
      id: "path-full-valid",
      name: "Full flow: valid path end-to-end",
      category: "path",
      path,
      input,
      expected: "pass",
      status: "pending",
    },
  ];
}

function generateCombinatorialTests(def: FlowDefinition): TestCase[] {
  const tests: TestCase[] = [];
  const selectSteps = def.steps.filter((s) => s.type === "single-select" && s.options);
  if (selectSteps.length < 2) return tests;

  const s1 = selectSteps[0];
  const s2 = selectSteps[1];
  if (!s1.options || !s2.options) return tests;

  for (const o1 of s1.options) {
    for (const o2 of s2.options) {
      tests.push({
        id: `combo-${s1.id}-${o1}-${s2.id}-${o2}`,
        name: `Combo: ${s1.name}="${o1}" + ${s2.name}="${o2}"`,
        category: "combinatorial",
        path: [s1.id, s2.id],
        input: { [s1.id]: { selected: o1 }, [s2.id]: { selected: o2 } },
        expected: "pass",
        status: "pending",
      });
    }
  }
  return tests;
}

function generateBoundaryTests(def: FlowDefinition): TestCase[] {
  const tests: TestCase[] = [];
  for (const step of def.steps) {
    if (step.type === "form" && step.fields) {
      const data: Record<string, string> = {};
      step.fields.forEach((f) => { data[f.name] = "x".repeat(1000); });
      tests.push({
        id: `boundary-${step.id}-long`,
        name: `${step.name}: very long input`,
        category: "boundary",
        path: [step.id],
        input: data,
        expected: "pass",
        status: "pending",
      });
      const specialData: Record<string, string> = {};
      step.fields.forEach((f) => { specialData[f.name] = '<script>alert("xss")</script>'; });
      tests.push({
        id: `boundary-${step.id}-special`,
        name: `${step.name}: special characters`,
        category: "boundary",
        path: [step.id],
        input: specialData,
        expected: "pass",
        status: "pending",
      });
    }
  }
  return tests;
}

export function generateAllTests(def: FlowDefinition): TestCase[] {
  return [
    ...generatePathTests(def),
    ...generatePositiveTests(def),
    ...generateNegativeTests(def),
    ...generateCombinatorialTests(def),
    ...generateBoundaryTests(def),
  ];
}

export function runTest(test: TestCase, def: FlowDefinition): TestCase {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));

  if (test.category === "path") {
    const inputMap = test.input as Record<string, Record<string, unknown>>;
    for (const stepId of test.path) {
      const step = stepMap.get(stepId);
      if (!step || step.type === "summary") continue;
      const data = inputMap[stepId];
      if (!data) return { ...test, status: "failed", actual: "fail", error: `No input for step ${stepId}` };
      const errors = validateStepOutput(step, { stepId, data, valid: true, errors: [] });
      if (errors.length > 0) {
        return { ...test, status: "failed", actual: "fail", error: errors.join(", ") };
      }
    }
    return { ...test, status: "passed", actual: "pass" };
  }

  if (test.category === "combinatorial") {
    const inputMap = test.input as Record<string, Record<string, unknown>>;
    for (const stepId of test.path) {
      const step = stepMap.get(stepId);
      if (!step) continue;
      const data = inputMap[stepId];
      const errors = validateStepOutput(step, { stepId, data, valid: true, errors: [] });
      if (errors.length > 0) {
        return { ...test, status: "failed", actual: "fail", error: errors.join(", ") };
      }
    }
    return { ...test, status: "passed", actual: "pass" };
  }

  const stepId = test.path[0];
  const step = stepMap.get(stepId);
  if (!step) return { ...test, status: "failed", actual: "fail", error: "Step not found" };

  const errors = validateStepOutput(step, { stepId, data: test.input, valid: true, errors: [] });
  const passed = errors.length === 0;
  const actual = passed ? "pass" : "fail";
  const testPassed = actual === test.expected;

  return {
    ...test,
    status: testPassed ? "passed" : "failed",
    actual,
    error: testPassed ? undefined : `Expected ${test.expected} but got ${actual}. ${errors.join(", ")}`,
  };
}
