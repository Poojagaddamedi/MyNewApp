/*import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, TouchableOpacity } from 'react-native';
import { supabase } from './supabase';

function HomeScreen({ userId, navigation }) {
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // Fetch friends and suggestions
  useEffect(() => {
    const fetchData = async () => {
      // Fetch current user's skills
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('skills')
        .eq('user_id', userId)
        .single();

      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return;
      }

      const userSkills = profileData.skills;

      // Fetch friends
      const friendsData = await fetchFriends(userId);
      setFriends(friendsData);

      // Fetch suggestions
      const suggestionsData = await fetchSuggestions(userId, userSkills);
      setSuggestions(suggestionsData);
    };

    fetchData();
  }, [userId]);

  // Fetch friends
  const fetchFriends = async (userId) => {
    const { data, error } = await supabase
      .from('friends')
      .select('friend_id, profiles(*)')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (error) {
      console.error('Error fetching friends:', error);
      return [];
    }

    // Map friend data to include profile information
    const friends = data.map((item) => ({
      ...item.profiles,
      friend_id: item.friend_id,
    }));

    return friends;
  };

  // Fetch suggestions
  const fetchSuggestions = async (userId, userSkills) => {
    const { data: suggestionsData, error: suggestionsError } = await supabase
      .from('profiles')
      .select('*')
      .contains('skills', userSkills) // Find users with overlapping skills
      .neq('user_id', userId); // Exclude the current user

    if (suggestionsError) {
      console.error('Error fetching suggestions:', suggestionsError);
      return [];
    }

    // Fetch the current user's friends
    const { data: friendsData, error: friendsError } = await supabase
      .from('friends')
      .select('friend_id')
      .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
      .eq('status', 'accepted');

    if (friendsError) {
      console.error('Error fetching friends:', friendsError);
      return [];
    }

    // Extract friend IDs
    const friendIds = friendsData.map((item) => item.friend_id);

    // Filter out users who are already friends
    const filteredSuggestions = suggestionsData.filter(
      (user) => !friendIds.includes(user.user_id)
    );

    return filteredSuggestions;
  };

  // Navigate to a user's profile
  const navigateToProfile = (userId) => {
    navigation.navigate('Profile', { userId });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends List</Text>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.friendItem}
            onPress={() => navigateToProfile(item.user_id)}
          >
            <Text style={styles.friendName}>{item.email}</Text>
            <Text style={styles.friendSkill}>Skills: {item.skills.join(', ')}</Text>
            <Text style={styles.friendSkill}>LinkedIn: {item.linkedin_url}</Text>
            <Text style={styles.friendSkill}>GitHub: {item.github_url}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.title}>Suggestions</Text>
      <FlatList
        data={suggestions}
        keyExtractor={(item) => item.user_id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.suggestionItem}
            onPress={() => navigateToProfile(item.user_id)}
          >
            <Text style={styles.suggestionName}>{item.email}</Text>
            <Text style={styles.suggestionSkill}>Skills: {item.skills.join(', ')}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  friendItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  friendName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  friendSkill: {
    fontSize: 14,
    color: '#666',
  },
  suggestionItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    elevation: 2,
  },
  suggestionName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  suggestionSkill: {
    fontSize: 14,
    color: '#666',
  },
});

export default HomeScreen;
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Button, Alert } from 'react-native';
import { supabase } from './supabase';

export default function HomeScreen({ navigation }) {
  const [recommendations, setRecommendations] = useState([]);
  const [userSkills, setUserSkills] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: user, error } = await supabase.auth.getUser();
      if (error) return Alert.alert('Error', error.message);

      const { data: profile } = await supabase.from('profiles').select('skills').eq('user_id', user.user.id).single();
      if (profile) {
        setUserSkills(profile.skills);
        fetchRecommendations(profile.skills);
      }
    };

    const fetchRecommendations = async (skills) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('linkedin, github, skills')
        .ilike('skills', `%${skills}%`); // Find users with similar skills

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        setRecommendations(data);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text>Your Skills: {userSkills}</Text>
      <Text>Recommended Users:</Text>
      <FlatList
        data={recommendations}
        keyExtractor={(item) => item.linkedin}
        renderItem={({ item }) => (
          <View style={{ marginVertical: 10 }}>
            <Text>LinkedIn: {item.linkedin}</Text>
            <Text>GitHub: {item.github}</Text>
            <Text>Skills: {item.skills}</Text>
          </View>
        )}
      />
      <Button title="Logout" onPress={async () => {
        await supabase.auth.signOut();
        navigation.navigate('Signup');
      }} />
    </View>
  );
}
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
//import { supabase } from './supabaseClient';
import { supabase } from './supabase';

export default function HomeScreen() {
  const [recommendations, setRecommendations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user.user) {
      console.error('Error fetching user:', userError);
      return;
    }
    setCurrentUser(user.user);
    fetchRecommendations(user.user.id);
  };

  const fetchRecommendations = async (userId) => {
    // Get the current user's skills
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('skills')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError);
      return;
    }

    const userSkills = userProfile.skills ? userProfile.skills.split(',') : [];

    // Fetch other users who have matching skills
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, skills')
      .neq('id', userId) // Exclude current user
      .limit(10);

    if (error) {
      console.error('Error fetching recommendations:', error);
      return;
    }

    // Filter users with at least one matching skill
    const filteredUsers = users.filter((user) =>
      user.skills && user.skills.split(',').some((skill) => userSkills.includes(skill))
    );

    setRecommendations(filteredUsers);
  };

  return (
    <View>
      <Text>Recommended Connections</Text>
      {recommendations.length > 0 ? (
        <FlatList
          data={recommendations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View>
              <Text>{item.name}</Text>
              <Text>Skills: {item.skills}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No matching users found.</Text>
      )}
    </View>
  );
}
*/
// HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet } from 'react-native';
// import { supabase } from './supabase';

