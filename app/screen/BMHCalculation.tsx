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

/**
 * WHO formülü: Yaşa ve cinsiyete göre farklı hesaplamalar
 */
function calculateWHOBMR(age: number, weight: number, isMale: boolean) {
  let whoBMR = 0;

  if (isMale) {
    // Erkek
    if (age >= 0 && age < 3) {
      whoBMR = 60.9 * weight - 54;
    } else if (age >= 3 && age < 10) {
      whoBMR = 22.7 * weight + 495;
    } else if (age >= 10 && age < 18) {
      whoBMR = 17.5 * weight + 651;
    } else if (age >= 18 && age < 30) {
      whoBMR = 15.3 * weight + 679;
    } else if (age >= 30 && age < 60) {
      whoBMR = 11.6 * weight + 879;
    } else if (age >= 60) {
      whoBMR = 11.7 * weight + 585;
    }
  } else {
    // Kadın
    if (age >= 0 && age < 3) {
      whoBMR = 61.0 * weight - 51;
    } else if (age >= 3 && age < 10) {
      whoBMR = 22.5 * weight + 499;
    } else if (age >= 10 && age < 18) {
      whoBMR = 12.2 * weight + 746;
    } else if (age >= 18 && age < 30) {
      whoBMR = 14.7 * weight + 496;
    } else if (age >= 30 && age < 60) {
      whoBMR = 8.7 * weight + 829;
    } else if (age >= 60) {
      whoBMR = 9.0 * weight + 656;
    }
  }

  return whoBMR;
}

/**
 * Mifflin-St. Jeor formülü
 */
