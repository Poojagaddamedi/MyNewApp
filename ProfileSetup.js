import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from './supabase';

export default function ProfileSetup({ navigation }) {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    linkedin_url: '',
    github_url: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.skills.trim()) {
      Alert.alert('Required', 'Name and Skills are required');
      return;
    }

    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      const skillsArray = formData.skills.split(',').map(skill => skill.trim());

      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          name: formData.name.trim(),
          skills: skillsArray,
          linkedin_url: formData.linkedin_url.trim() || null,
          github_url: formData.github_url.trim() || null,
          avatar_url: formData.avatar_url.trim() || null
        });

      if (error) throw error;
      
      navigation.replace('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Setup Your Profile</Text>
      
      <Text style={styles.label}>Full Name*</Text>
      <TextInput
        style={styles.input}
        placeholder="John Doe"
        value={formData.name}
        onChangeText={(text) => setFormData({...formData, name: text})}
      />

      <Text style={styles.label}>Skills* (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="Java, Python, Web Development"
        value={formData.skills}
        onChangeText={(text) => setFormData({...formData, skills: text})}
      />

      <Text style={styles.label}>LinkedIn URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://linkedin.com/in/username"
        value={formData.linkedin_url}
        onChangeText={(text) => setFormData({...formData, linkedin_url: text})}
        keyboardType="url"
      />

      <Text style={styles.label}>GitHub URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://github.com/username"
        value={formData.github_url}
        onChangeText={(text) => setFormData({...formData, github_url: text})}
        keyboardType="url"
      />

      <Text style={styles.label}>Avatar URL</Text>
      <TextInput
        style={styles.input}
        placeholder="https://example.com/avatar.jpg"
        value={formData.avatar_url}
        onChangeText={(text) => setFormData({...formData, avatar_url: text})}
        keyboardType="url"
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Complete Setup</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    backgroundColor: 'white',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});