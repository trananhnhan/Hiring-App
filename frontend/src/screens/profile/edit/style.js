import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderColor: '#E5E7EB',
    },
    backBtn: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    
    sectionCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 16,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2,
    },
    sectionHeader: {
        flexDirection: 'row', alignItems: 'center',
        marginBottom: 20, gap: 8,
        borderBottomWidth: 1, borderBottomColor: '#F3F4F6', paddingBottom: 12,
    },
    sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    
    avatarSection: { alignItems: 'center', marginBottom: 24 },
    avatarWrapper: { position: 'relative' },
    avatarImage: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F3F4F6', borderWidth: 2, borderColor: '#E5E7EB' },
    cameraIcon: {
        position: 'absolute', bottom: 0, right: 0,
        backgroundColor: '#3B82F6', width: 28, height: 28, borderRadius: 14,
        alignItems: 'center', justifyContent: 'center',
        borderWidth: 2, borderColor: '#FFFFFF',
    },
    avatarHint: { fontSize: 12, color: '#6B7280', marginTop: 12 },

    formGroup: { marginBottom: 16 },
    label: { fontSize: 13, fontWeight: 'bold', color: '#4B5563', marginBottom: 6 },
    input: {
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB',
        borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 15, color: '#111111',
    },
    inputDisabled: {
        backgroundColor: '#F3F4F6', // Màu xám mờ để báo hiệu không sửa được
        borderWidth: 1, borderColor: '#E5E7EB',
        borderRadius: 8, paddingHorizontal: 12, height: 44, fontSize: 15, color: '#6B7280',
    },
    textArea: {
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB',
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 12,
        fontSize: 15, color: '#111111', height: 100,
    },
    noteText: {
        fontSize: 12, color: '#F59E0B', fontStyle: 'italic', marginBottom: 16, lineHeight: 18
    }
});