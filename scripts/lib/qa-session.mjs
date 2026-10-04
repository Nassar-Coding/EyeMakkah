/* QA scripts reach the app the way a person does: landing → language → sign in.
   With the build as shipped (on-device accounts) the first sign-in in a browser
   profile creates the QA account through the real sign-up screens (resident of
   Al-Awali); later page loads in that profile sign in to it. */
let seq = 0;
export const QA_PROFILE = { firstName: "نورة", lastName: "الغامدي", age: "32", nationality: "SA", mode: "resident", nb: "awali" };

/* call before page.goto(): every page load starts signed out, so scripts always
   begin at the landing screen; the account itself persists in the browser profile */
export async function prepareQaAccount(page) {
  page.__qa = { email: `qa${++seq}.${Date.now()}@example.com`, password: "qa-makkah-2026", created: false };
  await page.addInitScript(() => { try { localStorage.removeItem("eyemakkah.session.v1"); } catch { /* storage unavailable */ } });
  return page.__qa;
}

/* on the login screen: sign in (creating the account the first time) and wait for Home */
export async function signInQa(page) {
  const qa = page.__qa;
  await page.locator("[data-auth-email]").waitFor({ timeout: 10000 });
  if (!qa.created) {
    await page.locator("[data-create-account]").click();
    await page.locator('[data-signup-method="email"]').click();
    await page.locator("[data-signup-email]").fill(qa.email);
    await page.locator("[data-signup-password]").fill(qa.password);
    await page.locator("[data-signup-confirm]").fill(qa.password);
    await page.locator("[data-signup-submit]").click();
    await page.locator('[data-auth-screen="profile-setup"]').waitFor({ timeout: 10000 });
    const p = QA_PROFILE;
    await page.locator("#profile-firstName").fill(p.firstName);
    await page.locator("#profile-lastName").fill(p.lastName);
    await page.locator("#profile-age").fill(p.age);
    await page.locator("#profile-nationality").selectOption(p.nationality);
    await page.locator(`[data-profile-mode="${p.mode}"]`).click();
    await page.locator("#profile-nb").selectOption(p.nb);
    await page.locator("[data-profile-submit]").click();
    qa.created = true;
  } else {
    await page.locator("[data-auth-email]").fill(qa.email);
    await page.locator("[data-auth-password]").fill(qa.password);
    await page.locator("[data-auth-submit]").click();
  }
  await page.locator("[data-home-greeting]").waitFor({ timeout: 10000 });
  /* account emails delivered to the device would sit over the top of the screen */
  for (const b of await page.locator("[data-device-message] button[aria-label]").all()) await b.click().catch(() => {});
  await page.waitForTimeout(400);
}

export async function closeQaServer() { /* nothing to close: accounts live on the device */ }
