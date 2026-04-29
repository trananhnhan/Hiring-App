import { StyleSheet } from 'react-native';
// Lấy chuẩn xác các hằng số từ bộ theme của bạn
import { COLORS, SPACING, FONTSIZE, FONTWEIGHT, RADIUS } from '../../../constants/theme';

export const styles = StyleSheet.create({
    headerContainer: {
        marginBottom: SPACING.xl,
        alignItems: 'center',
        marginTop: SPACING.xl, // Đẩy xuống một chút cho thoáng
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
        borderRadius: RADIUS.lg, // Bo góc nhỏ hơn thằng cha (roleContainer) một chút
    },
    roleButtonActive: {
        backgroundColor: COLORS.primary, // Đen tuyền #0A0A0A
        // Đổ bóng nhẹ để cục màu đen nổi lên trên nền xám
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    roleText: {
        fontSize: FONTSIZE.sm,
        fontWeight: FONTWEIGHT.medium,
        color: COLORS.textSecondary, // Chữ xám cho role chưa chọn
    },
    roleTextActive: {
        color: COLORS.textInverse, // Chữ trắng trên nền đen
        fontWeight: FONTWEIGHT.bold,
    },
    /* -------------------------------------------------------- */

    errorText: {
        color: COLORS.error, // #C62828
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