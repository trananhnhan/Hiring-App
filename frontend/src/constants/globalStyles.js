import { StyleSheet } from "react-native";
import {COLORS, SPACING} from "./theme";

export const globalStyles = StyleSheet.create({
    container : {
        flex : 1,
        backgroundColor : COLORS.background
    },

    content : {
        flex : 1,
        paddingHorizontal : SPACING.lg
    },

    rowCenter : {
        flexDirection : 'row',
        alignItems : 'center',
    },

    rowBetween : {
        flexDirection : 'row',
        alignItems : 'center',
        justifyContent : 'space-between',
    },
    centerAll : {
        justifyContent : 'center',
        alignItems : 'center'
    }
})