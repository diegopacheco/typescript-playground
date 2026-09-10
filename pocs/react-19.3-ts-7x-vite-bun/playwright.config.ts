import { readFileSync } from "node:fs";
import { defineConfig } from "@playwright/test";

const port = readFileSync(
  new URL("./scripts/ports.env", import.meta.url),
  "utf8",
)
  .trim()
  .split("=")[1];

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  use: {
    baseURL: `http://127.0.0.1:${port}`,
    viewport: { width: 1440, height: 1100 },
  },
  reporter: "list",
  webServer: {
    command: "bun run start",
    url: `http://127.0.0.1:${port}/health`,
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
  },
});
