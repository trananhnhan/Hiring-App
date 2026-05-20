import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { globalStyles } from '../constants/globalStyles'; 
import { COLORS, SPACING } from '../constants/theme'; 

// Hàm Helper format ngày cũ (giữ nguyên logic)
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export const JobStatFooter = ({ expiryDate, slot, applicationCount, style }) => {
  return (
    // Dùng wrapper style cũ để giữ đường kẻ divider
    <View style={[styles.advancedFooter, style]}>
      {/* 1. Nhóm Stats bên trái (Slot và Ứng tuyển) */}
      <View style={styles.footerStatsGroup}>
        {/* Stat Item: Slot (thay "logo người" trong sketch bằng icon) */}
        <View style={globalStyles.footerStatItem}>
          <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
          <Text style={globalStyles.footerStatText}>{slot} người</Text>
        </View>
        
        {/* Stat Item: Application Count */}
        <View style={globalStyles.footerStatItem}>
          <Ionicons name="document-text-outline" size={16} color={COLORS.textSecondary} />
          <Text style={globalStyles.footerStatText}>Đã nộp: {applicationCount}</Text>
        </View>
      </View>

      {/* 2. Hạn nộp bên phải (giữ nguyên UI cũ) */}
      <View style={styles.expiryContainer}>
        <Text style={styles.expiryText}>
          Hạn nộp: {formatDate(expiryDate)}
        </Text>
      </View>
    </View>
  );
};

// Style cụ thể cho Footer Advanced
const styles = StyleSheet.create({
  advancedFooter: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderColor: COLORS.surface, // Đường divider mờ E0E0E0
    flexDirection: 'row',
    justifyContent: 'space-between', // Đẩy stats sang trái, ngày sang phải
    alignItems: 'center',
  },
  footerStatsGroup: {
    flexDirection: 'row',
    gap: SPACING.md, // Khoảng cách vừa phải giữa 2 stats
  },
  expiryContainer: {
    // Không cần push right vì justifyContent: 'space-between' đã làm rồi
  },
  expiryText: {
    // Giữ nguyên style metadata cũ
    fontSize: 11, //FONTSIZE.xs
    color: '#AAAAAA', //COLORS.textDisabled
  },
});