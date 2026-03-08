import { useFlow } from "../context/FlowContext";
import { ContractViewer } from "../components/ContractViewer";

export function DetailsPage() {
  const { definition } = useFlow();
  return (
    <div>
      <h3 style={{ marginTop: 0, marginBottom: "16px" }}>Component Contracts</h3>
      <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "20px" }}>
        Input and output contracts for each step in "{definition.name}"
      </p>
      <ContractViewer steps={definition.steps} />
    </div>
  );
}
