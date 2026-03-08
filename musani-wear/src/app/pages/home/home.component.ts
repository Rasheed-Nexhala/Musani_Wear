import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { WhatsAppService } from '../../services/whatsapp.service';
import { ProductCardComponent } from '../../components/shared/product-card/product-card.component';
import { Product } from '../../models/Product';
import { Category } from '../../models/Category';

/** Product with resolved category name for display in ProductCard. */
export interface ProductWithCategory {
  product: Product;
  categoryName: string;
}

/**
 * Home page for Musani Wear customer site.
 * Hero, featured products, category showcase, and WhatsApp CTA.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, AsyncPipe, ProductCardComponent],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly whatsAppService = inject(WhatsAppService);

  /** Featured products with resolved category names for ProductCard. */
  readonly productsWithCategories$: Observable<ProductWithCategory[]> =
    combineLatest([
      this.productService.getFeaturedProducts(),
      this.categoryService.getAllCategories(),
    ]).pipe(
      map(([products, categories]) =>
        products.map((product) => ({
          product,
          categoryName:
            categories.find((c) => c.id === product.categoryId)?.name ?? '',
        }))
      )
    );

  readonly categories$ = this.categoryService.getAllCategories();
  readonly whatsappUrl$ = this.whatsAppService.generateGeneralInquiryUrl();
}
