/* Entry flow check: cover → language → login/create-account → profile setup → transformed app, in both languages. */
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFile, mkdir } from "node:fs/promises";
import { extname, resolve } from "node:path";
const root = process.env.ROOT || "/home/user/EyeMakkah/dist";
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };
const server = createServer(async (req, res) => {
  const f = resolve(root, req.url === "/" ? "index.html" : "." + req.url.split("?")[0]);
  try { const b = await readFile(f); res.writeHead(200, { "Content-Type": MIME[extname(f)] || "text/plain" }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
});
await new Promise((r) => server.listen(4510, r));
const launch = { args: ["--no-sandbox"] };
if (process.env.CHROMIUM_PATH) launch.executablePath = process.env.CHROMIUM_PATH;
const browser = await chromium.launch(launch);
const shots = process.env.OUT || "/tmp/eyemakkah-entry";
await mkdir(shots, { recursive: true });
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
  results.push(["language screen second", /اختر لغتك/.test(t2) && /English/.test(t2)]);
  if (langId === "ar") await page.screenshot({ path: `${shots}/02-language.png` });

  await page.locator(`[data-lang="${langId}"]`).click();
  await page.waitForTimeout(800);
  const loginText = await txt();
  const loginDir = await page.evaluate(() => document.querySelector(".em").getAttribute("dir"));
  results.push([`${langId}: language leads to login`, langId === "ar" ? /تسجيل الدخول/.test(loginText) : /Sign in/.test(loginText)]);
  results.push([`${langId}: login direction`, loginDir === (langId === "ar" ? "rtl" : "ltr")]);
  results.push([`${langId}: login methods unchanged`, await page.locator("[data-auth-method]").count() === 3]);
  results.push([`${langId}: no Nafath`, !/نفاذ|Nafath/i.test(loginText)]);

  await page.locator("[data-create-account]").click();
  await page.waitForTimeout(450);
  const createText = await txt();
  results.push([`${langId}: create account opens`, langId === "ar" ? /إنشاء حساب/.test(createText) : /Create account/.test(createText)]);
  results.push([`${langId}: four signup methods`, await page.locator("[data-signup-method]").count() === 4]);
  results.push([`${langId}: create account has no Nafath`, !/نفاذ|Nafath/i.test(createText)]);
  await page.screenshot({ path: `${shots}/03-create-${langId}.png` });

  const method = langId === "ar" ? "email" : "mobile";
  await page.locator(`[data-signup-method="${method}"]`).click();
  await page.waitForTimeout(450);
  const profileText = await txt();
  const profileDir = await page.evaluate(() => document.querySelector(".em").getAttribute("dir"));
  results.push([`${langId}: profile setup opens`, langId === "ar" ? /أكمل بياناتك/.test(profileText) : /Complete your profile/.test(profileText)]);
  results.push([`${langId}: profile direction`, profileDir === (langId === "ar" ? "rtl" : "ltr")]);
  results.push([`${langId}: only requested basic fields`, await page.locator("[data-profile-first-name], [data-profile-last-name], [data-profile-age], [data-profile-nationality], [data-profile-area]").count() === 4]);
  results.push([`${langId}: resident and visitor choices`, await page.locator("[data-profile-mode]").count() === 2]);
  results.push([`${langId}: no language question repeated`, await page.locator("[data-lang]").count() === 0]);
  const prohibited = langId === "ar"
    ? /نفاذ|الهوية الوطنية|رقم الهوية|جواز السفر|الجنس|الحالة الاجتماعية|جهة العمل|الوظيفة|الاهتمامات|التفضيلات/
    : /Nafath|National ID|Passport|Gender|Marital status|Employment|Interests|Preferences/i;
  results.push([`${langId}: no prohibited identity fields`, !prohibited.test(profileText)]);

  const first = langId === "ar" ? "سارة" : "Sara";
  await page.locator("[data-profile-first-name]").fill(first);
  await page.locator("[data-profile-last-name]").fill(langId === "ar" ? "الحربي" : "Alharbi");
  await page.locator("[data-profile-age]").fill("29");
  await page.locator("[data-profile-nationality]").fill(langId === "ar" ? "سعودية" : "Saudi");
  await page.locator('[data-profile-mode="visitor"]').click();
  results.push([`${langId}: visitor area is optional`, await page.locator("[data-profile-submit]").isEnabled()]);
  await page.locator('[data-profile-mode="resident"]').click();
  results.push([`${langId}: resident area is required`, !(await page.locator("[data-profile-submit]").isEnabled())]);
  await page.locator("[data-profile-area]").selectOption("awali");
  results.push([`${langId}: resident CTA becomes available after area`, await page.locator("[data-profile-submit]").isEnabled()]);
  await page.screenshot({ path: `${shots}/04-profile-${langId}.png` });

  await page.locator("[data-profile-submit]").click();
  await page.waitForTimeout(900);
  const homeText = await txt();
  results.push([`${langId}: account creation enters Home`, !/(أكمل بياناتك|Complete your profile)/.test(homeText)]);
  results.push([`${langId}: four primary tabs unchanged`, await page.locator("[data-nav]").count() === 4]);

  const profileButton = page.locator("[data-profile-entry]").first();
  await profileButton.click();
  await page.waitForTimeout(450);
  results.push([`${langId}: first name available in account`, (await page.locator("[data-profile-first-name-display]").textContent()) === first]);
  await page.screenshot({ path: `${shots}/05-account-${langId}.png` });
  await page.close();
}

console.log("\n──────── entry flow ────────");
results.forEach(([n, ok]) => console.log(`${ok ? "✓" : "✗"} ${n}`));
if (errs.length) { console.log("errors:"); errs.slice(0, 8).forEach((e) => console.log("  ! " + e)); }
const failed = results.filter((r) => !r[1]).length;
console.log(`${results.length - failed}/${results.length} checks passed · ${errs.length} runtime errors`);
await browser.close(); server.close();
process.exit(failed || errs.length ? 1 : 0);
