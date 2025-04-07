import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image,SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { useAppStore } from '../stores/appStore';




export default function ProfileSelectionScreen() {
  const router = useRouter();
  const setDiyetisyenStep = useAppStore((state) => state.setDiyetisyenStep);

  const handleDanisanPress = () => {
    // Danışan ekranına yönlendirme, global state değişmeden
    router.push('../screen/LoginCustomer');
  };

  const handleDiyetisyenPress = () => {
    // Diyetisyen butonuna basıldığında global state'i 'login' yapıyoruz
    setDiyetisyenStep('login');
    router.push('/screen/LoginDietitian');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
       <StatusBar style="light" backgroundColor="#FFC0CB" translucent={true} />
      
    <GestureHandlerRootView style={{ flex: 1 }}>
      
      <View style={styles.container}>
        
        {/* Üst Kısma Logo */}
        <Image
          source={require('../../assets/images/logo.png')} // ← Kendi logo yolunuzu ekleyin
          style={styles.logo}
        />

        {/* Başlık */}
        <Text style={styles.title}  >Profil Seçimi</Text>

        {/* Profil Seçimi Kartları */}
        <View style={styles.profileRow}>
          {/* Danışan Profili */}
          <TouchableOpacity style={styles.profileCard} onPress={handleDanisanPress}>
            <Image
              source={require('../../assets/images/profil.jpg')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>Danışan</Text>
          </TouchableOpacity>

          {/* Diyetisyen Profili */}
          <TouchableOpacity style={styles.profileCard} onPress={handleDiyetisyenPress}>
            <Image
              source={require('../../assets/images/profil.jpg')}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>Diyetisyen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </GestureHandlerRootView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'rgb(194,185,125)', // SafeAreaView arka planı pembe
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
    width: 100,
    height: 100,
    borderRadius: 100,
    marginBottom: 5,
  },
  profileName: {
    color: 'rgb(194,185,125)',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
