// src/components/CustomButton.jsx
import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, SPACING, FONTSIZE, FONTWEIGHT, RADIUS } from '../constants/theme';

export const AppButton = ({ 
  mode = 'contained', 
  title, 
  style, 
  ...props 
}) => {
  const isContained = mode === 'contained';

  return (
    <Button
      mode={mode}
      style={[styles.button, style]}
      contentStyle={styles.content}
      labelStyle={[
        styles.label, 
        { color: isContained ? COLORS.textInverse : COLORS.primary } // Nút đen chữ trắng, nút viền chữ đen
      ]}
      buttonColor={isContained ? COLORS.primary : 'transparent'}
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
    paddingVertical: SPACING.sm, // Độ dày tiêu chuẩn
  },
  label: {
    fontSize: FONTSIZE.md,
    fontWeight: FONTWEIGHT.bold,
  }
});