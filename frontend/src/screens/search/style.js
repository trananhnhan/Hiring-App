import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../constants/theme';

export const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SPACING.md || 16,
    paddingBottom: SPACING.md || 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: FONTSIZE.xl || 20,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: '#111111',
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: RADIUS.md || 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: { marginRight: 8 },
  searchInput: {
    flex: 1,
    fontSize: FONTSIZE.md || 14,
    color: '#111111',
    height: '100%',
  },
  clearBtn: { padding: 4 },
  listContainer: { flex: 1, paddingHorizontal: SPACING.md || 16 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -50,
  },
  emptyText: {
    fontSize: FONTSIZE.sm || 14,
    color: '#9CA3AF',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  name: {
    fontSize: FONTSIZE.md || 15,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: '#111111',
    flex: 1,
    marginRight: 8,
  },
  username: {
    fontSize: FONTSIZE.sm || 13,
    color: '#6B7280',
    marginTop: 2,
  },
  roleBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});