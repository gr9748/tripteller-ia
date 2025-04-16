
import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useAuthUtils } from './useAuthUtils';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchUserProfile, clearStoredUser } = useAuthUtils();

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

  return { user, loading, setUser };
};
