// components/recipes/RecipeCard.tsx

import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface RecipeCardProps {
  title: string;
  image: any;
  onPress: () => void;
}

export default function RecipeCard({ title, image, onPress }: RecipeCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={image} style={styles.image} />
      <View style={styles.overlay} />
      <Text style={styles.title}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 12,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  title: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
