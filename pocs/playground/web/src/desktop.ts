export type DesktopBridge = {
  readonly toggleMaximize: () => Promise<void>;
  readonly toggleFullscreen: () => Promise<void>;
  readonly screenshot: () => Promise<string>;
  readonly setZoom: (zoom: number) => void;
};

declare global {
  interface Window {
    readonly desktop?: DesktopBridge;
  }
}

export const desktop: DesktopBridge | null = window.desktop ?? null;
