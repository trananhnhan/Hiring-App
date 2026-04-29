import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/context/AuthContext';
import { AppNavigator } from './src/navigation/AppNavigator';

// Nếu bạn có config riêng cho PaperTheme thì import vào đây
// import { paperTheme } from './src/constants/theme';

export default function App() {
  return (
    <AuthProvider>
      {/* Nếu xài paperTheme thì bọc vô: <PaperProvider theme={paperTheme}> */}
      <PaperProvider> 
        <AppNavigator />
      </PaperProvider>
    </AuthProvider>
  );
}