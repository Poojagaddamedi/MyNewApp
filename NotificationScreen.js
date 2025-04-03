// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
// import { supabase } from './supabase';

// function NotificationScreen({ userId, navigation }) {
//   const [notifications, setNotifications] = useState([]);

//   // Fetch notifications (pending friend requests)
//   useEffect(() => {
//     const fetchNotifications = async () => {
//       const { data, error } = await supabase
//         .from('friends')
//         .select('id, user_id, profiles(*)')
//         .eq('friend_id', userId)
//         .eq('status', 'pending');

//       if (error) {
//         console.error('Error fetching notifications:', error);
//         return;
//       }

//       setNotifications(data);
//     };

//     fetchNotifications();
//   }, [userId]);

//   // Accept friend request
//   const acceptFriendRequest = async (requestId) => {
//     const { data, error } = await supabase
//       .from('friends')
//       .update({ status: 'accepted' })
//       .eq('id', requestId);

//     if (error) {
//       console.error('Error accepting friend request:', error);
//       return;
//     }

//     // Remove the accepted request from notifications
//     setNotifications((prev) => prev.filter((item) => item.id !== requestId));

//     // Navigate to HomeScreen to see the updated Friends List
//     navigation.navigate('Home');
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Notifications</Text>
//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.notificationItem}>
//             <Text style={styles.notificationText}>
//               {item.profiles.email} sent you a friend request.
//             </Text>
//             <Button
//               title="Accept"
//               onPress={() => acceptFriendRequest(item.id)}
//             />
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f8f8f8',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     color: '#333',
//   },
//   notificationItem: {
//     backgroundColor: 'white',
//     padding: 16,
//     marginBottom: 10,
//     borderRadius: 8,
//     elevation: 2,
//   },
//   notificationText: {
//     fontSize: 16,
//     color: '#333',
//     marginBottom: 8,
//   },
// });

// export default NotificationScreen;
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
// import { supabase } from './supabase';

// export default function NotificationsScreen() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data, error } = await supabase
//         .from('friend_requests')
//         .select(`
//           id,
//           status,
//           created_at,
//           sender:users!sender_id(name)
//         `)
//         .eq('receiver_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setNotifications(data);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .update({ status: 'accepted' })
//         .eq('id', requestId);

//       if (error) throw error;
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   if (loading) return <Text>Loading...</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Notifications</Text>
      
//       {notifications.length > 0 ? (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.notification}>
//               <Text>{item.sender.name} sent you a friend request</Text>
//               {item.status === 'pending' && (
//                 <Button 
//                   title="Accept" 
//                   onPress={() => handleAccept(item.id)} 
//                 />
//               )}
//               {item.status === 'accepted' && (
//                 <Text style={styles.accepted}>Accepted</Text>
//               )}
//             </View>
//           )}
//         />
//       ) : (
//         <Text>No notifications</Text>
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
//   notification: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   accepted: {
//     color: 'green',
//   },
// });

// NotificationScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function NotificationScreen({ navigation }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data, error } = await supabase
//         .from('friend_requests')
//         .select(`
//           id,
//           status,
//           created_at,
//           sender:users!sender_id(name, avatar_url)
//         `)
//         .eq('receiver_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setNotifications(data);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .update({ status: 'accepted' })
//         .eq('id', requestId);

//       if (error) throw error;
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleDecline = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .delete()
//         .eq('id', requestId);

//       if (error) throw error;
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   if (loading) return <Text>Loading...</Text>;

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Notifications</Text>
      
//       {notifications.length > 0 ? (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.notification}>
//               <View style={styles.notificationHeader}>
//                 {item.sender.avatar_url ? (
//                   <Image source={{ uri: item.sender.avatar_url }} style={styles.avatar} />
//                 ) : (
//                   <View style={styles.avatarPlaceholder}>
//                     <Text style={styles.avatarText}>{item.sender.name.charAt(0)}</Text>
//                   </View>
//                 )}
//                 <Text>{item.sender.name} sent you a friend request</Text>
//               </View>
              
