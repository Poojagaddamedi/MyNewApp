// import React, { useState } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
// import { supabase } from './supabase';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import * as ImagePicker from 'expo-image-picker';
// import { Ionicons } from '@expo/vector-icons';

// const CreateEventScreen = ({ navigation }) => {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');
//   const [date, setDate] = useState(new Date());
//   const [location, setLocation] = useState('');
//   const [isOnline, setIsOnline] = useState(false);
//   const [onlineLink, setOnlineLink] = useState('');
//   const [maxParticipants, setMaxParticipants] = useState('');
//   const [imageUri, setImageUri] = useState(null);
//   const [showDatePicker, setShowDatePicker] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const pickImage = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     });

//     if (!result.canceled) {
//       setImageUri(result.assets[0].uri);
//     }
//   };

//   const uploadImage = async () => {
//     if (!imageUri) return null;

//     const formData = new FormData();
//     const fileName = imageUri.split('/').pop();
//     const fileType = fileName.split('.').pop();

//     formData.append('file', {
//       uri: imageUri,
//       name: fileName,
//       type: `image/${fileType}`,
//     });

//     const { data, error } = await supabase.storage
//       .from('event-images')
//       .upload(`events/${Date.now()}_${fileName}`, formData);

//     if (error) {
//       console.error('Error uploading image:', error.message);
//       throw error;
//     }

//     return data.path;
//   };

//   const handleCreateEvent = async () => {
//     if (!title || !description || !date || (!isOnline && !location) || (isOnline && !onlineLink)) {
//       Alert.alert('Validation Error', 'Please fill all required fields');
//       return;
//     }

//     try {
//       setLoading(true);
      
//       // Get current user
//       const { data: { user } } = await supabase.auth.getUser();
//       if (!user) throw new Error('User not authenticated');

//       // Upload image if selected
//       let imageUrl = null;
//       if (imageUri) {
//         const imagePath = await uploadImage();
//         const { data: { publicUrl } } = supabase.storage
//           .from('event-images')
//           .getPublicUrl(imagePath);
//         imageUrl = publicUrl;
//       }

//       // Create event in database
//       const { data, error } = await supabase
//         .from('events')
//         .insert([{
//           title,
//           description,
//           date: date.toISOString(),
//           location: isOnline ? 'Online' : location,
//           image_url: imageUrl,
//           is_online: isOnline,
//           online_link: isOnline ? onlineLink : null,
//           max_participants: maxParticipants ? parseInt(maxParticipants) : null,
//           created_by: user.id,
//         }])
//         .select();

//       if (error) throw error;
      
//       Alert.alert('Success', 'Event created successfully!');
//       navigation.navigate('EventDetail', { eventId: data[0].id });
//     } catch (error) {
//       console.error('Error creating event:', error.message);
//       Alert.alert('Error', 'Failed to create event');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
//       <Text style={styles.title}>Create New Event</Text>
      
//       <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
//         {imageUri ? (
//           <Image source={{ uri: imageUri }} style={styles.imagePreview} />
//         ) : (
//           <View style={styles.imagePlaceholder}>
//             <Ionicons name="camera" size={40} color="#666" />
//             <Text style={styles.imagePlaceholderText}>Add Event Image</Text>
//           </View>
//         )}
//       </TouchableOpacity>
      
//       <Text style={styles.label}>Event Title*</Text>
//       <TextInput
//         style={styles.input}
//         value={title}
//         onChangeText={setTitle}
//         placeholder="Enter event title"
//       />
      
//       <Text style={styles.label}>Description*</Text>
//       <TextInput
//         style={[styles.input, styles.multilineInput]}
//         value={description}
//         onChangeText={setDescription}
//         placeholder="Enter event description"
//         multiline
//         numberOfLines={4}
//       />
      
