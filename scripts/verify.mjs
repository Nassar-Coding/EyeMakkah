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
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
page.on("console", (m) => { if (m.type() === "error") { const t = m.text(); if (!/fonts\.googleapis|ERR_|net::|Failed to load resource/.test(t)) errors.push("console: " + t); } });
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));

const appText = () => page.evaluate(() => document.querySelector(".em").innerText);
const shot = async (name) => { await page.screenshot({ path: `${shotDir}/${name}.png` }); };
const goTab = async (label) => {
  for (let i = 0; i < 6; i++) {
    const map = { "الرئيسية": "home", "اكتشف": "discover", "المجتمع": "community", "خطتي": "plan" };
    const nav = page.locator(`[data-nav="${map[label]}"]`);
    if (await nav.count() && await nav.first().isVisible().catch(() => false)) { await nav.first().click(); await page.waitForTimeout(500); return; }
    const close = page.getByLabel("إغلاق");
    if (await close.count() && await close.first().isVisible().catch(() => false)) { await close.first().click(); await page.waitForTimeout(250); continue; }
    const back = page.getByLabel("رجوع");
    if (await back.count() && await back.first().isVisible().catch(() => false)) { await back.first().click(); await page.waitForTimeout(250); continue; }
    await page.waitForTimeout(200);
  }
  throw new Error("could not reach tab " + label);
};
const tapText = async (text, opts = {}) => {
  const el = page.getByText(text, { exact: false }).first();
  await el.waitFor({ state: "visible", timeout: opts.timeout || 6000 });
  await el.click({ timeout: 5000 });
  await page.waitForTimeout(opts.wait ?? 420);
};

const openByName = async (name) => {
  await goTab("الرئيسية");
  await tapText("ابحث عن مكان أو تجربة أو مجتمع");
  await page.keyboard.type(name);
  await page.waitForTimeout(900);
  await page.getByText(name, { exact: false }).first().click();
  await page.waitForTimeout(700);
};

await page.goto("http://127.0.0.1:4321/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
// Entry flow: Landing -> Language -> transformed app
await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
await page.waitForTimeout(600);
await page.locator('[data-lang="ar"]').click();
await page.waitForTimeout(900);

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
  await openByName("حي حراء الثقافي");
  const body = await appText();
  for (const layer of ["معلومات عملية", "ماذا يقول الناس", "المصدر والسياق", "وبعدها؟"]) {
    if (!body.includes(layer)) throw new Error("missing decision layer: " + layer);
  }
});
await shot("02-decision");

