import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { profileServices } from '../../../services/profileService';
import { jobApplicationServices } from '../../../services/jobApplicationService';

import { globalStyles } from '../../../constants/globalStyles';
import { styles } from './style';

import { AppDropdown } from '../../../components/AppDropdown';
import { AppButton } from '../../../components/AppButton';
import { AppAlertModal } from '../../../components/AppAlertModal';
import { AuthContext } from '../../../context/AuthContext';

export default function ApplyJobScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { user: currentUser } = useContext(AuthContext);

    
    const { jobUuid, jobTitle, companyName, application } = route.params || {};
    const isEditMode = !!application; 

    
    const [resumes, setResumes] = useState([]);
    const [selectedResumeId, setSelectedResumeId] = useState(null);
    const [resumePage, setResumePage] = useState(1);
    const [hasMoreResumes, setHasMoreResumes] = useState(true);
    const [loadingResumes, setLoadingResumes] = useState(true);
    const [loadingMoreResumes, setLoadingMoreResumes] = useState(false);

    
    const [message, setMessage] = useState(isEditMode ? application.message : '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalConfig, setModalConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    const fetchResumes = async (pageToLoad, isRefresh = false) => {
        if (!currentUser?.username) return;

        if (pageToLoad === 1) setLoadingResumes(true);
        else setLoadingMoreResumes(true);

        try {
            const data = await profileServices.getPublicCandidateResumes(currentUser.username, pageToLoad);
            const resumeList = data?.results || [];

            const formattedResumes = resumeList.map(item => ({
                label: `📄 ${item.title}`,
                value: item.uuid || item.id
            }));

            setResumes(prev => isRefresh ? formattedResumes : [...prev, ...formattedResumes]);
            setHasMoreResumes(data?.next !== null);

            
            if (isRefresh && formattedResumes.length > 0) {
                
                if (isEditMode && application?.resume?.uuid) {
                    setSelectedResumeId(application.resume.uuid);
                } else {
                    setSelectedResumeId(formattedResumes[0].value);
                }
            }
        } catch (error) {
            console.log("Lỗi tải CV public phân trang:", error);
            if (error.response?.status === 404) setHasMoreResumes(false);
        } finally {
            setLoadingResumes(false);
            setLoadingMoreResumes(false);
        }
    };

    useEffect(() => {
        fetchResumes(1, true);
    }, []);

    const handleLoadMoreResumes = () => {
        if (!loadingResumes && !loadingMoreResumes && hasMoreResumes) {
            const nextPage = resumePage + 1;
            setResumePage(nextPage);
            fetchResumes(nextPage, false);
        }
    };

    const handleSubmit = async () => {
        if (!selectedResumeId) {
            setModalConfig({
                visible: true, type: 'error', title: 'Lỗi', message: 'Vui lòng chọn một CV.'
            });
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode) {
                const updatePayload = {
                    resume: selectedResumeId,
                    message: message
                };
  
                await jobApplicationServices.updateApplication(application.uuid, updatePayload);
            } else {
                
                await jobApplicationServices.applyForJob(jobUuid, selectedResumeId, message);
            }

            setModalConfig({
                visible: true,
                type: 'success',
                title: isEditMode ? 'Cập nhật thành công!' : 'Nộp đơn thành công!',
                message: isEditMode ? 'Đơn ứng tuyển đã được chỉnh sửa.' : 'CV đã được gửi tới nhà tuyển dụng.',
                onCloseOverride: () => {
                    setModalConfig(prev => ({ ...prev, visible: false }));
                    
                    navigation.goBack();
                }
            });
        } catch (error) {
            console.log(error.response.data);
            setModalConfig({
                visible: true,
                type: 'error',
                title: 'Có lỗi xảy ra',
                message: error.response?.data?.detail || 'Thao tác thất bại. Vui lòng thử lại.'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    
    const displayJobTitle = isEditMode ? application?.job_post?.title : jobTitle;
    const displayCompanyName = isEditMode ? application?.employer?.company_name : companyName;

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>

            
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="close" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Chỉnh sửa đơn ứng tuyển' : 'Nộp đơn ứng tuyển'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">

                
                <View style={styles.infoCard}>
                    <Text style={styles.sectionLabel}>Vị trí ứng tuyển:</Text>
                    <Text style={styles.jobTitle}>{displayJobTitle || 'Vị trí ẩn danh'}</Text>
                    <View style={styles.companyRow}>
                        <Ionicons name="business" size={16} color="#6B7280" />
                        <Text style={styles.companyName}>{displayCompanyName || 'Công ty ẩn danh'}</Text>
                    </View>
                </View>

                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Chọn Hồ sơ (CV) của bạn <Text style={{ color: 'red' }}>*</Text></Text>
                    {loadingResumes ? (
                        <ActivityIndicator size="small" color="#111111" style={{ alignSelf: 'flex-start', marginVertical: 10 }} />
                    ) : (
                        <AppDropdown
                            data={resumes}
                            value={selectedResumeId}
                            labelField="label"
                            valueField="value"
                            placeholder="Chọn CV để nộp"
                            onChange={(item) => setSelectedResumeId(item.value)}
                            flatListProps={{
                                onEndReached: handleLoadMoreResumes,
                                onEndReachedThreshold: 0.2,
                                ListFooterComponent: loadingMoreResumes ? (
                                    <ActivityIndicator size="small" color="#111111" style={{ marginVertical: 10 }} />
                                ) : null
                            }}
                        />
                    )}
                </View>

                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Lời chào / Thư ngỏ (Tùy chọn)</Text>
                    <TextInput
                        style={styles.textArea}
                        multiline
                        numberOfLines={5}
                        placeholder="Nhập tin nhắn gửi tới nhà tuyển dụng..."
                        placeholderTextColor="#9CA3AF"
                        value={message}
                        onChangeText={setMessage}
                        textAlignVertical="top"
                    />
                </View>

            </ScrollView>

            
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                <AppButton
                    title={isSubmitting ? "Đang xử lý..." : (isEditMode ? "Cập Nhật Đơn" : "Gửi Đơn Ứng Tuyển")}
                    mode="contained"
                    onPress={handleSubmit}
                    disabled={isSubmitting || resumes.length === 0}
                />
            </View>

            <AppAlertModal
                visible={modalConfig.visible}
                type={modalConfig.type}
                title={modalConfig.title}
                message={modalConfig.message}
                onClose={() => {
                    if (modalConfig.onCloseOverride) {
                        modalConfig.onCloseOverride();
                    } else {
                        setModalConfig(prev => ({ ...prev, visible: false }));
                    }
                }}
            />

        </View>
    );
}