import { useMemo } from "react";
import { useFlow } from "../context/FlowContext";
import { FlowGraph } from "../components/FlowGraph";
import { StepRenderer } from "../components/StepRenderer";
import type { StepConfig } from "../types/flow";

export function ExecutionPage() {
  const { definition, state, goNext, goBack, getCurrentStep, resetFlow } = useFlow();

  const orderedSteps = useMemo((): StepConfig[] => {
    const stepMap = new Map(definition.steps.map((s) => [s.id, s]));
    const ordered: StepConfig[] = [];
    let current: string | null = definition.steps[0]?.id;
    const visited = new Set<string>();
    while (current && !visited.has(current)) {
      visited.add(current);
      const step = stepMap.get(current);
      if (step) { ordered.push(step); current = step.next; } else break;
    }
    return ordered;
  }, [definition]);

  const currentStep = getCurrentStep();

  const handleComplete = (data: Record<string, unknown>) => {
    if (!currentStep) return;
    goNext({ stepId: currentStep.id, data, valid: true, errors: [] });
  };

  return (
    <div>
      <FlowGraph
        definition={definition}
        currentStepId={currentStep?.id}
        completedSteps={state.completedSteps}
      />
      <div style={{ margin: "20px 0", display: "flex", gap: "8px", alignItems: "center" }}>
        <button
          onClick={goBack}
          disabled={state.currentStepIndex === 0}
          style={{
            padding: "8px 16px",
            background: state.currentStepIndex === 0 ? "#e5e7eb" : "#f3f4f6",
            color: state.currentStepIndex === 0 ? "#9ca3af" : "#374151",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            cursor: state.currentStepIndex === 0 ? "not-allowed" : "pointer",
            fontSize: "13px",
          }}
        >
          Previous
        </button>
        <span style={{ fontSize: "13px", color: "#6b7280" }}>
          Step {state.currentStepIndex + 1} of {orderedSteps.length}
        </span>
        {state.status === "completed" && (
          <button
            onClick={resetFlow}
            style={{
              padding: "8px 16px",
              background: "#4f46e5",
              color: "#fff",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              fontSize: "13px",
              marginLeft: "auto",
            }}
          >
            Restart
          </button>
        )}
      </div>
      <div
        style={{
          border: "2px solid #e5e7eb",
          borderRadius: "8px",
          minHeight: "300px",
          background: "#fff",
        }}
      >
        {currentStep && (
          <StepRenderer
            key={currentStep.id}
            step={currentStep}
            allData={state.collectedData}
            allSteps={orderedSteps}
            onComplete={handleComplete}
          />
        )}
      </div>
    </div>
  );
}
