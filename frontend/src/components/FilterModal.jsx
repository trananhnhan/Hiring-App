import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppInput } from './AppInput';
import { useGlobalData } from '../context/GlobalDataContext';
import api from '../services/api';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../constants/theme';
import { AppDropdown } from './AppDropdown';

export const FilterModal = ({ visible, onClose, onApply, currentFilters }) => {
  const { provinces, careerFields } = useGlobalData();
  const [tempFilters, setTempFilters] = useState({});
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isDistrictLoading, setIsDistrictLoading] = useState(false);
  const [isWardLoading, setIsWardLoading] = useState(false);

  // Lấy dữ liệu Quận/Huyện
  const fetchDistricts = async (provinceId) => {
    try {
      setIsDistrictLoading(true);
      const response = await api.get(`/provinces/${provinceId}/districts/`);
      setDistricts(response.data);
    } catch (error) {
      console.error("Lỗi tải danh sách Quận/Huyện:", error);
    } finally {
      setIsDistrictLoading(false);
    }
  };

  // Lấy dữ liệu Phường/Xã
  const fetchWards = async (districtId) => {
    try {
      setIsWardLoading(true);
      const response = await api.get(`/districts/${districtId}/wards`);
      setWards(response.data);
    } catch (error) {
      console.error("Lỗi tải danh sách Phường/Xã:", error);
    } finally {
      setIsWardLoading(false);
    }
  };

  const handleProvinceChange = (provinceId) => {
    setTempFilters(prev => ({ ...prev, province: provinceId, district: null, ward: null }));
    setDistricts([]);
    setWards([]);
    if (provinceId) fetchDistricts(provinceId);
  };

  const handleDistrictChange = (districtId) => {
    setTempFilters(prev => ({ ...prev, district: districtId, ward: null }));
    setWards([]);
    if (districtId) fetchWards(districtId);
  };

  const parentCareers = careerFields;
  const selectedParentObj = careerFields.find(item => item.id === tempFilters.parent_career_id);
  const childCareers = selectedParentObj ? selectedParentObj.children : [];

  const handleParentCareerChange = (parentFieldId) => {
    setTempFilters(prev => ({ ...prev, parent_career_id: parentFieldId, career_field: null }));
  };

  useEffect(() => {
    if (visible) {
      setTempFilters(currentFilters || {});
      if (currentFilters?.province) fetchDistricts(currentFilters.province);
      if (currentFilters?.district) fetchWards(currentFilters.district);
    }
  }, [visible, currentFilters]);

  const handleApply = () => {

    const finalFilters = { ...tempFilters };
    if (!finalFilters.career_field && finalFilters.parent_career_id) {
      finalFilters.career_field = finalFilters.parent_career_id;
    }


    Keyboard.dismiss(); 

    // Bước 2: Đợi bàn phím hạ xuống xong (khoảng 150ms) rồi mới đóng Modal
    setTimeout(() => {
      onClose(); 

      // Bước 3: Đợi Modal trượt xuống xong hoàn toàn (khoảng 250ms) rồi mới đẩy data ra gọi API
      setTimeout(() => {
        onApply(finalFilters);
      }, 250);

    }, 150);
  };

  const handleCloseWrapper = () => {
    Keyboard.dismiss();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleCloseWrapper}>
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Bộ lọc nâng cao</Text>
            <TouchableOpacity onPress={handleCloseWrapper}>
              <Ionicons name="close" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Lọc lương - Đã fix lỗi thiết lập lại */}
            <Text style={styles.sectionTitle}>Mức lương mong muốn</Text>
            <AppInput
              keyboardType="numeric"
              value={tempFilters.expected_salary ? tempFilters.expected_salary.toString() : ''} 
              onChangeText={(val) => setTempFilters(prev => ({ ...prev, expected_salary: val }))}
            />

            {/* Tỉnh / Thành phố */}
            <Text style={styles.sectionTitle}>Tỉnh / Thành phố</Text>
            <AppDropdown
              data={provinces}
              value={tempFilters.province}
              onChange={(item) => handleProvinceChange(item.id)}
              placeholder="Chọn Tỉnh/Thành phố"
            />

            {/* Quận / Huyện */}
            <Text style={styles.sectionTitle}>Quận / Huyện</Text>
            {isDistrictLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppDropdown
                data={districts}
                value={tempFilters.district}
                onChange={(item) => handleDistrictChange(item.id)}
                placeholder="Chọn Quận/Huyện"
                disabled={!tempFilters.province}
              />
            )}

            {/* Phường / Xã */}
            <Text style={styles.sectionTitle}>Phường / Xã</Text>
            {isWardLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppDropdown
                data={wards}
                value={tempFilters.ward}
                onChange={(item) => setTempFilters(prev => ({ ...prev, ward: item.id }))}
                placeholder="Chọn Phường/Xã"
                disabled={!tempFilters.district}
                dropdownPosition="top"
              />
            )}

            {/* Nhóm ngành chính */}
            <Text style={styles.sectionTitle}>Nhóm ngành chính</Text>
            <AppDropdown
              data={parentCareers}
              labelField="field_name" 
              value={tempFilters.parent_career_id}
              onChange={(item) => handleParentCareerChange(item.id)}
              placeholder="Chọn Nhóm ngành chính"
              dropdownPosition="top"
            />

            {/* Chuyên ngành chi tiết */}
            <Text style={styles.sectionTitle}>Chuyên ngành chi tiết</Text>
            <AppDropdown
              data={childCareers}
              labelField="field_name" 
              value={tempFilters.career_field}
              onChange={(item) => setTempFilters(prev => ({ ...prev, career_field: item.id }))}
              placeholder="Chọn Chuyên ngành"
              disabled={!tempFilters.parent_career_id}
              dropdownPosition="top"
            />
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={() => setTempFilters({})}>
              <Text style={styles.resetBtnText}>Thiết lập lại</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>Áp dụng</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  bottomSheet: {
    width: '92%',             
    backgroundColor: COLORS.background,
    borderRadius: 24,
    overflow: 'hidden',             
    padding: SPACING.lg,
    maxHeight: '85%',         
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderColor: COLORS.surface, 
  },
  title: {
    fontSize: FONTSIZE.lg,
    fontWeight: FONTWEIGHT.bold,
    color: COLORS.textPrimary,
  },
  body: {
    paddingVertical: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONTSIZE.sm,
    fontWeight: FONTWEIGHT.bold,
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.lg,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.surface,
  },
  resetBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: RADIUS.full || 99, 
    alignItems: 'center',
  },
  resetBtnText: {
    color: COLORS.textPrimary,
    fontWeight: FONTWEIGHT.bold,
  },
  applyBtn: {
    flex: 2, 
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 14,
    borderRadius: RADIUS.full || 99,
    alignItems: 'center',
  },
  applyBtnText: {
    color: COLORS.background, 
    fontWeight: FONTWEIGHT.bold,
  },
});