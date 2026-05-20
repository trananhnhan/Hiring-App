import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
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

  // Khi người dùng thay đổi Tỉnh/Thành
  const handleProvinceChange = (provinceId) => {
    setTempFilters(prev => ({
      ...prev,
      province: provinceId,
      district: null,
      ward: null
    }));
    setDistricts([]);
    setWards([]);
    if (provinceId) fetchDistricts(provinceId);
  };

  // Khi người dùng thay đổi Quận/Huyện
  const handleDistrictChange = (districtId) => {
    setTempFilters(prev => ({ ...prev, district: districtId, ward: null }));
    setWards([]);
    if (districtId) fetchWards(districtId);
  };



  const parentCareers = careerFields;

  // Tìm đối tượng ngành cha đang được chọn để lấy mảng con bên trong nó
  const selectedParentObj = careerFields.find(item => item.id === tempFilters.parent_career_id);

  const childCareers = selectedParentObj ? selectedParentObj.children : [];

  const handleParentCareerChange = (parentFieldId) => {
    setTempFilters(prev => ({
      ...prev,
      parent_career_id: parentFieldId,
      career_field: null 
    }));
  };

  // Đồng bộ dữ liệu mỗi khi mở Modal
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

    onApply(finalFilters);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.bottomSheet}>

          <View style={styles.header}>
            <Text style={styles.title}>Bộ lọc nâng cao</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} /></TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Lọc lương */}
            <Text style={styles.sectionTitle}>Mức lương mong muốn</Text>
            <AppInput
              keyboardType="numeric"
              value={tempFilters.expected_salary?.toString()}
              onChangeText={(val) => setTempFilters(prev => ({ ...prev, expected_salary: val }))}
            />

            {/* --- CỤM ĐỊA CHỈ 3 CẤP --- */}
            <Text style={styles.sectionTitle}>Tỉnh / Thành phố</Text>
            <AppDropdown
              data={provinces}
              value={tempFilters.province}
              onChange={(item) => handleProvinceChange(item.id)}
              placeholder="Chọn Tỉnh/Thành phố"
            />

            <Text style={styles.sectionTitle}>Quận / Huyện</Text>
            {isDistrictLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppDropdown
                data={districts}
                value={tempFilters.district}
                onChange={(item) => handleDistrictChange(item.id)}
                placeholder="Chọn Quận/Huyện"
                disabled={!tempFilters.province} // Khóa nếu chưa chọn Tỉnh
              />
            )}

            <Text style={styles.sectionTitle}>Phường / Xã</Text>
            {isWardLoading ? (
              <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 10 }} />
            ) : (
              <AppDropdown
                data={wards}
                value={tempFilters.ward}
                onChange={(item) => setTempFilters(prev => ({ ...prev, ward: item.id }))}
                placeholder="Chọn Phường/Xã"
                disabled={!tempFilters.district} // Khóa nếu chưa chọn Huyện
                dropdownPosition="top" // Thêm dòng này để ép bung lên trên!
              />
            )}

            {/* --- CỤM LĨNH VỰC CHA - CON --- */}
            <Text style={styles.sectionTitle}>Nhóm ngành chính</Text>
            <AppDropdown
              data={parentCareers}
              labelField="field_name" 
              value={tempFilters.parent_career_id}
              onChange={(item) => handleParentCareerChange(item.id)}
              placeholder="Chọn Nhóm ngành chính"
              dropdownPosition="top" // Thêm dòng này để ép bung lên trên!
            />

            <Text style={styles.sectionTitle}>Chuyên ngành chi tiết</Text>
            <AppDropdown
              data={childCareers}
              labelField="field_name" 
              value={tempFilters.career_field}
              onChange={(item) => setTempFilters(prev => ({ ...prev, career_field: item.id }))}
              placeholder="Chọn Chuyên ngành"
              disabled={!tempFilters.parent_career_id} // Khóa nếu chưa chọn Ngành cha
              dropdownPosition="top" // Thêm dòng này để ép bung lên trên!
            />

          </ScrollView>

          {/* Cụm nút bấm chân trang */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={() => setTempFilters({})}><Text style={styles.resetBtnText}>Thiết lập lại</Text></TouchableOpacity>
            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}><Text style={styles.applyBtnText}>Áp dụng</Text></TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // 1. Lớp nền mờ đen phía sau Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end', // Ép nội dung rớt xuống đáy màn hình
  },

  // 2. Cái bảng trắng vuốt lên (Bottom Sheet)
  bottomSheet: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: RADIUS.xl, // Bo góc bự cho đẹp
    borderTopRightRadius: RADIUS.xl,
    padding: SPACING.lg,

    maxHeight: '90%', // Đừng cho nó cao lút cán màn hình, chừa lại 10% ở trên
  },

  // 3. Header của Modal (Có chữ Bộ lọc và nút X)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderColor: COLORS.surface, // Viền xám mờ
  },
  title: {
    fontSize: FONTSIZE.lg,
    fontWeight: FONTWEIGHT.bold,
    color: COLORS.textPrimary,
  },

  // 4. Phần thân chứa các form nhập (cho phép cuộn)
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

  // 5. Khung Placeholder giả lập cái Dropdown (khi bạn ráp UI Dropdown thật vào thì bỏ cái này đi)
  placeholderBox: {
    height: 50,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  // 6. Cụm nút bấm dưới cùng (Chân trang)
  footer: {
    flexDirection: 'row',
    gap: SPACING.md,
    paddingTop: SPACING.lg,
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.surface,
  },

  // Nút Thiết lập lại (Reset - Màu Xám Trắng)
  resetBtn: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: 14,
    borderRadius: RADIUS.full, // Bo tròn dạng viên thuốc
    alignItems: 'center',
  },
  resetBtnText: {
    color: COLORS.textPrimary,
    fontWeight: FONTWEIGHT.bold,
  },

  // Nút Áp dụng (Apply - Màu Đen Tuyệt đối)
  applyBtn: {
    flex: 2, // Làm nút Apply bự gấp đôi nút Reset cho dễ bấm
    backgroundColor: COLORS.textPrimary,
    paddingVertical: 14,
    borderRadius: RADIUS.full,
    alignItems: 'center',
  },
  applyBtnText: {
    color: COLORS.background, // Chữ trắng
    fontWeight: FONTWEIGHT.bold,
  },
});