import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderColor: '#E5E7EB',
    },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#111111' },
    scrollContent: { padding: 16 },
    formGroup: { marginBottom: 16 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
    input: {
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB',
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
        fontSize: 15, color: '#111111'
    },
    textArea: {
        backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB',
        borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10,
        fontSize: 15, color: '#111111', height: 120
    },
    footer: {
        backgroundColor: '#FFFFFF', paddingHorizontal: 16, paddingTop: 8,
        borderTopWidth: 1, borderColor: '#E5E7EB',
    }
});