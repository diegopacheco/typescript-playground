import { describe, expect, test } from "bun:test";
import { ACTIONS, commandForKey, filterShortcuts, pressFor, SHORTCUTS, TABS } from "../src/shortcuts.ts";

describe("shortcuts", () => {
  test("every listed app shortcut triggers exactly the command it advertises, so the modal, tooltips and handler never disagree", () => {
    const commands: string[] = [...ACTIONS, ...TABS.map((t) => `tab-${t.id}`)];
    const bound = SHORTCUTS.filter((s) => commands.includes(s.id));
    expect(bound.length).toBe(commands.length);
    for (const s of bound) expect({ id: s.id, cmd: `${commandForKey(pressFor(s))}` }).toEqual({ id: s.id, cmd: s.id });
  });

  test("native editing keys stay with the browser", () => {
    for (const key of ["c", "v", "x", "a", "z"]) expect(commandForKey({ key, metaKey: true, ctrlKey: false, shiftKey: false })).toBeNull();
    expect(commandForKey({ key: "k", metaKey: false, ctrlKey: false, shiftKey: false })).toBeNull();
  });

  test("ctrl works like cmd for non-mac keyboards", () => {
    expect(commandForKey({ key: "k", metaKey: false, ctrlKey: true, shiftKey: false })).toBe("palette");
  });

  test("filter keeps a whole group when its title matches, otherwise only matching rows", () => {
    expect(filterShortcuts("window")[0]?.items.length).toBe(SHORTCUTS.filter((s) => s.group === "window").length);
    const zoom = filterShortcuts("zoom");
    expect(zoom).toHaveLength(1);
    expect(zoom[0]?.items.map((s) => s.id)).toEqual(["zoomIn", "zoomOut", "zoomReset"]);
    expect(filterShortcuts("nothing-like-this")).toEqual([]);
  });

  test("every tab has a unique digit", () => {
    expect(new Set(TABS.map((t) => t.key)).size).toBe(TABS.length);
  });
});
