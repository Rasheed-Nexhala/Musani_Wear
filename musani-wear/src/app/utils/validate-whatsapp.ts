/**
 * Validate that a string is a valid WhatsApp number in E.164 format.
 * E.164: + followed by 10–15 digits (e.g. +919876543210).
 *
 * @example
 * isValidWhatsAppNumber('+919876543210')  // true
 * isValidWhatsAppNumber('9876543210')     // false (missing country code)
 * isValidWhatsAppNumber('+123')           // false (too short)
 */
export function isValidWhatsAppNumber(num: string): boolean {
  return /^\+[1-9]\d{9,14}$/.test(num.trim());
}
