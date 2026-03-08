import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Auth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { from, of, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import {
  loginRequested,
  logoutRequested,
  loginSuccess,
  loginFailure,
  authStateChanged,
} from './auth.actions';
import { User } from '../../models/User';

/** Maps Firebase User to our User model. */
function toUser(fbUser: import('firebase/auth').User | null): User | null {
  if (!fbUser) return null;
  return {
    uid: fbUser.uid,
    email: fbUser.email ?? '',
    displayName: fbUser.displayName ?? undefined,
  };
}

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly auth = inject(Auth);

  /** Handle login: call Firebase signInWithEmailAndPassword, dispatch success/failure. */
  loginRequested$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequested),
      switchMap(({ email, password }) =>
        from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
          map((cred) => loginSuccess({ user: toUser(cred.user)! })),
          catchError((err) =>
            of(loginFailure({ error: err?.message ?? 'Login failed' }))
          )
        )
      )
    )
  );

  /** Handle logout: call Firebase signOut. Auth state will sync via authStateChanged. */
  logoutRequested$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logoutRequested),
        switchMap(() => from(signOut(this.auth)))
      ),
    { dispatch: false }
  );

  /** Sync Firebase auth state to store on sign in, sign out, token refresh. */
  initAuthState$ = createEffect(() =>
    new Observable<ReturnType<typeof authStateChanged>>((subscriber) => {
      const unsubscribe = onAuthStateChanged(this.auth, (fbUser) => {
        subscriber.next(authStateChanged({ user: toUser(fbUser) }));
      });
      return unsubscribe;
    })
  );
}
