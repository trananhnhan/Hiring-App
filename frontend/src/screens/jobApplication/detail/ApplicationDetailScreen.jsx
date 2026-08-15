import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../../context/AuthContext';
import { jobApplicationServices } from '../../../services/jobApplicationService';
import { globalStyles } from '../../../constants/globalStyles';
import { styles } from './style';
import { formatDate } from '../../../utils/formatter';

import { AppButton } from '../../../components/AppButton';
import { AppAlertModal } from '../../../components/AppAlertModal';
import { AppConfirmModal } from '../../../components/AppConfirmModal';

export default function ApplicationDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const { user: currentUser } = useContext(AuthContext);
    const isFocused = useIsFocused();
    const { applicationUuid } = route.params;

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [isActionLoading, setIsActionLoading] = useState(false);


    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [reviewModalVisible, setReviewModalVisible] = useState(false);
    const [reviewNote, setReviewNote] = useState('');
    const [pendingStatus, setPendingStatus] = useState(null);

    const fetchDetail = async () => {
        try {
            setLoading(true);
            const res = await jobApplicationServices.getDetail(applicationUuid);
            setData(res);
        } catch (err) {
            console.log("Lỗi lấy đơn:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDetail();
    }, [applicationUuid,isFocused]);


    const handleWithdraw = async () => {
        setConfirmVisible(false);
        setIsActionLoading(true);
        try {
            await jobApplicationServices.withdrawApplication(applicationUuid);
            navigation.goBack();
        } catch (err) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể rút đơn.' });
        } finally {
            setIsActionLoading(false);
        }
    };


    const handleReview = async () => {
        setReviewModalVisible(false);
        setIsActionLoading(true);
        try {
            const res = await jobApplicationServices.updateApplication(applicationUuid, {
                result: pendingStatus,
                result_detail: reviewNote
            });
            setData(prevData => ({
                ...prevData,
                result: pendingStatus,
                result_detail: reviewNote
            }));
            setAlertConfig({ visible: true, type: 'success', title: 'Thành công', message: 'Đã cập nhật trạng thái đơn.' });
        } catch (err) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Cập nhật thất bại.' });
        } finally {
            setIsActionLoading(false);
            setReviewNote('');
        }
    };

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#111111" />;
    if (!data) return <View style={styles.container}><Text>Không tìm thấy dữ liệu.</Text></View>;

    const isCandidate = currentUser?.role === 'CANDIDATE';
    const statusColors = { PENDING: '#F59E0B', REVIEWING: '#3B82F6', ACCEPTED: '#10B981', REJECTED: '#EF4444' };

    return (
        <View style={styles.container}>

            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}><Ionicons name="arrow-back" size={24} color="#111111" /></TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết ứng tuyển</Text>
                <TouchableOpacity onPress={() => {
                    const chatTarget = isCandidate ? data.employer : data.candidate;
                    navigation.navigate('ChatDetailScreen', {
                        targetUser: {
                            username: chatTarget.username,
                            name: isCandidate ? `${chatTarget.name} (${chatTarget.company_name})` : chatTarget.name,
                            avatar: chatTarget.avatar || 'https://via.placeholder.com/150'
                        }
                    });
                }}>
                    <Ionicons name="chatbubble-ellipses-outline" size={24} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
                    <View style={[globalStyles.chip, { backgroundColor: statusColors[data.result], borderColor: 'transparent' }]}>
                        <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 12 }}>{data.result}</Text>
                    </View>
                    <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 4 }}>Nộp ngày: {formatDate(data.created_date)}</Text>
                </View>


                <TouchableOpacity style={styles.jobCard} onPress={() => navigation.navigate('JobDetail', { jobUuid: data.job_post.uuid })}>
                    <Image source={{ uri: data.job_post.job_thumbnail }} style={styles.jobThumb} />
                    <View style={styles.jobInfo}>
                        <Text style={styles.jobTitle}>{data.job_post.title}</Text>
                        <Text style={styles.companyName}>{data.employer.company_name}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
                </TouchableOpacity>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lời nhắn từ ứng viên</Text>
                    <Text style={styles.messageText}>{data.message || "Không có lời nhắn."}</Text>
                </View>


                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hồ sơ đính kèm</Text>
                    <TouchableOpacity style={styles.resumeTile} onPress={() => navigation.navigate('ResumeDetailScreen', { resumeUuid: data.resume.uuid })}>
                        <Ionicons name="document-text" size={24} color="#EF4444" />
                        <Text style={styles.resumeTitle}>{data.resume.title}</Text>
                        <Ionicons name="eye-outline" size={20} color="#6B7280" />
                    </TouchableOpacity>
                </View>


                {data.result_detail && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Phản hồi từ nhà tuyển dụng</Text>
                        <Text style={styles.resultDetail}>"{data.result_detail}"</Text>
                    </View>
                )}
            </ScrollView>


            <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 24) }]}>


                {data.result === 'ACCEPTED' || data.result === 'REJECTED' ? (
                    <View style={{ width: '100%' }}>
                        <AppButton
                            title="✍️ Viết đánh giá & phản hồi"
                            mode="contained"
                            style={{ backgroundColor: '#6366F1' }}
                            onPress={() => navigation.navigate('ApplicationCommentsScreen', {
                                applicationUuid: data.uuid,

                            })}
                        />
                    </View>
                ) : (

                    <View style={styles.buttonRow}>
                        {isCandidate ? (
                            <>

                                {data.result === 'PENDING' && (
                                    <AppButton
                                        title="Chỉnh sửa đơn"
                                        mode="outlined"
                                        style={{ flex: 1 }}

                                        onPress={() => navigation.navigate('ApplyJobScreen', { application: data })}
                                    />
                                )}
                                <AppButton
                                    title="Rút đơn nộp"
                                    mode="contained"
                                    style={{ flex: 1, backgroundColor: '#EF4444' }}
                                    onPress={() => setConfirmVisible(true)}
                                />
                            </>
                        ) : (
                            <>
                                <AppButton
                                    title="Từ chối"
                                    mode="outlined"
                                    style={{ flex: 1, borderColor: '#EF4444' }}
                                    labelStyle={{ color: '#EF4444' }}
                                    onPress={() => { setPendingStatus('REJECTED'); setReviewModalVisible(true); }}
                                />
                                <AppButton
                                    title="Chấp nhận"
                                    mode="contained"
                                    style={{ flex: 1, backgroundColor: '#10B981' }}
                                    onPress={() => { setPendingStatus('ACCEPTED'); setReviewModalVisible(true); }}
                                />
                            </>
                        )}
                    </View>
                )}

            </View>


            <AppConfirmModal
                visible={reviewModalVisible}
                title={pendingStatus === 'ACCEPTED' ? "Chấp nhận ứng viên" : "Từ chối ứng viên"}
                message={
                    <View style={{ width: '100%', marginTop: 10 }}>
                        <Text style={{ marginBottom: 10 }}>Nhập lời nhắn gửi đến ứng viên:</Text>
                        <TextInput
                            style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10, height: 80 }}
                            multiline placeholder="Lời nhắn..." value={reviewNote} onChangeText={setReviewNote}
                        />
                    </View>
                }
                onConfirm={handleReview} onCancel={() => setReviewModalVisible(false)}
            />

            <AppConfirmModal visible={confirmVisible} isDanger title="Xác nhận rút đơn" message="Bạn có chắc chắn muốn rút đơn ứng tuyển này không? Hành động này không thể hoàn tác."
                onConfirm={handleWithdraw} onCancel={() => setConfirmVisible(false)} />

            <AppAlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={() => setAlertConfig({ ...alertConfig, visible: false })} />
        </View>
    );
}