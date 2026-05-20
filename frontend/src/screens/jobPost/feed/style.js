import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../../constants/theme';

export const styles = StyleSheet.create({

  logoWrapper: {
    marginRight: SPACING.md,
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: RADIUS.sm,
  },
  logoPlaceholder: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  placeholderText: {
    color: COLORS.textSecondary,
    fontWeight: FONTWEIGHT.bold,
    fontSize: FONTSIZE.xl,
  },


  infoWrapper: {
    flex: 1, 
  },
  companyName: {
    fontSize: FONTSIZE.sm,
    color: COLORS.textSecondary,
    fontWeight: FONTWEIGHT.medium,
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: FONTSIZE.lg,
    color: COLORS.textPrimary,
    fontWeight: FONTWEIGHT.bold,
    lineHeight: 22, 
  },

  footerContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderColor: COLORS.surface,
    alignItems: 'flex-end',
  },
  expiryText: {
    fontSize: FONTSIZE.xs,
    color: COLORS.textDisabled,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },

  searchInputWrapper: {
    flex: 1, // Chiếm hết không gian còn lại
    marginBottom: 0, // Ghi đè marginBottom của AppInput để canh giữa với nút Filter
  },
  filterButton: {
    backgroundColor: COLORS.textSecondary,
    height: 50, // Cùng chiều cao với AppInput mặc định
    paddingHorizontal: SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterButtonText: {
    color: COLORS.surface,
    fontWeight: 'bold',
  }
});