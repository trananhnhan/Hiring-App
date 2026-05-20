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
        marginBottom: SPACING.md,
        borderColor: COLORS.border,
        borderWidth: 1,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },

    chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: SPACING.md,
    gap: 8, 
    },

    chip: {
        backgroundColor: COLORS.surface,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 99, // Bo tròn trịa luôn
        borderColor: COLORS.border,
        borderWidth: 1,
    },

    chipText: {
    fontSize: FONTSIZE.xs,
    color: COLORS.textPrimary,
    fontWeight: FONTWEIGHT.medium,
    },
    
    statusBadgeContainer: {
        backgroundColor: '#4ADE80', 
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: RADIUS.full, 

        position: 'absolute',
        top: SPACING.md,
        right: SPACING.md,
        zIndex: 1, 
    },
    statusBadgeText: {
        fontSize: FONTSIZE.xs,
        color: COLORS.background, 
        fontWeight: FONTWEIGHT.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },


    footerStatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6, 
    },
    footerStatText: {
        fontSize: FONTSIZE.xs,
        color: COLORS.textSecondary, 
        fontWeight: FONTWEIGHT.medium,
    },
})