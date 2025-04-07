import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 👈 yönlendirme için

const { width } = Dimensions.get('window');

const images = [
  require('../../assets/images/smoothie1.jpg'),
];

export default function PracticalRecipes() {
  const router = useRouter(); // 👈 yönlendirme hook'u

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => router.push('/')} // 👈 Ana sayfaya yönlendir
        style={styles.back}
      >
        <Ionicons name="arrow-back" size={26} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>Smoothie Bowl Tarifi</Text>

      <Carousel
        loop
        width={width}
        height={250}
        autoPlay={true}
        data={images}
        scrollAnimationDuration={1000}
        renderItem={({ index }) => (
          <Image source={images[index]} style={styles.image} />
        )}
      />

      <Text style={styles.subtitle}>Malzemeler</Text>
      <View style={styles.section}>
        {[
          '2 yemek kaşığı yoğurt',
          '5 adet çilek (Donmuş)',
          'Yarım muz (Donmuş)',
          '2 yemek kaşığı granola',
          '1 tatlı kaşığı fıstık ezmesi',
          '2 adet çilek',
          '1 dilim ananas',
          'Yarım adet muz',
          '1 adet nar',
        ].map((item, index) => (
          <Text key={index} style={styles.item}>• {item}</Text>
        ))}
      </View>

      <Text style={styles.subtitle}>Yapılışı</Text>
      <View style={styles.section}>
        <Text style={styles.item}>1. Yoğurt ve donmuş meyveleri bir kaseye al.</Text>
        <Text style={styles.item}>2. Blender ile pürüzsüz kıvam alana kadar karıştır.</Text>
        <Text style={styles.item}>3. Karışımı kaseye al, üstüne granola, fıstık ezmesi ve meyveleri ekle.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  back: {
    margin: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'rgb(194,185,125)',
    marginBottom: 10,
  },
  image: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginTop: 20,
    color: '#444',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 10,
  },
  item: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
});
