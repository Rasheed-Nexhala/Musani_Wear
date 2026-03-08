import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, combineLatest, of } from 'rxjs';
import { map, shareReplay, startWith, catchError } from 'rxjs/operators';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/Product';
import { StatsCardComponent } from '../../../components/admin/stats-card/stats-card.component';
import { ContentLoaderComponent } from '../../../components/shared/content-loader/content-loader.component';
import { formatPrice } from '../../../utils/format-price';

/** Dashboard data with loading state. */
export interface DashboardState {
  loading: boolean;
  totalProducts: number;
  inStock: number;
  outOfStock: number;
  totalCategories: number;
  recentProducts: Product[];
}

/**
 * Admin Dashboard: overview stats, quick actions, and recent products.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, AsyncPipe, StatsCardComponent, ContentLoaderComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  private readonly products$ = this.productService.getAllProducts().pipe(
    shareReplay(1),
    catchError(() => of([] as Product[]))
  );
  private readonly categories$ = this.categoryService.getAllCategories().pipe(
    map((c) => c.length),
    catchError(() => of(0))
  );

  /** Combined dashboard state with loading indicator. */
  readonly dashboardState$: Observable<DashboardState> = combineLatest([
    this.products$.pipe(
      startWith(null as Product[] | null),
      map((p) => (p === null ? { loading: true, products: [] as Product[] } : { loading: false, products: p }))
    ),
    this.categories$.pipe(startWith(null as number | null)),
  ]).pipe(
    map(([prodState, totalCategories]) => {
      const loading = prodState.loading || totalCategories === null;
      const products = prodState.products;
      return {
        loading,
        totalProducts: products.length,
        inStock: products.filter((p) => p.available).length,
        outOfStock: products.filter((p) => !p.available).length,
        totalCategories: totalCategories ?? 0,
        recentProducts: [...products]
          .sort(
            (a, b) =>
              (b.createdAt?.toMillis?.() ?? (b.createdAt as number) ?? 0) -
              (a.createdAt?.toMillis?.() ?? (a.createdAt as number) ?? 0)
          )
          .slice(0, 5),
      };
    })
  );

  /** Expose formatPrice for template */
  formatPrice = formatPrice;
}
