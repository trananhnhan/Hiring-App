import { useState } from "react"
import { StyleSheet, View } from "react-native";
import { COLORS, FONTSIZE, SPACING } from "../constants/theme";
import { Text, TextInput } from "react-native-paper";

export const AppInput = ({
    label,
    errorText,
    isPassword = false,
    style,
    ...props

}) => {
    const [hidePassword, setHidePassword] = useState(isPassword);

    return (
        <View style = {[styles.container,style]}>
            <TextInput
                mode="outlined"
                label={label}
                secureTextEntry = {hidePassword}
                style = {styles.input}
                outlineColor= {errorText ? COLORS.error : COLORS.border}
                activeOutlineColor= {errorText ? COLORS.error : COLORS.primary}
                textColor= {COLORS.primary}

                right = { isPassword ? 
                    (
                        <TextInput.Icon
                            icon = {hidePassword ? 'eye-off' : 'eye'}
                            color={ COLORS.textSecondary}
                            onPress={() => setHidePassword(!hidePassword)}
                        />
                    ) : null
                }
                {...props}
            />
            {errorText ? <Text style = {styles.error}>{errorText}</Text> : null}
        </View>
    )
    
}

const styles = StyleSheet.create({
    container : {
        marginBottom : SPACING.md,
    },
    input : {
        backgroundColor : COLORS.background,
        fontSize : FONTSIZE.md
    },
    error:  {
        color: COLORS.error,
        fontSize : FONTSIZE.sm,
        marginTop: SPACING.xs,
        marginLeft : SPACING.sx,
    }
})