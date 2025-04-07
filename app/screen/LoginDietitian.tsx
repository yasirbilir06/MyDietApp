import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

export default function LoginDietitian() {
  const router = useRouter();
  const db = getFirestore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Google Auth Request hook'u ile OAuth isteği oluşturuyoruz:
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '785721866692-70basij134sm96sefuka34itfqd3v1nr.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@ebyas/MyDietApp',
  });

  // Google ile giriş yapıldığında Firestore'dan rol kontrolü
  useEffect(() => {
    if (response?.type === 'success' && response.authentication?.accessToken) {
      const { accessToken } = response.authentication;
      const credential = GoogleAuthProvider.credential(null, accessToken);
      signInWithCredential(auth, credential)
        .then(async (userCredential) => {
          console.log('Google ile giriş başarılı:', userCredential.user);
          // Firestore'dan kullanıcının verilerini çek
          const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.role !== 'diyetisyen') {
              Alert.alert('Hata', 'Bu hesap diyetisyen hesabı değildir!');
              return;
            }
          } else {
            Alert.alert('Hata', 'Kullanıcı verileri bulunamadı.');
            return;
          }
          const token = await userCredential.user.getIdToken();
          await AsyncStorage.setItem('diyetisyenToken', token);
          router.push('/(tabs)/DrawerNavigator');
        })
        .catch((error) => {
          console.error('Firebase girişi hatası:', error);
          Alert.alert('Giriş Hatası', error.message);
        });
    }
  }, [response]);

  // E-posta/Şifre ile girişte Firestore'dan rol kontrolü
  const handleEmailPasswordLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('E-posta/Şifre ile giriş başarılı:', userCredential.user);
      // Firestore'dan kullanıcının verilerini çek
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.role !== 'diyetisyen') {
          Alert.alert('Hata', 'Bu hesap diyetisyen hesabı değildir!');
          return;
        }
      } else {
        Alert.alert('Hata', 'Kullanıcı verileri bulunamadı.');
        return;
      }
      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('diyetisyenToken', token);
      router.push('/(tabs)/DrawerNavigator');
    } catch (error: any) {
      console.error('E-posta/Şifre ile giriş hatası:', error.message);
      Alert.alert('Giriş Hatası', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login Diyetisyen</Text>
      
      <TextInput
        style={styles.input}
        placeholder="E-posta"
        placeholderTextColor="#FFF"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Şifre"
        placeholderTextColor="#FFF"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* E-posta/Şifre ile Giriş Yap Butonu */}
      <TouchableOpacity style={styles.loginButton} onPress={handleEmailPasswordLogin}>
        <Text style={styles.loginButtonText}>Giriş Yap</Text>
      </TouchableOpacity>

      {/* Google ile Giriş Yap Butonu (ikon ekli) */}
      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => promptAsync()}
        disabled={!request}
      >
        <Ionicons name="logo-google" size={24} color="#FFF" style={{ marginRight: 8 }} />
        <Text style={styles.googleButtonText}>Google ile Giriş Yap</Text>
      </TouchableOpacity>

      {/* Kayıt Ol Butonu */}
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => router.push('/screen/signUp')}
      >
        <Text style={styles.signupButtonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'rgb(194,185,125)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 16 
  },
  title: { 
    fontSize: 24, 
    color: '#FFF', 
    marginBottom: 20 
  },
  input: { 
    width: '80%',
    height: 48,
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    color: '#FFF'
  },
  loginButton: {
    width: '80%',
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12
  },
  loginButtonText: {
    color: '#FFF',
    fontSize: 16
  },
  googleButton: {
    width: '80%',
    backgroundColor: '#4285F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12
  },
  googleButtonText: {
    color: '#FFF',
    fontSize: 16
  },
  signupButton: {
    width: '80%',
    backgroundColor: '#800080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  signupButtonText: {
    color: '#FFF',
    fontSize: 16
  }
});
