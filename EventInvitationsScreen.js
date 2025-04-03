// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
// import { supabase } from './supabase';
// import { Ionicons } from '@expo/vector-icons';

// const EventInvitationsScreen = ({ navigation }) => {
//   const [invitations, setInvitations] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     fetchUser();
//     fetchInvitations();
//   }, []);

//   const fetchUser = async () => {
//     const { data: { user } } = await supabase.auth.getUser();
//     setUser(user);
//   };

//   const fetchInvitations = async () => {
//     try {
//       setLoading(true);
      
//       const { data, error } = await supabase
//         .from('event_invitations')
//         .select(`
//           id,
//           event_id,
//           status,
//           created_at,
//           sender:profiles!sender_id(id, name, avatar_url),
//           event:events!event_id(id, title, date, location)
//         `)
//         .eq('receiver_id', user.id)
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setInvitations(data);
//     } catch (error) {
//       console.error('Error fetching invitations:', error.message);
//       Alert.alert('Error', 'Failed to load invitations');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAccept = async (invitationId, eventId) => {
//     try {
//       setLoading(true);
      
//       // Update invitation status
//       const { error: inviteError } = await supabase
//         .from('event_invitations')
//         .update({ status: 'accepted' })
//         .eq('id', invitationId);

//       if (inviteError) throw inviteError;
      
//       // Add user to event participants
//       const { error: participantError } = await supabase
//         .from('event_participants')
//         .insert([{ event_id: eventId, user_id: user.id }]);

//       if (participantError) throw participantError;
      
//       // Refresh data
//       fetchInvitations();
//       Alert.alert('Success', 'You have joined the event!');
//     } catch (error) {
//       console.error('Error accepting invitation:', error.message);
//       Alert.alert('Error', 'Failed to accept invitation');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDecline = async (invitationId) => {
//     try {
//       setLoading(true);
      
//       const { error } = await supabase
//         .from('event_invitations')
//         .update({ status: 'declined' })
//         .eq('id', invitationId);

//       if (error) throw error;
      
//       // Refresh data
//       fetchInvitations();
//     } catch (error) {
//       console.error('Error declining invitation:', error.message);
//       Alert.alert('Error', 'Failed to decline invitation');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderInvitationItem = ({ item }) => (
//     <View style={styles.invitationCard}>
//       <View style={styles.invitationHeader}>
//         {item.sender.avatar_url ? (
//           <Image source={{ uri: item.sender.avatar_url }} style={styles.avatar} />
//         ) : (
//           <View style={styles.avatarPlaceholder}>
//             <Text style={styles.avatarText}>{item.sender.name.charAt(0)}</Text>
//           </View>
//         )}
//         <View style={styles.invitationText}>
//           <Text style={styles.senderName}>{item.sender.name}</Text>
//           <Text style={styles.invitationMessage}>
//             invited you to {item.event.title}
//           </Text>
//           <Text style={styles.timeText}>
//             {new Date(item.created_at).toLocaleString()}
//           </Text>
//         </View>
//       </View>
      
//       <View style={styles.eventDetails}>
//         <Text style={styles.eventTitle}>{item.event.title}</Text>
//         <View style={styles.eventMeta}>
//           <Ionicons name="calendar" size={14} color="#666" />
//           <Text style={styles.eventText}>
//             {new Date(item.event.date).toLocaleDateString()}
//           </Text>
//         </View>
//         <View style={styles.eventMeta}>
//           <Ionicons name="location" size={14} color="#666" />
//           <Text style={styles.eventText}>
//             {item.event.location}
//           </Text>
//         </View>
//       </View>
      
//       {item.status === 'pending' ? (
//         <View style={styles.actions}>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.acceptButton]}
//             onPress={() => handleAccept(item.id, item.event_id)}
//             disabled={loading}
//           >
//             <Text style={styles.actionText}>Accept</Text>
//           </TouchableOpacity>
//           <TouchableOpacity 
//             style={[styles.actionButton, styles.declineButton]}
//             onPress={() => handleDecline(item.id)}
//             disabled={loading}
//           >
//             <Text style={styles.actionText}>Decline</Text>
//           </TouchableOpacity>
//         </View>
//       ) : (
//         <Text style={[
//           styles.statusText,
//           item.status === 'accepted' ? styles.acceptedText : styles.declinedText
//         ]}>
//           {item.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
//         </Text>
//       )}
//     </View>
//   );

