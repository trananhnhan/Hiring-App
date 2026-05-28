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

export default function PublicEmployer({ profile, insets, isFocused }) {
  const navigation = useNavigation();
  const { user: currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('tab1');
  const [isFollowing, setIsFollowing] = useState(profile.you_followed || false);

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [followerCount, setFollowerCount] = useState(0);
  const fetchFollowerCount = () => {
    api.get(`/employer-profiles/${profile.user?.username}/followers/`)
      .then(res => setFollowerCount(res.data?.count || 0))
      .catch(() => {});
  };

  useEffect(() => {
    if (profile.user?.username) fetchFollowerCount();
  }, [profile.user?.username, isFocused]);

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
      console.log("Lỗi tải phân trang:", err);
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
  }, [activeTab, profile.user?.username, isFocused]);

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
      setTimeout(() => fetchFollowerCount(), 200);
    } catch (err) {
      console.log("Lỗi follow:", err);
    }
  };

  const renderItemCard = ({ item }) => {
    if (activeTab === 'tab1') return <JobCard item={item} />;
    return <ReviewCard item={item} />;
  };

  const renderFooterLoading = () => {
    if (!isLoadingMore) return <View style={{ height: 40 }} />;
    return <View style={{ paddingVertical: 16, alignItems: 'center' }}><ActivityIndicator size="small" color="#111111" /></View>;
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
                
                {/* ✅ KHU VỰC ĐIỀU HƯỚNG HIỂN THỊ DỰA TRÊN ROLE */}
                <View style={{ marginTop: 12, alignItems: 'center' }}>
                  
                  {currentUser?.role === 'CANDIDATE' && !profile.is_owner ? (
                    // TRƯỜNG HỢP 1: Ứng viên xem Doanh nghiệp -> Đếm ở trên, 2 Nút ở dưới
                    <>
                      <TouchableOpacity 
                        style={[styles.statItem, { marginBottom: 12, alignItems: 'center' }]} 
                        onPress={() => navigation.navigate('FollowListScreen', { type: 'followers', username: profile.user?.username })}
                      >
                        <Text style={styles.statNumber}>{followerCount}</Text>
                        <Text style={styles.statLabel}>Người theo dõi</Text>
                      </TouchableOpacity>

                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity 
                          style={[styles.actionButton, { marginRight: 8, height: 40, paddingHorizontal: 16, borderRadius: 20, justifyContent: 'center' }, isFollowing && { backgroundColor: '#E5E7EB', borderColor: 'transparent' }]} 
                          onPress={handleFollowToggle}
                        >
                          <Text style={styles.actionButtonText}>{isFollowing ? 'Đang theo dõi ✓' : 'Theo dõi +'}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity 
                          style={[styles.actionButton, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6', borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 40, borderRadius: 20 }]} 
                          onPress={() => navigation.navigate('ChatDetailScreen', {
                            targetUser: {
                              username: profile.user?.username,
                              name: `${profile.user?.name} (${profile.company_name})`,
                              avatar: profile.user?.avatar || 'https://via.placeholder.com/150'
                            }
                          })}
                        >
                          <Ionicons name="chatbubble-ellipses-outline" size={20} color="#3B82F6" />
                          <Text style={{ color: '#3B82F6', marginLeft: 8, fontWeight: 'bold' }}>Nhắn tin</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    // TRƯỜNG HỢP 2: Employer xem Employer, hoặc Tự xem trang cá nhân -> Cùng 1 hàng ngang - CHIA ĐÔI TÂM TUYỆT ĐỐI
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      
                      {/* Nửa bên trái */}
                      <View style={{ flex: 1, alignItems: profile.is_owner ? 'center' : 'flex-end', paddingRight: profile.is_owner ? 0 : 12 }}>
                        <TouchableOpacity 
                          style={[styles.statItem, { alignItems: 'center', justifyContent: 'center', marginTop: 0, marginBottom: 0 }]} 
                          onPress={() => navigation.navigate('FollowListScreen', { type: 'followers', username: profile.user?.username })}
                        >
                          <Text style={styles.statNumber}>{followerCount}</Text>
                          <Text style={styles.statLabel}>Người theo dõi</Text>
                        </TouchableOpacity>
                      </View>

                      {/* Nửa bên phải */}
                      {!profile.is_owner && (
                        <View style={{ flex: 1, alignItems: 'flex-start', paddingLeft: 12 }}>
                          <TouchableOpacity 
                            style={[styles.actionButton, { backgroundColor: '#EFF6FF', borderColor: '#3B82F6', borderWidth: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 40, borderRadius: 20, marginTop: 0, marginBottom: 0 }]} 
                            onPress={() => navigation.navigate('ChatDetailScreen', {
                              targetUser: {
                                username: profile.user?.username,
                                name: `${profile.user?.name} (${profile.company_name})`,
                                avatar: profile.user?.avatar || 'https://via.placeholder.com/150'
                              }
                            })}
                          >
                            <Ionicons name="chatbubble-ellipses-outline" size={20} color="#3B82F6" />
                            <Text style={{ color: '#3B82F6', marginLeft: 8, fontWeight: 'bold' }}>Nhắn tin</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  )}

                </View>

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
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 30, fontSize: 13 }}>Danh sách trống.</Text>}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooterLoading}
          style={{ paddingHorizontal: 12 }}
        />
      )}
    </View>
  );
}