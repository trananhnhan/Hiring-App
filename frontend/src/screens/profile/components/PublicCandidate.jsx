import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { profileServices } from '../../../services/profileService';
import { formatDate } from '../../../utils/formatter';
import ReviewCard from './ReviewCard';
import api from '../../../services/api';
import { styles } from '../style';

export default function PublicCandidate({ profile, insets }) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('tab1');

  // --- QUẢN LÝ STATE PHÂN TRANG VÔ HẠN ---
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Lấy số lượng Đang theo dõi công khai ở Header
  const [followingCount, setFollowingCount] = useState(0);
  useEffect(() => {
    if (profile.user?.username) {
      api.get(`/candidate-profiles/${profile.user.username}/following/`)
        .then(res => setFollowingCount(res.data?.count || 0))
        .catch(() => {});
    }
  }, [profile.user?.username]);

  // Hàm cốt lõi nạp dữ liệu phân trang cộng dồn mảng
  const loadData = async (pageToLoad, isRefresh = false) => {
    if (pageToLoad === 1) setIsInitialLoading(true);
    else setIsLoadingMore(true);

    try {
      let responseData;
      if (activeTab === 'tab1') {
        responseData = await profileServices.getPublicCandidateResumes(profile.user?.username, pageToLoad);
      } else {
        responseData = await profileServices.getPublicCandidateComments(profile.user?.username, pageToLoad);
      }

      const newItems = responseData?.results || [];
      setListData(prev => isRefresh ? newItems : [...prev, ...newItems]);
      setHasMore(responseData?.next !== null);
    } catch (err) {
      console.log("Lỗi tải phân trang PublicCandidate:", err);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Reset khi chuyển đổi giữa Tab CV và Đánh giá
  useEffect(() => {
    if (profile.user?.username) {
      setListData([]);
      setPage(1);
      setHasMore(true);
      loadData(1, true);
    }
  }, [activeTab, profile.user?.username]);

  const handleLoadMore = () => {
    if (!isInitialLoading && !isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false);
    }
  };

  const renderItemCard = ({ item, index }) => {
    if (activeTab === 'tab1') {
      return (
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>📄 {item.title}</Text>
          <Text style={styles.itemSubText}>Cập nhật: {formatDate(item.updated_date)}</Text>
        </View>
      );
    }
    return <ReviewCard item={item} />;
  };

  const renderFooterLoading = () => {
    if (!isLoadingMore) return <View style={{ height: 40 }} />;
    return (
      <View style={{ paddingVertical: 16, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#111111" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isInitialLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#111111" />
        </View>
      ) : (
        <FlatList
          data={listData}
          keyExtractor={(item, index) => item.uuid || item.id?.toString() || index.toString()}
          renderItem={renderItemCard}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          
          // ✅ ĐẨY TOÀN BỘ HEADER VÀ TABBAR VÀO FLATLIST ĐỂ CUỘN ĐỒNG BỘ MƯỢT MÀ
          ListHeaderComponent={
            <View style={{ backgroundColor: '#FFFFFF' }}>
              {/* KHỐI ĐỈNH */}
              <View style={[styles.headerContainer, { paddingTop: insets.top > 0 ? insets.top + 10 : 24 }]}>
                <TouchableOpacity style={[styles.backButton, { top: insets.top > 0 ? insets.top : 14 }]} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={22} color="#111111" />
                </TouchableOpacity>
                {profile.user?.avatar ? <Image source={{ uri: profile.user.avatar }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder}><Ionicons name="person" size={40} color="#9CA3AF" /></View>}
                <Text style={styles.name}>{profile.user?.name}</Text>
                <Text style={styles.username}>@{profile.user?.username}</Text>
                <Text style={styles.bioText}>{profile.bio || 'Chưa cập nhật giới thiệu.'}</Text>
                <Text style={styles.ageText}>Khoảng {profile.approximate_age || 21} tuổi 🕵️‍♂️</Text>
                
                <View style={styles.statsRow}>
                  <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('FollowListScreen', { type: 'following', username: profile.user?.username })}>
                    <Text style={styles.statNumber}>{followingCount}</Text>
                    <Text style={styles.statLabel}>Đang theo dõi</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* THANH ĐIỀU HƯỚNG TABBAR */}
              <View style={[styles.tabBarContainer, { marginBottom: 12 }]}>
                <TouchableOpacity style={[styles.tabItem, activeTab === 'tab1' && styles.activeTabItem]} onPress={() => setActiveTab('tab1')}>
                  <Text style={[styles.tabLabel, activeTab === 'tab1' && styles.activeTabLabel]}>Hồ sơ CV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabItem, activeTab === 'tab2' && styles.activeTabItem]} onPress={() => setActiveTab('tab2')}>
                  <Text style={[styles.tabLabel, activeTab === 'tab2' && styles.activeTabLabel]}>Đánh giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 30, fontSize: 13 }}>Không có dữ liệu công khai.</Text>
          }
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooterLoading}
          style={{ paddingHorizontal: 12 }}
        />
      )}
    </View>
  );
}