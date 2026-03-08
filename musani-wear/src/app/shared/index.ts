/**
 * Re-exports from utils and shared for a single import path.
 *
 * @example
 * import { formatPrice, isValidEmail } from './shared';
 */

// Utils
export { formatPrice } from '../utils/format-price';
export { formatPhoneForWhatsApp } from '../utils/format-phone';
export { isValidWhatsAppNumber } from '../utils/validate-whatsapp';
export { isValidEmail } from '../utils/validate-email';
export {
  validateImageFile,
  type ValidateImageResult,
} from '../utils/validate-image';
export {
  buildProductInquiryMessageText,
  type ProductForInquiry,
} from '../utils/build-whatsapp-message';
export { slugify } from '../utils/slugify';

// Shared constants
export {
  MAX_IMAGE_SIZE_MB,
  MAX_IMAGE_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_IMAGE_EXTENSIONS,
} from './constants';