//   if (loading && invitations.length === 0) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={invitations}
//         renderItem={renderInvitationItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//         ListEmptyComponent={
//           <View style={styles.emptyContainer}>
//             <Text style={styles.emptyText}>No event invitations yet</Text>
//           </View>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: '#f5f5f5',
//       padding: 15,
//     },
//     loadingContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//     },
//     title: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 20,
//       textAlign: 'center',
//     },
//     listContent: {
//       paddingBottom: 80,
//     },
//     emptyContainer: {
//       flex: 1,
//       justifyContent: 'center',
//       alignItems: 'center',
//       padding: 20,
//     },
//     emptyText: {
//       fontSize: 16,
//       color: '#666',
//     },
//     friendItem: {
//       flexDirection: 'row',
//       alignItems: 'center',
//       backgroundColor: 'white',
//       padding: 15,
//       borderRadius: 10,
//       marginBottom: 10,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 1 },
//       shadowOpacity: 0.1,
//       shadowRadius: 3,
//       elevation: 2,
//     },
//     selectedFriendItem: {
//       borderColor: '#4CAF50',
//       borderWidth: 1,
//     },
//     avatar: {
//       width: 50,
//       height: 50,
//       borderRadius: 25,
//       marginRight: 15,
//     },
//     avatarPlaceholder: {
//       width: 50,
//       height: 50,
//       borderRadius: 25,
//       backgroundColor: '#e1e1e1',
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginRight: 15,
//     },
//     avatarText: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       color: '#666',
//     },
//     friendName: {
//       fontSize: 16,
//       flex: 1,
//     },
//     checkIcon: {
//       marginLeft: 10,
//     },
//     inviteButton: {
//       position: 'absolute',
//       bottom: 20,
//       left: 20,
//       right: 20,
//       backgroundColor: '#0066cc',
//       padding: 15,
//       borderRadius: 8,
//       alignItems: 'center',
//     },
//     inviteButtonText: {
//       color: 'white',
//       fontWeight: 'bold',
//       fontSize: 16,
//     },
//   });
  
//   export default  EventInvitationsScreen;

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  Alert,
  RefreshControl 
} from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

const EventInvitationsScreen = ({ navigation }) => {
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      await fetchUser();
    };
    initializeData();
  }, []);

  useEffect(() => {
    if (user) {
      fetchInvitations();
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('Error', 'Failed to load user data. Please login again.');
      navigation.navigate('Login');
    }
  };

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('event_invitations')
        .select(`
          id,
          event_id,
          status,
          created_at,
          sender:profiles!sender_id(id, name, avatar_url),
          event:events!event_id(id, title, date, location)
        `)
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error.message);
      Alert.alert('Error', error.message || 'Failed to load invitations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleAccept = async (invitationId, eventId) => {
    try {
      setLoading(true);
      
      const { error: inviteError } = await supabase
        .from('event_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);

      if (inviteError) throw inviteError;
      
      const { error: participantError } = await supabase
        .from('event_participants')
        .insert([{ event_id: eventId, user_id: user.id }]);

      if (participantError) throw participantError;
      
      fetchInvitations();
      Alert.alert('Success', 'You have joined the event!');
    } catch (error) {
      console.error('Error accepting invitation:', error.message);
      Alert.alert('Error', error.message || 'Failed to accept invitation');
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (invitationId) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('event_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);

      if (error) throw error;
      
      fetchInvitations();
    } catch (error) {
      console.error('Error declining invitation:', error.message);
      Alert.alert('Error', error.message || 'Failed to decline invitation');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchInvitations();
  };

  const renderInvitationItem = ({ item }) => (
    <View style={styles.invitationCard}>
      <View style={styles.invitationHeader}>
        {item.sender.avatar_url ? (
          <Image source={{ uri: item.sender.avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{item.sender.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.invitationText}>
          <Text style={styles.senderName}>{item.sender.name}</Text>
          <Text style={styles.invitationMessage}>
            invited you to {item.event.title}
          </Text>
          <Text style={styles.timeText}>
            {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      </View>
      
      <View style={styles.eventDetails}>
        <Text style={styles.eventTitle}>{item.event.title}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="calendar" size={14} color="#666" />
          <Text style={styles.eventText}>
            {new Date(item.event.date).toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.eventMeta}>
          <Ionicons name="location" size={14} color="#666" />
          <Text style={styles.eventText}>
            {item.event.location}
          </Text>
        </View>
      </View>
      
      {item.status === 'pending' ? (
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAccept(item.id, item.event_id)}
            disabled={loading}
          >
            <Text style={styles.actionText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDecline(item.id)}
            disabled={loading}
          >
            <Text style={styles.actionText}>Decline</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[
          styles.statusText,
          item.status === 'accepted' ? styles.acceptedText : styles.declinedText
        ]}>
          {item.status === 'accepted' ? '✓ Accepted' : '✗ Declined'}
        </Text>
      )}
    </View>
  );

  if (loading && !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Event Invitations</Text>
      
      <FlatList
        data={invitations}
        renderItem={renderInvitationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No event invitations yet</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
  },
  listContent: {
    paddingBottom: 20,
  },
  invitationCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  invitationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  invitationText: {
    flex: 1,
  },
  senderName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  invitationMessage: {
    color: '#666',
    marginTop: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  eventDetails: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
    marginBottom: 15,
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventText: {
    marginLeft: 5,
    color: '#666',
    fontSize: 14,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  declineButton: {
    backgroundColor: '#F44336',
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
  },
  statusText: {
    textAlign: 'center',
    fontWeight: 'bold',
    padding: 8,
  },
  acceptedText: {
    color: '#4CAF50',
  },
  declinedText: {
    color: '#F44336',
  },
});

export default EventInvitationsScreen;