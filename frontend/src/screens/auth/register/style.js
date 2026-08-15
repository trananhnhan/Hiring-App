import { StyleSheet } from 'react-native';

import { COLORS, SPACING, FONTSIZE, FONTWEIGHT, RADIUS } from '../../../constants/theme';

export const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
        marginTop: SPACING.xl, 
    },
    title: {
        fontSize: FONTSIZE.xxl,
        fontWeight: FONTWEIGHT.bold,
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        fontSize: FONTSIZE.md,
        color: COLORS.textSecondary,
    },
    formContainer: {
        marginBottom: SPACING.xl,
        alignSelf: 'stretch',
    },

    /*Giao diện nút gạt chọn Role */
    roleContainer: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.lg,
        padding: SPACING.xs,
        marginBottom: SPACING.xl,
    },
    roleButton: {
        flex: 1,
        paddingVertical: SPACING.sm,
        alignItems: 'center',
        borderRadius: RADIUS.lg, 
    },
    roleButtonActive: {
        backgroundColor: COLORS.primary, 
        
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    roleText: {
        fontSize: FONTSIZE.sm,
        fontWeight: FONTWEIGHT.medium,
        color: COLORS.textSecondary, 
    },
    roleTextActive: {
        color: COLORS.textInverse, 
        fontWeight: FONTWEIGHT.bold,
    },
    /* -------------------------------------------------------- */

    errorText: {
        color: COLORS.error, 
        fontSize: FONTSIZE.sm,
        marginBottom: SPACING.md,
        textAlign: 'center',
    },
    loginTextWrap: {
        marginTop: SPACING.xl,
        marginBottom: SPACING.xxl,
    },
    loginText: {
        color: COLORS.primary,
        fontWeight: FONTWEIGHT.bold,
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20
    },
    avatarItem: {
        width: 80, 
        height: 80, 
        borderRadius: 40,
        backgroundColor: COLORS.surface,
        borderWidth: 1, 
        borderColor: COLORS.border,
        justifyContent: 'center', 
        alignItems: 'center',
        overflow: 'hidden'
    },
});