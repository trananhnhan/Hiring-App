import { StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONTSIZE, FONTWEIGHT } from '../../../constants/theme';

export const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  headerTitle: { fontSize: FONTSIZE.lg, fontWeight: FONTWEIGHT.bold, color: '#111111' },
  listContainer: { padding: SPACING.md },
  
  // Trả lại Card nguyên khối như cũ
  candidateCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    marginRight: 12,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  candidateName: {
    fontSize: FONTSIZE.md,
    fontWeight: FONTWEIGHT.bold,
    color: '#111111',
    marginBottom: 4,
  },
  usernameText: {
    fontSize: FONTSIZE.sm,
    color: '#6B7280',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  statusCol: {
    alignItems: 'flex-end',
    marginLeft: 10,
  }
});