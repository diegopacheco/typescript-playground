import { describe, expect, test } from "bun:test";
import { dockSide, hide, parseHidden, restore } from "../src/panels/layout.ts";

describe("panel layout", () => {
  test("docks to the side nearest the panel center", () => {
    expect(dockSide({ left: 0, width: 400 }, 1200)).toBe("left");
    expect(dockSide({ left: 700, width: 400 }, 1200)).toBe("right");
  });

  test("hidden panels stack in hide order and re-hiding moves to the end", () => {
    const a = { id: "a", side: "right", title: "A", view: "v" } as const;
    const b = { id: "b", side: "right", title: "B", view: "v" } as const;
    expect(hide(hide(hide([], a), b), a).map((e) => e.id)).toEqual(["b", "a"]);
    expect(restore([a, b], "a")).toEqual([b]);
  });

  test("survives corrupt saved state instead of losing the whole layout", () => {
    expect(parseHidden("not json")).toEqual([]);
    expect(parseHidden(null)).toEqual([]);
    expect(parseHidden('[{"id":"x","side":"left","title":"X","view":"docs"},{"id":3}]')).toEqual([{ id: "x", side: "left", title: "X", view: "docs" }]);
  });
});
