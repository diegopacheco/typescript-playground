import { config } from "./config.ts";
import { CORRELATION_HEADER, currentCorrelationId, logger } from "./logger.ts";

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function errorMessage(raw: unknown, fallback: string): string {
  if (typeof raw === "object" && raw !== null && "error" in raw && typeof raw.error === "string") return raw.error;
  return fallback;
}

async function request<T>(path: string, parse: (raw: unknown) => T, init?: RequestInit): Promise<T> {
  const res = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", [CORRELATION_HEADER]: currentCorrelationId(), ...init?.headers },
  });
  const body: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    const err = new ApiError(res.status, errorMessage(body, `request failed with ${res.status}`));
    logger.warn("api error", { path, status: res.status, message: err.message });
    throw err;
  }
  return parse(body);
}

export const http = {
  get: <T>(path: string, parse: (raw: unknown) => T) => request(path, parse),
  post: <T>(path: string, body: unknown, parse: (raw: unknown) => T) => request(path, parse, { method: "POST", body: JSON.stringify(body) }),
};
