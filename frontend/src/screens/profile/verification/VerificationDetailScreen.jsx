import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { verificationService } from '../../../services/verificationService';
import { globalStyles } from '../../../constants/globalStyles';
import { AppConfirmModal } from '../../../components/AppConfirmModal';
import { AppAlertModal } from '../../../components/AppAlertModal';
import { AppButton } from '../../../components/AppButton';
import { formatDate } from '../../../utils/formatter';
import { styles } from './style';

export default function VerificationDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { requestUuid } = route.params;

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    
    
    const [isConfirmDeleteReq, setIsConfirmDeleteReq] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    const fetchDetail = async () => {
        try {
            const res = await verificationService.getRequestDetail(requestUuid);
            setDetail(res);
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể lấy chi tiết yêu cầu.' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchDetail(); }, []);

    const isPending = detail?.status === 'PENDING';

    const handleDeleteRequest = async () => {
        setIsConfirmDeleteReq(false);
        try {
            await verificationService.deleteRequest(requestUuid);
            setAlertConfig({
                visible: true, type: 'success', title: 'Thành công', message: 'Đã hủy yêu cầu xác thực.',
                onCloseOverride: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    navigation.goBack(); 
                }
            });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể hủy yêu cầu.' });
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết Yêu cầu</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.detailCard}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Trạng thái: <Text style={{ color: isPending ? '#D97706' : (detail?.status === 'ACCEPTED' ? '#059669' : '#DC2626') }}>{detail?.status}</Text></Text>
                    <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>Ngày tạo: {formatDate(detail?.created_date)}</Text>
                </View>

                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Hình ảnh đính kèm:</Text>
                    
                    
                    {isPending && (
                        <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 12, fontStyle: 'italic' }}>
                            * Yêu cầu đang được xử lý. Nếu cần thay đổi hình ảnh, vui lòng hủy yêu cầu hiện tại và tạo mới.
                        </Text>
                    )}

                    {detail?.images?.length === 0 ? (
                        <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Không có hình ảnh nào.</Text>
                    ) : (
                        <View style={styles.imageGrid}>
                            
                            {detail?.images?.map(img => (
                                <View key={img.uuid} style={styles.imageBox}>
                                    <Image source={{ uri: img.image }} style={styles.imgPreview} />
                                </View>
                            ))}
                        </View>
                    )}
                </View>

                
                {isPending && (
                    <AppButton 
                        title="Hủy Yêu Cầu" 
                        mode="outlined" 
                        isDanger={true} 
                        onPress={() => setIsConfirmDeleteReq(true)} 
                    />
                )}
            </ScrollView>
            
            <AppConfirmModal 
                visible={isConfirmDeleteReq} title="Hủy Yêu Cầu" message="Yêu cầu xác thực này sẽ bị hủy bỏ hoàn toàn. Bạn sẽ phải tạo lại yêu cầu mới nếu muốn xác thực."
                confirmText="Hủy Yêu Cầu" cancelText="Đóng" isDanger={true} onCancel={() => setIsConfirmDeleteReq(false)} onConfirm={handleDeleteRequest}
            />

            <AppAlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={() => { if (alertConfig.onCloseOverride) alertConfig.onCloseOverride(); else setAlertConfig(prev => ({ ...prev, visible: false })); }} />
        </View>
    );
}