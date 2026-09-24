/* Screen-by-screen UI quality audit.
   Walks the built app across a viewport matrix in Arabic and English, and at every
   screen state records: page-level horizontal overflow, text cut by the phone frame,
   text cut inside horizontal rails, text clipped by its own box, truncated names,
   small tap targets, broken images and drawn (non-photo) content media. Screenshots
   of every state are written for visual review.
   Env: VPS=360,390 (subset) LANGS=ar,en OUT=dir ROOT=dist-dir JSON=report.json ONLY=state-regex */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { extname, resolve } from "node:path";

const ROOT = process.env.ROOT || resolve("dist");
const OUT = process.env.OUT || "/tmp/ui-audit";
const PORT = +(process.env.PORT || 4640);
const ALL_VPS = [
  { name: "360", width: 360, height: 740, mobile: true },
  { name: "375", width: 375, height: 667, mobile: true },
  { name: "390", width: 390, height: 844, mobile: true },
  { name: "393", width: 393, height: 852, mobile: true },
  { name: "412", width: 412, height: 915, mobile: true },
  { name: "430", width: 430, height: 932, mobile: true },
  { name: "desk", width: 1280, height: 800, mobile: false },
];
const VPS = process.env.VPS ? ALL_VPS.filter((v) => process.env.VPS.split(",").includes(v.name)) : ALL_VPS;
const LANGS = (process.env.LANGS || "ar,en").split(",");
const SHOTS = process.env.SHOTS !== "0";
const ONLY = process.env.ONLY ? new RegExp(process.env.ONLY) : null;   // record only matching states
await mkdir(OUT, { recursive: true });

