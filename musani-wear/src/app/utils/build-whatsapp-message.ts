/**
 * Build a pre-filled WhatsApp inquiry message for a product.
 * Pure function – no side effects, easily testable with Jest.
 */

export interface ProductForInquiry {
  name: string;
  id: string;
}

/**
 * Generate a pre-filled message text for WhatsApp product inquiry.
 *
 * @param product - Object with at least name and id
 * @param color - Optional color/variant the customer is interested in
 * @returns Formatted message string ready for wa.me?text=...
 *
 * @example
 * buildProductInquiryMessageText({ name: 'Floral Dress', id: 'p1' })
 * // "Hi! I'm interested in: Floral Dress (ID: p1)"
 *
 * buildProductInquiryMessageText({ name: 'Floral Dress', id: 'p1' }, 'Blue')
 * // "Hi! I'm interested in: Floral Dress (ID: p1) - Color: Blue"
 */
export function buildProductInquiryMessageText(
  product: ProductForInquiry,
  color?: string
): string {
  const base = `Hi! I'm interested in: ${product.name} (ID: ${product.id})`;
  if (color?.trim()) {
    return `${base} - Color: ${color.trim()}`;
  }
  return base;
}
