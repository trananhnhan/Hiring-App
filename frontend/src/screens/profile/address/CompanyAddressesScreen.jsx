import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../../context/AuthContext';
import { addressService } from '../../../services/addressService';
import { profileServices } from '../../../services/profileService';
import { globalStyles } from '../../../constants/globalStyles';
import { COLORS, RADIUS, SPACING } from '../../../constants/theme';

import { AppConfirmModal } from '../../../components/AppConfirmModal';
import { AppAlertModal } from '../../../components/AppAlertModal';

export default function CompanyAddressesScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    
    const { user: currentUser, setUser } = useContext(AuthContext);
    const addresses = currentUser?.profile?.addresses || [];

    
    const [selectedUuid, setSelectedUuid] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    const handleDelete = async () => {
        if (!selectedUuid) return;
        setIsDeleting(true);
        try {
            await addressService.deleteAddress(selectedUuid);
            
            
            const updatedUser = await profileServices.getMe();
            setUser(updatedUser);

            setAlertConfig({ visible: true, type: 'success', title: 'Thành công', message: 'Đã xóa cơ sở làm việc.' });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể xóa cơ sở này.' });
        } finally {
            setIsDeleting(false);
            setSelectedUuid(null);
        }
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F3F4F6' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={isDeleting}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Cơ sở / Địa chỉ</Text>
                
                
                <TouchableOpacity onPress={() => navigation.navigate('CreateEditAddressScreen')} disabled={isDeleting}>
                    <Ionicons name="add-circle" size={28} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {addresses.length === 0 ? (
                    <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 40, fontStyle: 'italic' }}>
                        Chưa có địa chỉ nào được thiết lập.
                    </Text>
                ) : (
                    addresses.map((item) => (
                        <View key={item.uuid} style={styles.addressCard}>
                            <View style={{ flex: 1 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                    <Ionicons name="location" size={18} color="#10B981" />
                                    <Text style={styles.provinceText}>{item.province?.name}</Text>
                                </View>
                                <Text style={styles.detailText}>{item.full_address || 'Địa chỉ tự động'}</Text>
                                <Text style={styles.subText}>{item.ward?.name}, {item.district?.name}</Text>
                                {(item.latitude && item.longitude) && (
                                    <Text style={styles.coordText}>Tọa độ: {item.latitude}, {item.longitude}</Text>
                                )}
                            </View>
                            
                            
                            <View style={styles.actionColumn}>
                                <TouchableOpacity 
                                    style={styles.actionBtn} 
                                    onPress={() => navigation.navigate('CreateEditAddressScreen', { addressData: item })}
                                >
                                    <Ionicons name="create-outline" size={20} color="#3B82F6" />
                                </TouchableOpacity>
                                
                                <TouchableOpacity 
                                    style={styles.actionBtn} 
                                    onPress={() => setSelectedUuid(item.uuid)}
                                >
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
            </ScrollView>

            <AppConfirmModal 
                visible={!!selectedUuid} title="Xóa cơ sở" message="Bạn có chắc chắn muốn xóa địa chỉ này?"
                confirmText="Xóa bỏ" cancelText="Hủy" isDanger={true} 
                onCancel={() => setSelectedUuid(null)} onConfirm={handleDelete}
            />

            <AppAlertModal 
                visible={alertConfig.visible} type={alertConfig.type} 
                title={alertConfig.title} message={alertConfig.message} 
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))} 
            />
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    backBtn: { padding: 4 },
    addressCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 16, flexDirection: 'row', borderWidth: 1, borderColor: '#E5E7EB', elevation: 2 },
    provinceText: { fontSize: 15, fontWeight: 'bold', color: '#111111' },
    detailText: { fontSize: 14, color: '#374151', marginBottom: 4 },
    subText: { fontSize: 13, color: '#6B7280' },
    coordText: { fontSize: 12, color: '#9CA3AF', marginTop: 4, fontStyle: 'italic' },
    actionColumn: { justifyContent: 'space-between', paddingLeft: 12, borderLeftWidth: 1, borderLeftColor: '#F3F4F6' },
    actionBtn: { padding: 8 }
});