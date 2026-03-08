import { render, screen, fireEvent } from '@testing-library/angular';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';

import { AdminLoginComponent } from './admin-login.component';
import { AuthService } from '../../../services/auth.service';
import {
  selectAuthError,
  selectAuthLoading,
} from '../../../store/auth/auth.selectors';

describe('AdminLoginComponent', () => {
  const mockAuthService = {
    login: jest.fn(),
    isAuthenticated$: of(false),
  };

  const defaultProviders = [
    provideRouter([]),
    provideMockStore({
      selectors: [
        { selector: selectAuthError, value: null },
        { selector: selectAuthLoading, value: false },
      ],
    }),
    { provide: AuthService, useValue: mockAuthService },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login form with email and password fields', async () => {
    await render(AdminLoginComponent, { providers: defaultProviders });

    expect(screen.getByRole('heading', { name: /admin login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation errors when form is invalid and submitted', async () => {
    await render(AdminLoginComponent, { providers: defaultProviders });

    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('calls authService.login with form values when form is valid', async () => {
    await render(AdminLoginComponent, { providers: defaultProviders });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(mockAuthService.login).toHaveBeenCalledWith('admin@test.com', 'password123');
  });

  it('shows error message when auth fails', async () => {
    await render(AdminLoginComponent, {
      providers: [
        provideRouter([]),
        provideMockStore({
          selectors: [
            { selector: selectAuthError, value: 'Invalid email or password' },
            { selector: selectAuthLoading, value: false },
          ],
        }),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    expect(screen.getByRole('alert')).toHaveTextContent('Invalid email or password');
  });

  it('does not call login when email is invalid', async () => {
    await render(AdminLoginComponent, { providers: defaultProviders });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'invalid-email' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });

  it('does not call login when password is too short', async () => {
    await render(AdminLoginComponent, { providers: defaultProviders });

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: 'admin@test.com' },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: '12345' },
    });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    expect(mockAuthService.login).not.toHaveBeenCalled();
  });
});
