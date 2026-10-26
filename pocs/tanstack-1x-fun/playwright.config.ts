import { readFileSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

const port = Number(
  readFileSync(new URL("./scripts/ports.env", import.meta.url), "utf8")
    .trim()
    .split("=")[1],
);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  timeout: 30_000,
  use: { ...devices["Desktop Chrome"], baseURL, viewport: { width: 1280, height: 860 } },
  webServer: { command: "bun run dev", url: baseURL, reuseExistingServer: true, timeout: 60_000 },
});
