// src/screens/stats/style.js
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    scrollContent: { padding: 16 },
    dashboardContainer: { width: '100%' },
    
    // Khối Employer
    mainRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
    mainCard: { flex: 1, padding: 16, borderRadius: 16, alignItems: 'center', marginHorizontal: 6, elevation: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
    cardValue: { fontSize: 28, fontWeight: 'bold', marginTop: 8 },
    cardLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#111111', marginBottom: 16, marginTop: 8, paddingHorizontal: 4 },
    statusList: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E7EB' },
    statusItem: { marginBottom: 18 },
    statusHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
    statusName: { fontSize: 14, color: '#374151', fontWeight: '500' },
    statusCount: { fontSize: 14, fontWeight: 'bold', color: '#111111' },
    progressTrack: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
    progressBar: { height: '100%', borderRadius: 4 },

    // Khối Candidate
    rateCard: { backgroundColor: '#6366F1', borderRadius: 20, padding: 20, marginBottom: 24, elevation: 3, shadowColor: '#6366F1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
    rateTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
    rateValue: { color: '#FFFFFF', fontSize: 42, fontWeight: 'bold', marginTop: 4 },
    rateSub: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 12 },
    gridContainer: { flexDirection: 'row', backgroundColor: '#FFFFFF' },
    gridItem: { flex: 1, paddingVertical: 20, alignItems: 'center', backgroundColor: '#FFFFFF' },
    gridNumber: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    gridLabel: { fontSize: 13, color: '#6B7280', marginTop: 4 }
});