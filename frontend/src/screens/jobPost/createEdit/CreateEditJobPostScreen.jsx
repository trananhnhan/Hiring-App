import React, { useState, useEffect, useContext, useMemo } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { AuthContext } from '../../../context/AuthContext';
import { useGlobalData } from '../../../context/GlobalDataContext';
import { jobServices } from '../../../services/jobService';
import { useApi } from '../../../hooks/useApi';

import { globalStyles } from '../../../constants/globalStyles';
import { styles } from './style';

import { AppButton } from '../../../components/AppButton';
import { AppDropdown } from '../../../components/AppDropdown';
import { AppMultiSelect } from '../../../components/AppMultiSelect';
import { AppAlertModal } from '../../../components/AppAlertModal';
import { AppConfirmModal } from '../../../components/AppConfirmModal'; 

import { getSortedWorkDays, translateDay, formatTime } from '../../../utils/formatter';

export default function CreateEditJobPostScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    
    
    const { user: currentUser } = useContext(AuthContext);
    const { careerFields } = useGlobalData(); 
    
    const companyAddresses = currentUser?.profile?.addresses || [];
    const fallbackAddressUuid = companyAddresses.length > 0 ? companyAddresses[0].uuid : null;
    
    const formattedAddresses = companyAddresses.map(addr => ({
        label: `📍 ${addr.ward?.name}, ${addr.district?.name}, ${addr.province?.name}`,
        value: addr.uuid
    }));

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
   
    
    const { jobUuid } = route.params || {};
    const isEditMode = !!jobUuid;

    
    const { data: detailData, loading: detailLoading, execute: fetchDetail } = useApi(jobServices.getJobPostDetail);
    const { data: submitResult, loading: isSubmitting, error: submitError, execute: submitJobPost } = useApi(isEditMode ? jobServices.updateJobPost : jobServices.createJobPost);

    
    const [title, setTitle] = useState('');
    const [jobThumbnail, setJobThumbnail] = useState(null); 
    const [salaryMin, setSalaryMin] = useState('');
    const [salaryMax, setSalaryMax] = useState('');
    const [slot, setSlot] = useState('1');
    const [expiryDate, setExpiryDate] = useState(''); 
    const [status, setStatus] = useState('OPEN');
    const [description, setDescription] = useState('');
    
    const [careerFieldsId, setCareerFieldsId] = useState([]);
    const [workDays, setWorkDays] = useState([]);
    const [addressUuid, setAddressUuid] = useState(isEditMode ? null : fallbackAddressUuid);

    
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    
    useEffect(() => {
        if (isEditMode) fetchDetail(jobUuid);
    }, [isEditMode, jobUuid]);

    useEffect(() => {
        if (detailData) {
            setTitle(detailData.title || '');
            setJobThumbnail(detailData.job_thumbnail || null);
            setSalaryMin(detailData.salary_min?.toString() || '');
            setSalaryMax(detailData.salary_max?.toString() || '');
            setSlot(detailData.slot?.toString() || '1');
            
            const rawExpiry = detailData.expiry_date || '';
            setExpiryDate(rawExpiry.includes('T') ? rawExpiry.split('T')[0] : rawExpiry);
            
            setStatus(detailData.status || 'OPEN');
            setDescription(detailData.description || '');
            
            setCareerFieldsId(detailData.career_fields?.map(f => f.id) || []);
            setWorkDays(detailData.work_days?.map(d => ({
                day_of_week: d.day_of_week,
                work_start: d.work_start,
                work_end: d.work_end,
                break_start: d.break_start,
                break_end: d.break_end
            })) || []);

            const currentAddressUuid = detailData.address?.uuid || detailData.address_uuid;
            setAddressUuid(currentAddressUuid || fallbackAddressUuid);
        }
    }, [detailData]);

    useEffect(() => {
        if (submitResult) {
            setModalConfig({
                visible: true, type: 'success', title: 'Thành công!',
                message: isEditMode ? 'Cập nhật bài đăng thành công.' : 'Tạo bài đăng thành công.',
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
        if (permissionResult.granted === false) {
            setModalConfig({ visible: true, type: 'error', title: 'Cấp quyền', message: 'Bạn cần cấp quyền truy cập thư viện ảnh!' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], allowsEditing: true, aspect: [16, 9], quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setJobThumbnail({
                uri: asset.uri,
                fileName: asset.fileName || `job_thumbnail_${Date.now()}.jpg`,
                mimeType: asset.mimeType || 'image/jpeg'
            });
        }
    };

    
    const [workDayModalVisible, setWorkDayModalVisible] = useState(false);
    const [tempWorkDay, setTempWorkDay] = useState({ 
        day_of_week: 'MON', work_start: '08:00:00', work_end: '17:00:00', break_start: '12:00:00', break_end: '13:00:00' 
    });

    const openAddWorkDay = () => {
        setTempWorkDay({ day_of_week: 'MON', work_start: '08:00:00', work_end: '17:00:00', break_start: '12:00:00', break_end: '13:00:00' });
        setWorkDayModalVisible(true);
    };

    const handleSaveTempWorkDay = () => {
        const isExist = workDays.some(d => d.day_of_week === tempWorkDay.day_of_week);
        if (isExist) {
            setWorkDays(prev => [...prev.filter(d => d.day_of_week !== tempWorkDay.day_of_week), tempWorkDay]);
        } else {
            setWorkDays(prev => [...prev, tempWorkDay]);
        }
        setWorkDayModalVisible(false);
    };

    const handleRemoveWorkDay = (dayOfWeekToRemove) => {
        setWorkDays(prev => prev.filter(day => day.day_of_week !== dayOfWeekToRemove));
    };

    const dayOptions = [
        { label: 'Thứ 2', value: 'MON' }, { label: 'Thứ 3', value: 'TUE' }, { label: 'Thứ 4', value: 'WED' },
        { label: 'Thứ 5', value: 'THU' }, { label: 'Thứ 6', value: 'FRI' }, { label: 'Thứ 7', value: 'SAT' },
        { label: 'Chủ nhật', value: 'SUN' }
    ];

    
    const handleSave = () => {
        if (!title.trim() || !description.trim() || !addressUuid || careerFieldsId.length === 0) {
            setModalConfig({ 
                visible: true, type: 'error', title: 'Cảnh báo', 
                message: 'Vui lòng điền các trường bắt buộc, chọn địa chỉ và ít nhất 1 ngành nghề.' 
            });
            return;
        }

        let formattedExpiry = expiryDate;
        if (expiryDate && !expiryDate.includes('T')) {
            formattedExpiry = `${expiryDate}T23:59:59Z`;
        }

        const payload = {
            title, description, status, expiry_date: formattedExpiry, job_thumbnail: jobThumbnail,
            salary_min: salaryMin ? Number(salaryMin) : null,
            salary_max: salaryMax ? Number(salaryMax) : null,
            slot: Number(slot) || 1, address_uuid: addressUuid, career_fields_id: careerFieldsId, work_days: workDays
        };

        if (isEditMode) submitJobPost(jobUuid, payload);
        else submitJobPost(payload);
    };

    
    const handleConfirmDelete = async () => {
        setIsConfirmVisible(false); 
        setIsDeleting(true); 
        
        try {
            await jobServices.deleteJobPost(jobUuid);
            
            setModalConfig({
                visible: true, 
                type: 'success', 
                title: 'Đã xóa!',
                message: 'Bài đăng tuyển dụng đã được xóa thành công khỏi hệ thống.',
                onCloseOverride: () => {
                    setModalConfig(prev => ({ ...prev, visible: false }));
                    
                    navigation.pop(2); 
                }
            });
        } catch (err) {
            setModalConfig({
                visible: true, 
                type: 'error', 
                title: 'Xóa thất bại',
                message: 'Không thể xóa bài đăng lúc này.'
            });
        } finally {
            setIsDeleting(false); 
        }
    };

    if (detailLoading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#111111" />;

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isDeleting}>
                    <Ionicons name="close" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{isEditMode ? 'Chỉnh sửa bài đăng' : 'Tạo bài tuyển dụng'}</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
                
                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Ảnh đại diện bài đăng</Text>
                    <TouchableOpacity 
                        style={{ height: 160, backgroundColor: '#E5E7EB', borderRadius: 8, justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed' }}
                        onPress={handlePickImage}
                    >
                        {jobThumbnail ? (
                            <Image source={{ uri: typeof jobThumbnail === 'string' ? jobThumbnail : jobThumbnail.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        ) : (
                            <>
                                <Ionicons name="image-outline" size={40} color="#9CA3AF" />
                                <Text style={{ color: '#6B7280', marginTop: 8 }}>Bấm để chọn ảnh từ điện thoại</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                
                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Tiêu đề công việc <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput style={styles.input} placeholder="Ví dụ: Lập trình viên Backend..." value={title} onChangeText={setTitle} />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Ngành nghề (Lĩnh vực) <Text style={{ color: 'red' }}>*</Text></Text>
                    <AppMultiSelect
                        data={formattedCareerFields} value={careerFieldsId} onChange={(item) => setCareerFieldsId(item)}
                        labelField="label" valueField="value" placeholder="Chọn một hoặc nhiều ngành nghề"
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Địa điểm làm việc <Text style={{ color: 'red' }}>*</Text></Text>
                    <AppDropdown
                        data={formattedAddresses} value={addressUuid} onChange={(item) => setAddressUuid(item.value)}
                        labelField="label" valueField="value" placeholder="Chọn địa điểm văn phòng"
                    />
                </View>

                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Lương tối thiểu</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="3000000" value={salaryMin} onChangeText={setSalaryMin} />
                    </View>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Lương tối đa</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="5000000" value={salaryMax} onChangeText={setSalaryMax} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[styles.formGroup, { flex: 1 }]}>
                        <Text style={styles.inputLabel}>Số lượng (Slot)</Text>
                        <TextInput style={styles.input} keyboardType="numeric" placeholder="3" value={slot} onChangeText={setSlot} />
                    </View>
                    {isEditMode && (
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.inputLabel}>Trạng thái</Text>
                            <AppDropdown
                                data={[{ label: '🟢 Mở', value: 'OPEN' }, { label: '🔴 Đóng', value: 'CLOSED' }]}
                                value={status} labelField="label" valueField="value" onChange={(item) => setStatus(item.value)}
                            />
                        </View>
                    )}
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Hạn chót nộp hồ sơ</Text>
                    <TextInput 
                        style={styles.input} 
                        placeholder="YYYY-MM-DD (VD: 2026-12-31)" 
                        value={expiryDate} onChangeText={setExpiryDate} 
                    />
                </View>

                <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Mô tả chi tiết <Text style={{ color: 'red' }}>*</Text></Text>
                    <TextInput style={styles.textArea} multiline numberOfLines={6} placeholder="Nhập yêu cầu, quyền lợi..." value={description} onChangeText={setDescription} textAlignVertical="top" />
                </View>

                
                <View style={styles.formGroup}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                        <Text style={styles.inputLabel}>Lịch làm việc</Text>
                        <TouchableOpacity onPress={openAddWorkDay} style={{ backgroundColor: '#DBEAFE', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
                            <Text style={{ color: '#3B82F6', fontWeight: 'bold', fontSize: 12 }}>+ Thêm lịch</Text>
                        </TouchableOpacity>
                    </View>
                    
                    {workDays.length === 0 ? (
                        <Text style={{ color: '#9CA3AF', fontStyle: 'italic', textAlign: 'center', padding: 10 }}>Chưa có lịch làm việc nào được cấu hình.</Text>
                    ) : (
                        getSortedWorkDays(workDays).map((day, idx) => (
                            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12, backgroundColor: '#FFFFFF', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#E5E7EB' }}>
                                <View>
                                    <Text style={{ fontWeight: 'bold', color: '#111', marginBottom: 4 }}>
                                        {translateDay(day.day_of_week)}
                                    </Text>
                                    <Text style={{ fontSize: 13, color: '#4B5563' }}>Ca làm: {formatTime(day.work_start)} - {formatTime(day.work_end)}</Text>
                                    {day.break_start && (
                                        <Text style={{ fontSize: 12, color: '#9CA3AF' }}>Nghỉ trưa: {formatTime(day.break_start)} - {formatTime(day.break_end)}</Text>
                                    )}
                                </View>
                                <TouchableOpacity onPress={() => handleRemoveWorkDay(day.day_of_week)} style={{ padding: 8 }}>
                                    <Ionicons name="trash-outline" size={20} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>

            
            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>
                <View style={{ gap: 8 }}>
                    <AppButton
                        title={isSubmitting ? "Đang xử lý..." : (isEditMode ? "Cập Nhật Bài Đăng" : "Đăng Tin Tuyển Dụng")}
                        mode="contained" 
                        onPress={handleSave} 
                        disabled={isSubmitting || detailLoading || isDeleting}
                    />
                    
                    
                    {isEditMode && (
                        <AppButton 
                            title={isDeleting ? "Đang xóa..." : "Xóa Bài Đăng"} 
                            mode="contained" 
                            isDanger={true} 
                            onPress={() => setIsConfirmVisible(true)}
                            disabled={isSubmitting || detailLoading || isDeleting}
                        />
                    )}
                </View>
            </View>

            
            <Modal visible={workDayModalVisible} transparent={true} animationType="fade">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
                    <View style={{ width: '100%', backgroundColor: '#FFF', borderRadius: 12, padding: 20 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>Thêm / Sửa Lịch Làm Việc</Text>
                        
                        <Text style={styles.inputLabel}>Ngày trong tuần</Text>
                        <View style={{ marginBottom: 12 }}>
                            <AppDropdown
                                data={dayOptions} value={tempWorkDay.day_of_week}
                                labelField="label" valueField="value" search={false}
                                onChange={(item) => setTempWorkDay({...tempWorkDay, day_of_week: item.value})}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Giờ bắt đầu</Text>
                                <TextInput style={styles.input} placeholder="08:00:00" value={tempWorkDay.work_start} onChangeText={t => setTempWorkDay({...tempWorkDay, work_start: t})} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Giờ kết thúc</Text>
                                <TextInput style={styles.input} placeholder="17:00:00" value={tempWorkDay.work_end} onChangeText={t => setTempWorkDay({...tempWorkDay, work_end: t})} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Bắt đầu nghỉ</Text>
                                <TextInput style={styles.input} placeholder="12:00:00" value={tempWorkDay.break_start} onChangeText={t => setTempWorkDay({...tempWorkDay, break_start: t})} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.inputLabel}>Kết thúc nghỉ</Text>
                                <TextInput style={styles.input} placeholder="13:00:00" value={tempWorkDay.break_end} onChangeText={t => setTempWorkDay({...tempWorkDay, break_end: t})} />
                            </View>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 12 }}>
                            <AppButton title="Hủy" mode="outlined" style={{ flex: 1 }} onPress={() => setWorkDayModalVisible(false)} />
                            <AppButton title="Lưu" mode="contained" style={{ flex: 1 }} onPress={handleSaveTempWorkDay} />
                        </View>
                    </View>
                </View>
            </Modal>

            
            <AppConfirmModal 
                visible={isConfirmVisible}
                title="Xóa Bài Đăng"
                message="Bạn có chắc chắn muốn xóa bài đăng tuyển dụng này không? Dữ liệu không thể khôi phục."
                confirmText="Xóa bỏ"
                cancelText="Hủy"
                isDanger={true} 
                onCancel={() => setIsConfirmVisible(false)}
                onConfirm={handleConfirmDelete}
            />

            
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