// export default function HomeScreen() {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchRecommendations();
//   }, []);

//   const fetchRecommendations = async () => {
//     try {
//       setLoading(true);
      
//       // Get current user
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       // Get current user's profile
//       const { data: profile, error: profileError } = await supabase
//         .from('users')
//         .select('skills')
//         .eq('id', user.id)
//         .single();
      
//       if (profileError) throw profileError;

//       const userSkills = profile.skills?.split(',').map(s => s.trim()) || [];

//       // Find users with matching skills
//       const { data: users, error } = await supabase
//         .from('users')
//         .select('id, name, skills')
//         .neq('id', user.id) // Exclude current user
//         .limit(10);

//       if (error) throw error;

//       // Filter users with matching skills
//       const filteredUsers = users.filter(u => {
//         const otherSkills = u.skills?.split(',').map(s => s.trim()) || [];
//         return otherSkills.some(skill => userSkills.includes(skill));
//       });

//       setRecommendations(filteredUsers);
//     } catch (error) {
//       console.error('Error fetching recommendations:', error);
//       Alert.alert('Error', 'Failed to load recommendations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Recommended Connections</Text>
      
//       {loading ? (
//         <Text>Loading recommendations...</Text>
//       ) : recommendations.length > 0 ? (
//         <FlatList
//           data={recommendations}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <Text style={styles.name}>{item.name}</Text>
//               <Text style={styles.skills}>{item.skills}</Text>
//             </View>
//           )}
//         />
//       ) : (
//         <Text>No matching users found. Try adding more skills to your profile.</Text>
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
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1,
//     elevation: 2,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   skills: {
//     color: '#666',
//     marginTop: 5,
//   },
// });
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function HomeScreen({ navigation }) {
//   const [recommendations, setRecommendations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [userData, setUserData] = useState(null);

//   useEffect(() => {
//     fetchRecommendations();
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data: profile, error: profileError } = await supabase
//         .from('users')
//         .select('*')
//         .eq('id', user.id)
//         .single();
      
//       if (profileError) throw profileError;

//       setUserData(profile);
//     } catch (error) {
//       console.error('Error fetching user data:', error);
//     }
//   };

//   const fetchRecommendations = async () => {
//     try {
//       setLoading(true);
      
//       // Get current user
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       // Get current user's profile
//       const { data: profile, error: profileError } = await supabase
//         .from('users')
//         .select('skills')
//         .eq('id', user.id)
//         .single();
      
//       if (profileError) throw profileError;

//       const userSkills = profile.skills?.split(',').map(s => s.trim()) || [];

//       // Find users with matching skills
//       const { data: users, error } = await supabase
//         .from('users')
//         .select('id, name, skills, avatar_url')
//         .neq('id', user.id) // Exclude current user
//         .limit(10);

