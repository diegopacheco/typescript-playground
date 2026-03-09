import ReactDOM from "react-dom";
import { createElement } from "react";
import { SingleSelect } from "../components/steps/SingleSelect";
import { MultiSelect } from "../components/steps/MultiSelect";
import { FormStep } from "../components/steps/FormStep";
import { Summary } from "../components/steps/Summary";
import { FlowProvider } from "../context/FlowContext";
import { ExecutionPage } from "../pages/ExecutionPage";
import { StepRenderer } from "../components/StepRenderer";
import { compileGraph } from "./graph-compiler";
import type { StepConfig, FlowDefinition, TestCase } from "../types/flow";

const DELAY = 4;

interface TestRoot { render(element: React.ReactNode): void; }

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function syncRender(root: TestRoot, element: React.ReactNode): void {
  root.render(element);
}

function setupTest(): { container: HTMLDivElement; root: TestRoot; teardown: () => void } {
  const container = document.createElement("div");
  container.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:800px;";
  document.body.appendChild(container);
  const root: TestRoot = {
    render(element: React.ReactNode) {
      (ReactDOM as any).render(element, container);
    },
  };
  let tornDown = false;
  const teardown = () => {
    if (tornDown) return;
    tornDown = true;
    try { (ReactDOM as any).unmountComponentAtNode(container); } catch {}
    try { container.remove(); } catch {}
  };
  return { container, root, teardown };
}

function setNativeInputValue(input: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  if (setter) {
    setter.call(input, value);
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  }
}

function getOrderedSteps(def: FlowDefinition): StepConfig[] {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const ordered: StepConfig[] = [];
  const targets = new Set(def.steps.filter((s) => s.next).map((s) => s.next!));
  const entry = def.steps.find((s) => !targets.has(s.id));
  let current: string | null = entry?.id || def.steps[0]?.id || null;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    const step = stepMap.get(current);
    if (step) { ordered.push(step); current = step.next; } else break;
  }
  return ordered;
}

function findConfirmBtn(container: HTMLDivElement): HTMLButtonElement | null {
  for (const b of container.querySelectorAll("button")) {
    if (b.textContent === "Confirm") return b as HTMLButtonElement;
  }
  return null;
}

function findPreviousBtn(container: HTMLDivElement): HTMLButtonElement | null {
  for (const b of container.querySelectorAll("button")) {
    if (b.textContent === "Previous") return b as HTMLButtonElement;
  }
  return null;
}

function findRestartBtn(container: HTMLDivElement): HTMLButtonElement | null {
  for (const b of container.querySelectorAll("button")) {
    if (b.textContent === "Restart") return b as HTMLButtonElement;
  }
  return null;
}

type R = { passed: boolean; error?: string };

async function testRenderElements(step: StepConfig, allSteps: StepConfig[]): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const onComplete = () => {};
    if (step.type === "single-select") {
      syncRender(root, createElement(SingleSelect, { step, onComplete }));
      await wait(DELAY);
      const radios = container.querySelectorAll('input[type="radio"]');
      if (radios.length !== (step.options?.length || 0))
        return { passed: false, error: `Expected ${step.options?.length} radios, found ${radios.length}` };
      return { passed: true };
    }
    if (step.type === "multi-select") {
      syncRender(root, createElement(MultiSelect, { step, onComplete }));
      await wait(DELAY);
      const checks = container.querySelectorAll('input[type="checkbox"]');
      if (checks.length !== (step.options?.length || 0))
        return { passed: false, error: `Expected ${step.options?.length} checkboxes, found ${checks.length}` };
      return { passed: true };
    }
    if (step.type === "form") {
      syncRender(root, createElement(FormStep, { step, onComplete }));
      await wait(DELAY);
      const inputs = container.querySelectorAll("input");
      if (inputs.length !== (step.fields?.length || 0))
        return { passed: false, error: `Expected ${step.fields?.length} inputs, found ${inputs.length}` };
      return { passed: true };
    }
    if (step.type === "summary") {
      const sampleData: Record<string, Record<string, unknown>> = {};
      for (const s of allSteps) {
        if (s.type === "single-select" && s.options) sampleData[s.id] = { selected: s.options[0] };
        if (s.type === "multi-select" && s.options) sampleData[s.id] = { selected: [s.options[0]] };
        if (s.type === "form" && s.fields) {
          const d: Record<string, string> = {};
          s.fields.forEach((f) => { d[f.name] = `test-${f.name}`; });
          sampleData[s.id] = d;
        }
      }
      syncRender(root, createElement(Summary, { step, allData: sampleData, steps: allSteps }));
      await wait(DELAY);
      const heading = container.querySelector("h3");
      if (!heading) return { passed: false, error: "Summary heading missing" };
      for (const s of allSteps.filter((x) => x.type !== "summary")) {
        if (!container.textContent?.includes(s.name))
          return { passed: false, error: `Summary missing step name: "${s.name}"` };
      }
      return { passed: true };
    }
    return { passed: false, error: `Unknown step type: ${step.type}` };
  } finally {
    teardown();
  }
}

