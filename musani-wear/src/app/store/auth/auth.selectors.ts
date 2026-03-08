import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

/** Feature selector for the auth slice. */
export const selectAuthState = createFeatureSelector<AuthState>('auth');

/** Current logged-in user, or null if not authenticated. */
export const selectCurrentUser = createSelector(
  selectAuthState,
  (state) => state.user
);

/** True when a user is signed in, false otherwise. */
export const selectIsAuthenticated = createSelector(
  selectCurrentUser,
  (user) => user !== null
);

/** Last login error message, or null if none. */
export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

/** True while a login request is in progress. */
export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);
