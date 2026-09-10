import { describe, expect, test } from "bun:test";
import {
  createRequestContext,
  getRequestContext,
  withRequestContext,
} from "../src/server/context";

describe("request-scoped workspace context", () => {
  test("falls back to the studio for unknown workspace input", () => {
    expect(
      createRequestContext("http://localhost/?workspace=unknown").workspace.id,
    ).toBe("studio");
  });

  test("fails outside a request instead of exposing stale workspace data", () => {
    expect(() => getRequestContext()).toThrow("outside a request");
  });

  test("keeps overlapping async requests isolated", async () => {
    const contexts = Array.from({ length: 30 }, (_, index) =>
      createRequestContext(
        `http://localhost/?workspace=${index % 2 ? "garden" : "studio"}`,
      ),
    );
    await Promise.all(
      contexts.map((context) =>
        withRequestContext(context, async () => {
          await new Promise((resolve) =>
            setTimeout(resolve, Math.random() * 15),
          );
          expect(getRequestContext()).toBe(context);
          await Promise.resolve();
          expect(getRequestContext().workspace.id).toBe(context.workspace.id);
        }),
      ),
    );
    expect(new Set(contexts.map((context) => context.requestId)).size).toBe(30);
    expect(() => getRequestContext()).toThrow();
  });
});
