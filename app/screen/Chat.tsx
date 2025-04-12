import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  getFirestore,
  collection,
  onSnapshot,
  query,
  orderBy,
  deleteDoc,
  doc,
  addDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { auth } from '../firebaseConfig';
import { getOrCreateChat, sendMessage } from '../utils/chatUtils';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import uuid from 'react-native-uuid';
import Modal from 'react-native-modal';
import ImageViewer from 'react-native-image-zoom-viewer';
import { onAuthStateChanged } from 'firebase/auth';

export default function ChatScreen() {
  const { otherUserId, from } = useLocalSearchParams();
  const currentUserId = auth.currentUser?.uid!;
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [userRole, setUserRole] = useState<'danisan' | 'diyetisyen'>();

  const [isImageModalVisible, setImageModalVisible] = useState(false);
  const [zoomImageUrl, setZoomImageUrl] = useState('');

  const router = useRouter();
  const db = getFirestore();

  useEffect(() => {
    console.log('🔥 userRole:', userRole);
    const initChat = async () => {
      if (!otherUserId) return;
      const id = await getOrCreateChat(currentUserId, String(otherUserId));
      setChatId(id);

      const q = query(
        collection(db, 'chats', id, 'messages'),
        orderBy('sentAt', 'asc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      });

      return () => unsubscribe();
    };

    initChat();
  }, [otherUserId]);

  
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userRef = doc(getFirestore(), 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log('📄 Firestore user data:', data);

        if (data?.role) {
          setUserRole(data.role); // 'danisan' veya 'diyetisyen'
          console.log('🔥 userRole:', data.role);
        } else {
          console.warn('⚠️ role alanı bulunamadı');
        }
      } else {
        console.warn('❌ Kullanıcı belgesi bulunamadı');
      }
    } else {
      console.warn('❌ Kullanıcı oturumu yok');
    }
  });

  return () => unsubscribe();
}, []);

  const handleGoBack = () => {
    if (String(from) === 'FAQScreen') {
      router.replace('/(tabs)/DrawerNavigator');
    } else {
      router.back();
    }
  };

  const handleSend = async () => {
    if (text.trim() && userRole) {
      setIsSending(true);
      await sendMessage(chatId, currentUserId, text, userRole);
      setText('');
      setIsSending(false);
    }
  };

  const handleDelete = (messageId: string) => {
    Alert.alert('Mesajı Sil', 'Bu mesajı silmek istediğine emin misin?', [
      { text: 'İptal', style: 'cancel' },
      {
        text: 'Sil',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteDoc(doc(db, 'chats', chatId, 'messages', messageId));
          } catch (error) {
            console.error('Mesaj silinirken hata:', error);
          }
        },
      },
    ]);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.6,
    });

    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      const response = await fetch(image.uri);
      const blob = await response.blob();

      setIsSending(true);

      const imageRef = ref(getStorage(), `chatImages/${uuid.v4()}`);
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);

      await addDoc(collection(db, 'chats', chatId, 'messages'), {
        senderId: currentUserId,
        imageUrl: downloadURL,
        sentAt: serverTimestamp(),
      });

      setIsSending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sohbet</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={({ item }) => {
          const date = item.sentAt?.toDate?.();
          const time =
            date && typeof date.getHours === 'function'
              ? `${date.getHours().toString().padStart(2, '0')}:${date
                  .getMinutes()
                  .toString()
                  .padStart(2, '0')}`
              : '';

          return (
            <TouchableOpacity
              onLongPress={() => {
                if (item.senderId === currentUserId) {
                  handleDelete(item.id);
                }
              }}
              style={[
                styles.messageContainer,
                item.senderId === currentUserId ? styles.myMessage : styles.otherMessage,
              ]}
            >
              {item.text && <Text style={styles.messageText}>{item.text}</Text>}
              {item.imageUrl && (
                <TouchableOpacity
                  onPress={() => {
                    setZoomImageUrl(item.imageUrl);
                    setImageModalVisible(true);
                  }}
                >
                  <Image source={{ uri: item.imageUrl }} style={styles.image} />
                </TouchableOpacity>
              )}
              <Text style={styles.timeText}>{time}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(item) => item.id}
      />

      <Modal
        isVisible={isImageModalVisible}
        onBackdropPress={() => setImageModalVisible(false)}
        style={{ margin: 0 }}
      >
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setImageModalVisible(false)}
            style={{
              position: 'absolute',
              top: 40,
              right: 20,
              zIndex: 10,
              backgroundColor: '#00000080',
              padding: 8,
              borderRadius: 20,
            }}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>

          <ImageViewer
            imageUrls={[{ url: zoomImageUrl }]}
            enableSwipeDown
            onSwipeDown={() => setImageModalVisible(false)}
            backgroundColor="#000"
          />
        </View>
      </Modal>

      <View style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.plusButton}>
          <Ionicons name="add" size={28} color="rgb(194,185,125)" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Mesaj..."
        />
        {isSending ? (
          <ActivityIndicator size="small" color="rgb(194,185,125)" />
        ) : (
          <TouchableOpacity onPress={handleSend}>
            <Ionicons name="send" size={24} color="rgb(194,185,125)" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  messageContainer: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 10,
    maxWidth: '80%',
  },
  myMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherMessage: {
    backgroundColor: '#EEE',
    alignSelf: 'flex-start',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 11,
    color: '#999',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 10,
    marginTop: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    padding: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
  },
  plusButton: {
    marginRight: 8,
  },
});