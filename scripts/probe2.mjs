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
await new Promise((r) => server.listen(4400, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 500, height: 950 } });
page.on("pageerror", e => console.log("PAGEERROR", e.message));
const txt = () => page.evaluate(() => document.querySelector(".em").innerText);
await page.goto("http://127.0.0.1:4400/", { waitUntil: "networkidle" });
await page.waitForTimeout(600);
await page.getByLabel("حسابي").click(); await page.waitForTimeout(500);
await page.getByText("أدوات مقدّم التجربة", { exact: true }).first().click(); await page.waitForTimeout(500);
await page.getByText("انشر نشاطًا أو عرضًا", { exact: false }).click(); await page.waitForTimeout(400);
await page.locator("input").first().fill("ورشة تذهيب للمبتدئين");
await page.getByText("انشر", { exact: true }).last().click(); await page.waitForTimeout(800);
console.log("AFTER PUBLISH:", (await txt()).slice(0, 220).replace(/\n/g, " | "));
for (let i=0;i<5;i++){ const b=page.getByLabel("رجوع"); if(await b.count() && await b.first().isVisible()){await b.first().click(); await page.waitForTimeout(250);} }
await page.locator('[data-nav="discover"]').click(); await page.waitForTimeout(500);
await page.getByText("ابحث في مكة").click(); await page.waitForTimeout(400);
await page.keyboard.type("تذهيب"); await page.waitForTimeout(1200);
console.log("SEARCH:", (await txt()).slice(0, 500).replace(/\n/g, " | "));
await browser.close(); server.close();
