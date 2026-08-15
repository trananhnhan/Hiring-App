import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'; 
import MainBottomTabs from './MainBottomTabs';
import JobDetailScreen from '../screens/jobPost/detail/JobDetailScreen';
import SettingsScreen from '../screens/setting/SettingsScreen';
import PublicProfileScreen from '../screens/profile/PublicProfileScreen';
import FollowListScreen from '../screens/profile/FollowListScreen';
import ApplyJobScreen from '../screens/jobApplication/apply/ApplyJobScreen';
import ApplicationDetailScreen from '../screens/jobApplication/detail/ApplicationDetailScreen';
import JobApplicationsListScreen from '../screens/jobApplication/list/JobApplicationsListScreen';
import CreateEditJobPostScreen from '../screens/jobPost/createEdit/CreateEditJobPostScreen';
import ResumeDetailScreen from '../screens/resume/detail/ResumeDetailScreen';
import CreateEditResumeScreen from '../screens/resume/createEdit/CreateEditResumeScreen';
import ApplicationCommentsScreen from '../screens/jobApplication/comment/ApplicationCommentsScreen';
import EditProfileScreen from '../screens/profile/edit/EditProfileScreen';
import CompanyAddressesScreen from '../screens/profile/address/CompanyAddressesScreen';
import CreateEditAddressScreen from '../screens/profile/address/CreateEditAddressScreen';
import CreateVerificationScreen from '../screens/profile/verification/CreateVerificationScreen';
import VerificationDetailScreen from '../screens/profile/verification/VerificationDetailScreen';
import VerificationListScreen from '../screens/profile/verification/VerificationListScreen';
import ChatDetailScreen from '../screens/chat/ChatDetailScreen';
import StatsScreen from '../screens/stat/StatsScreen';

const Stack = createNativeStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      
      <Stack.Screen name="MainTabs" component={MainBottomTabs} />

      
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
      <Stack.Screen
        name="FollowListScreen"
        component={FollowListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ApplyJobScreen"
        component={ApplyJobScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ApplicationDetailScreen"
        component={ApplicationDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="JobApplicationsListScreen"
        component={JobApplicationsListScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateEditJobPostScreen"
        component={CreateEditJobPostScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ResumeDetailScreen"
        component={ResumeDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="CreateEditResumeScreen"
        component={CreateEditResumeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ApplicationCommentsScreen"
        component={ApplicationCommentsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditProfileScreen"
        component={EditProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CompanyAddressesScreen"
        component={CompanyAddressesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateEditAddressScreen"
        component={CreateEditAddressScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateVerificationScreen"
        component={CreateVerificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerificationDetailScreen"
        component={VerificationDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerificationListScreen"
        component={VerificationListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChatDetailScreen"
        component={ChatDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StatsScreen"
        component={StatsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}