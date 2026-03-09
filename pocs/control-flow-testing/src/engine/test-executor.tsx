import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { SingleSelect } from "../components/steps/SingleSelect";
import { MultiSelect } from "../components/steps/MultiSelect";
import { FormStep } from "../components/steps/FormStep";
import { Summary } from "../components/steps/Summary";
import { FlowProvider } from "../context/FlowContext";
import { ExecutionPage } from "../pages/ExecutionPage";
import type { StepConfig, FlowDefinition, TestCase } from "../types/flow";

const DELAY = 80;

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

function createTestContainer(): HTMLDivElement {
  const div = document.createElement("div");
  div.style.cssText = "position:absolute;left:-9999px;top:-9999px;width:800px;";
  document.body.appendChild(div);
  return div;
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
  let current: string | null = def.steps[0]?.id;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    const step = stepMap.get(current);
    if (step) { ordered.push(step); current = step.next; } else break;
  }
  return ordered;
}

async function testRender(step: StepConfig, allSteps: StepConfig[]): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    const onComplete = () => {};
    if (step.type === "single-select") {
      root.render(createElement(SingleSelect, { step, onComplete }));
      await wait(DELAY);
      const radios = container.querySelectorAll('input[type="radio"]');
      if (radios.length !== (step.options?.length || 0)) {
        return { passed: false, error: `Expected ${step.options?.length} radio buttons, found ${radios.length}` };
      }
      const heading = container.querySelector("h3");
      if (!heading || heading.textContent !== step.name) {
        return { passed: false, error: `Heading missing or wrong: "${heading?.textContent}"` };
      }
      return { passed: true };
    }
    if (step.type === "multi-select") {
      root.render(createElement(MultiSelect, { step, onComplete }));
      await wait(DELAY);
      const checks = container.querySelectorAll('input[type="checkbox"]');
      if (checks.length !== (step.options?.length || 0)) {
        return { passed: false, error: `Expected ${step.options?.length} checkboxes, found ${checks.length}` };
      }
      return { passed: true };
    }
    if (step.type === "form") {
      root.render(createElement(FormStep, { step, onComplete }));
      await wait(DELAY);
      const inputs = container.querySelectorAll("input");
      if (inputs.length !== (step.fields?.length || 0)) {
        return { passed: false, error: `Expected ${step.fields?.length} inputs, found ${inputs.length}` };
      }
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
      root.render(createElement(Summary, { step, allData: sampleData, steps: allSteps }));
      await wait(DELAY);
      const heading = container.querySelector("h3");
      if (!heading) return { passed: false, error: "Summary heading missing" };
      const nonSummarySteps = allSteps.filter((s) => s.type !== "summary");
      for (const s of nonSummarySteps) {
        if (!container.textContent?.includes(s.name)) {
          return { passed: false, error: `Summary missing step name: "${s.name}"` };
        }
      }
      return { passed: true };
    }
    return { passed: false, error: `Unknown step type: ${step.type}` };
  } finally {
    root.unmount();
    container.remove();
  }
}

async function testPositiveSingleSelect(step: StepConfig, option: string): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    let callbackData: Record<string, unknown> | null = null;
    const onComplete = (data: Record<string, unknown>) => { callbackData = data; };
    root.render(createElement(SingleSelect, { step, onComplete }));
    await wait(DELAY);
    const radio = container.querySelector(`input[value="${option}"]`) as HTMLInputElement;
    if (!radio) return { passed: false, error: `Radio for "${option}" not found` };
    radio.click();
    await wait(DELAY);
    const btn = container.querySelector("button") as HTMLButtonElement;
    if (!btn) return { passed: false, error: "Confirm button not found" };
    if (btn.disabled) return { passed: false, error: "Confirm button still disabled after selection" };
    btn.click();
    await wait(DELAY);
    if (!callbackData) return { passed: false, error: "onComplete was not called" };
    if ((callbackData as Record<string, unknown>).selected !== option) {
      return { passed: false, error: `Expected selected="${option}", got "${(callbackData as Record<string, unknown>).selected}"` };
    }
    return { passed: true };
  } finally {
    root.unmount();
    container.remove();
  }
}

