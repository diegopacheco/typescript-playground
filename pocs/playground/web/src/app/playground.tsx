import { useNavigate } from "@tanstack/react-router";
import { createContext, use, useCallback, useMemo, useState, type ReactNode } from "react";
import { useFormatCode, useRunCode } from "../features/runner/hooks.ts";
import type { RunResult } from "../features/runner/types.ts";
import { useUi } from "./ui.tsx";

const CODE_KEY = "code";

export const DEFAULT_CODE = `type Task =
  | { readonly kind: "ok"; readonly name: string; readonly ms: number }
  | { readonly kind: "failed"; readonly name: string; readonly reason: string };

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function work(name: string, ms: number): Promise<Task> {
  await sleep(ms);
  return ms > 100 ? { kind: "failed", name, reason: "too slow" } : { kind: "ok", name, ms };
}

function describe(task: Task): string {
  switch (task.kind) {
    case "ok":
      return \`\${task.name} finished in \${task.ms}ms\`;
    case "failed":
      return \`\${task.name} failed: \${task.reason}\`;
  }
}

const tasks = await Promise.all([work("fetch", 40), work("parse", 20), work("render", 120)]);
tasks.map(describe).forEach((line) => console.log(line));
`;

type RunState =
  | { readonly kind: "idle" }
  | { readonly kind: "running" }
  | { readonly kind: "done"; readonly result: RunResult }
  | { readonly kind: "error"; readonly message: string };

type Playground = {
  readonly code: string;
  readonly revision: number;
  readonly setCode: (code: string) => void;
  readonly load: (code: string, runNow: boolean) => void;
  readonly run: () => void;
  readonly format: () => void;
  readonly clear: () => void;
  readonly state: RunState;
};

const PlaygroundContext = createContext<Playground | null>(null);

export function PlaygroundProvider({ children }: { readonly children: ReactNode }) {
  const [code, setCodeState] = useState(() => localStorage.getItem(CODE_KEY) ?? DEFAULT_CODE);
  const [revision, setRevision] = useState(0);
  const runner = useRunCode();
  const formatter = useFormatCode();
  const { notify } = useUi();
  const navigate = useNavigate();

  const setCode = useCallback((next: string) => {
    localStorage.setItem(CODE_KEY, next);
    setCodeState(next);
  }, []);

  const replace = useCallback(
    (next: string) => {
      setCode(next);
      setRevision((r) => r + 1);
    },
    [setCode],
  );

  const runCode = useCallback(
    (source: string) => {
      void navigate({ to: "/" });
      runner.mutate(source);
    },
    [navigate, runner],
  );

  const value = useMemo((): Playground => {
    const state: RunState = runner.isPending
      ? { kind: "running" }
      : runner.data
        ? { kind: "done", result: runner.data }
        : runner.error
          ? { kind: "error", message: runner.error.message }
          : { kind: "idle" };
    return {
      code,
      revision,
      setCode,
      state,
      load: (next, runNow) => {
        replace(next);
        if (runNow) runCode(next);
        else void navigate({ to: "/" });
      },
      run: () => runCode(code),
      format: () =>
        formatter.mutate(code, {
          onSuccess: (formatted) => {
            replace(formatted);
            notify("Formatted");
          },
          onError: (err) => notify(`Format failed: ${err.message}`),
        }),
      clear: () => runner.reset(),
    };
  }, [code, revision, setCode, replace, runCode, runner, formatter, notify, navigate]);

  return <PlaygroundContext value={value}>{children}</PlaygroundContext>;
}

export function usePlayground(): Playground {
  const p = use(PlaygroundContext);
  if (!p) throw new Error("usePlayground needs PlaygroundProvider");
  return p;
}
