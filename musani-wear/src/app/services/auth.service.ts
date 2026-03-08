import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { loginRequested, logoutRequested } from '../store/auth/auth.actions';
import {
  selectCurrentUser,
  selectIsAuthenticated,
} from '../store/auth/auth.selectors';

/**
 * AuthService: NgRx-based auth facade.
 * Dispatches login/logout actions; exposes currentUser$ and isAuthenticated$ from the store.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly store = inject(Store);

  /** Current logged-in user, or null if not authenticated. */
  readonly currentUser$ = this.store.select(selectCurrentUser);

  /** True when a user is signed in, false otherwise. */
  readonly isAuthenticated$ = this.store.select(selectIsAuthenticated);

  /** Request login with email and password. Effects handle Firebase sign-in. */
  login(email: string, password: string): void {
    this.store.dispatch(loginRequested({ email, password }));
  }

  /** Request logout. Effects handle Firebase sign-out. */
  logout(): void {
    this.store.dispatch(logoutRequested());
  }
}
