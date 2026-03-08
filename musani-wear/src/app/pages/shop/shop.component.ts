import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { ProductCardComponent } from '../../components/shared/product-card/product-card.component';
import { Product } from '../../models/Product';

/** Product with resolved category name for display in ProductCard. */
export interface ProductWithCategory {
  product: Product;
  categoryName: string;
}

/** Internal state before category names are resolved. */
interface ProductsWithStatusRaw {
  status: 'loading' | 'loaded';
  products: Product[];
}

/** Combined state for products with loading status. */
export interface ProductsState {
  status: 'loading' | 'loaded';
  items: ProductWithCategory[];
}

/**
 * Shop page: all products with category filter.
 * Uses BehaviorSubject for selectedCategory; switchMap to fetch products.
 * Combines with categories to resolve category names for ProductCard.
 */
@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [AsyncPipe, ProductCardComponent],
  templateUrl: './shop.component.html',
})
export class ShopComponent {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  /** Selected category ID or null for "All Products". Exposed for template. */
  readonly selectedCategory$ = new BehaviorSubject<string | null>(null);

  readonly categories$ = this.categoryService.getAllCategories();

  /**
   * Products stream: when selectedCategory changes, switchMap to the appropriate
   * ProductService method. Emits loading state first, then loaded data.
   */
  private readonly productsWithStatus$: Observable<ProductsWithStatusRaw> =
    this.selectedCategory$.pipe(
      switchMap((categoryId) => {
        const products$ =
          categoryId === null
            ? this.productService.getAllProducts()
            : this.productService.getProductsByCategory(categoryId);
        return products$.pipe(
          map((products) => ({ status: 'loaded' as const, products })),
          startWith({ status: 'loading' as const, products: [] as Product[] })
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
      return { status: state.status, items };
    })
  );

  /** Set category filter. Pass null for "All Products". */
  setCategory(categoryId: string | null): void {
    this.selectedCategory$.next(categoryId);
  }
}
