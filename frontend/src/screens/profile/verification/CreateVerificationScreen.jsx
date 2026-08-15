import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { verificationService } from '../../../services/verificationService';
import { globalStyles } from '../../../constants/globalStyles';
import { AppButton } from '../../../components/AppButton';
import { AppAlertModal } from '../../../components/AppAlertModal';
import { styles } from './style';

export default function CreateVerificationScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ visible: false, type: 'info', title: '', message: '' });

    const handlePickImages = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'], allowsMultipleSelection: true, quality: 0.8, selectionLimit: 10 - selectedImages.length
        });

        if (!result.canceled) {
            const newAssets = result.assets.map(a => ({ uri: a.uri, fileName: a.fileName, mimeType: a.mimeType }));
            const totalImages = [...selectedImages, ...newAssets];
            if (totalImages.length > 10) {
                setAlertConfig({ visible: true, type: 'error', title: 'Giới hạn', message: 'Chỉ được tải lên tối đa 10 ảnh.' });
                return;
            }
            setSelectedImages(totalImages);
        }
    };

    const handleRemoveImage = (index) => {
        setSelectedImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (selectedImages.length < 3 || selectedImages.length > 10) {
            setAlertConfig({ visible: true, type: 'error', title: 'Thiếu ảnh', message: 'Vui lòng cung cấp từ 3 đến 10 hình ảnh.' });
            return;
        }

        setIsSubmitting(true);
        try {
            await verificationService.createRequest(selectedImages);
            setAlertConfig({
                visible: true, type: 'success', title: 'Thành công', message: 'Yêu cầu của bạn đã được gửi.',
                onCloseOverride: () => {
                    setAlertConfig(prev => ({ ...prev, visible: false }));
                    navigation.goBack(); 
                }
            });
        } catch (error) {
            setAlertConfig({ visible: true, type: 'error', title: 'Lỗi', message: 'Không thể gửi yêu cầu.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#F9FAFB' }]}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} disabled={isSubmitting}>
                    <Ionicons name="close" size={24} color="#111111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tạo Yêu Cầu Xác Thực</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ padding: 16 }}>
                <View style={styles.detailCard}>
                    <Text style={styles.detailLabel}>Tải lên hình ảnh chứng từ</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', marginBottom: 16 }}>Yêu cầu tải lên Giấy phép ĐKKD, CCCD người đại diện... (Tối thiểu 3, tối đa 10 ảnh).</Text>
                    
                    <View style={styles.imageGrid}>
                        {selectedImages.map((img, index) => (
                            <View key={index} style={styles.imageBox}>
                                <Image source={{ uri: img.uri }} style={styles.imgPreview} />
                                <TouchableOpacity style={styles.deleteImgBtn} onPress={() => handleRemoveImage(index)}>
                                    <Ionicons name="close-circle" size={24} color="#EF4444" />
                                </TouchableOpacity>
                            </View>
                        ))}
                        
                        {selectedImages.length < 10 && (
                            <TouchableOpacity style={styles.addImgBtn} onPress={handlePickImages}>
                                <Ionicons name="camera-outline" size={32} color="#9CA3AF" />
                                <Text style={{ fontSize: 10, color: '#6B7280', marginTop: 4 }}>{selectedImages.length}/10</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>

                <AppButton 
                    title={isSubmitting ? "Đang gửi..." : "Gửi Xác Thực"} 
                    mode="contained" 
                    onPress={handleSubmit} 
                    disabled={isSubmitting || selectedImages.length < 3} 
                />
            </ScrollView>

            <AppAlertModal visible={alertConfig.visible} type={alertConfig.type} title={alertConfig.title} message={alertConfig.message} onClose={() => { if (alertConfig.onCloseOverride) alertConfig.onCloseOverride(); else setAlertConfig(prev => ({ ...prev, visible: false })); }} />
        </View>
    );
}