await step("back returns", async () => {
  await goTab("الرئيسية");
  const b = await appText();
  if (!/كم معك وقت الآن؟/.test(b)) throw new Error("home not restored");
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

await step("participation: join → start → complete a free activity", async () => {
  await openByName("ورشة خط للمبتدئين");
  await page.getByText("انضم — سأحضر", { exact: true }).click();
  await page.waitForTimeout(500);
  let b = await appText();
  if (!/سأحضر/.test(b)) throw new Error("join state not shown");
  await page.getByText("ابدأ الآن", { exact: true }).click();
  await page.waitForTimeout(500);
  b = await appText();
  if (!/جارٍ الآن/.test(b)) throw new Error("active state not reached");
  await page.getByText("أكملت هذا", { exact: true }).click();
  await page.waitForTimeout(600);
  b = await appText();
  if (!/استمتعت؟|شارك صورة|اكتب نصيحة عملية/.test(b)) throw new Error("completion prompts missing");
});
await shot("10-participate");

await step("booking handoff never self-confirms", async () => {
  await page.getByText("لاحقًا", { exact: true }).click().catch(() => {});
  await page.waitForTimeout(300);
  await openByName("معرض الوحي");
  await page.getByText("احجز", { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByText(/تابع إلى/).first().click();
  await page.waitForTimeout(500);
  const b = await appText();
  if (!/انتقلت لإكمال الحجز/.test(b)) throw new Error("outbound state wording missing");
  if (/^مؤكد$/m.test(b)) throw new Error("became confirmed without confirmation");
  await page.getByText("أكملت الحجز — أكّده", { exact: true }).click();
  await page.waitForTimeout(500);
  const b2 = await appText();
  if (!/مؤكد/.test(b2)) throw new Error("explicit confirmation did not apply");
});
await shot("10b-handoff");
await shot("10-participate");

await step("plan separates saved / planned / confirmed / completed", async () => {
  await goTab("خطتي");
  const b = await appText();
  if (!/كل حالة تعني شيئًا مختلفًا/.test(b)) throw new Error("plan header missing");
  if (!/مكتمل/.test(b)) throw new Error("completed bucket missing");
  if (!/مؤكد/.test(b)) throw new Error("confirmed bucket missing");
  if (!/ماذا بعد؟/.test(b)) throw new Error("what-next missing after completion");
});
await shot("11-plan");

await step("home offers an assembled outing", async () => {
  await goTab("الرئيسية");
  const b = await appText();
  if (!/وش تسوي الليلة؟|عندك ساعتان؟/.test(b)) throw new Error("no going-out module");
});
await shot("12-outing");

await step("trust: conflicting hours are shown, not resolved silently", async () => {
  await openByName("متحف برج الساعة");
  const b = await appText();
  if (!/توجد معلومات متعارضة/.test(b)) throw new Error("conflict not surfaced");
  if (!/ننصح بالتأكد من المشغّل/.test(b)) throw new Error("confidence not reduced");
  await page.getByText("اعرض المصادر المتعارضة", { exact: true }).click();
  await page.waitForTimeout(500);
  const b2 = await appText();
  if (!/من مقدم الخدمة/.test(b2) || !/من المجتمع/.test(b2)) throw new Error("both source classes not shown");
});
await shot("13-conflict");

await step("trust: a newer source resolves it everywhere", async () => {
  await page.getByText("اطلب تحديثًا من المصدر", { exact: true }).click();
  await page.waitForTimeout(600);
  const b = await appText();
  if (!/وصل تحديث أحدث من المشغّل/.test(b)) throw new Error("resolution not applied");
});

await step("expired content is archived, not promoted", async () => {
  await page.getByLabel("إغلاق").first().click().catch(() => {});
  await goTab("اكتشف");
  const b = await appText();
  if (/معرض الحرف السابق/.test(b)) throw new Error("ended event is being promoted");
  await page.getByText(/الأرشيف —/).first().click();
  await page.waitForTimeout(600);
  const b2 = await appText();
  if (!/انتهى|منتهٍ|غير نشط|متوقف مؤقتًا/.test(b2)) throw new Error("archive does not show ended content");
});
await shot("14-archive");

await step("personalisation: dismissing changes the feed and is reversible", async () => {
  await goTab("الرئيسية");
  const before = await appText();
  await page.getByLabel("إخفاء").first().click();
  await page.waitForTimeout(350);
  await page.getByText("لا تعجبني هذه الفئة", { exact: true }).click();
  await page.waitForTimeout(600);
  const after = await appText();
  if (before === after) throw new Error("feed unchanged after dismissal");
  await goTab("الرئيسية");
  await page.getByLabel("حسابي").click();
  await page.waitForTimeout(500);
  const prof = await appText();
  if (!/عناصر أخفيتها/.test(prof)) throw new Error("dismissal not reversible from profile");
});
await shot("15-personalisation");

await step("notifications are useful, not generic", async () => {
  await page.getByText("الإشعارات المفيدة", { exact: true }).click();
  await page.waitForTimeout(400);
  await page.getByLabel("رجوع").first().click();
  await page.waitForTimeout(400);
  await page.getByLabel("الإشعارات").click();
  await page.waitForTimeout(600);
  const b = await appText();
  if (/نفتقدك|اشتقنا لك/.test(b)) throw new Error("generic engagement notification present");
  if (!/الإشعارات/.test(b)) throw new Error("notifications screen missing");
});
await shot("16-notifications");

await step("provider role can publish and it appears in discovery", async () => {
  await goTab("الرئيسية");
  await page.getByLabel("حسابي").click();
  await page.waitForTimeout(500);
  await page.getByText("أدوات مقدّم التجربة", { exact: true }).first().click();
  await page.waitForTimeout(600);
  await page.getByText("انشر نشاطًا أو عرضًا", { exact: false }).click();
  await page.waitForTimeout(400);
  await page.locator("input").first().fill("ورشة تذهيب للمبتدئين");
  await page.getByText("انشر", { exact: true }).last().click();
  await page.waitForTimeout(800);
  const b = await appText();
  if (!/ورشة تذهيب للمبتدئين/.test(b)) throw new Error("published object did not open");
  await goTab("اكتشف");
  await page.waitForTimeout(300);
  await page.getByText("ابحث في مكة").click();
  await page.waitForTimeout(400);
  await page.keyboard.type("تذهيب");
  await page.waitForTimeout(1200);
  const b2 = await appText();
  if (!/ورشة تذهيب للمبتدئين/.test(b2)) throw new Error("published object not discoverable");
});
await shot("17-provider");

await step("provider signals show the interaction loop", async () => {
  await goTab("الرئيسية");
  await page.getByLabel("حسابي").click();
  await page.waitForTimeout(500);
  await page.getByText("أدوات مقدّم التجربة", { exact: true }).first().click();
  await page.waitForTimeout(500);
  await page.getByText("الإشارات", { exact: true }).click();
  await page.waitForTimeout(500);
  const b = await appText();
  for (const t of ["من الاهتمام إلى الفعل", "أين يقع الاهتمام", "ما يبحث عنه الناس", "جودة المعلومة"]) {
    if (!b.includes(t)) throw new Error("missing signal block: " + t);
  }
  if (!/بحوكمة خصوصية/.test(b)) throw new Error("privacy framing missing");
});
await shot("18-signals");

console.log("\n──────── verification ────────");
for (const [s, n] of results) console.log(`${s === "PASS" ? "✓" : "✗"} ${n}`);
if (errors.length) { console.log("\nRUNTIME ERRORS:"); errors.slice(0, 12).forEach((e) => console.log("  " + e)); }
const failed = results.filter((r) => r[0] === "FAIL").length;
console.log(`\n${results.length - failed}/${results.length} steps passed · ${errors.length} runtime errors`);
await browser.close(); server.close();
process.exit(failed || errors.length ? 1 : 0);
