// testUtilities.js
import { supabase } from './supabase';

export const testUsers = [
  {
    email: 'react_dev@test.com',
    password: 'react123',
    profile: {
      name: 'John React',
      skills: 'React,JavaScript,TypeScript',
      linkedin: 'https://linkedin.com/in/john-react',
      github: 'https://github.com/john-react',
      avatar_url: 'https://i.pravatar.cc/150?img=1'
    }
  },
  {
    email: 'node_dev@test.com',
    password: 'node123',
    profile: {
      name: 'Sarah Node',
      skills: 'Node.js,Express,MongoDB',
      linkedin: 'https://linkedin.com/in/sarah-node',
      github: 'https://github.com/sarah-node',
      avatar_url: 'https://i.pravatar.cc/150?img=2'
    }
  },
  {
    email: 'python_dev@test.com',
    password: 'python123',
    profile: {
      name: 'Mike Python',
      skills: 'Python,Django,Flask',
      linkedin: 'https://linkedin.com/in/mike-python',
      github: 'https://github.com/mike-python',
      avatar_url: 'https://i.pravatar.cc/150?img=3'
    }
  },
  {
    email: 'designer@test.com',
    password: 'design123',
    profile: {
      name: 'Emma Designer',
      skills: 'Figma,UI/UX,Photoshop',
      linkedin: 'https://linkedin.com/in/emma-designer',
      github: 'https://github.com/emma-designer',
      avatar_url: 'https://i.pravatar.cc/150?img=4'
    }
  },
  {
    email: 'devops@test.com',
    password: 'devops123',
    profile: {
      name: 'David DevOps',
      skills: 'Docker,AWS,Kubernetes',
      linkedin: 'https://linkedin.com/in/david-devops',
      github: 'https://github.com/david-devops',
      avatar_url: 'https://i.pravatar.cc/150?img=5'
    }
  },
  {
    email: 'mobile_dev@test.com',
    password: 'mobile123',
    profile: {
      name: 'Priya Mobile',
      skills: 'React Native,Flutter,Kotlin',
      linkedin: 'https://linkedin.com/in/priya-mobile',
      github: 'https://github.com/priya-mobile',
      avatar_url: 'https://i.pravatar.cc/150?img=6'
    }
  }
];

export async function createTestUsers() {
  const results = [];
  
  for (const user of testUsers) {
    try {
      // Create auth user
      const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
        options: {
          data: {
            name: user.profile.name,
            avatar_url: user.profile.avatar_url
          }
        }
      });
      
      if (error) throw error;
      
      // Create profile in users table
      await supabase.from('users').upsert({
        id: data.user.id,
        ...user.profile
      });
      
      results.push(`✅ Created: ${user.email}`);
    } catch (error) {
      results.push(`❌ Error with ${user.email}: ${error.message}`);
    }
  }
  
  return results;
}

export async function cleanupTestUsers() {
  const results = [];
  
  for (const user of testUsers) {
    try {
      // Get user ID
      const { data } = await supabase
        .from('users')
        .select('id')
        .eq('email', user.email)
        .single();
      
      if (data) {
        // Delete from users table
        await supabase.from('users').delete().eq('id', data.id);
        
        // Delete auth user (requires admin privileges)
        await supabase.auth.admin.deleteUser(data.id);
        
        results.push(`✅ Deleted: ${user.email}`);
      }
    } catch (error) {
      results.push(`❌ Error deleting ${user.email}: ${error.message}`);
    }
  }
  
  return results;
}