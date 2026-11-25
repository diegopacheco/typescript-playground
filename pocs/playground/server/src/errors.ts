export type ErrorKind = "bad_request" | "not_found";

export class AppError extends Error {
  constructor(
    readonly kind: ErrorKind,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export function statusFor(err: unknown): number {
  if (!(err instanceof AppError)) return 500;
  switch (err.kind) {
    case "bad_request":
      return 400;
    case "not_found":
      return 404;
    default: {
      const unreachable: never = err.kind;
      return unreachable;
    }
  }
}
