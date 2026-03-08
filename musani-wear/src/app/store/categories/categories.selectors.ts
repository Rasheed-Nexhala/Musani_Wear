import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoriesState } from './categories.state';

/** Feature selector for the categories slice. */
export const selectCategoriesState = createFeatureSelector<CategoriesState>('categories');

/** All categories. */
export const selectCategories = createSelector(
  selectCategoriesState,
  (state) => state.categories
);

/** True when loading categories. */
export const selectCategoriesLoading = createSelector(
  selectCategoriesState,
  (state) => state.loading
);

/** Last categories error, or null if none. */
export const selectCategoriesError = createSelector(
  selectCategoriesState,
  (state) => state.error
);
