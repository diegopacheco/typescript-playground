import { http } from "../../http.ts";
import { parseDoc, parseDocs, parseSamples } from "./types.ts";

export const contentApi = {
  docs: () => http.get("/api/docs", parseDocs),
  doc: (id: string) => http.get(`/api/docs/${encodeURIComponent(id)}`, parseDoc),
  samples: () => http.get("/api/samples", parseSamples),
};
