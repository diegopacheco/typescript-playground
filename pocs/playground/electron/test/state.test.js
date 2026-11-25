const { describe, expect, test } = require("bun:test");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { readState, writeState, restoreBounds, toggleMaximize, DEFAULT } = require("../state.js");

const screen = { x: 0, y: 0, width: 1920, height: 1080 };

describe("window state", () => {
  test("restores the exact saved position when it is still on a screen", () => {
    expect(restoreBounds({ bounds: { x: 100, y: 80, width: 900, height: 700 } }, [screen])).toEqual({ x: 100, y: 80, width: 900, height: 700 });
  });

  test("keeps the size but lets the OS place a window whose monitor is gone", () => {
    expect(restoreBounds({ bounds: { x: 4000, y: 80, width: 900, height: 700 } }, [screen])).toEqual({ width: 900, height: 700 });
  });

  test("falls back to the default size for missing or corrupt state", () => {
    expect(restoreBounds({}, [screen])).toEqual(DEFAULT);
    expect(restoreBounds({ bounds: { x: "a" } }, [screen])).toEqual(DEFAULT);
  });

  test("double click maximizes, and a second one restores the previous bounds", () => {
    const start = { x: 100, y: 100, width: 800, height: 600 };
    const max = toggleMaximize(start, screen, null);
    expect(max.bounds).toEqual(screen);
    expect(toggleMaximize(max.bounds, screen, max.restore).bounds).toEqual(start);
  });

  test("state survives a write and read, and unreadable files read as empty", () => {
    const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), "tsplay-state-")), "s.json");
    writeState(file, { bounds: { x: 1, y: 2, width: 3, height: 4 }, fullScreen: true });
    expect(readState(file)).toEqual({ bounds: { x: 1, y: 2, width: 3, height: 4 }, fullScreen: true });
    expect(readState(file + ".missing")).toEqual({});
  });
});
