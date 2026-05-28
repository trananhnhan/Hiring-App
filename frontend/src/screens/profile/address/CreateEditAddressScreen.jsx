import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../../context/AuthContext';
import { useGlobalData } from '../../../context/GlobalDataContext';
import { addressService } from '../../../services/addressService';
import { profileServices } from '../../../services/profileService';
import { globalStyles } from '../../../constants/globalStyles';

import { AppDropdown } from '../../../components/AppDropdown';
import { AppButton } from '../../../components/AppButton';
import { AppAlertModal } from '../../../components/AppAlertModal';

export default function CreateEditAddressScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { setUser } = useContext(AuthContext);
    
    // Data truyền qua nếu là Edit Mode
    const { addressData } = route.params || {};
    const isEditMode = !!addressData;

    // --- 1. KÉO PROVINCES TỪ GLOBAL CONTEXT ---
    const { provinces } = useGlobalData();
    const provinceOptions = useMemo(() => {
        return (provinces || []).map(p => ({ label: p.name, value: p.id }));
    }, [provinces]);

    // --- 2. STATES ---
    const [provinceId, setProvinceId] = useState(addressData?.province?.id || null);
    const [districtId, setDistrictId] = useState(addressData?.district?.id || null);
    const [wardId, setWardId] = useState(addressData?.ward?.id || null);
    
    const [fullAddress, setFullAddress] = useState(addressData?.full_address || '');
    const [latitude, setLatitude] = useState(addressData?.latitude?.toString() || '');
    const [longitude, setLongitude] = useState(addressData?.longitude?.toString() || '');

    const [districtOptions, setDistrictOptions] = useState([]);
    const [wardOptions, setWardOptions] = useState([]);

    const [isSaving, setIsSaving] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    // --- 3. FETCH DATA BAN ĐẦU KHI VÀO EDIT MODE ---
    useEffect(() => {
        if (isEditMode) {
            addressService.getDistricts(addressData.province.id)
                .then(res => setDistrictOptions(res.map(d => ({ label: d.name, value: d.id }))));
            addressService.getWards(addressData.district.id)
                .then(res => setWardOptions(res.map(w => ({ label: w.name, value: w.id }))));
        }
    }, [isEditMode]);

    // --- 4. XỬ LÝ CHỌN DROPDOWN CASCADING ---
    const handleProvinceChange = async (id) => {
        setProvinceId(id);
        setDistrictId(null); setWardId(null);
        setDistrictOptions([]); setWardOptions([]);
        
        const res = await addressService.getDistricts(id);
        setDistrictOptions(res.map(d => ({ label: d.name, value: d.id })));
    };

    const handleDistrictChange = async (id) => {
        setDistrictId(id);
        setWardId(null);
        setWardOptions([]);

        const res = await addressService.getWards(id);
        setWardOptions(res.map(w => ({ label: w.name, value: w.id })));
    };

    // --- 5. LƯU DỮ LIỆU ---
    const handleSave = async () => {
        if (!wardId) {
            setAlertConfig({ visible: true, type: 'error', title: 'Cảnh báo', message: 'Vui lòng chọn đầy đủ Tỉnh, Quận, Phường.' });
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ward_id: wardId,
                full_address: fullAddress || null,
                latitude: latitude ? parseFloat(latitude) : null,
                longitude: longitude ? parseFloat(longitude) : null,
            };

            if (isEditMode) {
                // Backend báo "gửi field nào sửa field đó" nên chỉ bọc những cái cần thiết
                await addressService.updateAddress(addressData.uuid, payload);
            } else {
                await addressService.createAddress(payload);
            }

            // Refresh Context
            const updatedUser = await profileServices.getMe();
            setUser(updatedUser);

            setAlertConfig({
                visible: true, type: 'success', title: 'Thành công',
                message: isEditMode ? 'Đã cập nhật cơ sở.' : 'Đã thêm cơ sở mới.',
                onCloseOverride: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    navigation.goBack();
                }
            });
        } catch (error) {
            console.log("🔥 LỖI 400 TỪ DJANGO:", error.response?.data || error.message);
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể lưu địa chỉ.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={isSaving}>
                    <Ionicons name="close" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Cập nhật cơ sở' : 'Thêm cơ sở mới'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} keyboardShouldPersistTaps="handled">
                <View style={styles.formGroup}>
                    <Text style={styles.label}>Tỉnh / Thành phố <Text style={{ color: 'red' }}>*</Text></Text>
                    <AppDropdown data={provinceOptions} value={provinceId} labelField="label" valueField="value" placeholder="Chọn Tỉnh/Thành" onChange={(item) => handleProvinceChange(item.value)} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Quận / Huyện <Text style={{ color: 'red' }}>*</Text></Text>
                    <AppDropdown data={districtOptions} value={districtId} labelField="label" valueField="value" placeholder="Chọn Quận/Huyện" onChange={(item) => handleDistrictChange(item.value)} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Phường / Xã <Text style={{ color: 'red' }}>*</Text></Text>
                    <AppDropdown data={wardOptions} value={wardId} labelField="label" valueField="value" placeholder="Chọn Phường/Xã" onChange={(item) => setWardId(item.value)} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.label}>Địa chỉ chi tiết (Số nhà, tên đường)</Text>
                    <TextInput style={styles.input} placeholder="Ví dụ: 123 Nguyễn Văn A" value={fullAddress} onChangeText={setFullAddress} />
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Vĩ độ (Latitude)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="10.123" value={latitude} onChangeText={setLatitude} />
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.label}>Kinh độ (Longitude)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="106.123" value={longitude} onChangeText={setLongitude} />
                    </View>
                </View>

                <AppButton 
                    title={isSaving ? "Đang lưu..." : "Lưu Địa Chỉ"} 
                    mode="contained" onPress={handleSave} disabled={isSaving} 
                    style={{ marginTop: 12 }} 
                />
            </ScrollView>

            <AppAlertModal 
                visible={alertConfig.visible} type={alertConfig.type} 
                title={alertConfig.title} message={alertConfig.message} 
                onClose={() => {
                    if (alertConfig.onCloseOverride) alertConfig.onCloseOverride();
                    else setAlertConfig(prev => ({ ...prev, visible: false }));
                }} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    backBtn: { padding: 4 },
    formGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#4B5563', marginBottom: 6 },
    input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 15, color: '#111111' }
});