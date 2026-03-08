import { productsReducer, initialState } from './products.reducer';
import {
  loadProducts,
  loadProductsSuccess,
  loadProductsFailure,
  loadFeaturedProducts,
  loadFeaturedProductsSuccess,
  loadFeaturedProductsFailure,
  loadProductsByCategory,
  loadProductsByCategorySuccess,
  loadProductsByCategoryFailure,
} from './products.actions';
import { Product } from '../../models/Product';

const mockProduct: Product = {
  id: 'p1',
  name: 'Test Dress',
  description: 'A test dress',
  price: 100,
  material: 'Cotton',
  category: 'Dresses',
  categoryId: 'cat1',
  colors: [],
  images: [],
  featured: true,
  available: true,
  createdAt: null,
  updatedAt: null,
};

describe('productsReducer', () => {
  it('returns initial state for unknown action', () => {
    expect(productsReducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('sets loading and clears error on loadProducts', () => {
    const state = productsReducer(
      { ...initialState, error: 'Previous error' },
      loadProducts()
    );
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('sets products and clears loading on loadProductsSuccess', () => {
    const products = [mockProduct];
    const state = productsReducer(
      { ...initialState, loading: true },
      loadProductsSuccess({ products })
    );
    expect(state.products).toEqual(products);
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('sets error on loadProductsFailure', () => {
    const state = productsReducer(
      { ...initialState, loading: true },
      loadProductsFailure({ error: 'Failed' })
    );
    expect(state.error).toBe('Failed');
    expect(state.loading).toBe(false);
  });

  it('sets featuredLoading on loadFeaturedProducts', () => {
    const state = productsReducer(initialState, loadFeaturedProducts());
    expect(state.featuredLoading).toBe(true);
  });

  it('sets featuredProducts on loadFeaturedProductsSuccess', () => {
    const products = [mockProduct];
    const state = productsReducer(
      { ...initialState, featuredLoading: true },
      loadFeaturedProductsSuccess({ products })
    );
    expect(state.featuredProducts).toEqual(products);
    expect(state.featuredLoading).toBe(false);
  });

  it('sets category products on loadProductsByCategorySuccess', () => {
    const products = [mockProduct];
    const state = productsReducer(
      {
        ...initialState,
        categoryLoading: { cat1: true },
      },
      loadProductsByCategorySuccess({ categoryId: 'cat1', products })
    );
    expect(state.productsByCategory['cat1']).toEqual(products);
    expect(state.categoryLoading['cat1']).toBe(false);
  });
});
