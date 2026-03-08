import { Injectable, inject } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Minimal AuthService for Phase 1.
 * Exposes auth state for Navbar; full NgRx-based AuthService comes in Phase 2.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly auth = inject(Auth);

  /** True when a user is signed in, false otherwise. */
  readonly isAuthenticated$: Observable<boolean> = authState(this.auth).pipe(
    map((user) => user !== null)
  );
}
