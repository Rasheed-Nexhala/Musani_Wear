/**
 * Format a phone number for use in wa.me URLs.
 * Strips all non-digit characters so the number works in wa.me/{number}.
 * Handles spaces, dashes, parentheses, and country code prefix.
 *
 * @example
 * formatPhoneForWhatsApp('+919876543210')   // "919876543210"
 * formatPhoneForWhatsApp('+91 98765 43210') // "919876543210"
 * formatPhoneForWhatsApp('9876543210')      // "9876543210"
 */
export function formatPhoneForWhatsApp(number: string): string {
  return number.replace(/\D/g, '');
}
