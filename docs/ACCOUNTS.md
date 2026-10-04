# Accounts — sign-in, sign-up, recovery and the account profile

EyeMakkah has two interchangeable account services behind one interface (`Auth`).
`config.js` decides which one runs; it loads before `app.js` and needs no rebuild.

| `config.js` | Account service |
|---|---|
| empty (as shipped) | **On this device** (`LocalAuth`). Accounts, hashed passwords, profiles and My Plan are kept in the browser's storage. SMS codes and account emails (confirmation, password reset) arrive as notifications on the device. No external service is needed. |
| `firebaseApiKey` set | **Firebase Authentication** (`FirebaseAuth`) over REST, with profiles in Cloud Firestore. Real SMS and email delivery, and real Google and Apple popups. |

Nothing signs a person in unless the service confirmed the credentials. There is no guest
entry: the app is account-first.

## On-device accounts (the shipped build)

| Data | Stored as |
|---|---|
| Accounts | `localStorage["eyemakkah.accounts.v1"]`, holding email or phone and the linked Apple / Google identity. Passwords are never stored: only a PBKDF2-SHA-256 hash (120,000 rounds) with a per-account salt. Five wrong passwords lock that email for five minutes. |
| Session | `eyemakkah.session.v1`, removed on sign-out. |
| Profile | `eyemakkah.profile.v1.<uid>` |
| My Plan and saved items | `eyemakkah.plan.v1.<uid>`. Kept on sign-out and restored on the next sign-in. Removed only when the account is deleted. |
| Language | `eyemakkah.lang` |

How each delivery and provider flow works on the device:
- **Mobile:** the 6-digit code arrives as a Messages notification. Tapping it fills the code. A code expires after 10 minutes, and five wrong codes end the attempt.
- **Password reset:** the email arrives as a Mail notification only if the account exists; the screen gives the same answer either way. Tapping it opens *Set a new password*. The link expires after 30 minutes.
- **Email confirmation:** arrives the same way, and tapping it marks the email confirmed.
- **Apple / Google:** the provider's account chooser lists the identities already used on this device, or takes a new one (name and email; Apple also offers *Hide my email*). A provider email that already belongs to an email-and-password account is refused.

Accounts on the device stay in that browser profile. They don't sync between devices;
connecting Firebase does that.

## Starter plan — «خطة مقترحة لك» / "Recommended for you"

When a new account finishes profile setup, or an existing account signs in with no saved
plan, `buildStarterPlan` adds 3–4 items to My Plan. This happens once per account; a plan
the person later empties stays empty.

- **Where items come from:** only the existing inventory, ranked by the same `rank` /
  `scoreObject` that Home and the Assistant use.
- **Slots:**
  - residents: something to take part in, food, something to discover, something outdoors;
  - visitors: heritage and culture, food, an experience, markets or nature.
- **What it uses:** resident or visitor, the chosen area (items there are preferred, with at
  most two per neighbourhood), and the reading language (English readers don't get
  Arabic-only activities).
- **What it doesn't use:** age and nationality, so content isn't stereotyped. No content in
  the inventory is tagged by either.
- **Plan state:** every item is only *planned*. Nothing is saved, joined, booked or confirmed
  on the person's behalf, and they can remove, start or add items as usual.

## What the app does

