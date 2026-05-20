import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthContext } from '../../context/AuthContext'; // Nhớ trỏ đúng đường dẫn AuthContext của bạn
import { globalStyles } from '../../constants/globalStyles';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../constants/theme';
import { AppScreenWrapper } from '../../components/AppScreenWrapper';

export function ProfileScreen() {
  // Lôi thông tin user và hàm logout từ Context ra xài
  const { user, logout } = useContext(AuthContext);

  // Hàm xử lý hiển thị popup xác nhận trước khi đăng xuất
  const handleLogout = () => {
    Alert.alert(
      "Xác nhận đăng xuất",
      "Bạn có chắc chắn muốn đăng xuất khỏi ứng dụng không?",
      [
        { 
          text: "Hủy", 
          style: "cancel" // Nút xám hủy bỏ
        },
        { 
          text: "Đăng xuất", 
          style: "destructive", // Nút đỏ cảnh báo (trên iOS)
          onPress: () => logout() // Kích hoạt hàm logout từ AuthContext
        }
      ]
    );
  };

  return (
    <AppScreenWrapper>
      <View style={styles.container}>
        
        {/* 1. Khu vực Avatar và Thông tin người dùng */}
        <View style={styles.avatarSection}>
          <Ionicons name="person-circle" size={100} color={COLORS.textSecondary} />
          
          <Text style={styles.userName}>
            {/* Hiển thị tên hoặc placeholder nếu chưa có */}
            {user?.username || user?.email || 'Người dùng Ẩn danh'}
          </Text>
          
          <View style={globalStyles.chip}>
             <Text style={globalStyles.chipText}>
               {/* Giả định bạn có trường role trong object user */}
               {user?.role === 'employer' ? '👔 Nhà tuyển dụng' : '🧑‍💻 Ứng viên'}
             </Text>
          </View>
        </View>

        {/* 2. Cụm các nút chức năng khác (Chừa sẵn chỗ để bạn code CV/Settings sau) */}
        <View style={styles.menuSection}>
          {/* Chỗ này sau này chèn thêm các nút "Cập nhật CV", "Đổi mật khẩu"... */}
        </View>

        {/* 3. Nút Đăng xuất ở dưới cùng */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

      </View>
    </AppScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: 'space-between', // Đẩy Avatar lên trên, Đăng xuất xuống đáy
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: SPACING.xl,
  },
  userName: {
    fontSize: FONTSIZE.xl,
    fontWeight: FONTWEIGHT.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  menuSection: {
    flex: 1, // Chiếm hết không gian trống ở giữa
    marginTop: SPACING.xl,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    backgroundColor: '#FEE2E2', // Nền đỏ nhạt báo hiệu action nguy hiểm
    paddingVertical: 16,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: '#F87171',
    marginBottom: SPACING.xxl, // Đẩy lên một chút để không lẹm vào Bottom Tab
  },
  logoutText: {
    fontSize: FONTSIZE.md,
    fontWeight: FONTWEIGHT.bold,
    color: '#EF4444', // Chữ đỏ đậm
  }
});