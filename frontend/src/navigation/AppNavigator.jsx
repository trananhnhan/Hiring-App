import React, { useContext } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { AuthContext } from '../context/AuthContext';
import { AuthNavigator } from './AuthNavigator';

import { COLORS } from '../constants/theme';
import MainBottomTabs from './MainBottomTabs';
import { GlobalDataProvider } from '../context/GlobalDataContext';

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
        <GlobalDataProvider>
          <MainBottomTabs />
        </GlobalDataProvider>
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
};