import React, { useEffect, useRef, useState } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { globalStyles } from '../../../constants/globalStyles';
import { AppScreenWrapper } from '../../../components/AppScreenWrapper';
import { SPACING, COLORS } from '../../../constants/theme';
import { styles } from './style';

import { formatMoney, formatSalaryDisplay, formatDate } from '../../../utils/formatter'
import { useApi } from '../../../hooks/useApi';
import { jobServices } from '../../../services/jobService';
import { JobStatFooter } from '../../../components/JobStatFooter';
import { AppInput } from '../../../components/AppInput';
import { FilterModal } from '../../../components/FilterModal';
import { TextInput } from 'react-native-paper';
import JobDetailScreen from '../detail/JobDetailScreen';
// Component JobCard
const JobCard = ({ item }) => {
  const navigation = useNavigation()
  return (
    // Dùng globalStyles.card cũ, cần thêm {position: 'relative'} để Badge top-right hoạt động
    <TouchableOpacity 
    style={[globalStyles.card, { position: 'relative' }]} 
    activeOpacity={0.8}
    onPress={() => navigation.navigate('JobDetail', { jobUuid: item.uuid })}
    >

      {/* 1. STATUS BADGE (Top-Right) - Dùng style mới từ globalStyles */}
      {item.status === 'OPEN' && (
        <View style={globalStyles.statusOpenBadgeContainer}>
          <Text style={globalStyles.statusBadgeText}>OPEN</Text>
        </View>
      )}
      {item.status === 'CLOSED' && (
        <View style={globalStyles.statusClosedBadgeContainer}>
          <Text style={globalStyles.statusBadgeText}>CLOSED</Text>
        </View>
      )}
      {item.status === 'DRAFT' && (
        <View style={globalStyles.statusDraftBadgeContainer}>
          <Text style={globalStyles.statusBadgeText}>DRAFT</Text>
        </View>
      )}

      {/* 2. Top Info Group (Logo + Text) - Cần Overwrite InfoWrapper style để tránh đè Badge */}
      <View style={[globalStyles.rowCenter, { alignItems: 'flex-start' }]}>
        <View style={styles.logoWrapper}>
          {item.job_thumbnail ? (
            <Image source={{ uri: item.job_thumbnail }} style={styles.logoImage} />
          ) : (
            <View style={[styles.logoImage, styles.logoPlaceholder]}>
              <Text style={styles.placeholderText}>
                {item.employer_profile?.company_name?.charAt(0).toUpperCase() || 'J'}
              </Text>
            </View>
          )}
        </View>

        {/* Tăng right padding cho text để chừa chỗ cho Badge OPEN lỡ JobTitle dài */}
        <View style={[styles.infoWrapper, { paddingRight: 60 }]}>
          <Text style={styles.companyName} numberOfLines={1}>
            {item.employer_profile?.company_name}
          </Text>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
      </View>


      {/* 3. Middle Chips */}
      <View style={globalStyles.chipContainer}>
        <View style={globalStyles.chip}>
          <Text style={globalStyles.chipText}>
            💰 {formatSalaryDisplay(item.salary_min, item.salary_max)}
          </Text>
        </View>
        <View style={globalStyles.chip}>
          <Text style={globalStyles.chipText} numberOfLines={1}>
            📍 {item.address?.full_address || 'N/A'}
          </Text>
        </View>
      </View>

      {/* 4. FOOTER */}
      {/* Truyền các props cần thiết từ JSON item */}
      <JobStatFooter
        expiryDate={item.expiry_date}
        slot={item.slot}
        applicationCount={item.application_count}
      />
    </TouchableOpacity>
  );
};


