/* End-to-end checks for sign-in, sign-up, recovery, the account and sign-out, in
   Arabic and English, against the local Firebase-compatible test server
   (scripts/lib/firebase-test-server.mjs). Also checks the deployed configuration
   (no Firebase settings): no method may sign anyone in.
   Usage: node scripts/auth-check.mjs   (LANGS=ar,en  OUT=<dir for screenshots>) */
import { mkdirSync } from "node:fs";
import { launchBrowser, serveBuild, outDir } from "./lib/browser.mjs";
import { startFirebaseTestServer, useTestConfig } from "./lib/firebase-test-server.mjs";

const LANGS = (process.env.LANGS || "ar,en").split(",");
const OUT = outDir("auth");
mkdirSync(OUT, { recursive: true });
const site = await serveBuild();
const fb = await startFirebaseTestServer();
const browser = await launchBrowser();
let pass = 0, fail = 0;
const runtime = [];
const ok = (name, cond, detail = "") => { if (cond) { pass++; console.log(`✓ ${name}`); } else { fail++; console.log(`✗ ${name}${detail ? " — " + detail : ""}`); } };

/* stubs for the provider scripts: Google Identity Services and Sign in with Apple JS */
const GOOGLE_STUB = `window.google = { accounts: { oauth2: { initTokenClient: (o) => ({ requestAccessToken: () => setTimeout(() => o.callback({ access_token: window.__googleToken || "google-ok-sara@example.com" }), 30) }) } } };`;
const APPLE_STUB = `window.AppleID = { auth: { init: (o) => { window.__appleInit = o; }, signIn: async () => ({ authorization: { id_token: window.__appleToken || "apple-ok-omar@example.com" }, user: { name: { firstName: "Omar", lastName: "Saleh" } } }) } };`;

