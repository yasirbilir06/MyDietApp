import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import PhoneInput from 'react-native-phone-number-input';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

export default function SignUpDanisan() {
  const router = useRouter();
  const db = getFirestore();
  const phoneInput = useRef<any>(null);

  const [role, setRole] = useState<'danisan' | 'diyetisyen' | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleBirthDateChange = (text: string) => {
    let formatted = text.replace(/\D/g, '');
    if (formatted.length > 2) formatted = formatted.slice(0, 2) + '.' + formatted.slice(2);
    if (formatted.length > 5) formatted = formatted.slice(0, 5) + '.' + formatted.slice(5);
    if (formatted.length > 10) formatted = formatted.slice(0, 10);
    setBirthDate(formatted);
  };

  const handleSignUp = async () => {
    if (!role) return Alert.alert('Hata', 'Lütfen kayıt türünüzü seçin!');
    const phoneInfo = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    const fullPhoneNumber = phoneInfo?.formattedNumber || '';

    if (password !== confirmPassword) {
      return Alert.alert('Hata', 'Şifreler uyuşmuyor!');
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        birthDate,
        email,
        phone: fullPhoneNumber,
        role,
        createdAt: new Date(),
      });

      Alert.alert('Kayıt Başarılı!', 'Kayıt işleminiz başarıyla tamamlandı.', [
        {
          text: 'Tamam',
          onPress: () => {
            router.push(role === 'diyetisyen' ? '/screen/LoginDietitian' : '/screen/LoginCustomer');
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container} bounces={false}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#000" />
        </TouchableOpacity>

        <View style={styles.card}>
          <Text style={styles.title}>Kayıt Ol</Text>

          <View style={styles.radioContainer}>
            <TouchableOpacity
              style={[styles.radioButton, role === 'danisan' && styles.radioSelected]}
              onPress={() => setRole('danisan')}
            >
              <Text style={[styles.radioText, role === 'danisan' && styles.radioTextSelected]}>Danışan</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, role === 'diyetisyen' && styles.radioSelected]}
              onPress={() => setRole('diyetisyen')}
            >
              <Text style={[styles.radioText, role === 'diyetisyen' && styles.radioTextSelected]}>Diyetisyen</Text>
            </TouchableOpacity>
          </View>

          <TextInput style={styles.input} placeholder="İsim" value={firstName} onChangeText={setFirstName} />
          <TextInput style={styles.input} placeholder="Soyisim" value={lastName} onChangeText={setLastName} />
          <TextInput
            style={styles.input}
            placeholder="Doğum Tarihi (GG.AA.YYYY)"
            value={birthDate}
            onChangeText={handleBirthDateChange}
            keyboardType="numeric"
            maxLength={10}
          />
          <TextInput
            style={styles.input}
            placeholder="e-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PhoneInput
            ref={phoneInput}
            defaultValue={phone}
            defaultCode="TR"
            layout="first"
            onChangeFormattedText={setPhone}
            containerStyle={styles.phoneContainer}
            textContainerStyle={styles.phoneTextContainer}
            textInputStyle={{ color: '#000' }}
            codeTextStyle={{ color: '#000' }}
            countryPickerButtonStyle={{ marginLeft: 8 }}
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Şifre (Tekrar)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleSignUp}>
            <Text style={styles.registerText}>Kayıt Ol</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f5f2',
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginTop: 40,
    marginBottom: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'center',
    marginBottom: 20,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radioButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 10,
  },
  radioSelected: {
    backgroundColor: 'rgb(194,185,125)',
    borderColor: 'rgb(194,185,125)',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 48,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 12,
    marginBottom: 12,
    color: '#000',
  },
  phoneContainer: {
    width: '100%',
    height: 48,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
  phoneTextContainer: {
    backgroundColor: '#f9f9f9',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  registerButton: {
    marginTop: 20,
    backgroundColor: 'rgb(194,185,125)',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  registerText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