//       <Text style={styles.label}>Date & Time*</Text>
//       <TouchableOpacity 
//         style={styles.input} 
//         onPress={() => setShowDatePicker(true)}
//       >
//         <Text>{date.toLocaleString()}</Text>
//       </TouchableOpacity>
      
//       {showDatePicker && (
//         <DateTimePicker
//           value={date}
//           mode="datetime"
//           display="default"
//           onChange={(event, selectedDate) => {
//             setShowDatePicker(false);
//             if (selectedDate) {
//               setDate(selectedDate);
//             }
//           }}
//         />
//       )}
      
//       <View style={styles.switchContainer}>
//         <Text style={styles.label}>Online Event</Text>
//         <TouchableOpacity
//           style={[styles.switch, isOnline && styles.switchActive]}
//           onPress={() => setIsOnline(!isOnline)}
//         >
//           <View style={[styles.switchToggle, isOnline && styles.switchToggleActive]} />
//         </TouchableOpacity>
//       </View>
      
//       {isOnline ? (
//         <>
//           <Text style={styles.label}>Online Link*</Text>
//           <TextInput
//             style={styles.input}
//             value={onlineLink}
//             onChangeText={setOnlineLink}
//             placeholder="Enter meeting URL"
//             keyboardType="url"
//           />
//         </>
//       ) : (
//         <>
//           <Text style={styles.label}>Location*</Text>
//           <TextInput
//             style={styles.input}
//             value={location}
//             onChangeText={setLocation}
//             placeholder="Enter event location"
//           />
//         </>
//       )}
      
//       <Text style={styles.label}>Max Participants (optional)</Text>
//       <TextInput
//         style={styles.input}
//         value={maxParticipants}
//         onChangeText={setMaxParticipants}
//         placeholder="Leave empty for unlimited"
//         keyboardType="numeric"
//       />
      
