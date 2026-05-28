import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';
import { GlobalDataProvider } from '../context/GlobalDataContext';
import MainStackNavigator from './MainStackNavigator';

// Sắp tạo cái này ở Bước 3
import ModeratorNavigator from './ModeratorNavigator'; 

import { COLORS } from '../constants/theme';

export const AppNavigator = () => {
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  
  return (
    <NavigationContainer>
      {user ? (
        // ✅ NẾU LÀ MODERATOR THÌ VÀO LUỒNG RIÊNG
        user.role === 'MODERATOR' ? (
            <ModeratorNavigator />
        ) : (
            <GlobalDataProvider>
              <MainStackNavigator/>
            </GlobalDataProvider>
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};