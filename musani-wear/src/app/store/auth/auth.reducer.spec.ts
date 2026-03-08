import { authReducer, initialState } from './auth.reducer';
import {
  loginRequested,
  loginSuccess,
  loginFailure,
  authStateChanged,
} from './auth.actions';
import { User } from '../../models/User';

const mockUser: User = {
  uid: 'uid-1',
  email: 'admin@example.com',
  displayName: 'Admin',
};

describe('authReducer', () => {
  it('returns initial state for unknown action', () => {
    expect(authReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('sets loading and clears error on loginRequested', () => {
    const state = authReducer(
      { ...initialState, error: 'Previous error' },
      loginRequested({ email: 'a@b.com', password: 'secret' })
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets user and clears loading/error on authStateChanged with user', () => {
    const state = authReducer(
      { ...initialState, loading: true },
      authStateChanged({ user: mockUser })
    );
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('clears user on authStateChanged with null', () => {
    const state = authReducer(
      { ...initialState, user: mockUser },
      authStateChanged({ user: null })
    );
    expect(state.user).toBeNull();
  });

  it('sets user on loginSuccess', () => {
    const state = authReducer(
      { ...initialState, loading: true },
      loginSuccess({ user: mockUser })
    );
    expect(state.user).toEqual(mockUser);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets error and clears user on loginFailure', () => {
    const state = authReducer(
      { ...initialState, user: mockUser, loading: true },
      loginFailure({ error: 'Invalid credentials' })
    );
    expect(state.user).toBeNull();
    expect(state.error).toBe('Invalid credentials');
    expect(state.loading).toBe(false);
  });
});