//               {item.status === 'pending' && (
//                 <View style={styles.actions}>
//                   <TouchableOpacity 
//                     style={[styles.actionButton, styles.acceptButton]}
//                     onPress={() => handleAccept(item.id)}
//                   >
//                     <Text style={styles.actionText}>Accept</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity 
//                     style={[styles.actionButton, styles.declineButton]}
//                     onPress={() => handleDecline(item.id)}
//                   >
//                     <Text style={styles.actionText}>Decline</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//               {item.status === 'accepted' && (
//                 <Text style={styles.accepted}>Accepted</Text>
//               )}
//             </View>
//           )}
//         />
//       ) : (
//         <Text>No notifications</Text>
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
//   notification: {
//     padding: 15,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   notificationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
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
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     marginTop: 10,
//   },
//   actionButton: {
//     padding: 8,
//     borderRadius: 5,
//     width: '45%',
//     alignItems: 'center',
//   },
//   acceptButton: {
//     backgroundColor: '#4CAF50',
//   },
//   declineButton: {
//     backgroundColor: '#F44336',
//   },
//   actionText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   accepted: {
//     color: 'green',
//     textAlign: 'center',
//     marginTop: 5,
//   },
// });

// // NotificationScreen.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function NotificationScreen({ navigation }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   /*const fetchNotifications = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data, error } = await supabase
//         .from('friend_requests')
//         .select(`
//           id,
//           status,
//           created_at,
//           sender:users!sender_id(id, name, avatar_url, skills)
//         `)
//         .eq('receiver_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setNotifications(data);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };*/
//   // NotificationScreen.js (partial update - just the fetchNotifications function)
// const fetchNotifications = async () => {
//   try {
//     const { data: { user }, error: userError } = await supabase.auth.getUser();
//     if (userError) throw userError;

//     const { data, error } = await supabase
//       .from('friend_requests')
//       .select(`
//         id,
//         status,
//         created_at,
//         sender:users!sender_id(user_id, name, avatar_url, skills)
//       `)
//       .eq('receiver_id', user.id)
//       .order('created_at', { ascending: false });

//     if (error) throw error;
//     setNotifications(data);
//   } catch (error) {
//     Alert.alert('Error', error.message);
//   } finally {
//     setLoading(false);
//   }
// };

//   const handleAccept = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .update({ status: 'accepted' })
//         .eq('id', requestId);

//       if (error) throw error;
      
//       Alert.alert('Success', 'Friend request accepted!');
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleDecline = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .delete()
//         .eq('id', requestId);

//       if (error) throw error;
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Notifications</Text>
//         <TouchableOpacity onPress={fetchNotifications}>
//           <Ionicons name="refresh" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
      
//       {notifications.length > 0 ? (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.notification}>
//               <View style={styles.notificationHeader}>
//                 {item.sender.avatar_url ? (
//                   <Image source={{ uri: item.sender.avatar_url }} style={styles.avatar} />
//                 ) : (
//                   <View style={styles.avatarPlaceholder}>
//                     <Text style={styles.avatarText}>{item.sender.name.charAt(0)}</Text>
//                   </View>
//                 )}
//                 <View style={styles.notificationText}>
//                   <Text style={styles.senderName}>{item.sender.name}</Text>
//                   <Text>{item.status === 'pending' ? 'sent you a friend request' : 'is now your friend'}</Text>
//                 </View>
//               </View>
              
//               {item.status === 'pending' && (
//                 <View style={styles.actions}>
//                   <TouchableOpacity 
//                     style={[styles.actionButton, styles.acceptButton]}
//                     onPress={() => handleAccept(item.id)}
//                   >
//                     <Text style={styles.actionText}>Accept</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity 
//                     style={[styles.actionButton, styles.declineButton]}
//                     onPress={() => handleDecline(item.id)}
//                   >
//                     <Text style={styles.actionText}>Decline</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//               {item.status === 'accepted' && (
//                 <Text style={styles.acceptedText}>✓ Accepted</Text>
//               )}
//             </View>
//           )}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text>No notifications yet</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notification: {
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
//   notificationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
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
//   notificationText: {
//     flex: 1,
//   },
//   senderName: {
//     fontWeight: 'bold',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   actionButton: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   acceptButton: {
//     backgroundColor: '#4CAF50',
//   },
//   declineButton: {
//     backgroundColor: '#F44336',
//   },
//   actionText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   acceptedText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function NotificationScreen({ navigation }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       const { data: { user }, error: userError } = await supabase.auth.getUser();
//       if (userError) throw userError;

