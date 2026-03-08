import { createReducer, on } from '@ngrx/store';
import {
  loadCategories,
  loadCategoriesSuccess,
  loadCategoriesFailure,
} from './categories.actions';
import { CategoriesState } from './categories.state';

export const initialState: CategoriesState = {
  categories: [],
  loading: false,
  error: null,
};

export const categoriesReducer = createReducer(
  initialState,

  on(loadCategories, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
    error: null,
  })),

  on(loadCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
