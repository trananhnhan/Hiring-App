import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { profileServices } from '../../../services/profileService';
import { globalStyles } from '../../../constants/globalStyles'; 
import { formatDate } from '../../../utils/formatter';
import ReviewCard from './ReviewCard';
import api from '../../../services/api';
import { styles } from '../style';

export default function OwnerCandidate({ profile, insets }) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('tab1');

  // --- HỆ THỐNG STATE QUẢN LÝ PHÂN TRANG VÔ HẠN ---
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Lấy số lượng Đang theo dõi ở khối Header
  const [followingCount, setFollowingCount] = useState(0);
  useEffect(() => {
    api.get(`/candidate-profiles/${profile.user?.username}/following/`)
      .then(res => setFollowingCount(res.data?.count || 0))
      .catch(() => {});
  }, [profile.user?.username]);

  // Hàm cốt lõi chịu trách nhiệm bốc dữ liệu theo trang và nối mảng động theo từng Tab
  const loadData = async (pageToLoad, isRefresh = false) => {
    if (pageToLoad === 1) setIsInitialLoading(true);
    else setIsLoadingMore(true);

    try {
      let responseData;
      if (activeTab === 'tab1') {
        responseData = await profileServices.getMyResumes(pageToLoad);
      } else if (activeTab === 'tab2') {
        responseData = await profileServices.getMyApplications(pageToLoad);
      } else {
        responseData = await profileServices.getPublicCandidateComments(profile.user?.username, pageToLoad);
      }

      const newItems = responseData?.results || [];
      
      // Nối mảng cộng dồn nếu cuộn xuống, hoặc thay mới hoàn toàn nếu đổi Tab / Refresh
      setListData(prev => isRefresh ? newItems : [...prev, ...newItems]);
      setHasMore(responseData?.next !== null);
    } catch (err) {
      console.log("Lỗi tải phân trang Candidate:", err);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Kích hoạt reset và tải lại từ đầu mỗi khi ứng viên bấm chuyển Tab con
  useEffect(() => {
    setListData([]);
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  }, [activeTab]);

  // Nhận diện chạm đáy để tăng page và kích nạp trang tiếp theo
  const handleLoadMore = () => {
    if (!isInitialLoading && !isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false);
    }
  };

  // Hàm Render thẻ Card thông minh phân rã theo loại dữ liệu của từng Tab
  const renderItemCard = ({ item, index }) => {
    // TAB 1: DANH SÁCH HỒ SƠ CV
    if (activeTab === 'tab1') {
      let badgeStyle = styles.badgePublic;
      if (item.status === 'DRAFT') badgeStyle = styles.badgeDraft;
      if (item.status === 'PRIVATE') badgeStyle = styles.badgePrivate;
      return (
        <View style={styles.itemCard}>
          <Text style={styles.itemTitle}>📄 {item.title}</Text>
          <View style={styles.cardFooterRow}>
            <Text style={styles.itemSubText}>Cập nhật: {formatDate(item.updated_date)}</Text>
            <View style={[styles.badgeBase, badgeStyle]}><Text style={styles.badgeTextWhite}>{item.status}</Text></View>
          </View>
        </View>
      );
    }

    // TAB 2: DANH SÁCH ĐƠN ỨNG TUYỂN (CÓ CHỨA TRANG PHÂN KỲ)
    if (activeTab === 'tab2') {
      const resultColors = { 'PENDING': '#F59E0B', 'ACCEPTED': '#10B981', 'REJECTED': '#EF4444' };
      const resultTexts = { 'PENDING': 'Đang chờ duyệt', 'ACCEPTED': 'Đã trúng tuyển', 'REJECTED': 'Từ chối' };

      return (
        <View style={styles.itemCard}>
          <TouchableOpacity onPress={() => navigation.navigate('JobDetail', { jobUuid: item.job_post?.uuid })}>
            <Text style={[styles.itemTitle, { color: '#3B82F6' }]}>💼 {item.job_post?.title}</Text>
          </TouchableOpacity>
          <Text style={styles.itemSubText}>🏢 {item.employer_profile?.company_name}</Text>
          <View style={styles.cardFooterRow}>
            <Text style={styles.itemSubText}>📅 Nộp ngày: {formatDate(item.created_date)}</Text>
            <View style={[globalStyles.chip, { backgroundColor: resultColors[item.result] || '#G6G6G6', borderColor: 'transparent' }]}>
              <Text style={[globalStyles.chipText, { color: '#FFFFFF' }]}>{resultTexts[item.result] || item.result}</Text>
            </View>
          </View>
        </View>
      );
    }

    // TAB 3: DANH SÁCH ĐÁNH GIÁ NHẬN ĐƯỢC
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
      {/* KHỐI ĐỈNH HEADER PROFILE */}
      <View style={[styles.headerContainer, { top: insets.top }]}>
        <TouchableOpacity style={[styles.settingsButton, { top: insets.top -50 }]} onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings-outline" size={22} color="#111111" />
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
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfileForm')}><Text style={styles.actionButtonText}>Chỉnh sửa hồ sơ</Text></TouchableOpacity>
      </View>

      {/* THANH ĐIỀU HƯỚNG TABS CON */}
      <View style={styles.tabBarContainer}>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'tab1' && styles.activeTabItem]} onPress={() => setActiveTab('tab1')}><Text style={[styles.tabLabel, activeTab === 'tab1' && styles.activeTabLabel]}>Hồ sơ CV</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'tab2' && styles.activeTabItem]} onPress={() => setActiveTab('tab2')}><Text style={[styles.tabLabel, activeTab === 'tab2' && styles.activeTabLabel]}>Đơn ứng tuyển</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'tab3' && styles.activeTabItem]} onPress={() => setActiveTab('tab3')}><Text style={[styles.tabLabel, activeTab === 'tab3' && styles.activeTabLabel]}>Đánh giá</Text></TouchableOpacity>
      </View>

      {/* KHỐI NỘI DUNG FLATLIST INFINITE SCROLL */}
      <View style={styles.tabContentContainer}>
        {isInitialLoading ? (
          <ActivityIndicator size="small" color="#111111" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) => item.uuid || item.id?.toString() || index.toString()}
            renderItem={renderItemCard}
            showsVerticalScrollIndicator={false}
            
            // Đẩy nút tạo CV lên đầu danh sách của Tab 1
            ListHeaderComponent={
              activeTab === 'tab1' ? (
                <TouchableOpacity style={[styles.createCard, { marginBottom: 16 }]} onPress={() => navigation.navigate('CreateResumeForm')}>
                  <Ionicons name="add-circle-outline" size={20} color="#4B5563" />
                  <Text style={styles.createCardText}>Tạo CV mới</Text>
                </TouchableOpacity>
              ) : null
            }
            
            ListEmptyComponent={
              activeTab !== 'tab1' ? <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 20, fontSize: 13 }}>Danh sách trống.</Text> : null
            }
            
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={renderFooterLoading}
          />
        )}
      </View>
    </View>
  );
}