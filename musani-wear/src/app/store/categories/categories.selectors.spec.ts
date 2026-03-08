import {
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from './categories.selectors';
import { CategoriesState } from './categories.state';
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

describe('categoriesSelectors', () => {
  it('selectCategories returns categories', () => {
    const state: CategoriesState = {
      categories: [mockCategory],
      loading: false,
      error: null,
    };
    expect(selectCategories.projector(state)).toEqual([mockCategory]);
  });

  it('selectCategoriesLoading returns loading flag', () => {
    const state: CategoriesState = {
      categories: [],
      loading: true,
      error: null,
    };
    expect(selectCategoriesLoading.projector(state)).toBe(true);
  });

  it('selectCategoriesError returns error message', () => {
    const state: CategoriesState = {
      categories: [],
      loading: false,
      error: 'Failed to fetch',
    };
    expect(selectCategoriesError.projector(state)).toBe('Failed to fetch');
  });
});
