import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../constants/theme';

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md || 16,
    paddingBottom: SPACING.md || 16,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backBtn: { padding: 4 },
  headerTitle: {
    fontSize: FONTSIZE.md || 16,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: '#111111',
  },
  
  
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },
  
  
  userInfoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, 
    paddingRight: 10,
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
    flexWrap: 'wrap', 
    gap: 6, 
  },
  
  
  name: {
    fontSize: FONTSIZE.md || 15,
    fontWeight: FONTWEIGHT.bold || 'bold',
    color: '#111111',
    flexShrink: 1, 
    marginRight: 6, 
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

  
  followBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#111111',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 90,
  },
  followingBtn: {
    backgroundColor: '#E5E7EB',
    borderColor: 'transparent',
  },
  followBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111111',
  },
  followingBtnText: {
    color: '#4B5563',
  },
});