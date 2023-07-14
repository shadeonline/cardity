import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Cell, Section, TableView, Separator } from 'react-native-tableview-simple';

import Card from './components/Card.js';
import HomeScreen from './components/HomeScreen.js';
import DetailScreen from './components/DetailScreen.js';

const Stack = createStackNavigator();

export default function App() {
  const [cards, setCards] = useState([
    {
      "name": "The Ice Cream Shop",
      "cardId": "1111111",
      "imgUri": require("./assets/icecreamRestaurant.jpeg"),
      "progress": 6
    },
    {
      "name": "Ichiban Ramen",
      "cardId": "2222222",
      "imgUri": require("./assets/japaneseRestaurant.jpeg"),
      "progress": 1
    },
    {
      "name": "Cafe La France",
      "cardId": "3333333",
      "imgUri": require("./assets/franceRestaurant.jpeg"),
      "progress": 1
    },
  ]);

  const updateCardProgress = (cardId, newProgress) => {
    setCards(prevCards => {
      return prevCards.map(card => {
        if (card.cardId === cardId) {
          return { ...card, progress: newProgress };
        }
        return card;
      });
    });
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loyalty Cards">
          {(props) => (
            <HomeScreen {...props} cards={cards}/>
          )}
        </Stack.Screen>
        <Stack.Screen name="Details" component={DetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
};
