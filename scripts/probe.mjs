import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
const root = "/home/user/EyeMakkah/dist";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
const server = createServer(async (req, res) => {
  const f = resolve(root, req.url === "/" ? "index.html" : "." + req.url.split("?")[0]);
  try { const b = await readFile(f); res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(4399, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 500, height: 950 } });
page.on("pageerror", e => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:4399/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.waitForTimeout(400);
console.log("--- HOME ---");
console.log((await page.evaluate(() => document.querySelector(".em").innerText)).slice(0, 4000));
await page.locator('[data-nav="plan"]').click();
await page.waitForTimeout(700);
console.log("--- PLAN ---");
console.log(await page.evaluate(() => document.querySelector(".em").innerText.slice(0, 1200)));
await page.screenshot({ path: "/tmp/claude-0/-home-user-EyeMakkah/bdda0f4a-9b40-5755-97f3-db2bbfc5eb30/scratchpad/shots/probe-community.png" });
await browser.close(); server.close();
