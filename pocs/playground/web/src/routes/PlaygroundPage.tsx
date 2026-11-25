import { useMemo } from "react";
import { usePlayground } from "../app/playground.tsx";
import { Editor } from "../components/Editor.tsx";
import { errorLines } from "../editor/completion.ts";
import { Icon } from "../icons.tsx";
import { Panel } from "../panels/Panel.tsx";

export function PlaygroundPage() {
  const { code, revision, setCode, run, format, clear, state } = usePlayground();
  const errors = useMemo(() => (state.kind === "done" ? errorLines(state.result.stderr) : new Set<number>()), [state]);
  const status =
    state.kind === "running"
      ? { cls: "running", text: "running" }
      : state.kind === "error"
        ? { cls: "fail", text: "error" }
        : state.kind === "done"
          ? state.result.timedOut
            ? { cls: "timeout", text: "timed out" }
            : { cls: state.result.exitCode === 0 ? "ok" : "fail", text: `${state.result.phase === "typecheck" ? "type error" : `exit ${state.result.exitCode}`} · ${state.result.durationMs} ms` }
          : { cls: "", text: "idle" };
  return (
    <div className="view" data-view="playground">
      <Panel
        id="editor"
        title="Editor"
        view="playground"
        icon="editor"
        toolbar={
          <>
            <button className="btn primary" data-sc="run" onClick={run}>
              <Icon name="play" />
              Run
            </button>
            <button className="btn" data-sc="format" onClick={format}>
              <Icon name="format" />
              Format
            </button>
          </>
        }
      >
        <Editor key={revision} initialValue={code} errorLines={errors} onChange={setCode} />
      </Panel>
      <Panel
        id="output"
        title="Output"
        view="playground"
        icon="terminal"
        toolbar={
          <>
            <span className={`status ${status.cls}`}>{status.text}</span>
            <button className="btn" data-sc="clear" onClick={clear}>
              <Icon name="trash" />
              Clear
            </button>
          </>
        }
      >
        <div className="output">
          {state.kind === "idle" && <div className="muted">Press Run or ⌘ Enter to type check and run your program.</div>}
          {state.kind === "running" && <div className="muted">Type checking and running...</div>}
          {state.kind === "error" && <pre className="stderr">{state.message}</pre>}
          {state.kind === "done" && (
            <>
              {state.result.stdout && <pre className="stdout">{state.result.stdout}</pre>}
              {state.result.stderr && <pre className="stderr">{state.result.stderr}</pre>}
              {!state.result.stdout && !state.result.stderr && <div className="muted">Program exited with no output.</div>}
            </>
          )}
        </div>
      </Panel>
    </div>
  );
}
