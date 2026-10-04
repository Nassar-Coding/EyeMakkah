/* QA of the drag-and-drop package exactly as shipped (its own, empty config.js):
   it boots, shows Landing → Language → Login in both languages, refuses unknown
   credentials, and a new account can be created and used with no external service.
   ROOT=<unzipped package folder> (default: release/EyeMakkah_Vercel_DragDrop) */
import { existsSync } from "node:fs";
import { join } from "node:path";
import { launchBrowser, serveBuild, REPO } from "./lib/browser.mjs";

const root = process.env.ROOT || join(REPO, "release", "EyeMakkah_Vercel_DragDrop");
const files = ["index.html", "app.js", "config.js", "vercel.json", "robots.txt", "README.md", "PHOTO_SOURCES.md", "manifest.json", "BUILD_INFO.txt"];
const missing = files.filter((f) => !existsSync(join(root, f)));
const site = await serveBuild(root);
const browser = await launchBrowser();
const errs = [];
const results = [["package has every file", missing.length === 0, missing.join(", ")]];
for (const lang of ["ar", "en"]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  page.on("pageerror", (e) => errs.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/fonts\.googleapis|ERR_|net::|Failed to load resource/.test(m.text())) errs.push(m.text()); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto(site.url, { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  results.push([`${lang}: landing first`, /(ابدأ|Enter EyeMakkah)/.test(await page.locator(".em").innerText())]);
  await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
  await page.locator(`[data-lang="${lang}"]`).click();
  await page.locator('[data-auth-screen="login"]').waitFor();
  results.push([`${lang}: login direction`, (await page.locator("[data-auth-screen] section").getAttribute("dir")) === (lang === "ar" ? "rtl" : "ltr")]);
  await page.locator("[data-auth-email]").fill("someone@example.com");
  await page.locator("[data-auth-password]").fill("password123");
  await page.locator("[data-auth-submit]").click();
  await page.waitForTimeout(500);
  results.push([`${lang}: unknown credentials refused`, (await page.locator("[data-screen]").count()) === 0 && (await page.locator('[data-auth-banner="error"]').count()) === 1]);
  results.push([`${lang}: no guest entry`, (await page.locator("[data-auth-guest]").count()) === 0]);
  await page.locator("[data-create-account]").click();
  await page.locator('[data-signup-method="email"]').click();
  await page.locator("[data-signup-email]").fill(`pkg.${lang}@example.com`);
  await page.locator("[data-signup-password]").fill("makkah2026");
  await page.locator("[data-signup-confirm]").fill("makkah2026");
  await page.locator("[data-signup-submit]").click();
  await page.locator('[data-auth-screen="profile-setup"]').waitFor();
  await page.locator("#profile-firstName").fill(lang === "ar" ? "سارة" : "Sara");
  await page.locator("#profile-lastName").fill(lang === "ar" ? "الحربي" : "Alharbi");
  await page.locator("#profile-age").fill("30");
  await page.locator("#profile-nationality").selectOption("SA");
  await page.locator('[data-profile-mode="visitor"]').click();
  await page.locator("[data-profile-submit]").click();
  await page.locator("[data-home-greeting]").waitFor();
  await page.waitForTimeout(800);
  results.push([`${lang}: new account works with zero external configuration`, (await page.locator("[data-nav]").count()) === 4]);
  await page.locator('[data-nav="plan"]').click();
  await page.waitForTimeout(500);
  results.push([`${lang}: My Plan starts with a recommended plan`, (await page.locator("[data-starter-plan]").count()) === 1]);
  await page.locator('[data-nav="home"]').click();
  await page.waitForTimeout(500);
  const imgs = await page.evaluate(() => { const a = [...document.querySelectorAll("img")]; return { n: a.length, broken: a.filter((i) => i.complete && i.naturalWidth === 0).length }; });
  results.push([`${lang}: photos load`, (await page.locator("[data-nav]").count()) === 4 && imgs.n > 0 && imgs.broken === 0, `imgs=${imgs.n} broken=${imgs.broken}`]);
  await page.close();
}
results.forEach(([n, ok, d]) => console.log(`${ok ? "✓" : "✗"} ${n}${!ok && d ? " — " + d : ""}`));
console.log("errors:", errs.length, errs.slice(0, 5));
await browser.close(); await site.close();
process.exit(results.some((r) => !r[1]) || errs.length ? 1 : 0);
