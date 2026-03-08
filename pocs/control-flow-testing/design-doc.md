# Control Flow Testing - Design Document

## Overview

A generic dynamic multi-step application engine. Users define step flows via JSON orchestration, the system renders and executes them, exposes contracts per component, and generates combinatorial tests to verify all possible graph paths.

## Stack

- React + TypeScript
- Vite + Bun
- TanStack Router (tabs/routing)
- TanStack Query (state/data)
- TanStack Table (test results display)
- npm (package manager)
- Vitest (testing)

## Architecture

### Core Concept

The entire application is driven by a JSON flow definition. Each node in the flow represents a step component. Steps are generic: they receive typed input and produce typed output. The engine renders steps in the order defined by the graph, passing data between them.

### Component Independence

Each step component (SingleSelect, MultiSelect, FormStep, Summary) must work both independently and as part of the larger flow. A component can be rendered standalone with props/context for isolated testing or embedded in the flow engine for full orchestration. Components have no knowledge of each other or the overall flow — they only know their own config and the data passed to them.

### Navigation (Forward and Backward)

The flow engine supports bidirectional navigation. Users can go forward (Next) and backward (Previous) through the steps. When going backward, previously collected data is preserved so the user can review or edit earlier choices without losing progress. The FlowState tracks the full history of collected data per step. Going back to a step re-loads its previous output as the current selection. Going forward from a revisited step overwrites that step's data with the new selection.

### Shared State via React Context

A `FlowContext` (React Context) holds the current FlowDefinition, FlowState, and navigation functions (goNext, goBack, goToStep). This context is provided at the app level so all tabs and components can access the shared flow state. TanStack Query manages the flow definition (from Tab 1), while the FlowContext manages runtime execution state (current step, collected data, navigation). Components consume the context to read their config and submit their output without coupling to the parent.

### Flow Definition Schema

```json
{
  "id": "pizza-order",
  "name": "Pizza Order",
  "steps": [
    {
      "id": "style",
      "name": "Select Style",
      "order": 1,
      "type": "single-select",
      "options": ["NY", "Deep Dish", "Thin", "Ultra-Thin"],
      "next": "flavor"
    },
    {
      "id": "flavor",
      "name": "Select Flavor",
      "order": 2,
      "type": "single-select",
      "options": ["Pepperoni", "Steak", "Chicken", "Margherita"],
      "next": "toppings"
    },
    {
      "id": "toppings",
      "name": "Select Toppings",
      "order": 3,
      "type": "multi-select",
      "options": ["Garlic", "Salt", "Pepper", "Mayo", "Cheese", "Bacon"],
      "next": "delivery"
    },
    {
      "id": "delivery",
      "name": "Delivery Details",
      "order": 4,
      "type": "form",
      "fields": [
        { "name": "address", "type": "text", "required": true },
        { "name": "phone", "type": "text", "required": true },
        { "name": "notes", "type": "text", "required": false }
      ],
      "next": "summary"
    },
    {
      "id": "summary",
      "name": "Order Accepted",
      "order": 5,
      "type": "summary",
      "next": null
    }
  ]
}
```

### Step Types

| Type | Description | Input | Output |
|------|-------------|-------|--------|
| `single-select` | Pick one option from a list | `options: string[]` | `{ selected: string }` |
| `multi-select` | Pick multiple options from a list | `options: string[]` | `{ selected: string[] }` |
| `form` | Fill in form fields | `fields: Field[]` | `{ [fieldName]: value }` |
| `summary` | Read-only display of all collected data | all previous outputs | none |

## Tabs

### Tab 1 - Orchestration

- JSON editor where the user writes/edits the flow definition
- Loads with the default pizza order flow
- JSON validation on save (schema check)
- Stores the parsed flow in TanStack Query cache so all other tabs react to changes
- **Live graph preview**: side-by-side layout with the JSON editor on the left and a mini flow graph on the right. As the user edits the JSON, the graph updates in real-time showing the step nodes and connections. Invalid JSON grays out the preview with an error indicator.
- **Compile & Validate button**: compiles the graph and runs validation checks. Shows a clear VALID/INVALID status with detailed error messages. Validation rules:
  - JSON is syntactically valid
  - All required fields present on each step (id, name, order, type, next)
  - No duplicate step IDs
  - Every `next` reference points to an existing step ID (or is null for the last step)
  - No circular references (detects cycles in the graph)
  - Exactly one terminal step (next: null)
  - All steps are reachable from the first step
  - Step types have their required fields (options for select types, fields for form type)
  - Graph is fully connected (no orphan steps)
- Valid graphs show green status with a checkmark. Invalid graphs show red status with the list of errors and highlight the problematic steps in the preview.

### Tab 2 - Execution

- Renders the flow graph visually: `1 -> 2 -> 3 -> 4 -> 5 -> END`
- Graph is dynamic based on whatever JSON was defined in Tab 1
- Each step node is rendered inside an iframe
- Clicking a node or pressing "Next" advances the flow
- Each iframe step component receives its input via `postMessage` and sends output back via `postMessage`
- The engine tracks current step, collected data, and navigation state

#### Iframe Communication Protocol

