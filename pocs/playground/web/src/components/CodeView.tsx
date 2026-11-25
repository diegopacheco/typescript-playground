import { useMemo } from "react";
import { highlight } from "../editor/highlight.ts";

export function CodeView({ code }: { readonly code: string }) {
  const html = useMemo(() => highlight(code), [code]);
  const lines = code.split("\n").length;
  return (
    <div className="readonly-code">
      <div className="ro-gutter">
        {Array.from({ length: lines }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <pre>
        <code dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </div>
  );
}
