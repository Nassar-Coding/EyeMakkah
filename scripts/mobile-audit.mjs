/* Mobile-native audit: walks the app at real phone widths and fails on horizontal
   overflow, unreachable rail content, or controls that are too small to tap. */
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
await new Promise((r) => server.listen(4488, r));

const findings = [];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });

const audit = async (page, label) => {
  const r = await page.evaluate(() => {
    const out = { overflow: null, wide: [], rails: [], small: [] };
    const screen = document.querySelector("[data-screen]");
    if (screen) {
      const over = screen.scrollWidth - screen.clientWidth;
      if (over > 1) out.overflow = { over, w: screen.clientWidth };
    }
    const vw = screen ? screen.clientWidth : window.innerWidth;
    document.querySelectorAll("[data-screen] *").forEach((el) => {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.display === "none") return;
      const rect = el.getBoundingClientRect();
      if (el.closest("svg")) return;   /* slice-scaled scene art is meant to cover */
      if (rect.width > vw + 2 && !el.classList.contains("rail") && cs.overflowX !== "auto" && cs.overflowX !== "scroll") {
        const tag = el.tagName.toLowerCase() + (el.className && typeof el.className === "string" ? "." + el.className.split(" ")[0] : "");
        out.wide.push({ tag, w: Math.round(rect.width), text: (el.innerText || "").slice(0, 24) });
      }
    });
    document.querySelectorAll("[data-screen] .rail").forEach((rail, i) => {
      const kids = [...rail.children].filter((c) => c.getBoundingClientRect().width > 0);
      if (!kids.length) return;
      const railBox = rail.getBoundingClientRect();
      const first = kids[0].getBoundingClientRect();
      const scrollable = rail.scrollWidth - rail.clientWidth;
      const rtl = getComputedStyle(rail).direction === "rtl";
      /* at rest, the first logical card must be fully inside the rail viewport */
      const firstFullyVisible = rtl
        ? first.right <= railBox.right + 2 && first.left >= railBox.left - first.width
        : first.left >= railBox.left - 2 && first.right <= railBox.right + first.width;
      out.rails.push({ i, kids: kids.length, scrollable: Math.round(scrollable), firstFullyVisible, firstW: Math.round(first.width) });
    });
    document.querySelectorAll("[data-screen] button").forEach((b) => {
      const rect = b.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      if (rect.height < 30 && !b.classList.contains("tap") && (b.innerText || "").length < 3) {
        out.small.push({ h: Math.round(rect.height), w: Math.round(rect.width), text: (b.getAttribute("aria-label") || b.innerText || "").slice(0, 20) });
      }
    });
    return out;
  });
  if (r.overflow) findings.push(`${label}: horizontal overflow ${r.overflow.over}px (viewport ${r.overflow.w})`);
  r.wide.slice(0, 3).forEach((w) => findings.push(`${label}: element wider than screen — ${w.tag} ${w.w}px "${w.text}"`));
  r.rails.forEach((rl) => { if (!rl.firstFullyVisible) findings.push(`${label}: rail #${rl.i} first card not fully visible at rest`); });
  r.small.slice(0, 3).forEach((sm) => findings.push(`${label}: tap target ${sm.w}×${sm.h} "${sm.text}"`));
  return r;
};

/* rails must be swipeable to their far end in the document's direction */
const railReach = async (page, label) => {
  const res = await page.evaluate(async () => {
    const rails = [...document.querySelectorAll("[data-screen] .rail")].filter((r) => r.scrollWidth - r.clientWidth > 4);
    const out = [];
    for (const rail of rails) {
      const rtl = getComputedStyle(rail).direction === "rtl";
      const max = rail.scrollWidth - rail.clientWidth;
      rail.scrollLeft = rtl ? -max : max;
      await new Promise((r) => setTimeout(r, 60));
      const kids = [...rail.children].filter((c) => c.getBoundingClientRect().width > 0);
      const last = kids[kids.length - 1].getBoundingClientRect();
      const box = rail.getBoundingClientRect();
      const reached = rtl ? last.left >= box.left - 3 : last.right <= box.right + 3;
      out.push({ reached, max: Math.round(max) });
      rail.scrollLeft = 0;
    }
    return out;
  });
  res.forEach((r, i) => { if (!r.reached) findings.push(`${label}: rail #${i} last card unreachable by swiping`); });
};

for (const vp of [{ width: 390, height: 844, name: "390" }, { width: 360, height: 740, name: "360" }]) {
  const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  page.on("pageerror", (e) => findings.push(`${vp.name} pageerror: ${e.message}`));
  await page.goto("http://127.0.0.1:4488/", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
  await page.waitForTimeout(500);
  await page.locator('[data-lang="ar"]').click();
  await page.waitForTimeout(900);
  await page.waitForTimeout(700);

  const tab = async (id) => {
    for (let i = 0; i < 6; i++) {
      const nav = page.locator(`[data-nav="${id}"]`);
      if (await nav.count() && await nav.first().isVisible().catch(() => false)) { await nav.first().click(); await page.waitForTimeout(450); return true; }
      const c = page.getByLabel("إغلاق"), b = page.getByLabel("رجوع");
      if (await c.count() && await c.first().isVisible().catch(() => false)) await c.first().click();
      else if (await b.count() && await b.first().isVisible().catch(() => false)) await b.first().click();
      await page.waitForTimeout(200);
    }
    return false;
  };
  const openByName = async (name) => {
    await tab("home");
    await page.getByText("ابحث عن مكان أو تجربة أو مجتمع").click(); await page.waitForTimeout(300);
    await page.keyboard.type(name); await page.waitForTimeout(800);
    await page.getByText(name, { exact: false }).first().click(); await page.waitForTimeout(650);
  };

  await audit(page, `${vp.name} home`); await railReach(page, `${vp.name} home`);
  await tab("discover"); await audit(page, `${vp.name} discover`); await railReach(page, `${vp.name} discover`);
  await tab("community"); await audit(page, `${vp.name} community`); await railReach(page, `${vp.name} community`);
  await tab("plan"); await audit(page, `${vp.name} plan`);
  await openByName("حي حراء الثقافي"); await audit(page, `${vp.name} decision`); await railReach(page, `${vp.name} decision`);
  await tab("community");
  await page.getByText("الأحياء", { exact: true }).first().click().catch(() => {}); await page.waitForTimeout(500);
  await audit(page, `${vp.name} family`);
  await page.close();
}

console.log("\n──────── mobile audit ────────");
if (!findings.length) console.log("clean: no overflow, no unreachable rail content, no undersized tap targets");
else findings.slice(0, 40).forEach((f) => console.log("  • " + f));
console.log(`findings: ${findings.length}`);
await browser.close(); server.close();
process.exit(findings.length ? 1 : 0);
