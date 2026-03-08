import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { combineLatest, Observable, of, Subject } from 'rxjs';
import { map, startWith, catchError, switchMap } from 'rxjs/operators';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { WhatsAppService } from '../../services/whatsapp.service';
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

/** Home featured section state: loading, loaded, or error. */
export interface HomeFeaturedState {
  status: 'loading' | 'loaded' | 'error';
  items: ProductWithCategory[];
  error?: string;
}

/**
 * Home page for Musani Wear customer site.
 * Hero, featured products, category showcase, and WhatsApp CTA.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe, ProductCardComponent, ErrorDisplayComponent, LoadingSkeletonComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly whatsAppService = inject(WhatsAppService);
  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPageTitle('Musani Wear - Exquisite Dress Collections');
    this.seoService.setMeta(
      'description',
      'Discover exquisite dress collections at Musani Wear. Handpicked designs for every occasion. Browse our curated boutique selection.'
    );
  }

  /** Triggers re-fetch when retry is clicked. */
  private readonly retryTrigger$ = new Subject<void>();

  /** Featured section state: loading skeleton, products, or error. Re-fetches on retry. */
  readonly featuredState$: Observable<HomeFeaturedState> = this.retryTrigger$.pipe(
    startWith(undefined),
    switchMap(() =>
      combineLatest([
        this.productService.getFeaturedProducts().pipe(
          map((products) => ({ status: 'loaded' as const, products })),
          startWith({ status: 'loading' as const, products: [] as Product[] }),
          catchError((err) => {
            console.error('Error fetching featured products:', err);
            return of({
              status: 'error' as const,
              products: [] as Product[],
              error: 'Failed to load featured products. Please try again.',
            });
          })
        ),
        this.categoryService.getAllCategories().pipe(
          map((categories) => ({ status: 'loaded' as const, categories })),
          startWith({ status: 'loading' as const, categories: [] as Category[] }),
          catchError((err) => {
            console.error('Error fetching categories:', err);
            return of({
              status: 'error' as const,
              categories: [] as Category[],
              error: 'Failed to load categories. Please try again.',
            });
          })
        ),
      ]).pipe(
        map(([prodState, catState]) => {
      if (prodState.status === 'error') {
        return { status: 'error' as const, items: [], error: prodState.error };
      }
      if (catState.status === 'error') {
        return { status: 'error' as const, items: [], error: catState.error };
      }
      if (prodState.status === 'loading' || catState.status === 'loading') {
        return { status: 'loading' as const, items: [] };
      }
      const items: ProductWithCategory[] = prodState.products.map((product) => ({
        product,
        categoryName:
          catState.categories.find((c) => c.id === product.categoryId)?.name ?? '',
      }));
      return { status: 'loaded' as const, items };
        })
      )
    )
  );

  /** Re-fetch featured products (called when user clicks Retry on ErrorDisplay). */
  onRetryFeatured(): void {
    this.retryTrigger$.next();
  }

  /** Categories for showcase section (with fallback on error). */
  readonly categories$ = this.categoryService.getAllCategories().pipe(
    catchError((err) => {
      console.error('Error fetching categories:', err);
      return of([]);
    })
  );
  readonly whatsappUrl$ = this.whatsAppService.generateGeneralInquiryUrl();
}
