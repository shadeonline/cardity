import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';

import Card from './components/Card.js';
import HomeScreen from './components/HomeScreen.js';

const Stack = createStackNavigator();



const DetailScreen = ({ route }) => {
  const { card } = route.params;
  return (
    <ScrollView>
      <Card
        name={card.name}
        cardNum={card.cardNum}
        imgUri={card.imgUri}
        card={card}
      />
    </ScrollView>
  );
};


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loyalty Cards" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
};
