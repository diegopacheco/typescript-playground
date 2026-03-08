import { useState } from "react";
import { FlowProvider } from "./context/FlowContext";
import { OrchestrationPage } from "./pages/OrchestrationPage";
import { ExecutionPage } from "./pages/ExecutionPage";
import { DetailsPage } from "./pages/DetailsPage";
import { TestingPage } from "./pages/TestingPage";

const tabs = [
  { id: "orchestration", label: "Orchestration" },
  { id: "execution", label: "Execution" },
  { id: "details", label: "Details" },
  { id: "testing", label: "Testing" },
] as const;

type TabId = (typeof tabs)[number]["id"];

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case "orchestration": return <OrchestrationPage />;
    case "execution": return <ExecutionPage />;
    case "details": return <DetailsPage />;
    case "testing": return <TestingPage />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("orchestration");

  return (
    <FlowProvider>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", fontFamily: "system-ui, sans-serif" }}>
        <h1 style={{ margin: "0 0 20px", fontSize: "24px" }}>Control Flow Testing</h1>
        <div style={{ display: "flex", gap: "0", borderBottom: "2px solid #e5e7eb", marginBottom: "20px" }}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderBottom: activeTab === tab.id ? "2px solid #4f46e5" : "2px solid transparent",
                background: "none",
                color: activeTab === tab.id ? "#4f46e5" : "#6b7280",
                fontWeight: activeTab === tab.id ? 600 : 400,
                cursor: "pointer",
                fontSize: "14px",
                marginBottom: "-2px",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <TabContent tab={activeTab} />
      </div>
    </FlowProvider>
  );
}
