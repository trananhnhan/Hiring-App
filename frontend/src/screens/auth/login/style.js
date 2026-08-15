import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONTSIZE, FONTWEIGHT } from '../../../constants/theme';

export const styles = StyleSheet.create({
  
  headerContainer: {
    marginBottom: SPACING.xxl, 
    alignItems: 'center'
  },
  title: {
    fontSize: FONTSIZE.xxl, 
    fontWeight: FONTWEIGHT.bold,
    color: COLORS.textPrimary 
  },
  subtitle: {
    color: COLORS.textSecondary
  },

  
  formContainer: {
    marginBottom: SPACING.xl, 
    alignSelf: 'stretch' 
  },
  forgotPasswordWrap: {
    alignItems: 'flex-end', 
    marginBottom: SPACING.xl
  },
  forgotPasswordText: {
    color: COLORS.textSecondary, 
    fontWeight: FONTWEIGHT.medium
  },

  
  registerText: {
    color: COLORS.primary, 
    fontWeight: FONTWEIGHT.bold
  }
});