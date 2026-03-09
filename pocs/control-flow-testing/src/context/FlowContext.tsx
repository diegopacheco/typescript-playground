import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { FlowDefinition, FlowState, FlowContextValue, StepOutput, StepConfig } from "../types/flow";
import defaultFlow from "../default-flow.json";

const initialState: FlowState = {
  currentStepIndex: 0,
  completedSteps: [],
  collectedData: {},
  status: "in-progress",
};

interface FlowProviderContextValue extends FlowContextValue {
  setDefinition: (def: FlowDefinition) => void;
}

const FlowContext = createContext<FlowProviderContextValue | null>(null);

export function FlowProvider({ children, initialDefinition }: { children: ReactNode; initialDefinition?: FlowDefinition }) {
  const [definition, setDefinition] = useState<FlowDefinition>((initialDefinition || defaultFlow) as FlowDefinition);
  const [state, setState] = useState<FlowState>(initialState);

  const getOrderedSteps = useCallback((): StepConfig[] => {
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
      } else {
        break;
      }
    }
    return ordered;
  }, [definition]);

  const getCurrentStep = useCallback((): StepConfig => {
    const ordered = getOrderedSteps();
    return ordered[state.currentStepIndex];
  }, [getOrderedSteps, state.currentStepIndex]);

  const getStepData = useCallback(
    (stepId: string): Record<string, unknown> | undefined => {
      return state.collectedData[stepId];
    },
    [state.collectedData]
  );

  const goNext = useCallback(
    (output: StepOutput) => {
      const ordered = getOrderedSteps();
      setState((prev) => {
        const newData = { ...prev.collectedData, [output.stepId]: output.data };
        const newCompleted = prev.completedSteps.includes(output.stepId)
          ? prev.completedSteps
          : [...prev.completedSteps, output.stepId];
        const nextIndex = prev.currentStepIndex + 1;
        const pastEnd = nextIndex >= ordered.length;
        const reachedLast = nextIndex === ordered.length - 1;
        return {
          currentStepIndex: pastEnd ? prev.currentStepIndex : nextIndex,
          completedSteps: newCompleted,
          collectedData: newData,
          status: pastEnd || reachedLast ? "completed" : "in-progress",
        };
      });
    },
    [getOrderedSteps]
  );

  const goBack = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStepIndex: Math.max(0, prev.currentStepIndex - 1),
      status: "in-progress",
    }));
  }, []);

  const goToStep = useCallback(
    (stepId: string) => {
      const ordered = getOrderedSteps();
      const idx = ordered.findIndex((s) => s.id === stepId);
      if (idx >= 0) {
        setState((prev) => ({
          ...prev,
          currentStepIndex: idx,
          status: "in-progress",
        }));
      }
    },
    [getOrderedSteps]
  );

  const resetFlow = useCallback(() => {
    setState(initialState);
  }, []);

  const handleSetDefinition = useCallback((def: FlowDefinition) => {
    setDefinition(def);
    setState(initialState);
  }, []);

  return (
    <FlowContext.Provider
      value={{
        definition,
        state,
        goNext,
        goBack,
        goToStep,
        getCurrentStep,
        getStepData,
        resetFlow,
        setDefinition: handleSetDefinition,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlow(): FlowProviderContextValue {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within FlowProvider");
  return ctx;
}
