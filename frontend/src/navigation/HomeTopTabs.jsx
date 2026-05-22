import React, { useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text } from 'react-native';
import { AuthContext } from '../context/AuthContext'; 
import { COLORS, FONTWEIGHT } from '../constants/theme';
import FeedScreen from '../screens/jobPost/feed/FeedScreen'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const FollowingFeedPlaceholder = () => (
  <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: COLORS.textSecondary }}>Danh sách Job từ các công ty đã Follow (Candidate)</Text>
  </View>
);

const YourJobsPlaceholder = () => (
  <View style={{ flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: COLORS.textSecondary }}>Các Job Post do chính bạn tạo và còn hạn (Employer)</Text>
  </View>
);

const TopTab = createMaterialTopTabNavigator();

export default function HomeTopTabs() {

  const { user } = useContext(AuthContext); 
  const isEmployer = user?.role === 'EMPLOYER';
  const insets = useSafeAreaInsets();
  return (
    <TopTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary, // Chữ đen tuyền khi chọn
        tabBarInactiveTintColor: COLORS.textSecondary, // Chữ xám khi không chọn
        tabBarIndicatorStyle: { backgroundColor: COLORS.primary, height: 2 }, // Thanh gạch chân mỏng tối giản
        tabBarLabelStyle: { fontWeight: FONTWEIGHT.bold, textTransform: 'none', fontSize: 15 },
        tabBarStyle: { 
            backgroundColor: COLORS.background, 
            elevation: 0, 
            shadowOpacity: 0,
            paddingTop: insets.top 
        }, 
      }}
    >
      {/* TAB CON 1: Thay đổi động theo Role */}
      <TopTab.Screen 
        name="LeftFeed" 
        component={FeedScreen} 
        options={{ 
          tabBarLabel: isEmployer ? 'Tin đã đăng' : 'Followed' 
        }} 
        initialParams={{ feedType: isEmployer ? 'my_jobs' : 'followed' }}
      />

      {/* TAB CON 2: Cả 2 cùng xem chung một Feed công việc tổng thể */}
      <TopTab.Screen 
        name="RightFeed" 
        component={FeedScreen} 
        options={{ 
          tabBarLabel: isEmployer ? 'Job toàn quốc' : 'Feed' 
        }} 
        initialParams={{ feedType: 'global' }}
      />
    </TopTab.Navigator>
  );
}