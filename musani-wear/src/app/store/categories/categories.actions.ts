import { createAction, props } from '@ngrx/store';
import { Category } from '../../models/Category';

/** Load all categories. */
export const loadCategories = createAction('[Categories] Load Categories');

/** Load all categories succeeded. */
export const loadCategoriesSuccess = createAction(
  '[Categories] Load Categories Success',
  props<{ categories: Category[] }>()
);

/** Load all categories failed. */
export const loadCategoriesFailure = createAction(
  '[Categories] Load Categories Failure',
  props<{ error: string }>()
);
