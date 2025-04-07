import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { NavigationProp } from '@react-navigation/native';

// Navigasyon yığını için ekran tiplerini tanımlıyoruz.
type RootStackParamList = {
  BMHHesaplama: undefined;
  DegisimHesaplama: undefined;
};

interface CalculationsScreenProps {
  navigation: NavigationProp<RootStackParamList>;
}

export default function CalculationsScreen({ navigation }: CalculationsScreenProps) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hesaplamalar</Text>

      {/* BMH Hesaplama Kartı */}
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => navigation.navigate('BMHHesaplama')}
      >
        <LinearGradient colors={['#f7f3e9', '#e2d2b4']} style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image source={require('../../assets/images/calculation_2.png')} style={styles.profileImage} />
            <Text style={styles.profileName}>BMH Hesaplama</Text>
            <Text style={styles.profileSubtitle}>Bazal Metabolizma Hızı</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Değişim Hesaplama Kartı */}
      <TouchableOpacity
        style={styles.cardWrapper}
        onPress={() => navigation.navigate('DegisimHesaplama')}
      >
        <LinearGradient colors={['#f7f3e9', '#e2d2b4']} style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image source={require('../../assets/images/calculation.png')} style={styles.profileImage} />
            <Text style={styles.profileName}>Değişim Hesaplama</Text>
            <Text style={styles.profileSubtitle}>Makro ve kalori dönüşümleri</Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'flex-start',
    color: '#333',
  },
  cardWrapper: {
    width: '100%',
    marginBottom: 16,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    marginBottom: 12,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  profileSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666',
  },
});
