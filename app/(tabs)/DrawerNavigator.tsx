import React, { useEffect, useState } from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { useAppStore } from '../stores/appStore';

// Ekranlar
import DietitianPanel from '../screen/ DietitianPanel';
import AboutScreen from '../screen/AboutScreen';
import CalculationsScreen from '../screen/CalculationsScreen';
import FAQScreen from '../screen/FAQScreen';
import BMHCalculation from '../screen/BMHCalculation';
import ChaengeCalculations from '../screen/ChangeCalculations';
import ChildBMHCalculation from '../screen/ChildBMHCalculation';


const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps): JSX.Element {
  const router = useRouter();
  const db = getFirestore();
  const [fullName, setFullName] = useState('Diyetisyen');

  const diyetisyenAvatarKey = useAppStore((state) => state.diyetisyenAvatar);

  const avatarImages: Record<string, any> = {
    dietitiangirl1: require('../../assets/avatars/dietitiangirl1.png'),
    dietitiangirl2: require('../../assets/avatars/dietitiangirl2.png'),
    dietitiangirl3: require('../../assets/avatars/dietitiangirl3.png'),
    dietitianboy1: require('../../assets/avatars/dietitianboy1.png'),
    dietitianboy2: require('../../assets/avatars/dietitianboy2.png'),
    dietitianboy3: require('../../assets/avatars/dietitianboy3.png'),
    default: require('../../assets/images/profil.jpg'),
  };

  const avatarSource = avatarImages[diyetisyenAvatarKey] || avatarImages.default;

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          const name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          setFullName(name);
        }
      } catch (e) {
        console.error('Drawer isim alınırken hata:', e);
      }
    };

    fetchUserName();
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer}>
        <Image source={avatarSource} style={styles.profileImage} />
        <Text style={styles.userName}>Dyt. {fullName}</Text>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Entypo name="log-out" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator(): JSX.Element {
  useEffect(() => {
    const registerPushToken = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      const userId = auth.currentUser?.uid;

      if (userId) {
        const userRef = doc(getFirestore(), 'users', userId);
        await setDoc(userRef, { pushToken: token }, { merge: true });
      }
    };

    registerPushToken();
  }, []);

  return (
    <Drawer.Navigator
  initialRouteName="Profil"
  drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
  screenOptions={({ navigation }: { navigation: any }) => ({
    headerStyle: { backgroundColor: 'rgb(194,185,125)' },
    headerTintColor: '#FFF',
    headerTitleStyle: { fontWeight: 'bold' },
    headerLeft: () => (
      <TouchableOpacity
        style={{ marginLeft: 16 }}
        onPress={() => navigation.toggleDrawer()}
      >
        <Ionicons name="menu" size={24} color="#fff" />
      </TouchableOpacity>
    ),
    // Drawer menu stilini burada tanımlıyoruz
    drawerActiveTintColor: 'white', // Seçili olan menü için yazı rengi
    drawerActiveBackgroundColor: 'rgb(194,185,125)', // Seçili menü için arka plan rengi
    drawerInactiveTintColor: '#333', // Seçilmemiş menü için yazı rengi
    drawerLabelStyle: { fontSize: 15 }, // Menülerdeki yazı boyutu
  })}
>
  <Drawer.Screen name="Profil" component={DietitianPanel} />
  <Drawer.Screen name="Hakkında" component={AboutScreen} />
  <Drawer.Screen name="Hesaplamalar" component={CalculationsScreen} />
  <Drawer.Screen name="Danışanlarım" component={FAQScreen} />
  <Drawer.Screen
    name="BMHHesaplama"
    component={BMHCalculation}
    options={{
      drawerLabel: () => null,
      title: '',
      drawerIcon: () => null,
      drawerItemStyle: { height: 0 },
    }}
  />
  <Drawer.Screen
  name="ChildBMHCalculation"
  component={ChildBMHCalculation}
  options={{
    drawerLabel: () => null,
    title: '',
    drawerIcon: () => null,
    drawerItemStyle: { height: 0 },
  }}
/>

 
  <Drawer.Screen
    name="DegisimHesaplama"
    component={ChaengeCalculations}
    options={{
      drawerLabel: () => null,
      title: '',
      drawerIcon: () => null,
      drawerItemStyle: { height: 0 },
    }}
  />
</Drawer.Navigator>

  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(194,185,125)',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    marginHorizontal: 60,
    marginTop: 16,
    paddingVertical: 8, 
    paddingHorizontal: 12,
    borderRadius: 16, 
  },
  logoutText: {
    color: '#fff',
    fontSize: 14, 
    fontWeight: '500',
  },
  
  
});
