import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native';
import { auth, firestore } from '../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const ref = collection(firestore, 'notifications', uid, 'items');
    const q = query(ref, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notis = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(notis);
    });

    return () => unsubscribe();
  }, []);

  const renderTime = (timestamp: any) => {
    if (timestamp?.toDate) {
      const date = timestamp.toDate();
      return new Date(date).toLocaleTimeString('tr-TR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return '';
  };

  const deleteNotification = async (notificationId: string) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const ref = doc(firestore, 'notifications', uid, 'items', notificationId);
    await deleteDoc(ref);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableWithoutFeedback onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" style={{ marginRight: 12 }} />
        </TouchableWithoutFeedback>
        <Text style={styles.title}>Bildirimler</Text>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableWithoutFeedback
            onLongPress={() => {
              Alert.alert(
                'Bildirim Sil',
                'Bu bildirimi silmek istiyor musunuz?',
                [
                  { text: 'İptal', style: 'cancel' },
                  {
                    text: 'Sil',
                    style: 'destructive',
                    onPress: () => deleteNotification(item.id),
                  },
                ]
              );
            }}
            onPress={() => {
              if (item.fromUid) {
                router.push({
                  pathname: '/screen/Chat',
                  params: { otherUserId: item.fromUid },
                });
              }
            }}
          >
            <View
              style={[
                styles.card,
                item.read ? {} : { backgroundColor: '#fffbe6' },
              ]}
            >
              <Text style={styles.titleText}>{item.title}</Text>
              <Text style={styles.bodyText}>{item.body}</Text>
              <View style={styles.bottomRow}>
                <Text style={styles.role}>
                  {item.fromRole === 'danisan'
                    ? `👤 Danışan - ${item.fromName || ''}`
                    : `🧑‍⚕️ Diyetisyen - ${item.fromName || ''}`}
                </Text>
                <Text style={styles.timeText}>{renderTime(item.createdAt)}</Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Henüz hiç bildiriminiz yok.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  titleText: { fontSize: 16, fontWeight: 'bold' },
  bodyText: { fontSize: 14, marginVertical: 4 },
  role: { fontSize: 12, color: '#666' },
  timeText: { fontSize: 12, color: '#999', marginLeft: 8 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 15,
    color: '#999',
  },
});