import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../context/AuthContext'; 
import { profileServices } from '../../services/profileService';
import { globalStyles } from '../../constants/globalStyles';
import { styles } from './followStyle';

export default function FollowListScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useContext(AuthContext); 

  const { type, username } = route.params || {};
  const isFollowingMode = type === 'following'; 

  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const loadData = async (pageToLoad, isRefresh = false) => {
    if (pageToLoad === 1) setIsInitialLoading(true);
    else setIsLoadingMore(true);

    try {
      let responseData;
      if (isFollowingMode) {
        responseData = await profileServices.getFollowingList(username, pageToLoad);
      } else {
        responseData = await profileServices.getFollowersList(username, pageToLoad);
      }

      const newItems = responseData?.results || [];
      setListData(prev => isRefresh ? newItems : [...prev, ...newItems]);
      setHasMore(responseData?.next !== null);
    } catch (err) {
      console.log("Lỗi tải danh sách Follow:", err);
      if (err.response?.status === 404) setHasMore(false);
    } finally {
      setIsInitialLoading(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    if (username) {
      setListData([]);
      setPage(1);
      setHasMore(true);
      loadData(1, true);
    }
  }, [username, type]);

  const handleLoadMore = () => {
    if (!isInitialLoading && !isLoadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(nextPage, false);
    }
  };

  
  const handleFollowToggle = async (targetUsername, itemIndex) => {
    
    const previousStatus = listData[itemIndex].you_followed;

    
    setListData(prevData => {
      const newData = [...prevData];
      newData[itemIndex] = { ...newData[itemIndex], you_followed: !previousStatus };
      return newData;
    });

    try {
      
      await profileServices.followEmployer(targetUsername);
    } catch (err) {
      console.log("Lỗi Toggle Follow tại danh sách:", err);
      
      setListData(prevData => {
        const newData = [...prevData];
        newData[itemIndex] = { ...newData[itemIndex], you_followed: previousStatus };
        return newData;
      });
    }
  };

  const renderItem = ({ item, index }) => {
    const targetUser = item.user || {}; 
    const isEmployer = targetUser.role === 'EMPLOYER';
    
    return (
      <View style={styles.userRow}>
        
        
        <TouchableOpacity 
          style={styles.userInfoBtn}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('PublicProfileScreen', { username: targetUser.username, role: targetUser.role })}
        >
          {targetUser.avatar ? (
            <Image source={{ uri: targetUser.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color="#9CA3AF" />
            </View>
          )}
          
          <View style={{ flex: 1 }}>
            <View style={styles.nameRow}>
              <Text style={styles.name} numberOfLines={1}>{targetUser.name}</Text>
              <View style={[styles.roleBadge, { backgroundColor: isEmployer ? '#E0E7FF' : '#DCFCE7' }]}>
                <Text style={[styles.roleBadgeText, { color: isEmployer ? '#4338CA' : '#15803D' }]}>
                  {isEmployer ? 'Công ty' : 'Ứng viên'}
                </Text>
              </View>
            </View>
            
            <Text style={styles.username}>
              {isEmployer && item.followed?.company_name ? `🏢 ${item.followed.company_name}` : `@${targetUser.username}`}
            </Text>
          </View>
        </TouchableOpacity>

        
        
        {currentUser?.role === 'CANDIDATE' && isEmployer && (
          <TouchableOpacity 
            style={[styles.followBtn, item.you_followed && styles.followingBtn]}
            onPress={() => handleFollowToggle(targetUser.username, index)}
          >
            <Text style={[styles.followBtnText, item.you_followed && styles.followingBtnText]}>
              {item.you_followed ? 'Đang theo dõi ✓' : 'Theo dõi +'}
            </Text>
          </TouchableOpacity>
        )}

      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#111111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isFollowingMode ? 'Đang theo dõi' : 'Người theo dõi'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 16 }}>
        {isInitialLoading ? (
          <ActivityIndicator size="large" color="#111111" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) => item.id?.toString() || index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 14 }}>
                Danh sách trống.
              </Text>
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              isLoadingMore ? <ActivityIndicator size="small" color="#111111" style={{ marginVertical: 16 }} /> : null
            }
          />
        )}
      </View>
    </View>
  );
}