| Flow | Behaviour |
|---|---|
| Entry | Start → Language → Sign in / Create account → Profile setup when needed → Home. The app shell is not mounted until someone is signed in, so Home cannot flash underneath. |
| Email sign-up | Email + password + confirm password. The password needs 8+ characters with letters and numbers. A verification email is sent; the account works while it's pending, and the account screen shows the status with a resend action. |
| Email sign-in | Credentials are checked by Firebase. Wrong credentials, a disabled account, rate limiting and network failures each get their own message. |
| Mobile | Country code + number, validated per country (Saudi: 9 digits starting with 5; a leading 0 or Arabic digits are accepted). The SMS code is sent through Firebase behind invisible reCAPTCHA. The 6-digit code step has a 60-second resend limit and a way to change the number. |
| Google | Google Identity Services popup → Firebase `signInWithIdp`. |
| Apple | Sign in with Apple JS popup with a SHA-256 nonce → Firebase `signInWithIdp`. The name Apple returns on first authorisation pre-fills the profile. |
| Forgot password | Email → Firebase sends the reset link → "Check your email" → back to sign-in with the email filled in. The answer is the same whether or not an account exists. |
| Profile setup | First name, last name, age (whole number from 1 to 120 — a validity check, not an age policy), nationality from a fixed list, resident/visitor, and Makkah neighbourhood (required for residents, optional for visitors). Leaving this step signs out. |
| Session | Tokens are stored on the device and refreshed automatically. On relaunch the app goes straight to Home. A token Firebase rejects ends the session. |
| Account screen | Shows every profile field, the sign-in method and the account language. From it you can: <ul><li>edit details, using the same validation as sign-up;</li><li>change password (on the device: current, new and confirm; with Firebase: a reset email);</li><li>sign out, which clears the session, the device copy of the profile and in-memory state, then returns to sign-in;</li><li>delete the account, which removes the profile document and the Firebase user.</li></ul> |
| Personalisation | <ul><li>The first name is used in the greeting and the account.</li><li>Resident/visitor is the active mode.</li><li>The chosen neighbourhood is the only location the app uses for "in your area" and distances.</li><li>With no area, the app says so instead of claiming nearness.</li></ul> |

## Connecting Firebase later (`config.js` next to `index.html`)

```js
window.EYEMAKKAH_CONFIG = {
  auth: {
    firebaseApiKey: "…",       // required for any sign-in
    firebaseProjectId: "…",    // account profiles in Firestore users/{uid}
    googleWebClientId: "…",    // Google sign-in
    appleServiceId: "…",       // Sign in with Apple
    appleRedirectUri: "https://<your-domain>/"  // registered on the Services ID
  }
};
```

None of these values is secret. Access is enforced by Firebase Authentication settings and
by the Firestore rules below. If `firebaseProjectId` is empty, profiles are kept on the
device only and don't follow the user to another device.

## Firebase setup (only when moving accounts off the device)

1. **Firebase project** (Blaze plan if SMS volume exceeds the free tier).
   - Turn on these Authentication providers: **Email/Password**, **Phone**, **Google**, **Apple**.
   - Add the production domain under *Authentication → Settings → Authorized domains*.
2. **Email templates**: write Arabic and English text for verification and password-reset emails, and optionally set a custom action URL.
3. **Phone**: under *Authentication → Settings → SMS region policy*, allow Saudi Arabia and the countries you serve. reCAPTCHA needs no extra setup.
4. **Google**: create an OAuth 2.0 *Web application* client and add the production origin as an authorised JavaScript origin. Use its client ID as `googleWebClientId`, and enable Google in Firebase with the same client.
5. **Apple**: in Apple Developer, set up a Services ID with Sign in with Apple, register the domain and return URL, and create a key. In Firebase's Apple provider, enter the Services ID, Team ID, Key ID and private key.
6. **Firestore**: create the database and deploy rules that let people read and write only their own profile:

   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /users/{uid} {
         allow read, write: if request.auth != null && request.auth.uid == uid;
       }
     }
   }
   ```
7. Fill in `config.js` and redeploy. No rebuild is needed.

## Testing without a live project

`scripts/lib/firebase-test-server.mjs` answers the same REST contract locally, with the same
endpoints and error codes as Firebase. The QA scripts point the app at it through the
emulator settings `authEmulatorHost` and `firestoreEmulatorHost`, the same way the official
Firebase emulators are used.

- `node scripts/auth-check.mjs` — every flow above, in Arabic and English, with on-device accounts. It ends with the email flow through the Firebase adapter.
- `node scripts/entry-check.mjs` — the entry sequence.

The provider popups (Google, Apple) are stubbed in tests; the token exchange with the
service is real.
