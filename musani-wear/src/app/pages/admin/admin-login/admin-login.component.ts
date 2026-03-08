import { Component, effect, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../services/auth.service';
import {
  selectAuthError,
  selectAuthLoading,
} from '../../../store/auth/auth.selectors';

/**
 * Admin Login Page
 *
 * Provides a reactive form for admin authentication. On successful login,
 * the user is redirected to /admin. Uses NgRx for auth state (loading, error).
 */
@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-login.component.html',
})
export class AdminLoginComponent {
  private readonly authService = inject(AuthService);
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  /** Auth state from NgRx store (used with async pipe in template) */
  readonly authError$ = this.store.select(selectAuthError);
  readonly authLoading$ = this.store.select(selectAuthLoading);

  /** Signal for navigation effect when login succeeds */
  private readonly isAuthenticated = toSignal(this.authService.isAuthenticated$);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor() {
    effect(() => {
      if (this.isAuthenticated()) {
        this.router.navigate(['/admin']);
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email, password);
  }
}
