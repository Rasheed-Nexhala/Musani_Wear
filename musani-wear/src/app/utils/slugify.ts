/**
 * Convert text to a URL-friendly slug.
 * Lowercase, replace spaces with hyphens, remove special chars.
 *
 * @example
 * slugify('Floral Summer Dress')  // "floral-summer-dress"
 * slugify('Élégant & Chic')       // "elegant-chic"
 */
export function slugify(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (é → e)
    .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}
