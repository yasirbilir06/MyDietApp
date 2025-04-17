import React, { useState } from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';

import WHOForm from '../components/childBMH/WHOForm';
import SchofieldForm from '../components/childBMH/SchofieldForm';
import InfantNutritionForm from '../components/childBMH/InfantNutritionForm';
import PreschoolForm from '../components/childBMH/PreschoolNutritionForm';


const ChildBMHCalculation = () => {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'who', title: ' WHO' },
    { key: 'schofield', title: 'Schofield' },
    { key: 'infant', title: ' 0–1 Yaş' },
    { key: 'preschool', title:'1-10 Yaş'},
  ]);

  const renderScene = SceneMap({
    who: WHOForm,
    schofield: SchofieldForm,
    infant: InfantNutritionForm,
    preschool: PreschoolForm, 
  });

 

  const renderCustomTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#FF4500' }}
      style={{ backgroundColor: '#6A0DAD' }}
      renderLabel={({ route, focused }) => (
        <Text style={{
          color: focused ? '#FF4500' : '#777',
          fontSize: 15,
          fontWeight: focused ? 'bold' : 'normal',
        }}>
          {route.title}
        </Text>
      )}
    />
  );

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.sectionHeaderWrapper}>
        
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={renderCustomTabBar}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionHeaderWrapper: {
    paddingVertical: 10,
    backgroundColor: '#6A0DAD',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#6A0DAD',
  },
  sectionHeaderText: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#000',
  },
});

export default ChildBMHCalculation;
