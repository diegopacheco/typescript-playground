import { useMemo } from "react";
import { usePlayground } from "../app/playground.tsx";
import { useUi } from "../app/ui.tsx";
import { escapeHTML, highlight } from "../editor/highlight.ts";
import { isRunnable } from "../features/content/types.ts";
import { Icon } from "../icons.tsx";

export function CodeBlock({ lang, code }: { readonly lang: string; readonly code: string }) {
  const { load } = usePlayground();
  const { notify } = useUi();
  const runnable = isRunnable(lang);
  const html = useMemo(() => (runnable ? highlight(code) : escapeHTML(code)), [code, runnable]);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    notify("Copied to clipboard");
  };
  return (
    <>
      <div className="code-bar">
        <span className="lang">{lang}</span>
        <button className="mini" onClick={() => void copy()}>
          <Icon name="copy" size={14} />
          Copy
        </button>
        {runnable && (
          <button className="mini run" onClick={() => load(code, true)}>
            <Icon name="play" size={14} />
            Run in Playground
          </button>
        )}
      </div>
      <pre className="code" data-lang={lang}>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </>
  );
}
