import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/Product';
import { formatPrice } from '../../../utils/format-price';

/** Placeholder when product image fails to load. */
const IMAGE_PLACEHOLDER =
  'https://placehold.co/600x800/e8e0d5/9a9a9a?text=No+Image';

/**
 * Product card for customer-facing pages (Shop, Category, Home).
 * Displays product image, name, price, category, and color swatches.
 * Parent passes categoryName to avoid N+1 subscriptions to CategoryService.
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  /** Product to display. Must have id when used in a list (for routerLink). */
  @Input({ required: true }) product!: Product;

  /** Category name from parent (avoids per-card CategoryService subscription). */
  @Input() categoryName = '';

  /** Expose formatPrice for template; keeps component logic testable. */
  readonly formatPrice = formatPrice;

  /** Fallback when image fails to load. */
  readonly imagePlaceholder = IMAGE_PLACEHOLDER;
}
