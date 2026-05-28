import React, { useState, useCallback, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../context/AuthContext';
import { verificationService } from '../../services/verificationService';
import { globalStyles } from '../../constants/globalStyles';
import { formatDate } from '../../utils/formatter';

export default function ModeratorListScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { logout } = useContext(AuthContext);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            verificationService.getAllRequests()
                .then(res => setRequests(res))
                .catch(err => console.log(err))
                .finally(() => setLoading(false));
        }, [])
    );

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACCEPTED': return { bg: '#D1FAE5', text: '#059669', label: 'ĐÃ DUYỆT' };
            case 'PENDING': return { bg: '#FEF3C7', text: '#D97706', label: 'CẦN DUYỆT' };
            case 'REJECTED': return { bg: '#FEE2E2', text: '#DC2626', label: 'TỪ CHỐI' };
            default: return { bg: '#F3F4F6', text: '#374151', label: status };
        }
    };

    const renderItem = ({ item }) => {
        const { bg, text, label } = getStatusStyle(item.status);
        return (
            <TouchableOpacity 
                style={styles.card} 
                onPress={() => navigation.navigate('ModeratorDetailScreen', { requestUuid: item.uuid })}
            >
                <View>
                    <Text style={{ fontWeight: 'bold', color: '#111' }}>YC: {item.uuid.split('-')[0].toUpperCase()}</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>Nộp lúc: {formatDate(item.created_date)}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: bg }]}>
                    <Text style={{ fontSize: 11, fontWeight: 'bold', color: text }}>{label}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F3F4F6' }]}>
            {/* HEADER CÓ NÚT ĐĂNG XUẤT */}
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <Text style={styles.headerTitle}>Quản lý Yêu cầu (MOD)</Text>
                <TouchableOpacity onPress={logout} style={{ padding: 4 }}>
                    <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B82F6" />
            ) : (
                <FlatList 
                    contentContainerStyle={{ padding: 16 }}
                    data={requests}
                    keyExtractor={item => item.uuid}
                    renderItem={renderItem}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 40 }}>Không có yêu cầu nào.</Text>}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
});