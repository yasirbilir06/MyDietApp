import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function MembershipScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.push("/"); 
  };

  return (
    <View style={styles.container}>
      {/* Geri Tuşu */}
      <TouchableOpacity onPress={handleBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>💎 Premium Üyelik</Text>
      <Text style={styles.description}>
        • Reklamsız deneyim ✅{"\n"}
        • Özel tarifler ✅{"\n"}
        • Diyetisye-Danışan Mesajlaşma ✅
      </Text>

      {/* Geçici butonlar (şimdilik işlevsiz) */}
      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Aylık Üye Ol - 19,99 TL</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Yıllık Üye Ol - 149,99 TL</Text>
      </TouchableOpacity>

      <Text style={styles.note}>📌 Üyelik sistemi yayın sonrası aktif edilecektir.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
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
    textAlign: 'center',
  },
});