//       if (error) throw error;

//       // Filter users with matching skills
//       const filteredUsers = users.filter(u => {
//         const otherSkills = u.skills?.split(',').map(s => s.trim()) || [];
//         return otherSkills.some(skill => userSkills.includes(skill));
//       });

//       setRecommendations(filteredUsers);
//     } catch (error) {
//       console.error('Error fetching recommendations:', error);
//       Alert.alert('Error', 'Failed to load recommendations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendFriendRequest = async (userId) => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { error } = await supabase
//         .from('friend_requests')
//         .insert({
//           sender_id: user.id,
//           receiver_id: userId,
//           status: 'pending'
//         });

//       if (error) throw error;

//       Alert.alert('Success', 'Friend request sent!');
//     } catch (error) {
//       console.error('Error sending friend request:', error);
//       Alert.alert('Error', 'Failed to send friend request');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {/* Header with title and notification icon */}
//       <View style={styles.header}>
//         <Text style={styles.title}>Recommended Connections</Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
//           <Ionicons name="notifications-outline" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
      
//       {loading ? (
//         <Text>Loading recommendations...</Text>
//       ) : recommendations.length > 0 ? (
//         <FlatList
//           data={recommendations}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.card}>
//               <View style={styles.cardHeader}>
//                 {item.avatar_url ? (
//                   <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
//                 ) : (
//                   <View style={styles.avatarPlaceholder}>
//                     <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
//                   </View>
//                 )}
//                 <Text style={styles.name}>{item.name}</Text>
//               </View>
//               <Text style={styles.skills}>{item.skills}</Text>
//               <TouchableOpacity 
//                 style={styles.addButton}
//                 onPress={() => sendFriendRequest(item.id)}
//               >
//                 <Text style={styles.addButtonText}>Connect</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         />
//       ) : (
//         <Text>No matching users found. Try adding more skills to your profile.</Text>
//       )}

//       {/* Bottom Navigation */}
//       <View style={styles.bottomNav}>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Ionicons name="home" size={24} color="black" />
//           <Text>Home</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Events')}
//         >
//           <Ionicons name="calendar" size={24} color="black" />
//           <Text>Events</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Chatbot')}
//         >
//           <Ionicons name="chatbubbles" size={24} color="black" />
//           <Text>Chat</Text>
//         </TouchableOpacity>
        
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Profile', { userData })}
//         >
//           <Ionicons name="person" size={24} color="black" />
//           <Text>Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   avatarPlaceholder: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   avatarText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   skills: {
//     color: '#666',
//     marginBottom: 10,
//   },
//   addButton: {
//     backgroundColor: '#007AFF',
//     padding: 8,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
// });

// HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function HomeScreen({ navigation }) {
//   const [recommendations, setRecommendations] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('suggestions');

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       // Fetch recommendations
//       const { data: profile } = await supabase
//         .from('users')
//         .select('skills')
//         .eq('id', user.id)
//         .single();
      
//       const userSkills = profile.skills?.split(',').map(s => s.trim()) || [];

//       const { data: users } = await supabase
//         .from('users')
//         .select('id, name, skills, avatar_url')
//         .neq('id', user.id)
//         .limit(10);

//       const filteredUsers = users.filter(u => {
//         const otherSkills = u.skills?.split(',').map(s => s.trim()) || [];
//         return otherSkills.some(skill => userSkills.includes(skill));
//       });

//       setRecommendations(filteredUsers);

//       // Fetch friends
//       const { data: friendRequests } = await supabase
//         .from('friend_requests')
//         .select('sender_id, receiver_id, status')
//         .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
//         .eq('status', 'accepted');

//       const friendIds = friendRequests.map(req => 
//         req.sender_id === user.id ? req.receiver_id : req.sender_id
//       );

//       if (friendIds.length > 0) {
//         const { data: friendProfiles } = await supabase
//           .from('users')
//           .select('id, name, skills, avatar_url')
//           .in('id', friendIds);

//         setFriends(friendProfiles);
//       }

//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendFriendRequest = async (userId) => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { error } = await supabase
//         .from('friend_requests')
//         .insert({
//           sender_id: user.id,
//           receiver_id: userId,
//           status: 'pending'
//         });

