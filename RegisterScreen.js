/*import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from './supabase';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      Alert.alert('Registration Failed', error.message);
    } else {
      Alert.alert('Check your email', 'A verification link has been sent.');
      navigation.replace('Login'); // Redirect to Login
    }
  };

  return (
    <View>
      <Text>Register</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}*/
// RegisterScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
// import { supabase } from './supabase';

// export default function RegisterScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.auth.signUp({ 
//         email, 
//         password,
//         options: {
//           data: {
//             // You can add default profile data here if needed
//           }
//         }
//       });

//       if (error) {
//         throw error;
//       }

//       if (!data.session) {
//         Alert.alert('Check your email', 'A verification link has been sent.');
//         navigation.navigate('Login');
//       }
//     } catch (error) {
//       Alert.alert('Registration Failed', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>
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
//         title={loading ? "Loading..." : "Register"} 
//         onPress={handleRegister} 
//         disabled={loading}
//       />
      
//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.link}>Already have an account? Login here</Text>
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


// import React, { useState } from 'react';
// import { View, Text, TextInput, Button, Alert, TouchableOpacity, StyleSheet } from 'react-native';
// import { supabase } from './supabase';

// export default function RegisterScreen({ navigation }) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleRegister = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase.auth.signUp({ 
//         email, 
//         password,
//         options: {
//           data: {
//             // You can add default profile data here if needed
//           }
//         }
//       });

//       if (error) {
//         throw error;
//       }

//       if (!data.session) {
//         Alert.alert('Check your email', 'A verification link has been sent.');
//         navigation.navigate('Login');
//       }
//     } catch (error) {
//       Alert.alert('Registration Failed', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Register</Text>
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
//         title={loading ? "Loading..." : "Register"} 
//         onPress={handleRegister} 
//         disabled={loading}
//       />
      
//       <TouchableOpacity onPress={() => navigation.navigate('Login')}>
//         <Text style={styles.link}>Already have an account? Login here</Text>
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

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      console.log('Attempting to register user with email:', email); // Debugging statement

      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            // Add any default profile data here if needed
          }
        }
      });

      console.log('Supabase response:', data, error); // Debugging statement

      if (error) {
        console.error('Registration error:', error.message); // Debugging statement
        throw error;
      }

      if (!data.session) {
        console.log('Registration successful, but email verification is required.'); // Debugging statement
        Alert.alert('Check your email', 'A verification link has been sent.');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Registration failed:', error.message); // Debugging statement
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
        title={loading ? "Loading..." : "Register"} 
        onPress={handleRegister} 
        disabled={loading}
      />
      
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Already have an account? Login here</Text>
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