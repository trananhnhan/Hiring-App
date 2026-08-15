import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { COLORS, FONTWEIGHT } from '../constants/theme';
import FeedScreen from '../screens/jobPost/feed/FeedScreen'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const TopTab = createMaterialTopTabNavigator();

export default function HomeTopTabs() {

  const { user } = useContext(AuthContext); 
  const isEmployer = user?.role === 'EMPLOYER';
  const insets = useSafeAreaInsets();
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary, 
        tabBarInactiveTintColor: COLORS.textSecondary, 
        tabBarIndicatorStyle: { backgroundColor: COLORS.primary, height: 2 }, 
        tabBarLabelStyle: { fontWeight: FONTWEIGHT.bold, textTransform: 'none', fontSize: 15 },
        tabBarStyle: { 
            backgroundColor: COLORS.background, 
            elevation: 0, 
            shadowOpacity: 0,
            paddingTop: insets.top 
        }, 
      }}
    >
      
      <TopTab.Screen 
        name="RightFeed" 
        component={FeedScreen} 
        options={{ 
          tabBarLabel: isEmployer ? 'Tin đã đăng' : 'Followed' 
        }} 
        initialParams={{ feedType: isEmployer ? 'my_jobs' : 'followed' }}
      />

      <TopTab.Screen 
        name="LeftFeed" 
        component={FeedScreen} 
        options={{ 
          tabBarLabel: isEmployer ? 'Job toàn quốc' : 'Feed' 
        }} 
        initialParams={{ feedType: 'global' }}
      />
    </TopTab.Navigator>
  );
}