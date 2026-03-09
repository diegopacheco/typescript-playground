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
  const tests: TestCase[] = [];
  const ordered = getOrderedSteps(def);
  for (const step of ordered) {
    tests.push({
      id: `render-${step.id}-elements`,
      name: `Render: ${step.name} mounts with correct elements`,
      category: "render",
      path: [step.id],
      input: {},
      expected: "pass",
      status: "pending",
    });
    tests.push({
      id: `render-${step.id}-heading`,
      name: `Render: ${step.name} shows correct heading`,
      category: "render",
      path: [step.id],
      input: { _checkHeading: true },
      expected: "pass",
      status: "pending",
    });
    if (step.type !== "summary") {
      tests.push({
        id: `render-${step.id}-confirm-btn`,
        name: `Render: ${step.name} has Confirm button`,
        category: "render",
        path: [step.id],
        input: { _checkConfirmBtn: true },
        expected: "pass",
        status: "pending",
      });
    }
    if ((step.type === "single-select" || step.type === "multi-select") && step.options) {
      tests.push({
        id: `render-${step.id}-labels`,
        name: `Render: ${step.name} labels match option text`,
        category: "render",
        path: [step.id],
        input: { _checkLabels: true },
        expected: "pass",
        status: "pending",
      });
    }
    if (step.type === "summary") {
      tests.push({
        id: `render-${step.id}-data-values`,
        name: `Render: ${step.name} shows collected data values`,
        category: "render",
        path: [step.id],
        input: { _checkDataValues: true },
        expected: "pass",
        status: "pending",
      });
    }
    if (step.type === "form" && step.fields) {
      const hasRequired = step.fields.some((f) => f.required);
      if (hasRequired) {
        tests.push({
          id: `render-${step.id}-required-indicator`,
          name: `Render: ${step.name} shows required field indicator (*)`,
          category: "render",
          path: [step.id],
          input: { _checkRequiredIndicator: true },
          expected: "pass",
          status: "pending",
        });
      }
    }
    if (step.type !== "summary") {
      tests.push({
        id: `render-${step.id}-step-renderer`,
        name: `Render: StepRenderer routes correctly for ${step.name}`,
        category: "render",
        path: [step.id],
        input: { _checkStepRenderer: true },
        expected: "pass",
        status: "pending",
      });
    }
  }
  return tests;
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
      if (step.options.length >= 2) {
        tests.push({
          id: `pos-${step.id}-change-selection`,
          name: `${step.name}: change selection, submit gives last pick`,
          category: "positive",
          path: [step.id],
          input: { _changeSelection: true, first: step.options[0], second: step.options[1] },
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
      if (step.options.length >= 2) {
        tests.push({
          id: `pos-${step.id}-two`,
          name: `${step.name}: select 2 options and submit`,
          category: "positive",
          path: [step.id],
          input: { selected: [step.options[0], step.options[1]] },
          expected: "pass",
          status: "pending",
        });
      }
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
      const allData: Record<string, string> = {};
      step.fields.forEach((f) => { allData[f.name] = `test-${f.name}`; });
      tests.push({
        id: `pos-${step.id}-all-fields`,
        name: `${step.name}: fill all fields and submit`,
        category: "positive",
        path: [step.id],
        input: allData,
        expected: "pass",
        status: "pending",
      });
      const hasOptional = step.fields.some((f) => !f.required);
      if (hasOptional) {
        const requiredOnly: Record<string, string> = {};
        step.fields.forEach((f) => { requiredOnly[f.name] = f.required ? `test-${f.name}` : ""; });
        tests.push({
          id: `pos-${step.id}-required-only`,
          name: `${step.name}: fill only required fields and submit`,
          category: "positive",
          path: [step.id],
          input: requiredOnly,
          expected: "pass",
          status: "pending",
        });
        const withOptional: Record<string, string> = {};
        step.fields.forEach((f) => { withOptional[f.name] = `test-${f.name}`; });
        tests.push({
          id: `pos-${step.id}-optional-included`,
          name: `${step.name}: optional field value included in callback`,
          category: "positive",
          path: [step.id],
          input: withOptional,
          expected: "pass",
          status: "pending",
        });
      }
    }
    if (step.type === "summary") {
      tests.push({
        id: `pos-${step.id}-displays-all-data`,
        name: `${step.name}: displays all collected data correctly`,
        category: "positive",
        path: [step.id],
        input: { _summaryDisplay: true },
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
      if (step.options && step.options.length > 0) {
        tests.push({
          id: `neg-${step.id}-double-click`,
          name: `${step.name}: double-click same option no double fire`,
          category: "negative",
          path: [step.id],
          input: { _doubleClick: true, selected: step.options[0] },
          expected: "pass",
          status: "pending",
        });
      }
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
      if (step.options && step.options.length > 0) {
        tests.push({
          id: `neg-${step.id}-deselect`,
          name: `${step.name}: select then deselect, confirm stays disabled`,
          category: "negative",
          path: [step.id],
          input: { _deselect: true, selected: step.options[0] },
          expected: "pass",
          status: "pending",
        });
        tests.push({
          id: `neg-${step.id}-select-all-deselect-all`,
          name: `${step.name}: select all, deselect all, confirm disabled`,
          category: "negative",
          path: [step.id],
          input: { _deselectAll: true },
          expected: "pass",
          status: "pending",
        });
      }
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
      if (requiredFields.length > 1) {
        const allEmpty: Record<string, string> = {};
        step.fields.forEach((f) => { allEmpty[f.name] = ""; });
        tests.push({
          id: `neg-${step.id}-all-empty`,
          name: `${step.name}: error when all required fields empty`,
          category: "negative",
          path: [step.id],
          input: { ...allEmpty, _missingField: requiredFields[0].name },
          expected: "pass",
          status: "pending",
        });
      }
      if (requiredFields.length > 0) {
        tests.push({
          id: `neg-${step.id}-error-recovery`,
          name: `${step.name}: error then fix then re-submit succeeds`,
          category: "negative",
          path: [step.id],
          input: { _errorRecovery: true },
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
  const tests: TestCase[] = [
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
    {
      id: "integration-restart",
      name: "Restart: complete flow, click Restart, back to step 1",
      category: "integration",
      path,
      input: {},
      expected: "pass",
      status: "pending",
    },
    {
      id: "integration-back-from-first",
      name: "Navigation: Previous button disabled on first step",
      category: "integration",
      path: [path[0]],
      input: {},
      expected: "pass",
      status: "pending",
    },
    {
      id: "integration-revisit",
      name: "Navigation: go forward 1, go back, re-confirm, flow continues",
      category: "integration",
      path: path.slice(0, 3),
      input: {},
      expected: "pass",
      status: "pending",
    },
    {
      id: "integration-summary-data",
      name: "Summary: shows all collected data from previous steps",
      category: "integration",
      path,
      input: {},
      expected: "pass",
      status: "pending",
    },
  ];
  if (ordered.length >= 2) {
    tests.push({
      id: "integration-min-flow",
      name: "Minimum flow: 2-step flow works (1 interactive + summary)",
      category: "integration",
      path: path.slice(0, 2),
      input: { _minFlow: true },
      expected: "pass",
      status: "pending",
    });
  }
  return tests;
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
      const unicodeData: Record<string, string> = {};
      step.fields.forEach((f) => { unicodeData[f.name] = "Rua Sao Paulo 123 Andar 4"; });
      tests.push({
        id: `boundary-${step.id}-unicode`,
        name: `${step.name}: submit with unicode characters`,
        category: "boundary",
        path: [step.id],
        input: unicodeData,
        expected: "pass",
        status: "pending",
      });
      const hasOptional = step.fields.some((f) => !f.required);
      if (hasOptional) {
        const wsData: Record<string, string> = {};
        step.fields.forEach((f) => { wsData[f.name] = f.required ? `test-${f.name}` : ""; });
        tests.push({
          id: `boundary-${step.id}-optional-empty`,
          name: `${step.name}: empty string on optional fields passes`,
          category: "boundary",
          path: [step.id],
          input: wsData,
          expected: "pass",
          status: "pending",
        });
      }
      const firstRequired = step.fields.find((f) => f.required);
      if (firstRequired) {
        const wsRequired: Record<string, string> = {};
        step.fields.forEach((f) => { wsRequired[f.name] = f.name === firstRequired.name ? "   " : `test-${f.name}`; });
        tests.push({
          id: `boundary-${step.id}-whitespace`,
          name: `${step.name}: whitespace-only on required "${firstRequired.name}" fails`,
          category: "boundary",
          path: [step.id],
          input: { ...wsRequired, _whitespaceField: firstRequired.name },
          expected: "pass",
          status: "pending",
        });
      }
      if (step.fields.length === 1) {
        const singleData: Record<string, string> = {};
        step.fields.forEach((f) => { singleData[f.name] = `test-${f.name}`; });
        tests.push({
          id: `boundary-${step.id}-single-field`,
          name: `${step.name}: form with single field works`,
          category: "boundary",
          path: [step.id],
          input: singleData,
          expected: "pass",
          status: "pending",
        });
      }
    }
    if (step.type === "single-select" && step.options) {
      tests.push({
        id: `boundary-${step.id}-rapid-click`,
        name: `${step.name}: rapid click different options, last wins`,
        category: "boundary",
        path: [step.id],
        input: { _rapidClick: true, options: step.options },
        expected: "pass",
        status: "pending",
      });
      if (step.options.length === 1) {
        tests.push({
          id: `boundary-${step.id}-single-option`,
          name: `${step.name}: works with only 1 option`,
          category: "boundary",
          path: [step.id],
          input: { _singleOption: true, selected: step.options[0] },
          expected: "pass",
          status: "pending",
        });
      }
    }
    if (step.type === "multi-select" && step.options) {
      if (step.options.length === 1) {
        tests.push({
          id: `boundary-${step.id}-single-option`,
          name: `${step.name}: works with only 1 option`,
          category: "boundary",
          path: [step.id],
          input: { _singleOption: true, selected: [step.options[0]] },
          expected: "pass",
          status: "pending",
        });
      }
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
