import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, StyleSheet, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AuthContext } from '../../context/AuthContext';
import { chatService } from '../../services/chatService';
import { globalStyles } from '../../constants/globalStyles';

export default function ChatDetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const insets = useSafeAreaInsets();

    const { user: currentUser } = useContext(AuthContext);
    const { targetUser } = route.params;

    const [messages, setMessages] = useState([]);
    const [inputText, setInputText] = useState('');

    const roomId = chatService.getRoomId(currentUser.username, targetUser.username);

    useEffect(() => {
        const unsubscribe = chatService.subscribeToMessages(roomId, (newMessages) => {
            setMessages(newMessages);
        });
        return () => unsubscribe();
    }, [roomId]);

    const handleSend = async () => {
        if (!inputText.trim()) return;
        const textToSend = inputText.trim();
        setInputText('');

        
        let myDisplayName = currentUser.name || currentUser.username;

        
        if (currentUser.role === 'EMPLOYER' && currentUser.profile?.company_name) {
            myDisplayName = `${currentUser.name} (${currentUser.profile.company_name})`;
        }

        const newMessage = [{
            _id: Math.random().toString(36).substring(2, 15),
            text: textToSend,
            user: {
                _id: currentUser.username,
                name: myDisplayName 
            }
        }];

        try {
            
            const currentUserInfo = {
                username: currentUser.username,
                name: myDisplayName, 
                avatar: currentUser.avatar || 'https://via.placeholder.com/150'
            };

            const targetUserInfo = {
                username: targetUser.username,
                name: targetUser.name || targetUser.username,
                avatar: targetUser.avatar || 'https://via.placeholder.com/150'
            };

            await chatService.sendMessage(roomId, newMessage, [currentUser.username, targetUser.username], currentUserInfo, targetUserInfo);
        } catch (error) {
            alert("Lỗi không thể gửi tin nhắn: " + error.message);
        }
    };

const renderMessageItem = ({ item }) => {
        const isMyMessage = item.user._id === currentUser.username;
        return (
            <View style={[styles.messageRow, isMyMessage ? styles.myMessageRow : styles.theirMessageRow]}>

                {!isMyMessage && (
                    <Image

                        source={{ uri: targetUser.avatar || 'https://via.placeholder.com/150' }}
                        style={styles.messageAvatar}
                    />
                )}

                <View style={[styles.bubble, isMyMessage ? styles.myBubble : styles.theirBubble]}>
                    <Text style={[styles.messageText, isMyMessage ? styles.myMessageText : styles.theirMessageText]}>
                        {item.text}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView style={[globalStyles.container, { backgroundColor: '#FFFFFF' }]} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <View style={[styles.header, { paddingTop: Math.max(insets.top, 24) + 12 }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#111111" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>{targetUser?.name || targetUser?.username}</Text>
                    
                </View>
                <View style={{ width: 24 }} />
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item._id}
                renderItem={renderMessageItem}
                inverted
                contentContainerStyle={styles.chatContainer}
                showsVerticalScrollIndicator={false}
            />

            <View style={[styles.inputContainer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
                <TextInput style={styles.textInput} placeholder="Nhập tin nhắn..." value={inputText} onChangeText={setInputText} multiline />
                <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={!inputText.trim()}>
                    <Ionicons name="send" size={24} color={inputText.trim() ? "#3B82F6" : "#9CA3AF"} />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 12, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderColor: '#E5E7EB', zIndex: 10 },
    backBtn: { padding: 4 },
    headerInfo: { alignItems: 'center' },
    headerName: { fontSize: 16, fontWeight: 'bold', color: '#111111' },

    chatContainer: { paddingHorizontal: 16, paddingVertical: 12 },
    messageRow: { marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end' },
    myMessageRow: { justifyContent: 'flex-end' },
    theirMessageRow: { justifyContent: 'flex-start' },

    
    messageAvatar: { width: 28, height: 28, borderRadius: 14, marginRight: 8, backgroundColor: '#E5E7EB' },

    bubble: { maxWidth: '75%', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
    myBubble: { backgroundColor: '#3B82F6', borderBottomRightRadius: 4 },
    theirBubble: { backgroundColor: '#F3F4F6', borderBottomLeftRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 20 },
    myMessageText: { color: '#FFFFFF' },
    theirMessageText: { color: '#111111' },

    inputContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
    textInput: { flex: 1, backgroundColor: '#F9FAFB', borderRadius: 24, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, fontSize: 15, maxHeight: 100 },
    sendButton: { padding: 12, marginLeft: 4 }
});