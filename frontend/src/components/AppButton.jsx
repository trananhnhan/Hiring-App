import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, SPACING, FONTSIZE, FONTWEIGHT, RADIUS } from '../constants/theme';

export const AppButton = ({ 
  mode = 'contained', 
  title, 
  style, 
  textColor,
  isDanger = false, 
  ...props 
}) => {
  const isContained = mode === 'contained';
  const isOutlined = mode === 'outlined';

  const COLOR_DANGER = '#EF4444';

  let finalButtonColor;
  if (isContained) {

    finalButtonColor = isDanger ? COLOR_DANGER : COLORS.primary;
  } else {

    finalButtonColor = 'transparent';
  }


  let finalTextColor;
  if (textColor) {

    finalTextColor = textColor;
  } else if (isDanger && isContained) {

    finalTextColor = '#FFFFFF';
  } else if (isDanger && isOutlined) {

    finalTextColor = COLOR_DANGER;
  } else {

    finalTextColor = isContained ? COLORS.textInverse : COLORS.primary;
  }


  const destructiveOutlineStyle = (isOutlined && isDanger) 
    ? { borderColor: COLOR_DANGER } 
    : null;

  return (
    <Button
      mode={mode}
      style={[styles.button, destructiveOutlineStyle, style]} 
      contentStyle={styles.content}
      labelStyle={[
        styles.label, 
        { color: finalTextColor } 
      ]}
      buttonColor={finalButtonColor} 
      {...props}
    >
      {title}
    </Button>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    marginTop: SPACING.sm,
  },
  content: {
    paddingVertical: SPACING.sm, 
  },
  label: {
    fontSize: FONTSIZE.md,
    fontWeight: FONTWEIGHT.bold,
  }
});