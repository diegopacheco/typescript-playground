import type { StepConfig } from "../types/flow";
import { SingleSelect } from "./steps/SingleSelect";
import { MultiSelect } from "./steps/MultiSelect";
import { FormStep } from "./steps/FormStep";
import { Summary } from "./steps/Summary";

interface Props {
  step: StepConfig;
  allData: Record<string, Record<string, unknown>>;
  allSteps: StepConfig[];
  onComplete: (data: Record<string, unknown>) => void;
}

export function StepRenderer({ step, allData, allSteps, onComplete }: Props) {
  const existingData = allData[step.id];

  switch (step.type) {
    case "single-select":
      return (
        <SingleSelect
          step={step}
          initialValue={existingData?.selected as string}
          onComplete={onComplete}
        />
      );
    case "multi-select":
      return (
        <MultiSelect
          step={step}
          initialValue={existingData?.selected as string[]}
          onComplete={onComplete}
        />
      );
    case "form":
      return (
        <FormStep
          step={step}
          initialValue={existingData}
          onComplete={onComplete}
        />
      );
    case "summary":
      return <Summary step={step} allData={allData} steps={allSteps} />;
    default:
      return <div>Unknown step type: {step.type}</div>;
  }
}
