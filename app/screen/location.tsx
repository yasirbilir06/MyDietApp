import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Location() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.replace('/')} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Klinik Adresi</Text>
      <Text style={styles.address}>
        Dyt. Ebrar Merve Gündüz Beslenme ve Diyet Kliniği{'\n'}
        Valikonağı Caddesi No:12{'\n'}
        Nişantaşı / İstanbul
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  address: { fontSize: 16, lineHeight: 24, color: '#444' },
});
