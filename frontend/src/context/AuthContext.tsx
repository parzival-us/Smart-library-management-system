import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginRequest, RegisterRequest } from '@/types';
import { authApi } from '@/api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLibrarian: boolean;
  isStaff: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await authApi.getMe();
          setUser(userData);
        } catch (error) {
          console.error("Failed to fetch user", error);
          setToken(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async ({ username, password }: LoginRequest) => {
    const response = await authApi.login(username, password);
    localStorage.setItem('token', response.access_token);
    setToken(response.access_token);
    
    // Fetch user details immediately after login
    const userData = await authApi.getMe();
    setUser(userData);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authApi.register(data);
    localStorage.setItem('token', response.access_token);
    setToken(response.access_token);
    
    const userData = await authApi.getMe();
    setUser(userData);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const isAuthenticated = !!token;
  const isAdmin = user?.role === 'ADMIN';
  const isLibrarian = user?.role === 'LIBRARIAN';
  const isStaff = isAdmin || isLibrarian;

  return (
    <AuthContext.Provider value={{
      user, token, isAuthenticated, isAdmin, isLibrarian, isStaff, login, register, logout, loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