```
Parent -> Iframe: { type: "INIT", stepConfig: StepConfig, previousData: Record<string, any> }
Iframe -> Parent: { type: "COMPLETE", output: Record<string, any> }
Iframe -> Parent: { type: "VALIDATE", valid: boolean, errors: string[] }
```

### Tab 3 - Details

- Lists every step/component defined in the flow
- For each step shows:
  - Step ID, name, type, order
  - Input contract (TypeScript type)
  - Output contract (TypeScript type)
- Contracts are derived from the flow JSON automatically

#### TypeScript Contracts

```typescript
interface StepConfig {
  id: string;
  name: string;
  order: number;
  type: "single-select" | "multi-select" | "form" | "summary";
  options?: string[];
  fields?: FormField[];
  next: string | null;
}

interface FormField {
  name: string;
  type: "text" | "number" | "email";
  required: boolean;
}

interface StepInput {
  stepConfig: StepConfig;
  previousData: Record<string, unknown>;
}

interface StepOutput {
  stepId: string;
  data: Record<string, unknown>;
  valid: boolean;
  errors: string[];
}

interface FlowDefinition {
  id: string;
  name: string;
  steps: StepConfig[];
}

interface FlowState {
  currentStepIndex: number;
  completedSteps: string[];
  collectedData: Record<string, Record<string, unknown>>;
  status: "in-progress" | "completed" | "error";
}

interface FlowContextValue {
  definition: FlowDefinition;
  state: FlowState;
  goNext: (output: StepOutput) => void;
  goBack: () => void;
  goToStep: (stepId: string) => void;
  getCurrentStep: () => StepConfig;
  getStepData: (stepId: string) => Record<string, unknown> | undefined;
}
```

### Tab 4 - Testing

- Generates tests automatically from the flow definition
- Test categories:
  - **Path tests**: every valid graph traversal (1->2->3->4->5, and any reordered flows if user changes the JSON)
  - **Positive tests**: valid selections at each step (pick valid option, fill required fields)
  - **Negative tests**: invalid selections (empty selection, missing required fields, invalid option values)
  - **Combinatorial tests**: all combinations of options across steps (e.g. NY + Pepperoni + [Garlic, Cheese] + valid address)
  - **Boundary tests**: max/min selections, empty inputs, special characters in form fields
- Uses Vitest to run tests programmatically
- Displays results in a TanStack Table with columns: Test Name, Path, Input, Expected, Actual, Status (pass/fail)
- Run All / Run Selected buttons

#### Test Generation Strategy

```
For each step in flow:
  positive: one test per valid option/combination
  negative: empty input, out-of-range, wrong type
For graph paths:
  generate all permutations if flow allows reordering
  generate the defined linear path
For integration:
  full flow end-to-end with valid data
  full flow with one step failing
```

## Project Structure

```
src/
  components/
    steps/
      SingleSelect.tsx
      MultiSelect.tsx
      FormStep.tsx
      Summary.tsx
    StepRenderer.tsx
    FlowGraph.tsx
    JsonEditor.tsx
    ContractViewer.tsx
    TestRunner.tsx
    TestResultsTable.tsx
  context/
    FlowContext.tsx
  engine/
    flow-engine.ts
    flow-validator.ts
    graph-compiler.ts
    step-registry.ts
    iframe-bridge.ts
  pages/
    OrchestrationPage.tsx
    ExecutionPage.tsx
    DetailsPage.tsx
    TestingPage.tsx
  types/
    flow.ts
    steps.ts
  tests/
    test-generator.ts
    test-runner.ts
  App.tsx
  main.tsx
  default-flow.json
run.sh
stop.sh
```

Pages live in `src/pages/` and are tab-level containers. Components live in `src/components/` and are reusable building blocks that work both standalone and inside the flow.

## Scripts

### run.sh
- Installs dependencies (`bun install`)
- Starts the dev server (`bun run dev`)

### stop.sh
- Finds and kills the Vite dev server process

## Data Flow

```
[Tab 1: JSON Editor]
    |
    v
  FlowDefinition (stored in TanStack Query cache)
    |
    +--> [Tab 2: Execution] -> FlowEngine -> StepRenderer (iframes) -> FlowState
    |
    +--> [Tab 3: Details] -> ContractViewer (derives types from FlowDefinition)
    |
    +--> [Tab 4: Testing] -> TestGenerator -> TestRunner -> TestResultsTable
```

## Key Design Decisions

1. **Everything is generic**: no pizza-specific code in the engine. The pizza flow is just the default JSON.
2. **Iframe isolation**: each step runs in an iframe for true component isolation. Communication via postMessage.
3. **JSON-driven**: changing the JSON changes everything - the execution flow, the contracts, and the generated tests.
4. **TanStack Query as shared state**: the flow definition lives in the query cache, all tabs subscribe to it reactively.
5. **Test generation from schema**: tests are auto-generated from the flow definition, not hand-written.
6. **Component independence**: every step component works standalone (with props) or inside the flow. No coupling between components.
7. **Bidirectional navigation**: users can go forward and backward through the flow, preserving data at each step.
8. **React Context for shared state**: FlowContext provides the flow definition, runtime state, and navigation functions to all components and pages.
