import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import CustomTextInput from '../components/CustomTextInput';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      return Alert.alert('Hata', 'Lütfen e-posta adresinizi girin.');
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Şifre Sıfırlama Gönderildi',
        'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi.',
        [{ text: 'Tamam', onPress: () => router.back() }]
      );
    } catch (error: any) {
      let message = 'Bir hata oluştu.';
      if (error.code === 'auth/user-not-found') {
        message = 'Bu e-posta ile kayıtlı bir kullanıcı bulunamadı.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Geçersiz e-posta adresi.';
      }
      Alert.alert('Hata', message);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Şifremi Unuttum</Text>
      <Text style={styles.description}>Lütfen kayıtlı e-posta adresinizi girin. Şifre sıfırlama bağlantısı gönderilecektir.</Text>

      <CustomTextInput
  label=""
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  placeholder='e-posta'
  autoCapitalize="none"
  autoCorrect={false}
  
/>

      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Gönder</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(245,243,234)',
    padding: 24,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'rgb(194,185,125)',
    padding: 13,
    marginLeft:50,
    marginRight:50,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
