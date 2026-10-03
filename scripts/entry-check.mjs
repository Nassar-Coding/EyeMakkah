/* Entry flow: Landing → Language → Login → Create account → method → Profile setup → Home,
   in Arabic and English, against the local Firebase-compatible test server. */
import { mkdir } from "node:fs/promises";
import { launchBrowser, serveBuild, outDir } from "./lib/browser.mjs";
import { startFirebaseTestServer, useTestConfig } from "./lib/firebase-test-server.mjs";

const shots = outDir("entry");
await mkdir(shots, { recursive: true });
const site = await serveBuild();
const fb = await startFirebaseTestServer();
const browser = await launchBrowser();
const results = [];
const errs = [];

for (const langId of ["ar", "en"]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page.on("console", (m) => { if (m.type() === "error") { const t = m.text(); if (!/fonts\.googleapis|ERR_|net::|Failed to load resource/.test(t)) errs.push(t); } });
  page.on("pageerror", (e) => errs.push("pageerror: " + e.message));
  await useTestConfig(page, fb.config);
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto(site.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  const txt = () => page.evaluate(() => document.querySelector(".em")?.innerText || "");
  const shell = () => page.locator("[data-screen]").count();

  const t1 = await txt();
  results.push(["landing shows first", /EyeMakkah/.test(t1) && /(ابدأ|Enter EyeMakkah)/.test(t1) && (await shell()) === 0]);
  results.push(["landing carries no prototype label", !/(نموذج أولي|Prototype)/.test(t1)]);
  if (langId === "ar") await page.screenshot({ path: `${shots}/01-landing.png` });
  await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
  await page.waitForTimeout(500);
  const t2 = await txt();
  results.push(["language screen second", /اختر لغتك/.test(t2) && /English/.test(t2) && (await shell()) === 0]);

  await page.locator(`[data-lang="${langId}"]`).click();
  await page.locator('[data-auth-screen="login"]').waitFor();
  await page.waitForTimeout(400);
  const loginText = await txt();
  results.push([`${langId}: language leads to login`, langId === "ar" ? /تسجيل الدخول/.test(loginText) : /Sign in/.test(loginText)]);
  results.push([`${langId}: no app shell behind login`, (await shell()) === 0]);
  results.push([`${langId}: login direction`, (await page.locator("[data-auth-screen] section").getAttribute("dir")) === (langId === "ar" ? "rtl" : "ltr")]);
  results.push([`${langId}: login offers email, mobile, Apple, Google`, (await page.locator("[data-auth-email]").count()) === 1 && (await page.locator("[data-auth-method]").count()) === 3]);
  results.push([`${langId}: no Nafath`, !/نفاذ|Nafath/i.test(loginText)]);

  await page.locator("[data-create-account]").click();
  await page.waitForTimeout(400);
  const createText = await txt();
  results.push([`${langId}: four signup methods`, (await page.locator("[data-signup-method]").count()) === 4 && !/نفاذ|Nafath/i.test(createText)]);
  await page.screenshot({ path: `${shots}/03-create-${langId}.png` });

  await page.locator('[data-signup-method="email"]').click();
  await page.waitForTimeout(350);
  results.push([`${langId}: email method asks for email and password`, (await page.locator("[data-signup-email], [data-signup-password], [data-signup-confirm]").count()) === 3]);
  await page.locator("[data-signup-email]").fill(`entry.${langId}.${Date.now()}@example.com`);
  await page.locator("[data-signup-password]").fill("makkah2026");
  await page.locator("[data-signup-confirm]").fill("makkah2026");
  await page.locator("[data-signup-submit]").click();
  await page.locator('[data-auth-screen="profile-setup"]').waitFor();
  const formText = await page.locator("[data-profile-form]").innerText();
  results.push([`${langId}: profile setup has only the basic fields`, (await page.locator("[data-profile-first-name], [data-profile-last-name], [data-profile-age], [data-profile-nationality]").count()) === 4 && (await page.locator("[data-profile-mode]").count()) === 2]);
  const prohibited = (langId === "ar" ? ["نفاذ", "الهوية الوطنية", "رقم الهوية", "جواز السفر", "الجنس", "الحالة الاجتماعية", "جهة العمل", "الوظيفة"] : ["Nafath", "National ID", "Passport", "Gender", "Marital status", "Employment"]);
  const lines = new Set(formText.split("\n").map((x) => x.trim()));
  results.push([`${langId}: no prohibited identity fields`, prohibited.every((l) => !lines.has(l))]);
  results.push([`${langId}: no language question repeated`, (await page.locator("[data-lang]").count()) === 0]);

  const first = langId === "ar" ? "سارة" : "Sara";
  await page.locator("[data-profile-first-name]").fill(first);
  await page.locator("[data-profile-last-name]").fill(langId === "ar" ? "الحربي" : "Alharbi");
  await page.locator("[data-profile-age]").fill("29");
  await page.locator("[data-profile-nationality]").selectOption("SA");
  await page.locator('[data-profile-mode="resident"]').click();
  await page.locator("[data-profile-submit]").click();
  await page.waitForTimeout(200);
  results.push([`${langId}: resident area is required`, (await page.locator('[data-field-error="profile-nb"]').count()) === 1]);
  await page.locator('[data-profile-mode="visitor"]').click();
  results.push([`${langId}: visitor area is optional`, (await page.locator('[data-field-error="profile-nb"]').count()) === 0]);
  await page.locator('[data-profile-mode="resident"]').click();
  await page.locator("[data-profile-area]").selectOption("awali");
  await page.screenshot({ path: `${shots}/04-profile-${langId}.png` });
  await page.locator("[data-profile-submit]").click();
  await page.locator("[data-home-greeting]").waitFor();
  await page.waitForTimeout(500);
  results.push([`${langId}: account creation enters Home`, (await page.locator("[data-home-greeting]").innerText()).includes(first)]);
  results.push([`${langId}: four primary tabs unchanged`, (await page.locator("[data-nav]").count()) === 4]);
  await page.locator("[data-profile-entry]").first().click();
  await page.waitForTimeout(400);
  results.push([`${langId}: first name available in account`, (await page.locator("[data-account-first-name]").textContent()) === first]);
  await page.screenshot({ path: `${shots}/05-account-${langId}.png` });
  await page.close();
}

console.log("\n──────── entry flow ────────");
results.forEach(([n, ok]) => console.log(`${ok ? "✓" : "✗"} ${n}`));
if (errs.length) { console.log("errors:"); errs.slice(0, 8).forEach((e) => console.log("  ! " + e)); }
const failed = results.filter((r) => !r[1]).length;
console.log(`${results.length - failed}/${results.length} checks passed · ${errs.length} runtime errors`);
await browser.close(); await site.close(); await fb.close();
process.exit(failed || errs.length ? 1 : 0);
