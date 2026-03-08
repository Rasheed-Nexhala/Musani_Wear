/**
 * Firebase configuration template.
 *
 * Copy this file to environment.ts (dev) and environment.prod.ts (prod),
 * then fill in real values from Firebase Console > Project Settings > General.
 *
 * Steps:
 * 1. Create a Firebase project at https://console.firebase.google.com
 * 2. Enable Firestore, Auth, Storage, and Hosting
 * 3. In Project Settings, copy the config object
 * 4. Paste values below and rename/copy to environment.ts and environment.prod.ts
 */
export const environment = {
  production: false, // use true for environment.prod.ts
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_PROJECT_ID.appspot.com',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
  },
};
