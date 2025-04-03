// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';
// import { supabase } from './supabase';

// export default function UserProfile({ route }) {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const { userId } = route.params;

//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', userId)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!profile) {
//     return (
//       <View style={styles.container}>
//         <Text>Profile not found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.profileHeader}>
//         {profile.avatar_url ? (
//           <Image source={{ uri: profile.avatar_url }} style={styles.profileAvatar} />
//         ) : (
//           <View style={[styles.profileAvatar, {backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center'}]}>
//             <Text style={{fontSize: 24, fontWeight: 'bold'}}>
//               {profile.name?.charAt(0) || '?'}
//             </Text>
//           </View>
//         )}
//         <Text style={styles.profileName}>{profile.name}</Text>
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Skills</Text>
//         <Text>{Array.isArray(profile.skills) ? profile.skills.join(', ') : ''}</Text>
//       </View>

//       {profile.linkedin_url && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>LinkedIn</Text>
//           <Text>{profile.linkedin_url}</Text>
//         </View>
//       )}

//       {profile.github_url && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>GitHub</Text>
//           <Text>{profile.github_url}</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileAvatar: {
//     width: 100,
//     height: 100,
//     borderRadius: 50,
//   },
//   profileName: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 5,
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function UserProfile({ navigation, route }) {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isFriend, setIsFriend] = useState(false);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [requestSent, setRequestSent] = useState(false);

//   useEffect(() => {
//     fetchProfile();
//     checkFriendship();
//   }, []);

//   const fetchCurrentUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     setCurrentUser(user);
//     return user;
//   };

//   const fetchProfile = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('*')
//         .eq('user_id', route.params.userId)
//         .single();

