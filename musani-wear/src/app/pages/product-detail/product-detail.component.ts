import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { switchMap, map, tap, startWith, filter, catchError } from 'rxjs/operators';
import { isObservable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { SeoService } from '../../services/seo.service';
import { Product } from '../../models/Product';
import { formatPrice } from '../../utils/format-price';
import { ContentLoaderComponent } from '../../components/shared/content-loader/content-loader.component';
import { ErrorDisplayComponent } from '../../components/shared/error-display/error-display.component';

/** Product detail state: loading, loaded (with product or not-found), or error. */
export interface ProductState {
  loaded: boolean;
  product: Product | null;
  error?: string;
}

/**
 * Product Detail Page: Full product view with image gallery, color selection,
 * WhatsApp inquiry, and share. Uses route param 'id' to load product.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink, ContentLoaderComponent, ErrorDisplayComponent],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly whatsAppService = inject(WhatsAppService);
  private readonly seoService = inject(SeoService);
  private readonly destroyRef = inject(DestroyRef);

  /** Product loaded from route param id. */
  product$!: Observable<Product | null>;

  /** { loaded, product, error? } to distinguish loading vs not-found vs error in template. */
  productState$!: Observable<ProductState>;

  /** Category name resolved from product.categoryId. */
  categoryName$!: Observable<string>;

  /** WhatsApp inquiry URL; reacts to product and selectedColor. */
  whatsappUrl$!: Observable<string>;

  /** Selected color name for inquiry; BehaviorSubject for combineLatest. */
  private readonly selectedColorSubject = new BehaviorSubject<string | null>(null);
  readonly selectedColor$ = this.selectedColorSubject.asObservable();

  /** Currently displayed image (thumbnail click). */
  selectedImage = '';

  /** Expose formatPrice for template. */
  readonly formatPrice = formatPrice;

  /** Fallback when image fails to load. */
  readonly imagePlaceholder =
    'https://placehold.co/600x800/e8e0d5/9a9a9a?text=No+Image';

  /** Triggers re-fetch when user clicks Retry on error. */
  private readonly retryTrigger$ = new Subject<void>();

  /** Route params combined with retry for re-fetch on error. */
  private readonly fetchTrigger$ = combineLatest([
    this.route.params,
    this.retryTrigger$.pipe(startWith(undefined)),
  ]).pipe(map(([params]) => params));

  ngOnInit(): void {
    this.product$ = this.fetchTrigger$.pipe(
      switchMap((params) =>
        this.productService.getProductById(params['id'] ?? '')
      ),
      tap((product) => {
        if (product) {
          this.selectedImage = product.images?.[0] ?? '';
          this.selectedColorSubject.next(null);
        }
      })
    );

    this.productState$ = this.product$.pipe(
      map((product) => ({ loaded: true, product, error: undefined })),
      startWith({ loaded: false, product: null as Product | null }),
      catchError((err) => {
        console.error('Error loading product:', err);
        return of({
          loaded: true,
          product: null,
          error: 'Failed to load product. Please try again.',
        } as ProductState);
      })
    );

    this.categoryName$ = this.product$.pipe(
      switchMap((product) => {
        if (!product?.categoryId) return of('');
        return this.categoryService.getCategoryById(product.categoryId).pipe(
          map((cat) => cat?.name ?? '')
        );
      })
    );

    this.whatsappUrl$ = combineLatest([
      this.product$,
      this.selectedColor$,
    ]).pipe(
      switchMap(([product, color]) => {
        if (!product) return of('');
        const result = this.whatsAppService.getProductInquiryUrl(
          product,
          color ?? undefined
        );
        return isObservable(result) ? result : of(result);
      })
    );

    this.productState$
      .pipe(
        filter((s) => s.loaded && s.product !== null),
        map((s) => s.product!),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((product) => {
        this.seoService.setPageTitle(`${product.name} - Musani Wear`);
        this.seoService.setMeta('description', product.description || product.name);
        const imageUrl =
          product.images?.length > 0 ? product.images[0] : '';
        this.seoService.setOgTags(
          `${product.name} - Musani Wear`,
          product.description || product.name,
          imageUrl
        );
      });
  }

  /** Re-fetch product (called when user clicks Retry on ErrorDisplay). */
  onRetry(): void {
    this.retryTrigger$.next();
  }

  setSelectedColor(colorName: string): void {
    this.selectedColorSubject.next(colorName);
  }

  setSelectedImage(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  /** Whether Web Share API is available (for template). */
  get canShare(): boolean {
    return typeof navigator !== 'undefined' && !!navigator.share;
  }

  shareProduct(product: Product): void {
    if (this.canShare) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} from Musani Wear!`,
        url: window.location.href,
      });
    }
  }
}
