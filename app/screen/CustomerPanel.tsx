import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { BarChart } from 'react-native-chart-kit';
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../stores/appStore';

export default function CustomerPanel() {
  const db = getFirestore();
  const danisanAvatarKey = useAppStore(state => state.danisanAvatar);

  const avatarImages: Record<string, any> = {
    customergirl1: require('../../assets/avatars/customergirl1.png'),
    customergirl2: require('../../assets/avatars/customergirl2.png'),
    customergirl3: require('../../assets/avatars/customergirl3.png'),
    customerboy1: require('../../assets/avatars/customerboy1.png'),
    customerboy2: require('../../assets/avatars/customerboy2.png'),
    customerboy3: require('../../assets/avatars/customerboy3.png'),
    default: require('../../assets/images/profil.jpg'),
  };

  const [userData, setUserData] = useState({
    name: '',
    age: 0,
    gender: '',
    height: '',
    activityLevel: '',
  });

  const [dietitianUID, setDietitianUID] = useState<string | null>(null);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          const fullName = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          const userAge = calculateAge(data.birthDate);

          setUserData({
            name: fullName,
            age: userAge,
            gender: data.gender || '',
            height: data.height || '',
            activityLevel: data.activityLevel || '',
          });

          if (data.dietitianId) {
            setDietitianUID(data.dietitianId);
          }

          setIsPremium(data.isPremium === true);
        }
      } catch (error) {
        console.error('Kullanıcı verileri alınırken hata:', error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'notifications', uid, 'items'),
      where('read', '==', false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setHasUnreadNotifications(!snapshot.empty);
    });

    return () => unsubscribe();
  }, []);

  const calculateAge = (birthDateStr: string | undefined) => {
    if (!birthDateStr) return 0;
    const [dd, mm, yyyy] = birthDateStr.split('.');
    if (!dd || !mm || !yyyy) return 0;
    const birthDate = new Date(`${yyyy}-${mm}-${dd}`);
    const now = new Date();
    let age = now.getFullYear() - birthDate.getFullYear();
    const monthDiff = now.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleOpenFullChart = () => {
    router.push('/screen/ WeightTracking');
  };

  const handleOpenKisiselVeriler = () => {
    router.push('/screen/PersonalData');
  };

  const handleChat = () => {
    if (!isPremium) {
      Alert.alert(
        'Premium Gerekli',
        'Mesajlaşma özelliğini kullanmak için premium üye olmalısınız. Üyelik sayfasına gitmek ister misiniz?',
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

    if (!dietitianUID) {
      Alert.alert('Hata', 'Diyetisyen bulunamadı.');
      return;
    }

    router.push({
      pathname: '/screen/Chat',
      params: { otherUserId: dietitianUID },
    });
  };

  const miniData = {
    labels: ['10/3', '11/3', '12/3'],
    datasets: [{ data: [90, 91, 85] }],
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconWrapper} onPress={handleChat}>
          <Ionicons name="chatbubble-ellipses-outline" size={22} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconWrapper}
          onPress={() => router.push('/screen/NotificationsScreen')}
        >
          <View>
            <Ionicons name="notifications-outline" size={22} color="#000" />
            {hasUnreadNotifications && <View style={styles.badge} />}
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.profileHeader}>
        <Image source={avatarImages[danisanAvatarKey]} style={styles.profileImage} />
        <View style={styles.profileInfo}>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.age}>Yaş: {userData.age}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.detailsSection} onPress={handleOpenKisiselVeriler}>
        <Text style={styles.sectionTitle}>Kişisel Veriler</Text>

        {(!userData.height || !userData.activityLevel || !userData.gender) ? (
          <Text style={styles.placeholderText}>
            Kayıt sırasında girilen veriler burada görüntülenecek.
          </Text>
        ) : (
          <View style={styles.userInfoBox}>
            <Text style={styles.userInfoText}>Cinsiyet: {userData.gender}</Text>
            <Text style={styles.userInfoText}>Boyunuz: {userData.height} cm</Text>
            <Text style={styles.userInfoText}>Aktivite Düzeyi: {userData.activityLevel}</Text>
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.chartPreviewContainer}>
        <Text style={styles.chartPreviewTitle}>Kilo Takibi (Özet)</Text>
        <TouchableOpacity style={styles.chartPreviewBox} onPress={handleOpenFullChart}>
          <BarChart
            data={miniData}
            width={200}
            height={120}
            fromZero
            showValuesOnTopOfBars
            yAxisLabel=""
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: '#1C1C1E',
              backgroundGradientFrom: '#1C1C1E',
              backgroundGradientTo: '#1C1C1E',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(191, 90, 242, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              propsForBackgroundLines: { stroke: '#3A3A3C' },
            }}
            style={{ borderRadius: 8 }}
            withHorizontalLabels={false}
            withVerticalLabels
          />
          <Text style={styles.chartPreviewText}>Dokununca tam ekran grafik!</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#fff', padding: 16 },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  iconWrapper: {
    marginLeft: 12,
    backgroundColor: '#f2f2f2',
    padding: 8,
    borderRadius: 20,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: 'red',
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgb(194,185,125)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  profileImage: { width: 80, height: 80, borderRadius: 40 },
  profileInfo: { marginLeft: 16 },
  name: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  age: { fontSize: 16, color: '#fff', marginTop: 4 },
  detailsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#333' },
  placeholderText: { fontSize: 16, color: '#888' },
  userInfoBox: {
    marginTop: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 10,
  },
  userInfoText: { fontSize: 14, color: '#444', marginBottom: 4 },
  chartPreviewContainer: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
  },
  chartPreviewTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: '#FFF' },
  chartPreviewBox: {
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  chartPreviewText: { fontSize: 14, color: '#666', marginTop: 8 },
});
