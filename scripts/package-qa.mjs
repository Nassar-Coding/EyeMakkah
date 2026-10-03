/* QA of the drag-and-drop package exactly as shipped (its own config.js): it boots,
   shows Landing → Language → Login in both languages, refuses sign-in while no
   account service is configured, and browsing without an account works.
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
  await page.waitForTimeout(400);
  results.push([`${lang}: shipped config signs nobody in`, (await page.locator("[data-screen]").count()) === 0 && (await page.locator('[data-auth-banner="error"]').count()) === 1]);
  await page.locator("[data-auth-guest]").click();
  await page.locator("[data-home-greeting]").waitFor();
  await page.waitForTimeout(800);
  const imgs = await page.evaluate(() => { const a = [...document.querySelectorAll("img")]; return { n: a.length, broken: a.filter((i) => i.complete && i.naturalWidth === 0).length }; });
  results.push([`${lang}: browsing without an account works`, (await page.locator("[data-nav]").count()) === 4 && imgs.n > 0 && imgs.broken === 0, `imgs=${imgs.n} broken=${imgs.broken}`]);
  await page.close();
}
results.forEach(([n, ok, d]) => console.log(`${ok ? "✓" : "✗"} ${n}${!ok && d ? " — " + d : ""}`));
console.log("errors:", errs.length, errs.slice(0, 5));
await browser.close(); await site.close();
process.exit(results.some((r) => !r[1]) || errs.length ? 1 : 0);