async function testRenderHeading(step: StepConfig, allSteps: StepConfig[]): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const onComplete = () => {};
    if (step.type === "single-select") syncRender(root, createElement(SingleSelect, { step, onComplete }));
    else if (step.type === "multi-select") syncRender(root, createElement(MultiSelect, { step, onComplete }));
    else if (step.type === "form") syncRender(root, createElement(FormStep, { step, onComplete }));
    else if (step.type === "summary") {
      const sampleData: Record<string, Record<string, unknown>> = {};
      syncRender(root, createElement(Summary, { step, allData: sampleData, steps: allSteps }));
    }
    await wait(DELAY);
    const heading = container.querySelector("h3");
    if (!heading) return { passed: false, error: "No h3 heading found" };
    const text = heading.textContent || "";
    if (step.type === "summary") {
      if (!text) return { passed: false, error: "Summary heading is empty" };
    } else {
      if (text !== step.name) return { passed: false, error: `Expected heading "${step.name}", got "${text}"` };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testRenderConfirmBtn(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const onComplete = () => {};
    if (step.type === "single-select") syncRender(root, createElement(SingleSelect, { step, onComplete }));
    else if (step.type === "multi-select") syncRender(root, createElement(MultiSelect, { step, onComplete }));
    else if (step.type === "form") syncRender(root, createElement(FormStep, { step, onComplete }));
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testRenderLabels(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const onComplete = () => {};
    if (step.type === "single-select") syncRender(root, createElement(SingleSelect, { step, onComplete }));
    else syncRender(root, createElement(MultiSelect, { step, onComplete }));
    await wait(DELAY);
    const labels = container.querySelectorAll("label");
    if (!step.options) return { passed: false, error: "Step has no options" };
    for (const opt of step.options) {
      let found = false;
      for (const label of labels) {
        if (label.textContent?.includes(opt)) { found = true; break; }
      }
      if (!found) return { passed: false, error: `Label for "${opt}" not found in DOM` };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testPositiveSingleSelect(step: StepConfig, option: string): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const cb: { data: Record<string, unknown> | null } = { data: null };
    const onComplete = (data: Record<string, unknown>) => { cb.data = data; };
    syncRender(root, createElement(SingleSelect, { step, onComplete }));
    await wait(DELAY);
    const radio = container.querySelector(`input[value="${option}"]`) as HTMLInputElement;
    if (!radio) return { passed: false, error: `Radio for "${option}" not found` };
    radio.click();
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    if (btn.disabled) return { passed: false, error: "Confirm button still disabled after selection" };
    btn.click();
    await wait(DELAY);
    if (!cb.data) return { passed: false, error: "onComplete was not called" };
    if (cb.data.selected !== option)
      return { passed: false, error: `Expected selected="${option}", got "${cb.data.selected}"` };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testPositiveMultiSelect(step: StepConfig, options: string[]): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const cb: { data: Record<string, unknown> | null } = { data: null };
    const onComplete = (data: Record<string, unknown>) => { cb.data = data; };
    syncRender(root, createElement(MultiSelect, { step, onComplete }));
    await wait(DELAY);
    for (const opt of options) {
      const labels = container.querySelectorAll("label");
      let found = false;
      for (const label of labels) {
        if (label.textContent?.trim().includes(opt)) {
          const cb = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
          if (cb) { cb.click(); found = true; break; }
        }
      }
      if (!found) return { passed: false, error: `Checkbox for "${opt}" not found` };
      await wait(DELAY);
    }
    const btn = findConfirmBtn(container);
    if (!btn || btn.disabled) return { passed: false, error: "Confirm button not found or disabled" };
    btn.click();
    await wait(DELAY);
    if (!cb.data) return { passed: false, error: "onComplete was not called" };
    const selected = cb.data.selected as string[];
    if (selected.length !== options.length)
      return { passed: false, error: `Expected ${options.length} selected, got ${selected.length}` };
    for (const opt of options) {
      if (!selected.includes(opt)) return { passed: false, error: `Missing "${opt}" in selected` };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testPositiveForm(step: StepConfig, data: Record<string, string>): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const cb: { data: Record<string, unknown> | null } = { data: null };
    const onComplete = (d: Record<string, unknown>) => { cb.data = d; };
    syncRender(root, createElement(FormStep, { step, onComplete }));
    await wait(DELAY);
    const inputs = container.querySelectorAll("input");
    if (!step.fields) return { passed: false, error: "Step has no fields" };
    for (let i = 0; i < step.fields.length; i++) {
      const field = step.fields[i];
      const input = inputs[i] as HTMLInputElement;
      if (!input) return { passed: false, error: `Input for "${field.name}" not found` };
      setNativeInputValue(input, data[field.name] || "");
      await wait(DELAY);
    }
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (!cb.data) return { passed: false, error: "onComplete was not called" };
    for (const field of step.fields) {
      if (cb.data[field.name] !== data[field.name])
        return { passed: false, error: `Field "${field.name}": expected "${data[field.name]}", got "${cb.data[field.name]}"` };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testNegativeSelectEmpty(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    let called = false;
    const onComplete = () => { called = true; };
    if (step.type === "single-select") syncRender(root, createElement(SingleSelect, { step, onComplete }));
    else syncRender(root, createElement(MultiSelect, { step, onComplete }));
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    if (!btn.disabled) return { passed: false, error: "Confirm button should be disabled when nothing selected" };
    btn.click();
    await wait(DELAY);
    if (called) return { passed: false, error: "onComplete should not be called when nothing selected" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testNegativeDoubleClick(step: StepConfig, option: string): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    let callCount = 0;
    const onComplete = () => { callCount++; };
    syncRender(root, createElement(SingleSelect, { step, onComplete }));
    await wait(DELAY);
    const radio = container.querySelector(`input[value="${option}"]`) as HTMLInputElement;
    if (!radio) return { passed: false, error: `Radio for "${option}" not found` };
    radio.click();
    await wait(DELAY);
    radio.click();
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (callCount !== 1) return { passed: false, error: `onComplete called ${callCount} times, expected 1` };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testNegativeDeselect(step: StepConfig, option: string): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    let called = false;
    const onComplete = () => { called = true; };
    syncRender(root, createElement(MultiSelect, { step, onComplete }));
    await wait(DELAY);
    const labels = container.querySelectorAll("label");
    let checkbox: HTMLInputElement | null = null;
    for (const label of labels) {
      if (label.textContent?.trim().includes(option)) {
        checkbox = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
        break;
      }
    }
    if (!checkbox) return { passed: false, error: `Checkbox for "${option}" not found` };
    checkbox.click();
    await wait(DELAY);
    const btnAfterSelect = findConfirmBtn(container);
    if (!btnAfterSelect || btnAfterSelect.disabled) return { passed: false, error: "Confirm should be enabled after selecting" };
    checkbox.click();
    await wait(DELAY);
    const btnAfterDeselect = findConfirmBtn(container);
    if (!btnAfterDeselect) return { passed: false, error: "Confirm button not found" };
    if (!btnAfterDeselect.disabled) return { passed: false, error: "Confirm should be disabled after deselecting all" };
    btnAfterDeselect.click();
    await wait(DELAY);
    if (called) return { passed: false, error: "onComplete should not be called after deselecting" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testNegativeFormMissing(step: StepConfig, data: Record<string, string>, missingField: string): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    let called = false;
    const onComplete = () => { called = true; };
    syncRender(root, createElement(FormStep, { step, onComplete }));
    await wait(DELAY);
    const inputs = container.querySelectorAll("input");
    if (!step.fields) return { passed: false, error: "Step has no fields" };
    for (let i = 0; i < step.fields.length; i++) {
      const field = step.fields[i];
      const input = inputs[i] as HTMLInputElement;
      if (!input) continue;
      const val = data[field.name] || "";
      if (val) {
        setNativeInputValue(input, val);
        await wait(DELAY);
      }
    }
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (called) return { passed: false, error: `onComplete should not be called when "${missingField}" is empty` };
    const errorText = container.textContent || "";
    if (!errorText.toLowerCase().includes("required"))
      return { passed: false, error: `Expected error message for missing "${missingField}"` };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testBoundaryWhitespace(step: StepConfig, data: Record<string, string>, wsField: string): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    let called = false;
    const onComplete = () => { called = true; };
    syncRender(root, createElement(FormStep, { step, onComplete }));
    await wait(DELAY);
    const inputs = container.querySelectorAll("input");
    if (!step.fields) return { passed: false, error: "Step has no fields" };
    for (let i = 0; i < step.fields.length; i++) {
      const field = step.fields[i];
      const input = inputs[i] as HTMLInputElement;
      if (!input) continue;
      setNativeInputValue(input, data[field.name] || "");
      await wait(DELAY);
    }
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (called) return { passed: false, error: `onComplete should not be called when "${wsField}" is whitespace-only` };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testBoundaryRapidClick(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const cb: { data: Record<string, unknown> | null } = { data: null };
    const onComplete = (data: Record<string, unknown>) => { cb.data = data; };
    syncRender(root, createElement(SingleSelect, { step, onComplete }));
    await wait(DELAY);
    if (!step.options || step.options.length < 2) return { passed: true };
    for (const opt of step.options) {
      const radio = container.querySelector(`input[value="${opt}"]`) as HTMLInputElement;
      if (radio) radio.click();
    }
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (!cb.data) return { passed: false, error: "onComplete was not called" };
    const lastOption = step.options[step.options.length - 1];
    if (cb.data.selected !== lastOption)
      return { passed: false, error: `Expected last option "${lastOption}", got "${cb.data.selected}"` };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function completeStep(container: HTMLDivElement, step: StepConfig): Promise<string | null> {
  if (step.type === "single-select" && step.options) {
    const radio = container.querySelector(`input[value="${step.options[0]}"]`) as HTMLInputElement;
    if (!radio) return `radio for "${step.options[0]}" not found`;
    radio.click();
    await wait(DELAY);
  } else if (step.type === "multi-select" && step.options) {
    for (const label of container.querySelectorAll("label")) {
      if (label.textContent?.trim().includes(step.options[0])) {
        const cb = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
        if (cb) { cb.click(); break; }
      }
    }
    await wait(DELAY);
  } else if (step.type === "form" && step.fields) {
    const inputs = container.querySelectorAll('input:not([type="radio"]):not([type="checkbox"])');
    for (let j = 0; j < step.fields.length; j++) {
      const input = inputs[j] as HTMLInputElement;
      if (!input) return `input ${j} not found`;
      setNativeInputValue(input, `test-${step.fields[j].name}`);
      await wait(DELAY);
    }
  } else {
    return null;
  }
  const btn = findConfirmBtn(container);
  if (!btn) return "Confirm button not found";
  btn.click();
  await wait(DELAY * 2);
  return null;
}

async function testIntegrationForward(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    for (let i = 0; i < ordered.length; i++) {
      const step = ordered[i];
      if (!container.textContent?.includes(`Step ${i + 1} of ${ordered.length}`))
        return { passed: false, error: `Expected "Step ${i + 1} of ${ordered.length}"` };
      if (step.type === "summary") {
        if (!container.textContent?.includes(step.name))
          return { passed: false, error: "Summary step did not render" };
        continue;
      }
      const err = await completeStep(container, step);
      if (err) return { passed: false, error: `Step ${i + 1}: ${err}` };
    }
    if (!findRestartBtn(container))
      return { passed: false, error: "Flow did not reach completed state (Restart button missing)" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testIntegrationBackNav(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    if (ordered.length < 3) return { passed: false, error: "Need at least 3 steps" };
    const err1 = await completeStep(container, ordered[0]);
    if (err1) return { passed: false, error: `Step 1: ${err1}` };
    if (!container.textContent?.includes("Step 2 of")) return { passed: false, error: "Did not advance to step 2" };
    const err2 = await completeStep(container, ordered[1]);
    if (err2) return { passed: false, error: `Step 2: ${err2}` };
    if (!container.textContent?.includes("Step 3 of")) return { passed: false, error: "Did not advance to step 3" };
    const prevBtn = findPreviousBtn(container);
    if (!prevBtn) return { passed: false, error: "Previous button not found" };
    prevBtn.click();
    await wait(DELAY * 2);
    if (!container.textContent?.includes("Step 2 of")) return { passed: false, error: "Did not go back to step 2" };
    if (ordered[1].type === "single-select" && ordered[1].options) {
      const radio = container.querySelector(`input[value="${ordered[1].options[0]}"]`) as HTMLInputElement;
      if (!radio) return { passed: false, error: "Step 2 radio not found after going back" };
      if (!radio.checked) return { passed: false, error: `Previous selection "${ordered[1].options[0]}" was not preserved` };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testIntegrationRestart(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    for (const step of ordered) {
      if (step.type === "summary") continue;
      const err = await completeStep(container, step);
      if (err) return { passed: false, error: err };
    }
    const restartBtn = findRestartBtn(container);
    if (!restartBtn) return { passed: false, error: "Restart button not found" };
    restartBtn.click();
    await wait(DELAY * 2);
    if (!container.textContent?.includes(`Step 1 of ${ordered.length}`))
      return { passed: false, error: "Did not reset to step 1 after Restart" };
    const radios = container.querySelectorAll('input[type="radio"]');
    for (const r of radios) {
      if ((r as HTMLInputElement).checked)
        return { passed: false, error: "Radio still checked after Restart, state not cleared" };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testIntegrationBackFromFirst(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const prevBtn = findPreviousBtn(container);
    if (!prevBtn) return { passed: false, error: "Previous button not found" };
    if (!prevBtn.disabled) return { passed: false, error: "Previous button should be disabled on step 1" };
    prevBtn.click();
    await wait(DELAY);
    if (!container.textContent?.includes("Step 1 of"))
      return { passed: false, error: "Clicking disabled Previous moved away from step 1" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testIntegrationRevisit(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    if (ordered.length < 3) return { passed: false, error: "Need at least 3 steps" };
    const err1 = await completeStep(container, ordered[0]);
    if (err1) return { passed: false, error: `Step 1: ${err1}` };
    if (!container.textContent?.includes("Step 2 of")) return { passed: false, error: "Did not advance to step 2" };
    const prevBtn = findPreviousBtn(container);
    if (!prevBtn) return { passed: false, error: "Previous button not found" };
    prevBtn.click();
    await wait(DELAY * 2);
    if (!container.textContent?.includes("Step 1 of")) return { passed: false, error: "Did not go back to step 1" };
    const err1b = await completeStep(container, ordered[0]);
    if (err1b) return { passed: false, error: `Re-confirm step 1: ${err1b}` };
    if (!container.textContent?.includes("Step 2 of"))
      return { passed: false, error: "Did not advance to step 2 after re-confirm" };
    const err2 = await completeStep(container, ordered[1]);
    if (err2) return { passed: false, error: `Step 2: ${err2}` };
    if (!container.textContent?.includes("Step 3 of"))
      return { passed: false, error: "Did not advance to step 3 after revisit" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testRenderDataValues(step: StepConfig, allSteps: StepConfig[]): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const sampleData: Record<string, Record<string, unknown>> = {};
    for (const s of allSteps) {
      if (s.type === "single-select" && s.options) sampleData[s.id] = { selected: s.options[0] };
      if (s.type === "multi-select" && s.options) sampleData[s.id] = { selected: [s.options[0]] };
      if (s.type === "form" && s.fields) {
        const d: Record<string, string> = {};
        s.fields.forEach((f) => { d[f.name] = `test-${f.name}`; });
        sampleData[s.id] = d;
      }
    }
    syncRender(root, createElement(Summary, { step, allData: sampleData, steps: allSteps }));
    await wait(DELAY);
    const text = container.textContent || "";
    for (const s of allSteps) {
      if (s.type === "summary") continue;
      const data = sampleData[s.id];
      if (!data) continue;
      for (const val of Object.values(data)) {
        const strVal = Array.isArray(val) ? val[0] : String(val);
        if (!text.includes(String(strVal)))
          return { passed: false, error: `Data value "${strVal}" from step "${s.name}" not found in summary` };
      }
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testRenderRequiredIndicator(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FormStep, { step, onComplete: () => {} }));
    await wait(DELAY);
    const text = container.textContent || "";
    if (!text.includes("*"))
      return { passed: false, error: "Required field indicator (*) not found" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testRenderStepRenderer(step: StepConfig, allSteps: StepConfig[]): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(StepRenderer, { step, allData: {}, allSteps, onComplete: () => {} }));
    await wait(DELAY);
    if (step.type === "single-select") {
      if (!container.querySelector('input[type="radio"]'))
        return { passed: false, error: "StepRenderer did not render SingleSelect (no radios)" };
    } else if (step.type === "multi-select") {
      if (!container.querySelector('input[type="checkbox"]'))
        return { passed: false, error: "StepRenderer did not render MultiSelect (no checkboxes)" };
    } else if (step.type === "form") {
      if (!container.querySelector("input"))
        return { passed: false, error: "StepRenderer did not render FormStep (no inputs)" };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testPositiveChangeSelection(step: StepConfig, first: string, second: string): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const cb: { data: Record<string, unknown> | null } = { data: null };
    const onComplete = (data: Record<string, unknown>) => { cb.data = data; };
    syncRender(root, createElement(SingleSelect, { step, onComplete }));
    await wait(DELAY);
    const r1 = container.querySelector(`input[value="${first}"]`) as HTMLInputElement;
    if (!r1) return { passed: false, error: `Radio for "${first}" not found` };
    r1.click();
    await wait(DELAY);
    const r2 = container.querySelector(`input[value="${second}"]`) as HTMLInputElement;
    if (!r2) return { passed: false, error: `Radio for "${second}" not found` };
    r2.click();
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (!cb.data) return { passed: false, error: "onComplete was not called" };
    if (cb.data.selected !== second)
      return { passed: false, error: `Expected "${second}", got "${cb.data.selected}"` };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testPositiveSummaryDisplay(step: StepConfig, allSteps: StepConfig[]): Promise<R> {
  return testRenderDataValues(step, allSteps);
}

async function testNegativeDeselectAll(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    let called = false;
    const onComplete = () => { called = true; };
    syncRender(root, createElement(MultiSelect, { step, onComplete }));
    await wait(DELAY);
    if (!step.options) return { passed: false, error: "No options" };
    for (const opt of step.options) {
      for (const label of container.querySelectorAll("label")) {
        if (label.textContent?.trim().includes(opt)) {
          const cb = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
          if (cb) cb.click();
          break;
        }
      }
      await wait(DELAY);
    }
    for (const opt of step.options) {
      for (const label of container.querySelectorAll("label")) {
        if (label.textContent?.trim().includes(opt)) {
          const cb = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
          if (cb) cb.click();
          break;
        }
      }
      await wait(DELAY);
    }
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    if (!btn.disabled) return { passed: false, error: "Confirm should be disabled after deselecting all" };
    btn.click();
    await wait(DELAY);
    if (called) return { passed: false, error: "onComplete should not fire after deselecting all" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testNegativeErrorRecovery(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    const cb: { data: Record<string, unknown> | null } = { data: null };
    const onComplete = (data: Record<string, unknown>) => { cb.data = data; };
    syncRender(root, createElement(FormStep, { step, onComplete }));
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (cb.data) return { passed: false, error: "onComplete should not fire on empty required fields" };
    const errorText = container.textContent || "";
    if (!errorText.toLowerCase().includes("required"))
      return { passed: false, error: "No error message shown" };
    const inputs = container.querySelectorAll("input");
    if (!step.fields) return { passed: false, error: "No fields" };
    for (let i = 0; i < step.fields.length; i++) {
      const input = inputs[i] as HTMLInputElement;
      if (input) {
        setNativeInputValue(input, `test-${step.fields[i].name}`);
        await wait(DELAY);
      }
    }
    btn.click();
    await wait(DELAY);
    if (!cb.data) return { passed: false, error: "onComplete was not called after fixing errors" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testIntegrationSummaryData(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    for (const step of ordered) {
      if (step.type === "summary") continue;
      const err = await completeStep(container, step);
      if (err) return { passed: false, error: err };
    }
    const text = container.textContent || "";
    for (const step of ordered) {
      if (step.type === "summary") continue;
      if (!text.includes(step.name))
        return { passed: false, error: `Summary missing step name "${step.name}"` };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testIntegrationMinFlow(def: FlowDefinition): Promise<R> {
  const ordered = getOrderedSteps(def);
  if (ordered.length < 2) return { passed: false, error: "Need at least 2 steps" };
  const minDef: FlowDefinition = {
    id: "min-test",
    name: "Min Flow",
    steps: [
      { ...ordered[0], next: "min-summary" },
      { id: "min-summary", name: "Summary", order: 2, type: "summary", next: null },
    ],
  };
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: minDef, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    if (!container.textContent?.includes("Step 1 of 2"))
      return { passed: false, error: "Min flow did not start at step 1 of 2" };
    const err = await completeStep(container, minDef.steps[0]);
    if (err) return { passed: false, error: err };
    if (!findRestartBtn(container))
      return { passed: false, error: "Min flow did not complete" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testPermutationReversed(def: FlowDefinition): Promise<R> {
  const original = getOrderedSteps(def);
  const reversed: FlowDefinition = { ...def, steps: [...def.steps].reverse() };
  const reordered = getOrderedSteps(reversed);
  if (reordered.length !== original.length)
    return { passed: false, error: `Reversed array produced ${reordered.length} steps, expected ${original.length}` };
  for (let i = 0; i < original.length; i++) {
    if (reordered[i].id !== original[i].id)
      return { passed: false, error: `Step ${i + 1}: expected "${original[i].id}", got "${reordered[i].id}"` };
  }
  return { passed: true };
}

async function testPermutationSwapped(def: FlowDefinition): Promise<R> {
  const original = getOrderedSteps(def);
  const mid = Math.floor(def.steps.length / 2);
  const swapped = [...def.steps];
  [swapped[0], swapped[mid]] = [swapped[mid], swapped[0]];
  const swappedDef: FlowDefinition = { ...def, steps: swapped };
  const reordered = getOrderedSteps(swappedDef);
  if (reordered.length !== original.length)
    return { passed: false, error: `Swapped array produced ${reordered.length} steps, expected ${original.length}` };
  for (let i = 0; i < original.length; i++) {
    if (reordered[i].id !== original[i].id)
      return { passed: false, error: `Step ${i + 1}: expected "${original[i].id}", got "${reordered[i].id}"` };
  }
  return { passed: true };
}

async function testPermutationOrderFieldIgnored(def: FlowDefinition): Promise<R> {
  const original = getOrderedSteps(def);
  const shuffled: FlowDefinition = {
    ...def,
    steps: def.steps.map((s, i) => ({ ...s, order: def.steps.length - i })),
  };
  const reordered = getOrderedSteps(shuffled);
  if (reordered.length !== original.length)
    return { passed: false, error: `Shuffled orders produced ${reordered.length} steps, expected ${original.length}` };
  for (let i = 0; i < original.length; i++) {
    if (reordered[i].id !== original[i].id)
      return { passed: false, error: `Step ${i + 1}: expected "${original[i].id}", got "${reordered[i].id}" (order field affected result)` };
  }
  return { passed: true };
}

async function testValidation(input: Record<string, unknown>, def: FlowDefinition): Promise<R> {
  if (input._validFlow) {
    const result = compileGraph(def);
    if (!result.valid) return { passed: false, error: `Current flow should be valid but got: ${result.errors.map((e) => e.message).join(", ")}` };
    return { passed: true };
  }
  if (input._cycle) {
    const cyclic: FlowDefinition = { id: "test", name: "test", steps: [
      { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: "b" },
      { id: "b", name: "B", order: 2, type: "single-select", options: ["x"], next: "a" },
    ]};
    const result = compileGraph(cyclic);
    if (result.valid) return { passed: false, error: "Cycle should be detected as invalid" };
    if (!result.errors.some((e) => e.message.toLowerCase().includes("cycle") || e.message.toLowerCase().includes("terminal")))
      return { passed: false, error: "Error message should mention cycle" };
    return { passed: true };
  }
  if (input._orphan) {
    const orphan: FlowDefinition = { id: "test", name: "test", steps: [
      { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: null },
      { id: "b", name: "B", order: 2, type: "single-select", options: ["x"], next: null },
    ]};
    const result = compileGraph(orphan);
    if (result.valid) return { passed: false, error: "Orphan step should be detected" };
    return { passed: true };
  }
  if (input._duplicateId) {
    const dup: FlowDefinition = { id: "test", name: "test", steps: [
      { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: null },
      { id: "a", name: "A2", order: 2, type: "single-select", options: ["x"], next: null },
    ]};
    const result = compileGraph(dup);
    if (result.valid) return { passed: false, error: "Duplicate ID should be detected" };
    if (!result.errors.some((e) => e.message.toLowerCase().includes("duplicate")))
      return { passed: false, error: "Error should mention duplicate" };
    return { passed: true };
  }
  if (input._invalidType) {
    const bad: FlowDefinition = { id: "test", name: "test", steps: [
      { id: "a", name: "A", order: 1, type: "dropdown" as "single-select", options: ["x"], next: null },
    ]};
    const result = compileGraph(bad);
    if (result.valid) return { passed: false, error: "Invalid type should be detected" };
    if (!result.errors.some((e) => e.message.toLowerCase().includes("invalid type")))
      return { passed: false, error: "Error should mention invalid type" };
    return { passed: true };
  }
  if (input._brokenNext) {
    const broken: FlowDefinition = { id: "test", name: "test", steps: [
      { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: "nonexistent" },
    ]};
    const result = compileGraph(broken);
    if (result.valid) return { passed: false, error: "Broken next reference should be detected" };
    return { passed: true };
  }
  if (input._noTerminal) {
    const noTerm: FlowDefinition = { id: "test", name: "test", steps: [
      { id: "a", name: "A", order: 1, type: "single-select", options: ["x"], next: "b" },
      { id: "b", name: "B", order: 2, type: "single-select", options: ["x"], next: "a" },
    ]};
    const result = compileGraph(noTerm);
    if (result.valid) return { passed: false, error: "No terminal step should be detected" };
    return { passed: true };
  }
  if (input._missingOptions) {
    const noOpts: FlowDefinition = { id: "test", name: "test", steps: [
      { id: "a", name: "A", order: 1, type: "single-select", next: null },
    ]};
    const result = compileGraph(noOpts);
    if (result.valid) return { passed: false, error: "Missing options should be detected" };
    return { passed: true };
  }
  if (input._emptySteps) {
    const empty: FlowDefinition = { id: "test", name: "test", steps: [] };
    const result = compileGraph(empty);
    if (result.valid) return { passed: false, error: "Empty steps should be detected" };
    return { passed: true };
  }
  return { passed: false, error: "Unknown validation test" };
}

async function testIdempotencyDoubleRun(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    for (const step of ordered) {
      if (step.type === "summary") continue;
      const err = await completeStep(container, step);
      if (err) return { passed: false, error: `First run: ${err}` };
    }
    if (!findRestartBtn(container)) return { passed: false, error: "First run did not complete" };
    const restartBtn = findRestartBtn(container)!;
    restartBtn.click();
    await wait(DELAY * 2);
    if (!container.textContent?.includes(`Step 1 of ${ordered.length}`))
      return { passed: false, error: "Did not reset to step 1" };
    for (const step of ordered) {
      if (step.type === "summary") continue;
      const err = await completeStep(container, step);
      if (err) return { passed: false, error: `Second run: ${err}` };
    }
    if (!findRestartBtn(container)) return { passed: false, error: "Second run did not complete" };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testIdempotencyRestartClean(def: FlowDefinition): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    for (const step of ordered) {
      if (step.type === "summary") continue;
      const err = await completeStep(container, step);
      if (err) return { passed: false, error: err };
    }
    const restartBtn = findRestartBtn(container);
    if (!restartBtn) return { passed: false, error: "Restart not found" };
    restartBtn.click();
    await wait(DELAY * 2);
    const radios = container.querySelectorAll('input[type="radio"]');
    for (const r of radios) {
      if ((r as HTMLInputElement).checked)
        return { passed: false, error: "State leak: radio still checked after restart" };
    }
    const checkboxes = container.querySelectorAll('input[type="checkbox"]');
    for (const c of checkboxes) {
      if ((c as HTMLInputElement).checked)
        return { passed: false, error: "State leak: checkbox still checked after restart" };
    }
    const textInputs = container.querySelectorAll('input[type="text"]');
    for (const t of textInputs) {
      if ((t as HTMLInputElement).value)
        return { passed: false, error: "State leak: text input still has value after restart" };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testA11yRadioName(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(SingleSelect, { step, onComplete: () => {} }));
    await wait(DELAY);
    const radios = container.querySelectorAll('input[type="radio"]');
    if (radios.length === 0) return { passed: false, error: "No radios found" };
    const names = new Set<string>();
    for (const r of radios) names.add((r as HTMLInputElement).name);
    if (names.size !== 1)
      return { passed: false, error: `Radios have ${names.size} different name attributes, should be 1` };
    if (!names.has(step.id))
      return { passed: false, error: `Radio name should be "${step.id}", got "${[...names][0]}"` };
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testA11yFormLabels(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    syncRender(root, createElement(FormStep, { step, onComplete: () => {} }));
    await wait(DELAY);
    if (!step.fields) return { passed: false, error: "No fields" };
    const labels = container.querySelectorAll("label");
    if (labels.length < step.fields.length)
      return { passed: false, error: `Expected ${step.fields.length} labels, found ${labels.length}` };
    for (const field of step.fields) {
      let found = false;
      for (const label of labels) {
        if (label.textContent?.includes(field.name)) {
          const input = label.querySelector("input") || label.parentElement?.querySelector("input");
          if (input) { found = true; break; }
        }
      }
      if (!found) return { passed: false, error: `Field "${field.name}" has no associated label with input` };
    }
    return { passed: true };
  } finally {
    teardown();
  }
}

async function testA11yBtnText(step: StepConfig): Promise<R> {
  const { container, root, teardown } = setupTest();
  try {
    if (step.type === "single-select") syncRender(root, createElement(SingleSelect, { step, onComplete: () => {} }));
    else if (step.type === "multi-select") syncRender(root, createElement(MultiSelect, { step, onComplete: () => {} }));
    else if (step.type === "form") syncRender(root, createElement(FormStep, { step, onComplete: () => {} }));
    await wait(DELAY);
    const btn = findConfirmBtn(container);
    if (!btn) return { passed: false, error: "Confirm button not found" };
    if (!btn.textContent?.trim()) return { passed: false, error: "Button has no text content (bad for screen readers)" };
    return { passed: true };
  } finally {
    teardown();
  }
}

export async function executeTest(test: TestCase, def: FlowDefinition): Promise<TestCase> {
  let timer: ReturnType<typeof setTimeout>;
  const timeoutPromise = new Promise<TestCase>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Test timed out after 5s")), 5000);
  });
  return Promise.race([runTest(test, def), timeoutPromise])
    .catch((e) => ({
      ...test,
      status: "failed" as const,
      actual: "fail" as const,
      error: (e as Error).message,
    }))
    .finally(() => clearTimeout(timer));
}

async function runTest(test: TestCase, def: FlowDefinition): Promise<TestCase> {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const ordered = getOrderedSteps(def);

  function result(r: R): TestCase {
    return { ...test, status: r.passed ? "passed" : "failed", actual: r.passed ? "pass" : "fail", error: r.error };
  }

  try {
    if (test.category === "render") {
      const step = stepMap.get(test.path[0]);
      if (!step) return result({ passed: false, error: "Step not found" });
      if (test.input._checkHeading) return result(await testRenderHeading(step, ordered));
      if (test.input._checkConfirmBtn) return result(await testRenderConfirmBtn(step));
      if (test.input._checkLabels) return result(await testRenderLabels(step));
      if (test.input._checkDataValues) return result(await testRenderDataValues(step, ordered));
      if (test.input._checkRequiredIndicator) return result(await testRenderRequiredIndicator(step));
      if (test.input._checkStepRenderer) return result(await testRenderStepRenderer(step, ordered));
      return result(await testRenderElements(step, ordered));
    }

    if (test.category === "positive") {
      const step = stepMap.get(test.path[0]);
      if (!step) return result({ passed: false, error: "Step not found" });
      if (test.input._changeSelection) return result(await testPositiveChangeSelection(step, test.input.first as string, test.input.second as string));
      if (test.input._summaryDisplay) return result(await testPositiveSummaryDisplay(step, ordered));
      if (step.type === "single-select") return result(await testPositiveSingleSelect(step, test.input.selected as string));
      if (step.type === "multi-select") return result(await testPositiveMultiSelect(step, test.input.selected as string[]));
      if (step.type === "form") return result(await testPositiveForm(step, test.input as Record<string, string>));
      return result({ passed: true });
    }

    if (test.category === "negative") {
      const step = stepMap.get(test.path[0]);
      if (!step) return result({ passed: false, error: "Step not found" });
      if (test.input._doubleClick) return result(await testNegativeDoubleClick(step, test.input.selected as string));
      if (test.input._deselect) return result(await testNegativeDeselect(step, test.input.selected as string));
      if (test.input._deselectAll) return result(await testNegativeDeselectAll(step));
      if (test.input._errorRecovery) return result(await testNegativeErrorRecovery(step));
      if (step.type === "single-select" || step.type === "multi-select") return result(await testNegativeSelectEmpty(step));
      if (step.type === "form") {
        const missingField = test.input._missingField as string;
        const data = { ...test.input } as Record<string, string>;
        delete data._missingField;
        return result(await testNegativeFormMissing(step, data, missingField));
      }
      return result({ passed: true });
    }

    if (test.category === "integration") {
      if (test.id === "integration-forward") return result(await testIntegrationForward(def));
      if (test.id === "integration-back-nav") return result(await testIntegrationBackNav(def));
      if (test.id === "integration-restart") return result(await testIntegrationRestart(def));
      if (test.id === "integration-back-from-first") return result(await testIntegrationBackFromFirst(def));
      if (test.id === "integration-revisit") return result(await testIntegrationRevisit(def));
      if (test.id === "integration-summary-data") return result(await testIntegrationSummaryData(def));
      if (test.id === "integration-min-flow") return result(await testIntegrationMinFlow(def));
      return result({ passed: false, error: "Unknown integration test" });
    }

    if (test.category === "boundary") {
      const step = stepMap.get(test.path[0]);
      if (!step) return result({ passed: false, error: "Step not found" });
      if (test.input._whitespaceField) {
        const wsField = test.input._whitespaceField as string;
        const data = { ...test.input } as Record<string, string>;
        delete data._whitespaceField;
        return result(await testBoundaryWhitespace(step, data, wsField));
      }
      if (test.input._rapidClick) return result(await testBoundaryRapidClick(step));
      if (test.input._singleOption && step.type === "single-select")
        return result(await testPositiveSingleSelect(step, test.input.selected as string));
      if (test.input._singleOption && step.type === "multi-select")
        return result(await testPositiveMultiSelect(step, test.input.selected as string[]));
      return result(await testPositiveForm(step, test.input as Record<string, string>));
    }

    if (test.category === "permutation") {
      if (test.id === "permutation-reversed-array") return result(await testPermutationReversed(def));
      if (test.id === "permutation-swapped") return result(await testPermutationSwapped(def));
      if (test.id === "permutation-order-field-ignored") return result(await testPermutationOrderFieldIgnored(def));
      return result({ passed: false, error: "Unknown permutation test" });
    }

    if (test.category === "validation") {
      return result(await testValidation(test.input, def));
    }

    if (test.category === "idempotency") {
      if (test.id === "idempotency-double-run") return result(await testIdempotencyDoubleRun(def));
      if (test.id === "idempotency-restart-clean") return result(await testIdempotencyRestartClean(def));
      return result({ passed: false, error: "Unknown idempotency test" });
    }

    if (test.category === "accessibility") {
      const step = stepMap.get(test.path[0]);
      if (!step) return result({ passed: false, error: "Step not found" });
      if (test.input._radioName) return result(await testA11yRadioName(step));
      if (test.input._formLabels) return result(await testA11yFormLabels(step));
      if (test.input._btnText) return result(await testA11yBtnText(step));
      return result({ passed: false, error: "Unknown accessibility test" });
    }

    return result({ passed: false, error: "Unknown test category" });
  } catch (e) {
    return result({ passed: false, error: (e as Error).message });
  }
}
