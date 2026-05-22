import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../constants/theme';
import { globalStyles } from '../../constants/globalStyles';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { logout } = useContext(AuthContext);

  return (
    <View style={[globalStyles.container, { paddingTop: insets.top > 0 ? insets.top + 10 : 24 }]}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary || '#111111'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hệ thống</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Tài khoản & Bảo mật</Text>
        
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md || 16,
    paddingBottom: SPACING.md || 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: FONTSIZE.md || 16,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
  },
  content: { flex: 1, padding: SPACING.lg || 20 },
  sectionTitle: {
    fontSize: FONTSIZE.xs || 12,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textSecondary || '#6B7280',
    textTransform: 'uppercase',
    marginBottom: SPACING.md || 12,
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.error || '#EF4444',
    paddingVertical: 12,
    borderRadius: RADIUS.md || 12,
    marginTop: SPACING.sm || 8,
    shadowColor: COLORS.error || '#EF4444',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: FONTSIZE.md || 14,
    fontWeight: FONTWEIGHT.bold || 'bold',
  },
});