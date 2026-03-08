import { createAction, props } from '@ngrx/store';
import { Product } from '../../models/Product';

/** Load all products. */
export const loadProducts = createAction('[Products] Load Products');

/** Load all products succeeded. */
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);

/** Load all products failed. */
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);

/** Load featured products. */
export const loadFeaturedProducts = createAction('[Products] Load Featured Products');

/** Load featured products succeeded. */
export const loadFeaturedProductsSuccess = createAction(
  '[Products] Load Featured Products Success',
  props<{ products: Product[] }>()
);

/** Load featured products failed. */
export const loadFeaturedProductsFailure = createAction(
  '[Products] Load Featured Products Failure',
  props<{ error: string }>()
);

/** Load products by category. */
export const loadProductsByCategory = createAction(
  '[Products] Load Products By Category',
  props<{ categoryId: string }>()
);

/** Load products by category succeeded. */
export const loadProductsByCategorySuccess = createAction(
  '[Products] Load Products By Category Success',
  props<{ categoryId: string; products: Product[] }>()
);

/** Load products by category failed. */
export const loadProductsByCategoryFailure = createAction(
  '[Products] Load Products By Category Failure',
  props<{ categoryId: string; error: string }>()
);
