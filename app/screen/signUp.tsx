import React, { useState, useRef } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';

import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import CustomTextInput from '../components/CustomTextInput';

import PhoneInput from 'react-native-phone-number-input';

// Firebase Authentication
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';

// Firestore
import { getFirestore, doc, setDoc } from 'firebase/firestore';


export default function SignUpDanisan() {
  const router = useRouter();
  const db = getFirestore();
  const [role, setRole] = useState<'danisan' | 'diyetisyen' | ''>('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const phoneInput = useRef<any>(null);

  const handleBirthDateChange = (text: string) => {
    let formatted = text.replace(/\D/g, '');
    if (formatted.length > 2) {
      formatted = formatted.slice(0, 2) + '.' + formatted.slice(2);
    }
    if (formatted.length > 5) {
      formatted = formatted.slice(0, 5) + '.' + formatted.slice(5);
    }
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }
    setBirthDate(formatted);
  };

  const handleSignUp = async () => {
    if (!role) {
      Alert.alert('Hata', 'Lütfen kayıt türünüzü seçin!');
      return;
    }

    const phoneInfo = phoneInput.current?.getNumberAfterPossiblyEliminatingZero();
    const fullPhoneNumber = phoneInfo?.formattedNumber || '';

    if (password !== confirmPassword) {
      Alert.alert('Hata', 'Şifreler uyuşmuyor!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Kayıt başarılı (Auth):', userCredential.user.uid);

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        firstName,
        lastName,
        birthDate,
        email,
        phone: fullPhoneNumber,
        role,
        createdAt: new Date()
      });

      Alert.alert(
        'Kayıt Başarılı!',
        'Kayıt işleminiz başarıyla tamamlandı.',
        [
          {
            text: 'Tamam',
            onPress: () => {
              if (role === 'diyetisyen') {
                router.push('/screen/LoginDietitian');
              } else {
                router.push('/screen/LoginCustomer');
              }
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('Kayıt hatası:', error.message);
      Alert.alert('Hata', error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container} bounces={false}>
      
      {/* Geri Butonu */}
      <View style={{ alignSelf: 'flex-start', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Kayıt Ol</Text>

      {/* Rol Seçimi */}
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[styles.radioButton, role === 'danisan' && styles.radioButtonSelected]}
          onPress={() => setRole('danisan')}
        >
          <Text style={[styles.radioText, role === 'danisan' && styles.radioTextSelected]}>
            Danışan
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, role === 'diyetisyen' && styles.radioButtonSelected]}
          onPress={() => setRole('diyetisyen')}
        >
          <Text style={[styles.radioText, role === 'diyetisyen' && styles.radioTextSelected]}>
            Diyetisyen
          </Text>
        </TouchableOpacity>
      </View>

       
      <CustomTextInput
        label="İsim"
        value={firstName}
         onChangeText={setFirstName}
          />
        <CustomTextInput
          label="Soyisim"
          value={lastName}
           onChangeText={setLastName}
          />

      
         <TextInput
        style={styles.input}
        placeholder="Doğum Tarihi (GG.AA.YYYY)"
        value={birthDate}
        onChangeText={handleBirthDateChange}
        keyboardType="numeric"
        maxLength={10}
        
        />
        <CustomTextInput
        label="e-mail"
       value={email}
       onChangeText={setEmail}
       keyboardType='email-address'
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
        withShadow
        withDarkTheme={false}
        autoFocus={false}
      />

      <CustomTextInput
      label="Şifre"
      value={password}
      onChangeText={setPassword}
      />
      <CustomTextInput
      label="Şifre(Tekrar)"
      value={password}
      onChangeText={setPassword}

  
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Kayıt Ol</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgb(194,185,125)'
  },
  title: {
    fontSize: 24,
    color: '#FFF',
    marginBottom: 20,
    textAlign: 'center'
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 20
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 10
  },
  radioButtonSelected: {
    backgroundColor: '#FFF'
  },
  radioText: {
    color: '#FFF',
    fontSize: 16
  },
  radioTextSelected: {
    color: '#000'
  },
  input: {
    width: '80%',
    height: 48,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#FFF',
    color: '#000'
  },
  phoneContainer: {
    width: '80%',
    height: 48,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#FFF'
  },
  phoneTextContainer: {
    paddingVertical: 0,
    backgroundColor: '#FFF',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8
  },
  button: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 20,
    marginTop: 12
  },
  buttonText: {
    fontSize: 16,
    color: '#000'
  }
});
