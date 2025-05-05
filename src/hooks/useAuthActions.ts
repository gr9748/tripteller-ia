import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuthUtils } from './useAuthUtils';
import { User } from '@/types/auth';

export const useAuthActions = (setUser: (user: User | null) => void, setLoading: (loading: boolean) => void) => {
  const navigate = useNavigate();
  const { updateStoredUser, clearStoredUser, fetchUserProfile } = useAuthUtils();

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Login error:', error.message);
        toast.error(error.message || 'Login failed');
        return { success: false, error };
      }

      if (data.user) {
        console.log('Login successful for user:', data.user.id);
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
        return { success: true };
      } else {
        console.error('Login failed: No user data returned');
        toast.error('Login failed: No user data returned');
        return { success: false, error: new Error('No user data returned') };
      }
    } catch (error: any) {
      console.error('Login process error:', error);
      toast.error(error.message || 'An unexpected error occurred');
      return { success: false, error };
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

  return { login, signup, logout };
};