//       if (error) throw error;
//       Alert.alert('Success', 'Friend request sent!');
//       fetchData();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         {item.avatar_url ? (
//           <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
//           </View>
//         )}
//         <Text style={styles.name}>{item.name}</Text>
//       </View>
//       <Text style={styles.skills}>{item.skills}</Text>
//       {activeTab === 'suggestions' && (
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => sendFriendRequest(item.id)}
//         >
//           <Text style={styles.addButtonText}>Connect</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>
//           {activeTab === 'suggestions' ? 'Suggestions' : 'Friends'}
//         </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
//           <Ionicons name="notifications-outline" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.tabs}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
//           onPress={() => setActiveTab('suggestions')}
//         >
//           <Text>Suggestions</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
//           onPress={() => setActiveTab('friends')}
//         >
//           <Text>Friends</Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <Text>Loading...</Text>
//       ) : activeTab === 'suggestions' ? (
//         recommendations.length > 0 ? (
//           <FlatList
//             data={recommendations}
//             keyExtractor={(item) => item.id}
//             renderItem={renderItem}
//           />
//         ) : (
//           <Text>No matching users found. Try adding more skills to your profile.</Text>
//         )
//       ) : friends.length > 0 ? (
//         <FlatList
//           data={friends}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//         />
//       ) : (
//         <Text>No friends yet. Connect with people!</Text>
//       )}

