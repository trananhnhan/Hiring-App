// src/components/ScreenWrapper.jsx
import React from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/theme';
import { globalStyles } from '../constants/globalStyles';

export const AppScreenWrapper = ({ children, style, useSafeArea = true }) => {
  const Container = useSafeArea ? SafeAreaView : View;

  return (
    <Container style={[globalStyles.container, style]}>
      <KeyboardAvoidingView 
        style={globalStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </Container>
  );
};