async function testPositiveMultiSelect(step: StepConfig, options: string[]): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    let callbackData: Record<string, unknown> | null = null;
    const onComplete = (data: Record<string, unknown>) => { callbackData = data; };
    root.render(createElement(MultiSelect, { step, onComplete }));
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
    const btn = container.querySelector("button") as HTMLButtonElement;
    if (!btn || btn.disabled) return { passed: false, error: "Confirm button not found or disabled" };
    btn.click();
    await wait(DELAY);
    if (!callbackData) return { passed: false, error: "onComplete was not called" };
    const selected = (callbackData as Record<string, unknown>).selected as string[];
    if (selected.length !== options.length) {
      return { passed: false, error: `Expected ${options.length} selected, got ${selected.length}` };
    }
    for (const opt of options) {
      if (!selected.includes(opt)) return { passed: false, error: `Missing "${opt}" in selected` };
    }
    return { passed: true };
  } finally {
    root.unmount();
    container.remove();
  }
}

async function testPositiveForm(step: StepConfig, data: Record<string, string>): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    let callbackData: Record<string, unknown> | null = null;
    const onComplete = (d: Record<string, unknown>) => { callbackData = d; };
    root.render(createElement(FormStep, { step, onComplete }));
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
    const btn = container.querySelector("button") as HTMLButtonElement;
    if (!btn) return { passed: false, error: "Confirm button not found" };
    btn.click();
    await wait(DELAY);
    if (!callbackData) return { passed: false, error: "onComplete was not called" };
    for (const field of step.fields) {
      if ((callbackData as Record<string, unknown>)[field.name] !== data[field.name]) {
        return { passed: false, error: `Field "${field.name}": expected "${data[field.name]}", got "${(callbackData as Record<string, unknown>)[field.name]}"` };
      }
    }
    return { passed: true };
  } finally {
    root.unmount();
    container.remove();
  }
}

async function testNegativeSelectEmpty(step: StepConfig): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    let called = false;
    const onComplete = () => { called = true; };
    if (step.type === "single-select") {
      root.render(createElement(SingleSelect, { step, onComplete }));
    } else {
      root.render(createElement(MultiSelect, { step, onComplete }));
    }
    await wait(DELAY);
    const btn = container.querySelector("button") as HTMLButtonElement;
    if (!btn) return { passed: false, error: "Confirm button not found" };
    if (!btn.disabled) return { passed: false, error: "Confirm button should be disabled when nothing selected" };
    btn.click();
    await wait(DELAY);
    if (called) return { passed: false, error: "onComplete should not be called when nothing selected" };
    return { passed: true };
  } finally {
    root.unmount();
    container.remove();
  }
}

async function testNegativeFormMissing(step: StepConfig, data: Record<string, string>, missingField: string): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    let called = false;
    const onComplete = () => { called = true; };
    root.render(createElement(FormStep, { step, onComplete }));
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
    const btn = container.querySelector("button") as HTMLButtonElement;
    btn.click();
    await wait(DELAY);
    if (called) return { passed: false, error: `onComplete should not be called when "${missingField}" is empty` };
    const errorText = container.textContent || "";
    if (!errorText.toLowerCase().includes("required")) {
      return { passed: false, error: `Expected error message for missing "${missingField}"` };
    }
    return { passed: true };
  } finally {
    root.unmount();
    container.remove();
  }
}

