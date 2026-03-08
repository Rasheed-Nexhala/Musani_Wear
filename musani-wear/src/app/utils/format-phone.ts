/**
 * Format a phone number for use in wa.me URLs.
 * Strips the leading '+' so the number can be used directly in wa.me/{number}.
 *
 * @example
 * formatPhoneForWhatsApp('+919876543210') // "919876543210"
 * formatPhoneForWhatsApp('9876543210')    // "9876543210"
 */
export function formatPhoneForWhatsApp(number: string): string {
  return number.replace(/^\+/, '');
}
