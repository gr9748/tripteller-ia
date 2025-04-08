
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state change listener first
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('user');
        setUser(null);
      } else if (event === 'SIGNED_IN' && session) {
        // Get user data when signed in
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email ? session.user.email.split('@')[0] : 'User',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }
    });

    // Then check current session
    const checkAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (sessionData.session) {
          // If we have a valid session, use stored user data or fetch it
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            // If no stored user but we have a session, create user data
            const userData = {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email || '',
              name: sessionData.session.user.email ? sessionData.session.user.email.split('@')[0] : 'User',
            };
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
          }
        } else {
          // No valid session, clear user data
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message || 'Login failed');
        throw error;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: data.user.email ? data.user.email.split('@')[0] : 'User',
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Successfully logged in');
        navigate('/');
      }
    } catch (error) {
      console.error('Login process error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error.message);
        toast.error(error.message || 'Signup failed');
        throw error;
      }

      if (data.user) {
        const userData = {
          id: data.user.id,
          email: data.user.email || '',
          name: name || (data.user.email ? data.user.email.split('@')[0] : 'User'),
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        toast.success('Account created successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Signup process error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error(error.message || 'Logout failed');
        return;
      }
      
      localStorage.removeItem('user');
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout process error:', error);
      toast.error('Logout failed');
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
