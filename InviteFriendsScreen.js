import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

const InviteFriendsScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedFriends, setSelectedFriends] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchFriends();
  }, []);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchFriends = async () => {
    try {
      setLoading(true);
      
      // Get accepted friend requests where current user is either sender or receiver
      const { data, error } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          sender:profiles!sender_id(id, name, avatar_url),
          receiver:profiles!receiver_id(id, name, avatar_url)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .eq('status', 'accepted');

      if (error) throw error;

      // Filter to get only friends (not the current user)
      const friendsList = data.map(request => {
        return request.sender_id === user.id ? request.receiver : request.sender;
      });

      setFriends(friendsList);
    } catch (error) {
      console.error('Error fetching friends:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFriendSelection = (friendId) => {
    setSelectedFriends(prev => 
      prev.includes(friendId) 
        ? prev.filter(id => id !== friendId) 
        : [...prev, friendId]
    );
  };

  const sendInvitations = async () => {
    if (selectedFriends.length === 0) {
      Alert.alert('No Friends Selected', 'Please select at least one friend to invite');
      return;
    }

    try {
      setLoading(true);
      
      const invitations = selectedFriends.map(friendId => ({
        event_id: eventId,
        sender_id: user.id,
        receiver_id: friendId,
        status: 'pending'
      }));

      const { error } = await supabase
        .from('event_invitations')
        .insert(invitations);

      if (error) throw error;
      
      Alert.alert('Success', 'Invitations sent successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error sending invitations:', error.message);
      Alert.alert('Error', 'Failed to send invitations');
    } finally {
      setLoading(false);
    }
  };

  const renderFriendItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.friendItem,
        selectedFriends.includes(item.id) && styles.selectedFriendItem
      ]}
      onPress={() => toggleFriendSelection(item.id)}
    >
      {item.avatar_url ? (
        <Image source={{ uri: item.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
      )}
      <Text style={styles.friendName}>{item.name}</Text>
      {selectedFriends.includes(item.id) && (
        <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={styles.checkIcon} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Friends to Invite</Text>
      
      <FlatList
        data={friends}
        renderItem={renderFriendItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You don't have any friends yet</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.inviteButton}
        onPress={sendInvitations}
        disabled={loading || selectedFriends.length === 0}
      >
        <Text style={styles.inviteButtonText}>
          Invite {selectedFriends.length > 0 ? `(${selectedFriends.length})` : ''}
        </Text>
      </TouchableOpacity>
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
  listContent: {
    paddingBottom: 80,
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
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedFriendItem: {
    borderColor: '#4CAF50',
    borderWidth: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
  },
  friendName: {
    fontSize: 16,
    flex: 1,
  },
  checkIcon: {
    marginLeft: 10,
  },
  inviteButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default InviteFriendsScreen;