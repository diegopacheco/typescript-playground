import type { FlowDefinition, ValidationError, CompilationResult } from "../types/flow";

function validateRequiredFields(flow: FlowDefinition): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!flow.id) errors.push({ message: "Flow must have an id" });
  if (!flow.name) errors.push({ message: "Flow must have a name" });
  if (!flow.steps || flow.steps.length === 0) {
    errors.push({ message: "Flow must have at least one step" });
    return errors;
  }
  for (const step of flow.steps) {
    if (!step.id) errors.push({ stepId: step.id, message: `Step is missing id` });
    if (!step.name) errors.push({ stepId: step.id, message: `Step "${step.id}" is missing name` });
    if (step.order === undefined) errors.push({ stepId: step.id, message: `Step "${step.id}" is missing order` });
    if (!step.type) errors.push({ stepId: step.id, message: `Step "${step.id}" is missing type` });
    if (step.next === undefined) errors.push({ stepId: step.id, message: `Step "${step.id}" is missing next` });
  }
  return errors;
}

function validateDuplicateIds(flow: FlowDefinition): ValidationError[] {
  const seen = new Set<string>();
  const errors: ValidationError[] = [];
  for (const step of flow.steps) {
    if (seen.has(step.id)) {
      errors.push({ stepId: step.id, message: `Duplicate step id: "${step.id}"` });
    }
    seen.add(step.id);
  }
  return errors;
}

function validateReferences(flow: FlowDefinition): ValidationError[] {
  const ids = new Set(flow.steps.map((s) => s.id));
  const errors: ValidationError[] = [];
  for (const step of flow.steps) {
    if (step.next !== null && !ids.has(step.next)) {
      errors.push({ stepId: step.id, message: `Step "${step.id}" references unknown next: "${step.next}"` });
    }
  }
  return errors;
}

function validateTerminalSteps(flow: FlowDefinition): ValidationError[] {
  const terminals = flow.steps.filter((s) => s.next === null);
  if (terminals.length === 0) {
    return [{ message: "Flow must have exactly one terminal step (next: null)" }];
  }
  if (terminals.length > 1) {
    return [{ message: `Flow has ${terminals.length} terminal steps, must have exactly one` }];
  }
  return [];
}

function validateCycles(flow: FlowDefinition): ValidationError[] {
  const visited = new Set<string>();
  const stepMap = new Map(flow.steps.map((s) => [s.id, s]));
  let current: string | null = flow.steps[0]?.id;
  while (current) {
    if (visited.has(current)) {
      return [{ stepId: current, message: `Cycle detected at step "${current}"` }];
    }
    visited.add(current);
    current = stepMap.get(current)?.next ?? null;
  }
  return [];
}

function validateReachability(flow: FlowDefinition): ValidationError[] {
  const stepMap = new Map(flow.steps.map((s) => [s.id, s]));
  const reachable = new Set<string>();
  let current: string | null = flow.steps[0]?.id;
  while (current) {
    reachable.add(current);
    current = stepMap.get(current)?.next ?? null;
  }
  const errors: ValidationError[] = [];
  for (const step of flow.steps) {
    if (!reachable.has(step.id)) {
      errors.push({ stepId: step.id, message: `Step "${step.id}" is not reachable from the first step` });
    }
  }
  return errors;
}

function validateStepTypeFields(flow: FlowDefinition): ValidationError[] {
  const errors: ValidationError[] = [];
  for (const step of flow.steps) {
    if ((step.type === "single-select" || step.type === "multi-select") && (!step.options || step.options.length === 0)) {
      errors.push({ stepId: step.id, message: `Step "${step.id}" (${step.type}) must have options` });
    }
    if (step.type === "form" && (!step.fields || step.fields.length === 0)) {
      errors.push({ stepId: step.id, message: `Step "${step.id}" (form) must have fields` });
    }
  }
  return errors;
}

function buildPath(flow: FlowDefinition): string[] {
  const stepMap = new Map(flow.steps.map((s) => [s.id, s]));
  const path: string[] = [];
  let current: string | null = flow.steps[0]?.id;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    path.push(current);
    current = stepMap.get(current)?.next ?? null;
  }
  return path;
}

export function compileGraph(flow: FlowDefinition): CompilationResult {
  const allErrors: ValidationError[] = [
    ...validateRequiredFields(flow),
    ...validateDuplicateIds(flow),
    ...validateReferences(flow),
    ...validateTerminalSteps(flow),
    ...validateCycles(flow),
    ...validateReachability(flow),
    ...validateStepTypeFields(flow),
  ];
  return {
    valid: allErrors.length === 0,
    errors: allErrors,
    path: allErrors.length === 0 ? buildPath(flow) : [],
  };
}
