import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from '../../components/shared/product-card/product-card.component';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

/** Combined page state: category, products, and loading status. */
export interface CategoryPageState {
  category: Category | null;
  products: Product[];
  productsStatus: 'loading' | 'loaded';
}

/**
 * Category page: displays products for a category by slug.
 * - Gets slug from route params
 * - Fetches category via CategoryService.getCategoryBySlug
 * - Fetches products via ProductService.getProductsByCategory when category exists
 * - Shows loading, not-found, or product grid
 */
@Component({
  selector: 'app-category',
  standalone: true,
  imports: [AsyncPipe, ProductCardComponent, RouterLink],
  templateUrl: './category.component.html',
})
export class CategoryComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);

  /**
   * Single stream combining category + products + loading status.
   * Emits when route params change; switchMap ensures we cancel previous fetches.
   */
  readonly pageState$: Observable<CategoryPageState> = this.route.params.pipe(
    switchMap((params) => {
      const slug = params['slug'] ?? '';
      return this.categoryService.getCategoryBySlug(slug).pipe(
        switchMap((category) => {
          if (!category?.id) {
            return of({
              category,
              products: [] as Product[],
              productsStatus: 'loaded' as const,
            });
          }
          return this.productService.getProductsByCategory(category.id).pipe(
            map((products) => ({
              category,
              products,
              productsStatus: 'loaded' as const,
            })),
            startWith({
              category,
              products: [] as Product[],
              productsStatus: 'loading' as const,
            })
          );
        })
      );
    })
  );
}
