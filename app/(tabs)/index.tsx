import React, { useEffect } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome } from '@expo/vector-icons';
import { useAppStore } from '../stores/appStore';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ProfileSelectionScreen() {
  const router = useRouter();
  const setDiyetisyenStep = useAppStore((state) => state.setDiyetisyenStep);

  const danisanAvatarKey = useAppStore((state) => state.danisanAvatar);
  const diyetisyenAvatarKey = useAppStore((state) => state.diyetisyenAvatar);
  useEffect(() => {
    const loadStoredAvatars = async () => {
      const danisan = await AsyncStorage.getItem('danisanAvatar');
      const diyetisyen = await AsyncStorage.getItem('diyetisyenAvatar');

      if (danisan) useAppStore.getState().setDanisanAvatar(danisan);
      if (diyetisyen) useAppStore.getState().setDiyetisyenAvatar(diyetisyen);
    };

    loadStoredAvatars();
  }, []);


  const avatarImages: Record<string, any> = {
    // Danışan
    customergirl1: require('../../assets/avatars/customergirl1.png'),
    customergirl2: require('../../assets/avatars/customergirl2.png'),
    customergirl3: require('../../assets/avatars/customergirl3.png'),
    customerboy1: require('../../assets/avatars/customerboy1.png'),
    customerboy2: require('../../assets/avatars/customerboy2.png'),
    customerboy3: require('../../assets/avatars/customerboy3.png'),

    // Diyetisyen
    dietitiangirl1: require('../../assets/avatars/dietitiangirl1.png'),
    dietitiangirl2: require('../../assets/avatars/dietitiangirl2.png'),
    dietitiangirl3: require('../../assets/avatars/dietitiangirl3.png'),
    dietitianboy1: require('../../assets/avatars/dietitianboy1.png'),
    dietitianboy2: require('../../assets/avatars/dietitianboy2.png'),
    dietitianboy3: require('../../assets/avatars/dietitianboy3.png'),

    // Varsayılan
    default: require('../../assets/images/profil.jpg'),
  };

  const handleDanisanPress = () => {
    router.push('../screen/LoginCustomer');
  };

  const handleDiyetisyenPress = () => {
    setDiyetisyenStep('login');
    router.push('/screen/LoginDietitian');
  };

  const handleSelectAvatarPress = () => {
    router.push('/screen/SelectAvatarScreen');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      <StatusBar style="light" backgroundColor="#FFC0CB" translucent={true} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
          />

          <Text style={styles.title}>Profil Seçimi</Text>

          <View style={styles.profileRow}>
            <TouchableOpacity style={styles.profileCard} onPress={handleDanisanPress}>
              <Image
                source={avatarImages[danisanAvatarKey]}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>Danışan</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.profileCard} onPress={handleDiyetisyenPress}>
              <Image
                source={avatarImages[diyetisyenAvatarKey]}
                style={styles.profileImage}
              />
              <Text style={styles.profileName}>Diyetisyen</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.avatarButton} onPress={handleSelectAvatarPress}>
            <FontAwesome name="user-circle-o" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.avatarButtonText}>Avatarını Seç</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(194,185,125)',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 1000,
    height: 300,
    marginBottom: 10,
    marginTop: 10,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 30,
    color: 'rgb(194,185,125)',
    marginBottom: 50,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 0,
  },
  profileCard: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  profileImage: {
    width: 70,
    height: 100,
    borderRadius: 80,
    marginBottom: 5,
  },
  profileName: {
    color: 'rgb(194,185,125)',
    fontSize: 17,
    fontWeight: 'bold',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 40,
  },
  avatarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
