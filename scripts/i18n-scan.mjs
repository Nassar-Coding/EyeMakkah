/* Walks the app in English and collects every Arabic string still rendered. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
const root = "/home/user/EyeMakkah/dist";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
const server = createServer(async (req, res) => {
  const f = resolve(root, req.url === "/" ? "index.html" : "." + req.url.split("?")[0]);
  try { const b = await readFile(f); res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(4520, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
await page.goto("http://127.0.0.1:4520/", { waitUntil: "networkidle" });
await page.waitForTimeout(700);
await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
await page.waitForTimeout(600);
await page.locator('[data-lang="en"]').click();
await page.waitForTimeout(1100);

const found = new Set();
const collect = async () => {
  const items = await page.evaluate(() => {
    const out = [];
    const push = (t) => { const v = (t || "").trim(); if (v && /[؀-ۿ]/.test(v)) out.push(v); };
    const walk = (n) => {
      if (n.nodeType === 3) return push(n.nodeValue);
      if (n.nodeType !== 1) return;
      const cs = getComputedStyle(n);
      if (cs.display === "none" || cs.visibility === "hidden") return;
      ["placeholder", "aria-label", "title", "alt"].forEach((a) => push(n.getAttribute && n.getAttribute(a)));
      n.childNodes.forEach(walk);
    };
    document.querySelectorAll(".em").forEach(walk);
    return out;
  });
  items.forEach((t) => found.add(t));
};

const tab = async (id) => {
  for (let i = 0; i < 6; i++) {
    const nav = page.locator(`[data-nav="${id}"]`);
    if (await nav.count() && await nav.first().isVisible().catch(() => false)) { await nav.first().click(); await page.waitForTimeout(500); return; }
    const c = page.getByLabel(/إغلاق|Close/), b = page.getByLabel(/رجوع|Back/);
    if (await c.count() && await c.first().isVisible().catch(() => false)) await c.first().click();
    else if (await b.count() && await b.first().isVisible().catch(() => false)) await b.first().click();
    await page.waitForTimeout(200);
  }
};
const scrollAll = async () => {
  for (let i = 0; i < 12; i++) { await collect(); await page.mouse.move(195, 480); await page.mouse.wheel(0, 900); await page.waitForTimeout(260); }
  await collect();
};

await scrollAll();
await tab("discover"); await scrollAll();
await tab("community"); await scrollAll();
await tab("plan"); await scrollAll();

/* deeper surfaces */
const open = async (name) => {
  await tab("home");
  await page.getByText(/ابحث عن مكان|Search for a place/).first().click(); await page.waitForTimeout(350);
  await page.keyboard.type(name); await page.waitForTimeout(900); await collect();
  await page.getByText(name, { exact: false }).first().click(); await page.waitForTimeout(700); await scrollAll();
};
for (const n of ["حي حراء الثقافي", "متحف برج الساعة", "ورشة خط للمبتدئين", "سفرة العوالي", "عرض العشاء العائلي", "نادي مشي مكة", "سعيد — مرشد محلي"]) {
  try { await open(n); } catch {}
}
try { await page.getByText(/اعرض المصادر|Show the/).first().click(); await page.waitForTimeout(600); await scrollAll(); } catch {}

await tab("community");
try { await page.getByText("الأحياء", { exact: true }).first().click(); await page.waitForTimeout(500); await scrollAll();
      await page.getByText(/مجتمع العوالي/).first().click(); await page.waitForTimeout(600); await scrollAll(); } catch {}
await tab("home");
try { await page.getByLabel(/حسابي|Profile/).click(); await page.waitForTimeout(600); await scrollAll();
      await page.getByText(/أدوات مقدّم التجربة|Host tools/).first().click(); await page.waitForTimeout(600); await scrollAll();
      for (const t of ["المشاركون", "الأسئلة", "الإشارات"]) { try { await page.getByText(t, { exact: true }).click(); await page.waitForTimeout(500); await scrollAll(); } catch {} }
} catch {}
await tab("home");
try { await page.getByLabel(/الإشعارات|Notifications/).click(); await page.waitForTimeout(600); await scrollAll(); } catch {}

const list = [...found].sort((a, b) => a.length - b.length);
await writeFile(process.env.OUT_FILE || "/tmp/claude-0/-home-user-EyeMakkah/bdda0f4a-9b40-5755-97f3-db2bbfc5eb30/scratchpad/arabic-leftovers.json", JSON.stringify(list, null, 1));
console.log("unique Arabic strings still rendered in English:", list.length);
await browser.close(); server.close();
