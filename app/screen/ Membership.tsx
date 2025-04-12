// screen/Membership.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';

export default function MembershipScreen() {
  const db = getFirestore();
  const router = useRouter();

  const handleSubscribe = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        isPremium: true,
      });
      Alert.alert('Başarılı 🎉', 'Premium üyelik aktif edildi.');
      router.back();
    } catch (error) {
      console.error('Premium üyelik güncellenemedi:', error);
      Alert.alert('Hata', 'Bir şeyler ters gitti. Lütfen tekrar deneyin.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💎 Premium Üyelik</Text>
      <Text style={styles.description}>• Reklamsız deneyim{"\n"}• Özel tarifler{"\n"}• Öncelikli destek</Text>

      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Aylık Üye Ol - 19,99 TL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleSubscribe}>
        <Text style={styles.buttonText}>Yıllık Üye Ol - 149,99 TL</Text>
      </TouchableOpacity>

      <Text style={styles.note}>📌 Üyelik sistemi yakında aktif olacaktır.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(194,185,125)',
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: 'rgb(194,185,125)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  note: {
    marginTop: 16,
    fontStyle: 'italic',
    color: '#666',
  },
});