//       if (error) throw error;
//       setProfile(data);
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const checkFriendship = async () => {
//     try {
//       const user = await fetchCurrentUser();
      
//       const { data } = await supabase
//         .from('friend_requests')
//         .select('status, sender_id')
//         .or(
//           `and(sender_id.eq.${user.id},receiver_id.eq.${route.params.userId})`,
//           `and(sender_id.eq.${route.params.userId},receiver_id.eq.${user.id})`
//         )
//         .single();

//       setIsFriend(data?.status === 'accepted');
//       setRequestSent(data?.sender_id === user.id && data?.status === 'pending');
//     } catch (error) {
//       console.error('Friendship check error:', error);
//     }
//   };

//   const handleConnect = async () => {
//     try {
//       await supabase
//         .from('friend_requests')
//         .insert({
//           sender_id: currentUser.id,
//           receiver_id: route.params.userId,
//           status: 'pending'
//         });
      
//       setRequestSent(true);
//       Alert.alert('Request Sent', `Friend request sent to ${profile?.name}`);
//       navigation.navigate('Notifications');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.container}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   if (!profile) {
//     return (
//       <View style={styles.container}>
//         <Text>Profile not found</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => navigation.goBack()}>
//           <Ionicons name="arrow-back" size={24} color="#007AFF" />
//         </TouchableOpacity>
//         <Text style={styles.title}>{profile.name}'s Profile</Text>
//         <View style={{ width: 24 }} />
//       </View>

//       <View style={styles.profileHeader}>
//         {profile.avatar_url ? (
//           <Image source={{ uri: profile.avatar_url }} style={styles.profileAvatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>{profile.name?.charAt(0) || '?'}</Text>
//           </View>
//         )}
//       </View>

//       <View style={styles.section}>
//         <Text style={styles.sectionTitle}>Skills</Text>
//         <Text style={styles.sectionContent}>
//           {profile.skills?.join(', ') || 'No skills listed'}
//         </Text>
//       </View>

//       {profile.linkedin_url && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>LinkedIn</Text>
//           <Text style={styles.sectionContent}>{profile.linkedin_url}</Text>
//         </View>
//       )}

//       {profile.github_url && (
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>GitHub</Text>
//           <Text style={styles.sectionContent}>{profile.github_url}</Text>
//         </View>
//       )}

//       {!isFriend && !requestSent && currentUser?.id !== route.params.userId && (
//         <TouchableOpacity 
//           style={styles.connectButton}
//           onPress={handleConnect}
//         >
//           <Text style={styles.connectButtonText}>Connect</Text>
//         </TouchableOpacity>
//       )}

//       {requestSent && (
//         <View style={styles.pendingButton}>
//           <Text style={styles.pendingButtonText}>Request Sent</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     paddingTop: 50,
//     backgroundColor: 'white',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0'
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#333'
//   },
//   profileHeader: {
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: 'white',
//     marginBottom: 15
//   },
//   profileAvatar: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//   },
//   avatarPlaceholder: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   avatarText: {
//     fontSize: 40,
//     fontWeight: 'bold',
//     color: '#666'
//   },
//   section: {
//     backgroundColor: 'white',
//     padding: 15,
//     marginHorizontal: 15,
//     marginBottom: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007AFF',
//     marginBottom: 5
//   },
//   sectionContent: {
//     fontSize: 16,
//     color: '#333'
//   },
//   connectButton: {
//     backgroundColor: '#007AFF',
//     padding: 15,
//     borderRadius: 8,
//     margin: 15,
//     alignItems: 'center'
//   },
//   connectButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   pendingButton: {
//     backgroundColor: '#e0e0e0',
//     padding: 15,
//     borderRadius: 8,
//     margin: 15,
//     alignItems: 'center'
//   },
//   pendingButtonText: {
//     color: '#666',
//     fontWeight: 'bold',
//     fontSize: 16
//   }
// });


import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfile({ navigation, route }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFriend, setIsFriend] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchCurrentUser();
        await fetchProfile();
        await checkFriendship();
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile data');
        console.error('Loading error:', error);
      }
    };
    
    loadData();
  }, [route.params?.userId]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      if (!route.params?.userId) {
        throw new Error('No user ID provided');
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', route.params.userId)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Profile not found');
      
      setProfile(data);
    } catch (error) {
      console.error('Profile fetch error:', error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkFriendship = async () => {
    try {
      if (!currentUser?.id || !route.params?.userId) return;

      const { data, error } = await supabase
        .from('friend_requests')
        .select('status, sender_id')
        .or(
          `and(sender_id.eq.${currentUser.id},receiver_id.eq.${route.params.userId})`,
          `and(sender_id.eq.${route.params.userId},receiver_id.eq.${currentUser.id})`
        )
        .single();

      setIsFriend(data?.status === 'accepted');
      setRequestSent(data?.sender_id === currentUser.id && data?.status === 'pending');
    } catch (error) {
      console.error('Friendship check error:', error);
    }
  };

  const handleConnect = async () => {
    try {
      if (!currentUser?.id || !route.params?.userId) {
        throw new Error('User information missing');
      }

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: currentUser.id,
          receiver_id: route.params.userId,
          status: 'pending'
        });

      if (error) throw error;
      
      setRequestSent(true);
      Alert.alert('Request Sent', `Friend request sent to ${profile?.name || 'user'}`);
    } catch (error) {
      Alert.alert('Error', error.message);
      console.error('Connection error:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Profile not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{profile.name}'s Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileHeader}>
        {profile.avatar_url ? (
          <Image 
            source={{ uri: profile.avatar_url }} 
            style={styles.profileAvatar} 
            onError={() => console.log('Image load failed')}
          />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{profile.name?.charAt(0) || '?'}</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Skills</Text>
        <Text style={styles.sectionContent}>
          {profile.skills?.join(', ') || 'No skills listed'}
        </Text>
      </View>

      {profile.linkedin_url && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>LinkedIn</Text>
          <Text style={styles.sectionContent}>{profile.linkedin_url}</Text>
        </View>
      )}

      {profile.github_url && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>GitHub</Text>
          <Text style={styles.sectionContent}>{profile.github_url}</Text>
        </View>
      )}

      {!isFriend && !requestSent && currentUser?.id !== route.params.userId && (
        <TouchableOpacity 
          style={styles.connectButton}
          onPress={handleConnect}
          disabled={!currentUser}
        >
          <Text style={styles.connectButtonText}>Connect</Text>
        </TouchableOpacity>
      )}

      {requestSent && (
        <View style={styles.pendingButton}>
          <Text style={styles.pendingButtonText}>Request Sent</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333'
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center'
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    marginBottom: 15
  },
  profileAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5
  },
  sectionContent: {
    fontSize: 16,
    color: '#333'
  },
  connectButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    margin: 15,
    alignItems: 'center'
  },
  connectButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  pendingButton: {
    backgroundColor: '#e0e0e0',
    padding: 15,
    borderRadius: 8,
    margin: 15,
    alignItems: 'center'
  },
  pendingButtonText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 16
  }
});