//       <View style={styles.bottomNav}>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Ionicons name="home" size={24} color="black" />
//           <Text>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Events')}
//         >
//           <Ionicons name="calendar" size={24} color="black" />
//           <Text>Events</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Chatbot')}
//         >
//           <Ionicons name="chatbubbles" size={24} color="black" />
//           <Text>Chat</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Profile')}
//         >
//           <Ionicons name="person" size={24} color="black" />
//           <Text>Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingBottom: 70,
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   tabs: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   tab: {
//     padding: 10,
//     marginRight: 10,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#007AFF',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.2,
//     shadowRadius: 1,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   avatar: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     marginRight: 10,
//   },
//   avatarPlaceholder: {
//     width: 40,
//     height: 40,
//     borderRadius: 20,
//     backgroundColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   avatarText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   skills: {
//     color: '#666',
//     marginBottom: 10,
//   },
//   addButton: {
//     backgroundColor: '#007AFF',
//     padding: 8,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   addButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
// });


// HomeScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function HomeScreen({ navigation }) {
//   const [recommendations, setRecommendations] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('suggestions');
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   /*const fetchCurrentUser = async () => {
//     const { data: { user }, error } = await supabase.auth.getUser();
//     if (error) throw error;
//     setCurrentUser(user);
//     return user;
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const user = await fetchCurrentUser();

//       // Fetch user's profile to get skills
//       const { data: profile, error: profileError } = await supabase
//         .from('users')
//         .select('skills')
//         .eq('id', user.id)
//         .single();

//       if (profileError) throw profileError;

//       const userSkills = profile.skills?.split(',').map(s => s.trim().toLowerCase()) || [];

//       // Fetch all users except current user
//       const { data: users, error: usersError } = await supabase
//         .from('users')
//         .select('id, name, skills, avatar_url')
//         .neq('id', user.id);

//       if (usersError) throw usersError;

//       // Filter users with matching skills
//       const filteredUsers = users.filter(u => {
//         if (!u.skills) return false;
//         const otherSkills = u.skills.split(',').map(s => s.trim().toLowerCase());
//         return otherSkills.some(skill => userSkills.includes(skill));
//       });

//       setRecommendations(filteredUsers);

//       // Fetch friends (accepted friend requests)
//       const { data: friendRequests, error: requestsError } = await supabase
//         .from('friend_requests')
//         .select('sender_id, receiver_id')
//         .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
//         .eq('status', 'accepted');

//       if (requestsError) throw requestsError;

//       const friendIds = friendRequests.map(req => 
//         req.sender_id === user.id ? req.receiver_id : req.sender_id
//       );

//       if (friendIds.length > 0) {
//         const { data: friendProfiles, error: friendsError } = await supabase
//           .from('users')
//           .select('id, name, skills, avatar_url')
//           .in('id', friendIds);

//         if (friendsError) throw friendsError;
//         setFriends(friendProfiles);
//       } else {
//         setFriends([]);
//       }

//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };*/
//   // HomeScreen.js (partial update - just the fetchData function)
// const fetchData = async () => {
//   try {
//     setLoading(true);
//     const user = await fetchCurrentUser();

//     // Fetch user's profile to get skills
//     const { data: profile, error: profileError } = await supabase
//       .from('users')
//       .select('skills')
//       .eq('user_id', user.id)
//       .single();

//     if (profileError) throw profileError;

//     const userSkills = profile.skills || [];

//     // Fetch all users except current user
//     const { data: users, error: usersError } = await supabase
//       .from('users')
//       .select('user_id, name, skills, avatar_url')
//       .neq('user_id', user.id);

//     if (usersError) throw usersError;

//     // Filter users with matching skills
//     const filteredUsers = users.filter(u => {
//       if (!u.skills || u.skills.length === 0) return false;
//       return u.skills.some(skill => userSkills.includes(skill));
//     });

//     setRecommendations(filteredUsers);

//     // Fetch friends (accepted friend requests)
//     const { data: friendRequests, error: requestsError } = await supabase
//       .from('friend_requests')
//       .select('sender_id, receiver_id')
//       .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
//       .eq('status', 'accepted');

//     if (requestsError) throw requestsError;

//     const friendIds = friendRequests.map(req => 
//       req.sender_id === user.id ? req.receiver_id : req.sender_id
//     );

//     if (friendIds.length > 0) {
//       const { data: friendProfiles, error: friendsError } = await supabase
//         .from('users')
//         .select('user_id, name, skills, avatar_url')
//         .in('user_id', friendIds);

//       if (friendsError) throw friendsError;
//       setFriends(friendProfiles);
//     } else {
//       setFriends([]);
//     }
//   } catch (error) {
//     Alert.alert('Error', error.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   const sendFriendRequest = async (receiverId) => {
//     try {
//       if (!currentUser) {
//         await fetchCurrentUser();
//       }

//       // Check if request already exists
//       const { data: existingRequest, error: checkError } = await supabase
//         .from('friend_requests')
//         .select('id, status')
//         .eq('sender_id', currentUser.id)
//         .eq('receiver_id', receiverId)
//         .maybeSingle();

//       if (checkError) throw checkError;

//       if (existingRequest) {
//         if (existingRequest.status === 'pending') {
//           Alert.alert('Info', 'Friend request already sent');
//         } else if (existingRequest.status === 'accepted') {
//           Alert.alert('Info', 'You are already friends');
//         }
//         return;
//       }

//       // Create new friend request
//       const { error } = await supabase
//         .from('friend_requests')
//         .insert({
//           sender_id: currentUser.id,
//           receiver_id: receiverId,
//           status: 'pending'
//         });

//       if (error) throw error;
      
//       Alert.alert('Success', 'Friend request sent!');
//       fetchData(); // Refresh the list
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         {item.avatar_url ? (
//           <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
//           </View>
//         )}
//         <View style={styles.userInfo}>
//           <Text style={styles.name}>{item.name}</Text>
//           <Text style={styles.skills}>{item.skills}</Text>
//         </View>
//       </View>
//       {activeTab === 'suggestions' && (
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => sendFriendRequest(item.id)}
//         >
//           <Text style={styles.addButtonText}>Connect</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>
//           {activeTab === 'suggestions' ? 'Suggestions' : 'Friends'}
//         </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
//           <Ionicons name="notifications-outline" size={24} color="black" />
//           <View style={styles.notificationBadge}>
//             <Text style={styles.notificationText}>3</Text>
//           </View>
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.tabs}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
//           onPress={() => setActiveTab('suggestions')}
//         >
//           <Text>Suggestions</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
//           onPress={() => setActiveTab('friends')}
//         >
//           <Text>Friends</Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" />
//         </View>
//       ) : activeTab === 'suggestions' ? (
//         recommendations.length > 0 ? (
//           <FlatList
//             data={recommendations}
//             keyExtractor={(item) => item.id}
//             renderItem={renderItem}
//             contentContainerStyle={styles.listContent}
//           />
//         ) : (
//           <View style={styles.emptyContainer}>
//             <Text>No matching users found. Try adding more skills to your profile.</Text>
//           </View>
//         )
//       ) : friends.length > 0 ? (
//         <FlatList
//           data={friends}
//           keyExtractor={(item) => item.id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text>No friends yet. Connect with people!</Text>
//         </View>
//       )}

//       <View style={styles.bottomNav}>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Ionicons name="home" size={24} color={activeTab === 'suggestions' ? '#007AFF' : 'black'} />
//           <Text style={activeTab === 'suggestions' ? styles.activeNavText : styles.navText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Events')}
//         >
//           <Ionicons name="calendar" size={24} color="black" />
//           <Text style={styles.navText}>Events</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Chatbot')}
//         >
//           <Ionicons name="chatbubbles" size={24} color="black" />
//           <Text style={styles.navText}>Chat</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Profile')}
//         >
//           <Ionicons name="person" size={24} color="black" />
//           <Text style={styles.navText}>Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingBottom: 70,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   notificationBadge: {
//     position: 'absolute',
//     right: -6,
//     top: -3,
//     backgroundColor: 'red',
//     borderRadius: 10,
//     width: 20,
//     height: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notificationText: {
//     color: 'white',
//     fontSize: 12,
//     fontWeight: 'bold',
//   },
//   tabs: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   tab: {
//     padding: 10,
//     marginRight: 15,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#007AFF',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   avatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   skills: {
//     color: '#666',
//     fontSize: 14,
//     marginTop: 2,
//   },
//   addButton: {
//     backgroundColor: '#007AFF',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   activeNavText: {
//     fontSize: 12,
//     marginTop: 4,
//     color: '#007AFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function HomeScreen({ navigation }) {
//   const [recommendations, setRecommendations] = useState([]);
//   const [friends, setFriends] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('suggestions');
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchCurrentUser = async () => {
//     const { data: { user }, error } = await supabase.auth.getUser();
//     if (error) throw error;
//     setCurrentUser(user);
//     return user;
//   };

//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const user = await fetchCurrentUser();

//       // Fetch user's profile to get skills
//       const { data: profile, error: profileError } = await supabase
//         .from('profiles')
//         .select('skills')
//         .eq('user_id', user.id)
//         .single();

//       if (profileError) throw profileError;

//       const userSkills = profile.skills || [];

//       // Fetch all users except current user
//       const { data: users, error: usersError } = await supabase
//         .from('profiles')
//         .select('user_id, name, skills, avatar_url')
//         .neq('user_id', user.id);

//       if (usersError) throw usersError;

//       // Filter users with matching skills
//       const filteredUsers = users.filter(u => {
//         if (!u.skills || u.skills.length === 0) return false;
//         return u.skills.some(skill => userSkills.includes(skill));
//       });

//       setRecommendations(filteredUsers);

//       // Fetch friends (accepted friend requests)
//       const { data: friendRequests, error: requestsError } = await supabase
//         .from('friend_requests')
//         .select('sender_id, receiver_id')
//         .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
//         .eq('status', 'accepted');

//       if (requestsError) throw requestsError;

//       const friendIds = friendRequests.map(req => 
//         req.sender_id === user.id ? req.receiver_id : req.sender_id
//       );

//       if (friendIds.length > 0) {
//         const { data: friendProfiles, error: friendsError } = await supabase
//           .from('profiles')
//           .select('user_id, name, skills, avatar_url')
//           .in('user_id', friendIds);

//         if (friendsError) throw friendsError;
//         setFriends(friendProfiles);
//       } else {
//         setFriends([]);
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sendFriendRequest = async (receiverId) => {
//     try {
//       if (!currentUser) {
//         await fetchCurrentUser();
//       }

//       // Check if request already exists
//       const { data: existingRequest, error: checkError } = await supabase
//         .from('friend_requests')
//         .select('id, status')
//         .eq('sender_id', currentUser.id)
//         .eq('receiver_id', receiverId)
//         .maybeSingle();

//       if (checkError) throw checkError;

//       if (existingRequest) {
//         if (existingRequest.status === 'pending') {
//           Alert.alert('Info', 'Friend request already sent');
//         } else if (existingRequest.status === 'accepted') {
//           Alert.alert('Info', 'You are already friends');
//         }
//         return;
//       }

//       // Create new friend request
//       const { error } = await supabase
//         .from('friend_requests')
//         .insert({
//           sender_id: currentUser.id,
//           receiver_id: receiverId,
//           status: 'pending'
//         });

//       if (error) throw error;
      
//       Alert.alert('Success', 'Friend request sent!');
//       fetchData(); // Refresh the list
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.card}>
//       <View style={styles.cardHeader}>
//         {item.avatar_url ? (
//           <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
//           </View>
//         )}
//         <View style={styles.userInfo}>
//           <Text style={styles.name}>{item.name}</Text>
//           <Text style={styles.skills}>{Array.isArray(item.skills) ? item.skills.join(', ') : ''}</Text>
//         </View>
//       </View>
//       {activeTab === 'suggestions' && (
//         <TouchableOpacity 
//           style={styles.addButton}
//           onPress={() => sendFriendRequest(item.user_id)}
//         >
//           <Text style={styles.addButtonText}>Connect</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>
//           {activeTab === 'suggestions' ? 'Suggestions' : 'Friends'}
//         </Text>
//         <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
//           <Ionicons name="notifications-outline" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
      
//       <View style={styles.tabs}>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
//           onPress={() => setActiveTab('suggestions')}
//         >
//           <Text>Suggestions</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
//           onPress={() => setActiveTab('friends')}
//         >
//           <Text>Friends</Text>
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <View style={styles.loadingContainer}>
//           <ActivityIndicator size="large" />
//         </View>
//       ) : activeTab === 'suggestions' ? (
//         recommendations.length > 0 ? (
//           <FlatList
//             data={recommendations}
//             keyExtractor={(item) => item.user_id}
//             renderItem={renderItem}
//             contentContainerStyle={styles.listContent}
//           />
//         ) : (
//           <View style={styles.emptyContainer}>
//             <Text>No matching users found. Try adding more skills to your profile.</Text>
//           </View>
//         )
//       ) : friends.length > 0 ? (
//         <FlatList
//           data={friends}
//           keyExtractor={(item) => item.user_id}
//           renderItem={renderItem}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text>No friends yet. Connect with people!</Text>
//         </View>
//       )}

//       <View style={styles.bottomNav}>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Home')}
//         >
//           <Ionicons name="home" size={24} color={activeTab === 'suggestions' ? '#007AFF' : 'black'} />
//           <Text style={activeTab === 'suggestions' ? styles.activeNavText : styles.navText}>Home</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Events')}
//         >
//           <Ionicons name="calendar" size={24} color="black" />
//           <Text style={styles.navText}>Events</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Chatbot')}
//         >
//           <Ionicons name="chatbubbles" size={24} color="black" />
//           <Text style={styles.navText}>Chat</Text>
//         </TouchableOpacity>
//         <TouchableOpacity 
//           style={styles.navItem}
//           onPress={() => navigation.navigate('Profile')}
//         >
//           <Ionicons name="person" size={24} color="black" />
//           <Text style={styles.navText}>Profile</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingBottom: 70,
//     backgroundColor: '#f5f5f5',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   tabs: {
//     flexDirection: 'row',
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#ccc',
//   },
//   tab: {
//     padding: 10,
//     marginRight: 15,
//   },
//   activeTab: {
//     borderBottomWidth: 2,
//     borderBottomColor: '#007AFF',
//   },
//   card: {
//     backgroundColor: '#fff',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   cardHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   userInfo: {
//     flex: 1,
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 10,
//   },
//   avatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#ccc',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: '600',
//   },
//   skills: {
//     color: '#666',
//     fontSize: 14,
//     marginTop: 2,
//   },
//   addButton: {
//     backgroundColor: '#007AFF',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   addButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     paddingVertical: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'white',
//   },
//   navItem: {
//     alignItems: 'center',
//   },
//   navText: {
//     fontSize: 12,
//     marginTop: 4,
//   },
//   activeNavText: {
//     fontSize: 12,
//     marginTop: 4,
//     color: '#007AFF',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });
// /

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }) {
  const [recommendations, setRecommendations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('suggestions');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchData();
    if (route.params?.refresh) {
      fetchFriends(currentUser?.id);
    }
  }, [route.params?.refresh]);

  const fetchCurrentUser = async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    setCurrentUser(user);
    return user;
  };

  
  // In your fetchData function in HomeScreen.js, modify the recommendations filtering:
