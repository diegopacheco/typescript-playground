import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { CodeBlock } from "../components/CodeBlock.tsx";
import { useDoc, useDocs } from "../features/content/hooks.ts";
import { splitDoc } from "../features/content/types.ts";
import { Panel } from "../panels/Panel.tsx";

export const LAST_DOC_KEY = "doc";

export function DocsPage({ docId }: { readonly docId: string }) {
  const docs = useDocs();
  const doc = useDoc(docId);
  const article = useRef<HTMLElement>(null);
  const segments = useMemo(() => (doc.data ? splitDoc(doc.data.html) : []), [doc.data]);
  useEffect(() => {
    localStorage.setItem(LAST_DOC_KEY, docId);
    article.current?.scrollTo({ top: 0 });
  }, [docId]);
  return (
    <div className="view" data-view="docs">
      <Panel id="doc-nav" title="Topics" view="docs" icon="book" narrow>
        <ul className="list">
          {(docs.data ?? []).map((d, i) => (
            <li key={d.id}>
              <Link to="/docs/$docId" params={{ docId: d.id }} className={d.id === docId ? "list-item active" : "list-item"}>
                <span className="num">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <strong>{d.title}</strong>
                  <small>{d.summary}</small>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel id="doc-content" title="Article" view="docs" heading={doc.data?.title ?? "Docs"}>
        <article className="prose" ref={article}>
          {doc.isError && <p className="stderr">{doc.error.message}</p>}
          {segments.map((s, i) => (s.kind === "html" ? <div key={i} className="prose-html" dangerouslySetInnerHTML={{ __html: s.html }} /> : <CodeBlock key={i} lang={s.lang} code={s.code} />))}
        </article>
      </Panel>
    </div>
  );
}
