/**
 * Category model for product grouping.
 * Firestore Timestamp fields (createdAt, updatedAt) typed as `any` per implementation plan.
 */
export interface Category {
  id?: string;
  name: string;
  slug: string;
  description: string;
  order: number;
  createdAt: any;
  updatedAt: any;
}
