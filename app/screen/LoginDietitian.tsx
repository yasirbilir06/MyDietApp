import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useAppStore } from '../stores/appStore';

export default function LoginDietitian() {
  const router = useRouter();
  const db = getFirestore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const dietitianAvatarKey = useAppStore((state) => state.diyetisyenAvatar);

  const avatarImages: Record<string, any> = {
    dietitiangirl1: require('../../assets/avatars/dietitiangirl1.png'),
    dietitiangirl2: require('../../assets/avatars/dietitiangirl2.png'),
    dietitiangirl3: require('../../assets/avatars/dietitiangirl3.png'),
    dietitianboy1: require('../../assets/avatars/dietitianboy1.png'),
    dietitianboy2: require('../../assets/avatars/dietitianboy2.png'),
    dietitianboy3: require('../../assets/avatars/dietitianboy3.png'),
    default: require('../../assets/images/profil.jpg'),
  };

  const handleEmailPasswordLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));

      if (!userDoc.exists()) {
        return Alert.alert('Hata', 'Kullanıcı bulunamadı.');
      }

      const role = userDoc.data().role;

      if (role === 'pending-diyetisyen') {
        return Alert.alert('Onay Bekleniyor', 'Hesabınız henüz yönetici tarafından onaylanmamış. Lütfen bekleyin.');
      }

      if (role !== 'diyetisyen') {
        return Alert.alert('Erişim Reddedildi', 'Bu giriş sadece diyetisyenler içindir.');
      }

      const token = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('diyetisyenToken', token);
      router.push('/(tabs)/DrawerNavigator');
    } catch (err: any) {
      Alert.alert('Giriş Hatası', 'E-posta adresiniz veya şifreniz hatalı.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Image source={avatarImages[dietitianAvatarKey]} style={styles.avatar} />

      <View style={styles.card}>
        <Text style={styles.title}>Giriş Yap</Text>

        <TextInput
          placeholder="E-posta"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          placeholder="Şifre"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <TouchableOpacity style={styles.loginButton} onPress={handleEmailPasswordLogin}>
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/screen/ResetPassword')}>
          <Text style={styles.forgotPassword}>Şifremi Unuttum</Text>
        </TouchableOpacity>

        <Text style={styles.signupText}>
          Hesabın yok mu?{' '}
          <Text style={styles.signupLink} onPress={() => router.push('/screen/signUp')}>
            Kayıt Ol
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7F2',
    alignItems: 'center',
    paddingTop: 120,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    width: '85%',
    padding: 24,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
  },
  input: {
    width: '100%',
    backgroundColor: '#F2F2F2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: 'rgb(194,185,125)',
    paddingVertical: 12,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotPassword: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    color: '#222',
    fontWeight: 'bold',
  },
});