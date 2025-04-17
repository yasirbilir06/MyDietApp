// components/recipes/RecipeTag.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface RecipeTagProps {
  label: string;
}

export default function RecipeTag({ label }: RecipeTagProps) {
  return (
    <View style={styles.tag}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    backgroundColor: '#e2d9c1',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5c4d1c',
  },
});
