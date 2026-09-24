/* Entry flow check: cover → language → transformed app, in both languages. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
const root = process.env.ROOT || "/home/user/EyeMakkah/dist";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
const server = createServer(async (req, res) => {
  const f = resolve(root, req.url === "/" ? "index.html" : "." + req.url.split("?")[0]);
  try { const b = await readFile(f); res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(4510, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const shots = process.env.OUT || "/tmp/claude-0/-home-user-EyeMakkah/bdda0f4a-9b40-5755-97f3-db2bbfc5eb30/scratchpad/entry";
const results = [];
const errs = [];

for (const langId of ["ar", "en"]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
  page.on("pageerror", (e) => errs.push(`${langId}: ${e.message}`));
  page.on("console", (m) => { if (m.type() === "error" && !/fonts|net::|Failed to load resource/.test(m.text())) errs.push(`${langId}: ${m.text()}`); });
  const txt = () => page.evaluate(() => document.querySelector(".em").innerText);
  await page.goto("http://127.0.0.1:4510/", { waitUntil: "networkidle" });
  await page.waitForTimeout(800);

  const t1 = await txt();
  results.push(["landing shows first", /EyeMakkah/.test(t1) && /(ابدأ|Enter EyeMakkah)/.test(t1)]);
  if (langId === "ar") await page.screenshot({ path: `${shots}/01-landing.png` });

  await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
  await page.waitForTimeout(700);
  const t2 = await txt();
  results.push(["language screen follows", /Choose your language/.test(t2) && /العربية/.test(t2) && /English/.test(t2)]);
  if (langId === "ar") await page.screenshot({ path: `${shots}/02-language.png` });

  await page.locator(`[data-lang="${langId}"]`).click();
  await page.waitForTimeout(1200);
  const t3 = await txt();
  const dir = await page.evaluate(() => document.querySelector(".em").getAttribute("dir"));
  results.push([`${langId}: enters the app directly`, !/Choose your language/.test(t3)]);
  results.push([`${langId}: no portal screen`, !/بوابة|Portal/.test(t3)]);
  results.push([`${langId}: direction is ${langId === "ar" ? "rtl" : "ltr"}`, dir === (langId === "ar" ? "rtl" : "ltr")]);
  const navs = await page.locator("[data-nav]").count();
  results.push([`${langId}: four primary tabs`, navs === 4]);
  await page.screenshot({ path: `${shots}/03-app-${langId}.png` });

  /* how much Arabic is still rendered when reading in English */
  if (langId === "en") {
    const leftovers = await page.evaluate(() => {
      const out = [];
      const walk = (n) => {
        if (n.nodeType === 3) { const t = n.nodeValue.trim(); if (t && /[؀-ۿ]/.test(t)) out.push(t); return; }
        if (n.nodeType === 1 && getComputedStyle(n).display !== "none") n.childNodes.forEach(walk);
      };
      walk(document.querySelector("[data-screen]"));
      return out;
    });
    console.log("ARABIC_LEFTOVERS_HOME", JSON.stringify(leftovers));
  }
  await page.close();
}

console.log("\n──────── entry flow ────────");
results.forEach(([n, ok]) => console.log(`${ok ? "✓" : "✗"} ${n}`));
if (errs.length) { console.log("errors:"); errs.slice(0, 6).forEach((e) => console.log("  ! " + e)); }
const failed = results.filter((r) => !r[1]).length;
console.log(`${results.length - failed}/${results.length} checks passed · ${errs.length} runtime errors`);
await browser.close(); server.close();
process.exit(failed || errs.length ? 1 : 0);
