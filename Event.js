/*import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Events() {
  return (
    <View style={styles.container}>
      <Text>Events Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});*/
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const Event= () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data);
    } catch (error) {
      console.error('Error fetching events:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.eventCard}
      onPress={() => navigation.navigate('EventDetail', { eventId: item.id })}
    >
      {item.image_url && (
        <Image source={{ uri: item.image_url }} style={styles.eventImage} />
      )}
      <View style={styles.eventContent}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.eventText}>
            {new Date(item.date).toLocaleDateString()} • {new Date(item.date).toLocaleTimeString()}
          </Text>
        </View>
        <View style={styles.eventMeta}>
          <Ionicons name={item.is_online ? 'globe' : 'location'} size={16} color="#666" />
          <Text style={styles.eventText}>
            {item.is_online ? 'Online' : item.location}
          </Text>
        </View>
        <Text style={styles.eventDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No upcoming events found</Text>
          </View>
        }
      />
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('CreateEvent')}
      >
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 10,
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  eventImage: {
    width: '100%',
    height: 150,
  },
  eventContent: {
    padding: 15,
  },
  eventTitle: {
    fontSize: 18,
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
  eventDescription: {
    marginTop: 8,
    color: '#666',
    fontSize: 14,
  },
  createButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Event;