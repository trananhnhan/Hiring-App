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
  content: { padding: SPACING.md },
  
  
  jobCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: SPACING.md,
  },
  jobThumb: { width: 60, height: 60, borderRadius: RADIUS.sm, marginRight: 12 },
  jobInfo: { flex: 1, justifyContent: 'center' },
  jobTitle: { fontSize: FONTSIZE.md, fontWeight: FONTWEIGHT.bold, color: '#111111' },
  companyName: { fontSize: FONTSIZE.sm, color: '#6B7280', marginTop: 2 },

  
  section: { backgroundColor: '#FFFFFF', padding: SPACING.md, borderRadius: RADIUS.md, marginBottom: SPACING.md, borderWidth: 1, borderColor: '#E5E7EB' },
  sectionTitle: { fontSize: FONTSIZE.sm, fontWeight: FONTWEIGHT.bold, color: '#374151', marginBottom: 8, textTransform: 'uppercase' },
  messageText: { fontSize: FONTSIZE.md, color: '#4B5563', lineHeight: 22 },
  
  
  resumeTile: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: RADIUS.md,
  },
  resumeTitle: { flex: 1, fontSize: FONTSIZE.md, fontWeight: '500', color: '#111111', marginLeft: 10 },

  
  resultBox: { padding: 12, borderRadius: RADIUS.md, marginTop: 8 },
  resultDetail: { fontSize: FONTSIZE.sm, color: '#374151', marginTop: 4, fontStyle: 'italic' },

  
  footer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
  },
  buttonRow: { flexDirection: 'row', gap: 10, marginBottom: 10 }
});