/**
 * Validate that a string is a valid email address format.
 * Uses a standard RFC 5322–compatible regex for common email patterns.
 *
 * @example
 * isValidEmail('user@example.com')   // true
 * isValidEmail('invalid')            // false
 * isValidEmail('a@b.co')             // true
 */
export function isValidEmail(email: string): boolean {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email.trim());
}
