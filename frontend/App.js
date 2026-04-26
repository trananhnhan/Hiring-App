import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { LoginScreen } from './src/screens/auth/login/LoginScreen';
import { paperTheme } from './src/constants/theme';

export default function App() {
  return (
    // Bọc PaperProvider để cung cấp Theme cho toàn app
    <PaperProvider theme={paperTheme}>
      <LoginScreen />
    </PaperProvider>
  );
}