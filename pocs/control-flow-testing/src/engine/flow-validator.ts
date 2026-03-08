import type { StepConfig, StepOutput } from "../types/flow";

export function validateStepOutput(step: StepConfig, output: StepOutput): string[] {
  const errors: string[] = [];
  if (step.type === "single-select") {
    const selected = output.data.selected as string;
    if (!selected) {
      errors.push("Must select an option");
    } else if (step.options && !step.options.includes(selected)) {
      errors.push(`Invalid option: "${selected}"`);
    }
  }
  if (step.type === "multi-select") {
    const selected = output.data.selected as string[];
    if (!selected || selected.length === 0) {
      errors.push("Must select at least one option");
    } else if (step.options) {
      for (const s of selected) {
        if (!step.options.includes(s)) {
          errors.push(`Invalid option: "${s}"`);
        }
      }
    }
  }
  if (step.type === "form" && step.fields) {
    for (const field of step.fields) {
      if (field.required && !output.data[field.name]) {
        errors.push(`Field "${field.name}" is required`);
      }
    }
  }
  return errors;
}
