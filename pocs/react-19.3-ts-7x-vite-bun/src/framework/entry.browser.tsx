import { createFromReadableStream } from "@vitejs/plugin-rsc/browser";
import { hydrateRoot } from "react-dom/client";
import { rscStream } from "rsc-html-stream/client";
import type { ReactNode } from "react";

const root = await createFromReadableStream<ReactNode>(rscStream);
hydrateRoot(document, root);

if (import.meta.hot) import.meta.hot.on("rsc:update", () => location.reload());
