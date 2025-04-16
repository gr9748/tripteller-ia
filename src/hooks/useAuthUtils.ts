
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/auth';

export const useAuthUtils = () => {
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        return;
      }
      
      if (data) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          const updatedUserData = {
            ...userData,
            name: data.name || userData.name
          };
          localStorage.setItem('user', JSON.stringify(updatedUserData));
          return updatedUserData;
        }
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  const updateStoredUser = (userData: User) => {
    localStorage.setItem('user', JSON.stringify(userData));
    const authEvent = new CustomEvent('userProfileUpdated', { detail: userData });
    window.dispatchEvent(authEvent);
  };

  const clearStoredUser = () => {
    localStorage.removeItem('user');
  };

  return {
    fetchUserProfile,
    updateStoredUser,
    clearStoredUser,
  };
};
