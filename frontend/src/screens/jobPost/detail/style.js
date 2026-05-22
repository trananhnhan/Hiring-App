import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Màu nền lấy từ theme của bạn, dùng globalStyles.container ở file JSX
  },
  scrollContent: {
    paddingBottom: 120, // Chừa khoảng trống dưới đáy để không bị thanh Bottom Bar che
  },
  
  // Khối 1: Banner ảnh
  bannerContainer: {
    position: 'relative',
    width: '100%',
    height: 220,
    backgroundColor: COLORS.surface || '#F3F4F6',
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // --- ✅ CHỖ SỬA 1: Sửa lại vị trí Back Button để không bị đè notch ---
  backButton: {
    position: 'absolute',
    top: SPACING.md || 16, // Đặt top theo SPACING tiêu chuẩn (ví dụ 16)
    left: SPACING.md || 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Nền đen mờ 
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },

  // Khối 2: Thông tin tiêu đề chính
  headerContent: {
    padding: SPACING.lg || 20,
    backgroundColor: COLORS.background || '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
  },
  titleContainer: {
    position: 'relative',
    paddingRight: 100, // Chừa khoảng trống bên phải cho Badge trạng thái
    marginBottom: SPACING.sm || 10,
  },
  jobTitle: {
    fontSize: FONTSIZE.xl || 20,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
    lineHeight: 28,
  },
  companyName: {
    fontSize: FONTSIZE.md || 15,
    fontWeight: FONTWEIGHT.medium || '500',
    color: COLORS.textSecondary || '#4B5563',
    marginTop: SPACING.xs || 6,
  },

  // Khối chung: Tiêu đề các Section phân đoạn
  sectionContainer: {
    padding: SPACING.lg || 20,
    borderBottomWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
    backgroundColor: COLORS.background || '#FFFFFF',
  },
  sectionTitle: {
    fontSize: FONTSIZE.md || 16,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
    marginBottom: SPACING.md || 12,
  },

  // Khối: Địa chỉ tách biệt 2 hàng
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm || 10,
    gap: SPACING.sm || 10,
  },
  addressLabel: {
    fontSize: FONTSIZE.sm || 14,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
    width: 100,
  },
  addressValue: {
    flex: 1,
    fontSize: FONTSIZE.sm || 14,
    color: COLORS.textSecondary || '#4B5563',
    lineHeight: 20,
  },

  // Khối 4: Lưới thông số 4 ô (Grid 2x2)
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  gridItem: {
    width: '48%', 
    backgroundColor: COLORS.surface || '#F9FAFB',
    borderColor: COLORS.border || '#E5E7EB',
    borderWidth: 1,
    borderRadius: RADIUS.md || 12,
    padding: SPACING.md || 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm || 10,
    marginBottom: SPACING.md || 12,
  },
  gridLabel: {
    fontSize: FONTSIZE.xs || 11,
    color: COLORS.textSecondary || '#6B7280',
    marginBottom: 2,
  },
  gridValue: {
    fontSize: FONTSIZE.sm || 13,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
  },

  // Khối 5: Lịch làm việc 2 hàng
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center', 
    paddingVertical: SPACING.sm || 10,
    borderBottomWidth: 1,
    borderColor: COLORS.surface || '#F3F4F6',
  },
  scheduleDay: {
    fontSize: FONTSIZE.sm || 14,
    fontWeight: FONTWEIGHT.medium || '500',
    color: COLORS.textPrimary || '#111111',
    width: 60,
  },
  scheduleTimeContainer: {
    flex: 1,
    flexDirection: 'column', 
    gap: 4,                  
    paddingLeft: SPACING.md || 16, 
  },
  scheduleTimeText: {
    fontSize: FONTSIZE.sm || 13,
    color: COLORS.textSecondary || '#4B5563',
  },

  // Khối 6: Mô tả công việc
  descriptionText: {
    fontSize: FONTSIZE.md || 14,
    color: COLORS.textPrimary || '#374151',
    lineHeight: 22,
  },

  // Khối 7: Thông tin nhà tuyển dụng đăng bài
  
  // --- ✅ CHỖ SỬA 2: Đổi sang style cho TouchableOpacity ---
  recruiterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface || '#F9FAFB',
    borderRadius: RADIUS.md || 12,
    padding: SPACING.md || 16,
    gap: SPACING.md || 12,
    // Thêm hiệu ứng click nhẹ
    borderColor: COLORS.border || '#E5E7EB',
    borderWidth: 1,
  },
  recruiterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  recruiterInfo: {
    flex: 1,
  },
  recruiterName: {
    fontSize: FONTSIZE.md || 15,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: COLORS.textPrimary || '#111111',
  },
  recruiterEmail: {
    fontSize: FONTSIZE.xs || 13,
    color: COLORS.textSecondary || '#6B7280',
    marginTop: 2,
  },

  // Khối 8: Thanh dính đáy màn hình (Sticky Bottom Bar)
  bottomStickyBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background || '#FFFFFF',
    paddingHorizontal: SPACING.lg || 20,
    paddingTop: SPACING.md || 14,
    // ✅ CHỖ SỬA 3: Giảm paddingBottom xuống (vì file JSX sẽ dùng SafeAreaView bao ngoài)
    paddingBottom: 20, 
    borderTopWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
    flexDirection: 'row',
    gap: SPACING.md || 12,
    alignItems: 'center',
  },
  employerNoticeBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm || 8,
  },
  employerNoticeText: {
    fontSize: FONTSIZE.sm || 13,
    color: COLORS.textSecondary || '#6B7280',
    fontStyle: 'italic',
  },

  btnFullWidth: {
    flex: 1,
    height: 48,
    borderRadius: RADIUS.full || 99,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnWidth35: {
    flex: 35,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
    borderRadius: RADIUS.full || 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface || '#F3F4F6',
  },
  btnWidth65: {
    flex: 65,
    height: 48,
    borderRadius: RADIUS.full || 99,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.textPrimary || '#111111',
  },
  btnChatSmall: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
    backgroundColor: COLORS.surface || '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnTextWhite: {
    color: '#FFFFFF',
    fontSize: FONTSIZE.md || 14,
    fontWeight: FONTWEIGHT.bold || 'bold',
  },
  btnTextBlack: {
    color: COLORS.textPrimary || '#111111',
    fontSize: FONTSIZE.md || 14,
    fontWeight: FONTWEIGHT.bold || 'bold',
  },
});