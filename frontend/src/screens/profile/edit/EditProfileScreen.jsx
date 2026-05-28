import React, { useState, useContext, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

// ✅ Đường dẫn import đã được đẩy lên 3 bậc (../../../) vì file nằm ở screens/profile/edit/
import { AuthContext } from '../../../context/AuthContext';
import { profileServices } from '../../../services/profileService'; 
import { globalStyles } from '../../../constants/globalStyles';
import { COLORS } from '../../../constants/theme';

import { AppButton } from '../../../components/AppButton';
import { AppAlertModal } from '../../../components/AppAlertModal';

// File style nằm cùng cấp
import { styles } from './style'; 

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    // 1. LẤY DỮ LIỆU TỪ CONTEXT
    const { user: currentUser, setUser } = useContext(AuthContext);
    const isEmployer = currentUser?.role === 'EMPLOYER';

    // 2. STATES SECTION 1: USER ACCOUNT
    const [firstName, setFirstName] = useState(currentUser?.first_name || '');
    const [lastName, setLastName] = useState(currentUser?.last_name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [avatar, setAvatar] = useState(null); 

    // Tách First/Last name nếu Backend đang gộp chung vào "name"
    useEffect(() => {
        if (!firstName && !lastName && currentUser?.name) {
            const parts = currentUser.name.split(' ');
            setLastName(parts[0]); 
            setFirstName(parts.slice(1).join(' ')); 
        }
    }, [currentUser]);

    // 3. STATES SECTION 2: PROFILE
    // Employer
    const [companyName, setCompanyName] = useState(currentUser?.profile?.company_name || '');
    const [taxCode, setTaxCode] = useState(currentUser?.profile?.tax_code || '');
    const [companyDesc, setCompanyDesc] = useState(currentUser?.profile?.company_description || '');
    
    // Candidate
    const [phone, setPhone] = useState(currentUser?.profile?.phone || '');
    const [dob, setDob] = useState(currentUser?.profile?.date_of_birth || '');
    const [bio, setBio] = useState(currentUser?.profile?.bio || '');

    // 4. STATUS STATES
    const [isUpdatingUser, setIsUpdatingUser] = useState(false);
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    // HÀM CHỌN ẢNH AVATAR
    const handlePickAvatar = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            setAlertConfig({ visible: true, type: 'error', title: 'Cấp quyền', message: 'Bạn cần cấp quyền truy cập thư viện ảnh!' });
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8,
        });

        if (!result.canceled) {
            const asset = result.assets[0];
            setAvatar({
                uri: asset.uri,
                fileName: asset.fileName || `avatar_${Date.now()}.jpg`,
                mimeType: asset.mimeType || 'image/jpeg'
            });
        }
    };

    // HÀM LÀM MỚI CONTEXT TỪ BACKEND
    const refreshContext = async () => {
        try {
            // ✅ Gọi hàm getMe từ profileServices
            const updatedUserData = await profileServices.getMe();
            setUser(updatedUserData);
        } catch (error) {
            console.log("Lỗi làm mới User Context:", error);
        }
    };

    // HÀM SAVE: TÀI KHOẢN (USER)
    const handleSaveUser = async () => {
        setIsUpdatingUser(true);
        try {
            const formData = new FormData();
            formData.append('first_name', firstName);
            formData.append('last_name', lastName);
            formData.append('email', email);
            
            if (avatar) {
                formData.append('avatar', {
                    uri: avatar.uri,
                    name: avatar.fileName,
                    type: avatar.mimeType
                });
            }

            // ✅ Gọi hàm updateUser
            await profileServices.updateUser(formData);
            await refreshContext();
            
            setAlertConfig({ visible: true, type: 'success', title: 'Thành công', message: 'Thông tin tài khoản đã được cập nhật!' });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Cập nhật tài khoản thất bại.' });
        } finally {
            setIsUpdatingUser(false);
        }
    };

    // HÀM SAVE: HỒ SƠ (PROFILE)
    const handleSaveProfile = async () => {
        setIsUpdatingProfile(true);
        try {
            if (isEmployer) {
                // ✅ Gọi updateEmployerProfile
                await profileServices.updateEmployerProfile({
                    company_name: companyName,
                    tax_code: taxCode,
                    company_description: companyDesc
                });
            } else {
                // ✅ Gọi updateCandidateProfile
                await profileServices.updateCandidateProfile({
                    phone: phone,
                    date_of_birth: dob,
                    bio: bio
                });
            }

            await refreshContext();
            setAlertConfig({ visible: true, type: 'success', title: 'Thành công', message: 'Hồ sơ người dùng đã được cập nhật!' });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Cập nhật hồ sơ thất bại.' });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F3F4F6' }]}>
            {/* HEADER */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={isUpdatingUser || isUpdatingProfile}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }} keyboardShouldPersistTaps="handled">
                
                {/* SECTION 1: TÀI KHOẢN (USER) */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="person-circle" size={22} color="#3B82F6" />
                        <Text style={styles.sectionTitle}>Hồ sơ Tài khoản</Text>
                    </View>

                    {/* Đổi Avatar */}
                    <View style={styles.avatarSection}>
                        <TouchableOpacity onPress={handlePickAvatar} style={styles.avatarWrapper}>
                            <Image 
                                source={{ uri: avatar ? avatar.uri : (currentUser?.avatar || 'https://via.placeholder.com/150') }} 
                                style={styles.avatarImage} 
                            />
                            <View style={styles.cameraIcon}>
                                <Ionicons name="camera" size={16} color="#FFF" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.avatarHint}>Bấm để đổi ảnh đại diện</Text>
                    </View>

                    {/* Chỉ xem (Read-only) */}
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Tên đăng nhập (Username)</Text>
                        <TextInput style={styles.inputDisabled} value={currentUser?.username} editable={false} />
                    </View>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Vai trò (Role)</Text>
                        <TextInput style={styles.inputDisabled} value={currentUser?.role} editable={false} />
                    </View>

                    {/* Cho phép sửa */}
                    <View style={{ flexDirection: 'row', gap: 12 }}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Họ</Text>
                            <TextInput style={styles.input} value={lastName} onChangeText={setLastName} />
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Tên</Text>
                            <TextInput style={styles.input} value={firstName} onChangeText={setFirstName} />
                        </View>
                    </View>
                    
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Email</Text>
                        <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                    </View>

                    <AppButton 
                        title={isUpdatingUser ? "Đang lưu..." : "Cập nhật Tài khoản"} 
                        mode="contained" 
                        onPress={handleSaveUser} 
                        disabled={isUpdatingUser}
                        style={{ marginTop: 8 }}
                    />
                </View>

                {/* SECTION 2: THÔNG TIN HỒ SƠ (PROFILE) */}
                <View style={styles.sectionCard}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="id-card" size={22} color="#10B981" />
                        <Text style={styles.sectionTitle}>Thông tin Người dùng</Text>
                    </View>
                    
                    {isEmployer ? (
                        <>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Tên công ty / Doanh nghiệp</Text>
                                <TextInput style={styles.input} value={companyName} onChangeText={setCompanyName} />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Mã số thuế</Text>
                                <TextInput style={styles.input} value={taxCode} onChangeText={setTaxCode} keyboardType="numeric" />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Mô tả công ty</Text>
                                <TextInput style={styles.textArea} multiline numberOfLines={4} value={companyDesc} onChangeText={setCompanyDesc} textAlignVertical="top" />
                            </View>
                            <Text style={styles.noteText}>* Lưu ý: Việc quản lý Cơ sở/Địa chỉ được thực hiện tại một màn hình thiết lập riêng.</Text>
                        </>
                    ) : (
                        <>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Số điện thoại liên hệ</Text>
                                <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Ngày sinh</Text>
                                <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={dob} onChangeText={setDob} />
                            </View>
                            <View style={styles.formGroup}>
                                <Text style={styles.label}>Giới thiệu bản thân (Bio)</Text>
                                <TextInput style={styles.textArea} multiline numberOfLines={4} value={bio} onChangeText={setBio} textAlignVertical="top" />
                            </View>
                        </>
                    )}

                    <AppButton 
                        title={isUpdatingProfile ? "Đang lưu..." : "Cập nhật Hồ sơ"} 
                        mode="contained" 
                        onPress={handleSaveProfile} 
                        disabled={isUpdatingProfile}
                        style={{ marginTop: 8 }}
                    />
                </View>

            </ScrollView>

            <AppAlertModal 
                visible={alertConfig.visible} type={alertConfig.type} 
                title={alertConfig.title} message={alertConfig.message} 
                onClose={() => setAlertConfig(prev => ({ ...prev, visible: false }))} 
            />
        </View>
    );
}