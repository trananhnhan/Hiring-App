import { StyleSheet } from "react-native";
import { FONTSIZE,FONTWEIGHT,COLORS,SPACING,RADIUS } from "./theme";

export const globalStyles = StyleSheet.create({
    debug: {
        borderColor: 'red',
        borderWidth: 1,
    },
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },

    content: {
        flex: 1,
        paddingHorizontal: SPACING.lg
    },

    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    rowBetween: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    centerAll: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    h1: {
        fontSize: FONTSIZE.xxl,
        fontWeight: FONTWEIGHT.bold,
        color: COLORS.textPrimary,
    },
    h2: {
        fontSize: FONTSIZE.xl,
        fontWeight: FONTWEIGHT.bold,
        color: COLORS.textPrimary,
    },
    bodyText: {
        fontSize: FONTSIZE.md,
        color: COLORS.textSecondary,
        fontWeight: FONTWEIGHT.regular,
    },
    errorText: {
        fontSize: FONTSIZE.sm,
        color: COLORS.error,
        marginTop: SPACING.xs,
    },
    card: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.md,
        padding: SPACING.md,
        borderColor: COLORS.border,
        borderWidth: 1,
        marginBottom: SPACING.md,
    }
})