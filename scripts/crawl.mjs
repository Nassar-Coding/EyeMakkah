/* Broad QA crawl: opens a wide sample of objects, communities, families, clubs and
   threads, and fails on runtime errors, blank screens or dead ends. */
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
await new Promise((r) => server.listen(4455, r));

const errors = [], thin = [], dead = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 460, height: 940 } });
page.on("console", (m) => { if (m.type() === "error") { const t = m.text(); if (!/fonts\.googleapis|net::|Failed to load resource/.test(t)) errors.push(t); } });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
const txt = () => page.evaluate(() => document.querySelector(".em")?.innerText || "");
await page.goto("http://127.0.0.1:4455/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);

/* Crawl by driving the app's own navigation through the search box, which is the
   only public way in — no internal hooks. */
const openSearch = async () => {
  for (let i = 0; i < 6; i++) {
    const nav = page.locator('[data-nav="home"]');
    if (await nav.count() && await nav.first().isVisible().catch(() => false)) { await nav.first().click(); break; }
    const close = page.getByLabel("إغلاق"); const back = page.getByLabel("رجوع");
    if (await close.count() && await close.first().isVisible().catch(() => false)) { await close.first().click(); }
    else if (await back.count() && await back.first().isVisible().catch(() => false)) { await back.first().click(); }
    await page.waitForTimeout(200);
  }
  await page.waitForTimeout(300);
  await page.getByText("ابحث عن مكان أو تجربة أو مجتمع").click();
  await page.waitForTimeout(350);
};

const names = JSON.parse(process.env.NAMES || "[]");
let opened = 0;
for (const name of names) {
  await openSearch();
  await page.keyboard.type(name);
  await page.waitForTimeout(700);
  const hit = page.getByText(name, { exact: false }).first();
  if (!(await hit.count())) { dead.push("not found in search: " + name); continue; }
  await hit.click();
  await page.waitForTimeout(600);
  const t = await txt();
  opened++;
  if (t.length < 260) thin.push(`${name} → ${t.length} chars`);
  if (!/رجوع|الرئيسية/.test(t) && !(await page.getByLabel("رجوع").count())) dead.push("no way back from " + name);
}

/* every community family and a sample of communities + clubs */
for (let i = 0; i < 6; i++) {
  const nav = page.locator('[data-nav="community"]');
  if (await nav.count() && await nav.first().isVisible().catch(() => false)) { await nav.first().click(); break; }
  const back = page.getByLabel("رجوع"); const close = page.getByLabel("إغلاق");
  if (await close.count() && await close.first().isVisible().catch(() => false)) await close.first().click();
  else if (await back.count() && await back.first().isVisible().catch(() => false)) await back.first().click();
  await page.waitForTimeout(200);
}
await page.waitForTimeout(500);
const families = ["الأحياء", "زوار مكة", "الحج والعمرة", "المطاعم والتجارب", "الثقافة والتاريخ", "التطوع والمبادرات", "التعليم والهوايات", "الحياة في مكة"];
for (const f of families) {
  await page.locator('[data-nav="community"]').click(); await page.waitForTimeout(400);
  const el = page.getByText(f, { exact: true }).first();
  if (!(await el.count())) { dead.push("family missing: " + f); continue; }
  await el.click(); await page.waitForTimeout(500);
  const t = await txt();
  if (!/مجتمع/.test(t)) dead.push("family has no communities: " + f);
  const firstCom = page.getByText(/^مجتمع |^أول |^الأكل |^المقاهي |^التراث |^خدمة |^طلاب |^العائلات /).first();
  if (await firstCom.count()) {
    await firstCom.click(); await page.waitForTimeout(500);
    const t2 = await txt();
    if (!/قواعد بسيطة/.test(t2)) dead.push("community detail incomplete under " + f);
    if (t2.length < 300) thin.push("community under " + f);
  }
  opened++;
}

console.log(`\n──────── crawl ────────\nopened: ${opened} screens`);
console.log(`runtime errors: ${errors.length}`);
errors.slice(0, 10).forEach((e) => console.log("  ! " + e));
console.log(`thin screens: ${thin.length}`);
thin.slice(0, 10).forEach((e) => console.log("  ~ " + e));
console.log(`dead ends: ${dead.length}`);
dead.slice(0, 15).forEach((e) => console.log("  x " + e));
await browser.close(); server.close();
process.exit(errors.length || dead.length ? 1 : 0);
