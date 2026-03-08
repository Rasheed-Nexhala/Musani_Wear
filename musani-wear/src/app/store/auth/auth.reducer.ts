import { createReducer, on } from '@ngrx/store';
import {
  loginRequested,
  loginSuccess,
  loginFailure,
  authStateChanged,
} from './auth.actions';
import { AuthState } from './auth.state';

export const initialState: AuthState = {
  user: null,
  error: null,
  loading: false,
};

export const authReducer = createReducer(
  initialState,

  on(loginRequested, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(authStateChanged, (state, { user }) => ({
    ...state,
    user,
    error: null,
    loading: false,
  })),

  on(loginSuccess, (state, { user }) => ({
    ...state,
    user,
    error: null,
    loading: false,
  })),

  on(loginFailure, (state, { error }) => ({
    ...state,
    user: null,
    error,
    loading: false,
  }))
);
