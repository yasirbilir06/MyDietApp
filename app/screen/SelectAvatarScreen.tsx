import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../stores/appStore';

const dietitianAvatars = [
  { key: 'dietitiangirl1', source: require('../../assets/avatars/dietitiangirl1.png') },
  { key: 'dietitiangirl2', source: require('../../assets/avatars/dietitiangirl2.png') },
  { key: 'dietitiangirl3', source: require('../../assets/avatars/dietitiangirl3.png') },
  { key: 'dietitianboy1', source: require('../../assets/avatars/dietitianboy1.png') },
  { key: 'dietitianboy2', source: require('../../assets/avatars/dietitianboy2.png') },
  { key: 'dietitianboy3', source: require('../../assets/avatars/dietitianboy3.png') },
];

const customerAvatars = [
  { key: 'customergirl1', source: require('../../assets/avatars/customergirl1.png') },
  { key: 'customergirl2', source: require('../../assets/avatars/customergirl2.png') },
  { key: 'customergirl3', source: require('../../assets/avatars/customergirl3.png') },
  { key: 'customerboy1', source: require('../../assets/avatars/customerboy1.png') },
  { key: 'customerboy2', source: require('../../assets/avatars/customerboy2.png') },
  { key: 'customerboy3', source: require('../../assets/avatars/customerboy3.png') },
];

export default function SelectAvatarScreen() {
  const navigation = useNavigation();

  const [selectedDietitian, setSelectedDietitian] = useState<string | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const setDanisanAvatar = useAppStore((state) => state.setDanisanAvatar);
  const setDiyetisyenAvatar = useAppStore((state) => state.setDiyetisyenAvatar);

  const handleSave = () => {
    setDanisanAvatar(selectedCustomer || 'default');
    setDiyetisyenAvatar(selectedDietitian || 'default');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Geri Tuşu */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Profil Avatarınızı Seçin</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.sectionTitle}>Diyetisyen Avatarları</Text>
        <View style={styles.avatarGrid}>
          {dietitianAvatars.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.avatarBox, selectedDietitian === item.key && styles.selected]}
              onPress={() => setSelectedDietitian(item.key)}
            >
              <Image source={item.source} style={styles.avatar} />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Danışan Avatarları</Text>
        <View style={styles.avatarGrid}>
          {customerAvatars.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={[styles.avatarBox, selectedCustomer === item.key && styles.selected]}
              onPress={() => setSelectedCustomer(item.key)}
            >
              <Image source={item.source} style={styles.avatar} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Kaydet</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
    color: '#333',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  avatarBox: {
    margin: 8,
    padding: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    borderColor: 'rgb(194,185,125)',
  },
  avatar: {
    width: 90,
    height: 90,
    resizeMode: 'contain',
    borderRadius: 12,
  },
  saveButton: {
    marginTop: 30,
    backgroundColor: 'black',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 30,
    left: 20,
    zIndex: 10,
  },
});
