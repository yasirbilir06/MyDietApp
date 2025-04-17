import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { calculateWHO, calculateGrowthAddition, calculateIdealWeight, calculateBMI } from '../../utils/childBMHCalculations';

export default function WHOForm() {
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fa, setFa] = useState('1.0');
  const [isMale, setIsMale] = useState(true);

  const [bmi, setBmi] = useState(0);
  const [idealWeight, setIdealWeight] = useState(0);
  const [growth, setGrowth] = useState(0);
  const [total, setTotal] = useState(0);

  const handleCalculate = () => {
    const ageNum = parseFloat(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);
    const faNum = parseFloat(fa);

    const gender = isMale ? "male" : "female";
    const bmh = calculateWHO(ageNum, weightNum, gender);
    const growthAddition = calculateGrowthAddition(ageNum, weightNum);
    const ideal = calculateIdealWeight(ageNum);
    const bmiValue = calculateBMI(weightNum, heightNum);

    setBmi(bmiValue);
    setIdealWeight(ideal);
    setGrowth(growthAddition);
    setTotal((bmh + growthAddition) * faNum); // ✅ FA katsayısı uygulandı
  };

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <Text style={styles.label}>Yaş (yıl):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={age} onChangeText={setAge} />

        <Text style={styles.label}>Boy (cm):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={height} onChangeText={setHeight} />

        <Text style={styles.label}>Ağırlık (kg):</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={weight} onChangeText={setWeight} />

        <Text style={styles.label}>FA Katsayısı:</Text>
        <TextInput style={styles.input} keyboardType="numeric" value={fa} onChangeText={setFa} />

        <View style={styles.genderContainer}>
          <Text>Erkek</Text>
          <Switch 
          value={isMale}
           onValueChange={setIsMale}
           trackColor={{ false: '#ccc', true: '#6A0DAD' }} // koyu mor
            thumbColor="#fff"
           />
          <Text>Kız</Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleCalculate}>
          <Text style={styles.buttonText}>HESAPLA</Text>
        </TouchableOpacity>

        <Text style={[styles.result, { color: '#6A0DAD' }]}>BKI: {bmi.toFixed(1)} kg/m²</Text>
        <Text style={[styles.result, { color: '#6A0DAD' }]}>Ideal Ağırlık: {idealWeight.toFixed(1)} kg</Text>
        <Text style={[styles.result, { color: 'green' }]}>Büyüme Eki: {growth.toFixed(0)} kcal</Text>
        <Text style={[styles.result, { color: 'green' }]}>Gereksinim: {total.toFixed(1)} kcal</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  container: {
    padding: 16,
    paddingBottom: 80,
  }
});
