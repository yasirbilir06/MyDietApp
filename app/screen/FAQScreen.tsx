import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { firestore } from '../firebaseConfig';
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../firebaseConfig';

export default function FAQScreen() {
  const [danisanlar, setDanisanlar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const q = query(collection(firestore, 'users'), where('role', '==', 'danisan'));

    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      if (querySnapshot.empty) {
        setDanisanlar([]);
        setLoading(false);
        return;
      }

      const danisanList = await Promise.all(
        querySnapshot.docs.map(async (userDoc) => {
          const userData = userDoc.data();
          const userId = userDoc.id;

          const pdfRef = doc(firestore, 'pdfs', userId);
          const pdfSnap = await getDoc(pdfRef);
          const pdfData = pdfSnap.exists() ? pdfSnap.data() : null;

          return {
            id: userId,
            name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
            gender: userData.gender || null,
            height: userData.height || null,
            activityLevel: userData.activityLevel || null,
            pdfUrl: pdfData?.url || null,
          };
        })
      );

      setDanisanlar(danisanList);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleOpenPDF = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danışanlarım</Text>
        <TouchableOpacity
          style={styles.notificationIcon}
          onPress={() => router.push('/screen/NotificationsScreen')}
        >
          <Ionicons name="notifications-outline" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#C2B97D" style={{ marginTop: 20 }} />
      ) : danisanlar.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Hiç danışan bulunamadı.</Text>
      ) : (
        danisanlar.map((danisan) => (
          <View key={danisan.id} style={styles.card}>
            <Text style={styles.name}>{danisan.name}</Text>

            {(danisan.gender || danisan.height || danisan.activityLevel) && (
              <View style={styles.extraBox}>
                {danisan.gender && (
                  <Text style={styles.extraText}>Cinsiyet: {danisan.gender}</Text>
                )}
                {danisan.height && (
                  <Text style={styles.extraText}>Boy: {danisan.height} cm</Text>
                )}
                {danisan.activityLevel && (
                  <Text style={styles.extraText}>Aktivite Düzeyi: {danisan.activityLevel}</Text>
                )}
              </View>
            )}

            <View style={styles.buttonRow}>
              {danisan.pdfUrl ? (
                <TouchableOpacity style={styles.pdfButton} onPress={() => handleOpenPDF(danisan.pdfUrl)}>
                  <Text style={styles.buttonText}>Kan Değerleri</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.noPdfText}>Henüz PDF yüklenmemiş</Text>
              )}

              <TouchableOpacity
                style={styles.chatButton}
                onPress={async () => {
                  const currentUserId = auth.currentUser?.uid;
                  if (!currentUserId) return;

                  const currentUserRef = doc(firestore, 'users', currentUserId);
                  const currentUserSnap = await getDoc(currentUserRef);
                  const currentUserData = currentUserSnap.data();

                  if (currentUserData?.role === 'diyetisyen' && currentUserData?.isPremium === false) {
                    Alert.alert(
                      'Premium Gerekli',
                      'Mesaj göndermek için premium üye olmalısınız. Üye olmak ister misiniz?',
                      [
                        { text: 'Hayır', style: 'cancel' },
                        {
                          text: 'Evet',
                          onPress: () => router.push('/screen/ Membership'),
                        },
                      ]
                    );
                    return;
                  }

                  router.push({
                    pathname: '/screen/Chat',
                    params: {
                      otherUserId: danisan.id,
                      from: 'FAQScreen',
                    } as any,
                  });
                }}
              >
                <Text style={styles.buttonText}>Mesaj Gönder</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  notificationIcon: {
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  extraBox: {
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
  },
  extraText: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  noPdfText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    marginTop: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: 10,
  },
  pdfButton: {
    flex: 1,
    backgroundColor: '#C2B97D',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  chatButton: {
    flex: 1,
    backgroundColor: '#8CBA51',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});