import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAppStore } from '../stores/appStore';

WebBrowser.maybeCompleteAuthSession();

export default function LoginCustomer() {
  const router = useRouter();
  const db = getFirestore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const avatarKey = useAppStore((state) => state.danisanAvatar);

  const avatarImages: Record<string, any> = {
    customergirl1: require('../../assets/avatars/customergirl1.png'),
    customergirl2: require('../../assets/avatars/customergirl2.png'),
    customergirl3: require('../../assets/avatars/customergirl3.png'),
    customerboy1: require('../../assets/avatars/customerboy1.png'),
    customerboy2: require('../../assets/avatars/customerboy2.png'),
    customerboy3: require('../../assets/avatars/customerboy3.png'),
    default: require('../../assets/images/profil.jpg'),
  };

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '785721866692-70basij134sm96sefuka34itfqd3v1nr.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@ebyas/MyDietApp',
  });

  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const { accessToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(null, accessToken);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role !== 'danisan') return;
          }
          const token = await userCredential.user.getIdToken();
          await AsyncStorage.setItem('danisanToken', token);
          router.push('/(tabs)/DanisanDrawerNavigator');
        })
        .catch(console.error);
    }
  }, [response]);

  const handleEmailPasswordLogin = async () => {
    if (!email || !password) {
      return Alert.alert('Hata', 'Lütfen e-posta ve şifrenizi girin.');
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        return Alert.alert(
          'E-posta Doğrulanmadı',
          'Lütfen e-posta adresinizi doğrulayın. Mail kutunuzu kontrol edin.'
        );
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.role !== 'danisan') return;
      }

      const token = await user.getIdToken();
      await AsyncStorage.setItem('danisanToken', token);
      router.push('/(tabs)/DanisanDrawerNavigator');
    } catch (error: any) {
      
      Alert.alert('Giriş Hatası', 'E-posta adresiniz veya şifreniz hatalı.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={avatarImages[avatarKey]} style={styles.avatar} />

      <View style={styles.card}>
        <Text style={styles.title}>Giriş Yap</Text>
        <TextInput
         style={styles.input}
         placeholder="E-posta"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Şifre"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleEmailPasswordLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screen/signUp')}>
          <Text style={styles.bottomText}>Hesabın yok mu? <Text style={{ fontWeight: 'bold' }}>Kayıt Ol</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/screen/ResetPassword')}>
          <Text style={[styles.bottomText, { marginTop: 6, fontSize: 13 }]}>Şifremi Unuttum</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245,243,234)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2e2e2e',
  },
  input: {
    backgroundColor: '#f3f3f3',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
    color: '#333',
  },
  loginButton: {
    backgroundColor: 'rgb(194,185,125)',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 16,
  },
  googleButtonText: {
    fontSize: 16,
    marginLeft: 8,
    color: '#333',
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  bottomText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
  },
});
