import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.state';

/** Feature selector for the products slice. */
export const selectProductsState = createFeatureSelector<ProductsState>('products');

/** All products. */
export const selectProducts = createSelector(
  selectProductsState,
  (state) => state.products
);

/** Featured products. */
export const selectFeaturedProducts = createSelector(
  selectProductsState,
  (state) => state.featuredProducts
);

/** True when loading all products. */
export const selectProductsLoading = createSelector(
  selectProductsState,
  (state) => state.loading
);

/** True when loading featured products. */
export const selectFeaturedProductsLoading = createSelector(
  selectProductsState,
  (state) => state.featuredLoading
);

/** Last products error, or null if none. */
export const selectProductsError = createSelector(
  selectProductsState,
  (state) => state.error
);

/** Products by category ID. Use with createSelector and a categoryId input. */
export const selectProductsByCategory = (categoryId: string) =>
  createSelector(selectProductsState, (state) => state.productsByCategory[categoryId] ?? []);

/** True when loading products for a given category. */
export const selectCategoryProductsLoading = (categoryId: string) =>
  createSelector(selectProductsState, (state) => state.categoryLoading[categoryId] ?? false);
