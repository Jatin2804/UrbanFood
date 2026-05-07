export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  pin: string;
  image?: string;
  favoriteDishes?: string[];
  biometricEnabled?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}
