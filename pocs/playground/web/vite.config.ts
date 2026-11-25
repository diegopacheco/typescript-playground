import { readFileSync } from "node:fs";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function apiPort(): number {
  const line = readFileSync(new URL("../scripts/ports.env", import.meta.url), "utf8")
    .split("\n")
    .find((l) => l.startsWith("API="));
  const port = Number(line?.slice(4));
  if (!Number.isInteger(port)) throw new Error("API port missing in scripts/ports.env");
  return port;
}

export default defineConfig({
  plugins: [react()],
  server: { host: "127.0.0.1", proxy: { "/api": `http://127.0.0.1:${apiPort()}` } },
});
