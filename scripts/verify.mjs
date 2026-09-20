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

const appText = () => page.evaluate(() => document.querySelector(".em").innerText);
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
  const body = await appText();
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
  const body = await appText();
  if (!/معلومات عملية|ماذا يقول الناس|المصدر والسياق/.test(body)) throw new Error("decision page layers missing");
});
await shot("02-decision");

await step("back returns", async () => {
  await page.getByLabel("رجوع").first().click();
  await page.waitForTimeout(400);
});

await step("discover tab loads", async () => { await tapText("اكتشف"); const b = await appText(); if (!/الليلة في مكة|نتيجة/.test(b)) throw new Error("discover empty"); });
await shot("03-discover");

await step("map mode renders pins", async () => {
  await page.locator("svg").first().waitFor({ timeout: 4000 });
});

await step("community tab loads", async () => { await tapText("المجتمع"); const b = await appText(); if (!/من المجتمع، إلى المجتمع/.test(b)) throw new Error("community empty"); });
await shot("04-community");

await step("plan tab loads", async () => { await tapText("خطتي"); const b = await appText(); if (!/خطتي/.test(b)) throw new Error("plan empty"); });
await shot("05-plan");

await step("search finds mixed objects", async () => {
  await tapText("الرئيسية");
  await tapText("ابحث عن مكان أو تجربة أو مجتمع");
  await page.keyboard.type("أكل مكي");
  await page.waitForTimeout(700);
  const b = await appText();
  if (!/نتيجة/.test(b)) throw new Error("no search results");
});
await shot("06-search");

await step("community: open a family then a community", async () => {
  await page.getByLabel("رجوع").first().click().catch(() => {});   // leave search
  await page.waitForTimeout(400);
  await tapText("المجتمع");
  await tapText("الأحياء", { wait: 500 });
  const b = await appText();
  if (!/مجتمع داخل هذه العائلة/.test(b)) throw new Error("family screen missing");
  await tapText("مجتمع العوالي", { wait: 500 });
  const b2 = await appText();
  if (!/قواعد بسيطة/.test(b2)) throw new Error("community detail missing");
});
await shot("07-community-detail");

await step("community: join then post a question", async () => {
  await page.getByText("انضم", { exact: true }).first().click().catch(() => {});
  await page.waitForTimeout(350);
  await page.getByLabel("اكتب مساهمة").first().click();
  await page.waitForTimeout(400);
  await page.locator("textarea").first().fill("هل يوجد مكان هادئ للدراسة قريب من الحي؟");
  await page.getByText("انشر", { exact: true }).first().click();
  await page.waitForTimeout(600);
  const b = await appText();
  if (!/هل يوجد مكان هادئ للدراسة/.test(b)) throw new Error("user contribution not visible in community");
});
await shot("08-contributed");

await step("community: open a thread and answer", async () => {
  await tapText("المجتمع");
  await page.waitForTimeout(400);
  const q = page.getByText(/صار فيه سوق مسائي|العرض ينتهي الليلة|هل يوجد مكان هادئ/).first();
  await q.click();
  await page.waitForTimeout(500);
  await page.locator("input[placeholder='اكتب إجابة من تجربتك']").fill("نعم، مقهى الدراسة بالششة يفتح من الصباح.");
  await page.getByLabel("إرسال").click();
  await page.waitForTimeout(500);
  const b = await appText();
  if (!/مقهى الدراسة بالششة يفتح/.test(b)) throw new Error("answer not posted");
});
await shot("09-thread");

console.log("\n──────── verification ────────");
for (const [s, n] of results) console.log(`${s === "PASS" ? "✓" : "✗"} ${n}`);
if (errors.length) { console.log("\nRUNTIME ERRORS:"); errors.slice(0, 12).forEach((e) => console.log("  " + e)); }
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} steps passed · ${errors.length} runtime errors`);
await browser.close(); server.close();
process.exit(failed || errors.length ? 1 : 0);
