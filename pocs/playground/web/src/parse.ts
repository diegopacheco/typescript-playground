import { ApiError } from "./http.ts";

export type Json = Readonly<Record<string, unknown>>;

export function record(raw: unknown, what: string): Json {
  if (typeof raw === "object" && raw !== null && !Array.isArray(raw)) return Object.fromEntries(Object.entries(raw));
  throw new ApiError(422, `invalid ${what} payload`);
}

export function list<T>(raw: unknown, what: string, item: (raw: unknown) => T): T[] {
  if (!Array.isArray(raw)) throw new ApiError(422, `invalid ${what} payload`);
  return raw.map(item);
}

export function str(obj: Json, key: string): string {
  const v = obj[key];
  if (typeof v === "string") return v;
  throw new ApiError(422, `field ${key} must be a string`);
}

export function optStr(obj: Json, key: string): string | undefined {
  return obj[key] === undefined ? undefined : str(obj, key);
}

export function num(obj: Json, key: string): number {
  const v = obj[key];
  if (typeof v === "number") return v;
  throw new ApiError(422, `field ${key} must be a number`);
}

export function bool(obj: Json, key: string): boolean {
  const v = obj[key];
  if (typeof v === "boolean") return v;
  throw new ApiError(422, `field ${key} must be a boolean`);
}
