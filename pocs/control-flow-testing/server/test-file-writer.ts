import type { TestCase, FlowDefinition, StepConfig } from "../src/types/flow.ts";
import * as fs from "fs";
import * as path from "path";

const SRC = path.resolve(import.meta.dirname, "..", "src");

function getOrderedSteps(def: FlowDefinition): StepConfig[] {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const targets = new Set(def.steps.filter((s) => s.next).map((s) => s.next!));
  const entry = def.steps.find((s) => !targets.has(s.id));
  const ordered: StepConfig[] = [];
  let current: string | null = entry?.id || def.steps[0]?.id || null;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    const step = stepMap.get(current);
    if (step) { ordered.push(step); current = step.next; } else break;
  }
  return ordered;
}

function imports(extra: string[] = []): string {
  const lines = [
    `import { render, screen, fireEvent, waitFor } from "@testing-library/react";`,
    `import "@testing-library/jest-dom";`,
    `import React from "react";`,
  ];
  for (const e of extra) lines.push(e);
  return lines.join("\n");
}

function componentImport(name: string, relPath: string): string {
  return `import { ${name} } from "${SRC}/${relPath}";`;
}

function stepJson(step: StepConfig): string {
  return JSON.stringify(step) + " as any";
}

function defJson(def: FlowDefinition): string {
  return JSON.stringify(def) + " as any";
}

