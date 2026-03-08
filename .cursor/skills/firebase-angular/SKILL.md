---
name: firebase-angular
description: Firebase integration for Angular apps with Firestore, Storage, Auth, and Hosting. Use when implementing Firebase features, security rules, Firestore queries, file uploads, authentication, or deploying to Firebase.
---

# Firebase + Angular

Firebase backend for Angular: Firestore (database), Firebase Storage (files/images), Firebase Auth (login), Firebase Hosting (deploy).

---

## Quick Setup

### Angular Bootstrap (main.ts)

```typescript
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAuth, getAuth } from '@angular/fire/auth';

bootstrapApplication(AppComponent, {
  providers: [
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth())
  ]
});
```

### Environment Config

```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'YOUR_SENDER_ID',
    appId: 'YOUR_APP_ID'
  }
};
```

Obtain from **Firebase Console > Project Settings > General**.

---

## Firestore

**Core operations:**

```typescript
import { Firestore, collection, doc, getDocs, getDoc, setDoc, updateDoc, deleteDoc, query, where, orderBy, limit, Timestamp } from '@angular/fire/firestore';

// Read collection
const col = collection(this.firestore, 'collectionName');
const snapshot = await getDocs(query(col, where('field', '==', value), orderBy('createdAt', 'desc')));

// Read document
const docRef = doc(this.firestore, 'collectionName', id);
const snapshot = await getDoc(docRef);

// Write
await setDoc(docRef, { ...data, updatedAt: Timestamp.now() });
await updateDoc(docRef, { field: value });
await deleteDoc(docRef);
```

**Indexes:** Create composite indexes in Firebase Console when using `where` + `orderBy` on different fields.

---

## Firebase Auth

```typescript
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';

// Login
signInWithEmailAndPassword(this.auth, email, password)

// Logout
signOut(this.auth)

// Auth state
onAuthStateChanged(this.auth, user => { /* user or null */ })
```

**Session:** Token persists; expires ~1 hour. Use Auth Guard to protect routes.

---

## Firebase Storage

```typescript
import { Storage, ref, uploadBytes, getDownloadURL, deleteObject } from '@angular/fire/storage';

// Upload
const storageRef = ref(this.storage, `path/to/${fileName}`);
await uploadBytes(storageRef, file);
const url = await getDownloadURL(storageRef);

// Delete (use path, not URL)
await deleteObject(ref(this.storage, path));
```

**Common pattern:** Store `getDownloadURL()` result in Firestore; use as `<img src>`.

---

## Security Rules

**Firestore:** Public read, authenticated write (common pattern):

```javascript
match /collectionName/{docId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

**Storage:** Public read, authenticated write with validation:

```javascript
match /path/{fileName} {
  allow read: if true;
  allow write: if request.auth != null &&
    request.resource.size <= 5 * 1024 * 1024 &&
    request.resource.contentType.matches('image/(jpeg|png|webp)');
}
```

Deploy: `firebase deploy --only firestore:rules` and `firebase deploy --only storage`

---

## NgRx + Firebase

Effects call Firestore/Storage services; services stay as pure data-access layers.

```
Action → Effect → Service (Firestore/Storage) → Success/Failure Action → Reducer
```

---

## Emulator & Deployment

```bash
firebase emulators:start   # Firestore UI: http://localhost:4000
firebase deploy
firebase deploy --only hosting
firebase deploy --only firestore:rules
```

---

## Common Pitfalls

1. **Firestore rules:** Default deny; explicitly allow read/write per collection.
2. **Storage CORS:** Verify rules allow public read if images are public.
3. **Auth token expiry:** Handle 401/403; redirect to login.
4. **Image URLs:** Store full `getDownloadURL()` result; use path for `deleteObject`.
5. **Composite indexes:** Firestore requires indexes for `where` + `orderBy` on different fields.

---

## Additional Resources

- Patterns, auth errors, guard: [reference.md](reference.md)
- [Firebase Docs](https://firebase.google.com/docs)
