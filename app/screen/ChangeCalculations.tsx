import React, { useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from 'react-native';
import CustomTextInput from '../components/CustomTextInput';


const EXCHANGE_DATA = {
  sut: {
    cho: 9,
    protein: 6,
    fat: 6,
    kcal: 114,
    na: 100,
    k: 304,
    po4: 186,
    kolestrol: 25
  },
  sutYY: {
    cho: 9,
    protein: 6,
    fat: 3,
    kcal: 87,
    na: 102,
    k: 312,
    po4: 188,
    kolestrol: 12
  },
  yumurta: {
    cho: 0,
    protein: 6,
    fat: 5,
    kcal: 69,
    na: 69,
    k: 107,
    po4: 58,
    kolestrol: 200
  },
  et: {
    cho: 0,
    protein: 6,
    fat: 5,
    kcal: 69,
    na: 20,
    k: 107,
    po4: 58,
    kolestrol: 25
  },
  eyg: {
    cho: 15,
    protein: 2,
    fat: 0,
    kcal: 68,
    na: 1.25,
    k: 25,
    po4: 25,
    kolestrol: 0
  },
  sebze: {
    cho: 6,
    protein: 2,
    fat: 0,
    kcal: 32,
    na: 25,
    k: 400,
    po4: 40,
    kolestrol: 0
  },
  meyve: {
    cho: 15,
    protein: 0,
    fat: 0,
    kcal: 60,
    na: 2,
    k: 200,
    po4: 20,
    kolestrol: 0
  },
  yag: {
    cho: 0,
    protein: 0,
    fat: 5,
    kcal: 45,
    na: 0,
    k: 0,
    po4: 0,
    kolestrol: 0
  },
  seker: {
    // Şeker / Nişasta için örnek: 1 g CHO, 4 kcal
    cho: 1,
    protein: 0,
    fat: 0,
    kcal: 4,
    na: 0,
    k: 0,
    po4: 0,
    kolestrol: 0
  }
};


const ProgressBar = ({ percentage, color }: { percentage: number; color: string }) => (
  <View style={progressBarStyles.progressBarContainer}>
    <View style={[progressBarStyles.progressBarFill, { width: `${percentage}%`, backgroundColor: color }]} />
    <Text style={progressBarStyles.progressText}>{percentage.toFixed(1)}%</Text>
  </View>
);

const progressBarStyles = StyleSheet.create({
  progressBarContainer: {
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 4,
    justifyContent: 'center'
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 10
  },
  progressText: {
    position: 'absolute',
    alignSelf: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12
  }
});

export default function ChaengeCalculations() {

  const [sut, setSut] = useState('');
  const [sutYY, setSutYY] = useState('');
  const [yumurta, setYumurta] = useState('');
  const [et, setEt] = useState('');
  const [eyg, setEyg] = useState('');
  const [sebze, setSebze] = useState('');
  const [meyve, setMeyve] = useState('');
  const [yag, setYag] = useState('');
  const [seker, setSeker] = useState('');


  const [resultData, setResultData] = useState<null | {
    totalKcal: number;
    totalCho: number;
    totalProtein: number;
    totalFat: number;
    totalNa: number;
    totalK: number;
    totalPo4: number;
    totalKol: number;
    choPercent: number;
    proteinPercent: number;
    fatPercent: number;
  }>(null);

  const handleCalculate = () => {
  
    const sutVal = parseFloat(sut) || 0;
    const sutYYVal = parseFloat(sutYY) || 0;
    const yumurtaVal = parseFloat(yumurta) || 0;
    const etVal = parseFloat(et) || 0;
    const eygVal = parseFloat(eyg) || 0;
    const sebzeVal = parseFloat(sebze) || 0;
    const meyveVal = parseFloat(meyve) || 0;
    const yagVal = parseFloat(yag) || 0;
    const sekerVal = parseFloat(seker) || 0;

   
    let totalCho = 0;
    let totalProtein = 0;
    let totalFat = 0;
    let totalNa = 0;
    let totalK = 0;
    let totalPo4 = 0;
    let totalKol = 0;

    
    function addExchange(miktar: number, dataKey: keyof typeof EXCHANGE_DATA) {
      totalCho += miktar * EXCHANGE_DATA[dataKey].cho;
      totalProtein += miktar * EXCHANGE_DATA[dataKey].protein;
      totalFat += miktar * EXCHANGE_DATA[dataKey].fat;
      totalNa += miktar * EXCHANGE_DATA[dataKey].na;
      totalK += miktar * EXCHANGE_DATA[dataKey].k;
      totalPo4 += miktar * EXCHANGE_DATA[dataKey].po4;
      totalKol += miktar * EXCHANGE_DATA[dataKey].kolestrol;
    }

    addExchange(sutVal, 'sut');
    addExchange(sutYYVal, 'sutYY');
    addExchange(yumurtaVal, 'yumurta');
    addExchange(etVal, 'et');
    addExchange(eygVal, 'eyg');
    addExchange(sebzeVal, 'sebze');
    addExchange(meyveVal, 'meyve');
    addExchange(yagVal, 'yag');
    addExchange(sekerVal, 'seker');

    // Toplam enerji hesaplaması (makro bazlı)
    const totalKcal = (totalCho * 4) + (totalProtein * 4) + (totalFat * 9);
    // Makro yüzdeleri
    const choPercent = totalKcal > 0 ? (totalCho * 4 / totalKcal) * 100 : 0;
    const proteinPercent = totalKcal > 0 ? (totalProtein * 4 / totalKcal) * 100 : 0;
    const fatPercent = totalKcal > 0 ? (totalFat * 9 / totalKcal) * 100 : 0;

    // Sonuç verilerini state'e kaydet
    setResultData({
      totalKcal,
      totalCho,
      totalProtein,
      totalFat,
      totalNa,
      totalK,
      totalPo4,
      totalKol,
      choPercent,
      proteinPercent,
      fatPercent
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Değişim Hesaplama</Text>

      <CustomTextInput
  label="Süt Değişimi"
  value={sut}
  onChangeText={setSut}
  keyboardType="numeric"
/>

<CustomTextInput
  label="Süt (YY)"
  value={sutYY}
  onChangeText={setSutYY}
  keyboardType="numeric"
/>

<CustomTextInput
  label="Yumurta"
  value={yumurta}
  onChangeText={setYumurta}
  keyboardType="numeric"
/>

<CustomTextInput
  label="Et Değişimi"
  value={et}
  onChangeText={setEt}
  keyboardType="numeric"
/>

<CustomTextInput
  label="EYG Değişimi"
  value={eyg}
  onChangeText={setEyg}
  keyboardType="numeric"
/>

<CustomTextInput
  label="Sebze Değişimi"
  value={sebze}
  onChangeText={setSebze}
  keyboardType="numeric"
/>
<CustomTextInput
  label="Meyve Değişimi"
  value={meyve}
  onChangeText={setMeyve}
  keyboardType="numeric"
/>

<CustomTextInput
  label="Yağ Değişimi"
  value={yag}
  onChangeText={setYag}
  keyboardType="numeric"
/>

<CustomTextInput
  label="Şeker/Nişasta"
  value={seker}
  onChangeText={setSeker}
  keyboardType="numeric"
/>
      

      {/* Hesapla Butonu */}
      <TouchableOpacity style={styles.calculateButton} onPress={handleCalculate}>
        <Text style={styles.calculateButtonText}>Hesapla</Text>
      </TouchableOpacity>

      {/* Sonuç Gösterimi */}
      {resultData && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>
            Enerji (kcal): {resultData.totalKcal.toFixed(2)}
          </Text>
          <Text style={styles.resultText}>
            CHO: {resultData.totalCho.toFixed(2)} g
          </Text>
          <ProgressBar percentage={resultData.choPercent} color="#4a90e2" />

          <Text style={styles.resultText}>
            Protein: {resultData.totalProtein.toFixed(2)} g
          </Text>
          <ProgressBar percentage={resultData.proteinPercent} color="#50c878" />

          <Text style={styles.resultText}>
            Yağ: {resultData.totalFat.toFixed(2)} g
          </Text>
          <ProgressBar percentage={resultData.fatPercent} color="#f39c12" />

          <Text style={styles.resultText}>
            Na: {resultData.totalNa.toFixed(2)} mg
          </Text>
          <Text style={styles.resultText}>
            K: {resultData.totalK.toFixed(2)} mg
          </Text>
          <Text style={styles.resultText}>
            PO4: {resultData.totalPo4.toFixed(2)} mg
          </Text>
          <Text style={styles.resultText}>
            Kolesterol: {resultData.totalKol.toFixed(2)} mg
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// Stil tanımları
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f2f2f2'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333'
  },
  formCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    // Bu kısımda alignItems'ı kaldırıp, label ve input yan yana olacak
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  inputContainer: {
    flexDirection: 'row',      // Yanyana
    alignItems: 'center',      // Dikey ortalama
    justifyContent: 'space-between', // Label ve input arası boşluğu otomatik dağıt
    marginBottom: 12
  },
  label: {
    width: 120,                // Sabit genişlik
    fontSize: 14,
    color: '#333',
    fontWeight: '500'
  },
  input: {
    flex: 1,                   // Geri kalan alanı kaplasın
    height: 40,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 14,
    color: '#333',
    marginLeft: 8
  },
  calculateButton: {
    backgroundColor: 'rgb(194,185,125)',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  resultText: {
    fontSize: 16,
    color: '#333'
  }
});
