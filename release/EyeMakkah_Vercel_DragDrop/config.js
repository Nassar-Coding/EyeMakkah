/* EyeMakkah deployment configuration — read before app.js. See README "Accounts".
   Sign-in uses Firebase Authentication (Identity Platform) and account profiles use
   Cloud Firestore. Until firebaseApiKey is set, every sign-in method reports that it
   is unavailable and people can still browse without an account. Nothing here is
   secret: a Firebase Web API key identifies the project, access is enforced by
   Firebase Authentication settings and Firestore security rules. */
window.EYEMAKKAH_CONFIG = {
  auth: {
    firebaseApiKey: "",      // Firebase project → Project settings → Web API key
    firebaseProjectId: "",   // enables account profiles in Firestore (users/{uid})
    googleWebClientId: "",   // Google Cloud → OAuth 2.0 Client ID (Web application)
    appleServiceId: "",      // Apple Developer → Services ID for Sign in with Apple
    appleRedirectUri: ""     // return URL registered on that Services ID
  }
};
