import express from "express";
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { writeTestFiles } from "./test-file-writer.ts";
import { parseResults } from "./result-parser.ts";

const app = express();
app.use(express.json({ limit: "10mb" }));

const PROJECT_ROOT = path.resolve(import.meta.dirname, "..");
const TEST_DIR = "/tmp/cft-tests";
const RESULTS_FILE = "/tmp/cft-tests/results.json";

app.post("/api/run", (req, res) => {
  const { tests, definition } = req.body;
  if (!tests || !definition) {
    res.status(400).json({ error: "Missing tests or definition" });
    return;
  }

  try {
    writeTestFiles(tests, definition, TEST_DIR);

    const cmd = `npx jest --config="${PROJECT_ROOT}/jest.config.cjs" --json --outputFile="${RESULTS_FILE}" --no-cache --forceExit 2>/dev/null || true`;
    execSync(cmd, { cwd: PROJECT_ROOT, timeout: 60000, stdio: "pipe" });

    if (!fs.existsSync(RESULTS_FILE)) {
      res.json({ results: tests.map((t: any) => ({ ...t, status: "failed", actual: "fail", error: "Jest produced no results" })) });
      return;
    }

    const raw = fs.readFileSync(RESULTS_FILE, "utf-8");
    const jestJson = JSON.parse(raw);
    const results = parseResults(jestJson, tests);
    res.json({ results });
  } catch (err: any) {
    let results = tests.map((t: any) => ({ ...t, status: "failed", actual: "fail", error: `Runner error: ${err.message?.substring(0, 200)}` }));

    if (fs.existsSync(RESULTS_FILE)) {
      try {
        const raw = fs.readFileSync(RESULTS_FILE, "utf-8");
        const jestJson = JSON.parse(raw);
        results = parseResults(jestJson, tests);
      } catch {}
    }

    res.json({ results });
  }
});

app.listen(3001, () => {
  console.log("Test server running on http://localhost:3001");
});
