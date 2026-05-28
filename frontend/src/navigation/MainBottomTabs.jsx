import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../context/AuthContext';
import { COLORS } from '../constants/theme';
import HomeTopTabs from './HomeTopTabs';
import { View, Text } from 'react-native';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SearchScreen from '../screens/search/SearchScreen';
import MessageListScreen from '../screens/chat/MessageListScreen';

const BottomTab = createBottomTabNavigator();


export default function MainBottomTabs() {
  const { user } = useContext(AuthContext);
  const isEmployer = user?.role === 'EMPLOYER';

  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.textPrimary,
        tabBarInactiveTintColor: COLORS.textDisabled,
        tabBarStyle: { height: 65, paddingBottom: 10, backgroundColor: COLORS.background },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Action') {
            iconName = isEmployer 
                ? (focused ? 'add-circle' : 'add-circle-outline') 
                : (focused ? 'briefcase' : 'briefcase-outline');
          }
          else if (route.name === 'Chat') iconName = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';

          return <Ionicons name={iconName} size={28} color={color} />;
        },
      })}
    >
      <BottomTab.Screen name="Home" component={HomeTopTabs} options={{ tabBarLabel: 'Trang chủ' }} />
      <BottomTab.Screen name="Search" component={SearchScreen} options={{ tabBarLabel: 'Tìm kiếm' }} />
      <BottomTab.Screen name="Chat" component={MessageListScreen} options={{ tabBarLabel: 'Tin nhắn' }} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Tôi' }} />
    </BottomTab.Navigator>
  );
}