async function testIntegrationForward(def: FlowDefinition): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    root.render(createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    for (let i = 0; i < ordered.length; i++) {
      const step = ordered[i];
      const stepIndicator = container.textContent || "";
      if (!stepIndicator.includes(`Step ${i + 1} of ${ordered.length}`)) {
        return { passed: false, error: `Expected "Step ${i + 1} of ${ordered.length}", page shows: "${stepIndicator.slice(0, 100)}"` };
      }
      if (step.type === "single-select" && step.options) {
        const radio = container.querySelector(`input[value="${step.options[0]}"]`) as HTMLInputElement;
        if (!radio) return { passed: false, error: `Step ${i + 1}: radio for "${step.options[0]}" not found` };
        radio.click();
        await wait(DELAY);
        const confirmBtns = container.querySelectorAll("button");
        let confirmBtn: HTMLButtonElement | null = null;
        for (const b of confirmBtns) { if (b.textContent === "Confirm") { confirmBtn = b as HTMLButtonElement; break; } }
        if (!confirmBtn) return { passed: false, error: `Step ${i + 1}: Confirm button not found` };
        confirmBtn.click();
        await wait(DELAY * 2);
      } else if (step.type === "multi-select" && step.options) {
        const labels = container.querySelectorAll("label");
        let clicked = false;
        for (const label of labels) {
          if (label.textContent?.trim().includes(step.options[0])) {
            const cb = label.querySelector('input[type="checkbox"]') as HTMLInputElement;
            if (cb) { cb.click(); clicked = true; break; }
          }
        }
        if (!clicked) return { passed: false, error: `Step ${i + 1}: checkbox for "${step.options[0]}" not found` };
        await wait(DELAY);
        const confirmBtns = container.querySelectorAll("button");
        let confirmBtn: HTMLButtonElement | null = null;
        for (const b of confirmBtns) { if (b.textContent === "Confirm") { confirmBtn = b as HTMLButtonElement; break; } }
        if (!confirmBtn) return { passed: false, error: `Step ${i + 1}: Confirm button not found` };
        confirmBtn.click();
        await wait(DELAY * 2);
      } else if (step.type === "form" && step.fields) {
        const inputs = container.querySelectorAll('div:last-child input:not([type="radio"]):not([type="checkbox"])');
        for (let j = 0; j < step.fields.length; j++) {
          const input = inputs[j] as HTMLInputElement;
          if (!input) return { passed: false, error: `Step ${i + 1}: input ${j} not found` };
          setNativeInputValue(input, `test-${step.fields[j].name}`);
          await wait(DELAY);
        }
        const confirmBtns = container.querySelectorAll("button");
        let confirmBtn: HTMLButtonElement | null = null;
        for (const b of confirmBtns) { if (b.textContent === "Confirm") { confirmBtn = b as HTMLButtonElement; break; } }
        if (!confirmBtn) return { passed: false, error: `Step ${i + 1}: Confirm button not found` };
        confirmBtn.click();
        await wait(DELAY * 2);
      } else if (step.type === "summary") {
        const text = container.textContent || "";
        if (!text.includes("Order Accepted") && !text.includes(step.name)) {
          return { passed: false, error: "Summary step did not render" };
        }
      }
    }
    const finalText = container.textContent || "";
    if (!finalText.includes("Restart")) {
      return { passed: false, error: "Flow did not reach completed state (Restart button missing)" };
    }
    return { passed: true };
  } finally {
    root.unmount();
    container.remove();
  }
}

async function testIntegrationBackNav(def: FlowDefinition): Promise<{ passed: boolean; error?: string }> {
  const container = createTestContainer();
  const root = createRoot(container);
  try {
    root.render(createElement(FlowProvider, { initialDefinition: def, children: createElement(ExecutionPage) }));
    await wait(DELAY * 2);
    const ordered = getOrderedSteps(def);
    if (ordered.length < 3) return { passed: false, error: "Need at least 3 steps for back-nav test" };
    const step1 = ordered[0];
    if (step1.type === "single-select" && step1.options) {
      const radio = container.querySelector(`input[value="${step1.options[0]}"]`) as HTMLInputElement;
      if (!radio) return { passed: false, error: "Step 1 radio not found" };
      radio.click();
      await wait(DELAY);
      let confirmBtn: HTMLButtonElement | null = null;
      for (const b of container.querySelectorAll("button")) { if (b.textContent === "Confirm") { confirmBtn = b as HTMLButtonElement; break; } }
      if (!confirmBtn) return { passed: false, error: "Step 1 Confirm not found" };
      confirmBtn.click();
      await wait(DELAY * 2);
    }
    if (!container.textContent?.includes("Step 2 of")) {
      return { passed: false, error: "Did not advance to step 2" };
    }
    const step2 = ordered[1];
    if (step2.type === "single-select" && step2.options) {
      const radio = container.querySelector(`input[value="${step2.options[0]}"]`) as HTMLInputElement;
      if (!radio) return { passed: false, error: "Step 2 radio not found" };
      radio.click();
      await wait(DELAY);
      let confirmBtn: HTMLButtonElement | null = null;
      for (const b of container.querySelectorAll("button")) { if (b.textContent === "Confirm") { confirmBtn = b as HTMLButtonElement; break; } }
      if (!confirmBtn) return { passed: false, error: "Step 2 Confirm not found" };
      confirmBtn.click();
      await wait(DELAY * 2);
    }
    if (!container.textContent?.includes("Step 3 of")) {
      return { passed: false, error: "Did not advance to step 3" };
    }
    let prevBtn: HTMLButtonElement | null = null;
    for (const b of container.querySelectorAll("button")) { if (b.textContent === "Previous") { prevBtn = b as HTMLButtonElement; break; } }
    if (!prevBtn) return { passed: false, error: "Previous button not found" };
    prevBtn.click();
    await wait(DELAY * 2);
    if (!container.textContent?.includes("Step 2 of")) {
      return { passed: false, error: "Did not go back to step 2" };
    }
    if (step2.type === "single-select" && step2.options) {
      const radio = container.querySelector(`input[value="${step2.options[0]}"]`) as HTMLInputElement;
      if (!radio) return { passed: false, error: "Step 2 radio not found after going back" };
      if (!radio.checked) return { passed: false, error: `Previous selection "${step2.options[0]}" was not preserved` };
    }
    return { passed: true };
  } finally {
    root.unmount();
    container.remove();
  }
}

