import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { caretPosition, indentFor, insertionFor, lineIndent, wordBeforeCaret, INDENT, type Completion } from "../editor/completion.ts";
import { escapeHTML, highlight } from "../editor/highlight.ts";
import { useCompleter } from "../features/complete/hooks.ts";

type EditorProps = {
  readonly initialValue: string;
  readonly errorLines: ReadonlySet<number>;
  readonly onChange: (value: string) => void;
};

type Popup = { readonly items: readonly Completion[]; readonly active: number; readonly x: number; readonly y: number };

const PAIRS: Readonly<Record<string, string>> = { "{": "}", "(": ")", "[": "]" };

export function Editor({ initialValue, errorLines, onChange }: EditorProps) {
  const [text, setText] = useState(initialValue);
  const [caretLine, setCaretLine] = useState(1);
  const [popup, setPopup] = useState<Popup | null>(null);
  const ta = useRef<HTMLTextAreaElement>(null);
  const pre = useRef<HTMLPreElement>(null);
  const gutter = useRef<HTMLDivElement>(null);
  const measure = useRef<HTMLSpanElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const request = useRef(0);
  const complete = useCompleter();
  const html = useMemo(() => highlight(text) + "\n", [text]);
  const lineCount = text.split("\n").length;

  const area = () => {
    if (!ta.current) throw new Error("editor is not mounted");
    return ta.current;
  };

  const close = () => {
    request.current++;
    setPopup(null);
  };

  const trackCaret = () => setCaretLine(caretPosition(area().value, area().selectionStart).line + 1);

  const sync = () => {
    const t = area();
    setText(t.value);
    onChange(t.value);
    trackCaret();
  };

  const insert = (value: string) => {
    const t = area();
    if (!document.execCommand("insertText", false, value)) {
      t.setRangeText(value, t.selectionStart, t.selectionEnd, "end");
      sync();
    }
  };

  const moveCaret = (delta: number) => {
    const t = area();
    t.selectionStart = t.selectionEnd = t.selectionStart + delta;
  };

  const place = (items: readonly Completion[], active: number): Popup => {
    const t = area();
    const { line, col } = caretPosition(t.value, t.selectionStart);
    const cw = measure.current?.getBoundingClientRect().width ?? 8;
    const style = getComputedStyle(t);
    const lh = parseFloat(style.lineHeight);
    const pad = parseFloat(style.paddingLeft);
    const a = t.getBoundingClientRect();
    const h = host.current?.getBoundingClientRect() ?? a;
    const x = Math.max(4, Math.min(a.left - h.left + pad + col * cw - t.scrollLeft, h.width - 320));
    const below = a.top - h.top + pad + (line + 1) * lh - t.scrollTop + 2;
    const y = below + 260 < h.height ? below : Math.max(4, below - lh - 264);
    return { items, active, x, y };
  };

  const suggest = async (force: boolean) => {
    const t = area();
    const { query } = wordBeforeCaret(t.value, t.selectionStart);
    const word = query.replace(/.*\./, "");
    if (!force && word.length < 1 && !query.endsWith(".")) return close();
    const id = ++request.current;
    const found = await complete(query);
    if (id !== request.current) return;
    const items = found.filter((it) => !(it.label === word && found.length === 1));
    setPopup(items.length === 0 ? null : place(items, 0));
  };

  const accept = (item: Completion | undefined) => {
    if (!item) return;
    const t = area();
    const { replaceFrom } = wordBeforeCaret(t.value, t.selectionStart);
    const indent = lineIndent(t.value, t.selectionStart);
    t.selectionStart = replaceFrom;
    const { text: value, caretBack } = insertionFor(item, indent);
    insert(value);
    moveCaret(-caretBack);
    close();
  };

  const onInput = () => {
    sync();
    const t = area();
    const ch = t.value[t.selectionStart - 1] ?? "";
    if (/[\w$.]/.test(ch)) void suggest(false);
    else close();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const t = area();
    const mod = e.metaKey || e.ctrlKey;
    if (popup && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      e.preventDefault();
      const n = popup.items.length;
      setPopup({ ...popup, active: (popup.active + (e.key === "ArrowDown" ? 1 : -1) + n) % n });
      return;
    }
    if (popup && (e.key === "Enter" || e.key === "Tab") && !mod) {
      e.preventDefault();
      accept(popup.items[popup.active]);
      return;
    }
    if (popup && e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
      return;
    }
    if (e.key === " " && e.ctrlKey) {
      e.preventDefault();
      void suggest(true);
      return;
    }
    if (mod) return;
    if (e.key === "Tab") {
      e.preventDefault();
      insert(INDENT);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const v = t.value;
      const pos = t.selectionStart;
      const indent = indentFor(v, pos);
      const closer = v[pos];
      if (closer !== undefined && Object.values(PAIRS).includes(closer) && PAIRS[v[pos - 1] ?? ""] === closer) {
        const outer = lineIndent(v, pos);
        insert("\n" + indent + "\n" + outer);
        moveCaret(-(outer.length + 1));
      } else insert("\n" + indent);
      return;
    }
    const pair = PAIRS[e.key];
    if (pair && t.selectionStart === t.selectionEnd) {
      e.preventDefault();
      insert(e.key + pair);
      moveCaret(-1);
      return;
    }
    if (Object.values(PAIRS).includes(e.key) && t.value[t.selectionStart] === e.key) {
      e.preventDefault();
      moveCaret(1);
    }
  };

  const onScroll = () => {
    const t = area();
    if (pre.current) {
      pre.current.scrollTop = t.scrollTop;
      pre.current.scrollLeft = t.scrollLeft;
    }
    if (gutter.current) gutter.current.style.transform = `translateY(${-t.scrollTop}px)`;
    if (popup) close();
  };

  return (
    <div className="editor" ref={host}>
      <div className="gutter" aria-hidden="true">
        <div className="gutter-inner" ref={gutter}>
          {Array.from({ length: lineCount }, (_, i) => i + 1).map((n) => (
            <div key={n} className={errorLines.has(n) ? "ln err" : n === caretLine ? "ln cur" : "ln"}>
              {n}
            </div>
          ))}
        </div>
      </div>
      <div className="code-area">
        <pre className="hl" ref={pre} aria-hidden="true">
          <code dangerouslySetInnerHTML={{ __html: html }} />
        </pre>
        <textarea
          ref={ta}
          defaultValue={initialValue}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          wrap="off"
          aria-label="TypeScript code editor"
          onInput={onInput}
          onKeyDown={onKeyDown}
          onKeyUp={trackCaret}
          onClick={() => {
            trackCaret();
            close();
          }}
          onScroll={onScroll}
          onBlur={() => setTimeout(close, 150)}
        />
      </div>
      {popup && (
        <ul className="completion" role="listbox" style={{ left: popup.x, top: popup.y }}>
          {popup.items.map((it, i) => (
            <li
              key={it.label + it.kind}
              role="option"
              aria-selected={i === popup.active}
              className={i === popup.active ? "active" : ""}
              onMouseDown={(e) => {
                e.preventDefault();
                accept(it);
              }}
            >
              <span className={`kind k-${it.kind}`}>{it.kind.charAt(0)}</span>
              <span className="label">{it.label}</span>
              <span className="detail" dangerouslySetInnerHTML={{ __html: escapeHTML(it.detail) }} />
            </li>
          ))}
        </ul>
      )}
      <span className="measure" ref={measure}>
        M
      </span>
    </div>
  );
}
