import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import type { Completion } from "../../editor/completion.ts";
import { completeApi } from "./api.ts";

export const completeKeys = {
  all: ["complete"] as const,
  prefix: (prefix: string) => [...completeKeys.all, prefix] as const,
};

export function useCompleter(): (prefix: string) => Promise<Completion[]> {
  const client = useQueryClient();
  return useCallback(
    (prefix: string) => client.fetchQuery({ queryKey: completeKeys.prefix(prefix), queryFn: () => completeApi.query(prefix), staleTime: Infinity }).catch(() => []),
    [client],
  );
}
