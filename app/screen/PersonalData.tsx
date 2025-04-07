import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function PersonalData() {
  const navigation = useNavigation();

  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [userData, setUserData] = useState<{ gender?: string; height?: string; activityLevel?: string }>({});
  const [openActivity, setOpenActivity] = useState(false);
  const [openGender, setOpenGender] = useState(false);

  const explanations: Record<string, string> = {
    'Hafif Düzey':
      'Yavaş yürüüyüş\nHafif ev işleri (toz alma, bulaşık yıkama vb.)\nOfis işleri (masa başı çalışma)\nHafif yoga veya esneme egzersizleri',
    'Orta Düzey':
      'Tempolu yürüüyüş (5 km/saat civarı)\nBisiklete binme (orta hızda)\nBahçe işleri (çim biçme vb.)\nDans etmek (orta tempoda)\nPilates veya orta yoga\nHafif koşu (jogging)',
    'Yoğun Düzey':
      'Hızlı koşu\nTakım sporları (futbol, basketbol)\nYüzme (tempolu veya hızlı)\nAerobik egzersizler\nFitness, crossfit'
  };

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const userRef = doc(firestore, 'users', userId);
      const snapshot = await getDoc(userRef);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setUserData({
          gender: data.gender || '',
          height: data.height || '',
          activityLevel: data.activityLevel || ''
        });
        setGender(data.gender || '');
        setHeight(data.height || '');
        setActivityLevel(data.activityLevel || '');
      }
    };
    fetchData();
  }, []);

  const handleSave = async () => {
    if (!userId) return;

    if (!gender || !height || !activityLevel) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    const userRef = doc(firestore, 'users', userId);
    await updateDoc(userRef, {
      gender,
      height,
      activityLevel
    });
    setUserData({ gender, height, activityLevel });
    Alert.alert('Başarılı', 'Veriler kaydedildi.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>KİŞİSEL VERİLER</Text>

      <Text style={styles.label}>Cinsiyetiniz:</Text>
      <DropDownPicker
        items={[
          { label: 'Erkek', value: 'Erkek' },
          { label: 'Kadın', value: 'Kadın' }
        ]}
        value={gender}
        setValue={setGender}
        open={openGender}
        setOpen={setOpenGender}
        placeholder="Cinsiyet seçin"
        style={styles.dropdown}
        listMode="MODAL"
      />

      <Text style={styles.label}>Boyunuzu girin (cm):</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: 175"
        keyboardType="numeric"
        value={height}
        onChangeText={text => {
          if (/^\d*$/.test(text)) setHeight(text);
        }}
      />

      <Text style={styles.label}>Fiziksel Aktivite Düzeyi:</Text>
      <DropDownPicker
        items={[
          { label: 'Hafif Düzey', value: 'Hafif Düzey' },
          { label: 'Orta Düzey', value: 'Orta Düzey' },
          { label: 'Yoğun Düzey', value: 'Yoğun Düzey' }
        ]}
        value={activityLevel}
        setValue={setActivityLevel}
        open={openActivity}
        setOpen={setOpenActivity}
        placeholder="Bir seviye seçin"
        style={styles.dropdown}
        listMode="MODAL"
      />

      {activityLevel && explanations[activityLevel] && (
        <View style={styles.explanationBox}>
          <Text style={styles.explanationTitle}>Seçilen Aktivite Açıklaması:</Text>
          <Text style={styles.explanationText}>{explanations[activityLevel]}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Kaydet</Text>
      </TouchableOpacity>

      {userData.gender && userData.height && userData.activityLevel && (
        <View style={styles.summaryBox}>
          <Text style={styles.summaryText}>Cinsiyet: {userData.gender}</Text>
          <Text style={styles.summaryText}>Boyunuz: {userData.height} cm</Text>
          <Text style={styles.summaryText}>Aktivite Düzeyi: {userData.activityLevel}</Text>
        </View>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fefefe'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
    textTransform: 'uppercase'
  },
  label: {
    fontSize: 16,
    marginTop: 16,
    color: '#444'
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    backgroundColor: '#fff'
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 10,
    borderColor: '#bbb'
  },
  explanationBox: {
    marginTop: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 12
  },
  explanationTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    fontSize: 15,
    color: '#333'
  },
  explanationText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#444'
  },
  button: {
    backgroundColor: '#c2b97d',
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  summaryBox: {
    marginTop: 20,
    backgroundColor: '#f1f1f1',
    padding: 14,
    borderRadius: 10
  },
  summaryText: {
    fontSize: 15,
    marginBottom: 4,
    color: '#333'
  }
});
