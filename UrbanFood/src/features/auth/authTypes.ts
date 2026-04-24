export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  pin: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
}
