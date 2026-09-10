import {
  createFromReadableStream,
  getClientEntryUrl,
} from "@vitejs/plugin-rsc/ssr";
import { renderToReadableStream } from "react-dom/server";
import { injectRSCPayload } from "rsc-html-stream/server";
import type { ReactNode } from "react";

export async function renderHTML(stream: ReadableStream<Uint8Array>) {
  const [renderStream, hydrationStream] = stream.tee();
  const root = await createFromReadableStream<ReactNode>(renderStream);
  const html = await renderToReadableStream(root, {
    bootstrapModules: [getClientEntryUrl()],
  });
  return html.pipeThrough(injectRSCPayload(hydrationStream));
}
