/* A local stand-in for the Firebase Auth emulator and the Firestore REST API, used
   only by the QA scripts. It answers the same REST contract the app calls in
   production (identitytoolkit v1, securetoken v1, Firestore v1 documents), so the
   app is configured against it exactly like the official emulators:
     window.EYEMAKKAH_CONFIG.auth = { firebaseApiKey, firebaseProjectId,
       authEmulatorHost: url, firestoreEmulatorHost: url, ... }
   Test-only helpers live under /__test/. Never deployed. */
import { createServer } from "node:http";
import { randomBytes } from "node:crypto";

export async function startFirebaseTestServer({ port = 0, apiKey = "test-api-key", projectId = "eyemakkah-test" } = {}) {
  const users = new Map();          // uid → user
  const ids = new Map();            // idToken → { uid, exp }
  const refresh = new Map();        // refreshToken → uid
  const phoneSessions = new Map();  // sessionInfo → { phone, code }
  const docs = new Map();           // uid → firestore document
  const oob = [];                   // emails sent
  const calls = [];                 // request log
  let seq = 0;
  const rid = () => randomBytes(10).toString("hex");
  const newUid = () => `u${++seq}${rid().slice(0, 6)}`;
  const issue = (u, extra = {}) => {
    const idToken = `idt.${u.uid}.${rid()}`, refreshToken = `rft.${rid()}`;
    ids.set(idToken, { uid: u.uid, exp: Date.now() + 3600e3 });
    refresh.set(refreshToken, u.uid);
    u.lastLoginAt = String(Date.now());
    return { kind: "identitytoolkit#VerifyPasswordResponse", localId: u.uid, email: u.email || undefined, displayName: u.displayName || "", idToken, refreshToken, expiresIn: "3600", ...extra };
  };
  const userByEmail = (e) => [...users.values()].find((u) => u.email && u.email.toLowerCase() === String(e).toLowerCase());
  const authUid = (tok) => { const t = ids.get(tok); return t && t.exp > Date.now() ? t.uid : null; };
  const fail = (res, code, message) => send(res, code, { error: { code, message, errors: [{ message, domain: "global", reason: "invalid" }] } });
  const send = (res, code, body) => {
    res.writeHead(code, { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" });
    res.end(JSON.stringify(body));
  };
  const userView = (u) => ({
    localId: u.uid, email: u.email, emailVerified: !!u.emailVerified, displayName: u.displayName, phoneNumber: u.phone,
    providerUserInfo: u.providers.map((p) => ({ providerId: p, federatedId: u.uid, email: u.email })), lastLoginAt: u.lastLoginAt, createdAt: u.createdAt,
  });

  const accounts = {
    signUp(b, res) {
      if (!b.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(b.email)) return fail(res, 400, "INVALID_EMAIL");
      if (!b.password || b.password.length < 6) return fail(res, 400, "WEAK_PASSWORD : Password should be at least 6 characters");
      if (userByEmail(b.email)) return fail(res, 400, "EMAIL_EXISTS");
      const u = { uid: newUid(), email: b.email, password: b.password, emailVerified: false, providers: ["password"], createdAt: String(Date.now()) };
      users.set(u.uid, u);
      send(res, 200, issue(u, { kind: "identitytoolkit#SignupNewUserResponse" }));
    },
    signInWithPassword(b, res) {
      const u = userByEmail(b.email);
      if (!u || u.password !== b.password) return fail(res, 400, "INVALID_LOGIN_CREDENTIALS");
      if (u.disabled) return fail(res, 400, "USER_DISABLED");
      send(res, 200, issue(u, { registered: true }));
    },
    sendOobCode(b, res) {
      if (b.requestType === "PASSWORD_RESET") {
        if (!userByEmail(b.email)) return fail(res, 400, "EMAIL_NOT_FOUND");
        oob.push({ type: "PASSWORD_RESET", email: b.email });
        return send(res, 200, { kind: "identitytoolkit#GetOobConfirmationCodeResponse", email: b.email });
      }
      if (b.requestType === "VERIFY_EMAIL") {
        const uid = authUid(b.idToken);
        if (!uid) return fail(res, 400, "INVALID_ID_TOKEN");
        oob.push({ type: "VERIFY_EMAIL", email: users.get(uid).email });
        return send(res, 200, { kind: "identitytoolkit#GetOobConfirmationCodeResponse", email: users.get(uid).email });
      }
      fail(res, 400, "INVALID_REQ_TYPE");
    },
    lookup(b, res) {
      const uid = authUid(b.idToken);
      if (!uid || !users.has(uid)) return fail(res, 400, "INVALID_ID_TOKEN");
      send(res, 200, { kind: "identitytoolkit#GetAccountInfoResponse", users: [userView(users.get(uid))] });
    },
    update(b, res) {
      const uid = authUid(b.idToken);
      if (!uid) return fail(res, 400, "INVALID_ID_TOKEN");
      const u = users.get(uid);
      if (b.displayName != null) u.displayName = b.displayName;
      send(res, 200, { localId: uid, email: u.email, displayName: u.displayName, providerUserInfo: userView(u).providerUserInfo });
    },
    delete(b, res) {
      const uid = authUid(b.idToken);
      if (!uid) return fail(res, 400, "INVALID_ID_TOKEN");
      users.delete(uid);
      send(res, 200, { kind: "identitytoolkit#DeleteAccountResponse" });
    },
    sendVerificationCode(b, res) {
      if (!b.phoneNumber || !/^\+[1-9]\d{6,14}$/.test(b.phoneNumber)) return fail(res, 400, "INVALID_PHONE_NUMBER : Invalid format.");
      const sessionInfo = `si.${rid()}`;
      const code = String(100000 + Math.floor(Math.random() * 899999));
      phoneSessions.set(sessionInfo, { phone: b.phoneNumber, code });
      send(res, 200, { sessionInfo });
    },
    signInWithPhoneNumber(b, res) {
      const s = phoneSessions.get(b.sessionInfo);
      if (!s) return fail(res, 400, "INVALID_SESSION_INFO");
      if (s.code !== b.code) return fail(res, 400, "INVALID_CODE");
      phoneSessions.delete(b.sessionInfo);
      let u = [...users.values()].find((x) => x.phone === s.phone), isNewUser = false;
      if (!u) { u = { uid: newUid(), phone: s.phone, providers: ["phone"], createdAt: String(Date.now()) }; users.set(u.uid, u); isNewUser = true; }
      send(res, 200, issue(u, { phoneNumber: s.phone, isNewUser }));
    },
    signInWithIdp(b, res) {
      const q = new URLSearchParams(b.postBody || "");
      const providerId = q.get("providerId");
      const tok = q.get("access_token") || q.get("id_token") || "";
      const m = /^(google|apple)-ok-(.+)$/.exec(tok);
      if (!m || `${m[1]}.com` !== providerId) return fail(res, 400, "INVALID_IDP_RESPONSE");
      if (providerId === "apple.com" && !q.get("nonce")) return fail(res, 400, "MISSING_OR_INVALID_NONCE");
      const email = m[2];
      let u = userByEmail(email), isNewUser = false;
      if (u && !u.providers.includes(providerId)) return send(res, 200, { needConfirmation: true, email, providerId });
      if (!u) { u = { uid: newUid(), email, emailVerified: true, providers: [providerId], createdAt: String(Date.now()) }; users.set(u.uid, u); isNewUser = true; }
      const names = providerId === "google.com" ? { firstName: "Sara", lastName: "Ahmed", displayName: "Sara Ahmed" } : {};
      send(res, 200, issue(u, { providerId, federatedId: `${providerId}/${u.uid}`, emailVerified: true, isNewUser, ...names }));
    },
  };

  const server = createServer(async (req, res) => {
    if (req.method === "OPTIONS") {
      res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Content-Type, Authorization", "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS" });
      return res.end();
    }
    let raw = "";
    for await (const chunk of req) raw += chunk;
    const url = new URL(req.url, "http://x");
    calls.push({ method: req.method, path: url.pathname });
    /* test helpers */
    if (url.pathname === "/__test/phone-code") {
      const last = [...phoneSessions.values()].pop();
      return send(res, 200, { code: last ? last.code : null, phone: last ? last.phone : null });
    }
    if (url.pathname === "/__test/state") return send(res, 200, { users: [...users.values()].map(userView), oob, docs: Object.fromEntries(docs), calls });
    if (url.pathname === "/__test/seed" && req.method === "POST") {
      const b = JSON.parse(raw || "{}");
      const u = { uid: newUid(), email: b.email, password: b.password, emailVerified: !!b.emailVerified, providers: ["password"], createdAt: String(Date.now()) };
      users.set(u.uid, u);
      if (b.profile) docs.set(u.uid, { name: `projects/${projectId}/databases/(default)/documents/users/${u.uid}`, fields: encode(b.profile) });
      return send(res, 200, { uid: u.uid });
    }
    /* identity toolkit */
    const idt = /^\/identitytoolkit\.googleapis\.com\/v1\/(accounts:\w+|recaptchaParams)$/.exec(url.pathname);
    if (idt) {
      if (url.searchParams.get("key") !== apiKey) return fail(res, 400, "API_KEY_INVALID");
      if (idt[1] === "recaptchaParams") return send(res, 200, { recaptchaSiteKey: "test-site-key" });
      const fn = accounts[idt[1].slice("accounts:".length)];
      if (!fn) return fail(res, 404, "NOT_FOUND");
      return fn(raw ? JSON.parse(raw) : {}, res);
    }
    if (url.pathname === "/securetoken.googleapis.com/v1/token") {
      const p = new URLSearchParams(raw);
      const uid = refresh.get(p.get("refresh_token"));
      if (!uid || !users.has(uid)) return fail(res, 400, "INVALID_REFRESH_TOKEN");
      const r = issue(users.get(uid));
      return send(res, 200, { expires_in: "3600", token_type: "Bearer", refresh_token: r.refreshToken, id_token: r.idToken, user_id: uid, project_id: projectId });
    }
    /* firestore documents: users/{uid}, owner-only like the recommended security rules */
    const fsm = /^\/v1\/projects\/([^/]+)\/databases\/\(default\)\/documents\/users\/([^/]+)$/.exec(decodeURIComponent(url.pathname));
    if (fsm) {
      const uid = authUid((req.headers.authorization || "").replace(/^Bearer /, ""));
      if (fsm[1] !== projectId) return send(res, 404, { error: { code: 404, message: "project not found", status: "NOT_FOUND" } });
      if (!uid || uid !== fsm[2]) return send(res, 403, { error: { code: 403, message: "Missing or insufficient permissions.", status: "PERMISSION_DENIED" } });
      if (req.method === "GET") return docs.has(uid) ? send(res, 200, docs.get(uid)) : send(res, 404, { error: { code: 404, message: "Document not found", status: "NOT_FOUND" } });
      if (req.method === "PATCH") { const d = { name: `projects/${projectId}/databases/(default)/documents/users/${uid}`, ...JSON.parse(raw) }; docs.set(uid, d); return send(res, 200, d); }
      if (req.method === "DELETE") { docs.delete(uid); return send(res, 200, {}); }
    }
    send(res, 404, { error: { code: 404, message: "not found" } });
  });
  const encode = (p) => Object.fromEntries(Object.entries(p).map(([k, v]) => [k, v == null ? { nullValue: null } : typeof v === "number" ? { integerValue: String(v) } : { stringValue: String(v) }]));

  await new Promise((r) => server.listen(port, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}`;
  return {
    url, apiKey, projectId,
    config: { firebaseApiKey: apiKey, firebaseProjectId: projectId, authEmulatorHost: url, firestoreEmulatorHost: url },
    seedUser: async (b) => (await fetch(`${url}/__test/seed`, { method: "POST", body: JSON.stringify(b) })).json(),
    phoneCode: async () => (await fetch(`${url}/__test/phone-code`)).json(),
    state: async () => (await fetch(`${url}/__test/state`)).json(),
    close: () => new Promise((r) => server.close(r)),
  };
}

/* route a page's /config.js to a test configuration */
export async function useTestConfig(page, auth) {
  await page.route(/\/config\.js(\?.*)?$/, (route) => route.fulfill({
    status: 200, contentType: "text/javascript; charset=utf-8",
    body: `window.EYEMAKKAH_CONFIG = ${JSON.stringify({ auth })};`,
  }));
}
