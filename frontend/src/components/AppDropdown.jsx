import React from 'react';
import { StyleSheet } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS, SPACING, RADIUS, FONTSIZE } from '../constants/theme';

export const AppDropdown = ({
    data,
    value,
    onChange,
    placeholder,
    labelField = 'name',
    valueField = 'id',
    search = true,
    disabled = false,
    dropdownPosition = 'auto',
    flatListProps 
}) => {
    return (
        <Dropdown
            style={[styles.dropdown, disabled && styles.disabled]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            containerStyle={styles.containerStyle}
            data={data}
            search={search}
            maxHeight={300}
            labelField={labelField}
            valueField={valueField}
            placeholder={disabled ? "Vui lòng chọn mục phía trên trước" : placeholder}
            searchPlaceholder="Tìm kiếm..."
            value={value}
            onChange={onChange}
            disable={disabled}
            dropdownPosition={dropdownPosition} 
            flatListProps={flatListProps}
        />
    );
};

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        backgroundColor: COLORS.background,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: RADIUS.md, 
        paddingHorizontal: SPACING.md,
    },
    disabled: {
        backgroundColor: COLORS.surface,
        opacity: 0.6,
    },
    placeholderStyle: {
        fontSize: FONTSIZE.md,
        color: COLORS.textSecondary,
    },
    selectedTextStyle: {
        fontSize: FONTSIZE.md,
        color: COLORS.textPrimary,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: FONTSIZE.md,
        borderRadius: RADIUS.sm,
    },
    containerStyle: {
        borderRadius: RADIUS.md,
        overflow: 'hidden',
    }
});