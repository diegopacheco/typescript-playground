import { AsyncLocalStorage } from "node:async_hooks";

export const CORRELATION_HEADER = "X-Correlation-Id";
const SERVICE = "ts-playground";

type RequestContext = { readonly correlationId: string; readonly path: string; readonly userId: string };
type Level = "info" | "warn" | "error";
export type Fields = Readonly<Record<string, string | number | boolean | undefined>>;

const storage = new AsyncLocalStorage<RequestContext>();

export function withRequestContext<T>(ctx: RequestContext, fn: () => T): T {
  return storage.run(ctx, fn);
}

export function currentCorrelationId(): string | undefined {
  return storage.getStore()?.correlationId;
}

function write(level: Level, event: string, fields: Fields): void {
  const ctx = storage.getStore();
  const entry = {
    time: new Date().toISOString(),
    level,
    event,
    service: SERVICE,
    correlationId: ctx?.correlationId,
    path: ctx?.path,
    userId: ctx?.userId,
    ...fields,
  };
  process.stdout.write(JSON.stringify(entry) + "\n");
}

export const logger = {
  info: (event: string, fields: Fields = {}) => write("info", event, fields),
  warn: (event: string, fields: Fields = {}) => write("warn", event, fields),
  error: (event: string, fields: Fields = {}) => write("error", event, fields),
};

export type Logger = typeof logger;
