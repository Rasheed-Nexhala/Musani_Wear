import { User } from '../../models/User';

/** Auth slice of the NgRx store. */
export interface AuthState {
  user: User | null;
  error: string | null;
  loading: boolean;
}
