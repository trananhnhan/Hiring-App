import React from 'react';
import { StyleSheet, View } from 'react-native';
import { MultiSelect } from 'react-native-element-dropdown';
import { COLORS, SPACING, RADIUS, FONTSIZE } from '../constants/theme';

export const AppMultiSelect = ({
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
        <MultiSelect
            style={[styles.dropdown, disabled && styles.disabled]}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            inputSearchStyle={styles.inputSearchStyle}
            containerStyle={styles.containerStyle}
            
   
            selectedStyle={styles.selectedStyle}
            
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
        minHeight: 50, 
        backgroundColor: COLORS.background,
        borderColor: COLORS.border,
        borderWidth: 1,
        borderRadius: RADIUS.md, 
        paddingHorizontal: SPACING.md,
        paddingVertical: 5,
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
    },

    selectedStyle: {
        borderRadius: 12,
        backgroundColor: '#EFF6FF',
        borderWidth: 1,
        borderColor: '#BFDBFE',
        marginTop: 8,
        marginRight: 8,
        paddingHorizontal: 12,
        paddingVertical: 4,
    }
});