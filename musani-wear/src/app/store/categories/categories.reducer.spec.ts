import { categoriesReducer, initialState } from './categories.reducer';
import {
  loadCategories,
  loadCategoriesSuccess,
  loadCategoriesFailure,
} from './categories.actions';
import { Category } from '../../models/Category';

const mockCategory: Category = {
  id: 'cat1',
  name: 'Dresses',
  slug: 'dresses',
  description: 'Beautiful dresses',
  order: 0,
  createdAt: null,
  updatedAt: null,
};

describe('categoriesReducer', () => {
  it('returns initial state for unknown action', () => {
    expect(categoriesReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('sets loading and clears error on loadCategories', () => {
    const state = categoriesReducer(
      { ...initialState, error: 'Previous error' },
      loadCategories()
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets categories and clears loading on loadCategoriesSuccess', () => {
    const categories = [mockCategory];
    const state = categoriesReducer(
      { ...initialState, loading: true },
      loadCategoriesSuccess({ categories })
    );
    expect(state.categories).toEqual(categories);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets error on loadCategoriesFailure', () => {
    const state = categoriesReducer(
      { ...initialState, loading: true },
      loadCategoriesFailure({ error: 'Failed' })
    );
    expect(state.error).toBe('Failed');
    expect(state.loading).toBe(false);
  });
});
