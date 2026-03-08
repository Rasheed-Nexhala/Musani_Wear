/**
 * Reusable constants for the Musani Wear app.
 * Centralized here for consistency and easy testing.
 */

/** Maximum allowed image file size in megabytes (for uploads). */
export const MAX_IMAGE_SIZE_MB = 5;

/** Maximum allowed image file size in bytes. */
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;

/** Allowed MIME types for image uploads. */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/gif',
] as const;

/** Human-readable list of allowed image extensions for error messages. */
export const ALLOWED_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
