import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { ProductService } from '../../../services/product.service';
import { CategoryService } from '../../../services/category.service';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';
import { formatPrice } from '../../../utils/format-price';
import { DeleteConfirmationModalComponent } from '../../../components/admin/delete-confirmation-modal/delete-confirmation-modal.component';

/**
 * Admin Products List: table of all products with edit/delete actions.
 * Uses refresh trigger to reload list after delete.
 * Uses DeleteConfirmationModal instead of native confirm().
 */
@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [AsyncPipe, RouterLink, DeleteConfirmationModalComponent],
  templateUrl: './admin-products.component.html',
})
export class AdminProductsComponent {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);

  /** Refresh trigger: increment to reload products (e.g. after delete). */
  private readonly refresh$ = new BehaviorSubject(0);

  /** Whether the delete confirmation modal is open. */
  deleteModalOpen = false;

  /** Product pending deletion (set when user clicks Delete, cleared on confirm/cancel). */
  productToDelete: Product | null = null;

  products$ = this.refresh$.pipe(
    switchMap(() => this.productService.getAllProducts())
  );

  /** Categories for category name lookup. */
  categories = toSignal(this.categoryService.getAllCategories(), {
    initialValue: [] as Category[],
  });

  /** Expose formatPrice for template. */
  formatPrice = formatPrice;

  /** Look up category name by ID. */
  getCategoryName(categoryId: string): string {
    const cats = this.categories();
    const cat = cats.find((c) => c.id === categoryId);
    return cat?.name ?? '—';
  }

  /** Open delete confirmation modal for the given product. */
  openDeleteModal(product: Product): void {
    this.productToDelete = product;
    this.deleteModalOpen = true;
  }

  /** Close modal and clear productToDelete. */
  closeDeleteModal(): void {
    this.deleteModalOpen = false;
    this.productToDelete = null;
  }

  /** Called when user confirms deletion in modal. */
  onDeleteConfirmed(): void {
    const product = this.productToDelete;
    this.closeDeleteModal();
    if (!product?.id) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.refresh$.next(this.refresh$.value + 1);
      },
      error: () => {
        alert('Failed to delete product. Please try again.');
      },
    });
  }

  /** Delete product (legacy entry point - now opens modal). */
  deleteProduct(product: Product): void {
    this.openDeleteModal(product);
  }
}