function calculateMifflinBMR(age: number, weight: number, height: number, isMale: boolean) {
  if (isMale) {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Harris-Benedict
function calculateHarrisBenedict(age: number, weight: number, height: number, isMale: boolean) {
  if (isMale) {
    // Erkek
    return 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
  } else {
    // Kadın
    return 655.1 + (9.563 * weight) + (1.85 * height) - (4.676 * age);
  }
}

function calculateSchofield(age: number, weight: number, isMale: boolean) {
  let schofieldBMR = 0;
  
  if (isMale) {
    if (age >= 15 && age <= 17) {
      schofieldBMR = 17.686 * weight + 658.2;
    } else if (age >= 18 && age <= 29) {
      schofieldBMR = 15.057 * weight + 692.2;
    } else if (age >= 30 && age <= 59) {
      schofieldBMR = 11.47 * weight + 873.1;
    } else if (age >= 60) {
      schofieldBMR = 11.711 * weight + 587.7;
    }
  } else {
    if (age >= 15 && age <= 17) {
      schofieldBMR = 13.384 * weight + 692.6;
    } else if (age >= 18 && age <= 29) {
      schofieldBMR = 14.818 * weight + 486.6;
    } else if (age >= 30 && age <= 59) {
      schofieldBMR = 8.126 * weight + 845.6;
    } else if (age >= 60) {
      schofieldBMR = 9.082 * weight + 658.5;
    }
  }
  
  return schofieldBMR;
}

/**
 * BMI (BKI) hesaplama
 */
function calculateBMI(weight: number, heightCm: number) {
  // boy (m) = heightCm / 100
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

/**calculateIdealWeight
 * Devine Formülüyle ideal ağırlık hesaplama
 */
function calculateIdealWeightByAge(heightCm: number, age: number): number {
    // Boyu metre cinsine çevir
    const heightM = heightCm / 100;
  
    // Yaş aralıklarına göre ortalama BKİ değerleri (örnek tablo)
    let averageBMI = 0;
    if (age >= 19 && age <= 24) {
      averageBMI = 21;
    } else if (age >= 25 && age <= 34) {
      averageBMI = 22;
    } else if (age >= 35 && age <= 44) {
      averageBMI = 23;
    } else if (age >= 45 && age <= 54) {
      averageBMI = 24;
    } else if (age >= 55 && age <= 64) {
      averageBMI = 25;
    } else if (age >= 65) {
      averageBMI = 26;
    } else {
      // 19 yaş altı tablo dışı, geçici bir değer:
      averageBMI = 21;
    }
  
    // İdeal Ağırlık (kg) = Ortalama BKİ * (Boy(m))²
    return averageBMI * (heightM ** 2);
  }

export default function BMHCalculation() {
  const [yas, setYas] = useState('');
  const [boy, setBoy] = useState('');
  const [agirlik, setAgirlik] = useState('');
  const [faKatsayisi, setFaKatsayisi] = useState<string>('1.2');
  const [cinsiyet, setCinsiyet] = useState<'male' | 'female'>('male');
  const [sonuc, setSonuc] = useState('');
  

  const handleCalculate = () => {
    const ageVal = parseInt(yas, 10);
    const heightVal = parseFloat(boy);
    const weightVal = parseFloat(agirlik);
    const faVal = parseFloat(faKatsayisi);
    const harrisBenedictBMR = calculateHarrisBenedict(
      ageVal,
      weightVal,
      heightVal,
      cinsiyet === 'male'
    );
    const schofieldBMR = calculateSchofield(
      ageVal,
      weightVal,
      cinsiyet === 'male'
    );
    const harrisBenedictTDEE = harrisBenedictBMR * faVal;
const schofieldTDEE = schofieldBMR * faVal;

    

    if (isNaN(ageVal) || isNaN(heightVal) || isNaN(weightVal)) {
      setSonuc('Lütfen geçerli değerler giriniz.');
      return;
    }

    // Mifflin BMR
    const mifflinBMR = calculateMifflinBMR(ageVal, weightVal, heightVal, cinsiyet === 'male');

    // WHO BMR (yaş aralıklarına göre)
    const whoBMR = calculateWHOBMR(ageVal, weightVal, cinsiyet === 'male');

    // TDEE (FA katsayısı girilmişse)
    let mifflinTDEE = 0;
    let whoTDEE = 0;
    if (!isNaN(faVal)) {
      mifflinTDEE = mifflinBMR * faVal;
      whoTDEE = whoBMR * faVal;
    }

    // BMI (BKI)
    const bmi = calculateBMI(weightVal, heightVal);

    // İdeal Ağırlık (Devine)
    const idealWeight = calculateIdealWeightByAge(heightVal, ageVal);


    const resultText = `

    BMI (BKI): ${bmi.toFixed(2)}
İdeal Ağırlık (Devine): ${idealWeight.toFixed(2)} kg

WHO'ya Göre :
  BMH: ${whoBMR.toFixed(2)} kcal
  TDEE: ${whoTDEE > 0 ? whoTDEE.toFixed(2) + ' kcal' : 'FA katsayısı girilmedi'}

Harris-Benedict:
  BMH: ${harrisBenedictBMR.toFixed(2)} kcal
  TDEE: ${harrisBenedictTDEE.toFixed(2)} kcal

Schofield:
  BMH: ${schofieldBMR.toFixed(2)} kcal
  TDEE: ${schofieldTDEE.toFixed(2)} kcal

  Mifflin'e Göre:
  BMH: ${mifflinBMR.toFixed(2)} kcal
  TDEE: ${mifflinTDEE > 0 ? mifflinTDEE.toFixed(2) + ' kcal' : 'FA katsayısı girilmedi'}



    `;

    

    setSonuc(resultText.trim());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>BMH Hesaplama</Text>

      <CustomTextInput
  label="Yaş"
  value={yas}
  onChangeText={setYas}
  keyboardType="numeric"
/>
<CustomTextInput
  label="Boy"
  value={boy}
  onChangeText={setBoy}
  keyboardType="numeric"
/>
<CustomTextInput
  label="Ağırlık"
  value={agirlik}
  onChangeText={setAgirlik}
  keyboardType="numeric"
/>
<CustomTextInput
  label="F.A Katsayısı"
  value={faKatsayisi}
  onChangeText={setFaKatsayisi}
  keyboardType="decimal-pad"
/>


      {/* Cinsiyet Seçimi */}
      <View style={styles.genderContainer}>
        <TouchableOpacity
          style={[
            styles.genderButton, 
            cinsiyet === 'male' && styles.genderButtonActive
          ]}
          onPress={() => setCinsiyet('male')}
        >
          <Text style={[
            styles.genderButtonText, 
            cinsiyet === 'male' && styles.genderButtonTextActive
          ]}>Erkek</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.genderButton, 
            cinsiyet === 'female' && styles.genderButtonActive
          ]}
          onPress={() => setCinsiyet('female')}
        >
          <Text style={[
            styles.genderButtonText, 
            cinsiyet === 'female' && styles.genderButtonTextActive
          ]}>Kadın</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.calculateButton} 
        onPress={handleCalculate}
      >
        <Text style={styles.calculateButtonText}>Hesapla</Text>
      </TouchableOpacity>

      {sonuc !== '' && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{sonuc}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#f0f4f7'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333'
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333'
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12
  },
  genderButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#ccc'
  },
  genderButtonActive: {
    backgroundColor: '#rgb(194,185,125)'
  },
  genderButtonText: {
    fontSize: 16,
    color: '#fff'
  },
  genderButtonTextActive: {
    fontWeight: 'bold'
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  resultText: {
    fontSize: 16,
    color: '#333'
  }
});
