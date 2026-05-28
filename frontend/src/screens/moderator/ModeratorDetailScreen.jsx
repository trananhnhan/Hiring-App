import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { verificationService } from '../../services/verificationService';
import { globalStyles } from '../../constants/globalStyles';
import { formatDate } from '../../utils/formatter';
import { AppButton } from '../../components/AppButton';
import { AppAlertModal } from '../../components/AppAlertModal';
import { AppConfirmModal } from '../../components/AppConfirmModal';

export default function ModeratorDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { requestUuid } = route.params;

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isVerifying, setIsVerifying] = useState(false);
    
    // Modal state
    const [confirmAction, setConfirmAction] = useState(null); // 'ACCEPTED' hoặc 'REJECTED'
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    useEffect(() => {
        verificationService.getRequestDetail(requestUuid)
            .then(res => setDetail(res))
            .catch(() => setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể tải chi tiết.' }))
            .finally(() => setLoading(false));
    }, []);

    const handleVerify = async () => {
        setIsVerifying(true);
        try {
            await verificationService.verifyRequest(requestUuid, confirmAction);
            setAlertConfig({
                visible: true, type: 'success', title: 'Hoàn tất', 
                message: confirmAction === 'ACCEPTED' ? 'Đã DUYỆT yêu cầu.' : 'Đã TỪ CHỐI yêu cầu.',
                onCloseOverride: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    navigation.goBack();
                }
            });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Đã xảy ra lỗi khi duyệt.' });
        } finally {
            setIsVerifying(false);
            setConfirmAction(null);
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B82F6" />;
    
    const isPending = detail?.status === 'PENDING';

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            {/* HEADER */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={isVerifying}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Kiểm duyệt Hồ sơ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
                {/* THÔNG TIN CHUNG */}
                <View style={styles.card}>
                    <Text style={{ fontSize: 15, color: '#374151' }}>
                        Trạng thái: <Text style={{ fontWeight: 'bold', color: isPending ? '#D97706' : (detail?.status === 'ACCEPTED' ? '#059669' : '#DC2626') }}>{detail?.status}</Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 8 }}>Ngày nộp: {formatDate(detail?.created_date)}</Text>
                </View>

                {/* DANH SÁCH ẢNH CHỨNG TỪ (HIỂN THỊ TO) */}
                <View style={styles.card}>
                    <Text style={{ fontSize: 15, fontWeight: 'bold', marginBottom: 16, color: '#111' }}>
                        Ảnh chứng từ ({detail?.images?.length || 0}):
                    </Text>
                    
                    <View style={styles.imageGrid}>
                        {detail?.images?.map((img, index) => (
                            <View key={img.uuid} style={styles.imageBox}>
                                {/* Đánh số thứ tự ảnh */}
                                <View style={styles.imageBadge}>
                                    <Text style={styles.imageBadgeText}>{index + 1}/{detail?.images?.length}</Text>
                                </View>
                                
                                {/* Đổi resizeMode="contain" để ảnh không bị cắt mất chữ */}
                                <Image source={{ uri: img.image }} style={styles.imgPreview} resizeMode="contain" />
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* HAI NÚT HÀNH ĐỘNG: CHỈ HIỆN KHI ĐANG PENDING */}
            {isPending && (
                <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                    <AppButton 
                        title="TỪ CHỐI" 
                        mode="outlined" 
                        isDanger={true} 
                        style={{ flex: 1 }} 
                        onPress={() => setConfirmAction('REJECTED')} 
                        disabled={isVerifying}
                    />
                    <AppButton 
                        title="DUYỆT (ACCEPT)" 
                        mode="contained" 
                        style={{ flex: 1, backgroundColor: '#10B981' }} 
                        onPress={() => setConfirmAction('ACCEPTED')} 
                        disabled={isVerifying}
                    />
                </View>
            )}

            {/* MODAL XÁC NHẬN */}
            <AppConfirmModal 
                visible={!!confirmAction} 
                title={confirmAction === 'ACCEPTED' ? 'Xác nhận DUYỆT' : 'Xác nhận TỪ CHỐI'} 
                message={confirmAction === 'ACCEPTED' ? 'Bạn có chắc muốn cấp tích xanh cho đơn vị này?' : 'Hồ sơ này sẽ bị từ chối và ứng viên phải nộp lại.'}
                confirmText={confirmAction === 'ACCEPTED' ? 'Duyệt' : 'Từ chối'} 
                cancelText="Hủy" 
                isDanger={confirmAction === 'REJECTED'} 
                onCancel={() => setConfirmAction(null)} 
                onConfirm={handleVerify}
            />

            <AppAlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={() => { if (alertConfig.onCloseOverride) alertConfig.onCloseOverride(); else setAlertConfig(prev => ({ ...prev, visible: false })); }} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    backBtn: { padding: 4 },
    card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
    
    // ĐÃ SỬA LẠI CSS ĐỂ HIỂN THỊ DỌC VÀ TO
    imageGrid: { flexDirection: 'column', gap: 20 }, 
    imageBox: { 
        width: '100%', 
        height: 380, // Tăng chiều cao lên để soi cho sướng
        borderRadius: 8, 
        backgroundColor: '#1F2937', // Nền tối làm nổi bật giấy tờ màu trắng
        position: 'relative',
        overflow: 'hidden'
    },
    imgPreview: { 
        width: '100%', 
        height: '100%' 
    },
    imageBadge: { 
        position: 'absolute', 
        top: 12, 
        right: 12, 
        backgroundColor: 'rgba(0,0,0,0.7)', 
        paddingHorizontal: 12, 
        paddingVertical: 6, 
        borderRadius: 20,
        zIndex: 10 
    },
    imageBadgeText: { 
        color: '#FFFFFF', 
        fontSize: 12, 
        fontWeight: 'bold' 
    },
    
    footer: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: '#E5E7EB' }
});