/**
 * Format a number as Indian Rupee (INR) with ₹ symbol and locale-aware commas.
 * Pure function – no side effects, easily testable with Jest.
 *
 * @example
 * formatPrice(2499)   // "₹2,499"
 * formatPrice(125000) // "₹1,25,000"
 */
export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
