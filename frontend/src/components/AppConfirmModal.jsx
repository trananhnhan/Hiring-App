import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../constants/theme';

export const AppConfirmModal = ({ 
  visible, 
  title, 
  message, 
  onConfirm, 
  onCancel, 
  confirmText = 'Xác nhận', 
  cancelText = 'Hủy',
  isDanger = false 
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <View style={styles.confirmBox}>
          
          <Text style={styles.title}>{title || 'Xác nhận hành động'}</Text>
          <Text style={styles.message}>{message}</Text>
          
          
          <View style={styles.buttonGroup}>
            
            
            <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.cancelBtnText}>{cancelText}</Text>
            </TouchableOpacity>

            
            <TouchableOpacity 
              style={[styles.confirmBtn, { backgroundColor: isDanger ? '#EF4444' : (COLORS.textPrimary || '#111111') }]} 
              onPress={onConfirm}
            >
              <Text style={styles.confirmBtnText}>{confirmText}</Text>
            </TouchableOpacity>

          </View>

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
  confirmBox: {
    width: '85%',
    backgroundColor: COLORS.background || '#FFFFFF',
    borderRadius: RADIUS.xl || 20,
    padding: SPACING.lg || 20,
    elevation: 5,
  },
  title: {
    fontSize: FONTSIZE.lg || 18,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
    marginBottom: SPACING.sm || 10,
  },
  message: {
    fontSize: FONTSIZE.md || 14,
    color: COLORS.textSecondary || '#666666',
    marginBottom: SPACING.xl || 24,
    lineHeight: 20,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SPACING.md || 12,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: COLORS.surface || '#F3F4F6',
    paddingVertical: 12,
    borderRadius: RADIUS.full || 99,
    alignItems: 'center',
  },
  cancelBtnText: {
    color: COLORS.textPrimary || '#111111',
    fontWeight: FONTWEIGHT.bold || 'bold',
  },
  confirmBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: RADIUS.full || 99,
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: FONTWEIGHT.bold || 'bold',
  }
});