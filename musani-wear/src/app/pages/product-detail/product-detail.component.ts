import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable, of, BehaviorSubject, combineLatest } from 'rxjs';
import { switchMap, map, tap, startWith } from 'rxjs/operators';
import { isObservable } from 'rxjs';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { Product } from '../../models/Product';
import { formatPrice } from '../../utils/format-price';

/**
 * Product Detail Page: Full product view with image gallery, color selection,
 * WhatsApp inquiry, and share. Uses route param 'id' to load product.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly whatsAppService = inject(WhatsAppService);

  /** Product loaded from route param id. */
  product$!: Observable<Product | null>;

  /** { loaded, product } to distinguish loading vs not-found in template. */
  productState$!: Observable<{ loaded: boolean; product: Product | null }>;

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

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
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
      map((product) => ({ loaded: true, product })),
      startWith({ loaded: false, product: null as Product | null })
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
