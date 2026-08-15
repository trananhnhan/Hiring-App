import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { globalStyles } from '../../../constants/globalStyles';
import { formatSalaryDisplay, formatDate } from '../../../utils/formatter';
import { COLORS, SPACING, FONTSIZE, FONTWEIGHT, RADIUS } from '../../../constants/theme';

export default function JobCard({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={[globalStyles.card, { position: 'relative', marginBottom: SPACING.md }]} 
      activeOpacity={0.8}
      onPress={() => navigation.navigate('JobDetail', { jobUuid: item.uuid })}
    >
      
      {item.status === 'OPEN' && (
        <View style={globalStyles.statusOpenBadgeContainer}><Text style={globalStyles.statusBadgeText}>OPEN</Text></View>
      )}
      {item.status === 'CLOSED' && (
        <View style={globalStyles.statusClosedBadgeContainer}><Text style={globalStyles.statusBadgeText}>CLOSED</Text></View>
      )}
      {item.status === 'DRAFT' && (
        <View style={globalStyles.statusDraftBadgeContainer}><Text style={globalStyles.statusBadgeText}>DRAFT</Text></View>
      )}

      
      <View style={[globalStyles.rowCenter, { alignItems: 'flex-start', gap: 12 }]}>
        <View style={styles.logoWrapper}>
          {item.job_thumbnail ? (
            <Image source={{ uri: item.job_thumbnail }} style={styles.logoImage} />
          ) : (
            <View style={[styles.logoImage, styles.logoPlaceholder]}>
              <Text style={styles.placeholderText}>
                {item.employer_profile?.company_name?.charAt(0).toUpperCase() || 'J'}
              </Text>
            </View>
          )}
        </View>

        <View style={{ flex: 1, paddingRight: 60 }}>
          <Text style={styles.companyName} numberOfLines={1}>
            {item.employer_profile?.company_name || 'Công ty ẩn danh'}
          </Text>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </View>

      
      <View style={[globalStyles.chipContainer, { marginTop: SPACING.sm }]}>
        <View style={globalStyles.chip}>
          <Text style={globalStyles.chipText}>
            💰 {formatSalaryDisplay(item.salary_min, item.salary_max)}
          </Text>
        </View>
        <View style={globalStyles.chip}>
          <Text style={globalStyles.chipText} numberOfLines={1}>
            📍 {item.address?.full_address || 'N/A'}
          </Text>
        </View>
      </View>

      
      <View style={[globalStyles.rowBetween, { marginTop: SPACING.md, paddingTop: SPACING.sm, borderTopWidth: 1, borderColor: COLORS.surface }]}>
        <Text style={globalStyles.bodyText, { fontSize: 12 }}>⏳ Hạn: {formatDate(item.expiry_date)}</Text>
        <Text style={globalStyles.bodyText, { fontSize: 12 }}>👥 Tuyển: {item.slot} | Nộp: {item.application_count}</Text>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  logoWrapper: { width: 50, height: 50, borderRadius: RADIUS.md, overflow: 'hidden' },
  logoImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  logoPlaceholder: { backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E5E7EB' },
  placeholderText: { fontSize: FONTSIZE.lg, fontWeight: FONTWEIGHT.bold, color: '#9CA3AF' },
  companyName: { fontSize: FONTSIZE.xs, color: '#6B7280', fontWeight: FONTWEIGHT.medium },
  jobTitle: { fontSize: FONTSIZE.md, color: '#111111', fontWeight: FONTWEIGHT.bold, marginTop: 2, lineHeight: 20 },
});