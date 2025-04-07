import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Membership() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Geri Butonu */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
  <Ionicons name="arrow-back" size={28} color="#000" />
</TouchableOpacity>


      <Text style={styles.title}>💎 Premium Üyelik</Text>
      <Text style={styles.description}>• Reklamsız deneyim{'\n'}• Özel tarifler{'\n'}• Öncelikli destek</Text>

      {/* Üyelik Butonları (Henüz işlevsiz) */}
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Aylık Üye Ol - 19,99 TL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Yıllık Üye Ol - 149,99 TL</Text>
      </TouchableOpacity>

      <Text style={styles.note}>
        📌 Üyelik sistemi yakında aktif olacaktır.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'rgb(194,185,125)',
    marginBottom: 16,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#000',
  },
  button: {
    backgroundColor: 'rgb(194,185,125)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 15,
    width: '90%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  note: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
  },
});
