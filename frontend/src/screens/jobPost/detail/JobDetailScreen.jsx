import React, { useEffect, useContext } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

import { AuthContext } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { globalStyles } from '../../../constants/globalStyles';
import { jobServices } from '../../../services/jobService';
import { COLORS } from '../../../constants/theme';
import { styles } from './style';

import { 
  formatSalaryDisplay, 
  formatDate, 
  getSortedWorkDays, 
  translateDay, 
  formatTime, 
  formatArea 
} from '../../../utils/formatter';

export default function JobDetailScreen() {
  const isFocused = useIsFocused();
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useContext(AuthContext); 
  const { jobUuid } = route.params || {};

  const { data: job, loading, error, execute: fetchJobDetail } = useApi(jobServices.getJobPostDetail);

  useEffect(() => {
    if (jobUuid && isFocused) { 
      fetchJobDetail(jobUuid);
    }
  }, [jobUuid, isFocused]);

  if (loading) {
    return (
      <View style={[globalStyles.container, globalStyles.centerAll]}>
        <ActivityIndicator size="large" color={COLORS.primary || '#111111'} />
      </View>
    );
  }

  if (error || !job) {
    return (
      <View style={[globalStyles.container, globalStyles.centerAll, { padding: 20 }]}>
        <Ionicons name="alert-circle-outline" size={64} color={COLORS.error || '#EF4444'} />
        <Text style={[globalStyles.bodyText, { marginTop: 10, textAlign: 'center' }]}>
          {typeof error === 'string' ? error : 'Bài tuyển dụng không tồn tại.'}
        </Text>
        <TouchableOpacity style={[globalStyles.chip, { marginTop: 20 }]} onPress={() => navigation.goBack()}>
          <Text style={globalStyles.chipText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sortedWorkDays = getSortedWorkDays(job.work_days);

  const renderStatusBadge = () => {
    switch (job.status) {
      case 'OPEN':
        return <View style={globalStyles.statusOpenBadgeContainer}><Text style={globalStyles.statusBadgeText}>Đang tuyển</Text></View>;
      case 'CLOSED':
        return <View style={globalStyles.statusClosedBadgeContainer}><Text style={globalStyles.statusBadgeText}>Đã đóng</Text></View>;
      case 'DRAFT':
        return <View style={globalStyles.statusDraftBadgeContainer}><Text style={globalStyles.statusBadgeText}>Bản nháp</Text></View>;
      default:
        return null;
    }
  };

  const renderBottomStickyBar = () => {
    if (job.is_owner === true) {
      if (job.status === 'CLOSED') {
        return (
          <View style={styles.bottomStickyBar}>
            <TouchableOpacity 
              style={[styles.btnFullWidth, { backgroundColor: COLORS.textPrimary || '#111111' }]}
              onPress={() => navigation.navigate('JobApplicationsListScreen', { jobUuid: job.uuid })}
            >
              <Text style={styles.btnTextWhite}>Xem danh sách đơn ứng tuyển ({job.application_count})</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={styles.bottomStickyBar}>
            <TouchableOpacity style={styles.btnWidth35} onPress={() => navigation.navigate('CreateEditJobPostScreen', { jobUuid: job.uuid })}>
              <Text style={styles.btnTextBlack}>Chỉnh sửa ✏️</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnWidth65} onPress={() => navigation.navigate('JobApplicationsListScreen', { jobUuid: job.uuid })}>
              <Text style={styles.btnTextWhite}>Xem đơn ứng tuyển ({job.application_count})</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }

    if (currentUser?.role === 'EMPLOYER' && job.is_owner !== true) {
      return (
        <View style={styles.bottomStickyBar}>
          <View style={styles.employerNoticeBox}>
            <Text style={styles.employerNoticeText}>Bạn đang xem bài đăng với tư cách Nhà tuyển dụng khác</Text>
          </View>
        </View>
      );
    }

    if (job.is_applied?.applied === true) {
      return (
        <View style={styles.bottomStickyBar}>
          <TouchableOpacity 
            style={[styles.btnFullWidth, { backgroundColor: '#3B82F6' }]} 
            onPress={() => navigation.navigate('ApplicationDetailScreen', { applicationUuid: job.is_applied.uuid })}
          >
            <Text style={styles.btnTextWhite}>Xem đơn ứng tuyển của bạn</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      if (job.status === 'OPEN') {
        return (
          <View style={styles.bottomStickyBar}>
            <TouchableOpacity 
              style={styles.btnChatSmall} 
              onPress={() => navigation.navigate('ChatDetailScreen', {
                targetUser: {
                  username: job.user?.username,
                  name: job.employer_profile?.company_name 
                    ? `${job.user?.name} (${job.employer_profile.company_name})` 
                    : job.user?.name || 'Nhà tuyển dụng',
                  avatar: job.user?.avatar || 'https://via.placeholder.com/150'
                }
              })}
            >
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={COLORS.textPrimary || '#111111'} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.btnWidth65, { flex: 1 }]} onPress={() => navigation.navigate('ApplyJobScreen', { jobUuid: job.uuid, jobTitle : job.title,companyName : job.employer_profile.company_name })}>
              <Text style={styles.btnTextWhite}>Ứng tuyển ngay 🔥</Text>
            </TouchableOpacity>
          </View>
        );
      } else {
        return (
          <View style={styles.bottomStickyBar}>
            <TouchableOpacity disabled style={[styles.btnFullWidth, { backgroundColor: '#9CA3AF' }]}>
              <Text style={styles.btnTextWhite}>Đã đóng tuyển dụng</Text>
            </TouchableOpacity>
          </View>
        );
      }
    }
  };

  return (
    <View style={globalStyles.container}>
      
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingBottom: 120 }]} showsVerticalScrollIndicator={false}>
        
        <View style={styles.bannerContainer}>
          <TouchableOpacity 
            style={[styles.backButton, { top: insets.top - 6 }]} 
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color="#ffffffb3" />
          </TouchableOpacity>
          {job.job_thumbnail ? (
            <Image source={{ uri: job.job_thumbnail }} style={styles.bannerImage} />
          ) : (
            <View style={[styles.bannerImage, { backgroundColor: '#E5E7EB' }]} />
          )}
        </View>

        <View style={styles.headerContent}>
          <View style={styles.titleContainer}>
            <Text style={styles.jobTitle}>{job.title}</Text>
            {renderStatusBadge()}
          </View>
          <Text style={styles.companyName}>🏢 {job.employer_profile?.company_name}</Text>
          
          {job.career_fields && job.career_fields.length > 0 && (
            <View style={globalStyles.chipContainer}>
              {job.career_fields.map((field) => (
                <View key={field.id} style={globalStyles.chip}>
                  <Text style={globalStyles.chipText}>🏷️ {field.field_name}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Địa điểm làm việc</Text>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Khu vực:</Text>
            <Text style={styles.addressValue}>{formatArea(job.address)}</Text>
          </View>
          <View style={styles.addressRow}>
            <Text style={styles.addressLabel}>Địa chỉ cụ thể:</Text>
            <Text style={styles.addressValue}>{job.address?.full_address || 'Chưa cập nhật cụ thể'}</Text>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thông tin tổng quan</Text>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem}>
              <Text style={{ fontSize: 20 }}>💰</Text>
              <View>
                <Text style={styles.gridLabel}>Mức lương</Text>
                <Text style={styles.gridValue}>{formatSalaryDisplay(job.salary_min, job.salary_max)}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Text style={{ fontSize: 20 }}>📅</Text>
              <View>
                <Text style={styles.gridLabel}>Hạn nộp hồ sơ</Text>
                <Text style={styles.gridValue}>{formatDate(job.expiry_date) || 'N/A'}</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Text style={{ fontSize: 20 }}>👥</Text>
              <View>
                <Text style={styles.gridLabel}>Số lượng tuyển</Text>
                <Text style={styles.gridValue}>{job.slot} vị trí</Text>
              </View>
            </View>
            <View style={styles.gridItem}>
              <Text style={{ fontSize: 20 }}>📝</Text>
              <View>
                <Text style={styles.gridLabel}>Lượt ứng tuyển</Text>
                <Text style={styles.gridValue}>{job.application_count} người</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Thời gian và Lịch làm việc</Text>
          {sortedWorkDays.length > 0 ? (
            sortedWorkDays.map((day) => (
              <View key={day.id} style={styles.scheduleRow}>
                <Text style={styles.scheduleDay}>{translateDay(day.day_of_week)}</Text>
                <View style={styles.scheduleTimeContainer}>
                  <Text style={styles.scheduleTimeText}>
                    🕒 Làm việc: {formatTime(day.work_start)} - {formatTime(day.work_end)}
                  </Text>
                  <Text style={styles.scheduleTimeText}>
                    🥪 Nghỉ trưa: {formatTime(day.break_start)} - {formatTime(day.break_end)}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={globalStyles.bodyText}>Chưa cập nhật lịch làm việc.</Text>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Mô tả công việc</Text>
          <Text style={styles.descriptionText} selectable={true}>
            {job.description || 'Chưa có thông tin mô tả cụ thể từ nhà tuyển dụng.'}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Người đăng tin tuyển dụng</Text>
          <TouchableOpacity 
            style={styles.recruiterCard}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PublicProfileScreen', { username: job.user?.username })}
          >
            {job.user?.avatar ? (
              <Image source={{ uri: job.user.avatar }} style={styles.recruiterAvatar} />
            ) : (
              <View style={[styles.recruiterAvatar, { backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="person" size={22} color="#9CA3AF" />
              </View>
            )}
            <View style={styles.recruiterInfo}>
              <Text style={styles.recruiterName}>{job.user?.name || 'Chưa cập nhật tên'}</Text>
              <Text style={styles.recruiterEmail}>✉️ {job.user?.email || 'N/A'}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.border || '#E5E7EB'} />
          </TouchableOpacity>
        </View>

      </ScrollView>

      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        {renderBottomStickyBar()}
      </View>

    </View>
  );
}