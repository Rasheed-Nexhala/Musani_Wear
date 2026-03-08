import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectAuthError,
  selectAuthLoading,
} from './auth.selectors';
import { AuthState } from './auth.state';
import { User } from '../../models/User';

const mockUser: User = {
  uid: 'uid-1',
  email: 'admin@example.com',
  displayName: 'Admin',
};

describe('authSelectors', () => {
  it('selectCurrentUser returns user when authenticated', () => {
    const state: AuthState = {
      user: mockUser,
      error: null,
      loading: false,
    };
    expect(selectCurrentUser.projector(state)).toEqual(mockUser);
  });

  it('selectCurrentUser returns null when not authenticated', () => {
    const state: AuthState = {
      user: null,
      error: null,
      loading: false,
    };
    expect(selectCurrentUser.projector(state)).toBeNull();
  });

  it('selectIsAuthenticated returns true when user exists', () => {
    expect(selectIsAuthenticated.projector(mockUser)).toBe(true);
  });

  it('selectIsAuthenticated returns false when user is null', () => {
    expect(selectIsAuthenticated.projector(null)).toBe(false);
  });

  it('selectAuthError returns error message', () => {
    const state: AuthState = {
      user: null,
      error: 'Invalid credentials',
      loading: false,
    };
    expect(selectAuthError.projector(state)).toBe('Invalid credentials');
  });

  it('selectAuthLoading returns loading flag', () => {
    const state: AuthState = {
      user: null,
      error: null,
      loading: true,
    };
    expect(selectAuthLoading.projector(state)).toBe(true);
  });
});
