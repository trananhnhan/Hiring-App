import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { profileServices } from '../../../services/profileService';
import JobCard from './JobCard';
import ReviewCard from './ReviewCard';
import api from '../../../services/api';
import { styles } from '../style';

export default function OwnerEmployer({ profile, insets, isFocused }) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('tab1');

  // --- HỆ THỐNG STATE QUẢN LÝ PHÂN TRANG (PAGINATION STATES) ---
  const [listData, setListData] = useState([]); // Mảng tổng hợp lưu trữ dữ liệu cộng dồn qua các trang
  const [page, setPage] = useState(1); // Theo dõi số trang hiện tại
  const [hasMore, setHasMore] = useState(true); // Cờ báo hiệu Backend còn trang kế tiếp hay không
  const [isInitialLoading, setIsInitialLoading] = useState(true); // Loading xoay vòng lúc đổi Tab
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Loading nhỏ xuất hiện ở đáy khi đang tải trang tiếp theo

  // 1. Lấy số lượng Người theo dõi ở khối Header
  const [followerCount, setFollowerCount] = useState(0);
  useEffect(() => {
    api.get(`/employer-profiles/${profile.user?.username}/followers/`)
      .then(res => setFollowerCount(res.data?.count || 0))
      .catch(() => {});
  }, [profile.user?.username,isFocused]);

  // 2. Hàm cốt lõi chịu trách nhiệm bốc dữ liệu theo trang và nối mảng
  const loadData = async (pageToLoad, isRefresh = false) => {
    if (pageToLoad === 1) setIsInitialLoading(true);
    else setIsLoadingMore(true);

    try {
      let responseData;
      if (activeTab === 'tab1') {
        responseData = await profileServices.getMyJobPosts(pageToLoad);
      } else {
        responseData = await profileServices.getPublicEmployerComments(profile.user?.username, pageToLoad);
      }

      const newItems = responseData?.results || [];
      
      // Nếu là đổi Tab hoặc kéo làm mới -> Thay thế mảng cũ. Nếu là cuộn xuống -> Nối mảng (Concat)
      setListData(prev => isRefresh ? newItems : [...prev, ...newItems]);
      
      // Kiểm tra xem trường 'next' từ Backend trả về có URL không để quyết định bật/tắt cờ hasMore
      setHasMore(responseData?.next !== null);
    } catch (err) {
      console.log("Lỗi tải danh sách phân trang:", err);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Mỗi khi người dùng bấm chuyển đổi Tab -> Reset toàn bộ thông số phân trang về mặc định
  useEffect(() => {
    setListData([]);
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  }, [activeTab,isFocused]);

  // Hàm kích hoạt khi người dùng cuộn xuống đáy danh sách
  const handleLoadMore = () => {
    if (!isInitialLoading && !isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false);
    }
  };

  // Render các item theo từng loại Tab
  const renderItemCard = ({ item, index }) => {
    if (activeTab === 'tab1') {
      return <JobCard item={item} />;
    }
    return <ReviewCard item={item} />;
  };

  // Khối giao diện Footer hiển thị vòng xoay nhỏ khi đang tải trang tiếp theo ở đáy
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
      {/* KHỐI ĐỈNH HEADER PROFILE (Giữ nguyên giao diện chuẩn của bồ) */}
      <View style={[styles.headerContainer, { top: insets.top  }]}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings-outline" size={22} color="#111111" />
        </TouchableOpacity>
        
        {profile.user?.avatar ? <Image source={{ uri: profile.user.avatar }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder}><Ionicons name="person" size={40} color="#9CA3AF" /></View>}
        <Text style={styles.name}>{profile.user?.name}</Text>
        <Text style={styles.username}>@{profile.user?.username}</Text>
        <Text style={styles.bioText}>{profile.company_description}</Text>
        <Text style={[styles.ageText, { fontWeight: 'bold' }]}> {profile.company_name || 'Chưa cập nhật tên công ty'}</Text>
        
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('FollowListScreen', { type: 'followers', username: profile.user?.username })}>
            <Text style={styles.statNumber}>{followerCount}</Text>
            <Text style={styles.statLabel}>Người theo dõi</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.actionButton} onPress={() => navigation.navigate('EditProfileForm')}><Text style={styles.actionButtonText}>Chỉnh sửa hồ sơ</Text></TouchableOpacity>
      </View>

      {/* THANH ĐIỀU HƯỚNG TABS CON */}
      <View style={styles.tabBarContainer}>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'tab1' && styles.activeTabItem]} onPress={() => setActiveTab('tab1')}><Text style={[styles.tabLabel, activeTab === 'tab1' && styles.activeTabLabel]}>Bài tuyển dụng</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'tab2' && styles.activeTabItem]} onPress={() => setActiveTab('tab2')}><Text style={[styles.tabLabel, activeTab === 'tab2' && styles.activeTabLabel]}>Đánh giá</Text></TouchableOpacity>
      </View>

      {/* KHỐI HIỂN THỊ NỘI DUNG ĐÃ ĐƯỢC ĐẠI TU SANG FLATLIST INFINITE SCROLL */}
      <View style={styles.tabContentContainer}>
        {profile.is_verified === false ? (
          <View style={styles.unverifiedBox}>
            <Ionicons name="lock-closed-outline" size={48} color="#9CA3AF" />
            <Text style={styles.unverifiedText}>Tài khoản chưa được xác thực. Vui lòng gửi đơn xác thực để sử dụng tính năng.</Text>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#111111' }]} onPress={() => navigation.navigate('VerificationForm')}><Text style={{ color: '#FFFFFF', fontWeight: 'bold' }}>Xác thực ngay 🚀</Text></TouchableOpacity>
          </View>
        ) : isInitialLoading ? (
          <ActivityIndicator size="small" color="#111111" style={{ marginTop: 20 }} />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) => item.uuid || item.id?.toString() || index.toString()}
            renderItem={renderItemCard}
            showsVerticalScrollIndicator={false}
            
            // ✅ ĐẨY NÚT TẠO MỚI LÊN ĐẦU DANH SÁCH THÔNG QUA ListHeaderComponent
            ListHeaderComponent={
              activeTab === 'tab1' ? (
                <TouchableOpacity style={[styles.createCard, { marginBottom: 16 }]} onPress={() => navigation.navigate('CreateEditJobPostScreen')}>
                  <Ionicons name="add-circle-outline" size={20} color="#4B5563" />
                  <Text style={styles.createCardText}>Đăng bài tuyển dụng mới</Text>
                </TouchableOpacity>
              ) : null
            }
            
            // ✅ ĐIỀU KIỆN CHẠM ĐÁY ĐỂ LOAD THÊM TRANG 2, TRANG 3...
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2} // Khi cuộn còn cách đáy 20% chiều cao danh sách thì bắt đầu kích hoạt lấy trang mới
            ListFooterComponent={renderFooterLoading} // Hiển thị icon xoay nhỏ ở đáy lúc chờ nạp data mới
          />
        )}
      </View>
    </View>
  );
}