import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { supabase } from './supabase';
import { Ionicons } from '@expo/vector-icons';

const EventDetailScreen = ({ route, navigation }) => {
  const { eventId } = route.params;
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isJoined, setIsJoined] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchEventData();
    fetchUser();
  }, [eventId]);

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const fetchEventData = async () => {
    try {
      setLoading(true);
      
      // Fetch event details
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();

      if (eventError) throw eventError;
      setEvent(eventData);

      // Fetch participants
      const { data: participantsData, error: participantsError } = await supabase
        .from('event_participants')
        .select('user_id')
        .eq('event_id', eventId);

      if (participantsError) throw participantsError;
      setParticipants(participantsData.map(p => p.user_id));

      // Check if current user has joined
      if (user) {
        const { data: joinedData, error: joinedError } = await supabase
          .from('event_participants')
          .select('*')
          .eq('event_id', eventId)
          .eq('user_id', user.id)
          .single();

        setIsJoined(!!joinedData);
      }
    } catch (error) {
      console.error('Error fetching event data:', error.message);
      Alert.alert('Error', 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinEvent = async () => {
    if (!user) {
      Alert.alert('Login Required', 'You need to log in to join events');
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase
        .from('event_participants')
        .insert([{ event_id: eventId, user_id: user.id }]);

      if (error) throw error;
      setIsJoined(true);
      setParticipants([...participants, user.id]);
      Alert.alert('Success', 'You have joined this event!');
    } catch (error) {
      console.error('Error joining event:', error.message);
      Alert.alert('Error', 'Failed to join event');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveEvent = async () => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('event_participants')
        .delete()
        .eq('event_id', eventId)
        .eq('user_id', user.id);

      if (error) throw error;
      setIsJoined(false);
      setParticipants(participants.filter(id => id !== user.id));
      Alert.alert('Success', 'You have left this event');
    } catch (error) {
      console.error('Error leaving event:', error.message);
      Alert.alert('Error', 'Failed to leave event');
    } finally {
      setLoading(false);
    }
  };

  const handleInviteFriends = () => {
    navigation.navigate('InviteFriends', { eventId });
  };

  if (loading || !event) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {event.image_url && (
        <Image source={{ uri: event.image_url }} style={styles.eventImage} />
      )}
      
      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>
        
        <View style={styles.detailRow}>
          <Ionicons name="calendar" size={20} color="#555" />
          <Text style={styles.detailText}>
            {new Date(event.date).toLocaleDateString()} • {new Date(event.date).toLocaleTimeString()}
          </Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name={event.is_online ? 'globe' : 'location'} size={20} color="#555" />
          <Text style={styles.detailText}>
            {event.is_online ? event.online_link : event.location}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Event</Text>
          <Text style={styles.description}>{event.description}</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Participants ({participants.length}{event.max_participants ? `/${event.max_participants}` : ''})
          </Text>
          <Text style={styles.participantsText}>
            {participants.length > 0 ? 
              `${participants.length} people are going` : 
              'Be the first to join!'}
          </Text>
        </View>
        
        <View style={styles.buttonContainer}>
          {isJoined ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.secondaryButton]}
                onPress={handleLeaveEvent}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Leave Event</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.primaryButton]}
                onPress={handleInviteFriends}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Invite Friends</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.primaryButton]}
              onPress={handleJoinEvent}
              disabled={loading}
            >
              <Text style={styles.buttonText}>Join Event</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventImage: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#555',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  participantsText: {
    fontSize: 16,
    color: '#555',
  },
  buttonContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#0066cc',
  },
  secondaryButton: {
    backgroundColor: '#e1e1e1',
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EventDetailScreen;