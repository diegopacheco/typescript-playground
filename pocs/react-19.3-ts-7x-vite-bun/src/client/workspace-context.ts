"use client";

import { createContext, useContext } from "react";
import type { RequestContext } from "../types";

export const WorkspaceContext = createContext<RequestContext | null>(null);

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error("WorkspaceContext is required");
  return context;
}
