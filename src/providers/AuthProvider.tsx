
import React, { useState, useEffect } from 'react';
import AuthContext from '@/context/AuthContext';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';
import { supabase } from '@/integrations/supabase/client';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [actionLoading, setActionLoading] = useState(false);
  const { user, loading, setUser } = useAuthState();
  const { login, signup, logout } = useAuthActions(setUser, setActionLoading);
  
  // Log auth state changes for debugging
  useEffect(() => {
    console.log('AuthProvider - current user state:', user);
    console.log('AuthProvider - is authenticated:', !!user);
    
    // Check that Supabase is properly initialized
    if (supabase) {
      console.log('Supabase client initialized correctly');
    } else {
      console.error('Supabase client not initialized correctly');
    }
  }, [user]);

  const value = {
    user,
    loading: loading || actionLoading,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
