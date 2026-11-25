const { app, BrowserWindow, ipcMain, Menu, screen, dialog } = require("electron");
const { spawn, spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { readState, writeState, restoreBounds, toggleMaximize } = require("./state.js");

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

function loadConfig() {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, "app-config.json"), "utf8"));
  } catch {
    return { root: path.resolve(__dirname, ".."), pathExtra: "" };
  }
}

const config = loadConfig();
const env = { ...process.env, PATH: [config.pathExtra, process.env.PATH, "/opt/homebrew/bin", "/usr/local/bin", path.join(os.homedir(), ".bun", "bin")].filter(Boolean).join(":") };
const port = fs.readFileSync(path.join(config.root, "scripts", "ports.env"), "utf8").match(/API=(\d+)/)[1];
const appURL = "http://127.0.0.1:" + port;
const stateFile = () => path.join(app.getPath("userData"), "window-state.json");
let win = null;
let restoreTo = null;
let stopped = false;

function bootStatus(services, error) {
  if (win && !win.isDestroyed()) win.webContents.send("boot", { services, error });
}

function runScript(name) {
  return new Promise((resolve) => {
    const child = spawn("bash", [path.join(config.root, "scripts", name)], { env, cwd: config.root });
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => resolve({ code, out }));
  });
}

async function health() {
  try {
    const resp = await fetch(appURL + "/api/health");
    return resp.ok ? await resp.json() : null;
  } catch {
    return null;
  }
}

async function boot() {
  const steps = [
    { name: "scripts/start-all.sh", status: "loading" },
    { name: "Web UI build", status: "loading" },
    { name: "API server on port " + port, status: "pending" },
  ];
  bootStatus(steps);
  const res = await runScript("start-all.sh");
  if (res.code !== 0) {
    steps[0].status = "error";
    steps[1].status = "error";
    bootStatus(steps, res.out.trim().split("\n").slice(-6).join("\n"));
    return;
  }
  steps[0].status = "ready";
  steps[1].status = "ready";
  steps[2].status = "loading";
  bootStatus(steps);
  for (let i = 0; i < 60; i++) {
    const h = await health();
    if (h) {
      bootStatus([steps[0], ...h.services.map((s) => ({ name: s.name, status: s.status }))]);
      setTimeout(() => win && win.loadURL(appURL), 700);
      return;
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  steps[2].status = "error";
  bootStatus(steps, "API did not answer on " + appURL);
}

function saveState() {
  if (!win || win.isDestroyed()) return;
  const fullScreen = win.isFullScreen();
  const prev = readState(stateFile());
  writeState(stateFile(), { bounds: fullScreen ? prev.bounds : win.getBounds(), fullScreen });
}

function createWindow() {
  const saved = readState(stateFile());
  const bounds = restoreBounds(saved, screen.getAllDisplays().map((d) => d.workArea));
  win = new BrowserWindow({
    ...bounds,
    minWidth: 380,
    minHeight: 500,
    title: "TypeScript Playground",
    titleBarStyle: "hiddenInset",
    backgroundColor: "#f5f7fb",
    icon: path.join(__dirname, "icon.png"),
    show: false,
    webPreferences: { preload: path.join(__dirname, "preload.js"), contextIsolation: true, nodeIntegration: false },
  });
  win.once("ready-to-show", () => {
    if (saved.fullScreen) win.setFullScreen(true);
    win.show();
  });
  win.on("close", saveState);
  win.on("moved", saveState);
  win.on("resized", saveState);
  win.on("enter-full-screen", saveState);
  win.on("leave-full-screen", saveState);
  win.webContents.on("did-finish-load", () => {
    if (win.webContents.getURL().startsWith("file:")) boot();
  });
  win.loadFile(path.join(__dirname, "boot.html"));
}

function buildMenu() {
  Menu.setApplicationMenu(
    Menu.buildFromTemplate([
      { role: "appMenu" },
      {
        label: "Edit",
        submenu: [{ role: "undo" }, { role: "redo" }, { type: "separator" }, { role: "cut" }, { role: "copy" }, { role: "paste" }, { role: "selectAll" }],
      },
      { label: "Window", submenu: [{ role: "minimize" }, { role: "close" }] },
    ]),
  );
}

ipcMain.handle("toggle-maximize", () => {
  const area = screen.getDisplayMatching(win.getBounds()).workArea;
  const next = toggleMaximize(win.getBounds(), area, restoreTo);
  restoreTo = next.restore;
  win.setBounds(next.bounds, true);
});

ipcMain.handle("toggle-fullscreen", () => win.setFullScreen(!win.isFullScreen()));

ipcMain.handle("screenshot", async () => {
  const image = await win.webContents.capturePage();
  const dir = path.join(os.homedir(), "Desktop");
  const file = path.join(dir, "ts-playground-" + new Date().toISOString().replace(/[:.]/g, "-") + ".png");
  fs.writeFileSync(file, image.toPNG());
  return path.basename(file);
});

app.on("second-instance", () => {
  if (!win) return;
  if (win.isMinimized()) win.restore();
  win.show();
  win.focus();
});

app.on("before-quit", (e) => {
  if (stopped) return;
  e.preventDefault();
  stopped = true;
  saveState();
  const res = spawnSync("bash", [path.join(config.root, "scripts", "stop-all.sh")], { env, cwd: config.root, timeout: 40000 });
  if (res.status !== 0) dialog.showErrorBox("TypeScript Playground", "stop-all.sh failed: " + String(res.stderr));
  app.quit();
});

app.on("window-all-closed", () => app.quit());

app.whenReady().then(() => {
  if (process.platform === "darwin" && app.dock) app.dock.setIcon(path.join(__dirname, "icon.png"));
  buildMenu();
  createWindow();
});