//       const { data, error } = await supabase
//         .from('friend_requests')
//         .select(`
//           id,
//           status,
//           created_at,
//           sender:profiles!sender_id(user_id, name, avatar_url, skills)
//         `)
//         .eq('receiver_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setNotifications(data);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /*const handleAccept = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .update({ status: 'accepted' })
//         .eq('id', requestId);

//       if (error) throw error;
      
//       Alert.alert('Success', 'Friend request accepted!');
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const handleDecline = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .delete()
//         .eq('id', requestId);

//       if (error) throw error;
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };*/
//   // Update the handleAccept function in NotificationScreen.js
// const handleAccept = async (requestId) => {
//   try {
//     const { error } = await supabase
//       .from('friend_requests')
//       .update({ status: 'accepted' })
//       .eq('id', requestId);

//     if (error) throw error;
    
//     Alert.alert('Success', 'Friend request accepted!');
//     fetchNotifications();
    
//     // Optionally navigate to the new friend's profile
//     const acceptedRequest = notifications.find(n => n.id === requestId);
//     if (acceptedRequest) {
//       navigation.navigate('UserProfile', { userId: acceptedRequest.sender.user_id });
//     }
//   } catch (error) {
//     Alert.alert('Error', error.message);
//   }
// };

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Notifications</Text>
//         <TouchableOpacity onPress={fetchNotifications}>
//           <Ionicons name="refresh" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
      
//       {notifications.length > 0 ? (
//         <FlatList
//           data={notifications}
//           keyExtractor={(item) => item.id}
//           renderItem={({ item }) => (
//             <View style={styles.notification}>
//               <View style={styles.notificationHeader}>
//                 {item.sender.avatar_url ? (
//                   <Image source={{ uri: item.sender.avatar_url }} style={styles.avatar} />
//                 ) : (
//                   <View style={styles.avatarPlaceholder}>
//                     <Text style={styles.avatarText}>{item.sender.name.charAt(0)}</Text>
//                   </View>
//                 )}
//                 <View style={styles.notificationText}>
//                   <Text style={styles.senderName}>{item.sender.name}</Text>
//                   <Text>{item.status === 'pending' ? 'sent you a friend request' : 'is now your friend'}</Text>
//                 </View>
//               </View>
              
