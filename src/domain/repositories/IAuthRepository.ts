import type { Result } from '../../core/utils/Result';
import type { User } from '../entities/User';

export interface IAuthRepository {
  signUp(email: string, password: string, name: string): Promise<Result<User>>;
  signIn(email: string, password: string): Promise<Result<User>>;
  signOut(): Promise<void>;
  getCurrentUser(): Promise<Result<User | null>>;
}
