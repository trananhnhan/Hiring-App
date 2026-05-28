import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../../constants/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md || 16,
    paddingBottom: SPACING.md || 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: FONTSIZE.lg || 18,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: '#111111',
  },
  scrollContent: {
    padding: SPACING.md || 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.md || 16,
    borderRadius: RADIUS.md || 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: SPACING.xl || 24,
  },
  sectionLabel: {
    fontSize: FONTSIZE.sm || 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  jobTitle: {
    fontSize: FONTSIZE.lg || 18,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: '#3B82F6',
    marginBottom: 8,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  companyName: {
    fontSize: FONTSIZE.md || 16,
    color: '#4B5563',
    fontWeight: '500',
  },
  formGroup: {
    marginBottom: SPACING.xl || 24,
  },
  inputLabel: {
    fontSize: FONTSIZE.md || 16,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: '#111111',
    marginBottom: 6,
  },
  helperText: {
    fontSize: FONTSIZE.sm || 14,
    color: '#6B7280',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: RADIUS.md || 12,
    padding: SPACING.md || 16,
    fontSize: FONTSIZE.md || 16,
    color: '#111111',
    minHeight: 120,
  },
  footer: {
    backgroundColor: '#FFFFFF',
    padding: SPACING.md || 16,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  }
});