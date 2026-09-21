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
await new Promise((r) => server.listen(4467, r));
const out = process.env.OUT || "/tmp/claude-0/-home-user-EyeMakkah/bdda0f4a-9b40-5755-97f3-db2bbfc5eb30/scratchpad/final";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
await page.goto("http://127.0.0.1:4467/", { waitUntil: "networkidle" });
await page.waitForTimeout(800);
await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
await page.waitForTimeout(600);
await page.locator(`[data-lang="${process.env.LANG_PICK || "ar"}"]`).click();
await page.waitForTimeout(1000);
const shot = (n) => page.screenshot({ path: `${out}/${n}.png` });
const home = async () => {
  for (let i = 0; i < 6; i++) {
    const nav = page.locator('[data-nav="home"]');
    if (await nav.count() && await nav.first().isVisible().catch(() => false)) { await nav.first().click(); await page.waitForTimeout(450); return; }
    const c = page.getByLabel("إغلاق"), b = page.getByLabel("رجوع");
    if (await c.count() && await c.first().isVisible().catch(() => false)) await c.first().click();
    else if (await b.count() && await b.first().isVisible().catch(() => false)) await b.first().click();
    await page.waitForTimeout(200);
  }
};
const open = async (name) => {
  await home();
  await page.getByText("ابحث عن مكان أو تجربة أو مجتمع").click(); await page.waitForTimeout(300);
  await page.keyboard.type(name); await page.waitForTimeout(800);
  await page.getByText(name, { exact: false }).first().click(); await page.waitForTimeout(700);
};

await shot("A-home");
await page.mouse.move(195, 480); await page.mouse.wheel(0, 1400); await page.waitForTimeout(600); await shot("B-home-scrolled");
await home(); await page.locator('[data-nav="discover"]').click(); await page.waitForTimeout(700); await shot("C-discover");
await page.mouse.move(195, 480); await page.mouse.wheel(0, 1200); await page.waitForTimeout(500); await shot("D-discover-scrolled");
await open("حي حراء الثقافي"); await shot("E-decision");
await page.mouse.move(195, 480); await page.mouse.wheel(0, 1000); await page.waitForTimeout(500); await shot("F-decision-scrolled");
await home(); await page.locator('[data-nav="community"]').click(); await page.waitForTimeout(700); await shot("G-community");
await page.mouse.move(195, 480); await page.mouse.wheel(0, 1200); await page.waitForTimeout(500); await shot("H-community-scrolled");
await open("ورشة خط للمبتدئين"); await page.waitForTimeout(400);
await page.getByText("انضم — سأحضر", { exact: true }).click().catch(() => {}); await page.waitForTimeout(500);
await shot("I-activity-joined");
await home(); await page.locator('[data-nav="plan"]').click(); await page.waitForTimeout(700); await shot("J-plan");
await home(); await page.getByLabel("حسابي").click(); await page.waitForTimeout(600); await shot("K-profile");
await page.mouse.move(195, 480); await page.mouse.wheel(0, 1600); await page.waitForTimeout(500); await shot("L-profile-scrolled");
await page.getByText("أدوات مقدّم التجربة", { exact: true }).first().click(); await page.waitForTimeout(600); await shot("M-provider");
await page.getByText("الإشارات", { exact: true }).click(); await page.waitForTimeout(600); await shot("N-signals");
await browser.close(); server.close();
console.log("shots written");
