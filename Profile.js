// Profile.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TextInput } from 'react-native';
// import { supabase } from './supabase';

// export default function Profile({ navigation }) {
//   const [profile, setProfile] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     skills: '',
//     linkedin: '',
//     github: ''
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', user.id)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//       setFormData({
//         name: data.name || '',
//         skills: data.skills || '',
//         linkedin: data.linkedin || '',
//         github: data.github || ''
//       });
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { error } = await supabase
//         .from('users')
//         .update(formData)
//         .eq('id', user.id);

//       if (error) throw error;
//       setEditing(false);
//       fetchProfile();
//       navigation.navigate('Home');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       navigation.replace('Login');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   if (!profile) return <Text>Loading...</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile</Text>
      
//       {editing ? (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={formData.name}
//             onChangeText={(text) => setFormData({...formData, name: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Skills (comma separated)"
//             value={formData.skills}
//             onChangeText={(text) => setFormData({...formData, skills: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="LinkedIn URL"
//             value={formData.linkedin}
//             onChangeText={(text) => setFormData({...formData, linkedin: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="GitHub URL"
//             value={formData.github}
//             onChangeText={(text) => setFormData({...formData, github: text})}
//           />
//           <Button title="Save" onPress={handleSave} />
//         </>
//       ) : (
//         <>
//           <Text style={styles.label}>Name: {profile.name}</Text>
//           <Text style={styles.label}>Skills: {profile.skills}</Text>
//           {profile.linkedin && <Text style={styles.label}>LinkedIn: {profile.linkedin}</Text>}
//           {profile.github && <Text style={styles.label}>GitHub: {profile.github}</Text>}
          
//           <Button 
//             title="Edit Profile" 
//             onPress={() => setEditing(true)} 
//           />
//           <Button 
//             title="Logout" 
//             onPress={handleLogout} 
//             color="red"
//           />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
// });

// Profile.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TextInput } from 'react-native';
// import { supabase } from './supabase';

// export default function Profile({ navigation }) {
//   const [profile, setProfile] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     skills: '', // Will be converted from array to string for editing
//     linkedin_url: '',
//     github_url: '',
//     avatar_url: ''
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data, error } = await supabase
//         .from('users')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//       setFormData({
//         name: data.name || '',
//         skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
//         linkedin_url: data.linkedin_url || '',
//         github_url: data.github_url || '',
//         avatar_url: data.avatar_url || ''
//       });
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       // Convert skills string to array
//       const skillsArray = formData.skills.split(',').map(skill => skill.trim());

//       const { error } = await supabase
//         .from('users')
//         .update({
//           name: formData.name,
//           skills: skillsArray,
//           linkedin_url: formData.linkedin_url,
//           github_url: formData.github_url,
//           avatar_url: formData.avatar_url,
//           updated_at: new Date().toISOString()
//         })
//         .eq('user_id', user.id);

//       if (error) throw error;
//       setEditing(false);
//       fetchProfile();
//       navigation.navigate('Home');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       navigation.replace('Login');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   if (!profile) return <Text>Loading...</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile</Text>
      
//       {editing ? (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={formData.name}
//             onChangeText={(text) => setFormData({...formData, name: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Skills (comma separated)"
//             value={formData.skills}
//             onChangeText={(text) => setFormData({...formData, skills: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="LinkedIn URL"
//             value={formData.linkedin_url}
//             onChangeText={(text) => setFormData({...formData, linkedin_url: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="GitHub URL"
//             value={formData.github_url}
//             onChangeText={(text) => setFormData({...formData, github_url: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Avatar URL"
//             value={formData.avatar_url}
//             onChangeText={(text) => setFormData({...formData, avatar_url: text})}
//           />
//           <Button title="Save" onPress={handleSave} />
//         </>
//       ) : (
//         <>
//           {profile.avatar_url && (
//             <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
//           )}
//           <Text style={styles.label}>Name: {profile.name}</Text>
//           <Text style={styles.label}>Skills: {Array.isArray(profile.skills) ? profile.skills.join(', ') : ''}</Text>
//           {profile.linkedin_url && <Text style={styles.label}>LinkedIn: {profile.linkedin_url}</Text>}
//           {profile.github_url && <Text style={styles.label}>GitHub: {profile.github_url}</Text>}
          
//           <Button 
//             title="Edit Profile" 
//             onPress={() => setEditing(true)} 
//           />
//           <Button 
//             title="Logout" 
//             onPress={handleLogout} 
//             color="red"
//           />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
// });


// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TextInput, Image } from 'react-native';
// import { supabase } from './supabase';

// export default function Profile({ navigation }) {
//   const [profile, setProfile] = useState(null);
//   const [editing, setEditing] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     skills: '',
//     linkedin_url: '',
//     github_url: '',
//     avatar_url: ''
//   });

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', user.id)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//       setFormData({
//         name: data.name || '',
//         skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
//         linkedin_url: data.linkedin_url || '',
//         github_url: data.github_url || '',
//         avatar_url: data.avatar_url || ''
//       });
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       // Convert skills string to array
//       const skillsArray = formData.skills.split(',').map(skill => skill.trim());

//       const { error } = await supabase
//         .from('profiles')
//         .update({
//           name: formData.name,
//           skills: skillsArray,
//           linkedin_url: formData.linkedin_url,
//           github_url: formData.github_url,
//           avatar_url: formData.avatar_url
//         })
//         .eq('user_id', user.id);

