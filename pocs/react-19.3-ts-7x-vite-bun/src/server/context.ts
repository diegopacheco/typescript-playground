import { AsyncLocalStorage } from "node:async_hooks";
import type { RequestContext, Workspace } from "../types";

const workspaces: Record<string, Workspace> = {
  studio: {
    id: "studio",
    name: "Form & Field",
    owner: "Alex Morgan",
    initials: "AM",
    focus: "Make room for good work.",
  },
  garden: {
    id: "garden",
    name: "Common Ground",
    owner: "Sam Rivera",
    initials: "SR",
    focus: "Good things grow together.",
  },
};

const storage = new AsyncLocalStorage<RequestContext>();

export function createRequestContext(url: string): RequestContext {
  const id = new URL(url).searchParams.get("workspace") ?? "studio";
  return {
    requestId: crypto.randomUUID(),
    workspace: workspaces[id] ?? workspaces.studio!,
  };
}

export function withRequestContext<T>(
  context: RequestContext,
  render: () => T,
): T {
  return storage.run(context, render);
}

export function getRequestContext(): RequestContext {
  const context = storage.getStore();
  if (!context)
    throw new Error("Request context is unavailable outside a request");
  return context;
}
