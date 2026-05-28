import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { resumeServices } from '../../../services/resumeService';
import { useApi } from '../../../hooks/useApi';
import { globalStyles } from '../../../constants/globalStyles';
import { formatDate } from '../../../utils/formatter';

import { AppButton } from '../../../components/AppButton';
import { AppConfirmModal } from '../../../components/AppConfirmModal';
import { AppAlertModal } from '../../../components/AppAlertModal';

import { styles } from './style';

export default function ResumeDetailScreen() {
    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const { resumeUuid } = route.params || {};

    // --- 1. HOOK LẤY DATA (Giữ nguyên) ---
    const {
        data: resumeData,
        loading: detailLoading,
        error,
        execute: fetchResumeDetail
    } = useApi(resumeServices.getResumeDetail);

    // --- 2. STATE LOCAL CHO NÚT XÓA ---
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    // Tự động load / reload data
    useEffect(() => {
        if (resumeUuid) {
            fetchResumeDetail(resumeUuid);
        }
    }, [resumeUuid, isFocused]);

    // --- 3. HÀM GỌI API XÓA (Trị dứt điểm 204 No Content) ---
    const handleConfirmDelete = async () => {
        setIsConfirmVisible(false); // Đóng modal hỏi xác nhận
        setIsDeleting(true); // Bật loading cho nút Xóa

        try {
            // Gọi API thẳng qua service
            await resumeServices.deleteResume(resumeUuid);

            // Xóa thành công (dù data rỗng) thì bung ngay Popup báo cáo
            setAlertConfig({
                visible: true,
                type: 'success',
                title: 'Đã xóa!',
                message: 'Hồ sơ CV đã được xóa thành công khỏi hệ thống.',
                onCloseOverride: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    navigation.goBack(); // 🔥 Đóng popup xong là bay về danh sách ngay!
                }
            });
        } catch (err) {
            // Lỡ có lỗi mạng hoặc API sập
            setAlertConfig({
                visible: true,
                type: 'error',
                title: 'Xóa thất bại',
                message: 'Không thể xóa hồ sơ lúc này, vui lòng thử lại sau.'
            });
        } finally {
            setIsDeleting(false); // Tắt loading
        }
    };

    if (detailLoading && !resumeData) return <ActivityIndicator style={{ flex: 1, backgroundColor: '#F9FAFB' }} size="large" color="#3B82F6" />;

    if (error || !resumeData) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#EF4444' }}>{error || 'Không tìm thấy thông tin hồ sơ!'}</Text>
            <AppButton title="Quay lại" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </View>
    );

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F3F4F6' }]}>
            {/* HEADER */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={isDeleting}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>Chi tiết Hồ sơ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }}>
                {/* 1. KHỐI ẢNH CV */}
                {resumeData.resume_img ? (
                    <View style={styles.imageContainer}>
                        <Image
                            source={{ uri: resumeData.resume_img }}
                            style={styles.resumeImage}
                            resizeMode="contain"
                        />
                    </View>
                ) : (
                    <View style={[styles.imageContainer, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#E5E7EB' }]}>
                        <Ionicons name="document-text-outline" size={50} color="#9CA3AF" />
                        <Text style={{ color: '#6B7280', marginTop: 8 }}>Không có ảnh CV</Text>
                    </View>
                )}

                {/* 2. KHỐI THÔNG TIN CHÍNH */}
                <View style={styles.infoCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={styles.title}>{resumeData.title}</Text>

                        <View style={[
                            styles.badge,
                            resumeData.status === 'PUBLIC' ? { backgroundColor: '#DEF7EC' } : { backgroundColor: '#FDE8E8' }
                        ]}>
                            <Text style={[
                                styles.badgeText,
                                resumeData.status === 'PUBLIC' ? { color: '#03543F' } : { color: '#9B1C1C' }
                            ]}>
                                {resumeData.status === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                            </Text>
                        </View>
                    </View>
                    <Text style={styles.dateText}>Cập nhật lần cuối: {formatDate(resumeData.updated_date)}</Text>
                </View>

                {/* 3. KHỐI MÔ TẢ */}
                {resumeData.description && (
                    <View style={styles.infoCard}>
                        <Text style={styles.sectionTitle}>Giới thiệu bản thân</Text>
                        <Text style={styles.descriptionText}>{resumeData.description}</Text>
                    </View>
                )}

                {/* 4. KHỐI NGÀNH NGHỀ */}
                <View style={styles.infoCard}>
                    <Text style={styles.sectionTitle}>Lĩnh vực chuyên môn</Text>
                    <View style={styles.tagContainer}>
                        {resumeData.career_fields && resumeData.career_fields.length > 0 ? (
                            resumeData.career_fields.map((field) => (
                                <View key={field.id} style={styles.tag}>
                                    <Text style={styles.tagText}>{field.field_name}</Text>
                                </View>
                            ))
                        ) : (
                            <Text style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Chưa cập nhật lĩnh vực</Text>
                        )}
                    </View>
                </View>
            </ScrollView>

            {/* FOOTER - SỬA BUTTON XÓA MÀU ĐỎ */}
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                {resumeData.is_owner ? (
                    <View style={{ gap: 8 }}>
                        <AppButton
                            title="Chỉnh sửa Hồ sơ"
                            mode="contained"
                            onPress={() => navigation.navigate('CreateEditResumeScreen', { resumeUuid: resumeData.uuid })}
                            disabled={isDeleting}
                        />
                        {/* 🔥 Đã thêm textColor="#EF4444" để ép chữ nút thành đỏ */}
                        <AppButton
                            title={isDeleting ? "Đang xóa..." : "Xóa Hồ sơ"}
                            mode="contained" // ✅ Chuyển sang contained để có nền
                            isDanger={true}  // ✅ Bật chế độ Danger -> Tự động hóa Nền Đỏ, Chữ Trắng
                            onPress={() => setIsConfirmVisible(true)}
                            disabled={isDeleting}
                        />
                    </View>
                ) : (
                    <AppButton
                        title="Liên hệ Ứng viên"
                        mode="contained"
                    />
                )}
            </View>

            {/* MODAL 1: XÁC NHẬN */}
            <AppConfirmModal
                visible={isConfirmVisible}
                title="Xóa Hồ sơ CV"
                message="Bạn có chắc chắn muốn xóa hồ sơ này không? Toàn bộ dữ liệu của CV này sẽ bị mất và không thể khôi phục."
                confirmText="Xóa bỏ"
                cancelText="Hủy"
                isDanger={true}
                onCancel={() => setIsConfirmVisible(false)}
                onConfirm={handleConfirmDelete}
            />

            {/* MODAL 2: THÔNG BÁO XONG VIỆC LÀ BAY VỀ */}
            <AppAlertModal
                visible={alertConfig.visible}
                type={alertConfig.type}
                title={alertConfig.title}
                message={alertConfig.message}
                onClose={() => {
                    if (alertConfig.onCloseOverride) alertConfig.onCloseOverride();
                    else setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
            />
        </View>
    );
}