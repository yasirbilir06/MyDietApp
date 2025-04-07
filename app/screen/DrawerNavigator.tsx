import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AboutScreen from '../screen/AboutScreen';
import CalculationsScreen from '../screen/CalculationsScreen';
import FAQScreen from '../screen/FAQScreen';
import DietitianPanel from './ DietitianPanel';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Profil"
      screenOptions={{
        // 📌 Header arka plan rengini değiştir
        headerStyle: { backgroundColor: '#FFC0CB' },
        // 📌 Header yazı rengi
        headerTintColor: '#FFF',
        // 📌 Başlık yazısı stili
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Drawer.Screen name="Profil" component={DietitianPanel}/>
      <Drawer.Screen name="Hakkımda" component={AboutScreen} />
      <Drawer.Screen name="Hesaplamalar" component={CalculationsScreen} />
      <Drawer.Screen name="Sıkça Sorulan Sorular" component={FAQScreen} />
      
    </Drawer.Navigator>
  );
}
