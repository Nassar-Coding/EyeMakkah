/* End-to-end checks for accounts, in Arabic and English, with the build exactly as
   shipped (empty config.js → the on-device account service): every sign-in method,
   recovery, validation, profile, the starter My Plan, persistence across sign-out,
   sign-in and relaunch, account management, no guest bypass, no Home flash, no
   fake proximity. A final section runs the same email flow through the Firebase
   adapter against scripts/lib/firebase-test-server.mjs.
   Usage: node scripts/auth-check.mjs   (LANGS=ar,en  OUT=<dir for screenshots>) */
import { mkdirSync } from "node:fs";
import { launchBrowser, serveBuild, outDir } from "./lib/browser.mjs";
import { startFirebaseTestServer, useTestConfig } from "./lib/firebase-test-server.mjs";

const LANGS = (process.env.LANGS || "ar,en").split(",");
const OUT = outDir("auth");
mkdirSync(OUT, { recursive: true });
const site = await serveBuild();
const browser = await launchBrowser();
let pass = 0, fail = 0;
const runtime = [];
const ok = (name, cond, detail = "") => { if (cond) { pass++; console.log(`✓ ${name}`); } else { fail++; console.log(`✗ ${name}${detail ? " — " + detail : ""}`); } };

async function newContext() {
  return browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
}
async function newPage(context, lang, firebase) {
  const page = await context.newPage();
  page.on("pageerror", (e) => runtime.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_|net::/.test(m.text())) runtime.push(m.text()); });
  /* counts frames where the app shell exists while an entry screen is mounted, and
     frames where the shell exists at all before anyone signed in */
  await page.addInitScript(() => {
    window.__overlap = 0; window.__shellFrames = 0;
    const tick = () => {
      const shell = document.querySelector("[data-screen]"), entry = document.querySelector("[data-entry]");
      if (shell && entry) window.__overlap++;
      if (shell) window.__shellFrames++;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  if (firebase) await useTestConfig(page, firebase.config);
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  page.lang = lang;
  return page;
}
const W = (page, ms = 350) => page.waitForTimeout(ms);
const screenName = (page) => page.locator("[data-auth-screen]").first().getAttribute("data-auth-screen").catch(() => null);
const banner = (page, tone = "error") => page.locator(`[data-auth-banner="${tone}"]`).first().innerText().catch(() => "");
const fieldErr = (page, id) => page.locator(`[data-field-error="${id}"]`).count();
const shot = (page, name) => page.screenshot({ path: `${OUT}/${page.lang}-${name}.png` });
const clearMessages = async (page) => { for (const b of await page.locator("[data-device-message] button[aria-label]").all()) await b.click().catch(() => {}); };
async function start(page) {
  await page.goto(site.url, { waitUntil: "domcontentloaded" });
  await page.getByText(/^(ابدأ|Enter EyeMakkah)$/).first().click();
  await page.locator(`[data-lang="${page.lang}"]`).click();
  await page.locator('[data-auth-screen="login"]').waitFor();
  await W(page, 450);
}
async function fillProfile(page, p, prefix = "profile") {
  if (p.first != null) await page.locator(`#${prefix}-firstName`).fill(p.first);
  if (p.last != null) await page.locator(`#${prefix}-lastName`).fill(p.last);
  if (p.age != null) await page.locator(`#${prefix}-age`).fill(p.age);
  if (p.nat != null) await page.locator(`#${prefix}-nationality`).selectOption(p.nat);
  if (p.mode) await page.locator(`[data-profile-mode="${p.mode}"]`).first().click();
  if (p.nb != null) await page.locator(`#${prefix}-nb`).selectOption(p.nb);
}
const onHome = async (page) => { await page.locator("[data-home-greeting]").waitFor({ timeout: 8000 }); await W(page, 300); return true; };
const shellText = (page) => page.locator("[data-screen]").innerText().catch(() => "");
async function planIds(page) {
  await page.locator('[data-nav="plan"]').click(); await W(page, 400);
  const ids = await page.evaluate(() => { const uid = JSON.parse(localStorage.getItem("eyemakkah.session.v1") || "{}").uid; const r = JSON.parse(localStorage.getItem(`eyemakkah.plan.v1.${uid}`) || "null"); return r ? r.plan.map((p) => `${p.obj}:${p.state}:${p.source || ""}`) : null; });
  return ids;
}
async function signOut(page) {
  await page.locator('[data-nav="home"]').click().catch(() => {}); await W(page, 250);
  await page.locator("[data-profile-entry]").click(); await W(page);
  await page.locator("[data-account-signout]").click(); await W(page);
  await page.locator("[data-confirm-signout]").click(); await page.locator('[data-auth-screen="login"]').waitFor(); await W(page, 300);
}
async function signInEmail(page, email, password) {
  await page.locator("[data-auth-email]").fill(email);
  await page.locator("[data-auth-password]").fill(password);
  await page.locator("[data-auth-submit]").click();
}
async function askAssistant(page, q) {
  await page.locator('[data-nav="home"]').click(); await W(page, 300);
  await page.getByRole("button", { name: /^(اسأل|Ask)$/ }).first().click();
  await page.locator("form input").fill(q);
  await page.locator("form button[type=submit]").click();
  await W(page, 900);
  const msgs = await page.locator("[data-screen]").innerText();
  await page.getByLabel(/^(رجوع|Back)$/).first().click(); await W(page, 300);
  return msgs;
}
const arabic = (s) => /[؀-ۿ]/.test(s);

for (const lang of LANGS) {
  console.log(`\n── ${lang} ──`);
  const en = lang === "en";
  const t = (a, e) => (en ? e : a);
  const email = `user.${lang}.${Date.now()}@example.com`;
  const password = "makkah2026";
  const ctx = await newContext();          // one browser profile: accounts persist across pages in it
  let page = await newPage(ctx, lang);

  /* entry: account-first, no shell, no guest route */
  await start(page);
  ok(`${lang}: no app shell under landing → language → login`, (await page.evaluate(() => window.__shellFrames)) === 0);
  ok(`${lang}: login direction`, (await page.locator("[data-auth-screen] section").getAttribute("dir")) === (en ? "ltr" : "rtl"));
  ok(`${lang}: no browse-without-account route`, (await page.locator("[data-auth-guest]").count()) === 0 && !/(تصفّح بدون حساب|without an account)/.test(await page.locator("[data-auth-screen]").innerText()));
  if (en) ok("en: login copy has no Arabic", !arabic(await page.locator("[data-auth-screen] section").innerText()));
  await page.locator("[data-auth-email]").fill(email);
  await page.locator("[data-auth-password]").fill(password);
  await page.locator("[data-auth-submit]").click(); await W(page, 500);
  ok(`${lang}: unknown credentials are refused`, (await screenName(page)) === "login" && /(غير صحيحة|incorrect)/.test(await banner(page)) && (await page.locator("[data-screen]").count()) === 0);
  await shot(page, "01-login");

  /* email sign-up with validation */
  await page.locator("[data-create-account]").click(); await W(page);
  ok(`${lang}: create account lists four methods`, (await page.locator("[data-signup-method]").count()) === 4);
  await page.locator('[data-signup-method="email"]').click(); await W(page);
  await page.locator("[data-signup-submit]").click(); await W(page, 200);
  ok(`${lang}: empty sign-up shows field errors`, (await fieldErr(page, "signup-email-field")) === 1 && (await fieldErr(page, "signup-password")) === 1 && (await fieldErr(page, "signup-confirm")) === 1);
  await page.locator("[data-signup-email]").fill("not-an-email");
  await page.locator("[data-signup-password]").fill("short");
  await page.locator("[data-signup-confirm]").fill("other");
  await page.locator("[data-signup-submit]").click(); await W(page, 200);
  ok(`${lang}: invalid email / weak password / mismatch rejected`, (await fieldErr(page, "signup-email-field")) === 1 && (await fieldErr(page, "signup-password")) === 1 && (await fieldErr(page, "signup-confirm")) === 1);
  await page.locator("[data-signup-password]").fill("onlyletters");
  await page.locator("[data-signup-submit]").click(); await W(page, 200);
  ok(`${lang}: password needs letters and numbers`, (await fieldErr(page, "signup-password")) === 1);
  await page.locator("[data-signup-email]").fill(email);
  await page.locator("[data-signup-password]").fill(password);
  await page.locator("[data-signup-confirm]").fill(password);
  await page.locator("[data-signup-submit]").dblclick();
  await page.locator('[data-auth-screen="profile-setup"]').waitFor();
  ok(`${lang}: double tap creates exactly one account`, (await page.evaluate(() => Object.keys(JSON.parse(localStorage.getItem("eyemakkah.accounts.v1")).users).length)) === 1);
  ok(`${lang}: password stored only as a salted hash`, await page.evaluate((pw) => { const u = Object.values(JSON.parse(localStorage.getItem("eyemakkah.accounts.v1")).users)[0]; return !JSON.stringify(u).includes(pw) && /^[0-9a-f]{64}$/.test(u.hash) && !!u.salt; }, password));
  ok(`${lang}: confirmation email delivered to the device`, (await page.locator('[data-device-message="mail"]').count()) === 1);
  await clearMessages(page);

  /* profile validation */
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: empty profile shows every required error`, (await page.locator("[data-field-error]").count()) >= 5);
  await fillProfile(page, { first: "   ", last: "x1", age: "999" });
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: blank / invalid names and age 999 rejected`, (await fieldErr(page, "profile-firstName")) === 1 && (await fieldErr(page, "profile-lastName")) === 1 && (await fieldErr(page, "profile-age")) === 1);
  await fillProfile(page, { age: "0" });
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: age 0 rejected`, (await fieldErr(page, "profile-age")) === 1);
  await page.locator("#profile-age").fill("");
  await page.locator("#profile-age").pressSequentially("-a2b");
  ok(`${lang}: age accepts digits only`, (await page.locator("#profile-age").inputValue()) === "2");
  await fillProfile(page, { age: "9" });
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: no invented minimum age (9 accepted)`, (await fieldErr(page, "profile-age")) === 0);
  ok(`${lang}: nationality is a list, not free text`, (await page.locator("#profile-nationality").evaluate((e) => e.tagName)) === "SELECT" && (await page.locator("#profile-nationality option").count()) > 190);
  await fillProfile(page, { first: t("سارة", "Sara"), last: t("الحربي", "Al-Harbi"), age: "29", nat: "EG", mode: "resident" });
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: resident needs a neighbourhood`, (await fieldErr(page, "profile-nb")) === 1);
  await fillProfile(page, { nb: "aziziyah" });
  await shot(page, "02-profile-setup");
  await page.locator("[data-profile-submit]").click();
  ok(`${lang}: account created → Home`, await onHome(page));
  ok(`${lang}: no app shell under any entry screen`, (await page.evaluate(() => window.__overlap)) === 0);
  ok(`${lang}: Home greets by first name and uses the chosen area`, (await page.locator("[data-home-greeting]").innerText()).includes(t("سارة", "Sara")) && /(العزيزية|Al-Aziziyah)/.test((await shellText(page)).split("\n").slice(0, 4).join(" ")));
  await shot(page, "03-home");

  /* starter plan */
  const starter = await planIds(page);
  ok(`${lang}: new account starts with a recommended plan`, starter && starter.length >= 3 && starter.every((x) => x.endsWith(":planned:starter")), JSON.stringify(starter));
  ok(`${lang}: starter plan is labelled «${t("خطة مقترحة لك", "Recommended for you")}»`, (await page.locator("[data-starter-plan]").innerText()).includes(t("خطة مقترحة لك", "Recommended for you")));
  ok(`${lang}: starter items are real inventory and not booked/joined`, !/(مؤكد|انتقلت لإكمال الحجز|سأحضر|Confirmed|Going)/.test(await page.locator("[data-screen]").innerText()));
  await shot(page, "04-plan");
  /* the person edits the plan: remove the first item */
  await page.getByText(t("أزل من خطتي", "Remove from my plan"), { exact: true }).first().click(); await W(page, 400);
  const edited = await planIds(page);
  ok(`${lang}: plan can be edited`, edited.length === starter.length - 1);

  /* account screen, email confirmation, change password */
  await page.locator('[data-nav="home"]').click(); await W(page, 250);
  await page.locator("[data-profile-entry]").click(); await W(page);
  const acct = await page.locator("[data-account-card]").innerText();
  ok(`${lang}: account shows name, age, nationality, mode, area, language`,
    acct.includes(t("سارة", "Sara")) && acct.includes(t("الحربي", "Al-Harbi")) && /(٢٩|29)/.test(acct) && /(مصر|Egypt)/.test(acct) && /(مقيم في مكة|Makkah resident)/.test(acct) && /(العزيزية|Al-Aziziyah)/.test(acct) && /(العربية|English)/.test(acct));
  await page.locator("[data-account-resend]").click(); await W(page, 300);
  await page.locator('[data-device-message-open="verify"]').click(); await W(page, 500);
  ok(`${lang}: email confirmed from the delivered link`, (await page.locator("[data-account-resend]").count()) === 0 && /(البريد مؤكَّد|Email confirmed)/.test(await page.locator("[data-account-card]").innerText()));
  await page.locator("[data-account-reset]").click(); await W(page);
  await page.locator("[data-pw-current]").fill("wrongpass1");
  await page.locator("[data-pw-new]").fill("newmakkah2027");
  await page.locator("[data-pw-confirm]").fill("newmakkah2027");
  await page.locator("[data-pw-submit]").click(); await W(page, 500);
  ok(`${lang}: change password checks the current password`, /(الحالية غير صحيحة|current password is incorrect)/.test(await banner(page)));
  await page.locator("[data-pw-current]").fill(password);
  await page.locator("[data-pw-submit]").click(); await W(page, 600);
  ok(`${lang}: password changed`, (await page.locator("[data-account-card]").count()) === 1);
  const password2 = "newmakkah2027";

  /* sign out → sign back in: same profile, same edited plan */
  await signOut(page);
  ok(`${lang}: sign out → login, session cleared, no shell`, (await page.locator("[data-screen]").count()) === 0 && (await page.evaluate(() => localStorage.getItem("eyemakkah.session.v1"))) === null && /(سجّلت الخروج|signed out)/.test(await banner(page, "success")));
  await signInEmail(page, email, password);
  await W(page, 500);
  ok(`${lang}: old password no longer works`, (await screenName(page)) === "login");
  await signInEmail(page, email, password2);
  ok(`${lang}: returning email sign-in → Home`, await onHome(page));
  ok(`${lang}: profile restored`, (await page.locator("[data-home-greeting]").innerText()).includes(t("سارة", "Sara")));
  ok(`${lang}: edited plan restored, not regenerated`, JSON.stringify(await planIds(page)) === JSON.stringify(edited));
  await page.reload({ waitUntil: "domcontentloaded" });
  ok(`${lang}: relaunch restores the session straight to Home`, await onHome(page));
  ok(`${lang}: relaunch never mounts the shell under an entry screen`, (await page.evaluate(() => window.__overlap)) === 0);

  /* existing account with no plan → starter once; emptied plan stays empty */
  await page.evaluate(() => { const uid = JSON.parse(localStorage.getItem("eyemakkah.session.v1")).uid; localStorage.removeItem(`eyemakkah.plan.v1.${uid}`); });
  await signOut(page);
  await signInEmail(page, email, password2); await onHome(page);
  const reseeded = await planIds(page);
  ok(`${lang}: existing account without a plan gets the starter plan`, reseeded.length >= 3 && reseeded.every((x) => x.endsWith(":starter")));
  for (let i = 0; i < reseeded.length; i++) { await page.getByText(t("أزل من خطتي", "Remove from my plan"), { exact: true }).first().click(); await W(page, 250); }
  await signOut(page);
  await signInEmail(page, email, password2); await onHome(page);
  ok(`${lang}: the starter plan is generated only once`, (await planIds(page)).length === 0);

  /* forgot password, delivered to the device */
  await signOut(page);
  await page.locator("[data-auth-email]").fill(email);
  await page.locator("[data-auth-forgot]").click(); await W(page);
  ok(`${lang}: forgot password carries the email over`, (await page.locator("[data-forgot-email]").inputValue()) === email);
  await page.locator("[data-forgot-submit]").click(); await W(page, 500);
  ok(`${lang}: "check your email" + reset email delivered`, (await screenName(page)) === "reset-sent" && (await page.locator('[data-device-message="mail"]').count()) === 1);
  await shot(page, "05-reset-sent");
  await page.locator('[data-device-message-open="reset"]').click(); await W(page, 500);
  ok(`${lang}: reset link opens set-new-password`, (await screenName(page)) === "reset-password");
  await page.locator("[data-reset-password]").fill("abc");
  await page.locator("[data-reset-confirm]").fill("abd");
  await page.locator("[data-reset-submit]").click(); await W(page, 200);
  ok(`${lang}: new password validated`, (await fieldErr(page, "reset-new")) === 1 && (await fieldErr(page, "reset-confirm")) === 1);
  const password3 = "reset2028makkah";
  await page.locator("[data-reset-password]").fill(password3);
  await page.locator("[data-reset-confirm]").fill(password3);
  await page.locator("[data-reset-submit]").click(); await W(page, 600);
  ok(`${lang}: reset → sign in with notice and the email filled in`, (await screenName(page)) === "login" && (await page.locator("[data-auth-email]").inputValue()) === email && (await banner(page, "success")).length > 0);
  await page.locator("[data-auth-password]").fill(password3);
  await page.locator("[data-auth-submit]").click();
  ok(`${lang}: sign in with the new password`, await onHome(page));
  await signOut(page);
  await page.locator("[data-auth-forgot]").click(); await W(page);
  await page.locator("[data-forgot-email]").fill(`nobody.${lang}@example.com`);
  await page.locator("[data-forgot-submit]").click(); await W(page, 500);
  ok(`${lang}: unknown email gets the same answer, nothing delivered`, (await screenName(page)) === "reset-sent" && (await page.locator('[data-device-message="mail"]').count()) === 0);
  await page.locator("[data-reset-back]").click(); await W(page);

  /* existing email on sign-up */
  await page.locator("[data-create-account]").click(); await page.locator('[data-signup-method="email"]').click(); await W(page);
  await page.locator("[data-signup-email]").fill(email.toUpperCase());
  await page.locator("[data-signup-password]").fill("another123");
  await page.locator("[data-signup-confirm]").fill("another123");
  await page.locator("[data-signup-submit]").click(); await W(page, 500);
  ok(`${lang}: existing email refused (case-insensitive)`, (await screenName(page)) === "signup-email" && /(يوجد حساب|already exists)/.test(await banner(page)));
  await page.locator("[data-auth-back]").click(); await W(page);
  await page.locator("[data-auth-back]").click(); await W(page);
  ok(`${lang}: back navigation signup → create → login`, (await screenName(page)) === "login");

  /* mobile: digits only, SMS code, wrong code, returning number */
  await page.locator('[data-auth-method="mobile"]').click(); await W(page);
  await page.locator("[data-phone-number]").pressSequentially("05ab-c");
  ok(`${lang}: phone field keeps digits only`, (await page.locator("[data-phone-number]").inputValue()) === "05");
  await page.locator("[data-phone-number]").fill("");
  await page.locator("[data-phone-number]").pressSequentially("١٢٣");
  await page.locator("[data-phone-submit]").click(); await W(page, 200);
  ok(`${lang}: Arabic digits normalised; invalid number rejected`, (await page.locator("[data-phone-number]").inputValue()) === "123" && (await fieldErr(page, "phone-number")) === 1);
  const number = en ? "0551234002" : "٠٥٥١٢٣٤٠٠١";
  await page.locator("[data-phone-number]").fill(number);
  await shot(page, "06-phone");
  await page.locator("[data-phone-submit]").click();
  await page.locator('[data-auth-screen="otp"]').waitFor(); await W(page, 300);
  const sms = await page.locator('[data-device-message="sms"]').innerText();
  const code = (sms.match(/\d{6}/) || [])[0];
  ok(`${lang}: SMS code delivered to the device`, !!code);
  await page.locator("[data-otp-code]").pressSequentially("12ab34");
  ok(`${lang}: OTP accepts digits only`, (await page.locator("[data-otp-code]").inputValue()) === "1234");
  await page.locator("[data-otp-submit]").click(); await W(page, 200);
  ok(`${lang}: short code rejected`, (await fieldErr(page, "otp-code")) === 1);
  await page.locator("[data-otp-code]").fill(code === "111111" ? "222222" : "111111");
  await page.locator("[data-otp-submit]").click(); await W(page, 400);
  ok(`${lang}: wrong code refused`, (await screenName(page)) === "otp" && /(غير صحيح|incorrect)/.test(await banner(page)));
  ok(`${lang}: resend is rate-limited`, /(بعد|in \d+s)/.test(await page.locator("[data-otp-resend]").innerText()));
  await shot(page, "07-otp");
  await page.locator('[data-device-message-open="otp"]').click(); await W(page, 200);
  ok(`${lang}: tapping the SMS fills the code`, (await page.locator("[data-otp-code]").inputValue()) === code);
  await page.locator("[data-otp-submit]").click();
  await page.locator('[data-auth-screen="profile-setup"]').waitFor();
  ok(`${lang}: new number → profile setup`, true);
  await fillProfile(page, { first: t("خالد", "Khalid"), last: t("عمر", "Omar"), age: "40", nat: "PK", mode: "visitor" });
  await page.locator("[data-profile-submit]").click();
  ok(`${lang}: visitor without an area → Home`, await onHome(page));
  const home = await shellText(page);
  ok(`${lang}: no area → Home asks for one, no distance or near-you claims`, (await page.locator("[data-set-area]").count()) === 1 && !/(قريب منك|near you|كم من|km from)/i.test(home));
  const reply = await askAssistant(page, en ? "what's nearby with an offer?" : "وش فيه قريب وعليه عرض؟");
  ok(`${lang}: Assistant says it doesn't know the area`, /(ما أعرف حيّك|don't know your neighbourhood)/.test(reply) && !/(كم من|km from|Close to your area)/.test(reply));
  const visitorPlan = await planIds(page);
  ok(`${lang}: visitor also starts with a recommended plan`, visitorPlan.length >= 3);
  await signOut(page);
  await page.locator('[data-auth-method="mobile"]').click(); await W(page);
  await page.locator("[data-phone-number]").fill(number);
  await page.locator("[data-phone-submit]").click();
  await page.locator('[data-auth-screen="otp"]').waitFor(); await W(page, 300);
  await page.locator('[data-device-message-open="otp"]').click();
  await page.locator("[data-otp-submit]").click();
  ok(`${lang}: returning mobile number → Home with the same plan`, (await onHome(page)) && JSON.stringify(await planIds(page)) === JSON.stringify(visitorPlan));
  await signOut(page);

  /* Google and Apple through the device's account chooser */
  for (const [kind, who] of [["google", { first: "Sara", last: "Ahmed", email: `sara.${lang}@gmail.com` }], ["apple", { first: "Omar", last: "Saleh", hide: true }]]) {
    await page.locator(`[data-auth-method="${kind}"]`).click(); await W(page);
    ok(`${lang}: ${kind} opens its account chooser`, (await page.locator(`[data-provider-sheet="${kind}"]`).count()) === 1);
    await page.locator("[data-provider-continue]").click(); await W(page, 200);
    ok(`${lang}: ${kind} requires a name${kind === "google" ? " and email" : ""}`, (await page.locator("[data-provider-sheet] [data-field-error]").count()) >= 1);
    await page.locator("[data-provider-first]").fill(who.first);
    await page.locator("[data-provider-last]").fill(who.last);
    if (who.hide) await page.locator('[data-apple-hide="true"]').click();
    else await page.locator("[data-provider-email]").fill(who.email);
    await shot(page, `08-${kind}`);
    await page.locator("[data-provider-continue]").click();
    await page.locator('[data-auth-screen="profile-setup"]').waitFor();
    ok(`${lang}: first-time ${kind} user → profile setup with the name prefilled`, (await page.locator("#profile-firstName").inputValue()) === who.first && (await page.locator("#profile-lastName").inputValue()) === who.last);
    await fillProfile(page, { age: "35", nat: "SA", mode: "resident", nb: "awali" });
    await page.locator("[data-profile-submit]").click();
    await onHome(page);
    const prov = await planIds(page);
    await signOut(page);
    await page.locator(`[data-auth-method="${kind}"]`).click(); await W(page);
    await page.locator("[data-provider-account]").first().click();
    ok(`${lang}: returning ${kind} user restores the account and plan`, (await onHome(page)) && (await page.locator("[data-home-greeting]").innerText()).includes(who.first) && JSON.stringify(await planIds(page)) === JSON.stringify(prov));
    await signOut(page);
  }
  /* provider email that already belongs to an email account */
  await page.locator('[data-auth-method="google"]').click(); await W(page);
  await page.locator("[data-provider-other]").click();
  await page.locator("[data-provider-first]").fill("Sara");
  await page.locator("[data-provider-email]").fill(email);
  await page.locator("[data-provider-continue]").click(); await W(page, 400);
  ok(`${lang}: provider can't take over an email account`, /(طريقة دخول أخرى|another sign-in method)/.test(await page.locator("[data-provider-sheet]").innerText()));
  await page.getByLabel(/^(إغلاق|Close)$/).first().click(); await W(page);

  /* delete account */
  await signInEmail(page, email, password3); await onHome(page);
  await page.locator("[data-profile-entry]").click(); await W(page);
  await page.locator("[data-account-delete]").click(); await W(page);
  await page.locator("[data-confirm-delete]").click(); await page.locator('[data-auth-screen="login"]').waitFor();
  ok(`${lang}: delete account → login with notice`, /(حُذف حسابك|deleted)/.test(await banner(page, "success")));
  await signInEmail(page, email, password3); await W(page, 500);
  ok(`${lang}: deleted account can't sign in and its data is gone`, (await screenName(page)) === "login" && (await page.evaluate((em) => !Object.values(JSON.parse(localStorage.getItem("eyemakkah.accounts.v1")).users).some((u) => u.email === em), email)));
  ok(`${lang}: no runtime errors so far`, runtime.length === 0, runtime.slice(0, 3).join(" | "));
  await ctx.close();
}

