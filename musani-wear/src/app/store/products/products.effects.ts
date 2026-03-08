import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

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
import { ProductService } from '../../services/product.service';

@Injectable()
export class ProductsEffects {
  private readonly actions$ = inject(Actions);
  private readonly productService = inject(ProductService);

  /** Load all products via ProductService.getAllProducts(). */
  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProducts),
      switchMap(() =>
        this.productService.getAllProducts().pipe(
          map((products) => loadProductsSuccess({ products })),
          catchError((err) =>
            of(loadProductsFailure({ error: err?.message ?? 'Failed to fetch products' }))
          )
        )
      )
    )
  );

  /** Load featured products via ProductService.getFeaturedProducts(). */
  loadFeaturedProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFeaturedProducts),
      switchMap(() =>
        this.productService.getFeaturedProducts().pipe(
          map((products) => loadFeaturedProductsSuccess({ products })),
          catchError((err) =>
            of(loadFeaturedProductsFailure({ error: err?.message ?? 'Failed to fetch featured products' }))
          )
        )
      )
    )
  );

  /** Load products by category via ProductService.getProductsByCategory(). */
  loadProductsByCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadProductsByCategory),
      switchMap(({ categoryId }) =>
        this.productService.getProductsByCategory(categoryId).pipe(
          map((products) => loadProductsByCategorySuccess({ categoryId, products })),
          catchError((err) =>
            of(
              loadProductsByCategoryFailure({
                categoryId,
                error: err?.message ?? 'Failed to fetch products by category',
              })
            )
          )
        )
      )
    )
  );
}
