import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../../context/AuthContext';
import { verificationService } from '../../../services/verificationService';
import { globalStyles } from '../../../constants/globalStyles';
import { formatDate } from '../../../utils/formatter';
import { AppButton } from '../../../components/AppButton';
import { styles } from './style';

export default function VerificationListScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const { user: currentUser } = useContext(AuthContext);
    const hasRequiredInfo = currentUser?.profile?.company_name && currentUser?.profile?.tax_code;

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Dùng useFocusEffect để tự reload mỗi khi quay lại từ màn Tạo mới hoặc Chi tiết
    useFocusEffect(
        useCallback(() => {
            if (hasRequiredInfo) {
                verificationService.getMyRequests()
                    .then(res => setRequests(res))
                    .catch(err => console.log(err))
                    .finally(() => setLoading(false));
            } else {
                setLoading(false);
            }
        }, [hasRequiredInfo])
    );

    // Logic: Nếu có 1 request đang PENDING hoặc ACCEPTED thì chặn tạo mới
    const canCreateNew = !requests.some(r => r.status === 'PENDING' || r.status === 'ACCEPTED');

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACCEPTED': return { bg: '#D1FAE5', text: '#059669', label: 'ĐÃ DUYỆT' };
            case 'PENDING': return { bg: '#FEF3C7', text: '#D97706', label: 'ĐANG CHỜ' };
            case 'REJECTED': return { bg: '#FEE2E2', text: '#DC2626', label: 'TỪ CHỐI' };
            default: return { bg: '#F3F4F6', text: '#374151', label: status };
        }
    };

    const renderItem = ({ item }) => {
        const { bg, text, label } = getStatusStyle(item.status);
        return (
            <TouchableOpacity 
                style={styles.listCard} 
                activeOpacity={0.7} 
                onPress={() => navigation.navigate('VerificationDetailScreen', { requestUuid: item.uuid })}
            >
                <View>
                    <Text style={{ fontWeight: 'bold', color: '#111' }}>Mã YC: {item.uuid.split('-')[0].toUpperCase()}</Text>
                    <Text style={styles.dateText}>Ngày nộp: {formatDate(item.created_date)}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: bg }]}>
                    <Text style={[styles.badgeText, { color: text }]}>{label}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Lịch sử Xác thực</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={{ flex: 1, padding: 16 }}>
                {!hasRequiredInfo ? (
                    <View style={styles.warningCard}>
                        <Ionicons name="warning" size={40} color="#F59E0B" />
                        <Text style={styles.warningTitle}>Thiếu thông tin</Text>
                        <Text style={styles.warningText}>Bạn cần cập nhật Tên công ty và Mã số thuế trước khi xác thực.</Text>
                        <AppButton title="Cập nhật Hồ sơ" mode="contained" onPress={() => navigation.navigate('EditProfileScreen')} style={{ marginTop: 12, width: '100%' }} />
                    </View>
                ) : (
                    <>
                        <FlatList 
                            data={requests}
                            keyExtractor={item => item.uuid}
                            renderItem={renderItem}
                            ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 40 }}>Chưa có yêu cầu xác thực nào.</Text>}
                        />
                        
                        {canCreateNew && (
                            <AppButton 
                                title="Tạo Yêu Cầu Mới" 
                                mode="contained" 
                                onPress={() => navigation.navigate('CreateVerificationScreen')} 
                                style={{ marginTop: 16 }}
                            />
                        )}
                    </>
                )}
            </View>
        </View>
    );
}