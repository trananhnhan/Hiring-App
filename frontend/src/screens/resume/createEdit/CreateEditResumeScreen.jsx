import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../../../context/AuthContext';
import { useGlobalData } from '../../../context/GlobalDataContext';
import { resumeServices } from '../../../services/resumeService';
import { useApi } from '../../../hooks/useApi';

import { globalStyles } from '../../../constants/globalStyles';

import { styles } from './style';

import { AppButton } from '../../../components/AppButton';
import { AppDropdown } from '../../../components/AppDropdown';
import { AppMultiSelect } from '../../../components/AppMultiSelect';
import { AppAlertModal } from '../../../components/AppAlertModal';

export default function CreateEditResumeScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    
    
    const { careerFields } = useGlobalData(); 
    
    const formattedCareerFields = useMemo(() => {
        let options = [];
        (careerFields || []).forEach(parent => {
            options.push({ label: `📁 ${parent.field_name}`, value: parent.id });
            if (parent.children && parent.children.length > 0) {
                parent.children.forEach(child => {
                    options.push({ label: `   ↳ ${child.field_name}`, value: child.id });
                });
            }
        });
        return options;
    }, [careerFields]);

    
    const { resumeUuid } = route.params || {};
    const isEditMode = !!resumeUuid;

    
    const { data: detailData, loading: detailLoading, execute: fetchDetail } = useApi(resumeServices.getResumeDetail);
    const { data: submitResult, loading: isSubmitting, error: submitError, execute: submitResume } = useApi(isEditMode ? resumeServices.updateResume : resumeServices.createResume);

    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('PUBLIC');
    const [careerFieldsId, setCareerFieldsId] = useState([]);
    const [resumeImg, setResumeImg] = useState(null); 

    const [modalConfig, setModalConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    
    useEffect(() => {
        if (isEditMode) fetchDetail(resumeUuid);
    }, [isEditMode, resumeUuid]);

    useEffect(() => {
        if (detailData) {
            setTitle(detailData.title || '');
            setDescription(detailData.description || '');
            setStatus(detailData.status || 'PUBLIC');
            setResumeImg(detailData.resume_img || null);
            setCareerFieldsId(detailData.career_fields?.map(f => f.id) || []);
        }
    }, [detailData]);

    
    useEffect(() => {
        if (submitResult) {
            setModalConfig({
                visible: true, type: 'success', title: 'Thành công!',
                message: isEditMode ? 'Cập nhật CV thành công.' : 'Tạo mới CV thành công.',
                onCloseOverride: () => {
                    setModalConfig(prev => ({ ...prev, visible: false }));
                    navigation.goBack();
                }
            });
        }
    }, [submitResult]);

    useEffect(() => {
        if (submitError) {
            setModalConfig({
                visible: true, type: 'error', title: 'Lỗi',
                message: typeof submitError === 'object' ? JSON.stringify(submitError) : submitError
            });
        }
    }, [submitError]);

    
    const handlePickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permissionResult.granted) {
            setModalConfig({ visible: true, type: 'error', title: 'Cấp quyền', message: 'Bạn cần cấp quyền truy cập thư viện ảnh!' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [3, 4], 
            quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setResumeImg({
                uri: asset.uri,
                fileName: asset.fileName || `resume_${Date.now()}.jpg`,
                mimeType: asset.mimeType || 'image/jpeg'
            });
        }
    };

    
    const handleSave = () => {
        if (!title.trim() || careerFieldsId.length === 0) {
            setModalConfig({ 
                visible: true, type: 'error', title: 'Cảnh báo', 
                message: 'Vui lòng nhập tên CV và chọn ít nhất 1 ngành nghề.' 
            });
            return;
        }

        const payload = {
            title, 
            description, 
            status, 
            career_fields_id: careerFieldsId, 
            resume_img: resumeImg
        };

        if (isEditMode) submitResume(resumeUuid, payload);
        else submitResume(payload);
    };

    if (detailLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B82F6" />;

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="close" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Chỉnh sửa Hồ sơ CV' : 'Tạo Hồ sơ mới'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                
                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Ảnh bản mềm CV (Tùy chọn)</Text>
                    <TouchableOpacity 
                        style={{ height: 350, backgroundColor: '#E5E7EB', borderRadius: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed' }}
                        onPress={handlePickImage}
                    >
                        {resumeImg ? (
                            <Image source={{ uri: typeof resumeImg === 'string' ? resumeImg : resumeImg.uri }} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                        ) : (
                            <>
                                <Ionicons name="document-attach-outline" size={40} color="#9CA3AF" />
                                <Text style={{ color: '#6B7280', marginTop: 8 }}>Bấm để tải ảnh CV lên</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Tên hồ sơ (Tiêu đề) <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="VD: CV Lập trình viên Frontend" value={title} onChangeText={setTitle} />
                </View>

                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Lĩnh vực chuyên môn <Text style={{ color: 'red' }}>*</Text></Text>
                    <AppMultiSelect
                        data={formattedCareerFields} value={careerFieldsId} onChange={(item) => setCareerFieldsId(item)}
                        labelField="label" valueField="value" placeholder="Chọn một hoặc nhiều lĩnh vực"
                    />
                </View>

                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Trạng thái hiển thị</Text>
                    <AppDropdown
                        data={[
                            { label: '🌍 Công khai (Mọi người có thể tìm thấy)', value: 'PUBLIC' }, 
                            { label: '🔒 Riêng tư (Chỉ dùng để nộp hồ sơ)', value: 'PRIVATE' },
                            { label: '📝 Bản nháp (Đang soạn thảo)', value: 'DRAFT' }
                        ]}
                        value={status} labelField="label" valueField="value" onChange={(item) => setStatus(item.value)}
                    />
                </View>

                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Giới thiệu bản thân</Text>
                    <TextInput style={styles.textArea} multiline numberOfLines={5} placeholder="Chia sẻ ngắn gọn về mục tiêu nghề nghiệp, kỹ năng nổi bật..." value={description} onChangeText={setDescription} textAlignVertical="top" />
                </View>
                
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                <AppButton
                    title={isSubmitting ? "Đang xử lý..." : (isEditMode ? "Lưu thay đổi CV" : "Tạo CV mới")}
                    mode="contained" onPress={handleSave} disabled={isSubmitting || detailLoading}
                />
            </View>

            
            <AppAlertModal 
                visible={modalConfig.visible} type={modalConfig.type} title={modalConfig.title} message={modalConfig.message} 
                onClose={() => {
                    if (modalConfig.onCloseOverride) modalConfig.onCloseOverride();
                    else setModalConfig(prev => ({ ...prev, visible: false }));
                }} 
            />
        </View>
    );
}