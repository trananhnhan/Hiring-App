import React, { useState, useEffect, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AuthContext } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import { globalStyles } from '../../constants/globalStyles';

export default function MessageListScreen() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();
    const { user: currentUser } = useContext(AuthContext);
    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        if (!currentUser?.username) return;
        const unsubscribe = chatService.subscribeToChatRooms(currentUser.username, (rooms) => {
            setChatRooms(rooms);
        });
        return () => unsubscribe();
    }, [currentUser?.username]);

const renderChatRoom = ({ item }) => {
        const otherUsername = item.users.find(u => u !== currentUser.username);
        
        
        const targetInfo = item.usersInfo ? item.usersInfo[otherUsername] : null;

        const targetUser = { 
            username: otherUsername, 
            name: targetInfo?.name || otherUsername, 
            avatar: targetInfo?.avatar || 'https://via.placeholder.com/150'
        };

        return (
            <TouchableOpacity style={styles.roomContainer} onPress={() => navigation.navigate('ChatDetailScreen', { targetUser })}>
                <Image source={{ uri: targetUser.avatar }} style={styles.avatar} />
                <View style={styles.roomInfo}>
                    <Text style={styles.roomName}>{targetUser.name}</Text>
                    <Text style={styles.lastMessage} numberOfLines={1}>{item.lastMessage || "Chưa có tin nhắn nào"}</Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[globalStyles.container, { backgroundColor: '#FFFFFF', paddingTop: Math.max(insets.top, 24) }]}>
            <View style={styles.header}><Text style={styles.headerTitle}>Tin nhắn</Text></View>
            <FlatList data={chatRooms} keyExtractor={(item) => item.id} renderItem={renderChatRoom} contentContainerStyle={{ paddingHorizontal: 16 }} ListEmptyComponent={<Text style={styles.emptyText}>Chưa có cuộc trò chuyện nào.</Text>} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: { paddingHorizontal: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#E5E7EB' }, headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111111' },
    roomContainer: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderColor: '#F3F4F6' }, avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E5E7EB' },
    roomInfo: { flex: 1, marginLeft: 12, justifyContent: 'center' }, roomName: { fontSize: 16, fontWeight: '600', color: '#111111', marginBottom: 4 }, lastMessage: { fontSize: 14, color: '#6B7280' }, emptyText: { textAlign: 'center', marginTop: 40, color: '#9CA3AF' }
});