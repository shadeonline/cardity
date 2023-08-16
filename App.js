import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreenView from './screens/HomeScreenView.js';
import DetailScreenView from './screens/DetailScreenView.js';
import LoginScreenView from './screens/LoginScreenView.js';
import RegisterScreenView from './screens/RegisterScreenView.js';
import PlansScreenView from './screens/PlansScreenView.js';


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
        <Stack.Screen name="Login" component={LoginScreenView} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreenView}/>
        <Stack.Screen name="Loyalty Cards">
          {(props) => (
            <HomeScreenView {...props} cards={cards} />
          )}
        </Stack.Screen>
        <Stack.Screen name="Details" component={DetailScreenView} />
        <Stack.Screen name="Plans" component={PlansScreenView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
};
