import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Linking } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage, firestore, auth } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function Results() {
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // ✅ Uygulama açıldığında Firestore'dan PDF'yi çek
  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          console.log("❌ Kullanıcı oturumu yok.");
          return;
        }

        const pdfRef = doc(firestore, 'pdfs', userId);
        const snapshot = await getDoc(pdfRef);

        if (snapshot.exists()) {
          const data = snapshot.data();
          console.log("📥 Firestore'dan çekilen PDF:", data);
          setPdfName(data.name);
          setPdfUrl(data.url);
        } else {
          console.log("⚠️ Firestore'da bu kullanıcıya ait PDF bulunamadı.");
        }
      } catch (error) {
        console.error("🔥 Firestore'dan veri çekme hatası:", error);
      }
    };

    fetchPDF();
  }, []);

  const handleSelectPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        console.log('❌ Kullanıcı dosya seçimini iptal etti.');
        return;
      }

      const file = result.assets[0];
      setPdfName(file.name);
      console.log('📄 Seçilen dosya:', file);

      const response = await fetch(file.uri);
      const blob = await response.blob();

      const storageRef = ref(storage, `pdfs/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(storageRef);
      setPdfUrl(downloadUrl);
      console.log("✅ Firebase Storage'a yüklendi:", downloadUrl);

      // ✅ Firestore'a kaydet
      const userId = auth.currentUser?.uid;
      if (userId) {
        const pdfRef = doc(firestore, 'pdfs', userId);
        await setDoc(pdfRef, {
          name: file.name,
          url: downloadUrl,
          uploadedAt: new Date(),
        });
        console.log("📌 Firestore'a PDF kaydedildi.");
      } else {
        console.log("❌ Kullanıcı oturumu yok, Firestore'a yazılamadı.");
      }

      Alert.alert('Başarılı', 'PDF dosyası yüklendi ve kaydedildi!');
    } catch (error) {
      console.error('🚨 PDF yükleme hatası:', error);
      Alert.alert('Hata', `PDF yüklenirken bir sorun oluştu.\n${(error as Error).message}`);
    }
  };

  const handleOpenPDF = () => {
    if (pdfUrl) {
      Linking.openURL(pdfUrl);
    } else {
      Alert.alert('Uyarı', 'Henüz bir PDF yüklenmedi.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Değerlerim</Text>
      <Text style={styles.infoText}>
        Kan değerlerinizi PDF formatında yükleyebilirsiniz. Bu dosya diyetisyen tarafından görüntülenebilir.
      </Text>

      <TouchableOpacity style={styles.uploadButton} onPress={handleSelectPDF}>
        <Text style={styles.uploadButtonText}>PDF Yükle</Text>
      </TouchableOpacity>

      {pdfName && (
        <View style={styles.pdfInfoContainer}>
          <Text style={styles.pdfInfoTitle}>Seçilen PDF:</Text>
          <Text style={styles.pdfFileName}>{pdfName}</Text>

          <TouchableOpacity style={styles.openButton} onPress={handleOpenPDF}>
            <Text style={styles.openButtonText}>PDF'yi Aç</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8', padding: 16 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  uploadButton: {
    backgroundColor: '#C2B97D',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  pdfInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  pdfInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  pdfFileName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  openButton: {
    backgroundColor: 'rgb(194,185,125)',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  openButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
