/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from './supabase';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      Alert.alert('Success', 'You are now logged in!');
      // Navigate to home screen after successful login (not added yet)
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} value={email} onChangeText={setEmail} />
      
      <Text>Password:</Text>
      <TextInput style={{ borderWidth: 1, marginBottom: 10, padding: 5 }} secureTextEntry value={password} onChangeText={setPassword} />
      
      <Button title="Login" onPress={handleLogin} />
      <Button title="No account? Sign Up" onPress={() => navigation.navigate('Signup')} />
    </View>
  );
}

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { supabase } from './supabase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Login Error', error.message);
    } else {
      navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
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

      <Button title="Login" onPress={handleLogin} />
      <Button title="Don't have an account? Sign Up" onPress={() => navigation.navigate('Signup')} />
    </View>
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
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { supabase } from './supabase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Login Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Welcome Back</Text>
      <Text style={styles.subheader}>Login to your account</Text>
      
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
          placeholder="Enter your password"
          secureTextEntry
        />
      </View>

      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : 'Login'}</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.footerLink}>Sign Up</Text>
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
import { View, Text, TextInput, Button, Alert } from 'react-native';
//import { supabase } from './supabaseClient';
import { supabase } from './supabase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      Alert.alert('Login Failed', error.message);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      Alert.alert('Error', 'Could not retrieve user data.');
      return;
    }

    if (!userData.user.email_confirmed_at) {
      Alert.alert('Email Not Verified', 'Verify your email before logging in.');
      await supabase.auth.signOut();
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('name, skills, linkedin, github')
      .eq('id', userData.user.id)
      .single();

    if (profileError || !profile || !profile.name) {
      navigation.replace('ProfileSetup'); // If profile is incomplete
    } else {
      navigation.replace('Home'); // If profile is complete
    }
  };

  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
}
*/
// Login.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
// import { supabase } from './supabase';

// export default function Login({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//       if (error) {
//         Alert.alert('Login Failed', error.message);
//         return;
//       }

//       const { data: userData, error: userError } = await supabase.auth.getUser();
//       if (userError || !userData.user) {
//         Alert.alert('Error', 'Could not retrieve user data.');
//         return;
//       }

//       if (!userData.user.email_confirmed_at) {
//         Alert.alert('Email Not Verified', 'Please verify your email before logging in.');
//         await supabase.auth.signOut();
//         return;
//       }

//       const { data: profile, error: profileError } = await supabase
//         .from('users')
//         .select('name, skills, linkedin, github')
//         .eq('id', userData.user.id)
//         .single();

//       if (profileError || !profile || !profile.name) {
//         navigation.replace('ProfileSetup');
//       } else {
//         navigation.replace('Home');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button 
//         title={loading ? "Loading..." : "Login"} 
//         onPress={handleLogin} 
//         disabled={loading}
//       />
      
//       <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
//         <Text style={styles.link}>Don't have an account? Register here</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   link: {
//     marginTop: 15,
//     color: 'blue',
//     textAlign: 'center',
//   },
// });

// Login.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
// import { supabase } from './supabase';

// export default function Login({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleLogin = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//       if (error) {
//         Alert.alert('Login Failed', error.message);
//         return;
//       }

//       const { data: userData, error: userError } = await supabase.auth.getUser();
//       if (userError || !userData.user) {
//         Alert.alert('Error', 'Could not retrieve user data.');
//         return;
//       }

//       if (!userData.user.email_confirmed_at) {
//         Alert.alert('Email Not Verified', 'Please verify your email before logging in.');
//         await supabase.auth.signOut();
//         return;
//       }

//       // Check if profile exists with the new schema
//       const { data: profile, error: profileError } = await supabase
//         .from('users')
//         .select('name, skills, linkedin_url, github_url')
//         .eq('user_id', userData.user.id)
//         .single();

//       if (profileError || !profile || !profile.name) {
//         navigation.replace('ProfileSetup');
//       } else {
//         navigation.replace('Home');
//       }
//     } catch (error) {
//       Alert.alert('Error', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Login</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//         autoCapitalize="none"
//         keyboardType="email-address"
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button 
//         title={loading ? "Loading..." : "Login"} 
//         onPress={handleLogin} 
//         disabled={loading}
//       />
      
//       <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
//         <Text style={styles.link}>Don't have an account? Register here</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 15,
//     paddingHorizontal: 10,
//     borderRadius: 5,
//   },
//   link: {
//     marginTop: 15,
//     color: 'blue',
//     textAlign: 'center',
//   },
// });

import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { supabase } from './supabase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        Alert.alert('Login Failed', error.message);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        Alert.alert('Error', 'Could not retrieve user data.');
        return;
      }

      if (!userData.user.email_confirmed_at) {
        Alert.alert('Email Not Verified', 'Please verify your email before logging in.');
        await supabase.auth.signOut();
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('name, skills, linkedin_url, github_url')
        .eq('user_id', userData.user.id)
        .single();

      if (profileError || !profile || !profile.name) {
        navigation.replace('ProfileSetup');
      } else {
        navigation.replace('Home');
      }
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button 
        title={loading ? "Loading..." : "Login"} 
        onPress={handleLogin} 
        disabled={loading}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
        <Text style={styles.link}>Don't have an account? Register here</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  link: {
    marginTop: 15,
    color: 'blue',
    textAlign: 'center',
  },
});