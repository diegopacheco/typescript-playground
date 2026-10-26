import { queryOptions } from "@tanstack/react-query";
import type { Api } from "./api.ts";

export const booksQuery = (api: Api) =>
  queryOptions({
    queryKey: ["books"],
    queryFn: () => api.listBooks(),
    staleTime: 30_000,
  });