export async function executeTest(test: TestCase, def: FlowDefinition): Promise<TestCase> {
  const stepMap = new Map(def.steps.map((s) => [s.id, s]));
  const ordered = getOrderedSteps(def);
  try {
    if (test.category === "render") {
      const step = stepMap.get(test.path[0]);
      if (!step) return { ...test, status: "failed", actual: "fail", error: "Step not found" };
      const result = await testRender(step, ordered);
      return { ...test, status: result.passed ? "passed" : "failed", actual: result.passed ? "pass" : "fail", error: result.error };
    }
    if (test.category === "positive") {
      const step = stepMap.get(test.path[0]);
      if (!step) return { ...test, status: "failed", actual: "fail", error: "Step not found" };
      let result: { passed: boolean; error?: string };
      if (step.type === "single-select") {
        result = await testPositiveSingleSelect(step, test.input.selected as string);
      } else if (step.type === "multi-select") {
        result = await testPositiveMultiSelect(step, test.input.selected as string[]);
      } else if (step.type === "form") {
        result = await testPositiveForm(step, test.input as Record<string, string>);
      } else {
        return { ...test, status: "passed", actual: "pass" };
      }
      return { ...test, status: result.passed ? "passed" : "failed", actual: result.passed ? "pass" : "fail", error: result.error };
    }
    if (test.category === "negative") {
      const step = stepMap.get(test.path[0]);
      if (!step) return { ...test, status: "failed", actual: "fail", error: "Step not found" };
      let result: { passed: boolean; error?: string };
      if (step.type === "single-select" || step.type === "multi-select") {
        result = await testNegativeSelectEmpty(step);
      } else if (step.type === "form") {
        const missingField = test.input._missingField as string;
        const data = { ...test.input } as Record<string, string>;
        delete data._missingField;
        result = await testNegativeFormMissing(step, data, missingField);
      } else {
        return { ...test, status: "passed", actual: "pass" };
      }
      return { ...test, status: result.passed ? "passed" : "failed", actual: result.passed ? "pass" : "fail", error: result.error };
    }
    if (test.category === "integration") {
      let result: { passed: boolean; error?: string };
      if (test.id === "integration-forward") {
        result = await testIntegrationForward(def);
      } else {
        result = await testIntegrationBackNav(def);
      }
      return { ...test, status: result.passed ? "passed" : "failed", actual: result.passed ? "pass" : "fail", error: result.error };
    }
    if (test.category === "boundary") {
      const step = stepMap.get(test.path[0]);
      if (!step) return { ...test, status: "failed", actual: "fail", error: "Step not found" };
      const result = await testPositiveForm(step, test.input as Record<string, string>);
      return { ...test, status: result.passed ? "passed" : "failed", actual: result.passed ? "pass" : "fail", error: result.error };
    }
    return { ...test, status: "failed", actual: "fail", error: "Unknown test category" };
  } catch (e) {
    return { ...test, status: "failed", actual: "fail", error: (e as Error).message };
  }
}
