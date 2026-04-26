import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTSIZE, FONTWEIGHT } from '../../../constants/theme';

export const styles = StyleSheet.create({
  // Cụm Header
  headerContainer: {
    marginBottom: SPACING.xxl, 
    alignItems: 'center'
  },
  title: {
    fontSize: FONTSIZE.xxl, 
    fontWeight: FONTWEIGHT.bold,
    color: COLORS.textPrimary // Bổ sung màu cho chắc chắn
  },
  subtitle: {
    color: COLORS.textSecondary
  },

  // Cụm Form nhập liệu
  formContainer: {
    marginBottom: SPACING.xl, 
    alignSelf: 'stretch' // Kéo giãn input ra 2 bên
  },
  forgotPasswordWrap: {
    alignItems: 'flex-end', 
    marginBottom: SPACING.xl
  },
  forgotPasswordText: {
    color: COLORS.textSecondary, 
    fontWeight: FONTWEIGHT.medium
  },

  // Cụm Footer
  registerText: {
    color: COLORS.primary, 
    fontWeight: FONTWEIGHT.bold
  }
});