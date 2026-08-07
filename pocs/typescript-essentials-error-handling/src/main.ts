type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

class ValidationError extends Error {
  constructor(public field: string, message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

function err<T>(error: Error): Result<T> {
  return { ok: false, error };
}

function parseAge(input: string): Result<number> {
  const n = Number(input);
  if (Number.isNaN(n)) return err(new ValidationError("age", "not a number"));
  if (n < 0) return err(new ValidationError("age", "must be positive"));
  return ok(n);
}

function main(): void {
  for (const input of ["30", "-4", "abc"]) {
    const result = parseAge(input);
    if (result.ok) {
      console.log(`parseAge(${input}) ->`, result.value);
    } else {
      console.log(`parseAge(${input}) failed:`, result.error.message);
    }
  }

  try {
    throw new ValidationError("email", "missing @");
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log("caught custom error:", error.field, error.message);
    }
  }

  const cause = new Error("socket closed");
  const wrapped = new Error("request failed", { cause });
  console.log("error cause:", (wrapped.cause as Error).message);
}

main();
