import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// ✅ ĐÃ SỬA: Import service chuẩn
import { profileServices } from '../../services/profileService'; 
import { globalStyles } from '../../constants/globalStyles';
import { styles } from './style'; 

export default function SearchScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const [listData, setListData] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    setListData([]);
    setPage(1);
    setHasMore(true);
    if (debouncedQuery.trim()) {
      fetchSearchResults(debouncedQuery, 1, true);
    }
  }, [debouncedQuery]);

  const fetchSearchResults = async (searchQuery, pageNum, isRefresh = false) => {
    if (isRefresh) setLoading(true);
    else setLoadingMore(true);

    try {
      // Gọi service lấy data đã được parse
      const responseData = await profileServices.searchUsers(searchQuery, pageNum);
      const newItems = responseData?.results || [];
      
      setListData(prev => isRefresh ? newItems : [...prev, ...newItems]);
      setHasMore(responseData?.next !== null);
    } catch (err) {
      console.log("Lỗi tìm kiếm:", err);
      if (err.response?.status === 404) setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore && debouncedQuery.trim()) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchSearchResults(debouncedQuery, nextPage, false);
    }
  };

  const renderItem = ({ item }) => {
    const isEmployer = item.role === 'EMPLOYER';
    
    return (
      <TouchableOpacity 
        style={styles.userRow}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('PublicProfileScreen', { username: item.username, role: item.role })}
      >
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={20} color="#9CA3AF" />
          </View>
        )}
        
        <View style={{ flex: 1 }}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
            <View style={[styles.roleBadge, { backgroundColor: isEmployer ? '#E0E7FF' : '#DCFCE7' }]}>
              <Text style={[styles.roleBadgeText, { color: isEmployer ? '#4338CA' : '#15803D' }]}>
                {isEmployer ? 'Công ty' : 'Ứng viên'}
              </Text>
            </View>
          </View>
          <Text style={styles.username}>@{item.username}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[globalStyles.container, { paddingTop: insets.top > 0 ? insets.top + 10 : 24 }]}>
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tìm kiếm</Text>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm theo username"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn}>
              <Ionicons name="close-circle" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.listContainer}>
        {!debouncedQuery.trim() ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#E5E7EB" />
            <Text style={styles.emptyText}>Nhập username để tìm kiếm người dùng</Text>
          </View>
        ) : loading ? (
          <ActivityIndicator size="large" color="#111111" style={{ marginTop: 40 }} />
        ) : (
          <FlatList
            data={listData}
            keyExtractor={(item, index) => item.username || index.toString()}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 14 }}>
                Không tìm thấy tài khoản nào phù hợp với "{debouncedQuery}"
              </Text>
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.2}
            ListFooterComponent={
              loadingMore ? <ActivityIndicator size="small" color="#111111" style={{ marginVertical: 16 }} /> : null
            }
          />
        )}
      </View>
    </View>
  );
}