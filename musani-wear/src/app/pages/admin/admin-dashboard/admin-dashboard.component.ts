import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/Product';
import { StatsCardComponent } from '../../../components/admin/stats-card/stats-card.component';
import { formatPrice } from '../../../utils/format-price';

/**
 * Admin Dashboard: overview stats, quick actions, and recent products.
 */
@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterModule, AsyncPipe, StatsCardComponent],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  /** All products - shared source for derived observables */
  products$: Observable<Product[]> = this.productService
    .getAllProducts()
    .pipe(shareReplay(1));

  totalProducts$ = this.products$.pipe(map((p) => p.length));
  inStock$ = this.products$.pipe(
    map((p) => p.filter((prod) => prod.available).length)
  );
  outOfStock$ = this.products$.pipe(
    map((p) => p.filter((prod) => !prod.available).length)
  );
  totalCategories$ = this.categoryService
    .getAllCategories()
    .pipe(map((c) => c.length));
  recentProducts$ = this.products$.pipe(
    map((p) =>
      [...p]
        .sort(
          (a, b) =>
            (b.createdAt?.toMillis?.() ?? b.createdAt ?? 0) -
            (a.createdAt?.toMillis?.() ?? a.createdAt ?? 0)
        )
        .slice(0, 5)
    )
  );

  /** Expose formatPrice for template */
  formatPrice = formatPrice;
}
