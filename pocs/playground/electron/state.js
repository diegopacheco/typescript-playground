const fs = require("node:fs");

const DEFAULT = { width: 1360, height: 860 };

function readState(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function writeState(file, state) {
  fs.writeFileSync(file, JSON.stringify(state));
}

function visibleOn(bounds, area) {
  return bounds.x < area.x + area.width - 40 && bounds.x + bounds.width > area.x + 40 && bounds.y >= area.y - 10 && bounds.y < area.y + area.height - 40;
}

function restoreBounds(saved, workAreas) {
  const b = saved && saved.bounds;
  if (!b || typeof b.x !== "number" || typeof b.width !== "number") return { ...DEFAULT };
  if (!workAreas.some((a) => visibleOn(b, a))) return { width: b.width, height: b.height };
  return { x: b.x, y: b.y, width: b.width, height: b.height };
}

function toggleMaximize(current, workArea, restore) {
  const filling = current.x === workArea.x && current.y === workArea.y && current.width === workArea.width && current.height === workArea.height;
  if (filling && restore) return { bounds: restore, restore: null };
  return { bounds: { ...workArea }, restore: current };
}

module.exports = { readState, writeState, restoreBounds, toggleMaximize, DEFAULT };
