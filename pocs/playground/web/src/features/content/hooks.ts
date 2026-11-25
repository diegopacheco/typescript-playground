import { queryOptions, useQuery } from "@tanstack/react-query";
import { contentApi } from "./api.ts";

export const contentKeys = {
  docs: ["docs"] as const,
  doc: (id: string) => ["docs", id] as const,
  samples: ["samples"] as const,
};

export const docsQuery = queryOptions({ queryKey: contentKeys.docs, queryFn: contentApi.docs, staleTime: Infinity });
export const samplesQuery = queryOptions({ queryKey: contentKeys.samples, queryFn: contentApi.samples, staleTime: Infinity });

export function useDocs() {
  return useQuery(docsQuery);
}

export function useDoc(id: string) {
  return useQuery({ queryKey: contentKeys.doc(id), queryFn: () => contentApi.doc(id), staleTime: Infinity });
}

export function useSamples() {
  return useQuery(samplesQuery);
}
