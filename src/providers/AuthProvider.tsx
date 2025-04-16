
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import AuthContext from '@/context/AuthContext';
import { useAuthUtils } from '@/hooks/useAuthUtils';
import type { User } from '@/types/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { fetchUserProfile, updateStoredUser, clearStoredUser } = useAuthUtils();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      if (event === 'SIGNED_OUT') {
        clearStoredUser();
        setUser(null);
      } else if (event === 'SIGNED_IN' && session) {
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email ? session.user.email.split('@')[0] : 'User',
        };
        updateStoredUser(userData);
        setUser(userData);
      } else if (event === 'USER_UPDATED' && session) {
        fetchUserProfile(session.user.id);
      }
    });

    const handleProfileUpdate = (event: CustomEvent) => {
      setUser(event.detail);
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate as EventListener);

    const checkAuth = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          clearStoredUser();
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (sessionData.session) {
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            const userData = {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email || '',
              name: sessionData.session.user.email ? sessionData.session.user.email.split('@')[0] : 'User',
            };
            updateStoredUser(userData);
            setUser(userData);
          }
          
          if (sessionData.session.user.id) {
            fetchUserProfile(sessionData.session.user.id);
          }
        } else {
          clearStoredUser();
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check error:', error);
        clearStoredUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('userProfileUpdated', handleProfileUpdate as EventListener);
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
        updateStoredUser(userData);
        setUser(userData);
        toast.success('Successfully logged in');
        navigate('/');
        
        fetchUserProfile(data.user.id);
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
        updateStoredUser(userData);
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
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error.message);
        toast.error(error.message || 'Logout failed');
        throw error;
      }
      
      clearStoredUser();
      setUser(null);
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      console.error('Logout process error:', error);
      toast.error('Logout failed');
    } finally {
      setLoading(false);
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
