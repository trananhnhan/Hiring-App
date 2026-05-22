import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../style';

export default function ReviewCard({ item }) {
  const navigation = useNavigation();

  // Hàm xử lý điều hướng thông minh khi nhấn vào thông tin tác giả
  const handleAuthorPress = () => {
    if (item.author?.username && item.author?.role) {
      navigation.navigate('PublicProfileScreen', { 
        username: item.author.username, 
        role: item.author.role 
      });
    }
  };

  return (
    <View style={styles.reviewCard}>
      
      {/* ✅ ĐÃ SỬA: Đổi từ View sang TouchableOpacity để cho phép click bay sang Public Profile */}
      <TouchableOpacity 
        style={styles.reviewHeader} 
        activeOpacity={0.7}
        onPress={handleAuthorPress}
      >
        {item.author?.avatar ? (
          <Image source={{ uri: item.author.avatar }} style={styles.reviewAvatar} />
        ) : (
          <View style={[styles.reviewAvatar, { backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }]}>
            <Ionicons name="person" size={16} color="#9CA3AF" />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text style={styles.reviewAuthorName}>{item.author?.name || 'Người dùng ẩn danh'}</Text>
          <Text style={styles.reviewStars}>{'⭐'.repeat(item.recommendation_rate || 5)}</Text>
        </View>
      </TouchableOpacity>

      {/* NỘI DUNG BÌNH LUẬN */}
      <Text style={styles.reviewComment}>"{item.review}"</Text>

      {/* LINK ĐIỀU HƯỚNG SANG JOB DETAIL */}
      {item.job_post?.uuid && (
        <TouchableOpacity 
          onPress={() => navigation.navigate('JobDetail', { jobUuid: item.job_post.uuid })}
          activeOpacity={0.7}
        >
          <Text style={styles.reviewJobLink}>🔗 Thuộc Job: {item.job_post.title}</Text>
        </TouchableOpacity>
      )}
      
    </View>
  );
}