import { describe, expect, test } from "bun:test";
import { createAuth, safeRedirect } from "../../src/logic/auth.ts";

describe("auth guards the vault", () => {
  test("starts logged out, logs in and out", () => {
    const auth = createAuth();
    expect(auth.isAuthenticated()).toBe(false);
    auth.login("  Ada ");
    expect(auth.user()).toBe("Ada");
    auth.logout();
    expect(auth.user()).toBeNull();
  });

  test("a blank name never grants access", () => {
    const auth = createAuth();
    expect(() => auth.login("   ")).toThrow("Name is required");
    expect(auth.isAuthenticated()).toBe(false);
  });
});

describe("safeRedirect blocks open redirects after login", () => {
  test("in-app paths are kept with their search", () => {
    expect(safeRedirect("/vault?tab=1")).toBe("/vault?tab=1");
  });

  test("external and protocol-relative targets fall back to the vault", () => {
    expect(safeRedirect("https://evil.test")).toBe("/vault");
    expect(safeRedirect("//evil.test")).toBe("/vault");
    expect(safeRedirect("/\\evil.test")).toBe("/vault");
    expect(safeRedirect(undefined)).toBe("/vault");
  });
});