function genRenderTests(tests: TestCase[], def: FlowDefinition): string {
  const ordered = getOrderedSteps(def);
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const lines: string[] = [
    imports([
      componentImport("SingleSelect", "components/steps/SingleSelect"),
      componentImport("MultiSelect", "components/steps/MultiSelect"),
      componentImport("FormStep", "components/steps/FormStep"),
      componentImport("Summary", "components/steps/Summary"),
      componentImport("StepRenderer", "components/StepRenderer"),
    ]),
    "",
    `const allSteps = ${JSON.stringify(ordered)};`,
    "",
  ];

  for (const tc of tests) {
    const step = stepMap.get(tc.path[0]);
    if (!step) continue;

    if (tc.id.includes("-elements")) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      if (step.type === "single-select") {
        lines.push(`  render(<SingleSelect step={step} onComplete={onComplete} />);`);
        lines.push(`  expect(screen.getAllByRole("radio")).toHaveLength(${step.options?.length || 0});`);
      } else if (step.type === "multi-select") {
        lines.push(`  render(<MultiSelect step={step} onComplete={onComplete} />);`);
        lines.push(`  expect(screen.getAllByRole("checkbox")).toHaveLength(${step.options?.length || 0});`);
      } else if (step.type === "form") {
        lines.push(`  render(<FormStep step={step} onComplete={onComplete} />);`);
        lines.push(`  expect(screen.getAllByRole("textbox")).toHaveLength(${step.fields?.length || 0});`);
      } else if (step.type === "summary") {
        const sampleData: Record<string, Record<string, unknown>> = {};
        for (const s of ordered) {
          if (s.type === "single-select" && s.options) sampleData[s.id] = { selected: s.options[0] };
          if (s.type === "multi-select" && s.options) sampleData[s.id] = { selected: [s.options[0]] };
          if (s.type === "form" && s.fields) {
            const d: Record<string, string> = {};
            s.fields.forEach((f) => { d[f.name] = `test-${f.name}`; });
            sampleData[s.id] = d;
          }
        }
        lines.push(`  render(<Summary step={step} allData={${JSON.stringify(sampleData)}} steps={allSteps} />);`);
        lines.push(`  expect(screen.getByText(/${step.name}/)).toBeInTheDocument();`);
      }
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._checkHeading) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      if (step.type === "summary") {
        const sampleData: Record<string, Record<string, unknown>> = {};
        for (const s of ordered) {
          if (s.type === "single-select" && s.options) sampleData[s.id] = { selected: s.options[0] };
          if (s.type === "multi-select" && s.options) sampleData[s.id] = { selected: [s.options[0]] };
          if (s.type === "form" && s.fields) { const d: Record<string, string> = {}; s.fields.forEach((f) => { d[f.name] = `test-${f.name}`; }); sampleData[s.id] = d; }
        }
        lines.push(`  render(<Summary step={step} allData={${JSON.stringify(sampleData)}} steps={allSteps} />);`);
      } else if (step.type === "single-select") {
        lines.push(`  render(<SingleSelect step={step} onComplete={onComplete} />);`);
      } else if (step.type === "multi-select") {
        lines.push(`  render(<MultiSelect step={step} onComplete={onComplete} />);`);
      } else if (step.type === "form") {
        lines.push(`  render(<FormStep step={step} onComplete={onComplete} />);`);
      }
      lines.push(`  expect(screen.getByText("${step.name}")).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._checkConfirmBtn) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      if (step.type === "single-select") {
        lines.push(`  render(<SingleSelect step={step} onComplete={jest.fn()} />);`);
      } else if (step.type === "multi-select") {
        lines.push(`  render(<MultiSelect step={step} onComplete={jest.fn()} />);`);
      } else if (step.type === "form") {
        lines.push(`  render(<FormStep step={step} onComplete={jest.fn()} />);`);
      }
      lines.push(`  expect(screen.getByRole("button", { name: /confirm/i })).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._checkLabels) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      if (step.type === "single-select") {
        lines.push(`  render(<SingleSelect step={step} onComplete={jest.fn()} />);`);
        for (const opt of step.options || []) {
          lines.push(`  expect(screen.getByText("${opt}")).toBeInTheDocument();`);
        }
      } else if (step.type === "multi-select") {
        lines.push(`  render(<MultiSelect step={step} onComplete={jest.fn()} />);`);
        for (const opt of step.options || []) {
          lines.push(`  expect(screen.getByText("${opt}")).toBeInTheDocument();`);
        }
      }
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._checkDataValues) {
      const sampleData: Record<string, Record<string, unknown>> = {};
      for (const s of ordered) {
        if (s.type === "single-select" && s.options) sampleData[s.id] = { selected: s.options[0] };
        if (s.type === "multi-select" && s.options) sampleData[s.id] = { selected: [s.options[0]] };
        if (s.type === "form" && s.fields) { const d: Record<string, string> = {}; s.fields.forEach((f) => { d[f.name] = `test-${f.name}`; }); sampleData[s.id] = d; }
      }
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  render(<Summary step={step} allData={${JSON.stringify(sampleData)}} steps={allSteps} />);`);
      for (const s of ordered) {
        if (s.type === "summary") continue;
        const data = sampleData[s.id];
        if (!data) continue;
        for (const val of Object.values(data)) {
          const strVal = Array.isArray(val) ? val[0] : String(val);
          lines.push(`  expect(screen.getByText(/${String(strVal).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/)).toBeInTheDocument();`);
        }
      }
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._checkRequiredIndicator) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const { container } = render(<FormStep step={step} onComplete={jest.fn()} />);`);
      lines.push(`  expect(container.textContent).toContain("*");`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._checkStepRenderer) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  render(<StepRenderer step={step} allData={{}} allSteps={allSteps} onComplete={jest.fn()} />);`);
      if (step.type === "single-select") {
        lines.push(`  expect(screen.getAllByRole("radio").length).toBeGreaterThan(0);`);
      } else if (step.type === "multi-select") {
        lines.push(`  expect(screen.getAllByRole("checkbox").length).toBeGreaterThan(0);`);
      } else if (step.type === "form") {
        lines.push(`  expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);`);
      }
      lines.push(`});`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function genPositiveTests(tests: TestCase[], def: FlowDefinition): string {
  const ordered = getOrderedSteps(def);
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const lines: string[] = [
    imports([
      componentImport("SingleSelect", "components/steps/SingleSelect"),
      componentImport("MultiSelect", "components/steps/MultiSelect"),
      componentImport("FormStep", "components/steps/FormStep"),
      componentImport("Summary", "components/steps/Summary"),
    ]),
    "",
    `const allSteps = ${JSON.stringify(ordered)};`,
    "",
  ];

  for (const tc of tests) {
    const step = stepMap.get(tc.path[0]);
    if (!step) continue;

    if (tc.input._changeSelection && step.type === "single-select") {
      const first = tc.input.first as string;
      const second = tc.input.second as string;
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<SingleSelect step={step} onComplete={onComplete} />);`);
      lines.push(`  fireEvent.click(screen.getByLabelText("${first}"));`);
      lines.push(`  fireEvent.click(screen.getByLabelText("${second}"));`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalledWith({ selected: "${second}" });`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._summaryDisplay) {
      const sampleData: Record<string, Record<string, unknown>> = {};
      for (const s of ordered) {
        if (s.type === "single-select" && s.options) sampleData[s.id] = { selected: s.options[0] };
        if (s.type === "multi-select" && s.options) sampleData[s.id] = { selected: [s.options[0]] };
        if (s.type === "form" && s.fields) { const d: Record<string, string> = {}; s.fields.forEach((f) => { d[f.name] = `test-${f.name}`; }); sampleData[s.id] = d; }
      }
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  render(<Summary step={step} allData={${JSON.stringify(sampleData)}} steps={allSteps} />);`);
      lines.push(`  expect(screen.getByText("${step.name}")).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (step.type === "single-select") {
      const option = tc.input.selected as string;
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<SingleSelect step={step} onComplete={onComplete} />);`);
      lines.push(`  fireEvent.click(screen.getByLabelText("${option}"));`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalledWith({ selected: "${option}" });`);
      lines.push(`});`);
      lines.push("");
    } else if (step.type === "multi-select") {
      const selected = tc.input.selected as string[];
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<MultiSelect step={step} onComplete={onComplete} />);`);
      for (const opt of selected) {
        lines.push(`  fireEvent.click(screen.getByLabelText("${opt}"));`);
      }
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalledWith({ selected: ${JSON.stringify(selected)} });`);
      lines.push(`});`);
      lines.push("");
    } else if (step.type === "form") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<FormStep step={step} onComplete={onComplete} />);`);
      for (const field of step.fields || []) {
        const val = (tc.input as Record<string, string>)[field.name] || "";
        lines.push(`  fireEvent.change(screen.getByLabelText(new RegExp("${field.name}")), { target: { value: "${val}" } });`);
      }
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalled();`);
      lines.push(`});`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function genNegativeTests(tests: TestCase[], def: FlowDefinition): string {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const lines: string[] = [
    imports([
      componentImport("SingleSelect", "components/steps/SingleSelect"),
      componentImport("MultiSelect", "components/steps/MultiSelect"),
      componentImport("FormStep", "components/steps/FormStep"),
    ]),
    "",
  ];

  for (const tc of tests) {
    const step = stepMap.get(tc.path[0]);
    if (!step) continue;

    if (tc.input._doubleClick && step.type === "single-select") {
      const option = tc.input.selected as string;
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<SingleSelect step={step} onComplete={onComplete} />);`);
      lines.push(`  fireEvent.click(screen.getByLabelText("${option}"));`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalledTimes(1);`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._deselect && step.type === "multi-select") {
      const option = tc.input.selected as string;
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<MultiSelect step={step} onComplete={onComplete} />);`);
      lines.push(`  fireEvent.click(screen.getByLabelText("${option}"));`);
      lines.push(`  fireEvent.click(screen.getByLabelText("${option}"));`);
      lines.push(`  const btn = screen.getByRole("button", { name: /confirm/i });`);
      lines.push(`  expect(btn).toBeDisabled();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._deselectAll && step.type === "multi-select") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  render(<MultiSelect step={step} onComplete={jest.fn()} />);`);
      for (const opt of step.options || []) {
        lines.push(`  fireEvent.click(screen.getByLabelText("${opt}"));`);
      }
      for (const opt of step.options || []) {
        lines.push(`  fireEvent.click(screen.getByLabelText("${opt}"));`);
      }
      lines.push(`  expect(screen.getByRole("button", { name: /confirm/i })).toBeDisabled();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._errorRecovery && step.type === "form") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<FormStep step={step} onComplete={onComplete} />);`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).not.toHaveBeenCalled();`);
      for (const field of step.fields || []) {
        if (field.required) {
          lines.push(`  fireEvent.change(screen.getByLabelText(new RegExp("${field.name}")), { target: { value: "test-${field.name}" } });`);
        }
      }
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalled();`);
      lines.push(`});`);
      lines.push("");
    } else if ((step.type === "single-select" || step.type === "multi-select") && !tc.input._doubleClick && !tc.input._deselect && !tc.input._deselectAll) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      if (step.type === "single-select") {
        lines.push(`  render(<SingleSelect step={step} onComplete={jest.fn()} />);`);
      } else {
        lines.push(`  render(<MultiSelect step={step} onComplete={jest.fn()} />);`);
      }
      lines.push(`  expect(screen.getByRole("button", { name: /confirm/i })).toBeDisabled();`);
      lines.push(`});`);
      lines.push("");
    } else if (step.type === "form" && tc.input._missingField) {
      const missingField = tc.input._missingField as string;
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<FormStep step={step} onComplete={onComplete} />);`);
      for (const field of step.fields || []) {
        if (field.name !== missingField) {
          lines.push(`  fireEvent.change(screen.getByLabelText(new RegExp("${field.name}")), { target: { value: "test-${field.name}" } });`);
        }
      }
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).not.toHaveBeenCalled();`);
      lines.push(`});`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function genIntegrationTests(tests: TestCase[], def: FlowDefinition): string {
  const ordered = getOrderedSteps(def);
  const lines: string[] = [
    imports([
      componentImport("FlowProvider", "context/FlowContext"),
      componentImport("ExecutionPage", "pages/ExecutionPage"),
    ]),
    "",
    `function renderApp(def?: any) {`,
    `  return render(<FlowProvider initialDefinition={def || ${defJson(def)}}><ExecutionPage /></FlowProvider>);`,
    `}`,
    "",
    `async function completeCurrentStep(step: any) {`,
    `  if (step.type === "single-select" && step.options) {`,
    `    fireEvent.click(screen.getByLabelText(step.options[0]));`,
    `  } else if (step.type === "multi-select" && step.options) {`,
    `    fireEvent.click(screen.getByLabelText(step.options[0]));`,
    `  } else if (step.type === "form" && step.fields) {`,
    `    for (const field of step.fields) {`,
    `      fireEvent.change(screen.getByLabelText(new RegExp(field.name)), { target: { value: "test-" + field.name } });`,
    `    }`,
    `  } else return;`,
    `  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`,
    `}`,
    "",
    `const ordered = ${JSON.stringify(ordered)};`,
    "",
  ];

  for (const tc of tests) {
    if (tc.id === "integration-forward") {
      lines.push(`test("${tc.id}", async () => {`);
      lines.push(`  renderApp();`);
      lines.push(`  for (let i = 0; i < ordered.length; i++) {`);
      lines.push(`    expect(screen.getByText(new RegExp("Step " + (i + 1) + " of"))).toBeInTheDocument();`);
      lines.push(`    if (ordered[i].type === "summary") continue;`);
      lines.push(`    await completeCurrentStep(ordered[i]);`);
      lines.push(`  }`);
      lines.push(`  expect(screen.getByRole("button", { name: /restart/i })).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "integration-back-nav") {
      lines.push(`test("${tc.id}", async () => {`);
      lines.push(`  renderApp();`);
      lines.push(`  await completeCurrentStep(ordered[0]);`);
      lines.push(`  await completeCurrentStep(ordered[1]);`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /previous/i }));`);
      lines.push(`  expect(screen.getByText(/Step 2 of/)).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "integration-restart") {
      lines.push(`test("${tc.id}", async () => {`);
      lines.push(`  renderApp();`);
      lines.push(`  for (const step of ordered) {`);
      lines.push(`    if (step.type === "summary") continue;`);
      lines.push(`    await completeCurrentStep(step);`);
      lines.push(`  }`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /restart/i }));`);
      lines.push(`  expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "integration-back-from-first") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  renderApp();`);
      lines.push(`  const btn = screen.getByRole("button", { name: /previous/i });`);
      lines.push(`  expect(btn).toBeDisabled();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "integration-revisit") {
      lines.push(`test("${tc.id}", async () => {`);
      lines.push(`  renderApp();`);
      lines.push(`  await completeCurrentStep(ordered[0]);`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /previous/i }));`);
      lines.push(`  expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();`);
      lines.push(`  await completeCurrentStep(ordered[0]);`);
      lines.push(`  expect(screen.getByText(/Step 2 of/)).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "integration-summary-data") {
      lines.push(`test("${tc.id}", async () => {`);
      lines.push(`  renderApp();`);
      lines.push(`  for (const step of ordered) {`);
      lines.push(`    if (step.type === "summary") continue;`);
      lines.push(`    await completeCurrentStep(step);`);
      lines.push(`  }`);
      lines.push(`  expect(screen.getByText("${ordered[ordered.length - 1].name}")).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "integration-min-flow") {
      const minSteps = ordered.slice(0, 2);
      const minDef = { ...def, steps: minSteps.map((s, i) => ({ ...s, next: i < minSteps.length - 1 ? minSteps[i + 1].id : null })) };
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  render(<FlowProvider initialDefinition={${JSON.stringify(minDef)}}><ExecutionPage /></FlowProvider>);`);
      lines.push(`  expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function genBoundaryTests(tests: TestCase[], def: FlowDefinition): string {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const lines: string[] = [
    imports([
      componentImport("SingleSelect", "components/steps/SingleSelect"),
      componentImport("MultiSelect", "components/steps/MultiSelect"),
      componentImport("FormStep", "components/steps/FormStep"),
    ]),
    "",
  ];

  for (const tc of tests) {
    const step = stepMap.get(tc.path[0]);
    if (!step) continue;

    if (tc.input._rapidClick && step.type === "single-select") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<SingleSelect step={step} onComplete={onComplete} />);`);
      for (const opt of step.options || []) {
        lines.push(`  fireEvent.click(screen.getByLabelText("${opt}"));`);
      }
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalledWith({ selected: "${step.options![step.options!.length - 1]}" });`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._whitespaceField && step.type === "form") {
      const wsField = tc.input._whitespaceField as string;
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<FormStep step={step} onComplete={onComplete} />);`);
      for (const field of step.fields || []) {
        const val = field.name === wsField ? "   " : `test-${field.name}`;
        lines.push(`  fireEvent.change(screen.getByLabelText(new RegExp("${field.name}")), { target: { value: "${val}" } });`);
      }
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).not.toHaveBeenCalled();`);
      lines.push(`});`);
      lines.push("");
    } else if (step.type === "form" && !tc.input._rapidClick && !tc.input._whitespaceField && !tc.input._singleOption) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const step = ${stepJson(step)};`);
      lines.push(`  const onComplete = jest.fn();`);
      lines.push(`  render(<FormStep step={step} onComplete={onComplete} />);`);
      for (const field of step.fields || []) {
        const val = (tc.input as Record<string, string>)[field.name] || "";
        const escaped = val.replace(/"/g, '\\"').substring(0, 100);
        lines.push(`  fireEvent.change(screen.getByLabelText(new RegExp("${field.name}")), { target: { value: "${escaped}" } });`);
      }
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
      lines.push(`  expect(onComplete).toHaveBeenCalled();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._singleOption) {
      if (step.type === "single-select") {
        lines.push(`test("${tc.id}", () => {`);
        lines.push(`  const step = ${stepJson(step)};`);
        lines.push(`  const onComplete = jest.fn();`);
        lines.push(`  render(<SingleSelect step={step} onComplete={onComplete} />);`);
        lines.push(`  fireEvent.click(screen.getByLabelText("${step.options![0]}"));`);
        lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
        lines.push(`  expect(onComplete).toHaveBeenCalled();`);
        lines.push(`});`);
        lines.push("");
      } else if (step.type === "multi-select") {
        lines.push(`test("${tc.id}", () => {`);
        lines.push(`  const step = ${stepJson(step)};`);
        lines.push(`  const onComplete = jest.fn();`);
        lines.push(`  render(<MultiSelect step={step} onComplete={onComplete} />);`);
        lines.push(`  fireEvent.click(screen.getByLabelText("${step.options![0]}"));`);
        lines.push(`  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`);
        lines.push(`  expect(onComplete).toHaveBeenCalled();`);
        lines.push(`});`);
        lines.push("");
      }
    }
  }
  return lines.join("\n");
}

function genPermutationTests(tests: TestCase[], def: FlowDefinition): string {
  const lines: string[] = [
    `import type { FlowDefinition, StepConfig } from "${SRC}/types/flow";`,
    "",
    `function getOrderedSteps(def: FlowDefinition): StepConfig[] {`,
    `  const stepMap = new Map(def.steps.map((s) => [s.id, s]));`,
    `  const targets = new Set(def.steps.filter((s) => s.next).map((s) => s.next!));`,
    `  const entry = def.steps.find((s) => !targets.has(s.id));`,
    `  const ordered: StepConfig[] = [];`,
    `  let current: string | null = entry?.id || def.steps[0]?.id || null;`,
    `  const visited = new Set<string>();`,
    `  while (current && !visited.has(current)) { visited.add(current); const step = stepMap.get(current); if (step) { ordered.push(step); current = step.next; } else break; }`,
    `  return ordered;`,
    `}`,
    "",
    `const def: FlowDefinition = ${defJson(def)};`,
    `const original = getOrderedSteps(def);`,
    "",
  ];

  for (const tc of tests) {
    if (tc.id === "permutation-reversed-array") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const reversed = { ...def, steps: [...def.steps].reverse() };`);
      lines.push(`  const reordered = getOrderedSteps(reversed);`);
      lines.push(`  expect(reordered.map(s => s.id)).toEqual(original.map(s => s.id));`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "permutation-swapped") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const mid = Math.floor(def.steps.length / 2);`);
      lines.push(`  const swapped = [...def.steps];`);
      lines.push(`  [swapped[0], swapped[mid]] = [swapped[mid], swapped[0]];`);
      lines.push(`  const reordered = getOrderedSteps({ ...def, steps: swapped });`);
      lines.push(`  expect(reordered.map(s => s.id)).toEqual(original.map(s => s.id));`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "permutation-order-field-ignored") {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const shuffled = { ...def, steps: def.steps.map((s, i) => ({ ...s, order: def.steps.length - i })) };`);
      lines.push(`  const reordered = getOrderedSteps(shuffled);`);
      lines.push(`  expect(reordered.map(s => s.id)).toEqual(original.map(s => s.id));`);
      lines.push(`});`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function genValidationTests(tests: TestCase[], def: FlowDefinition): string {
  const lines: string[] = [
    `import { compileGraph } from "${SRC}/engine/graph-compiler";`,
    `import type { FlowDefinition } from "${SRC}/types/flow";`,
    "",
    `const def: FlowDefinition = ${defJson(def)};`,
    "",
  ];

  for (const tc of tests) {
    if (tc.input._validFlow) {
      lines.push(`test("${tc.id}", () => { expect(compileGraph(def).valid).toBe(true); });`);
    } else if (tc.input._cycle) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [`);
      lines.push(`    { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: "b" },`);
      lines.push(`    { id: "b", name: "B", order: 2, type: "single-select", options: ["x"], next: "a" },`);
      lines.push(`  ]});`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    } else if (tc.input._orphan) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [`);
      lines.push(`    { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: null },`);
      lines.push(`    { id: "b", name: "B", order: 2, type: "single-select", options: ["x"], next: null },`);
      lines.push(`  ]});`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    } else if (tc.input._duplicateId) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [`);
      lines.push(`    { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: null },`);
      lines.push(`    { id: "a", name: "A2", order: 2, type: "single-select", options: ["x"], next: null },`);
      lines.push(`  ]});`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    } else if (tc.input._invalidType) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [`);
      lines.push(`    { id: "a", name: "A", order: 1, type: "dropdown" as any, options: ["x"], next: null },`);
      lines.push(`  ]});`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    } else if (tc.input._brokenNext) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [`);
      lines.push(`    { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: "nope" },`);
      lines.push(`  ]});`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    } else if (tc.input._noTerminal) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [`);
      lines.push(`    { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: "b" },`);
      lines.push(`    { id: "b", name: "B", order: 2, type: "single-select", options: ["x"], next: "a" },`);
      lines.push(`  ]});`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    } else if (tc.input._missingOptions) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [`);
      lines.push(`    { id: "a", name: "A", order: 1, type: "single-select", next: null } as any,`);
      lines.push(`  ]});`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    } else if (tc.input._emptySteps) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const r = compileGraph({ id: "t", name: "t", steps: [] });`);
      lines.push(`  expect(r.valid).toBe(false);`);
      lines.push(`});`);
    }
    lines.push("");
  }
  return lines.join("\n");
}

function genIdempotencyTests(tests: TestCase[], def: FlowDefinition): string {
  const ordered = getOrderedSteps(def);
  const lines: string[] = [
    imports([
      componentImport("FlowProvider", "context/FlowContext"),
      componentImport("ExecutionPage", "pages/ExecutionPage"),
    ]),
    "",
    `const ordered = ${JSON.stringify(ordered)};`,
    `const def = ${defJson(def)};`,
    "",
    `async function completeCurrentStep(step: any) {`,
    `  if (step.type === "single-select" && step.options) fireEvent.click(screen.getByLabelText(step.options[0]));`,
    `  else if (step.type === "multi-select" && step.options) fireEvent.click(screen.getByLabelText(step.options[0]));`,
    `  else if (step.type === "form" && step.fields) { for (const f of step.fields) fireEvent.change(screen.getByLabelText(new RegExp(f.name)), { target: { value: "test-" + f.name } }); }`,
    `  else return;`,
    `  fireEvent.click(screen.getByRole("button", { name: /confirm/i }));`,
    `}`,
    "",
  ];

  for (const tc of tests) {
    if (tc.id === "idempotency-double-run") {
      lines.push(`test("${tc.id}", async () => {`);
      lines.push(`  render(<FlowProvider initialDefinition={def}><ExecutionPage /></FlowProvider>);`);
      lines.push(`  for (const step of ordered) { if (step.type !== "summary") await completeCurrentStep(step); }`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /restart/i }));`);
      lines.push(`  expect(screen.getByText(/Step 1 of/)).toBeInTheDocument();`);
      lines.push(`  for (const step of ordered) { if (step.type !== "summary") await completeCurrentStep(step); }`);
      lines.push(`  expect(screen.getByRole("button", { name: /restart/i })).toBeInTheDocument();`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.id === "idempotency-restart-clean") {
      lines.push(`test("${tc.id}", async () => {`);
      lines.push(`  const { container } = render(<FlowProvider initialDefinition={def}><ExecutionPage /></FlowProvider>);`);
      lines.push(`  for (const step of ordered) { if (step.type !== "summary") await completeCurrentStep(step); }`);
      lines.push(`  fireEvent.click(screen.getByRole("button", { name: /restart/i }));`);
      lines.push(`  const radios = container.querySelectorAll('input[type="radio"]');`);
      lines.push(`  for (const r of radios) expect((r as HTMLInputElement).checked).toBe(false);`);
      lines.push(`});`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

function genAccessibilityTests(tests: TestCase[], def: FlowDefinition): string {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const lines: string[] = [
    imports([
      componentImport("SingleSelect", "components/steps/SingleSelect"),
      componentImport("FormStep", "components/steps/FormStep"),
      componentImport("MultiSelect", "components/steps/MultiSelect"),
    ]),
    "",
  ];

  for (const tc of tests) {
    const step = stepMap.get(tc.path[0]);
    if (!step) continue;

    if (tc.input._radioName) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  const { container } = render(<SingleSelect step={${stepJson(step)}} onComplete={jest.fn()} />);`);
      lines.push(`  const radios = container.querySelectorAll('input[type="radio"]');`);
      lines.push(`  const names = new Set<string>();`);
      lines.push(`  for (const r of radios) names.add((r as HTMLInputElement).name);`);
      lines.push(`  expect(names.size).toBe(1);`);
      lines.push(`  expect(names.has("${step.id}")).toBe(true);`);
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._formLabels) {
      lines.push(`test("${tc.id}", () => {`);
      lines.push(`  render(<FormStep step={${stepJson(step)}} onComplete={jest.fn()} />);`);
      for (const field of step.fields || []) {
        lines.push(`  expect(screen.getByLabelText(new RegExp("${field.name}"))).toBeInTheDocument();`);
      }
      lines.push(`});`);
      lines.push("");
    } else if (tc.input._btnText) {
      lines.push(`test("${tc.id}", () => {`);
      if (step.type === "single-select") {
        lines.push(`  render(<SingleSelect step={${stepJson(step)}} onComplete={jest.fn()} />);`);
      } else if (step.type === "multi-select") {
        lines.push(`  render(<MultiSelect step={${stepJson(step)}} onComplete={jest.fn()} />);`);
      } else if (step.type === "form") {
        lines.push(`  render(<FormStep step={${stepJson(step)}} onComplete={jest.fn()} />);`);
      }
      lines.push(`  const btn = screen.getByRole("button", { name: /confirm/i });`);
      lines.push(`  expect(btn.textContent?.trim().length).toBeGreaterThan(0);`);
      lines.push(`});`);
      lines.push("");
    }
  }
  return lines.join("\n");
}

export function writeTestFiles(tests: TestCase[], def: FlowDefinition, outDir: string): string[] {
  if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true });
  fs.mkdirSync(outDir, { recursive: true });

  const byCategory = new Map<string, TestCase[]>();
  for (const tc of tests) {
    const arr = byCategory.get(tc.category) || [];
    arr.push(tc);
    byCategory.set(tc.category, arr);
  }

  const files: string[] = [];
  const generators: Record<string, (tests: TestCase[], def: FlowDefinition) => string> = {
    render: genRenderTests,
    positive: genPositiveTests,
    negative: genNegativeTests,
    integration: genIntegrationTests,
    boundary: genBoundaryTests,
    permutation: genPermutationTests,
    validation: genValidationTests,
    idempotency: genIdempotencyTests,
    accessibility: genAccessibilityTests,
  };

  for (const [cat, catTests] of byCategory) {
    const gen = generators[cat];
    if (!gen) continue;
    const content = gen(catTests, def);
    const filePath = path.join(outDir, `${cat}.test.tsx`);
    fs.writeFileSync(filePath, content);
    files.push(filePath);
  }

  return files;
}
