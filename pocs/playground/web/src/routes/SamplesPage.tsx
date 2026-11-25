import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { usePlayground } from "../app/playground.tsx";
import { CodeView } from "../components/CodeView.tsx";
import { useSamples } from "../features/content/hooks.ts";
import { Icon } from "../icons.tsx";
import { Panel } from "../panels/Panel.tsx";

export const LAST_SAMPLE_KEY = "sample";

export function SamplesPage({ sampleId }: { readonly sampleId: string }) {
  const samples = useSamples().data ?? [];
  const { load } = usePlayground();
  const sample = samples.find((s) => s.id === sampleId);
  useEffect(() => localStorage.setItem(LAST_SAMPLE_KEY, sampleId), [sampleId]);
  return (
    <div className="view" data-view="samples">
      <Panel id="sample-nav" title="Samples" view="samples" icon="code" narrow>
        <ul className="list">
          {samples.map((s) => (
            <li key={s.id}>
              <Link to="/samples/$sampleId" params={{ sampleId: s.id }} className={s.id === sampleId ? "list-item active" : "list-item"}>
                <Icon name="file" size={16} />
                <span>
                  <strong>{s.title}</strong>
                  <small>{s.code.split("\n").length} lines</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel
        id="sample-view"
        title="Sample code"
        view="samples"
        heading={sample?.title ?? "Sample"}
        toolbar={
          sample && (
            <>
              <button className="btn" data-tip="Open in Playground" onClick={() => load(sample.code, false)}>
                <Icon name="editor" />
                Open
              </button>
              <button className="btn primary" data-tip="Open and run" onClick={() => load(sample.code, true)}>
                <Icon name="play" />
                Run
              </button>
            </>
          )
        }
      >
        {sample ? <CodeView code={sample.code} /> : <div className="output muted">Sample not found.</div>}
      </Panel>
    </div>
  );
}
