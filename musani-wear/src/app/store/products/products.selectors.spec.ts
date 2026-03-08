import {
  selectProducts,
  selectFeaturedProducts,
  selectProductsLoading,
  selectFeaturedProductsLoading,
  selectProductsError,
  selectProductsByCategory,
  selectCategoryProductsLoading,
} from './products.selectors';
import { ProductsState } from './products.state';
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

describe('productsSelectors', () => {
  it('selectProducts returns products', () => {
    const state: ProductsState = {
      products: [mockProduct],
      featuredProducts: [],
      productsByCategory: {},
      loading: false,
      featuredLoading: false,
      categoryLoading: {},
      error: null,
    };
    expect(selectProducts.projector(state)).toEqual([mockProduct]);
  });

  it('selectFeaturedProducts returns featured products', () => {
    const state: ProductsState = {
      products: [],
      featuredProducts: [mockProduct],
      productsByCategory: {},
      loading: false,
      featuredLoading: false,
      categoryLoading: {},
      error: null,
    };
    expect(selectFeaturedProducts.projector(state)).toEqual([mockProduct]);
  });

  it('selectProductsLoading returns loading flag', () => {
    const state: ProductsState = {
      products: [],
      featuredProducts: [],
      productsByCategory: {},
      loading: true,
      featuredLoading: false,
      categoryLoading: {},
      error: null,
    };
    expect(selectProductsLoading.projector(state)).toBe(true);
  });

  it('selectFeaturedProductsLoading returns featured loading flag', () => {
    const state: ProductsState = {
      products: [],
      featuredProducts: [],
      productsByCategory: {},
      loading: false,
      featuredLoading: true,
      categoryLoading: {},
      error: null,
    };
    expect(selectFeaturedProductsLoading.projector(state)).toBe(true);
  });

  it('selectProductsError returns error message', () => {
    const state: ProductsState = {
      products: [],
      featuredProducts: [],
      productsByCategory: {},
      loading: false,
      featuredLoading: false,
      categoryLoading: {},
      error: 'Failed to fetch',
    };
    expect(selectProductsError.projector(state)).toBe('Failed to fetch');
  });

  it('selectProductsByCategory returns products for category', () => {
    const state: ProductsState = {
      products: [],
      featuredProducts: [],
      productsByCategory: { cat1: [mockProduct] },
      loading: false,
      featuredLoading: false,
      categoryLoading: {},
      error: null,
    };
    const selector = selectProductsByCategory('cat1');
    expect(selector.projector(state)).toEqual([mockProduct]);
  });

  it('selectProductsByCategory returns empty array when category not loaded', () => {
    const state: ProductsState = {
      products: [],
      featuredProducts: [],
      productsByCategory: {},
      loading: false,
      featuredLoading: false,
      categoryLoading: {},
      error: null,
    };
    const selector = selectProductsByCategory('cat1');
    expect(selector.projector(state)).toEqual([]);
  });

  it('selectCategoryProductsLoading returns loading for category', () => {
    const state: ProductsState = {
      products: [],
      featuredProducts: [],
      productsByCategory: {},
      loading: false,
      featuredLoading: false,
      categoryLoading: { cat1: true },
      error: null,
    };
    const selector = selectCategoryProductsLoading('cat1');
    expect(selector.projector(state)).toBe(true);
  });
});
