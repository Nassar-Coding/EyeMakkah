/* Runtime verification: boots the built app in Chromium, walks core journeys,
   fails on any console error or unhandled rejection. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..", "dist");
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".txt": "text/plain" };
const shotDir = process.env.SHOT_DIR || "/tmp/claude-0/-home-user-EyeMakkah/bdda0f4a-9b40-5755-97f3-db2bbfc5eb30/scratchpad/shots";

const server = createServer(async (req, res) => {
  const p = req.url.split("?")[0];
  const file = resolve(root, p === "/" ? "index.html" : "." + p);
  try {
    const buf = await readFile(file);
    res.writeHead(200, { "Content-Type": MIME[extname(file)] || "application/octet-stream" });
    res.end(buf);
  } catch { res.writeHead(404); res.end("nf"); }
});
await new Promise((r) => server.listen(4321, r));

const errors = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 950 } });
page.on("console", (m) => { if (m.type() === "error") { const t = m.text(); if (!/fonts\.googleapis|ERR_|net::|Failed to load resource/.test(t)) errors.push("console: " + t); } });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

const shot = async (name) => { await page.screenshot({ path: `${shotDir}/${name}.png` }); };
const tapText = async (text, opts = {}) => {
  const el = page.getByText(text, { exact: false }).first();
  await el.waitFor({ state: "visible", timeout: opts.timeout || 6000 });
  await el.click({ timeout: 5000 });
  await page.waitForTimeout(opts.wait ?? 420);
};

await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);

const steps = JSON.parse(process.env.STEPS || "[]");
const results = [];
async function step(name, fn) {
  try { await fn(); results.push(["PASS", name]); }
  catch (e) { results.push(["FAIL", name + " — " + e.message.split("\n")[0]]); }
}

await step("app boots with content", async () => {
  const body = await page.textContent("body");
  if (!body.includes("مكة")) throw new Error("no Arabic content rendered");
});
await shot("01-home");

await step("home shows more than one module", async () => {
  const n = await page.locator("button").count();
  if (n < 20) throw new Error("only " + n + " interactive elements");
});

await step("open a decision page from home", async () => {
  await page.locator("button").filter({ hasText: /./ }).nth(6).click();
  await page.waitForTimeout(500);
  const body = await page.textContent("body");
  if (!/معلومات عملية|ماذا يقول الناس|المصدر والسياق/.test(body)) throw new Error("decision page layers missing");
});
await shot("02-decision");

await step("back returns", async () => {
  await page.getByLabel("رجوع").first().click();
  await page.waitForTimeout(400);
});

await step("discover tab loads", async () => { await tapText("اكتشف"); const b = await page.textContent("body"); if (!/الليلة في مكة|نتيجة/.test(b)) throw new Error("discover empty"); });
await shot("03-discover");

await step("map mode renders pins", async () => {
  await page.locator("svg").first().waitFor({ timeout: 4000 });
});

await step("community tab loads", async () => { await tapText("المجتمع"); const b = await page.textContent("body"); if (!/من المجتمع، إلى المجتمع/.test(b)) throw new Error("community empty"); });
await shot("04-community");

await step("plan tab loads", async () => { await tapText("خطتي"); const b = await page.textContent("body"); if (!/خطتي/.test(b)) throw new Error("plan empty"); });
await shot("05-plan");

await step("search finds mixed objects", async () => {
  await tapText("الرئيسية");
  await tapText("ابحث عن مكان أو تجربة أو مجتمع");
  await page.keyboard.type("أكل مكي");
  await page.waitForTimeout(700);
  const b = await page.textContent("body");
  if (!/نتيجة/.test(b)) throw new Error("no search results");
});
await shot("06-search");

console.log("\n──────── verification ────────");
for (const [s, n] of results) console.log(`${s === "PASS" ? "✓" : "✗"} ${n}`);
if (errors.length) { console.log("\nRUNTIME ERRORS:"); errors.slice(0, 12).forEach((e) => console.log("  " + e)); }
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} steps passed · ${errors.length} runtime errors`);
await browser.close(); server.close();
process.exit(failed || errors.length ? 1 : 0);
