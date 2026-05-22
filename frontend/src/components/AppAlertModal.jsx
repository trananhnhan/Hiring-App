import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../constants/theme';

export const AppAlertModal = ({ 
  visible, 
  title, 
  message, 
  onClose, 
  type = 'error' // 'success' | 'error' | 'info'
}) => {
  
  // Tự động đổi Icon và màu sắc theo Type thông báo
  const getTypeConfig = () => {
    switch (type) {
      case 'success':
        return { icon: 'checkmark-circle', color: '#10B981' }; // Màu xanh lá
      case 'info':
        return { icon: 'information-circle', color: '#3B82F6' }; // Màu xanh dương
      case 'error':
      default:
        return { icon: 'close-circle', color: '#EF4444' }; // Màu đỏ
    }
  };

  const config = getTypeConfig();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.alertBox}>
          
          {/* Icon trạng thái bự ở giữa */}
          <Ionicons name={config.icon} size={54} color={config.color} style={styles.icon} />
          
          {/* Tiêu đề và Nội dung */}
          <Text style={styles.title}>{title || 'Thông báo'}</Text>
          <Text style={styles.message}>{message}</Text>
          
          {/* Nút đóng duy nhất */}
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: COLORS.textPrimary || '#111111' }]} 
            onPress={onClose}
          >
            <Text style={styles.buttonText}>Đồng ý</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertBox: {
    width: '80%',
    backgroundColor: COLORS.background || '#FFFFFF',
    borderRadius: RADIUS.xl || 20,
    padding: SPACING.lg || 20,
    alignItems: 'center',
    elevation: 5,
  },
  icon: {
    marginBottom: SPACING.sm || 10,
  },
  title: {
    fontSize: FONTSIZE.lg || 18,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
    marginBottom: SPACING.xs || 6,
    textAlign: 'center',
  },
  message: {
    fontSize: FONTSIZE.md || 14,
    color: COLORS.textSecondary || '#666666',
    textAlign: 'center',
    marginBottom: SPACING.lg || 20,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: RADIUS.full || 99,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: FONTWEIGHT.bold || 'bold',
    fontSize: FONTSIZE.md || 14,
  }
});