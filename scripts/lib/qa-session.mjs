/* QA scripts reach the app the way a person does: landing → language → sign in.
   They sign in to a seeded account on the local Firebase-compatible test server
   (resident of Al-Awali), so every journey runs as a real authenticated user. */
import { startFirebaseTestServer, useTestConfig } from "./firebase-test-server.mjs";

let server = null, seq = 0;
export const QA_PROFILE = { firstName: "نورة", lastName: "الغامدي", age: 32, nationality: "SA", mode: "resident", nb: "awali", lang: "ar" };

/* call before page.goto(): points config.js at the test server, seeds an account, and
   starts every page load signed out so scripts always begin at the landing screen */
export async function prepareQaAccount(page, profile = QA_PROFILE) {
  server = server || (await startFirebaseTestServer());
  const email = `qa${++seq}.${Date.now()}@example.com`, password = "qa-makkah-2026";
  await server.seedUser({ email, password, emailVerified: true, profile });
  await useTestConfig(page, server.config);
  await page.addInitScript(() => { try { localStorage.removeItem("eyemakkah.session.v1"); } catch { /* storage unavailable */ } });
  page.__qa = { email, password };
  return page.__qa;
}

/* on the login screen: sign in and wait for Home */
export async function signInQa(page) {
  const { email, password } = page.__qa;
  await page.locator("[data-auth-email]").waitFor({ timeout: 10000 });
  await page.locator("[data-auth-email]").fill(email);
  await page.locator("[data-auth-password]").fill(password);
  await page.locator("[data-auth-submit]").click();
  await page.locator("[data-home-greeting]").waitFor({ timeout: 10000 });
  await page.waitForTimeout(400);
}

export async function closeQaServer() { if (server) { await server.close(); server = null; } }
