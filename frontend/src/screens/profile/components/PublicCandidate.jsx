import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { profileServices } from '../../../services/profileService';
import { formatDate } from '../../../utils/formatter';
import ReviewCard from './ReviewCard';
import api from '../../../services/api';
import { styles } from '../style';

export default function PublicCandidate({ profile, insets, isFocused }) {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('tab1');

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const [followingCount, setFollowingCount] = useState(0);
  useEffect(() => {
    if (profile.user?.username) {
      api.get(`/candidate-profiles/${profile.user.username}/following/`)
        .then(res => setFollowingCount(res.data?.count || 0))
        .catch(() => { });
    }
  }, [profile.user?.username, isFocused]);

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

  const renderItemCard = ({ item }) => {
    if (activeTab === 'tab1') {
      return (
        <TouchableOpacity onPress={() => navigation.navigate('ResumeDetailScreen', { resumeUuid: item.uuid })}>
          <View style={styles.itemCard}>
            <Text style={styles.itemTitle}>📄 {item.title}</Text>
            <Text style={styles.itemSubText}>Cập nhật: {formatDate(item.updated_date)}</Text>
          </View>
        </TouchableOpacity>
      );
    }
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
                <Text style={styles.bioText}>{profile.bio || 'Chưa cập nhật giới thiệu.'}</Text>
                <Text style={styles.ageText}>Khoảng {profile.approximate_age || 21} tuổi 🕵️‍♂️</Text>

                {/* ✅ CHIA ĐÔI MÀN HÌNH ĐỂ CÂN BẰNG TÂM TUYỆT ĐỐI */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 12, width: '100%' }}>
                  
                  {/* Nửa bên trái */}
                  <View style={{ flex: 1, alignItems: profile.is_owner ? 'center' : 'flex-end', paddingRight: profile.is_owner ? 0 : 12 }}>
                    <TouchableOpacity 
                      style={[styles.statItem, { alignItems: 'center', justifyContent: 'center', marginTop: 0, marginBottom: 0 }]} 
                      onPress={() => navigation.navigate('FollowListScreen', { type: 'following', username: profile.user?.username })}
                    >
                      <Text style={styles.statNumber}>{followingCount}</Text>
                      <Text style={styles.statLabel}>Đang theo dõi</Text>
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
                            name: profile.user?.name,
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

              </View>

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
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 30, fontSize: 13 }}>Không có dữ liệu công khai.</Text>}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}
          ListFooterComponent={renderFooterLoading}
          style={{ paddingHorizontal: 12 }}
        />
      )}
    </View>
  );
}