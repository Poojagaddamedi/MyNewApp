/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from './supabase';

function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPasswor] = useState('');

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Signup Error', error.message);
    } else {
      Alert.alert('Check your email', 'A verification link has been sent to your email.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} value={email} onChangeText={setEmail} />
      
      <Text>Password:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} secureTextEntry value={password} onChangeText={setPassword} />
      
      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}
/*
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, ScrollView } from 'react-native';
import { supabase } from './supabase';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [skills, setSkills] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');

  const handleSignup = async () => {
    // Sign up with email and password
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      Alert.alert('Signup Error', authError.message);
      return;
    }

    // Save additional profile data to the profiles table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          user_id: authData.user.id,
          email,
          skills: skills.split(',').map(skill => skill.trim()), // Convert skills string to array
          linkedin_url: linkedinUrl,
          github_url: githubUrl,
        },
      ]);

    if (profileError) {
      Alert.alert('Profile Error', profileError.message);
      return;
    }

    Alert.alert('Check your email', 'A verification link has been sent to your email.');
    navigation.navigate('Login'); // Redirect to login after successful signup
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Enter your password"
        secureTextEntry
      />

      <Text style={styles.label}>Skills (comma-separated):</Text>
      <TextInput
        style={styles.input}
        value={skills}
        onChangeText={setSkills}
        placeholder="e.g., React, Node.js, UI Design"
      />

      <Text style={styles.label}>LinkedIn URL:</Text>
      <TextInput
        style={styles.input}
        value={linkedinUrl}
        onChangeText={setLinkedinUrl}
        placeholder="Enter your LinkedIn profile URL"
        keyboardType="url"
      />

      <Text style={styles.label}>GitHub URL:</Text>
      <TextInput
        style={styles.input}
        value={githubUrl}
        onChangeText={setGithubUrl}
        placeholder="Enter your GitHub profile URL"
        keyboardType="url"
      />

      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
});
/*
import { useState } from 'react';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import ProfileScreen from './ProfileScreen';

const SignupScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Signup Error', error.message);
    } else {
      console.log('User signed up:', data);
      navigation.navigate('ProfileScreen'); // Move to the next step
    }
  };

  return (
    <View>
      <Text>Signup</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default SignupScreen;*/
/*
import { useState } from 'react';
import { supabase } from './supabase';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TextInput, Button, Alert } from 'react-native';

const Signup= () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const handleSignUp = async () => {
    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });

    if (authError) {
      Alert.alert('Signup Error', authError.message);
      return;
    }

    // Store user data in the `users` table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{ id: authData.user.id, email }])
      .single();

    if (userError) {
      Alert.alert('Database Error', userError.message);
      return;
    }

    console.log('User signed up and stored:', userData);
    navigation.navigate('ProfileScreen'); // Navigate to Profile Screen
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Signup</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderColor: '#ccc' }}
      />
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};

export default Signup;
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from './supabase';

export default function SignupScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Signup Error', error.message);
    } else {
      Alert.alert('Check your email', 'A verification link has been sent to your email.');
      navigation.navigate('ProfileScreen'); // Move to Profile Setup
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} value={email} onChangeText={setEmail} />

      <Text>Password:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} secureTextEntry value={password} onChangeText={setPassword} />

      <Button title="Sign Up" onPress={handleSignup} />
      <Button title="Already have an account? Login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from './supabase';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      Alert.alert('Check your email', 'A verification link has been sent to your email.');
      navigation.navigate('ProfileScreen');
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Account</Text>
      <Text style={styles.subheader}>Join our community</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Create a password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Sign Up'}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  primaryButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
  },
  footerLink: {
    color: '#0066cc',
    fontWeight: '500',
  },
});
import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { supabase } from './supabase';

export default function Signup({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  /*const handleSignup = async () => {
    // Basic validation
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'myapp://welcome' // For deep linking after email confirmation
        }
      });

      if (error) throw error;
      
      Alert.alert(
        'Check your email',
        'We\'ve sent a verification link to your email address',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ProfileScreen', { email })
          }
        ]
      );
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
  
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: 'myapp://welcome',
        },
      });
  
      if (error) throw error;
  
      Alert.alert(
        'Check your email',
        'We\'ve sent a verification link to your email address',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('ProfileScreen', { userId: data.user.id }),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Signup Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.innerContainer}>
        <Text style={styles.header}>Create Account</Text>
        <Text style={styles.subheader}>Join our community</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
            placeholderTextColor="#999"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="password"
            textContentType="password"
          />
        </View>

        <TouchableOpacity 
          style={[styles.primaryButton, loading && styles.disabledButton]} 
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.6}
          >
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#333',
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  primaryButton: {
    height: 50,
    borderRadius: 8,
    backgroundColor: '#0066cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#0066cc',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  footerText: {
    color: '#666',
    fontSize: 14,
  },
  footerLink: {
    color: '#0066cc',
    fontWeight: '500',
    fontSize: 14,
  },
});*/