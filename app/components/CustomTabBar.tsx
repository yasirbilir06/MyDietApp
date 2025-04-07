import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function CustomTabBar() {
  const router = useRouter();

  return (
    <View style={styles.tabBarContainer}>
      <TouchableOpacity style={styles.iconContainer} onPress={() => router.replace('/(tabs)')}>
        <Ionicons name="home" size={26} color="#fff" />
        <Text style={styles.label}>Ana Sayfa</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => router.replace('/screen/PracticalRecipes')}>
        <FontAwesome6 name="bowl-food" size={24} color="white" />
        <Text style={styles.label}>Tarifler</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => router.replace('/screen/location')}>
        <FontAwesome name="location-arrow" size={24} color="white" />
        <Text style={styles.label}>Konum</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.iconContainer} onPress={() => router.replace('/screen/ Membership')}>
        <MaterialIcons name="payment" size={24} color="white" />
        <Text style={styles.label}>Premium</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 80,
    backgroundColor: 'rgb(194,185,125)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  iconContainer: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#fff',
    marginTop: 4,
  },
});
