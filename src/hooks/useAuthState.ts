
import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';
import { useAuthUtils } from './useAuthUtils';

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { fetchUserProfile, clearStoredUser } = useAuthUtils();

  useEffect(() => {
    console.log('Setting up auth state listener');
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing user data');
        clearStoredUser();
        setUser(null);
      } else if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, setting user data');
        const userData = {
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.email ? session.user.email.split('@')[0] : 'User',
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else if (event === 'USER_UPDATED' && session) {
        console.log('User updated, fetching profile');
        fetchUserProfile(session.user.id);
      }
    });

    const handleProfileUpdate = (event: CustomEvent) => {
      console.log('Profile update event received', event.detail);
      setUser(event.detail);
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate as EventListener);

    const checkAuth = async () => {
      try {
        console.log('Checking auth session');
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          clearStoredUser();
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (sessionData.session) {
          console.log('Session found:', sessionData.session.user.id);
          const storedUser = localStorage.getItem('user');
          
          if (storedUser) {
            console.log('Found stored user data');
            setUser(JSON.parse(storedUser));
          } else {
            console.log('No stored user data, creating from session');
            const userData = {
              id: sessionData.session.user.id,
              email: sessionData.session.user.email || '',
              name: sessionData.session.user.email ? sessionData.session.user.email.split('@')[0] : 'User',
            };
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          if (sessionData.session.user.id) {
            fetchUserProfile(sessionData.session.user.id);
          }
        } else {
          console.log('No session found');
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
      console.log('Cleaning up auth listeners');
      authListener.subscription.unsubscribe();
      window.removeEventListener('userProfileUpdated', handleProfileUpdate as EventListener);
    };
  }, []);

  return { user, loading, setUser };
};
