/**
 * User model for Firebase Auth.
 * Maps to Firebase User profile used in admin auth.
 */
export interface User {
  uid: string;
  email: string;
  displayName?: string;
}
