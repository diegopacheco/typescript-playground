type Ok<T> = { readonly ok: true; readonly value: T };
type Err<E> = { readonly ok: false; readonly error: E };
type Result<T, E> = Ok<T> | Err<E>;

const ok = <T>(value: T): Ok<T> => ({ ok: true, value });
const err = <E>(error: E): Err<E> => ({ ok: false, error });

type ParseError =
  | { readonly kind: "empty" }
  | { readonly kind: "not-a-number"; readonly input: string }
  | { readonly kind: "out-of-range"; readonly value: number; readonly max: number };

function parsePort(input: string): Result<number, ParseError> {
  const trimmed = input.trim();
  if (trimmed === "") {
    return err({ kind: "empty" });
  }
  const value = Number(trimmed);
  if (!Number.isInteger(value)) {
    return err({ kind: "not-a-number", input: trimmed });
  }
  if (value < 1 || value > 65535) {
    return err({ kind: "out-of-range", value, max: 65535 });
  }
  return ok(value);
}

function map<T, U, E>(result: Result<T, E>, fn: (value: T) => U): Result<U, E> {
  return result.ok ? ok(fn(result.value)) : result;
}

function explain(error: ParseError): string {
  switch (error.kind) {
    case "empty":
      return "port is required";
    case "not-a-number":
      return `"${error.input}" is not an integer`;
    case "out-of-range":
      return `${error.value} is above ${error.max} or below 1`;
    default: {
      const unreachable: never = error;
      return unreachable;
    }
  }
}

for (const input of ["8080", "  443 ", "", "http", "70000"]) {
  const url = map(parsePort(input), (port) => `http://localhost:${port}`);
  console.log(JSON.stringify(input).padEnd(9), url.ok ? `-> ${url.value}` : `!! ${explain(url.error)}`);
}
