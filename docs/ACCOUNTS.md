# Accounts — sign-in, sign-up, recovery and the account profile

EyeMakkah uses **Firebase Authentication (Identity Platform)** for accounts and
**Cloud Firestore** for account profiles. Both are called directly over their REST APIs,
so no SDK is bundled. Everything is switched on by one deploy-time file, `config.js`, which
loads before `app.js`.

With `config.js` empty (as shipped), no sign-in method signs anyone in:
- every method says it isn't available right now;
- password recovery does not claim an email was sent;
- people can still choose **Browse without an account**.

## What the app does

| Flow | Behaviour |
|---|---|
| Entry | Start → Language → Sign in. The app shell is not mounted at all until someone is signed in or chooses to browse without an account, so Home cannot flash underneath. |
| Email sign-up | Email + password + confirm password. The password needs 8+ characters with letters and numbers. A verification email is sent; the account works while it's pending, and the account screen shows the status with a resend action. |
| Email sign-in | Credentials are checked by Firebase. Wrong credentials, a disabled account, rate limiting and network failures each get their own message. |
| Mobile | Country code + number, validated per country (Saudi: 9 digits starting with 5; a leading 0 or Arabic digits are accepted). The SMS code is sent through Firebase behind invisible reCAPTCHA. The 6-digit code step has a 60-second resend limit and a way to change the number. |
| Google | Google Identity Services popup → Firebase `signInWithIdp`. |
| Apple | Sign in with Apple JS popup with a SHA-256 nonce → Firebase `signInWithIdp`. The name Apple returns on first authorisation pre-fills the profile. |
| Forgot password | Email → Firebase sends the reset link → "Check your email" → back to sign-in with the email filled in. The answer is the same whether or not an account exists. |
| Profile setup | First name, last name, age (13–110), nationality from a fixed list, resident/visitor, and Makkah neighbourhood (required for residents, optional for visitors). Leaving this step signs out. |
| Session | Tokens are stored on the device and refreshed automatically. On relaunch the app goes straight to Home. A token Firebase rejects ends the session. |
| Account screen | Shows every profile field, the sign-in method and the account language. From it you can: <ul><li>edit details, using the same validation as sign-up;</li><li>change password (sends a reset email);</li><li>sign out, which clears the session, the device copy of the profile and in-memory state, then returns to sign-in;</li><li>delete the account, which removes the profile document and the Firebase user.</li></ul> |
| Personalisation | <ul><li>The first name is used in the greeting and the account.</li><li>Resident/visitor is the active mode.</li><li>The chosen neighbourhood is the only location the app uses for "in your area" and distances.</li><li>With no area, the app says so instead of claiming nearness.</li></ul> |

## Configuration (`config.js` next to `index.html`)

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

## External setup still required

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

- `node scripts/auth-check.mjs` — every flow above, in Arabic and English, plus the shipped unconfigured state.
- `node scripts/entry-check.mjs` — the entry sequence.

The provider popups (Google, Apple) are stubbed in tests; the token exchange with the
service is real.
