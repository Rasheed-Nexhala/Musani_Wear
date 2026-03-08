import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { map, startWith, switchMap, filter, catchError } from 'rxjs/operators';

import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { SeoService } from '../../services/seo.service';
import { ProductCardComponent } from '../../components/shared/product-card/product-card.component';
import { ErrorDisplayComponent } from '../../components/shared/error-display/error-display.component';
import { LoadingSkeletonComponent } from '../../components/shared/loading-skeleton/loading-skeleton.component';
import { Category } from '../../models/Category';
import { Product } from '../../models/Product';

/** Combined page state: category, products, loading status, and optional error. */
export interface CategoryPageState {
  category: Category | null;
  products: Product[];
  productsStatus: 'loading' | 'loaded' | 'error';
  error?: string;
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
  imports: [AsyncPipe, ProductCardComponent, RouterLink, ErrorDisplayComponent, LoadingSkeletonComponent],
  templateUrl: './category.component.html',
})
export class CategoryComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly categoryService = inject(CategoryService);
  private readonly productService = inject(ProductService);
  private readonly seoService = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.pageState$
      .pipe(
        filter((s) => s.category !== null && s.productsStatus === 'loaded'),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((state) => {
        const category = state.category!;
        this.seoService.setPageTitle(`${category.name} - Musani Wear`);
        this.seoService.setMeta(
          'description',
          category.description || `Shop ${category.name} dresses at Musani Wear.`
        );
      });
  }

  /** Triggers re-fetch when retry is clicked. */
  private readonly retryTrigger$ = new Subject<void>();

  /** Route params combined with retry trigger for re-fetch. */
  private readonly fetchTrigger$ = combineLatest([
    this.route.params,
    this.retryTrigger$.pipe(startWith(undefined)),
  ]).pipe(map(([params]) => params));

  /**
   * Single stream combining category + products + loading status.
   * Catches errors and emits error state for ErrorDisplay.
   */
  readonly pageState$: Observable<CategoryPageState> = this.fetchTrigger$.pipe(
    switchMap((params) => {
      const slug = params['slug'] ?? '';
      return this.categoryService.getCategoryBySlug(slug).pipe(
        catchError((err) => {
          console.error('Error fetching category:', err);
          return of(null);
        }),
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
            }),
            catchError((err) => {
              console.error('Error fetching products by category:', err);
              return of({
                category,
                products: [] as Product[],
                productsStatus: 'error' as const,
                error: 'Failed to load products. Please try again.',
              });
            })
          );
        })
      );
    })
  );

  /** Re-fetch products (called when user clicks Retry on ErrorDisplay). */
  onRetry(): void {
    this.retryTrigger$.next();
  }
}
