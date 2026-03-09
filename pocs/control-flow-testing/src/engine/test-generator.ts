import type { FlowDefinition, StepConfig, TestCase } from "../types/flow";

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

function generateRenderTests(def: FlowDefinition): TestCase[] {
  const ordered = getOrderedSteps(def);
  return ordered.map((step) => ({
    id: `render-${step.id}`,
    name: `Render: ${step.name} mounts with correct elements`,
    category: "render" as const,
    path: [step.id],
    input: {},
    expected: "pass" as const,
    status: "pending" as const,
  }));
}

function generatePositiveTests(def: FlowDefinition): TestCase[] {
  const tests: TestCase[] = [];
  const ordered = getOrderedSteps(def);
  for (const step of ordered) {
    if (step.type === "single-select" && step.options) {
      for (const option of step.options) {
        tests.push({
          id: `pos-${step.id}-${option}`,
          name: `${step.name}: select "${option}" and submit`,
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
        id: `pos-${step.id}-first`,
        name: `${step.name}: select "${step.options[0]}" and submit`,
        category: "positive",
        path: [step.id],
        input: { selected: [step.options[0]] },
        expected: "pass",
        status: "pending",
      });
      tests.push({
        id: `pos-${step.id}-all`,
        name: `${step.name}: select all and submit`,
        category: "positive",
        path: [step.id],
        input: { selected: [...step.options] },
        expected: "pass",
        status: "pending",
      });
    }
    if (step.type === "form" && step.fields) {
      const data: Record<string, string> = {};
      step.fields.forEach((f) => { data[f.name] = `test-${f.name}`; });
      tests.push({
        id: `pos-${step.id}-valid`,
        name: `${step.name}: fill all fields and submit`,
        category: "positive",
        path: [step.id],
        input: data,
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
        name: `${step.name}: confirm disabled when nothing selected`,
        category: "negative",
        path: [step.id],
        input: {},
        expected: "pass",
        status: "pending",
      });
    }
    if (step.type === "multi-select") {
      tests.push({
        id: `neg-${step.id}-empty`,
        name: `${step.name}: confirm disabled when nothing selected`,
        category: "negative",
        path: [step.id],
        input: {},
        expected: "pass",
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
          name: `${step.name}: error when "${field.name}" empty`,
          category: "negative",
          path: [step.id],
          input: { ...data, _missingField: field.name },
          expected: "pass",
          status: "pending",
        });
      }
    }
  }
  return tests;
}

function generateIntegrationTests(def: FlowDefinition): TestCase[] {
  const ordered = getOrderedSteps(def);
  const path = ordered.map((s) => s.id);
  return [
    {
      id: "integration-forward",
      name: "Full flow: walk all steps forward to completion",
      category: "integration",
      path,
      input: {},
      expected: "pass",
      status: "pending",
    },
    {
      id: "integration-back-nav",
      name: "Navigation: go forward 2 steps, go back, data preserved",
      category: "integration",
      path: path.slice(0, 3),
      input: {},
      expected: "pass",
      status: "pending",
    },
  ];
}

function generateBoundaryTests(def: FlowDefinition): TestCase[] {
  const tests: TestCase[] = [];
  for (const step of def.steps) {
    if (step.type === "form" && step.fields) {
      const longData: Record<string, string> = {};
      step.fields.forEach((f) => { longData[f.name] = "x".repeat(500); });
      tests.push({
        id: `boundary-${step.id}-long`,
        name: `${step.name}: submit with very long input`,
        category: "boundary",
        path: [step.id],
        input: longData,
        expected: "pass",
        status: "pending",
      });
      const specialData: Record<string, string> = {};
      step.fields.forEach((f) => { specialData[f.name] = '<script>alert(1)</script>&"\''; });
      tests.push({
        id: `boundary-${step.id}-special`,
        name: `${step.name}: submit with special characters`,
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
    ...generateRenderTests(def),
    ...generatePositiveTests(def),
    ...generateNegativeTests(def),
    ...generateIntegrationTests(def),
    ...generateBoundaryTests(def),
  ];
}
