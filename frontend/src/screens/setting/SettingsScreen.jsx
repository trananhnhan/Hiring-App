import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../context/AuthContext';
import { COLORS } from '../../constants/theme';
import { globalStyles } from '../../constants/globalStyles';

import { styles } from './style';

export default function SettingsScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user: currentUser, logout } = useContext(AuthContext);

  
  const isEmployer = currentUser?.role === 'EMPLOYER';

  
  const SettingRow = ({ icon, title, description, onPress, isLast = false }) => (
    <TouchableOpacity 
      style={[styles.rowContainer, isLast && styles.rowLast]} 
      activeOpacity={0.7} 
      onPress={onPress}
    >
      <View style={styles.rowLeft}>
        <View style={styles.iconWrapper}>
          <Ionicons name={icon} size={22} color={COLORS.textPrimary || '#111111'} />
        </View>
        <View style={styles.textWrapper}>
          <Text style={styles.rowTitle}>{title}</Text>
          {description && <Text style={styles.rowDescription}>{description}</Text>}
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={COLORS.textSecondary || '#6B7280'} />
    </TouchableOpacity>
  );

  return (
    <View style={[globalStyles.container, { backgroundColor: '#F9FAFB', paddingTop: Math.max(insets.top, 24) }]}>
      
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary || '#111111'} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cài đặt hệ thống</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        
        <Text style={styles.sectionTitle}>Tài khoản & Bảo mật</Text>
        <View style={styles.menuGroup}>
          <SettingRow 
            icon="person-circle-outline" 
            title="Thông tin cá nhân" 
            description="Quản lý tên hiển thị, avatar, thông tin liên hệ"
            onPress={() => navigation.navigate('EditProfileScreen')} 
            isLast={false} 
          />
          
          
          <SettingRow 
            icon="bar-chart-outline" 
            title="Thống kê phân tích" 
            description={isEmployer ? "Xem số liệu bài đăng và tổng đơn ứng tuyển" : "Xem tỷ lệ trúng tuyển và lịch sử nộp đơn"}
            onPress={() => navigation.navigate('StatsScreen')} 
            isLast={true} 
          />
        </View>

        
        {isEmployer && (
          <>
            <Text style={styles.sectionTitle}>Quản lý Doanh nghiệp</Text>
            <View style={styles.menuGroup}>
              
              <SettingRow 
                icon="location-outline" 
                title="Cơ sở / Văn phòng" 
                description="Thiết lập địa chỉ các chi nhánh làm việc"
                onPress={() => navigation.navigate('CompanyAddressesScreen')} 
              />
              
              <SettingRow 
                icon="shield-checkmark-outline" 
                title="Xác thực công ty" 
                description={currentUser?.profile?.is_verified ? "Đơn vị đã được xác thực" : "Gửi yêu cầu xác thực công ty"}
                onPress={() => navigation.navigate('VerificationListScreen')} 
                isLast={true}
              />
            </View>
          </>
        )}

        
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={styles.logoutText}>Đăng xuất tài khoản</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
}