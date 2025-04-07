import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerContentComponentProps,
} from '@react-navigation/drawer';
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import { useRouter } from 'expo-router';

// Ekranlar
import DietitianPanel from '../screen/ DietitianPanel';
import AboutScreen from '../screen/AboutScreen';
import CalculationsScreen from '../screen/CalculationsScreen';
import FAQScreen from '../screen/FAQScreen';
import BMHCalculation from '../screen/BMHCalculation';
import ChaengeCalculations from '../screen/ChangeCalculations';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps): JSX.Element {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Çıkış Yap',
      'Çıkış yapmak istediğinizden emin misiniz?',
      [
        { text: 'Hayır', style: 'cancel' },
        {
          text: 'Evet',
          onPress: () => {
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer}>
        <Image
          source={require('../../assets/images/profil.jpg')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>Dyt. Ebrar Merve Gündüz</Text>
      </View>
      <DrawerItemList {...props} />
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Entypo name="log-out" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Çıkış Yap</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator(): JSX.Element {
  return (
    <Drawer.Navigator
      initialRouteName="Profil"
      drawerContent={(props: DrawerContentComponentProps) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: 'rgb(194,185,125)' },
        headerTintColor: '#FFF',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Profil" component={DietitianPanel} />
      <Drawer.Screen name="Hakkında" component={AboutScreen} />
      <Drawer.Screen name="Hesaplamalar" component={CalculationsScreen} />
      <Drawer.Screen name="Danışanlarım" component={FAQScreen} />
      <Drawer.Screen
        name="BMHHesaplama"
        component={BMHCalculation}
        options={{
          drawerLabel: () => null,
          title: '',
          drawerIcon: () => null,
          drawerItemStyle: { height: 0 },
        }}
      />
      <Drawer.Screen
        name="DegisimHesaplama"
        component={ChaengeCalculations}
        options={{
          drawerLabel: () => null,
          title: '',
          drawerIcon: () => null,
          drawerItemStyle: { height: 0 },
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgb(194,185,125)',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
