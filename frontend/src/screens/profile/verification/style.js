import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    backBtn: { padding: 4 },
    
    // List Screen
    warningCard: { backgroundColor: '#FFFBEB', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#F59E0B', marginBottom: 16, alignItems: 'center' },
    warningTitle: { fontSize: 16, fontWeight: 'bold', color: '#D97706', marginBottom: 8 },
    warningText: { fontSize: 14, color: '#92400E', textAlign: 'center', lineHeight: 20 },
    
    listCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    dateText: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    badgeText: { fontSize: 11, fontWeight: 'bold' },

    // Detail Screen
    detailCard: { backgroundColor: '#FFFFFF', padding: 20, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', marginBottom: 16 },
    detailLabel: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 12 },
    
    // Image Grid
    imageGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    imageBox: { width: 90, height: 90, borderRadius: 8, position: 'relative' },
    imgPreview: { width: '100%', height: '100%', borderRadius: 8, backgroundColor: '#E5E7EB' },
    deleteImgBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: '#FFF', borderRadius: 12, elevation: 2 },
    addImgBtn: { width: 90, height: 90, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F9FAFB' }
});