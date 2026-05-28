import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, addDoc, onSnapshot, query, orderBy, setDoc, serverTimestamp, where } from 'firebase/firestore';
import { firebaseConfig } from '../constants/config';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const chatService = {
    // 1. TẠO ID PHÒNG CHAT
    getRoomId: (username1, username2) => {
        if (!username1 || !username2) return "phong-chat-loi";
        const sortedUsernames = [username1, username2].sort();
        return `${sortedUsernames[0]}|${sortedUsernames[1]}`; // Phân cách bằng dấu |
    },

    // 2. GỬI TIN NHẮN
    sendMessage: async (roomId, messages = [], usersArray = [], currentUserInfo, targetUserInfo) => {
        const msg = messages[0];
        const messagesRef = collection(db, 'chatRooms', roomId, 'messages');

        await addDoc(messagesRef, {
            _id: msg._id, text: msg.text, createdAt: serverTimestamp(), user: msg.user,
        });

        const roomRef = doc(db, 'chatRooms', roomId);
        await setDoc(roomRef, {
            lastMessage: msg.text,
            lastUpdatedAt: serverTimestamp(),
            users: usersArray,
            // 👇 NHÉT THÊM CỤC INFO NÀY VÀO ĐỂ LIST CHAT ĐỌC
            usersInfo: {
                [currentUserInfo.username]: { name: currentUserInfo.name, avatar: currentUserInfo.avatar },
                [targetUserInfo.username]: { name: targetUserInfo.name, avatar: targetUserInfo.avatar }
            }
        }, { merge: true });
    },

    // 3. LẮNG NGHE TIN NHẮN REAL-TIME
    subscribeToMessages: (roomId, callback) => {
        const messagesRef = collection(db, 'chatRooms', roomId, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messages = querySnapshot.docs.map(doc => {
                const firebaseData = doc.data();
                return {
                    _id: firebaseData._id,
                    text: firebaseData.text,
                    createdAt: firebaseData.createdAt ? firebaseData.createdAt.toDate() : new Date(),
                    user: firebaseData.user,
                };
            });
            callback(messages);
        });

        return unsubscribe;
    },

    // 4. LẤY DANH SÁCH CÁC PHÒNG CHAT CỦA USER
    subscribeToChatRooms: (currentUsername, callback) => {
        const roomsRef = collection(db, 'chatRooms');
        const q = query(roomsRef, where('users', 'array-contains', currentUsername));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let rooms = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            rooms.sort((a, b) => (b.lastUpdatedAt?.toMillis() || 0) - (a.lastUpdatedAt?.toMillis() || 0));
            callback(rooms);
        });

        return unsubscribe;
    }
};