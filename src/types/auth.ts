
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface LoginResult {
  success: boolean;
  error?: any;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}
