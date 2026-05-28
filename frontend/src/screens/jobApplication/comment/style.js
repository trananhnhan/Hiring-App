import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderColor: '#E5E7EB',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    jobHeader: {
        backgroundColor: '#111111', padding: 20, alignItems: 'center',
        borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
        marginBottom: 20,
    },
    jobThumbnail: {
        width: 80, height: 80, borderRadius: 40,
        borderWidth: 3, borderColor: '#FFFFFF', marginBottom: 12,
    },
    jobTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
    
    commentCard: {
        backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12,
        marginBottom: 16, borderWidth: 1, borderColor: '#E5E7EB',
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1,
    },
    badge: {
        alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 99,
    },
    badgeText: { fontSize: 11, fontWeight: 'bold' },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E5E7EB' },
    authorName: { fontSize: 15, fontWeight: 'bold', color: '#111111' },
    ratingText: { fontSize: 13, fontWeight: 'bold', color: '#F59E0B' },
    dateText: { fontSize: 12, color: '#6B7280' },
    reviewText: { fontSize: 14, color: '#374151', marginTop: 12, lineHeight: 22 },
    
    actionCard: {
        backgroundColor: '#FFFFFF', padding: 20, marginHorizontal: 16,
        borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB',
        marginTop: 8,
    },
    textArea: {
        backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#D1D5DB',
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12,
        fontSize: 15, color: '#111111', height: 100, marginBottom: 16,
    }
});