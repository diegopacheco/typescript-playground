import { renderToReadableStream } from "@vitejs/plugin-rsc/rsc/server";
import { App } from "../server/App";
import { createRequestContext, withRequestContext } from "../server/context";

export default async function handler(request: Request): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname === "/health") return Response.json({ status: "ok" });
  if (url.pathname !== "/") return new Response("Not found", { status: 404 });
  if (request.method !== "GET")
    return new Response("Method not allowed", {
      status: 405,
      headers: { Allow: "GET" },
    });

  return withRequestContext(createRequestContext(request.url), async () => {
    const stream = renderToReadableStream(<App />);
    const headers = {
      "Cache-Control": "no-store",
      "Content-Type": "text/x-component; charset=utf-8",
    };
    if (url.searchParams.has("_rsc")) return new Response(stream, { headers });
    const { renderHTML } = await import.meta.viteRsc.loadModule<
      typeof import("./entry.ssr")
    >("ssr", "index");
    return new Response(await renderHTML(stream), {
      headers: { ...headers, "Content-Type": "text/html; charset=utf-8" },
    });
  });
}

if (import.meta.hot) import.meta.hot.accept();
