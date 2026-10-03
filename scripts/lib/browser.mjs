/* One way for every QA script to start Chromium and serve a build.
   Chromium: CHROMIUM_PATH if set; otherwise a Chromium already installed under
   PLAYWRIGHT_BROWSERS_PATH (or ~/.cache/ms-playwright); otherwise Playwright's own
   resolution. Builds are served from ROOT (default: dist/). */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { existsSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname, join, resolve, dirname } from "node:path";
import { homedir, tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

export const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

export function chromiumPath() {
  if (process.env.CHROMIUM_PATH) return process.env.CHROMIUM_PATH;
  const roots = [process.env.PLAYWRIGHT_BROWSERS_PATH, join(homedir(), ".cache", "ms-playwright")].filter(Boolean);
  for (const root of roots) {
    if (!existsSync(root)) continue;
    const dirs = readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)).sort().reverse();
    for (const d of dirs) {
      for (const exe of ["chrome-linux/chrome", "chrome-linux64/chrome", "chrome-mac/Chromium.app/Contents/MacOS/Chromium", "chrome-win/chrome.exe"]) {
        const p = join(root, d, exe);
        if (existsSync(p)) return p;
      }
    }
  }
  return undefined;   // let Playwright resolve its own browser
}

export function launchBrowser(opts = {}) {
  const executablePath = chromiumPath();
  return chromium.launch({ args: ["--no-sandbox"], ...(executablePath ? { executablePath } : {}), ...opts });
}

export const outDir = (name) => process.env.OUT || join(tmpdir(), "eyemakkah-qa", name);

const MIME = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json",
  ".css": "text/css", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".txt": "text/plain",
};
/* static server for a build; returns { url, close } */
export async function serveBuild(root = process.env.ROOT || join(REPO, "dist"), port = 0) {
  const server = createServer(async (req, res) => {
    const path = decodeURIComponent((req.url || "/").split("?")[0]);
    const f = resolve(root, path === "/" ? "index.html" : "." + path);
    if (!f.startsWith(resolve(root))) { res.writeHead(403); res.end(); return; }
    try { const b = await readFile(f); res.writeHead(200, { "Content-Type": MIME[extname(f)] || "application/octet-stream" }); res.end(b); }
    catch { res.writeHead(404); res.end(); }
  });
  await new Promise((r) => server.listen(port, "127.0.0.1", r));
  return { url: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => server.close(r)), port: server.address().port };
}
