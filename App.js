// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';

// // Verify these imports
// import AppInfo from './AppInfo';
// import Screen1 from './Screen1';
// import Screen2 from './Screen2';
// import Screen3 from './Screen3';
// import Screen4 from './Screen4';
// import Screen5 from './Screen5';
// import Login from './Login';
// import HomeScreen from './HomeScreen';
// import NotificationScreen from './NotificationScreen';
// import ProfileSetup from './ProfileSetup';
// import RegisterScreen from './RegisterScreen';
// import TestScreen from './TestScreen';
// import Events from './Event';
// import Chatbot from './Chatbot';
// import Profile from './Profile';
// import UserProfile from './UserProfile';
// import PublicProfile from './PublicProfile';
// import FriendRequests from './FriendRequests';

// // Ensure all components are exported correctly in their respective files
// // For example, in './AppInfo.js':
// // export default function AppInfo() { return <View><Text>App Info</Text></View>; }

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="AppInfo">
//         {/* AppInfo Screen */}
//         <Stack.Screen
//           name="AppInfo"
//           component={AppInfo}
//           options={{ headerShown: false }}
//         />

//         {/* Onboarding Screens */}
//         <Stack.Screen
//           name="Screen1"
//           component={Screen1}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Screen2"
//           component={Screen2}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Screen3"
//           component={Screen3}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Screen4"
//           component={Screen4}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Screen5"
//           component={Screen5}
//           options={{ headerShown: false }}
//         />

//         {/* Auth Screens */}
//         <Stack.Screen
//           name="Login"
//           component={Login}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="RegisterScreen"
//           component={RegisterScreen}
//           options={{ headerShown: false }}
//         />

//         {/* Main App Screens */}
//         <Stack.Screen
//           name="Home"
//           component={HomeScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="ProfileSetup"
//           component={ProfileSetup}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Profile"
//           component={Profile}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="UserProfile"
//           component={UserProfile}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="TestUtilities"
//           component={TestScreen}
//           options={{ title: 'Test Utilities' }}
//         />
//         <Stack.Screen
//           name="Notifications"
//           component={NotificationScreen}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="PublicProfile"
//           component={PublicProfile}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="FriendRequests"
//           component={FriendRequests}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Events"
//           component={Events}
//           options={{ headerShown: false }}
//         />
//         <Stack.Screen
//           name="Chatbot"
//           component={Chatbot}
//           options={{ headerShown: false }}
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { View } from 'react-native';

// Import all screens
import AppInfo from './AppInfo';
import Screen1 from './Screen1';
import Screen2 from './Screen2';
import Screen3 from './Screen3';
import Screen4 from './Screen4';
import Screen5 from './Screen5';
import Login from './Login';
import HomeScreen from './HomeScreen';
import NotificationScreen from './NotificationScreen';
import ProfileSetup from './ProfileSetup';
import RegisterScreen from './RegisterScreen';
import TestScreen from './TestScreen';
import Event from './Event';
import EventDetailScreen from './EventDetailScreen';
import CreateEventScreen from './CreateEventScreen';
import InviteFriendsScreen from './InviteFriendsScreen';
import EventInvitationsScreen from './EventInvitationsScreen';
import Chatbot from './Chatbot';
import Profile from './Profile';
import UserProfile from './UserProfile';
import PublicProfile from './PublicProfile';
import FriendRequests from './FriendRequests';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AppInfo">
        {/* AppInfo Screen */}
        <Stack.Screen
          name="AppInfo"
          component={AppInfo}
          options={{ headerShown: false }}
        />

        {/* Onboarding Screens */}
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Screen3"
          component={Screen3}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Screen4"
          component={Screen4}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Screen5"
          component={Screen5}
          options={{ headerShown: false }}
        />

        {/* Auth Screens */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />

        {/* Main App Screens */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({
            headerShown: true,
            headerTitle: 'Home',
            headerRight: () => (
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Events')}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="calendar" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Chatbot')}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="chatbubble" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Notifications')}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="notifications" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => navigation.navigate('Profile')}
                  style={{ marginRight: 15 }}
                >
                  <Ionicons name="person" size={24} color="black" />
                </TouchableOpacity>
              </View>
            ),
          })}
        />

        <Stack.Screen
          name="ProfileSetup"
          component={ProfileSetup}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{ 
            headerShown: true,
            headerTitle: 'My Profile'
          }}
        />

        <Stack.Screen
          name="UserProfile"
          component={UserProfile}
          options={({ route }) => ({ 
            headerShown: true,
            headerTitle: route.params?.name ? `${route.params.name}'s Profile` : 'Profile'
          })}
        />

        <Stack.Screen
          name="TestUtilities"
          component={TestScreen}
          options={{ title: 'Test Utilities' }}
        />

        <Stack.Screen
          name="Notifications"
          component={NotificationScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Notifications'
          }}
        />

        <Stack.Screen
          name="PublicProfile"
          component={PublicProfile}
          options={({ route }) => ({ 
            headerShown: true,
            headerTitle: route.params?.name ? `${route.params.name}'s Profile` : 'Profile'
          })}
        />

        <Stack.Screen
          name="FriendRequests"
          component={FriendRequests}
          options={{ 
            headerShown: true,
            headerTitle: 'Friend Requests'
          }}
        />

        {/* Event Screens */}
        <Stack.Screen
          name="Events"
          component={Event}
          options={{ 
            headerShown: true,
            headerTitle: 'Events'
          }}
        />

        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Event Details'
          }}
        />

        <Stack.Screen
          name="CreateEvent"
          component={CreateEventScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Create Event'
          }}
        />

        <Stack.Screen
          name="InviteFriends"
          component={InviteFriendsScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Invite Friends'
          }}
        />

        <Stack.Screen
          name="EventInvitations"
          component={EventInvitationsScreen}
          options={{ 
            headerShown: true,
            headerTitle: 'Event Invitations'
          }}
        />

        <Stack.Screen
          name="Chatbot"
          component={Chatbot}
          options={{ 
            headerShown: true,
            headerTitle: 'Chat Assistant',
            headerBackTitle: 'Back'
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}