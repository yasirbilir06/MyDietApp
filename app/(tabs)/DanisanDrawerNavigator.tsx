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

// Ekranlar
import CustomerPanel from '../screen/CustomerPanel';
import Results from '../screen/Results';
import WeightTracking from '../screen/ WeightTracking';
import PracticalRecipes from '../screen/PracticalRecipes';
import Membership from '../screen/ Membership';
import AppointmentScreen from '../screen/AppointmentScreen';
// Firestore ve Auth
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const db = getFirestore();
  const router = useRouter();
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return;
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userSnap = await getDoc(userDocRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          const name = `${data.firstName || ''} ${data.lastName || ''}`.trim();
          setFullName(name);
        }
      } catch (error) {
        console.error('Drawer kullanıcı verisi alınırken hata:', error);
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
        <Image
          source={require('../../assets/images/profil.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{fullName}</Text>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Entypo name="log-out" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DanisanDrawerNavigator() {
  useEffect(() => {
    const registerPushToken = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') return;

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;
      const userId = auth.currentUser?.uid;

      if (userId && token) {
        const userRef = doc(getFirestore(), 'users', userId);
        await updateDoc(userRef, { pushToken: token });
      }
    };

    registerPushToken();
  }, []);

  return (
    <Drawer.Navigator
      initialRouteName="Profilim"
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
      })}
    >
      <Drawer.Screen
        name="Profilim"
        component={CustomerPanel}
        options={{ title: 'Profil' }}
      />
      <Drawer.Screen
        name="Değerlerim"
        component={Results}
        options={{ title: 'Değerlerim' }}
      />
      <Drawer.Screen
        name="KiloTakibiScreen"
        component={WeightTracking}
        options={{ title: 'Kilo Takip' }}
      />
      <Drawer.Screen
        name="Tarifler"
        component={PracticalRecipes}
        options={{ title: 'Pratik Tarifler' }}
      />
      <Drawer.Screen
        name="Appointment"
        component={AppointmentScreen}
        options={{ title: 'Randevu Al' }}
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
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});