/* EyeMakkah deployment configuration — read before app.js. See docs/ACCOUNTS.md.
   Left empty (as shipped), accounts run entirely on the device: sign-up, sign-in,
   mobile codes, Apple / Google, password recovery, profiles and My Plan need no
   external service. Fill in a Firebase project to move accounts to Firebase
   Authentication and Cloud Firestore instead — no rebuild needed. Nothing here is
   secret: a Firebase Web API key identifies the project; access is enforced by
   Firebase Authentication settings and Firestore security rules. */
window.EYEMAKKAH_CONFIG = {
  auth: {
    firebaseApiKey: "",      // Firebase project → Project settings → Web API key
    firebaseProjectId: "",   // account profiles in Firestore (users/{uid})
    googleWebClientId: "",   // Google Cloud → OAuth 2.0 Client ID (Web application)
    appleServiceId: "",      // Apple Developer → Services ID for Sign in with Apple
    appleRedirectUri: ""     // return URL registered on that Services ID
  }
};
