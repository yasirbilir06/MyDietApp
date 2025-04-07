// SplashScreen.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const SplashScreen = () => {
  // Logonun Y ekseninde hareket etmesi için başlangıç değeri (300 birim aşağıdan)
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // 2 saniyelik animasyon: translateY değeri 300'den 0'a geliyor
    Animated.timing(translateY, {
      toValue: 0,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/logo.png')}
        style={[styles.logo, { transform: [{ translateY }] }]}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(194,185,125)', // Arka plan pink
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 500,        // Logonun genişliği
    height: 500,       // Logonun yüksekliği
    borderRadius: 100, // Logonun daire şeklinde görünmesi için
  },
});

export default SplashScreen;
