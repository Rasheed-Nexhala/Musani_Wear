import { createAction, props } from '@ngrx/store';
import { User } from '../../models/User';

/** User requests login with email and password. */
export const loginRequested = createAction(
  '[Auth] Login Requested',
  props<{ email: string; password: string }>()
);

/** User requests logout. */
export const logoutRequested = createAction('[Auth] Logout Requested');

/** Login succeeded; store receives the user. */
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

/** Login failed; store receives the error message. */
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

/** Firebase auth state changed (sign in, sign out, token refresh). */
export const authStateChanged = createAction(
  '[Auth] Auth State Changed',
  props<{ user: User | null }>()
);
