// screens/recipes/RecipesListScreen.tsx

import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Text,TouchableOpacity} from 'react-native';
import { recipes } from '../../utils/recipes';
import RecipeCard from '../../components/recipes/RecipeCard';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function RecipesListScreen() {
  const router = useRouter();
 

  return (
    <SafeAreaView style={styles.container}>
    <TouchableOpacity onPress={() => router.push('/')} style={styles.back}>
  <Ionicons name="arrow-back" size={26} color="black" />
</TouchableOpacity>

      <Text style={styles.header}>🍽️ Pratik Tarifler</Text>
      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RecipeCard
            title={item.title}
            image={item.image}
            onPress={() =>
              router.push({
                pathname: '../recipes/RecipeDetailScreen',
                params: { id: item.id },
              })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    padding: 20,
    color: '#444',
  },
  back: {
    paddingHorizontal: 16,
    paddingTop: 8,
  }
  
});