const fetchData = async () => {
  try {
    setLoading(true);
    const user = await fetchCurrentUser();

    const { data: profile } = await supabase
      .from('profiles')
      .select('skills')
      .eq('user_id', user.id)
      .single();

    const userSkills = profile?.skills || [];

    // Get all friend connections (accepted)
    const { data: friendConnections } = await supabase
      .from('friend_requests')
      .select('sender_id, receiver_id')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .eq('status', 'accepted');

    const friendIds = friendConnections?.map(req => 
      req.sender_id === user.id ? req.receiver_id : req.sender_id
    ) || [];

    // Get all users except current user and friends
    const { data: users } = await supabase
      .from('profiles')
      .select('user_id, name, skills, avatar_url')
      .neq('user_id', user.id)
      .not('user_id', 'in', `(${friendIds.join(',')})`);

    // Filter by skills
    setRecommendations(
      users?.filter(u => u.skills?.some(skill => userSkills.includes(skill))) || []
    );

    await fetchFriends(user.id);
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const fetchFriends = async (userId) => {
    try {
      const { data: friendRequests } = await supabase
        .from('friend_requests')
        .select('sender_id, receiver_id')
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .eq('status', 'accepted');

      const friendIds = friendRequests?.map(req => 
        req.sender_id === userId ? req.receiver_id : req.sender_id
      ) || [];

      if (friendIds.length > 0) {
        const { data: friendProfiles } = await supabase
          .from('profiles')
          .select('user_id, name, skills, avatar_url')
          .in('user_id', friendIds);
        
        setFriends(friendProfiles || []);
      } else {
        setFriends([]);
      }
    } catch (error) {
      console.error('Fetch friends error:', error);
    }
  };

  const sendFriendRequest = async (receiverId, receiverName) => {
    try {
      if (!currentUser) await fetchCurrentUser();

      const { error } = await supabase
        .from('friend_requests')
        .insert({
          sender_id: currentUser.id,
          receiver_id: receiverId,
          status: 'pending'
        });

      if (error) throw error;
      
      Alert.alert('Request Sent', `Friend request sent to ${receiverName}`);
      fetchData();
      navigation.navigate('Notifications');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const viewProfile = (userId, name) => {
    navigation.navigate('UserProfile', { 
      userId,
      name,
      onGoBack: () => fetchData()
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => viewProfile(item.user_id, item.name)}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {item.avatar_url ? (
            <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.skills} numberOfLines={1}>
              {item.skills?.join(', ') || ''}
            </Text>
          </View>
        </View>
        {activeTab === 'suggestions' && (
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => sendFriendRequest(item.user_id, item.name)}
          >
            <Text style={styles.addButtonText}>Connect</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          {activeTab === 'suggestions' ? 'Suggestions' : 'Friends'}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          <Ionicons name="notifications-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.tabs}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'suggestions' && styles.activeTab]}
          onPress={() => setActiveTab('suggestions')}
        >
          <Text style={activeTab === 'suggestions' ? styles.activeTabText : styles.tabText}>Suggestions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'friends' && styles.activeTab]}
          onPress={() => setActiveTab('friends')}
        >
          <Text style={activeTab === 'friends' ? styles.activeTabText : styles.tabText}>Friends</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <FlatList
          data={activeTab === 'suggestions' ? recommendations : friends}
          keyExtractor={(item) => item.user_id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {activeTab === 'suggestions' 
                  ? 'No matching users found. Update your skills to see more.' 
                  : 'No friends yet. Connect with people!'}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        />
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Home')}
        >
          <Ionicons name="home" size={24} color="#007AFF" />
          <Text style={styles.activeNavText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Events')}
        >
          <Ionicons name="calendar" size={24} color="#888" />
          <Text style={styles.navText}>Events</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons name="chatbubbles" size={24} color="#888" />
          <Text style={styles.navText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <Ionicons name="person" size={24} color="#888" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingBottom: 70
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0'
  },
  tab: {
    flex: 1,
    padding: 15,
    alignItems: 'center'
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF'
  },
  tabText: {
    color: '#666'
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '600'
  },
  card: {
    backgroundColor: 'white',
    marginHorizontal: 15,
    marginVertical: 8,
    borderRadius: 12,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666'
  },
  userInfo: {
    flex: 1
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333'
  },
  skills: {
    fontSize: 14,
    color: '#666',
    marginTop: 4
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0
  },
  navItem: {
    alignItems: 'center'
  },
  navText: {
    fontSize: 12,
    color: '#888',
    marginTop: 4
  },
  activeNavText: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 4
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30
  },
  emptyText: {
    textAlign: 'center',
    color: '#666'
  },
  listContent: {
    paddingVertical: 15
  }
});