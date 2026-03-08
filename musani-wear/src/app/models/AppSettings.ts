/**
 * Application/business settings stored in Firestore.
 * Single document (e.g. settings/default).
 * Firestore Timestamp field (updatedAt) typed as `any` per implementation plan.
 */
export interface AppSettings {
  id: string;
  businessName: string;
  whatsappNumber: string;
  businessEmail: string;
  businessPhone: string;
  /** Instagram profile URL (e.g. https://instagram.com/musaniwear) */
  instagramUrl?: string;
  updatedAt: any;
}
