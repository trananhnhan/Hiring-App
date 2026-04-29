import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppButton } from '../components/AppButton';
import { AuthContext } from '../context/AuthContext';
import { globalStyles } from '../constants/globalStyles';
import { FONTSIZE, SPACING } from '../constants/theme';

const Stack = createNativeStackNavigator();

const DummyHomeScreen = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={globalStyles.centerAll}>
      <Text style={{ fontSize: FONTSIZE.xl, marginBottom: SPACING.md }}>
        Xin chào, {user?.name || 'Tài khoản ẩn danh'}!
      </Text>
      <Text style={{ color: 'gray', marginBottom: SPACING.xxl }}>
        Quyền hạn: {user?.role || 'Chưa rõ'}
      </Text>
      
      {/* Nút bấm đá văng User ra ngoài */}
      <AppButton 
        title="Đăng Xuất Khỏi Hệ Thống" 
        onPress={logout} 
        style={{ backgroundColor: '#C62828', width: 250 }} 
      />
    </View>
  );
};

export const MainNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={DummyHomeScreen} options={{ title: 'Trang Chủ' }} />
    </Stack.Navigator>
  );
};