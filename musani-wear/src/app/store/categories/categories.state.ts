import { Category } from '../../models/Category';

/** Categories slice of the NgRx store. */
export interface CategoriesState {
  categories: Category[];
  loading: boolean;
  error: string | null;
}
