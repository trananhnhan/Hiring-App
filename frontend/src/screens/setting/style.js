import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../constants/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md || 16,
    paddingBottom: SPACING.md || 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: FONTSIZE.lg || 18,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
  },
  content: { 
    padding: SPACING.lg || 20 
  },
  sectionTitle: {
    fontSize: FONTSIZE.xs || 12,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textSecondary || '#6B7280',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm || 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  menuGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: RADIUS.lg || 16,
    borderWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
    paddingHorizontal: SPACING.md || 16,
    marginBottom: SPACING.xl || 24,
    overflow: 'hidden',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md || 16,
    borderBottomWidth: 1,
    borderColor: COLORS.border || '#F3F4F6',
  },
  rowLast: {
    borderBottomWidth: 0, // Dòng cuối group xóa đường gạch chân
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md || 12,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: RADIUS.sm || 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textWrapper: {
    flex: 1,
    paddingRight: SPACING.sm || 8,
  },
  rowTitle: {
    fontSize: FONTSIZE.md || 15,
    fontWeight: FONTWEIGHT.bold || '600',
    color: COLORS.textPrimary || '#111111',
  },
  rowDescription: {
    fontSize: FONTSIZE.sm || 12,
    color: COLORS.textSecondary || '#6B7280',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.error || '#EF4444',
    paddingVertical: 14,
    borderRadius: RADIUS.md || 12,
    marginTop: SPACING.lg || 16,
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