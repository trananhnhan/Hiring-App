
import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../context/AuthContext';
import { statsService } from '../../services/statsService';
import { globalStyles } from '../../constants/globalStyles';
import { styles } from './style'; 

export default function StatsScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { user: currentUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);

    const isEmployer = currentUser?.role === 'EMPLOYER';

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await statsService.getOverviewStats();
                setStats(data);
            } catch (error) {
                console.log("Lỗi tải thống kê:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#3B82F6" />;
    if (!stats) return <View style={styles.center}><Text>Không có dữ liệu thống kê.</Text></View>;

    const getPercent = (value, total) => total > 0 ? (value / total) * 100 : 0;

    const renderEmployerStats = () => (
        <View style={styles.dashboardContainer}>
            <View style={styles.mainRow}>
                <View style={[styles.mainCard, { backgroundColor: '#EFF6FF' }]}>
                    <Ionicons name="briefcase" size={28} color="#3B82F6" />
                    <Text style={[styles.cardValue, { color: '#3B82F6' }]}>{stats.total_jobs}</Text>
                    <Text style={styles.cardLabel}>Tin tuyển dụng</Text>
                </View>
                <View style={[styles.mainCard, { backgroundColor: '#F3F4F6' }]}>
                    <Ionicons name="people" size={28} color="#1F2937" />
                    <Text style={[styles.cardValue, { color: '#1F2937' }]}>{stats.total_applications}</Text>
                    <Text style={styles.cardLabel}>Tổng đơn nộp</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Trạng thái đơn ứng tuyển</Text>
            
            <View style={styles.statusList}>
                
                <View style={styles.statusItem}>
                    <View style={styles.statusHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                            <Text style={styles.statusName}>Đã nhận việc (Accepted)</Text>
                        </View>
                        <Text style={styles.statusCount}>{stats.accepted} đơn</Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { backgroundColor: '#10B981', width: `${getPercent(stats.accepted, stats.total_applications)}%` }]} />
                    </View>
                </View>

                
                <View style={styles.statusItem}>
                    <View style={styles.statusHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.dot, { backgroundColor: '#3B82F6' }]} />
                            <Text style={styles.statusName}>Đang xem xét (Reviewing)</Text>
                        </View>
                        <Text style={styles.statusCount}>{stats.reviewing || 0} đơn</Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { backgroundColor: '#3B82F6', width: `${getPercent(stats.reviewing || 0, stats.total_applications)}%` }]} />
                    </View>
                </View>

                
                <View style={styles.statusItem}>
                    <View style={styles.statusHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.dot, { backgroundColor: '#F59E0B' }]} />
                            <Text style={styles.statusName}>Đang chờ duyệt (Pending)</Text>
                        </View>
                        <Text style={styles.statusCount}>{stats.pending} đơn</Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { backgroundColor: '#F59E0B', width: `${getPercent(stats.pending, stats.total_applications)}%` }]} />
                    </View>
                </View>

                
                <View style={styles.statusItem}>
                    <View style={styles.statusHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                            <Text style={styles.statusName}>Từ chối (Rejected)</Text>
                        </View>
                        <Text style={styles.statusCount}>{stats.rejected} đơn</Text>
                    </View>
                    <View style={styles.progressTrack}>
                        <View style={[styles.progressBar, { backgroundColor: '#EF4444', width: `${getPercent(stats.rejected, stats.total_applications)}%` }]} />
                    </View>
                </View>
            </View>
        </View>
    );

    const renderCandidateStats = () => (
        <View style={styles.dashboardContainer}>
            <View style={styles.rateCard}>
                <Text style={styles.rateTitle}>Tỷ lệ trúng tuyển thành công</Text>
                <Text style={styles.rateValue}>{stats.acceptance_rate}%</Text>
                <View style={[styles.progressTrack, { backgroundColor: 'rgba(255,255,255,0.3)', marginTop: 12 }]}>
                    <View style={[styles.progressBar, { backgroundColor: '#FFFFFF', width: `${stats.acceptance_rate}%` }]} />
                </View>
                <Text style={styles.rateSub}>Dựa trên tổng số hồ sơ đã được các công ty xét duyệt</Text>
            </View>

            <Text style={styles.sectionTitle}>Tổng quan hồ sơ</Text>
            
            
            <View style={[styles.gridContainer, { borderBottomWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, overflow: 'hidden' }]}>
                <View style={[styles.gridItem, { paddingVertical: 16 }]}>
                    <Text style={styles.gridNumber}>{stats.total_applications}</Text>
                    <Text style={styles.gridLabel}>Tổng đơn đã nộp</Text>
                </View>
            </View>

            
            <View style={styles.gridContainer}>
                <View style={styles.gridItem}>
                    <Text style={[styles.gridNumber, { color: '#10B981' }]}>{stats.accepted}</Text>
                    <Text style={styles.gridLabel}>Được nhận</Text>
                </View>
                <View style={[styles.gridItem, { borderLeftWidth: 1, borderColor: '#E5E7EB' }]}>
                    
                    <Text style={[styles.gridNumber, { color: '#3B82F6' }]}>{stats.reviewing || 0}</Text>
                    <Text style={styles.gridLabel}>Đang xem xét</Text>
                </View>
            </View>
            
            <View style={[styles.gridContainer, { borderTopWidth: 1, borderColor: '#E5E7EB' }]}>
                <View style={styles.gridItem}>
                    <Text style={[styles.gridNumber, { color: '#F59E0B' }]}>{stats.pending}</Text>
                    <Text style={styles.gridLabel}>Đang chờ duyệt</Text>
                </View>
                <View style={[styles.gridItem, { borderLeftWidth: 1, borderColor: '#E5E7EB' }]}>
                    <Text style={[styles.gridNumber, { color: '#EF4444' }]}>{stats.rejected}</Text>
                    <Text style={styles.gridLabel}>Bị từ chối</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Thống kê phân tích</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {isEmployer ? renderEmployerStats() : renderCandidateStats()}
            </ScrollView>
        </View>
    );
}