
import { supabase } from "./client";

// This function should be called once to set up the admin user
// Don't expose this to client-side code in a production environment
export const setupAdminUser = async () => {
  try {
    // First check if admin user already exists
    const { data: existingAdmins, error: checkError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', 'admin_id');
      
    if (checkError) {
      console.error('Error checking for existing admin:', checkError);
      return;
    }
    
    // If admin doesn't exist, create one
    if (existingAdmins && existingAdmins.length === 0) {
      const { error } = await supabase
        .from('admin_users')
        .insert({ user_id: 'admin_id' });
        
      if (error) {
        console.error('Error creating admin record:', error);
      }
    }
  } catch (error) {
    console.error('Unhandled error in admin setup:', error);
  }
};

export const isAdmin = async (email: string, password: string) => {
  if (email === 'admin@borrowbase.co.uk' && password === 'adminpassword123') {
    return true;
  }
  return false;
};
