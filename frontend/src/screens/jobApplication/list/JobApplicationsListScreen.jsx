import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native'; 
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { jobApplicationServices } from '../../../services/jobApplicationService'; 
import { globalStyles } from '../../../constants/globalStyles';
import { styles } from './style'; 
import { formatDate } from '../../../utils/formatter'; 

export default function JobApplicationsListScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused(); 

    const { jobUuid } = route.params;

    const [applications, setApplications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchApplications = async (pageToLoad, isRefresh = false) => {
        if (pageToLoad === 1) setLoading(true);
        else setLoadingMore(true);

        try {
            const data = await jobApplicationServices.getApplicationsByJobPost(jobUuid, pageToLoad);
            const newList = data?.results || [];

            setApplications(prev => isRefresh ? newList : [...prev, ...newList]);
            setHasMore(data?.next !== null);
        } catch (error) {
            console.log("Lỗi tải danh sách ứng viên:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    
    useEffect(() => {
        if (jobUuid && isFocused) {
            setPage(1);
            fetchApplications(1, true);
        }
    }, [jobUuid, isFocused]);

    const handleLoadMore = () => {
        if (!loading && !loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchApplications(nextPage, false);
        }
    };

    
    const handleGoToProfile = (candidate) => {
        navigation.navigate('PublicProfileScreen', { 
            username: candidate.username, 
            role: candidate.role 
        });
    };

    const renderItem = ({ item }) => {
        const candidate = item.candidate_user || {};
        const resultColors = { 'PENDING': '#F59E0B', 'REVIEWING': '#3B82F6', 'ACCEPTED': '#10B981', 'REJECTED': '#EF4444' };
        const resultTexts = { 'PENDING': 'Đang chờ', 'REVIEWING': 'Đang xem', 'ACCEPTED': 'Đã nhận', 'REJECTED': 'Từ chối' };

        return (
            <TouchableOpacity 
                style={styles.candidateCard}
                activeOpacity={0.7}
                
                onPress={() => navigation.navigate('ApplicationDetailScreen', { applicationUuid: item.uuid })}
            >
                
                <TouchableOpacity onPress={() => handleGoToProfile(candidate)}>
                    {candidate.avatar ? (
                        <Image source={{ uri: candidate.avatar }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <Ionicons name="person" size={24} color="#9CA3AF" />
                        </View>
                    )}
                </TouchableOpacity>

                
                <View style={styles.infoCol}>
                    
                    <TouchableOpacity onPress={() => handleGoToProfile(candidate)}>
                        <Text style={styles.candidateName} numberOfLines={1}>{candidate.name}</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.usernameText}>@{candidate.username}</Text>
                    <Text style={styles.dateText}>📅 {formatDate(item.created_date)}</Text>
                </View>

                
                <View style={styles.statusCol}>
                    <View style={[globalStyles.chip, { backgroundColor: resultColors[item.result] || '#9CA3AF', borderColor: 'transparent', paddingHorizontal: 10 }]}>
                        <Text style={[globalStyles.chipText, { color: '#FFFFFF', fontSize: 11 }]}>
                            {resultTexts[item.result] || item.result}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Danh sách Ứng viên</Text>
                <View style={{ width: 32 }} />
            </View>

            {loading ? (
                <ActivityIndicator style={{ flex: 1 }} size="large" color="#111111" />
            ) : (
                <FlatList
                    data={applications}
                    keyExtractor={(item) => item.uuid}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.2}
                    ListEmptyComponent={
                        <View style={{ alignItems: 'center', marginTop: 40 }}>
                            <Ionicons name="document-text-outline" size={60} color="#D1D5DB" />
                            <Text style={{ color: '#6B7280', marginTop: 12 }}>Chưa có ứng viên nào ứng tuyển.</Text>
                        </View>
                    }
                    ListFooterComponent={
                        loadingMore ? <ActivityIndicator size="small" color="#111111" style={{ marginVertical: 16 }} /> : null
                    }
                />
            )}
        </View>
    );
}