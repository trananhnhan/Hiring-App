import React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { COLORS, SPACING, FONTSIZE, FONTWEIGHT, RADIUS } from '../constants/theme';

export const AppButton = ({ 
  mode = 'contained', 
  title, 
  style, 
  textColor,
  isDanger = false, // ✅ Thêm prop mới: Nếu true, nút sẽ hóa Đỏ nguy hiểm
  ...props 
}) => {
  const isContained = mode === 'contained';
  const isOutlined = mode === 'outlined';

  // Định nghĩa màu đỏ nguy hiểm (nên lấy từ Theme, đây mình hardcode cho bồ dễ thấy)
  const COLOR_DANGER = '#EF4444';

  // ✅ 1. Tính toán màu nền (buttonColor)
  let finalButtonColor;
  if (isContained) {
    // Nếu Contained và Danger -> Nền Đỏ. Nếu không Danger -> Nền Đen mặc định
    finalButtonColor = isDanger ? COLOR_DANGER : COLORS.primary;
  } else {
    // Nút Outlined hoặc Text thì nền trong suốt
    finalButtonColor = 'transparent';
  }

  // ✅ 2. Tính toán màu chữ (textColor)
  let finalTextColor;
  if (textColor) {
    // Ưu tiên màu truyền trực tiếp
    finalTextColor = textColor;
  } else if (isDanger && isContained) {
    // Nếu Nền Đỏ (Danger + Contained) -> Chữ phải màu TRẮNG
    finalTextColor = '#FFFFFF';
  } else if (isDanger && isOutlined) {
    // Nếu Viền Đỏ (Danger + Outlined) -> Chữ màu ĐỎ
    finalTextColor = COLOR_DANGER;
  } else {
    // Mặc định
    finalTextColor = isContained ? COLORS.textInverse : COLORS.primary;
  }

  // ✅ 3. Tính toán style viền (Cho nút Outlined Danger)
  const destructiveOutlineStyle = (isOutlined && isDanger) 
    ? { borderColor: COLOR_DANGER } 
    : null;

  return (
    <Button
      mode={mode}
      style={[styles.button, destructiveOutlineStyle, style]} // Nhét style viền vào
      contentStyle={styles.content}
      labelStyle={[
        styles.label, 
        { color: finalTextColor } // Áp dụng màu chữ thông minh
      ]}
      buttonColor={finalButtonColor} // Áp dụng màu nền thông minh
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