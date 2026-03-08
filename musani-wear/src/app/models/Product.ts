/**
 * Color option for a product.
 * Used within Product to define available color variants.
 */
export interface Color {
  name: string;
  hex: string;
}

/**
 * Product model for dress boutique catalog.
 * Firestore Timestamp fields (createdAt, updatedAt) typed as `any` per implementation plan.
 */
export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  material: string;
  category: string;
  categoryId: string;
  colors: Color[];
  images: string[];
  featured: boolean;
  available: boolean;
  createdAt: any;
  updatedAt: any;
}
