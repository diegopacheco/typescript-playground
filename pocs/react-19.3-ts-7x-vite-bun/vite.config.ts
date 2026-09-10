import { readFileSync } from "node:fs";
import { defineConfig } from "vite";
import rsc from "@vitejs/plugin-rsc";

const port = Number(
  readFileSync(new URL("./scripts/ports.env", import.meta.url), "utf8")
    .trim()
    .split("=")[1],
);

export default defineConfig({
  plugins: [
    rsc({
      entries: {
        rsc: "./src/framework/entry.rsc.tsx",
        ssr: "./src/framework/entry.ssr.tsx",
        client: "./src/framework/entry.browser.tsx",
      },
    }),
  ],
  optimizeDeps: {
    include: [
      "react",
      "react/jsx-runtime",
      "react/jsx-dev-runtime",
      "react-dom/client",
    ],
  },
  server: { host: "127.0.0.1", port, strictPort: true },
  preview: { host: "127.0.0.1", port, strictPort: true },
});
