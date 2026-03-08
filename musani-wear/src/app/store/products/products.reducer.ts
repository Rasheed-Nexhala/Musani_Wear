import { createReducer, on } from '@ngrx/store';
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
import { ProductsState } from './products.state';

export const initialState: ProductsState = {
  products: [],
  featuredProducts: [],
  productsByCategory: {},
  loading: false,
  featuredLoading: false,
  categoryLoading: {},
  error: null,
};

export const productsReducer = createReducer(
  initialState,

  on(loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
    error: null,
  })),

  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(loadFeaturedProducts, (state) => ({
    ...state,
    featuredLoading: true,
    error: null,
  })),

  on(loadFeaturedProductsSuccess, (state, { products }) => ({
    ...state,
    featuredProducts: products,
    featuredLoading: false,
    error: null,
  })),

  on(loadFeaturedProductsFailure, (state, { error }) => ({
    ...state,
    featuredLoading: false,
    error,
  })),

  on(loadProductsByCategory, (state, { categoryId }) => ({
    ...state,
    categoryLoading: {
      ...state.categoryLoading,
      [categoryId]: true,
    },
    error: null,
  })),

  on(loadProductsByCategorySuccess, (state, { categoryId, products }) => ({
    ...state,
    productsByCategory: {
      ...state.productsByCategory,
      [categoryId]: products,
    },
    categoryLoading: {
      ...state.categoryLoading,
      [categoryId]: false,
    },
    error: null,
  })),

  on(loadProductsByCategoryFailure, (state, { categoryId, error }) => ({
    ...state,
    categoryLoading: {
      ...state.categoryLoading,
      [categoryId]: false,
    },
    error,
  }))
);
