import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

import { sendPushNotification } from './sendPushNotification';

const db = getFirestore();

export const getOrCreateChat = async (userA: string, userB: string) => {
  const combinedId = [userA, userB].sort().join('_');
  const chatRef = doc(db, 'chats', combinedId);

  const snapshot = await getDocs(
    query(collection(db, 'chats'), where('participants', 'array-contains', userA))
  );

  if (!snapshot.docs.find(doc => doc.id === combinedId)) {
    await setDoc(chatRef, {
      participants: [userA, userB],
    });
  }

  return combinedId;
};

export const sendMessage = async (
  chatId: string,
  senderId: string,
  text: string,
  senderRole: 'danisan' | 'diyetisyen'
) => {
  const db = getFirestore();

  // 1. Mesajı Firestore'a yaz
  const messageRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messageRef, {
    senderId,
    text,
    sentAt: serverTimestamp(),
  });

  // 2. Karşı tarafı bul
  const chatDoc = await getDoc(doc(db, 'chats', chatId));
  const chatData = chatDoc.data();
  if (!chatData || !chatData.participants) return;

  const otherUserId = chatData.participants.find((id: string) => id !== senderId);
  if (!otherUserId) return;

  // 3. Gönderenin bilgilerini al
  const senderSnap = await getDoc(doc(db, 'users', senderId));
  const senderData = senderSnap.data();
  const senderName = `${senderData?.firstName || ''} ${senderData?.lastName || ''}`.trim();

  // 4. Alıcının bilgileri
  const targetUserSnap = await getDoc(doc(db, 'users', otherUserId));
  const targetUserData = targetUserSnap.data();
  const pushToken = targetUserData?.pushToken;

  // 5. Bildirimi Firestore’a yaz
  const notificationRef = collection(db, 'notifications', otherUserId, 'items');
  await addDoc(notificationRef, {
    title: 'Yeni Mesaj 📩',
    body: text,
    fromUid: senderId,
    fromRole: senderRole,
    fromName: senderName, // ✅ Artık ekleniyor
    createdAt: serverTimestamp(),
    read: false,
  });

  // 6. Push bildirimi
  if (pushToken) {
    await sendPushNotification(pushToken, 'Yeni Mesaj 📩', `${senderName}: ${text}`);
  }
};