export default function FeedScreen() {
  const route = useRoute(); 
  const { feedType } = route.params || { feedType: 'global' };
  const isFocused = useIsFocused();
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [error, setError] = useState(null);

 
  const [searchInput, setSearchInput] = useState('');
  const [activeFilters, setActiveFilters] = useState({});
  const [isFilterVisible, setIsFilterVisible] = useState(false);

  const [isFirstLoading, setIsFirstLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Cờ theo dõi lần render đầu tiên
  const isMounted = useRef(false);

  const fetchJobs = async (pageNumber = 1, type = 'init', searchKeyword = '', filterParams = {}) => {
    try {
      if (type === 'init'){
        if (jobs.length === 0){
         setIsFirstLoading(true);
        } else{
          setIsRefreshing(true);
        }
      }
      if (type === 'refresh') setIsRefreshing(true);
      if (type === 'loadMore') setIsLoadingMore(true);
      setError(null);

      const apiParams = {
        ...(searchKeyword ? { search: searchKeyword } : {}),
        ...filterParams,
      };
      
      delete apiParams.parent_career_id;
      const getApiMethod = (type) => {
        switch (type) {
          case 'followed': return jobServices.getFollowedJobPosts;
          case 'my_jobs': return jobServices.getEmployerJobPosts;
          default: return jobServices.getGlobalJobPosts;
        }
      };
      const apiMethod = getApiMethod(feedType);
      const response = await apiMethod(pageNumber, apiParams);

      if (pageNumber === 1) {
        setJobs(response.results);
      } else {
        setJobs(prev => [...prev, ...response.results]);
      }

      setHasNext(response.next !== null);
      setPage(pageNumber);

    } catch (err) {
      setError(err.response?.data?.detail || "Lỗi tải dữ liệu");
    } finally {
      setIsFirstLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };


  useEffect(() => {
    // 1. Lần đầu vào app -> Gọi API luôn không cần chờ
    if (!isMounted.current) {
      fetchJobs(1, 'init', searchInput, activeFilters);
      isMounted.current = true;
      return;
    }


    const timeoutId = setTimeout(() => {
      fetchJobs(1, 'init', searchInput, activeFilters);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput,isFocused]); 



  const handleRefresh = () => fetchJobs(1, 'refresh', searchInput, activeFilters);
  const handleLoadMore = () => {
    if (hasNext && !isLoadingMore && !isFirstLoading && jobs.length > 0) {
      fetchJobs(page + 1, 'loadMore', searchInput, activeFilters);
    }
  };

  // --- UI HEADER ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>

      <AppInput
        label="Tìm kiếm công việc..."
        value={searchInput}
        onChangeText={setSearchInput}
        style={styles.searchInputWrapper} // Truyền style đè marginBottom
        left={<TextInput.Icon icon="magnify" color={COLORS.textSecondary} />}
      />

      {/* Nút Bộ lọc */}
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setIsFilterVisible(true)} // MỞ MODAL
      >
        <Text style={styles.filterButtonText}>Bộ lọc</Text>
      </TouchableOpacity>
    </View>
  );

  if (isFirstLoading && jobs.length === 0) {
    return (

      <View style={{ padding: SPACING.md, flex: 1 }}>
        {renderHeader()}
        <View style={globalStyles.centerAll}>
          <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
        </View>
      </View>

    );
  }

  return (
    <View style={globalStyles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.uuid}
        ListHeaderComponent={renderHeader()}
        renderItem={({ item }) => <JobCard item={item} />}
        contentContainerStyle={{ padding: SPACING.md, paddingBottom: SPACING.xxl }}
        showsVerticalScrollIndicator={false}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => (
          isLoadingMore ? <ActivityIndicator size="small" color={COLORS.primary} style={{ margin: 20 }} /> : null
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text style={globalStyles.bodyText}>Không tìm thấy công việc phù hợp.</Text>
          </View>
        )}
      />
      <FilterModal
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        currentFilters={activeFilters}
        onApply={(newFilters) => {
          setActiveFilters(newFilters);
          fetchJobs(1, 'init', searchInput, newFilters);
        }}
      />
    </View>

  );
}