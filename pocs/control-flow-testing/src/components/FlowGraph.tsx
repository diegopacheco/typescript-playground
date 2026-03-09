import type { FlowDefinition, StepConfig } from "../types/flow";

interface Props {
  definition: FlowDefinition;
  currentStepId?: string;
  completedSteps?: string[];
  errorStepIds?: string[];
  onStepClick?: (stepId: string) => void;
  mini?: boolean;
}

function getOrderedSteps(definition: FlowDefinition): StepConfig[] {
  const stepMap = new Map(definition.steps.map((s) => [s.id, s]));
  const targets = new Set(definition.steps.filter((s) => s.next).map((s) => s.next!));
  const entry = definition.steps.find((s) => !targets.has(s.id));
  const ordered: StepConfig[] = [];
  let current: string | null = entry?.id || definition.steps[0]?.id || null;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    const step = stepMap.get(current);
    if (step) {
      ordered.push(step);
      current = step.next;
    } else break;
  }
  for (const step of definition.steps) {
    if (!visited.has(step.id)) ordered.push(step);
  }
  return ordered;
}

export function FlowGraph({ definition, currentStepId, completedSteps = [], errorStepIds = [], onStepClick, mini }: Props) {
  const ordered = getOrderedSteps(definition);
  const fontSize = mini ? "11px" : "13px";
  const nodePad = mini ? "6px 10px" : "10px 16px";

  const getNodeStyle = (step: StepConfig) => {
    const isError = errorStepIds.includes(step.id);
    const isCurrent = step.id === currentStepId;
    const isCompleted = completedSteps.includes(step.id);
    let bg = "#fff";
    let border = "2px solid #e5e7eb";
    if (isError) { bg = "#fef2f2"; border = "2px solid #ef4444"; }
    else if (isCurrent) { bg = "#eef2ff"; border = "2px solid #4f46e5"; }
    else if (isCompleted) { bg = "#f0fdf4"; border = "2px solid #22c55e"; }
    return {
      padding: nodePad,
      borderRadius: "8px",
      background: bg,
      border,
      cursor: onStepClick ? "pointer" : "default",
      fontSize,
      fontWeight: isCurrent ? 600 : 400,
      textAlign: "center" as const,
      minWidth: mini ? "60px" : "100px",
    };
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap", padding: "10px" }}>
      {ordered.map((step, i) => (
        <div key={step.id} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div
            style={getNodeStyle(step)}
            onClick={() => onStepClick?.(step.id)}
          >
            {step.name}
          </div>
          {i < ordered.length - 1 && (
            <span style={{ color: "#9ca3af", fontSize }}>→</span>
          )}
        </div>
      ))}
      <span style={{ color: "#9ca3af", fontSize }}>→</span>
      <div
        style={{
          padding: nodePad,
          borderRadius: "8px",
          background: "#f3f4f6",
          border: "2px solid #d1d5db",
          fontSize,
          fontWeight: 600,
        }}
      >
        END
      </div>
    </div>
  );
}
