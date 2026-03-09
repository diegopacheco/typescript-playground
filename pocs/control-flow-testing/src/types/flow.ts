export interface FormField {
  name: string;
  type: "text" | "number" | "email";
  required: boolean;
}

export interface StepConfig {
  id: string;
  name: string;
  order: number;
  type: "single-select" | "multi-select" | "form" | "summary";
  options?: string[];
  fields?: FormField[];
  next: string | null;
}

export interface StepOutput {
  stepId: string;
  data: Record<string, unknown>;
  valid: boolean;
  errors: string[];
}

export interface FlowDefinition {
  id: string;
  name: string;
  steps: StepConfig[];
}

export interface FlowState {
  currentStepIndex: number;
  completedSteps: string[];
  collectedData: Record<string, Record<string, unknown>>;
  status: "in-progress" | "completed" | "error";
}

export interface FlowContextValue {
  definition: FlowDefinition;
  state: FlowState;
  goNext: (output: StepOutput) => void;
  goBack: () => void;
  goToStep: (stepId: string) => void;
  getCurrentStep: () => StepConfig;
  getStepData: (stepId: string) => Record<string, unknown> | undefined;
  resetFlow: () => void;
}

export interface ValidationError {
  stepId?: string;
  message: string;
}

export interface CompilationResult {
  valid: boolean;
  errors: ValidationError[];
  path: string[];
}

export interface TestCase {
  id: string;
  name: string;
  category: "render" | "positive" | "negative" | "integration" | "boundary" | "permutation" | "validation" | "idempotency" | "accessibility";
  path: string[];
  input: Record<string, unknown>;
  expected: "pass" | "fail";
  actual?: "pass" | "fail";
  status: "pending" | "running" | "passed" | "failed";
  error?: string;
}
