import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute, useIsFocused } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { useApi } from '../../../hooks/useApi';

import {jobApplicationServices} from '../../../services/jobApplicationService'

import { globalStyles } from '../../../constants/globalStyles';
import { formatDate } from '../../../utils/formatter';

import { AppButton } from '../../../components/AppButton';
import { AppConfirmModal } from '../../../components/AppConfirmModal';
import { AppAlertModal } from '../../../components/AppAlertModal';

import { styles } from './style';


export default function ApplicationCommentsScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();
    const isFocused = useIsFocused();

    
    const { applicationUuid } = route.params || {};

    

    
    const { data: commentsData, loading, execute: fetchComments } = useApi(jobApplicationServices.getApplicationComments);
    const { loading: isSubmitting, execute: submitComment } = useApi(jobApplicationServices.createApplicationComment);

    
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');

    
    const [isDeleting, setIsDeleting] = useState(false);
    const [isConfirmVisible, setIsConfirmVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    
    useEffect(() => {
        if (applicationUuid) fetchComments(applicationUuid);
    }, [applicationUuid, isFocused]);

    
    const handleSaveComment = async () => {
        if (!review.trim()) {
            setAlertConfig({ visible: true, type: 'error', title: 'Cảnh báo', message: 'Vui lòng nhập nội dung đánh giá.' });
            return;
        }

        try {
            await submitComment(applicationUuid, { review, recommendation_rate: rating });
            setAlertConfig({
                visible: true, type: 'success', title: 'Thành công!', message: 'Đã gửi đánh giá thành công.',
                onCloseOverride: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    fetchComments(applicationUuid); 
                    setReview(''); 
                }
            });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể gửi đánh giá, vui lòng thử lại.' });
        }
    };

    
    const handleConfirmDelete = async () => {
        setIsConfirmVisible(false);
        setIsDeleting(true);
        try {
            await jobApplicationServices.deleteApplicationComment(applicationUuid);
            setAlertConfig({
                visible: true, type: 'success', title: 'Đã xóa!', message: 'Đánh giá của bạn đã được gỡ bỏ.',
                onCloseOverride: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    fetchComments(applicationUuid); 
                }
            });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Xóa thất bại', message: 'Không thể xóa đánh giá lúc này.' });
        } finally {
            setIsDeleting(false);
        }
    };

    
    const StarRating = ({ currentRating, onRate, disabled = false }) => (
        <View style={{ flexDirection: 'row', gap: 8, marginVertical: 12, justifyContent: 'center' }}>
            {[1, 2, 3, 4, 5].map(star => (
                <TouchableOpacity key={star} onPress={() => !disabled && onRate(star)} disabled={disabled}>
                    <Ionicons
                        name={star <= currentRating ? "star" : "star-outline"}
                        size={32}
                        color={star <= currentRating ? "#F59E0B" : "#D1D5DB"}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );

    
const CommentCard = ({ data, titleBadge, badgeColor }) => {
        if (!data) return null;
        return (
            <View style={styles.commentCard}>
                <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                    <Text style={[styles.badgeText, { color: '#FFF' }]}>{titleBadge}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 12 }}>
                    
                    {/* ✅ Đã vá lại link ảnh và đóng thẻ Image đàng hoàng */}
                    <Image 
                        source={{ uri: data.author?.avatar || 'https://via.placeholder.com/150' }} 
                        style={styles.avatar || { width: 40, height: 40, borderRadius: 20 }} 
                    />
                    
                    <View style={{ flex: 1 }}>
                        <Text style={styles.authorName}>{data.author?.name}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            <Ionicons name="star" size={14} color="#F59E0B" />
                            <Text style={styles.ratingText}>{data?.recommendation_rate ?? 0}/5</Text>
                            <Text style={styles.dateText}> • {formatDate(data.created_date)}</Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.reviewText}>{data.review}</Text>
            </View>
        );
    };

    if (loading && !commentsData) return <ActivityIndicator style={{ flex: 1, backgroundColor: '#F9FAFB' }} size="large" color="#111111" />;

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F3F4F6' }]}>
            
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} disabled={isSubmitting || isDeleting}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá hồ sơ</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: Math.max(insets.bottom, 24) }} keyboardShouldPersistTaps="handled">

                
                {commentsData?.job_post && (
                    <View style={styles.jobHeader}>
                        <Image source={{ uri: commentsData.job_post.job_thumbnail }} style={styles.jobThumbnail} />
                        <Text style={styles.jobTitle}>{commentsData.job_post.title}</Text>
                    </View>
                )}

                
                <View style={{ paddingHorizontal: 16 }}>
                    <CommentCard
                        data={commentsData?.employer_comment}
                        titleBadge="Nhà Tuyển Dụng"
                        badgeColor="#3B82F6"
                    />
                    <CommentCard
                        data={commentsData?.candidate_comment}
                        titleBadge="Ứng Viên"
                        badgeColor="#10B981"
                    />

                    
                    {!commentsData?.employer_comment && !commentsData?.candidate_comment && (
                        <Text style={{ textAlign: 'center', color: '#6B7280', marginVertical: 24, fontStyle: 'italic' }}>
                            Chưa có đánh giá nào cho đơn ứng tuyển này.
                        </Text>
                    )}
                </View>

                
                {commentsData && (
                    <View style={styles.actionCard}>
                        {commentsData.you_commented ? (
                            
                            <View style={{ alignItems: 'center' }}>
                                <Ionicons name="checkmark-circle" size={48} color="#10B981" />
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111', marginTop: 8 }}>Bạn đã gửi đánh giá!</Text>


                                <AppButton
                                    title={isDeleting ? "Đang xóa..." : "Xóa đánh giá của tôi"}
                                    mode="outlined"
                                    isDanger={true}
                                    onPress={() => setIsConfirmVisible(true)}
                                    disabled={isDeleting}
                                    style={{ width: '100%', marginTop: 12 }}
                                />
                            </View>
                        ) : (
                            
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#111', textAlign: 'center' }}>Viết đánh giá của bạn</Text>

                                <StarRating currentRating={rating} onRate={setRating} />

                                <TextInput
                                    style={styles.textArea}
                                    multiline
                                    numberOfLines={4}
                                    placeholder="Chia sẻ trải nghiệm của bạn (thái độ, chuyên môn, môi trường...)"
                                    value={review}
                                    onChangeText={setReview}
                                    textAlignVertical="top"
                                />

                                <AppButton
                                    title={isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
                                    mode="contained"
                                    onPress={handleSaveComment}
                                    disabled={isSubmitting}
                                />
                            </View>
                        )}
                    </View>
                )}
            </ScrollView>

            
            <AppConfirmModal
                visible={isConfirmVisible}
                title="Xóa đánh giá"
                message="Bạn có chắc chắn muốn gỡ bỏ đánh giá này không?"
                confirmText="Xóa bỏ"
                cancelText="Hủy"
                isDanger={true}
                onCancel={() => setIsConfirmVisible(false)}
                onConfirm={handleConfirmDelete}
            />

            <AppAlertModal
                visible={alertConfig.visible} type={alertConfig.type}
                title={alertConfig.title} message={alertConfig.message}
                onClose={() => {
                    if (alertConfig.onCloseOverride) alertConfig.onCloseOverride();
                    else setAlertConfig(prev => ({ ...prev, visible: false }));
                }}
            />
        </View>
    );
}