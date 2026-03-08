import { Product } from '../../models/Product';

/** Products slice of the NgRx store. */
export interface ProductsState {
  products: Product[];
  featuredProducts: Product[];
  productsByCategory: Record<string, Product[]>;
  loading: boolean;
  featuredLoading: boolean;
  categoryLoading: Record<string, boolean>;
  error: string | null;
}