/* the same email flow through the Firebase adapter (configured) */
{
  console.log("\n── firebase adapter ──");
  const fb = await startFirebaseTestServer();
  const ctx = await newContext();
  const page = await newPage(ctx, "ar", fb);
  await start(page);
  await page.locator("[data-create-account]").click(); await page.locator('[data-signup-method="email"]').click();
  await page.locator("[data-signup-email]").fill("fb.user@example.com");
  await page.locator("[data-signup-password]").fill("makkah2026");
  await page.locator("[data-signup-confirm]").fill("makkah2026");
  await page.locator("[data-signup-submit]").click();
  await page.locator('[data-auth-screen="profile-setup"]').waitFor();
  ok("firebase: account created on the service", (await fb.state()).users.some((u) => u.email === "fb.user@example.com"));
  await fillProfile(page, { first: "ريم", last: "الشهري", age: "27", nat: "SA", mode: "resident", nb: "awali" });
  await page.locator("[data-profile-submit]").click(); await onHome(page);
  ok("firebase: profile stored in Firestore", Object.values((await fb.state()).docs).some((d) => d.fields.firstName.stringValue === "ريم"));
  const plan = await planIds(page);
  ok("firebase: starter plan created", plan.length >= 3);
  await signOut(page);
  await signInEmail(page, "fb.user@example.com", "makkah2026");
  ok("firebase: returning sign-in restores profile and plan", (await onHome(page)) && JSON.stringify(await planIds(page)) === JSON.stringify(plan));
  await ctx.close(); await fb.close();
}

console.log(`\n${pass}/${pass + fail} checks passed · ${runtime.length} runtime errors`);
if (runtime.length) console.log(runtime.slice(0, 8));
console.log(`screenshots: ${OUT}`);
await browser.close(); await site.close();
process.exit(fail || runtime.length ? 1 : 0);
