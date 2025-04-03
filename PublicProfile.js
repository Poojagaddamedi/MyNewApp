import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,ActivityIndicator} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function PublicProfile({ route, navigation }) {
  const { userId, name, avatar_url } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{name}'s Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.profileHeader}>
        {avatar_url ? (
          <Image source={{ uri: avatar_url }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>{name?.charAt(0) || '?'}</Text>
          </View>
        )}
        <Text style={styles.name}>{name}</Text>
      </View>

      <View style={styles.restrictedView}>
        <Ionicons name="lock-closed" size={50} color="#888" />
        <Text style={styles.restrictedText}>
          Connect with {name} to view their full profile
        </Text>
      </View>
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
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#666',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  restrictedView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  restrictedText: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    textAlign: 'center',
  },
});