import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; // Xài đồ có sẵn y chang AuthNavigator
import MainBottomTabs from './MainBottomTabs';
import JobDetailScreen from '../screens/jobPost/detail/JobDetailScreen';
import SettingsScreen from '../screens/setting/SettingsScreen';
import PublicProfileScreen from '../screens/profile/PublicProfileScreen';

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* 1. Luồng chính chứa thanh Bottom Tabs dưới đáy */}
      <Stack.Screen name="MainTabs" component={MainBottomTabs} />
      
      {/* 2. Màn hình chi tiết công việc bộc phát (Phủ full màn hình, giấu Tab) */}
      <Stack.Screen 
        name="JobDetail" 
        component={JobDetailScreen} 
        options={{ 
          headerShown: false, 
        }} 
      />
      <Stack.Screen 
        name="SettingsScreen" 
        component={SettingsScreen} 
        options={{ 
          headerShown: false, 
        }} 
      />
        <Stack.Screen 
        name="PublicProfileScreen" 
        component={PublicProfileScreen} 
        options={{ 
          headerShown: false, 
        }} 
      />

    </Stack.Navigator>
  );
}