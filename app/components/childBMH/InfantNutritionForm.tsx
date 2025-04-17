import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import {
  calculateExpectedWeight,
  calculateInfantNutritionNeeds,
  FeedingType
} from '../../utils/infantNutritionCalculations';


export default function InfantNutritionForm() {
  const [month, setMonth] = useState('');
  const [birthWeight, setBirthWeight] = useState('');
  const [isMixedFeeding, setIsMixedFeeding] = useState(true);

  const [expectedWeight, setExpectedWeight] = useState(0);
  const [energy, setEnergy] = useState(0);
  const [protein, setProtein] = useState(0);
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState(''); // artık string olacak

  const [fluid, setFluid] = useState({ min: 0, max: 0 });

  const handleCalculate = () => {
    const monthNum = parseInt(month);
    const birthWeightNum = parseInt(birthWeight);
    const feedingType: FeedingType = isMixedFeeding ? "formül" : "karışık";

    const expected = calculateExpectedWeight(monthNum, birthWeightNum);

    const needs = calculateInfantNutritionNeeds(monthNum, expected, feedingType);

    setExpectedWeight(expected);
    setEnergy(needs.energy);
    setProtein(needs.protein);
    setCarbs(needs.carbs);
    setFat(needs.fat);
    setFluid(needs.fluid);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.label}>Ay (1–12):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={month} onChangeText={setMonth} />

        <Text style={styles.label}>Doğum Ağırlığı (gram):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={birthWeight} onChangeText={setBirthWeight} />

        <View style={styles.genderContainer}>
          <Text>Karışık</Text>
          <Switch value={isMixedFeeding} onValueChange={setIsMixedFeeding}
          trackColor={{ false: '#ccc', true: '#6A0DAD' }} // koyu mor
          thumbColor="#fff" />
          <Text>Formül</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>HESAPLA</Text>
        </TouchableOpacity>

        <View style={styles.resultCard}>
  <Text style={styles.resultTitle}>📊 Sonuçlar </Text>

  <Text style={styles.resultLine}> Olması Gereken Ağırlık: <Text style={styles.value}>{expectedWeight} g</Text></Text>
  <Text style={styles.resultLine}> Enerji Gereksinimi: <Text style={styles.value}>{energy} kcal/gün</Text></Text>
  <Text style={styles.resultLine}> Protein Gereksinimi: <Text style={styles.value}>{protein} g/gün</Text></Text>
  <Text style={styles.resultLine}> CHO Gereksinimi: <Text style={styles.value}>{carbs}</Text></Text>
  <Text style={styles.resultLine}> Yağ Gereksinimi: <Text style={styles.value}>{fat}</Text></Text>
  <Text style={styles.resultLine}> Sıvı Gereksinimi: <Text style={styles.value}>{fluid.min}–{fluid.max} mL/gün</Text></Text>
</View>

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
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    gap: 12,
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
  result: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  resultCard: {
    backgroundColor: '#f4f4f4',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#6A0DAD',
    marginBottom: 10,
    textAlign: 'center',
  },
  
  resultLine: {
    fontSize: 16,
    marginBottom: 4,
    color: '#444',
  },
  
  value: {
    fontWeight: 'bold',
    color: '#000',
  },
  
});
