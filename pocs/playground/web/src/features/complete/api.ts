import type { Completion } from "../../editor/completion.ts";
import { http } from "../../http.ts";
import { list, optStr, record, str } from "../../parse.ts";

function parseCompletions(raw: unknown): Completion[] {
  return list(raw, "completions", (item) => {
    const o = record(item, "completion");
    const insert = optStr(o, "insert");
    return { label: str(o, "label"), kind: str(o, "kind"), detail: str(o, "detail"), ...(insert === undefined ? {} : { insert }) };
  });
}

export const completeApi = {
  query: (prefix: string) => http.get(`/api/complete?prefix=${encodeURIComponent(prefix)}`, parseCompletions),
};
