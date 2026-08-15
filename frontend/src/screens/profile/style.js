import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background || '#FFFFFF' },
  headerContainer: { alignItems: 'center', paddingBottom: SPACING.md, paddingHorizontal: SPACING.lg, borderBottomWidth: 1, borderColor: COLORS.border || '#E5E7EB', position: 'relative' },
  settingsButton: { position: 'absolute', right: 20, padding: SPACING.xs },
  backButton: { position: 'absolute', left: 20, padding: SPACING.xs },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: SPACING.sm, backgroundColor: '#E5E7EB' },
  avatarPlaceholder: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#E5E7EB', justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.sm },
  name: { fontSize: FONTSIZE.lg, fontWeight: FONTWEIGHT.bold, color: COLORS.textPrimary || '#111111' },
  username: { fontSize: FONTSIZE.sm, color: COLORS.textSecondary || '#6B7280', marginTop: 2, marginBottom: SPACING.sm },
  bioText: { fontSize: FONTSIZE.sm, color: COLORS.textPrimary || '#374151', textAlign: 'center', paddingHorizontal: SPACING.xl, lineHeight: 18, marginBottom: 4 },
  ageText: { fontSize: FONTSIZE.xs, color: COLORS.textSecondary || '#6B7280', fontStyle: 'italic', marginBottom: SPACING.sm },
  statsRow: { flexDirection: 'row', gap: SPACING.xl, justifyContent: 'center', alignItems: 'center', marginVertical: 6 },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: FONTSIZE.md, fontWeight: FONTWEIGHT.bold, color: COLORS.textPrimary || '#111111' },
  statLabel: { fontSize: FONTSIZE.xs, color: COLORS.textSecondary || '#6B7280', marginTop: 2 },
  actionButton: { marginTop: SPACING.md, paddingHorizontal: 28, paddingVertical: 8, borderRadius: RADIUS.sm, borderWidth: 1, borderColor: COLORS.border || '#E5E7EB', backgroundColor: COLORS.surface || '#F3F4F6' },
  actionButtonText: { fontSize: FONTSIZE.sm, fontWeight: FONTWEIGHT.bold, color: COLORS.textPrimary || '#111111' },

  
  tabBarContainer: { flexDirection: 'row', borderBottomWidth: 1, borderColor: COLORS.border || '#E5E7EB', backgroundColor: COLORS.background || '#FFFFFF' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: SPACING.md },
  activeTabItem: { borderBottomWidth: 2, borderColor: COLORS.textPrimary || '#111111' },
  tabLabel: { fontSize: FONTSIZE.sm, fontWeight: FONTWEIGHT.medium, color: COLORS.textSecondary || '#6B7280' },
  activeTabLabel: { color: COLORS.textPrimary || '#111111', fontWeight: FONTWEIGHT.bold },
  tabContentContainer: { flex: 1, padding: SPACING.md },

  
  itemCard: { backgroundColor: COLORS.background || '#FFFFFF', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border || '#E5E7EB' },
  itemTitle: { fontSize: FONTSIZE.md, fontWeight: FONTWEIGHT.bold, color: COLORS.textPrimary || '#111111' },
  itemSubText: { fontSize: FONTSIZE.xs, color: COLORS.textSecondary || '#6B7280', marginTop: 4 },
  cardFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md },
  createCard: { borderWidth: 1, borderStyle: 'dashed', borderColor: '#9CA3AF', borderRadius: RADIUS.md, padding: SPACING.md, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', gap: 8, backgroundColor: COLORS.background || '#FFFFFF' },
  createCardText: { fontSize: FONTSIZE.sm, fontWeight: FONTWEIGHT.bold, color: COLORS.textSecondary || '#4B5563' },

  
  reviewCard: { backgroundColor: COLORS.surface || '#F9FAFB', borderRadius: RADIUS.md, padding: SPACING.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: COLORS.border || '#E5E7EB' },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18 },
  reviewAuthorName: { fontSize: FONTSIZE.sm, fontWeight: FONTWEIGHT.bold, color: COLORS.textPrimary || '#111111' },
  reviewStars: { fontSize: FONTSIZE.sm, color: '#FBBF24', marginTop: 2 },
  reviewComment: { fontSize: FONTSIZE.sm, color: COLORS.textPrimary || '#374151', lineHeight: 20, marginVertical: 6 },
  reviewJobLink: { fontSize: FONTSIZE.xs, color: '#3B82F6', fontWeight: FONTWEIGHT.medium, marginTop: 4 },
  unverifiedBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 20 },
  unverifiedText: { fontSize: FONTSIZE.sm, color: COLORS.textSecondary || '#6B7280', textAlign: 'center', lineHeight: 22, marginBottom: 20 },

  
  badgeBase: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99, justifyContent: 'center', alignItems: 'center' },
  badgeDraft: { backgroundColor: '#de9e4a' },
  badgePublic: { backgroundColor: '#4ADE80' },
  badgePrivate: { backgroundColor: '#11252B' },
  badgeTextWhite: { fontSize: 11, color: '#FFFFFF', fontWeight: 'bold', textTransform: 'uppercase' }
});