//               {item.status === 'pending' && (
//                 <View style={styles.actions}>
//                   <TouchableOpacity 
//                     style={[styles.actionButton, styles.acceptButton]}
//                     onPress={() => handleAccept(item.id)}
//                   >
//                     <Text style={styles.actionText}>Accept</Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity 
//                     style={[styles.actionButton, styles.declineButton]}
//                     onPress={() => handleDecline(item.id)}
//                   >
//                     <Text style={styles.actionText}>Decline</Text>
//                   </TouchableOpacity>
//                 </View>
//               )}
//               {item.status === 'accepted' && (
//                 <Text style={styles.acceptedText}>✓ Accepted</Text>
//               )}
//             </View>
//           )}
//           contentContainerStyle={styles.listContent}
//         />
//       ) : (
//         <View style={styles.emptyContainer}>
//           <Text>No notifications yet</Text>
//         </View>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
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
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   notification: {
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
//   notificationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10,
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
//   notificationText: {
//     flex: 1,
//   },
//   senderName: {
//     fontWeight: 'bold',
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
//   actionButton: {
//     flex: 1,
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//     marginHorizontal: 5,
//   },
//   acceptButton: {
//     backgroundColor: '#4CAF50',
//   },
//   declineButton: {
//     backgroundColor: '#F44336',
//   },
//   actionText: {
//     color: 'white',
//     fontWeight: 'bold',
//   },
//   acceptedText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 5,
//   },
//   listContent: {
//     paddingBottom: 20,
//   },
// });

// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// export default function NotificationScreen({ navigation }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentUser, setCurrentUser] = useState(null);

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchCurrentUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     setCurrentUser(user);
//     return user;
//   };

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const user = await fetchCurrentUser();

//       const { data, error } = await supabase
//         .from('friend_requests')
//         .select(`
//           id,
//           status,
//           created_at,
//           sender:profiles!sender_id(user_id, name, avatar_url, skills)
//         `)
//         .eq('receiver_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setNotifications(data || []);
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /*const handleAccept = async (requestId, senderId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .update({ status: 'accepted' })
//         .eq('id', requestId);

//       if (error) throw error;
      
//       // Refresh data
//       fetchNotifications();
//       navigation.navigate('Home', { refresh: true });
      
//       Alert.alert('Accepted', 'You are now friends!');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };*/
//   const handleAccept = async (requestId, senderId) => {
//     try {
//       setLoading(true);
//       const { error } = await supabase
//         .from('friend_requests')
//         .update({ status: 'accepted' })
//         .eq('id', requestId);
  
//       if (error) throw error;
      
//       // Remove from notifications and refresh home screen
//       setNotifications(prev => prev.filter(n => n.id !== requestId));
//       navigation.navigate('Home', { refresh: true });
      
//       Alert.alert('Accepted', 'You are now friends!');
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDecline = async (requestId) => {
//     try {
//       const { error } = await supabase
//         .from('friend_requests')
//         .delete()
//         .eq('id', requestId);

//       if (error) throw error;
//       fetchNotifications();
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     }
//   };

//   const renderItem = ({ item }) => (
//     <View style={styles.notification}>
//       <View style={styles.notificationHeader}>
//         {item.sender.avatar_url ? (
//           <Image source={{ uri: item.sender.avatar_url }} style={styles.avatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>{item.sender.name.charAt(0)}</Text>
//           </View>
//         )}
//         <View style={styles.notificationText}>
//           <Text style={styles.senderName}>{item.sender.name}</Text>
//           <Text style={styles.notificationMessage}>
//             {item.status === 'pending' 
//               ? 'sent you a friend request' 
//               : 'is now your friend'}
//           </Text>
//           <Text style={styles.timeText}>
//             {new Date(item.created_at).toLocaleString()}
//           </Text>
//         </View>
//       </View>
      
//       {item.status === 'pending' && (
//         <View style={styles.actions}>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.acceptButton]}
//             onPress={() => handleAccept(item.id, item.sender.user_id)}
//           >
//             <Text style={styles.actionText}>Accept</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.declineButton]}
//             onPress={() => handleDecline(item.id)}
//           >
//             <Text style={styles.actionText}>Decline</Text>
//           </TouchableOpacity>
//         </View>
//       )}
//       {item.status === 'accepted' && (
//         <Text style={styles.acceptedText}>✓ Accepted</Text>
//       )}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>Notifications</Text>
//         <TouchableOpacity onPress={fetchNotifications}>
//           <Ionicons name="refresh" size={24} color="black" />
//         </TouchableOpacity>
//       </View>
      
//       <FlatList
//         data={notifications}
//         keyExtractor={(item) => item.id}
//         renderItem={renderItem}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No notifications yet</Text>
//           </View>
//         }
//       />
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
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#333'
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 30
//   },
//   emptyText: {
//     color: '#666',
//     fontSize: 16
//   },
//   notification: {
//     backgroundColor: 'white',
//     marginHorizontal: 15,
//     marginVertical: 8,
//     borderRadius: 12,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2
//   },
//   notificationHeader: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 10
//   },
//   avatar: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     marginRight: 12
//   },
//   avatarPlaceholder: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: '#e0e0e0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginRight: 12
//   },
//   avatarText: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#666'
//   },
//   notificationText: {
//     flex: 1
//   },
//   senderName: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     color: '#333'
//   },
//   notificationMessage: {
//     color: '#666',
//     marginTop: 2
//   },
//   timeText: {
//     fontSize: 12,
//     color: '#999',
//     marginTop: 4
//   },
//   actions: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10
//   },
//   actionButton: {
//     flex: 1,
//     padding: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginHorizontal: 5
//   },
//   acceptButton: {
//     backgroundColor: '#4CAF50'
//   },
//   declineButton: {
//     backgroundColor: '#F44336'
//   },
//   actionText: {
//     color: 'white',
//     fontWeight: 'bold'
//   },
//   acceptedText: {
//     color: '#4CAF50',
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginTop: 5
//   },
//   listContent: {
//     paddingVertical: 15
//   }
// });

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function NotificationScreen() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    return user;
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const user = await fetchCurrentUser();

      // Fetch all notifications
      const { data, error } = await supabase
        .from('notifications')
        .select(`
          id,
          type,
          is_read,
          created_at,
          reference_id,
          friend_request:friend_requests!reference_id(
            id,
            status,
            created_at,
            sender:profiles!sender_id(user_id, name, avatar_url, skills)
          ),
          event_invitation:event_invitations!reference_id(
            id,
            status,
            created_at,
            sender:profiles!sender_id(user_id, name, avatar_url),
            event:events!event_id(id, title)
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptFriendRequest = async (requestId) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', requestId);

      if (error) throw error;
      
      // Remove from notifications and refresh home screen
      setNotifications(prev => prev.filter(n => n.reference_id !== requestId));
      navigation.navigate('Home', { refresh: true });
      
      Alert.alert('Accepted', 'You are now friends!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineFriendRequest = async (requestId) => {
    try {
      const { error } = await supabase
        .from('friend_requests')
        .delete()
        .eq('id', requestId);

      if (error) throw error;
      setNotifications(prev => prev.filter(n => n.reference_id !== requestId));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleAcceptEventInvitation = async (invitationId, eventId) => {
    try {
      setLoading(true);
      
      // Update invitation status
      const { error: inviteError } = await supabase
        .from('event_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (inviteError) throw inviteError;
      
      // Add user to event participants
      const { data: { user } } = await supabase.auth.getUser();
      const { error: participantError } = await supabase
        .from('event_participants')
        .insert([{ event_id: eventId, user_id: user.id }]);

      if (participantError) throw participantError;
      
      // Remove from notifications
      setNotifications(prev => prev.filter(n => n.reference_id !== invitationId));
      Alert.alert('Success', 'You have joined the event!');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeclineEventInvitation = async (invitationId) => {
    try {
      const { error } = await supabase
        .from('event_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      if (error) throw error;
      setNotifications(prev => prev.filter(n => n.reference_id !== invitationId));
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const renderItem = ({ item }) => {
    if (item.type === 'friend_request') {
      return (
        <View style={styles.notification}>
          <View style={styles.notificationHeader}>
            {item.friend_request.sender.avatar_url ? (
              <Image source={{ uri: item.friend_request.sender.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.friend_request.sender.name.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.notificationText}>
              <Text style={styles.senderName}>{item.friend_request.sender.name}</Text>
              <Text style={styles.notificationMessage}>
                {item.friend_request.status === 'pending' 
                  ? 'sent you a friend request' 
                  : 'is now your friend'}
              </Text>
              <Text style={styles.timeText}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          </View>
          
          {item.friend_request.status === 'pending' && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAcceptFriendRequest(item.reference_id)}
              >
                <Text style={styles.actionText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleDeclineFriendRequest(item.reference_id)}
              >
                <Text style={styles.actionText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
          {item.friend_request.status === 'accepted' && (
            <Text style={styles.acceptedText}>✓ Accepted</Text>
          )}
        </View>
      );
    } else if (item.type === 'event_invite') {
      return (
        <View style={styles.notification}>
          <View style={styles.notificationHeader}>
            {item.event_invitation.sender.avatar_url ? (
              <Image source={{ uri: item.event_invitation.sender.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>{item.event_invitation.sender.name.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.notificationText}>
              <Text style={styles.senderName}>{item.event_invitation.sender.name}</Text>
              <Text style={styles.notificationMessage}>
                invited you to {item.event_invitation.event.title}
              </Text>
              <Text style={styles.timeText}>
                {new Date(item.created_at).toLocaleString()}
              </Text>
            </View>
          </View>
          
          {item.event_invitation.status === 'pending' && (
            <View style={styles.actions}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleAcceptEventInvitation(item.reference_id, item.event_invitation.event.id)}
              >
                <Text style={styles.actionText}>Accept</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.declineButton]}
                onPress={() => handleDeclineEventInvitation(item.reference_id)}
              >
                <Text style={styles.actionText}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
          {item.event_invitation.status === 'accepted' && (
            <Text style={styles.acceptedText}>✓ Accepted</Text>
          )}
          {item.event_invitation.status === 'declined' && (
            <Text style={styles.declinedText}>✗ Declined</Text>
          )}
        </View>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity onPress={fetchNotifications}>
          <Ionicons name="refresh" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        }
      />
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333'
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
    color: '#666',
    fontSize: 16
  },
  notification: {
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
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
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
  notificationText: {
    flex: 1
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333'
  },
  notificationMessage: {
    color: '#666',
    marginTop: 2
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5
  },
  acceptButton: {
    backgroundColor: '#4CAF50'
  },
  declineButton: {
    backgroundColor: '#F44336'
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold'
  },
  acceptedText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5
  },
  declinedText: {
    color: '#F44336',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5
  },
  listContent: {
    paddingVertical: 15
  }
});