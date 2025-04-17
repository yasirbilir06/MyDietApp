// screens/recipes/RecipeDetailScreen.tsx

import React from 'react';
import {
  View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Carousel from 'react-native-reanimated-carousel';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { recipes } from '../../utils/recipes';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // URL'den id çekiyoruz

  const recipe = recipes.find(r => r.id === id);

  if (!recipe) return <Text>Tarif bulunamadı.</Text>;

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Ionicons name="arrow-back" size={26} color="black" />
      </TouchableOpacity>

      <Text style={styles.title}>{recipe.title}</Text>

      <Carousel
        loop
        width={width}
        height={250}
        autoPlay
        data={[recipe.image]}
        scrollAnimationDuration={1000}
        renderItem={() => (
          <Image source={recipe.image} style={styles.image} />
        )}
      />

      <Text style={styles.subtitle}>Malzemeler</Text>
      <View style={styles.section}>
        {recipe.ingredients.map((item, index) => (
          <Text key={index} style={styles.item}>• {item}</Text>
        ))}
      </View>

      <Text style={styles.subtitle}>Yapılışı</Text>
      <View style={styles.section}>
        {recipe.steps.map((step, index) => (
          <Text key={index} style={styles.item}>{index + 1}. {step}</Text>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  back: { margin: 16 },
  title: {
    fontSize: 24, fontWeight: 'bold', textAlign: 'center',
    color: 'rgb(194,185,125)', marginBottom: 10,
  },
  image: { width, height: 250, resizeMode: 'cover' },
  subtitle: {
    fontSize: 20, fontWeight: 'bold', marginHorizontal: 16,
    marginTop: 20, color: '#444',
  },
  section: { paddingHorizontal: 16, marginTop: 10 },
  item: { fontSize: 16, marginBottom: 8, color: '#333' },
});
