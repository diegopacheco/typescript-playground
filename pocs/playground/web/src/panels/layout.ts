export type Side = "left" | "right";
export type HiddenPanel = { readonly id: string; readonly side: Side; readonly title: string; readonly view: string };

export function dockSide(rect: { readonly left: number; readonly width: number }, windowWidth: number): Side {
  return rect.left + rect.width / 2 < windowWidth / 2 ? "left" : "right";
}

export function parseHidden(raw: string | null): HiddenPanel[] {
  if (!raw) return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(data)) return [];
  return data.flatMap((e: unknown): HiddenPanel[] => {
    if (typeof e !== "object" || e === null) return [];
    if (!("id" in e) || typeof e.id !== "string" || !("title" in e) || typeof e.title !== "string" || !("view" in e) || typeof e.view !== "string") return [];
    const side = "side" in e && e.side === "left" ? "left" : "right";
    return [{ id: e.id, side, title: e.title, view: e.view }];
  });
}

export function hide(list: readonly HiddenPanel[], entry: HiddenPanel): HiddenPanel[] {
  return [...list.filter((e) => e.id !== entry.id), entry];
}

export function restore(list: readonly HiddenPanel[], id: string): HiddenPanel[] {
  return list.filter((e) => e.id !== id);
}
