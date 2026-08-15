import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { globalStyles } from '../constants/globalStyles';
import { COLORS, SPACING } from '../constants/theme';


const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

export const JobStatFooter = ({ expiryDate, slot, applicationCount, style }) => {
  return (

    <View style={[styles.advancedFooter, style]}>

      <View style={styles.footerStatsGroup}>

        <View style={globalStyles.footerStatItem}>
          <Ionicons name="people-outline" size={16} color={COLORS.textSecondary} />
          <Text style={globalStyles.footerStatText}>{slot} người</Text>
        </View>


        <View style={globalStyles.footerStatItem}>
          <Ionicons name="document-text-outline" size={16} color={COLORS.textSecondary} />
          <Text style={globalStyles.footerStatText}>Đã nộp: {applicationCount}</Text>
        </View>
      </View>


      <View style={styles.expiryContainer}>
        <Text style={styles.expiryText}>
          Hạn nộp: {formatDate(expiryDate)}
        </Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  advancedFooter: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderColor: COLORS.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerStatsGroup: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  expiryContainer: {

  },
  expiryText: {

    fontSize: 11,
    color: '#AAAAAA',
  },
});