async function newPage({ configured = true, lang = "ar", providers = false } = {}) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on("pageerror", (e) => runtime.push(e.message));
  page.on("console", (m) => { if (m.type() === "error" && !/Failed to load resource|ERR_|net::/.test(m.text())) runtime.push(m.text()); });
  /* records every frame where the app shell exists while an entry screen is mounted */
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
  if (configured) await useTestConfig(page, { ...fb.config, ...(providers ? { googleWebClientId: "test-google-client", appleServiceId: "test.apple.service", appleRedirectUri: "https://example.test/auth" } : {}) });
  else await page.route(/\/config\.js(\?.*)?$/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: "window.EYEMAKKAH_CONFIG = { auth: {} };" }));
  await page.route("https://accounts.google.com/gsi/client", (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: GOOGLE_STUB }));
  await page.route(/appleid\.cdn-apple\.com\/.*appleid\.auth\.js/, (r) => r.fulfill({ status: 200, contentType: "text/javascript", body: APPLE_STUB }));
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  /* a distinct provider identity per language run, so each run signs up a new person */
  await page.addInitScript((l) => { window.__googleToken = `google-ok-sara.${l}@example.com`; window.__appleToken = `apple-ok-omar.${l}@example.com`; }, lang);
  page.lang = lang;
  return page;
}
const W = (page, ms = 350) => page.waitForTimeout(ms);
const screenName = (page) => page.locator("[data-auth-screen]").first().getAttribute("data-auth-screen").catch(() => null);
const banner = (page, tone = "error") => page.locator(`[data-auth-banner="${tone}"]`).first().innerText().catch(() => "");
const fieldErr = (page, id) => page.locator(`[data-field-error="${id}"]`).count();
const shot = (page, name) => page.screenshot({ path: `${OUT}/${page.lang}-${name}.png` });
async function toLogin(page) {
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
async function onHome(page) {
  await page.locator("[data-home-greeting]").waitFor({ timeout: 8000 });
  return true;
}
const shellText = (page) => page.locator("[data-screen]").innerText().catch(() => "");
async function askAssistant(page, q) {
  await page.getByRole("button", { name: /^(اسأل|Ask)$/ }).first().click();
  await page.locator("form input").fill(q);
  await page.locator("form button[type=submit]").click();
  await W(page, 900);
  const msgs = await page.locator("[data-screen]").innerText();
  await page.getByLabel(/^(رجوع|Back)$/).first().click();
  await W(page, 300);
  return msgs;
}
const arabic = (s) => /[؀-ۿ]/.test(s);

for (const lang of LANGS) {
  console.log(`\n── ${lang} ──`);
  const en = lang === "en";
  const email = `user.${lang}.${Date.now()}@example.com`;
  const password = "makkah2026";

  /* 1 — deployed configuration: nothing signs in, guest browsing is honest about location */
  {
    const page = await newPage({ configured: false, lang });
    await toLogin(page);
    ok(`${lang}: no app shell under landing → language → login`, (await page.evaluate(() => window.__shellFrames)) === 0);
    ok(`${lang}: login direction`, (await page.locator("[data-auth-screen] section").getAttribute("dir")) === (en ? "ltr" : "rtl"));
    if (en) ok("en: login copy has no Arabic", !arabic(await page.locator("[data-auth-screen] section").innerText()));
    await page.locator("[data-auth-email]").fill("someone@example.com");
    await page.locator("[data-auth-password]").fill("whatever123");
    await page.locator("[data-auth-submit]").click(); await W(page, 400);
    ok(`${lang}: unconfigured email sign-in is refused`, (await screenName(page)) === "login" && /(غير متاحة|isn't available)/.test(await banner(page)));
    for (const m of ["apple", "google"]) {
      await page.locator(`[data-auth-method="${m}"]`).click(); await W(page, 300);
      ok(`${lang}: unconfigured ${m} does not sign in`, (await screenName(page)) === "login" && /(غير متاحة|isn't available)/.test(await banner(page)));
    }
    await page.locator('[data-auth-method="mobile"]').click(); await W(page);
    await page.locator("[data-phone-number]").fill("501234567");
    await page.locator("[data-phone-submit]").click(); await W(page, 400);
    ok(`${lang}: unconfigured mobile sends nothing`, (await screenName(page)) === "phone" && /(غير متاحة|isn't available)/.test(await banner(page)));
    await page.locator("[data-auth-back]").click(); await W(page);
    await page.locator("[data-auth-forgot]").click(); await W(page);
    await page.locator("[data-forgot-email]").fill("someone@example.com");
    await page.locator("[data-forgot-submit]").click(); await W(page, 400);
    ok(`${lang}: unconfigured recovery does not claim an email was sent`, (await screenName(page)) === "forgot" && /(غير متاحة|isn't available)/.test(await banner(page)));
    await page.locator("[data-auth-back]").click(); await W(page);
    await page.locator("[data-auth-guest]").click(); await W(page, 700);
    ok(`${lang}: guest reaches Home`, await onHome(page));
    const home = await shellText(page);
    ok(`${lang}: guest Home asks for an area instead of assuming one`, (await page.locator("[data-set-area]").count()) === 1 && !/(العوالي|Al-Awali) —/.test(home.split("\n").slice(0, 3).join(" ")));
    ok(`${lang}: no distance or near-you claims without an area`, !/(قريب منك|near you|كم من|km from)/i.test(home));
    const reply = await askAssistant(page, en ? "what's nearby with an offer?" : "وش فيه قريب وعليه عرض؟");
    ok(`${lang}: Assistant says it doesn't know the area`, /(ما أعرف حيّك|don't know your neighbourhood)/.test(reply) && !/(كم من|km from|قريب من منطقتك|Close to your area)/.test(reply));
    await page.locator("[data-profile-entry]").click(); await W(page);
    ok(`${lang}: guest account offers sign-in`, (await page.locator("[data-account-guest]").count()) === 1);
    await shot(page, "guest-account");
    await page.locator("[data-account-signin]").click(); await W(page, 500);
    ok(`${lang}: guest → sign in opens login without the shell`, (await screenName(page)) === "login" && (await page.locator("[data-screen]").count()) === 0);
    await page.context().close();
  }

  /* 2 — email sign-up, validation, profile, personalisation */
  const page = await newPage({ lang });
  await toLogin(page);
  await shot(page, "01-login");
  await page.locator("[data-create-account]").click(); await W(page);
  ok(`${lang}: create account lists four methods`, (await page.locator("[data-signup-method]").count()) === 4);
  await shot(page, "02-create");
  await page.locator("[data-auth-back]").click(); await W(page);
  ok(`${lang}: create account → back → login`, (await screenName(page)) === "login");
  await page.locator("[data-create-account]").click(); await W(page);
  await page.locator('[data-signup-method="email"]').click(); await W(page);
  await page.locator("[data-signup-submit]").click(); await W(page, 200);
  ok(`${lang}: empty sign-up shows field errors`, (await fieldErr(page, "signup-email-field")) === 1 && (await fieldErr(page, "signup-password")) === 1 && (await fieldErr(page, "signup-confirm")) === 1);
  await page.locator("[data-signup-email]").fill("not-an-email");
  await page.locator("[data-signup-password]").fill("short");
  await page.locator("[data-signup-confirm]").fill("other");
  await page.locator("[data-signup-submit]").click(); await W(page, 200);
  ok(`${lang}: invalid email / weak password / mismatch rejected`, (await fieldErr(page, "signup-email-field")) === 1 && (await fieldErr(page, "signup-password")) === 1 && (await fieldErr(page, "signup-confirm")) === 1);
  await page.locator("[data-signup-email]").fill(email);
  await page.locator("[data-signup-password]").fill(password);
  await page.locator("[data-signup-confirm]").fill(password);
  await shot(page, "03-signup-email");
  const before = (await fb.state()).users.length;
  await page.locator("[data-signup-submit]").dblclick();
  await page.locator('[data-auth-screen="profile-setup"]').waitFor();
  ok(`${lang}: double tap creates exactly one account`, (await fb.state()).users.length === before + 1);
  ok(`${lang}: verification email requested`, (await fb.state()).oob.some((o) => o.type === "VERIFY_EMAIL" && o.email === email));
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: empty profile shows every required error`, (await page.locator("[data-field-error]").count()) >= 5);
  await fillProfile(page, { first: "   ", last: "x1", age: "999" });
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: blank / invalid names and out-of-range age rejected`, (await fieldErr(page, "profile-firstName")) === 1 && (await fieldErr(page, "profile-lastName")) === 1 && (await fieldErr(page, "profile-age")) === 1);
  await fillProfile(page, { age: "9" });
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: age below minimum rejected`, (await fieldErr(page, "profile-age")) === 1);
  ok(`${lang}: nationality is a list, not free text`, (await page.locator("#profile-nationality").evaluate((e) => e.tagName)) === "SELECT" && (await page.locator("#profile-nationality option").count()) > 190);
  await fillProfile(page, { first: en ? "Sara" : "سارة", last: en ? "Al-Harbi" : "الحربي", age: "29", nat: "EG", mode: "resident" });
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: resident needs a neighbourhood`, (await fieldErr(page, "profile-nb")) === 1);
  await fillProfile(page, { nb: "aziziyah" });
  await shot(page, "04-profile-setup");
  await page.locator("[data-profile-submit]").click();
  ok(`${lang}: account created → Home`, await onHome(page));
  await W(page, 400);
  ok(`${lang}: Home greets by first name`, (await page.locator("[data-home-greeting]").innerText()).includes(en ? "Sara" : "سارة"));
  ok(`${lang}: Home uses the chosen neighbourhood`, /(العزيزية|Al-Aziziyah)/.test((await shellText(page)).split("\n").slice(0, 4).join(" ")));
  ok(`${lang}: no app shell before authentication`, (await page.evaluate(() => window.__overlap)) === 0);
  await shot(page, "05-home");
  const near = await askAssistant(page, en ? "what's nearby?" : "وش فيه قريب؟");
  ok(`${lang}: Assistant measures from the chosen area`, /(العزيزية|Al-Aziziyah)/.test(near) && !/(ما أعرف حيّك|don't know your neighbourhood)/.test(near));
  ok(`${lang}: profile saved to the account store`, Object.values((await fb.state()).docs).some((d) => d.fields.firstName.stringValue === (en ? "Sara" : "سارة") && d.fields.nb.stringValue === "aziziyah" && d.fields.lang.stringValue === lang));

  /* 3 — account screen and editing */
  await page.locator("[data-profile-entry]").click(); await W(page);
  const acct = await page.locator("[data-account-card]").innerText();
  ok(`${lang}: account shows name, age, nationality, mode, area, language`,
    acct.includes(en ? "Sara" : "سارة") && acct.includes(en ? "Al-Harbi" : "الحربي") && /(٢٩|29)/.test(acct) && /(مصر|Egypt)/.test(acct) && /(مقيم في مكة|Makkah resident)/.test(acct) && /(العزيزية|Al-Aziziyah)/.test(acct) && /(العربية|English)/.test(acct));
  ok(`${lang}: unverified email is shown with a resend action`, (await page.locator("[data-account-resend]").count()) === 1);
  await shot(page, "06-account");
  await page.locator("[data-account-edit]").click(); await W(page);
  await fillProfile(page, { mode: "visitor", nb: "" }, "edit");
  await page.locator("#edit-age").fill("130");
  await page.locator("[data-profile-submit]").click(); await W(page, 200);
  ok(`${lang}: edit validates too`, (await fieldErr(page, "edit-age")) === 1);
  await page.locator("#edit-age").fill("31");
  await shot(page, "07-edit");
  await page.locator("[data-profile-submit]").click(); await W(page, 600);
  ok(`${lang}: edit saved → back on account`, (await page.locator("[data-account-card]").count()) === 1 && /(زائر لمكة|Makkah visitor)/.test(await page.locator("[data-account-mode]").innerText()) && /(غير محدد|Not specified)/.test(await page.locator("[data-account-area]").innerText()));
  ok(`${lang}: edit persisted to the account store`, Object.values((await fb.state()).docs).some((d) => d.fields.mode.stringValue === "visitor" && "nullValue" in d.fields.nb && d.fields.age.integerValue === "31"));

  /* 4 — sign out, failed and successful sign-in, session restore */
  await page.locator("[data-account-signout]").click(); await W(page);
  await page.locator("[data-confirm-signout]").click(); await W(page, 500);
  ok(`${lang}: sign out → login with notice, no shell`, (await screenName(page)) === "login" && (await page.locator("[data-screen]").count()) === 0 && /(سجّلت الخروج|signed out)/.test(await banner(page, "success")));
  ok(`${lang}: sign out clears the stored session`, (await page.evaluate(() => localStorage.getItem("eyemakkah.session.v1"))) === null);
  await page.locator("[data-auth-email]").fill(email);
  await page.locator("[data-auth-password]").fill("wrong-pass1");
  await page.locator("[data-auth-submit]").click(); await W(page, 500);
  ok(`${lang}: wrong password refused with a clear message`, (await screenName(page)) === "login" && /(غير صحيحة|incorrect)/.test(await banner(page)));
  await page.locator("[data-auth-password]").fill(password);
  await page.locator("[data-auth-submit]").click();
  ok(`${lang}: correct password → Home (profile restored)`, await onHome(page));
  ok(`${lang}: restored profile drives Home`, (await page.locator("[data-home-greeting]").innerText()).includes(en ? "Sara" : "سارة") && (await page.locator("[data-set-area]").count()) === 1);
  await page.reload({ waitUntil: "domcontentloaded" });
  ok(`${lang}: relaunch restores the session straight to Home`, await onHome(page));
  ok(`${lang}: relaunch never shows the shell under an entry screen`, (await page.evaluate(() => window.__overlap)) === 0);

  /* 5 — password recovery */
  await page.locator("[data-profile-entry]").click(); await W(page);
  await page.locator("[data-account-signout]").click(); await page.locator("[data-confirm-signout]").click(); await W(page, 500);
  await page.locator("[data-auth-email]").fill(email);
  await page.locator("[data-auth-forgot]").click(); await W(page);
  ok(`${lang}: forgot password carries the email over`, (await page.locator("[data-forgot-email]").inputValue()) === email);
  await page.locator("[data-forgot-submit]").click(); await W(page, 500);
  ok(`${lang}: reset email requested and confirmed`, (await screenName(page)) === "reset-sent" && (await fb.state()).oob.some((o) => o.type === "PASSWORD_RESET" && o.email === email));
  await shot(page, "08-reset-sent");
  await page.locator("[data-reset-back]").click(); await W(page);
  ok(`${lang}: recovery → back to login`, (await screenName(page)) === "login" && (await page.locator("[data-auth-email]").inputValue()) === email);
  await page.locator("[data-auth-forgot]").click(); await W(page);
  await page.locator("[data-forgot-email]").fill(`nobody.${lang}@example.com`);
  await page.locator("[data-forgot-submit]").click(); await W(page, 500);
  ok(`${lang}: unknown email gets the same answer (no account enumeration)`, (await screenName(page)) === "reset-sent");
  await page.locator("[data-reset-back]").click(); await W(page);

  /* 6 — existing email on sign-up */
  await page.locator("[data-create-account]").click(); await page.locator('[data-signup-method="email"]').click(); await W(page);
  await page.locator("[data-signup-email]").fill(email);
  await page.locator("[data-signup-password]").fill("another123");
  await page.locator("[data-signup-confirm]").fill("another123");
  await page.locator("[data-signup-submit]").click(); await W(page, 500);
  ok(`${lang}: existing email is refused`, (await screenName(page)) === "signup-email" && /(يوجد حساب|already exists)/.test(await banner(page)));
  await page.getByText(en ? "Sign in with this email" : "تسجيل الدخول بهذا البريد").click(); await W(page);
  ok(`${lang}: → sign in with that email`, (await screenName(page)) === "login" && (await page.locator("[data-auth-email]").inputValue()) === email);

  /* 7 — delete account */
  await page.locator("[data-auth-password]").fill(password);
  await page.locator("[data-auth-submit]").click(); await onHome(page);
  await page.locator("[data-profile-entry]").click(); await W(page);
  await page.locator("[data-account-delete]").click(); await W(page);
  await page.locator("[data-confirm-delete]").click(); await W(page, 700);
  ok(`${lang}: delete account → login with notice`, (await screenName(page)) === "login" && /(حُذف حسابك|deleted)/.test(await banner(page, "success")));
  ok(`${lang}: account and profile removed`, !(await fb.state()).users.some((u) => u.email === email));
  await page.context().close();

  /* 8 — mobile number with a verification code */
  {
    const p = await newPage({ lang });
    await toLogin(p);
    await p.locator("[data-create-account]").click(); await p.locator('[data-signup-method="mobile"]').click(); await W(p);
    await p.locator("[data-phone-number]").fill("123");
    await p.locator("[data-phone-submit]").click(); await W(p, 200);
    ok(`${lang}: invalid mobile number rejected`, (await fieldErr(p, "phone-number")) === 1);
    const local = lang === "ar" ? "٠٥٠٤٤٤٣٣٢٢" : "0504443323";   // one new number per language run
    await p.locator("[data-phone-number]").fill(local);
    await shot(p, "09-phone");
    await p.locator("[data-phone-submit]").click();
    await p.locator('[data-auth-screen="otp"]').waitFor();
    const { code, phone } = await fb.phoneCode();
    ok(`${lang}: code sent to the E.164 number`, phone === (lang === "ar" ? "+966504443322" : "+966504443323"));
    await p.locator("[data-otp-code]").fill(code === "111111" ? "222222" : "111111");
    await p.locator("[data-otp-submit]").click(); await W(p, 400);
    ok(`${lang}: wrong code refused`, (await screenName(p)) === "otp" && /(غير صحيح|incorrect)/.test(await banner(p)));
    ok(`${lang}: resend is rate-limited`, /(بعد|in \d+s)/.test(await p.locator("[data-otp-resend]").innerText()));
    await shot(p, "10-otp");
    await p.locator("[data-auth-back]").click(); await W(p);
    ok(`${lang}: code → back → number`, (await screenName(p)) === "phone");
    await p.locator("[data-phone-submit]").click();
    await p.locator('[data-auth-screen="otp"]').waitFor();
    await p.locator("[data-otp-code]").fill((await fb.phoneCode()).code);
    await p.locator("[data-otp-submit]").click();
    await p.locator('[data-auth-screen="profile-setup"]').waitFor();
    ok(`${lang}: verified new number → profile setup`, true);
    await fillProfile(p, { first: en ? "Khalid" : "خالد", last: en ? "Omar" : "عمر", age: "40", nat: "PK", mode: "visitor" });
    await p.locator("[data-profile-submit]").click();
    ok(`${lang}: visitor without an area → Home`, await onHome(p));
    await p.locator("[data-profile-entry]").click(); await W(p);
    ok(`${lang}: account shows the mobile sign-in`, /\+96650444332[23]/.test(await p.locator("[data-account-card]").innerText()));
    await p.context().close();
  }

  /* 9 — Google and Apple (provider scripts stubbed; token exchange is real against the test server) */
  {
    const p = await newPage({ lang, providers: true });
    await toLogin(p);
    await p.locator('[data-auth-method="google"]').click();
    await p.locator('[data-auth-screen="profile-setup"]').waitFor();
    ok(`${lang}: Google sign-in → profile setup with the name prefilled`, (await p.locator("#profile-firstName").inputValue()) === "Sara" && (await p.locator("#profile-lastName").inputValue()) === "Ahmed");
    await p.locator("[data-auth-back]").click(); await W(p, 500);
    ok(`${lang}: leaving profile setup signs out`, (await screenName(p)) === "login" && (await p.evaluate(() => localStorage.getItem("eyemakkah.session.v1"))) === null);
    await p.locator("[data-create-account]").click(); await W(p);
    await p.locator('[data-signup-method="apple"]').click();
    await p.locator('[data-auth-screen="profile-setup"]').waitFor();
    ok(`${lang}: Apple sign-up uses a hashed nonce and prefills the name`,
      /^[0-9a-f]{64}$/.test(await p.evaluate(() => window.__appleInit && window.__appleInit.nonce)) && (await p.locator("#profile-firstName").inputValue()) === "Omar");
    await fillProfile(p, { age: "35", nat: "SA", mode: "resident", nb: "awali" });
    await p.locator("[data-profile-submit]").click();
    ok(`${lang}: Apple account → Home`, await onHome(p));
    await p.context().close();
  }
}

console.log(`\n${pass}/${pass + fail} checks passed · ${runtime.length} runtime errors`);
if (runtime.length) console.log(runtime.slice(0, 8));
console.log(`screenshots: ${OUT}`);
await browser.close(); await site.close(); await fb.close();
process.exit(fail || runtime.length ? 1 : 0);