const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json" };
const server = createServer(async (req, res) => {
  const f = resolve(ROOT, req.url === "/" ? "index.html" : "." + req.url.split("?")[0]);
  try { const b = await readFile(f); res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(PORT, r));
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome", args: ["--no-sandbox"] });

/* geometry checks, evaluated in the page */
const inspect = () => {
  const frame = document.querySelector("[data-phone]");
  if (!frame) return { error: "no frame" };
  const fr = frame.getBoundingClientRect();
  const scr = document.querySelector("[data-screen]");
  const out = { overX: 0, cut: [], rail: [], peek: [], clip: [], trunc: [], small: [], broken: 0, drawn: 0, photos: 0 };
  out.overX = Math.max(document.documentElement.scrollWidth - window.innerWidth, scr ? scr.scrollWidth - scr.clientWidth : 0, 0);
  const shown = (el) => { for (let a = el; a && a !== frame; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05) return false; } return true; };
  const clipOf = (el) => {
    let l = fr.left, r = fr.right, t = fr.top, b = fr.bottom, rail = null;
    for (let a = el.parentElement; a && a !== frame; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (/(hidden|clip|auto|scroll)/.test(cs.overflowX)) { const bb = a.getBoundingClientRect(); l = Math.max(l, bb.left); r = Math.min(r, bb.right); if (!rail && a.classList.contains("rail")) rail = a; }
      if (/(hidden|clip|auto|scroll)/.test(cs.overflowY)) { const bb = a.getBoundingClientRect(); t = Math.max(t, bb.top); b = Math.min(b, bb.bottom); }
    }
    return { l, r, t, b, rail };
  };
  const tw = document.createTreeWalker(frame, NodeFilter.SHOW_TEXT);
  const seen = new Set(); let n;
  while ((n = tw.nextNode())) {
    const s = n.textContent.replace(/\s+/g, " ").trim(); if (!s) continue;
    const el = n.parentElement; if (!el || seen.has(el)) continue; seen.add(el);
    if (el.closest("svg") || el.closest("[aria-hidden='true']") || el.closest("style")) continue;
    if (!shown(el)) continue;
    const range = document.createRange(); range.selectNodeContents(n);
    const rs = [...range.getClientRects()].filter((x) => x.width > 0.5); if (!rs.length) continue;
    const L = Math.min(...rs.map((x) => x.left)), R = Math.max(...rs.map((x) => x.right));
    const T = Math.min(...rs.map((x) => x.top)), B = Math.max(...rs.map((x) => x.bottom));
    const c = clipOf(el);
    if (B <= c.t + 1 || T >= c.b - 1) continue;           /* scrolled out of view vertically */
    const partial = (L < c.l - 1 && R > c.l + 1) || (R > c.r + 1 && L < c.r - 1);
    if (partial) {
      const msg = `"${s.slice(0, 28)}" [${Math.round(L)}–${Math.round(R)} vs ${Math.round(c.l)}–${Math.round(c.r)}]`;
      /* inside a rail, text whose visible part lies within an active edge fade is an intentional peek */
      const fade = c.rail && c.rail.getAttribute("data-fade");
      const visL = Math.max(L, c.l), visR = Math.min(R, c.r);
      /* the fade width is set per rail from the actual peek (useRailFades) */
      const fw = fade ? Math.max(parseFloat(getComputedStyle(c.rail).getPropertyValue("--fade-end")) || 44, parseFloat(getComputedStyle(c.rail).getPropertyValue("--fade-start")) || 28) + 2 : 0;
      const inFade = fade && ((visR - c.l <= fw && L < c.l) || (c.r - visL <= fw && R > c.r));
      if (c.rail) (inFade ? out.peek : out.rail).push(msg); else out.cut.push(msg);
    }
    const cs = getComputedStyle(el);
    const clamped = /clamp/.test(typeof el.className === "string" ? el.className : "");
    if (el.scrollWidth > el.clientWidth + 1 && /(hidden|clip)/.test(cs.overflowX) && cs.textOverflow !== "ellipsis" && !clamped) out.clip.push(`"${s.slice(0, 28)}" ${el.scrollWidth}>${el.clientWidth}`);
    if ((clamped || cs.textOverflow === "ellipsis") && (el.scrollHeight > el.clientHeight + 2 || el.scrollWidth > el.clientWidth + 1)) out.trunc.push(s.slice(0, 40));
  }
  frame.querySelectorAll("button, a, input, textarea, select, [role='button']").forEach((b) => {
    const rc = b.getBoundingClientRect(); if (!rc.width || !rc.height) return;
    if (rc.bottom < fr.top || rc.top > fr.bottom || !shown(b)) return;
    const extended = b.classList.contains("tap") || b.classList.contains("pin");
    if (!extended && ((rc.width < 44 && rc.height < 44) || Math.min(rc.width, rc.height) < 20)) out.small.push(`${Math.round(rc.width)}×${Math.round(rc.height)} ${(b.getAttribute("aria-label") || b.innerText || "").trim().slice(0, 16)}`);
  });
  out.broken = [...frame.querySelectorAll("img")].filter((i) => i.complete && i.naturalWidth === 0).length;
  frame.querySelectorAll("[data-media]").forEach((m) => { const rc = m.getBoundingClientRect(); if (rc.bottom < fr.top || rc.top > fr.bottom || !rc.width) return; if (m.dataset.media === "drawn") out.drawn++; else out.photos++; });
  return out;
};

const report = [];
const errors = [];
for (const lang of LANGS) {
  for (const vp of VPS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.mobile ? 2 : 1, isMobile: vp.mobile, hasTouch: vp.mobile });
    const page = await ctx.newPage();
    page.setDefaultTimeout(6000);
    page.on("pageerror", (e) => errors.push(`${vp.name}/${lang}: pageerror ${e.message}`));
    page.on("console", (m) => { if (m.type() === "error" && !/fonts\.g|ERR_|net::|Failed to load resource/.test(m.text())) errors.push(`${vp.name}/${lang}: console ${m.text()}`); });
    const W = (ms) => page.waitForTimeout(ms);
    const T = (ar, en) => (lang === "ar" ? ar : en);
    const record = async (state) => {
      await W(260);
      const r = await page.evaluate(inspect);
      report.push({ vp: vp.name, lang, state, ...r });
      if (SHOTS) await page.screenshot({ path: `${OUT}/${vp.name}-${lang}-${state}.png` });
    };
    const scrollTo = async (frac) => { await page.evaluate((f) => { const s = document.querySelector("[data-screen]"); if (s) s.scrollTop = f === "end" ? s.scrollHeight : Math.round((s.scrollHeight - s.clientHeight) * f); }, frac); await W(250); };
    const tab = async (id) => {
      for (let i = 0; i < 10; i++) {
        const nav = page.locator(`[data-nav="${id}"]`);
        if (await nav.count() && await nav.first().isVisible().catch(() => false)) { await nav.first().click(); await W(450); return; }
        let moved = false;
        for (const l of [T("إغلاق", "Close"), T("رجوع", "Back")]) {
          const b = page.getByLabel(l, { exact: true });
          if (await b.count() && await b.first().isVisible().catch(() => false)) { await b.first().click(); await W(260); moved = true; break; }
        }
        if (!moved) { await page.keyboard.press("Escape").catch(() => {}); await W(200); }
      }
      throw new Error("cannot reach tab " + id);
    };
    const openObject = async (arName, enName) => {
      await tab("home");
      await page.getByText(T("ابحث عن مكان أو تجربة أو مجتمع", "Search for a place, an experience or a community"), { exact: false }).first().click(); await W(300);
      await page.keyboard.type(T(arName, enName)); await W(700);
      /* the first result row whose own text is exactly the name (search ranks the object
         itself above rows that only mention it) */
      await page.locator("[data-screen] button").filter({ has: page.getByText(T(arName, enName), { exact: true }) }).first().click(); await W(650);
    };
    const step = async (state, fn) => {
      if (ONLY && !ONLY.test(state)) return;
      try { await fn(); await record(state); } catch (e) { errors.push(`${vp.name}/${lang}/${state}: ${e.message.split("\n")[0]}`); }
    };

    await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" }); await W(700);
    await step("01-landing", async () => {});
    await step("02-language", async () => { await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click(); await W(600); });
    await page.locator(`[data-lang="${lang}"]`).click(); await W(1000);
    await step("03-home", async () => {});
    await step("03-home-b", async () => scrollTo(0.33));
    await step("03-home-c", async () => scrollTo(0.66));
    await step("03-home-d", async () => scrollTo("end"));
    await step("04-discover", async () => { await tab("discover"); });
    await step("04-discover-b", async () => scrollTo(0.5));
    await step("04-discover-filters", async () => { await scrollTo(0); await page.getByLabel(T("مرشّحات", "Filters"), { exact: true }).first().click(); await W(450); });
    await step("04-discover-map", async () => { await page.keyboard.press("Escape"); await W(300); await tab("discover"); await page.getByLabel(T("الخريطة", "Map"), { exact: true }).first().click(); await W(500); });
    await step("05-search-empty", async () => { await tab("home"); await page.getByText(T("ابحث عن مكان أو تجربة أو مجتمع", "Search for a place, an experience or a community"), { exact: false }).first().click(); await W(400); });
    await step("05-search-results", async () => { await page.keyboard.type(T("مقهى", "cafe")); await W(700); });
    await step("05-search-none", async () => { await page.keyboard.press("Control+A"); await page.keyboard.type("zzqqxx"); await W(600); });
    const objects = [
      ["06-place", "حي حراء الثقافي", "Hira Cultural District"],
      ["06-restaurant", "سفرة العوالي", "Sufrat Al-Awali"],
      ["06-cafe", "قهوة الحارة", "Qahwat Al-Harah"],
      ["06-experience", "ورشة فخار — أول قطعة", "Pottery workshop — your first piece"],
      ["06-event", "حملة تبرع بالدم", "Blood donation drive"],
      ["06-market", "سوق العتيبية", "Al-Otaibiyah Market"],
      ["06-offer", "عرض العشاء العائلي", "Family dinner offer"],
      ["06-stay", "إقامة أجياد — قريب من الحرم", "Ajyad stay — close to the Haram"],
    ];
    for (const [state, ar, en] of objects) {
      await step(state, async () => openObject(ar, en));
      await step(state + "-b", async () => scrollTo(0.5));
      await step(state + "-c", async () => scrollTo("end"));
    }
    await step("07-sources", async () => { await openObject("متحف برج الساعة", "Clock Tower Museum"); await page.getByText(T("اعرض المصادر المتعارضة", "Show the conflicting sources"), { exact: true }).first().click(); await W(500); });
    await step("08-community", async () => { await tab("community"); });
    await step("08-community-b", async () => scrollTo(0.5));
    await step("08-community-c", async () => scrollTo("end"));
    await step("08-community-all", async () => { await scrollTo(0); await page.getByText(T("كل المجتمعات", "All communities"), { exact: true }).first().click(); await W(450); });
    await step("08-community-browse", async () => { await page.getByText(T("تصفّح", "Browse"), { exact: true }).first().click(); await W(450); });
    await step("09-family", async () => { await tab("community"); await page.getByText(T("الأحياء", "Neighbourhoods"), { exact: true }).first().click(); await W(500); });
    await step("09-community-detail", async () => { await page.getByText(T("مجتمع العوالي", "Awali community"), { exact: true }).first().click(); await W(500); });
    await step("09-community-detail-b", async () => scrollTo(0.6));
    await step("09-thread", async () => { await tab("community"); await page.getByText(/صار فيه سوق مسائي|There's a new evening market/).first().click(); await W(500); });
    await step("09-clubs", async () => {
      await tab("home");
      await page.getByText(T("ابحث عن مكان أو تجربة أو مجتمع", "Search for a place, an experience or a community"), { exact: false }).first().click(); await W(300);
      await page.keyboard.type(T("المشي والرياضة", "Walking and sport")); await W(700);
      await page.locator("[data-screen] button").filter({ has: page.getByText(T("المشي والرياضة", "Walking and sport"), { exact: true }) }).first().click(); await W(500);
      await scrollTo("end");
    });
    /* the club row sits in the community's clubs list, after the activity rail */
    await step("09-club", async () => { await page.getByText(T("نادي مشي مكة", "Makkah Walking Club"), { exact: true }).last().click(); await W(500); });
    await step("09-club-b", async () => scrollTo("end"));
    await step("10-plan-empty", async () => { await tab("plan"); });
    await step("10-plan-items", async () => {
      await openObject("ورشة خط للمبتدئين — الجمعة", "Calligraphy for beginners — Friday");
      await page.getByText(T("انضم — سأحضر", "Join — I'm going"), { exact: true }).click(); await W(450);
      await openObject("سفرة العوالي", "Sufrat Al-Awali");
      await page.getByText(T("أضف لخطتي", "Add to my plan"), { exact: true }).first().click().catch(() => {}); await W(450);
      await openObject("معرض الوحي", "The Revelation Exhibition");
      await page.getByText(T("احجز", "Book"), { exact: true }).click(); await W(400);
      await page.getByText(T(/تابع إلى/, /Continue to/)).first().click(); await W(500);
      await tab("plan");
    });
    await step("10-plan-items-b", async () => scrollTo("end"));
    await step("10-plan-active", async () => { await scrollTo(0); await page.getByText(T("ابدأ الآن", "Start now"), { exact: true }).first().click(); await W(500); await tab("plan"); });
    await step("10-plan-complete-sheet", async () => { await page.getByText(T("أكملت هذا", "You completed this"), { exact: true }).first().click(); await W(600); });
    await step("10-plan-completed", async () => { await page.getByText(T("لاحقًا", "Later"), { exact: true }).first().click().catch(() => {}); await W(400); await tab("plan"); await scrollTo("end"); });
    await step("11-profile", async () => { await tab("home"); await page.getByLabel(T("حسابي", "Profile"), { exact: true }).first().click(); await W(500); });
    await step("11-profile-b", async () => scrollTo(0.5));
    await step("11-profile-c", async () => scrollTo("end"));
    await step("11-home-visitor", async () => { await scrollTo(0); await page.getByText(T("زائر", "Visitor"), { exact: true }).first().click(); await W(400); await tab("home"); });
    await step("11-home-visitor-b", async () => scrollTo(0.4));
    await step("11-profile-resident", async () => { await tab("home"); await page.getByLabel(T("حسابي", "Profile"), { exact: true }).first().click(); await W(400); await page.getByText(T("مقيم", "Resident"), { exact: true }).first().click(); await W(400); });
    await step("12-notifications", async () => { await tab("home"); await page.getByLabel(T("الإشعارات", "Notifications"), { exact: true }).first().click(); await W(500); });
    await step("13-provider", async () => { await tab("home"); await page.getByLabel(T("حسابي", "Profile"), { exact: true }).first().click(); await W(400); await scrollTo("end"); await page.getByText(T("أدوات مقدّم التجربة", "Host tools"), { exact: true }).first().click(); await W(500); });
    for (const [st, ar, en] of [["13-provider-participants", "المشاركون", "Participants"], ["13-provider-questions", "الأسئلة", "Questions"], ["13-provider-signals", "الإشارات", "Signals"]]) {
      await step(st, async () => { await page.getByText(T(ar, en), { exact: true }).first().click(); await W(450); });
    }
    await step("13-provider-publish", async () => { await page.getByText(T("محتواي", "My content"), { exact: true }).first().click(); await W(300); await page.getByText(T("انشر نشاطًا أو عرضًا", "Publish an activity or offer"), { exact: true }).first().click(); await W(500); });
    await step("14-dismiss-sheet", async () => { await tab("home"); const x = page.getByLabel(T("إخفاء", "Hide"), { exact: true }).first(); await x.scrollIntoViewIfNeeded(); await W(250); await x.click(); await W(450); });
    await ctx.close();
  }
}

await writeFile(process.env.JSON || `${OUT}/report.json`, JSON.stringify({ report, errors }, null, 1));
const sum = (k) => report.reduce((a, r) => a + (Array.isArray(r[k]) ? r[k].length : r[k] || 0), 0);
console.log(`states: ${report.length} | overflowX>1: ${report.filter((r) => r.overX > 1).length} | frame-cut text: ${sum("cut")} | rail-cut text: ${sum("rail")} | faded peeks: ${sum("peek")} | self-clipped: ${sum("clip")} | truncated: ${sum("trunc")} | small targets: ${sum("small")} | broken images: ${sum("broken")} | drawn media: ${sum("drawn")} | photos: ${sum("photos")} | errors: ${errors.length}`);
await browser.close(); server.close();
