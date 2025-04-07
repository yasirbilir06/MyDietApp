// KiloTakibiScreen.tsx (Expo + React Native + Firestore + react-native-chart-kit)

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
// @ts-ignore
import { useNavigation } from '@react-navigation/native';

import { Ionicons } from '@expo/vector-icons';
import { BarChart } from 'react-native-chart-kit';
import { auth, firestore } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import moment from 'moment';

const screenWidth = Dimensions.get('window').width;

export default function WeightTracking() {
  const navigation = useNavigation();
  const [weightInput, setWeightInput] = useState('');
  const [weights, setWeights] = useState<{ [date: string]: number }>({});
  const [selectedRange, setSelectedRange] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('weekly');
  const [message, setMessage] = useState('');

  const userId = auth.currentUser?.uid;
  const today = moment().format('YYYY-MM-DD');

  const fetchWeights = async () => {
    if (!userId) return;
    const docRef = doc(firestore, 'weights', userId);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      const data = snapshot.data();
      setWeights(data);
    }
  };

  useEffect(() => {
    fetchWeights();
  }, []);

  const saveWeight = async () => {
    const weight = parseFloat(weightInput);
    if (!weight || !userId) return;

    if (weights[today]) {
      setMessage('✅ Bugün için zaten bir kilo bilgisi girdiniz.');
      return;
    }

    const updatedWeights = { ...weights, [today]: weight };
    setWeights(updatedWeights);
    setWeightInput('');
    setMessage('✅ Kilo bilginiz başarıyla kaydedildi!');

    const docRef = doc(firestore, 'weights', userId);
    await setDoc(docRef, updatedWeights);
  };

  const getFilteredData = () => {
    const sortedDates = Object.keys(weights).sort();
    let filtered: { date: string; weight: number }[] = [];

    switch (selectedRange) {
      case 'daily':
        filtered = sortedDates
          .filter(date => date === today)
          .map(date => ({ date, weight: weights[date] }));
        break;
      case 'weekly':
        filtered = sortedDates
          .filter(date => moment(date).isAfter(moment().subtract(7, 'days')))
          .map(date => ({ date, weight: weights[date] }));
        break;
      case 'monthly':
        filtered = sortedDates
          .filter(date => moment(date).isAfter(moment().subtract(30, 'days')))
          .map(date => ({ date, weight: weights[date] }));
        break;
      case 'yearly':
        filtered = sortedDates
          .filter(date => moment(date).isAfter(moment().subtract(365, 'days')))
          .map(date => ({ date, weight: weights[date] }));
        break;
    }

    return filtered;
  };

  const chartData = getFilteredData();
  const labels = chartData.map(item => moment(item.date).format('DD/MM'));
  const values = chartData.map(item => item.weight);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Kilo Takibi</Text>
      </View>

      <View style={styles.rangeSelector}>
        {['daily', 'weekly', 'monthly', 'yearly'].map(range => (
          <TouchableOpacity
            key={range}
            style={[styles.rangeButton, selectedRange === range && styles.activeRange]}
            onPress={() => setSelectedRange(range as any)}
          >
            <Text style={styles.rangeText}>{range.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <BarChart
        data={{ labels, datasets: [{ data: values }] }}
        width={screenWidth - 32}
        height={250}
        fromZero
        showValuesOnTopOfBars
        yAxisLabel=""
        yAxisSuffix="kg"
        chartConfig={{
          backgroundColor: '#1C1C1E',
          backgroundGradientFrom: '#1C1C1E',
          backgroundGradientTo: '#1C1C1E',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(191, 90, 242, ${opacity})`,
          labelColor: () => '#fff',
        }}
        style={{ marginVertical: 16, borderRadius: 12 }}
      />

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Kilonuzu girin"
          placeholderTextColor="#888"
          keyboardType="numeric"
          value={weightInput}
          onChangeText={setWeightInput}
        />
        <TouchableOpacity style={styles.saveButton} onPress={saveWeight}>
          <Text style={styles.saveButtonText}>Kaydet</Text>
        </TouchableOpacity>
      </View>

      {message !== '' && (
        <Text style={styles.infoMessage}>{message}</Text>
      )}

      <View style={styles.infoContainer}>
        <Text style={styles.infoTitle}>Kilo Hakkında</Text>
        <Text style={styles.infoText}>
          Kilo, vücut ağırlığınızı ifade eder ve beslenme, su tüketimi,
          egzersiz gibi faktörlerle günlük olarak değişebilir. Kilo takibi,
          sağlıklı yaşam hedeflerinizi izlemenize yardımcı olur.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#1C1C1E', flex: 1, padding: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginLeft: 12 },
  inputRow: { flexDirection: 'row', marginTop: 12 },
  input: {
    flex: 1,
    backgroundColor: '#2C2C2E',
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    marginRight: 8,
  },
  saveButton: {
    backgroundColor: '#BF5AF2',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 8,
  },
  saveButtonText: { color: '#fff', fontWeight: 'bold' },
  rangeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  rangeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#2C2C2E',
  },
  activeRange: {
    backgroundColor: '#BF5AF2',
  },
  rangeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  infoMessage: {
    color: '#FFD700',
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  infoContainer: {
    marginTop: 16,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
    padding: 12
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4
  },
  infoText: {
    color: '#9E9E9E',
    lineHeight: 20
  }
});