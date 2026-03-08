import { inject } from '@angular/core';
import { type CanActivateFn, Router } from '@angular/router';
import { Auth, onAuthStateChanged } from '@angular/fire/auth';

/**
 * Admin route guard: allows /admin/login for unauthenticated users,
 * and all other /admin/* routes only when authenticated.
 * Avoids redirect loop when unauthenticated user visits login page.
 */
export const adminGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  return new Promise<boolean>((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (state.url === '/admin/login' || state.url.endsWith('/admin/login')) {
        resolve(true);
        return;
      }
      if (user) {
        resolve(true);
        return;
      }
      router.navigate(['/admin/login']);
      resolve(false);
    });
  });
};
