import { createServer } from "node:http";

async function withRetry<T>(fn: () => Promise<T>, attempts: number): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

const server = createServer((req, res) => {
  if (req.url === "/json") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ message: "hello", method: req.method }));
    return;
  }
  res.writeHead(200, { "content-type": "text/plain" });
  res.end("plain text");
});

async function main(): Promise<void> {
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;
  const base = `http://localhost:${port}`;

  const getRes = await fetch(`${base}/json`);
  console.log("GET status:", getRes.status, getRes.headers.get("content-type"));
  console.log("GET json:", await getRes.json());

  const postRes = await fetch(`${base}/json`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "alice" }),
  });
  console.log("POST json:", await postRes.json());

  const text = await (await fetch(`${base}/plain`)).text();
  console.log("text body:", text);

  const controller = new AbortController();
  controller.abort();
  try {
    await fetch(`${base}/json`, { signal: controller.signal });
  } catch (error) {
    console.log("aborted:", (error as Error).name);
  }

  const retried = await withRetry(async () => (await fetch(`${base}/json`)).status, 3);
  console.log("withRetry status:", retried);

  server.close();
}

main();