//       if (error) throw error;
//       setEditing(false);
//       fetchProfile();
//       navigation.navigate('Home');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       const { error } = await supabase.auth.signOut();
//       if (error) throw error;
//       navigation.replace('Login');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   if (!profile) return <Text>Loading...</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Profile</Text>
      
//       {profile.avatar_url ? (
//         <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
//       ) : (
//         <View style={[styles.avatar, {backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'}]}>
//           <Text style={{fontSize: 24, fontWeight: 'bold'}}>
//             {profile.name?.charAt(0) || '?'}
//           </Text>
//         </View>
//       )}
      
//       {editing ? (
//         <>
//           <TextInput
//             style={styles.input}
//             placeholder="Name"
//             value={formData.name}
//             onChangeText={(text) => setFormData({...formData, name: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Skills (comma separated)"
//             value={formData.skills}
//             onChangeText={(text) => setFormData({...formData, skills: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="LinkedIn URL"
//             value={formData.linkedin_url}
//             onChangeText={(text) => setFormData({...formData, linkedin_url: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="GitHub URL"
//             value={formData.github_url}
//             onChangeText={(text) => setFormData({...formData, github_url: text})}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Avatar URL"
//             value={formData.avatar_url}
//             onChangeText={(text) => setFormData({...formData, avatar_url: text})}
//           />
//           <Button title="Save" onPress={handleSave} />
//         </>
//       ) : (
//         <>
//           <Text style={styles.label}>Name: {profile.name}</Text>
//           <Text style={styles.label}>Skills: {Array.isArray(profile.skills) ? profile.skills.join(', ') : ''}</Text>
//           {profile.linkedin_url && <Text style={styles.label}>LinkedIn: {profile.linkedin_url}</Text>}
//           {profile.github_url && <Text style={styles.label}>GitHub: {profile.github_url}</Text>}
          
//           <Button 
//             title="Edit Profile" 
//             onPress={() => setEditing(true)} 
//           />
//           <Button 
//             title="Logout" 
//             onPress={handleLogout} 
//             color="red"
//           />
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     fontWeight: 'bold',
//   },
//   avatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
// });
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity, TextInput, Image,ActivityIndicator} from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

export default function Profile({ navigation, route }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    linkedin_url: '',
    github_url: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route.params?.refresh) {
      fetchProfile();
    } else {
      fetchProfile();
    }
  }, [route.params?.refresh]);

  const fetchProfile = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
      setFormData({
        name: data.name || '',
        skills: Array.isArray(data.skills) ? data.skills.join(', ') : '',
        linkedin_url: data.linkedin_url || '',
        github_url: data.github_url || '',
        avatar_url: data.avatar_url || ''
      });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const skillsArray = formData.skills.split(',').map(skill => skill.trim());

      const { error } = await supabase
        .from('profiles')
        .update({
          name: formData.name,
          skills: skillsArray,
          linkedin_url: formData.linkedin_url,
          github_url: formData.github_url,
          avatar_url: formData.avatar_url
        })
        .eq('user_id', user.id);

      if (error) throw error;
      
      setEditing(false);
      fetchProfile();
      navigation.navigate('Home', { refresh: true });
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (!profile) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Profile</Text>
        {!editing && (
          <TouchableOpacity onPress={() => setEditing(true)}>
            <Ionicons name="create-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.avatarContainer}>
        {profile.avatar_url ? (
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{profile.name?.charAt(0) || '?'}</Text>
          </View>
        )}
      </View>

      {editing ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(text) => setFormData({...formData, name: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="Skills (comma separated)"
            value={formData.skills}
            onChangeText={(text) => setFormData({...formData, skills: text})}
          />
          <TextInput
            style={styles.input}
            placeholder="LinkedIn URL"
            value={formData.linkedin_url}
            onChangeText={(text) => setFormData({...formData, linkedin_url: text})}
            keyboardType="url"
          />
          <TextInput
            style={styles.input}
            placeholder="GitHub URL"
            value={formData.github_url}
            onChangeText={(text) => setFormData({...formData, github_url: text})}
            keyboardType="url"
          />
          <TextInput
            style={styles.input}
            placeholder="Avatar URL"
            value={formData.avatar_url}
            onChangeText={(text) => setFormData({...formData, avatar_url: text})}
            keyboardType="url"
          />

          <View style={styles.buttonGroup}>
            <TouchableOpacity 
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? 'Saving...' : 'Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]}
              onPress={() => setEditing(false)}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.profileInfo}>
            <Text style={styles.label}>Name</Text>
            <Text style={styles.value}>{profile.name}</Text>

            <Text style={styles.label}>Skills</Text>
            <Text style={styles.value}>
              {Array.isArray(profile.skills) ? profile.skills.join(', ') : ''}
            </Text>

            {profile.linkedin_url && (
              <>
                <Text style={styles.label}>LinkedIn</Text>
                <Text style={styles.value}>{profile.linkedin_url}</Text>
              </>
            )}

            {profile.github_url && (
              <>
                <Text style={styles.label}>GitHub</Text>
                <Text style={styles.value}>{profile.github_url}</Text>
              </>
            )}
          </View>

          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarContainer: {
    alignItems: 'center',
    marginVertical: 20
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#666'
  },
  profileInfo: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginTop: 10
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    backgroundColor: 'white'
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginTop: 10
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  saveButton: {
    backgroundColor: '#007AFF'
  },
  cancelButton: {
    backgroundColor: '#e0e0e0'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  logoutButton: {
    backgroundColor: '#F44336',
    padding: 15,
    borderRadius: 8,
    marginHorizontal: 15,
    alignItems: 'center'
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});