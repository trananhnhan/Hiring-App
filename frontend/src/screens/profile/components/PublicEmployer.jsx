import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../../context/AuthContext';
import { profileServices } from '../../../services/profileService';
import JobCard from './JobCard';
import ReviewCard from './ReviewCard';
import api from '../../../services/api';
import { styles } from '../style';

export default function PublicEmployer({ profile, insets }) {
  const navigation = useNavigation();
  const { user: currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('tab1');
  const [isFollowing, setIsFollowing] = useState(profile.you_followed || false);

  // --- QUẢN LÝ STATE PHÂN TRANG VÔ HẠN ---
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Lấy số lượng Người theo dõi ở Header Doanh nghiệp
  const [followerCount, setFollowerCount] = useState(0);
  const fetchFollowerCount = () => {
    api.get(`/employer-profiles/${profile.user?.username}/followers/`)
      .then(res => setFollowerCount(res.data?.count || 0))
      .catch(() => {});
  };

  useEffect(() => {
    if (profile.user?.username) fetchFollowerCount();
  }, [profile.user?.username]);

  // Hàm nạp data cộng dồn trang
  const loadData = async (pageToLoad, isRefresh = false) => {
    if (pageToLoad === 1) setIsInitialLoading(true);
    else setIsLoadingMore(true);

    try {
      let responseData;
      if (activeTab === 'tab1') {
        responseData = await profileServices.getPublicEmployerJobPosts(profile.user?.username, pageToLoad);
      } else {
        responseData = await profileServices.getPublicEmployerComments(profile.user?.username, pageToLoad);
      }

      const newItems = responseData?.results || [];
      setListData(prev => isRefresh ? newItems : [...prev, ...newItems]);
      setHasMore(responseData?.next !== null);
    } catch (err) {
      console.log("Lỗi tải phân trang PublicEmployer:", err);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

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

  const handleFollowToggle = async () => {
    try {
      await profileServices.followEmployer(profile.user?.username);
      setIsFollowing(!isFollowing);
      // Bắn lệnh cập nhật lại ngay lập tức số đếm tươi mới trên UI
      setTimeout(() => fetchFollowerCount(), 200);
    } catch (err) {
      console.log("Lỗi bấm nút follow tại trang public:", err);
    }
  };

  const renderItemCard = ({ item, index }) => {
    if (activeTab === 'tab1') return <JobCard item={item} />;
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
          
          // ✅ GOM TOÀN BỘ HEADER VÀ NÚT TOGGLE FOLLOW VÀO LIST HEADER COMPONENT
          ListHeaderComponent={
            <View style={{ backgroundColor: '#FFFFFF' }}>
              <View style={[styles.headerContainer, { paddingTop: insets.top > 0 ? insets.top + 10 : 24 }]}>
                <TouchableOpacity style={[styles.backButton, { top: insets.top > 0 ? insets.top : 14 }]} onPress={() => navigation.goBack()}>
                  <Ionicons name="arrow-back" size={22} color="#111111" />
                </TouchableOpacity>
                {profile.user?.avatar ? <Image source={{ uri: profile.user.avatar }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder}><Ionicons name="person" size={40} color="#9CA3AF" /></View>}
                <Text style={styles.name}>{profile.user?.name}</Text>
                <Text style={styles.username}>@{profile.user?.username}</Text>
                <Text style={styles.bioText}>{profile.company_description || 'Chưa cập nhật giới thiệu công ty.'}</Text>
                <Text style={[styles.ageText, { fontWeight: 'bold' }]}> {profile.company_name}</Text>
                
                <View style={styles.statsRow}>
                  <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('FollowListScreen', { type: 'followers', username: profile.user?.username })}>
                    <Text style={styles.statNumber}>{followerCount}</Text>
                    <Text style={styles.statLabel}>Người theo dõi</Text>
                  </TouchableOpacity>
                </View>

                {currentUser?.role === 'CANDIDATE' && (
                  <TouchableOpacity style={[styles.actionButton, isFollowing && { backgroundColor: '#E5E7EB', borderColor: 'transparent' }]} onPress={handleFollowToggle}>
                    <Text style={styles.actionButtonText}>{isFollowing ? 'Đang theo dõi ✓' : 'Theo dõi +'}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <View style={[styles.tabBarContainer, { marginBottom: 12 }]}>
                <TouchableOpacity style={[styles.tabItem, activeTab === 'tab1' && styles.activeTabItem]} onPress={() => setActiveTab('tab1')}>
                  <Text style={[styles.tabLabel, activeTab === 'tab1' && styles.activeTabLabel]}>Bài tuyển dụng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.tabItem, activeTab === 'tab2' && styles.activeTabItem]} onPress={() => setActiveTab('tab2')}>
                  <Text style={[styles.tabLabel, activeTab === 'tab2' && styles.activeTabLabel]}>Đánh giá</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
          
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 30, fontSize: 13 }}>Danh sách trống.</Text>
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