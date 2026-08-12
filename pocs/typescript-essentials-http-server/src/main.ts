import { createServer, type IncomingMessage, type ServerResponse } from "node:http";

interface Todo {
  id: number;
  title: string;
  done: boolean;
}

const todos: Todo[] = [{ id: 1, title: "learn typescript", done: false }];

function send(res: ServerResponse, status: number, body: unknown): void {
  res.writeHead(status, { "content-type": "application/json" });
  res.end(JSON.stringify(body));
}

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
  });
}

const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/todos") return send(res, 200, todos);
  if (req.method === "POST" && req.url === "/todos") {
    const body = JSON.parse(await readBody(req)) as { title: string };
    const todo: Todo = { id: todos.length + 1, title: body.title, done: false };
    todos.push(todo);
    return send(res, 201, todo);
  }
  send(res, 404, { error: "not found" });
});

async function main(): Promise<void> {
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const port = (server.address() as { port: number }).port;
  const base = `http://localhost:${port}`;

  const listed = await (await fetch(`${base}/todos`)).json();
  console.log("GET /todos:", listed);

  const created = await (
    await fetch(`${base}/todos`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "ship it" }),
    })
  ).json();
  console.log("POST /todos:", created);

  const after = await (await fetch(`${base}/todos`)).json();
  console.log("GET /todos after:", after);

  const missing = await fetch(`${base}/unknown`);
  console.log("GET /unknown status:", missing.status);

  server.close();
}

main();
