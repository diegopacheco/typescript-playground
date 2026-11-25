import { useMutation } from "@tanstack/react-query";
import { runnerApi } from "./api.ts";

export function useRunCode() {
  return useMutation({ mutationKey: ["run"], mutationFn: (code: string) => runnerApi.run(code) });
}

export function useFormatCode() {
  return useMutation({ mutationKey: ["format"], mutationFn: (code: string) => runnerApi.format(code) });
}
