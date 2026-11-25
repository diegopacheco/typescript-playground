import { join, normalize } from "node:path";

export type StaticFiles = { serve(pathname: string): Promise<Response | null> };

export function staticFiles(root: string): StaticFiles {
  return {
    async serve(pathname) {
      const rel = normalize(decodeURIComponent(pathname)).replace(/^(\.\.(\/|$))+/, "");
      const file = Bun.file(join(root, rel === "/" ? "index.html" : rel));
      if (rel !== "/" && (await file.exists())) return new Response(file);
      const index = Bun.file(join(root, "index.html"));
      return (await index.exists()) ? new Response(index, { headers: { "Content-Type": "text/html; charset=utf-8" } }) : null;
    },
  };
}
