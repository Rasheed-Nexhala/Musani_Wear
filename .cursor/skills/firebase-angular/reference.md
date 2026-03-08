# Firebase Angular Reference

Common patterns and templates for Firebase with Angular.

---

## Firestore Query Patterns

```typescript
// Filter + sort
const q = query(
  collection(this.firestore, 'items'),
  where('status', '==', 'active'),
  orderBy('createdAt', 'desc'),
  limit(20)
);
const snapshot = await getDocs(q);

// Pagination (cursor-based)
const next = query(col, orderBy('createdAt', 'desc'), startAfter(lastDoc), limit(20));

// Real-time listener
onSnapshot(docRef, snapshot => { /* update state */ });
```

---

## Firestore Security Rules Template

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // Public read, authenticated write
    match /publicCollection/{docId} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth != null;
    }

    // Authenticated only
    match /privateCollection/{docId} {
      allow read, write: if request.auth != null;
    }

    // User-owned documents
    match /users/{userId}/subCollection/{docId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Storage Security Rules Template

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    match /public/{path} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /private/{userId}/{path} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

---

## Auth Error Codes

| Code | User message |
|------|--------------|
| auth/user-not-found | User not found. Check your email. |
| auth/wrong-password | Incorrect password. Try again. |
| auth/invalid-email | Invalid email address. |
| auth/user-disabled | Account disabled. |
| auth/too-many-requests | Too many attempts. Try later. |
| auth/email-already-in-use | Email already registered. |

---

## Auth Guard Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.authService.currentUser$.pipe(
      take(1),
      map(user => {
        if (user) return true;
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}
```

---

## Auth Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    onAuthStateChanged(this.auth, user => this.currentUser$.next(user));
  }

  login(email: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    return from(signOut(this.auth));
  }
}
```

---

## Emulator Ports

| Service | Default Port | UI |
|---------|--------------|-----|
| Firestore | 8080 | http://localhost:4000 |
| Storage | 9199 | Emulator UI |
| Auth | 9099 | Emulator UI |

Connect Firestore emulator in dev:

```typescript
import { connectFirestoreEmulator } from 'firebase/firestore';
if (!environment.production) {
  connectFirestoreEmulator(getFirestore(), 'localhost', 8080);
}
```
