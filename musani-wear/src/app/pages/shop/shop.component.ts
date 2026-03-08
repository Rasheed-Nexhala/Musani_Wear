import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, startWith, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { SeoService } from '../../services/seo.service';
import { ProductCardComponent } from '../../components/shared/product-card/product-card.component';
import { ErrorDisplayComponent } from '../../components/shared/error-display/error-display.component';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton.component';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';

/** Product with resolved category name for display in ProductCard. */
export interface ProductWithCategory {
  product: Product;
  categoryName: string;
}

/** Internal state before category names are resolved. */
interface ProductsWithStatusRaw {
  status: 'loading' | 'loaded' | 'error';
  products: Product[];
  error?: string;
}

/** Combined state for products with loading status. */
export interface ProductsState {
  status: 'loading' | 'loaded' | 'error';
  items: ProductWithCategory[];
  error?: string;
}

/**
 * Shop page: all products with category filter.
 * Uses BehaviorSubject for selectedCategory; switchMap to fetch products.
 * Combines with categories to resolve category names for ProductCard.
 */
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [AsyncPipe, ProductCardComponent, ErrorDisplayComponent, LoadingSkeletonComponent],
  templateUrl: './shop.component.html',
})
export class ShopComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPageTitle('Shop All Products - Musani Wear');
    this.seoService.setMeta(
      'description',
      'Shop all dresses at Musani Wear. Browse our full collection of exquisite designs. Filter by category to find your perfect dress.'
    );
  }

  /** Selected category ID or null for "All Products". Exposed for template. */
  readonly selectedCategory$ = new BehaviorSubject<string | null>(null);

  /** Triggers re-fetch when retry is clicked. */
  private readonly retryTrigger$ = new Subject<void>();

  /** Effective category: selectedCategory or re-emitted on retry. */
  private readonly effectiveCategory$ = combineLatest([
    this.selectedCategory$,
    this.retryTrigger$.pipe(startWith(undefined)),
  ]).pipe(map(([cat]) => cat));

  /** Categories with loading state for filter tabs. */
  readonly categoriesState$ = this.categoryService.getAllCategories().pipe(
    map((categories) => ({ status: 'loaded' as const, categories })),
    startWith({ status: 'loading' as const, categories: [] as Category[] }),
    catchError((err) => {
      console.error('Error fetching categories:', err);
      return of({ status: 'error' as const, categories: [] as Category[] });
    })
  );

  /** Resolved categories for product state (used in combineLatest). */
  private readonly categories$ = this.categoriesState$.pipe(map((s) => s.categories));

  /**
   * Products stream: when selectedCategory or retry changes, switchMap to fetch.
   * Catches errors and emits error state for ErrorDisplay.
   */
  private readonly productsWithStatus$: Observable<ProductsWithStatusRaw> =
    this.effectiveCategory$.pipe(
      switchMap((categoryId) => {
        const products$ =
          categoryId === null
            ? this.productService.getAllProducts()
            : this.productService.getProductsByCategory(categoryId);
        return products$.pipe(
          map((products) => ({ status: 'loaded' as const, products })),
          startWith({ status: 'loading' as const, products: [] as Product[] }),
          catchError((err) => {
            console.error('Error fetching products:', err);
            return of({
              status: 'error' as const,
              products: [] as Product[],
              error: 'Failed to load products. Please try again.',
            });
          })
        );
      })
    );

  /**
   * Combined stream: products + categories → items with categoryName for ProductCard.
   */
  readonly productsState$: Observable<ProductsState> = combineLatest([
    this.productsWithStatus$,
    this.categories$,
  ]).pipe(
    map(([state, categories]) => {
      const items: ProductWithCategory[] = state.products.map((product) => ({
        product,
        categoryName:
          categories.find((c) => c.id === product.categoryId)?.name ?? '',
      }));
      return {
        status: state.status,
        items,
        error: state.error,
      };
    })
  );

  /** Set category filter. Pass null for "All Products". */
  setCategory(categoryId: string | null): void {
    this.selectedCategory$.next(categoryId);
  }

  /** Re-fetch products (called when user clicks Retry on ErrorDisplay). */
  onRetry(): void {
    this.retryTrigger$.next();
  }
}
