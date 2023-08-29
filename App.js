import React, { useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreenView from './screens/HomeScreenView.js';
import DetailScreenView from './screens/DetailScreenView.js';
import LoginScreenView from './screens/LoginScreenView.js';
import RegisterScreenView from './screens/RegisterScreenView.js';
import PlansScreenView from './screens/PlansScreenView.js';
import ScannerScreenView from './screens/ScannerScreenView.js';

const Stack = createStackNavigator();

export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreenView} options={{headerShown:false}}/>
        <Stack.Screen name="Register" component={RegisterScreenView}/>
        <Stack.Screen name="Loyalty Cards">
          {(props) => (
            <HomeScreenView/>
          )}
        </Stack.Screen>
        <Stack.Screen name="Details" component={DetailScreenView} />
        <Stack.Screen name="Plans" component={PlansScreenView} />
        <Stack.Screen name="Scanner" component={ScannerScreenView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
};
