const { contextBridge, ipcRenderer, webFrame } = require("electron");

contextBridge.exposeInMainWorld("desktop", {
  toggleMaximize: () => ipcRenderer.invoke("toggle-maximize"),
  toggleFullscreen: () => ipcRenderer.invoke("toggle-fullscreen"),
  screenshot: () => ipcRenderer.invoke("screenshot"),
  setZoom: (z) => webFrame.setZoomFactor(z),
  onBoot: (fn) => ipcRenderer.on("boot", (_e, data) => fn(data)),
});
