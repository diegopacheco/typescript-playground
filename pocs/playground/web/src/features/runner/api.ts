import { http } from "../../http.ts";
import { parseFormatted, parseRunResult } from "./types.ts";

export const runnerApi = {
  run: (code: string) => http.post("/api/run", { code }, parseRunResult),
  format: (code: string) => http.post("/api/format", { code }, parseFormatted),
};