//       <TouchableOpacity 
//         style={styles.createButton}
//         onPress={handleCreateEvent}
//         disabled={loading}
//       >
//         {loading ? (
//           <ActivityIndicator color="white" />
//         ) : (
//           <Text style={styles.createButtonText}>Create Event</Text>
//         )}
//       </TouchableOpacity>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//     padding: 20,
//   },
//   contentContainer: {
//     paddingBottom: 30,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   imagePicker: {
//     height: 200,
//     backgroundColor: '#eee',
//     borderRadius: 10,
//     marginBottom: 20,
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   imagePreview: {
//     width: '100%',
//     height: '100%',
//   },
//   imagePlaceholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imagePlaceholderText: {
//     marginTop: 10,
//     color: '#666',
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//     color: '#333',
//   },
//   input: {
//     backgroundColor: 'white',
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: '#ddd',
//   },
//   multilineInput: {
//     height: 100,
//     textAlignVertical: 'top',
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   switch: {
//     width: 50,
//     height: 30,
//     borderRadius: 15,
//     backgroundColor: '#ddd',
//     padding: 3,
//   },
//   switchActive: {
//     backgroundColor: '#0066cc',
//   },
//   switchToggle: {
//     width: 24,
//     height: 24,
//     borderRadius: 12,
//     backgroundColor: 'white',
//   },
//   switchToggleActive: {
//     marginLeft: 'auto',
//   },
//   createButton: {
//     backgroundColor: '#0066cc',
//     padding: 15,
//     borderRadius: 8,
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   createButtonText: {
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: 18,
//   },
// });

// export default CreateEventScreen;


import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  ActivityIndicator,
  Platform,
  Image
} from 'react-native';
import { supabase } from './supabase';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const CreateEventScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [onlineLink, setOnlineLink] = useState('');
  const [maxParticipants, setMaxParticipants] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const uploadImage = async () => {
    if (!imageUri) return null;

    const formData = new FormData();
    const fileName = imageUri.split('/').pop();
    const fileType = fileName.split('.').pop();

    formData.append('file', {
      uri: imageUri,
      name: fileName,
      type: `image/${fileType}`,
    });

    const { data, error } = await supabase.storage
      .from('event-images')
      .upload(`events/${Date.now()}_${fileName}`, formData);

    if (error) {
      console.error('Error uploading image:', error.message);
      throw error;
    }

    return data.path;
  };

  const handleDateChange = (event, selectedDate) => {
    // This is crucial for Android
    if (Platform.OS === 'android') {
      setShowDatePicker(false); // Hide the picker immediately on Android
    }

    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  const handleCreateEvent = async () => {
    if (!title || !description || !date || (!isOnline && !location) || (isOnline && !onlineLink)) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Upload image if selected
      let imageUrl = null;
      if (imageUri) {
        const imagePath = await uploadImage();
        const { data: { publicUrl } } = supabase.storage
          .from('event-images')
          .getPublicUrl(imagePath);
        imageUrl = publicUrl;
      }

      // Create event in database
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title,
          description,
          date: date.toISOString(),
          location: isOnline ? 'Online' : location,
          image_url: imageUrl,
          is_online: isOnline,
          online_link: isOnline ? onlineLink : null,
          max_participants: maxParticipants ? parseInt(maxParticipants) : null,
          created_by: user.id,
        }])
        .select();

      if (error) throw error;
      
      Alert.alert('Success', 'Event created successfully!');
      navigation.navigate('EventDetail', { eventId: data[0].id });
    } catch (error) {
      console.error('Error creating event:', error.message);
      Alert.alert('Error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Create New Event</Text>
      
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="camera" size={40} color="#666" />
            <Text style={styles.imagePlaceholderText}>Add Event Image</Text>
          </View>
        )}
      </TouchableOpacity>
      
      <Text style={styles.label}>Event Title*</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Enter event title"
      />
      
      <Text style={styles.label}>Description*</Text>
      <TextInput
        style={[styles.input, styles.multilineInput]}
        value={description}
        onChangeText={setDescription}
        placeholder="Enter event description"
        multiline
        numberOfLines={4}
      />
      
      <Text style={styles.label}>Date & Time*</Text>
      <TouchableOpacity 
        style={styles.input} 
        onPress={showDatePickerModal}
      >
        <Text>{date.toLocaleString()}</Text>
      </TouchableOpacity>
      
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="datetime"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
        />
      )}
      
      <View style={styles.switchContainer}>
        <Text style={styles.label}>Online Event</Text>
        <TouchableOpacity
          style={[styles.switch, isOnline && styles.switchActive]}
          onPress={() => setIsOnline(!isOnline)}
        >
          <View style={[styles.switchToggle, isOnline && styles.switchToggleActive]} />
        </TouchableOpacity>
      </View>
      
      {isOnline ? (
        <>
          <Text style={styles.label}>Online Link*</Text>
          <TextInput
            style={styles.input}
            value={onlineLink}
            onChangeText={setOnlineLink}
            placeholder="Enter meeting URL"
            keyboardType="url"
          />
        </>
      ) : (
        <>
          <Text style={styles.label}>Location*</Text>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="Enter event location"
          />
        </>
      )}
      
      <Text style={styles.label}>Max Participants (optional)</Text>
      <TextInput
        style={styles.input}
        value={maxParticipants}
        onChangeText={setMaxParticipants}
        placeholder="Leave empty for unlimited"
        keyboardType="numeric"
      />
      
      <TouchableOpacity 
        style={styles.createButton}
        onPress={handleCreateEvent}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.createButtonText}>Create Event</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  imagePicker: {
    height: 200,
    backgroundColor: '#eee',
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: '#666',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  switch: {
    width: 50,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#ddd',
    padding: 3,
  },
  switchActive: {
    backgroundColor: '#0066cc',
  },
  switchToggle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
  switchToggleActive: {
    marginLeft: 'auto',
  },
  createButton: {
    backgroundColor: '#0066cc',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  createButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default CreateEventScreen;