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

  const [listData, setListData] = useState([]); 
  const [page, setPage] = useState(1); 
  const [hasMore, setHasMore] = useState(true); 
  const [isInitialLoading, setIsInitialLoading] = useState(true); 
  const [isLoadingMore, setIsLoadingMore] = useState(false); 

  const [followerCount, setFollowerCount] = useState(0);
  useEffect(() => {
    api.get(`/employer-profiles/${profile.user?.username}/followers/`)
      .then(res => setFollowerCount(res.data?.count || 0))
      .catch(() => {});
  }, [profile.user?.username,isFocused]);

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
      
      setListData(prev => isRefresh ? newItems : [...prev, ...newItems]);
      
      setHasMore(responseData?.next !== null);
    } catch (err) {
      console.log("Lỗi tải danh sách phân trang:", err);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    setListData([]);
    setPage(1);
    setHasMore(true);
    loadData(1, true);
  }, [activeTab,isFocused]);

  const handleLoadMore = () => {
    if (!isInitialLoading && !isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false);
    }
  };

  const renderItemCard = ({ item, index }) => {
    if (activeTab === 'tab1') {
      return <JobCard item={item} />;
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
      
      <View style={[styles.headerContainer, { top: insets.top }]}>
        <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('SettingsScreen')}>
          <Ionicons name="settings-outline" size={22} color="#111111" />
        </TouchableOpacity>
        
        {profile.user?.avatar ? <Image source={{ uri: profile.user.avatar }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder}><Ionicons name="person" size={40} color="#9CA3AF" /></View>}
        <Text style={styles.name}>{profile.user?.name}</Text>
        <Text style={styles.username}>@{profile.user?.username}</Text>
        <Text style={styles.bioText}>{profile.company_description}</Text>
        <Text style={[styles.ageText, { fontWeight: 'bold' }]}> {profile.company_name || 'Chưa cập nhật tên công ty'}</Text>
        
        <View style={[styles.statsRow, { alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginBottom: 16 }]}>
          <TouchableOpacity 
            style={[styles.statItem, { alignItems: 'center', justifyContent: 'center', minHeight: 50 }]} 
            onPress={() => navigation.navigate('FollowListScreen', { type: 'followers', username: profile.user?.username })}
          >
            <Text style={[styles.statNumber, { fontSize: 18, fontWeight: 'bold', color: '#111111' }]}>{followerCount}</Text>
            <Text style={[styles.statLabel, { fontSize: 13, color: '#6B7280', marginTop: 4 }]}>Người theo dõi</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabBarContainer}>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'tab1' && styles.activeTabItem]} onPress={() => setActiveTab('tab1')}><Text style={[styles.tabLabel, activeTab === 'tab1' && styles.activeTabLabel]}>Bài tuyển dụng</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.tabItem, activeTab === 'tab2' && styles.activeTabItem]} onPress={() => setActiveTab('tab2')}><Text style={[styles.tabLabel, activeTab === 'tab2' && styles.activeTabLabel]}>Đánh giá</Text></TouchableOpacity>
      </View>

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
            
            ListHeaderComponent={
              activeTab === 'tab1' ? (
                <TouchableOpacity style={[styles.createCard, { marginBottom: 16 }]} onPress={() => navigation.navigate('CreateEditJobPostScreen')}>
                  <Ionicons name="add-circle-outline" size={20} color="#4B5563" />
                  <Text style={styles.createCardText}>Đăng bài tuyển dụng mới</Text>
                </TouchableOpacity>
              ) : null
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