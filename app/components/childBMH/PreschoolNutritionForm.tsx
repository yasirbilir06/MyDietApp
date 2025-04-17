import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { calculatePreschoolNutrition } from '../../utils/preschoolNutritionCalculations';

export default function PreschoolNutritionForm() {
  const [age, setAge] = useState('');
  const [results, setResults] = useState<any>(null);
  

  const handleCalculate = () => {
    const ageNum = parseInt(age);
    if (ageNum >= 1 && ageNum <= 10) {
      const needs = calculatePreschoolNutrition(ageNum);
      setResults(needs);
    } else {
      setResults(null);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.label}>Yaş (1–10):</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>HESAPLA</Text>
        </TouchableOpacity>

        {results && (
          <View style={styles.resultsBox}>
            <Text style={styles.resultTitle}>📊 Sonuçlar</Text>
            <Text style={styles.result}>Olması Gereken Ağırlık: {results.weight} kg</Text>
            <Text style={styles.result}>Olması Gereken Boy: {results.height.min}–{results.height.max} cm</Text>
            <Text style={styles.result}>Enerji Gereksinimi: {results.energy} kcal/gün</Text>
            <Text style={styles.result}>Protein Gereksinimi: {results.protein}</Text>
            <Text style={styles.result}>CHO Gereksinimi: {results.cho}</Text>
            <Text style={styles.result}>Yağ Gereksinimi: {results.fat}</Text>
            <Text style={styles.result}>Sıvı Gereksinimi: {results.fluid.min}–{results.fluid.max} mL/gün</Text>
            <Text style={styles.result}>Posa Gereksinimi: {results.fiber} g/gün</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  label: {
    fontSize: 16,
    marginTop: 8,
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    color: 'black',
  },
  button: {
    backgroundColor: '#6A0DAD',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultsBox: {
    backgroundColor: '#f4f4f4',
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6A0DAD',
    marginBottom: 10,
    textAlign: 'center',
  },
  result: {
    fontSize: 16,
    marginBottom: 4,
    color: '#444',
  },
  resultLine: {
    fontSize: 20,
    marginBottom: 4,
    color: '#444',
  },
  

});

