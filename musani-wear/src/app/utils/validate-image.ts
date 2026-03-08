import {
  MAX_IMAGE_SIZE_BYTES,
  MAX_IMAGE_SIZE_MB,
  ALLOWED_IMAGE_TYPES,
} from '../shared/constants';

export interface ValidateImageResult {
  valid: boolean;
  error?: string;
}

/**
 * Validate an image file for type and size.
 * Uses shared constants for MAX_IMAGE_SIZE_MB and ALLOWED_IMAGE_TYPES.
 *
 * @example
 * validateImageFile(smallJpegFile)  // { valid: true }
 * validateImageFile(hugeFile)      // { valid: false, error: "..." }
 */
export function validateImageFile(file: File): ValidateImageResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_TYPES)[number])) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_IMAGE_TYPES.join(', ')}`,
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File size exceeds ${MAX_IMAGE_SIZE_MB}MB limit`,
    };
  }

  return { valid: true };
}
