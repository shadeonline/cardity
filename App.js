import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreenView from './screens/HomeScreenView.js';
import DetailScreenView from './screens/DetailScreenView.js';
import LoginScreenView from './screens/LoginScreenView.js';
import RegisterScreenView from './screens/RegisterScreenView.js';
import PlansScreenView from './screens/PlansScreenView.js';
import ScannerScreenView from './screens/ScannerScreenView.js';
import AdminScreenView from './screens/AdminScreenView.js';
import CreatePlanScreenView from './screens/CreatePlanScreenView.js';
import EditPlanScreenView from './screens/EditPlanScreenView.js'


const Stack = createStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={LoginScreenView} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreenView} />
        <Stack.Screen name="Loyalty Cards">
          {(props) => (
            <HomeScreenView />
          )}
        </Stack.Screen>
        <Stack.Screen name="Details" component={DetailScreenView} />
        <Stack.Screen name="Plans" component={PlansScreenView} />
        <Stack.Screen name="Scanner" component={ScannerScreenView} />
        <Stack.Screen name="Admin" component={AdminScreenView} />
        <Stack.Screen name="Create Plan" component={CreatePlanScreenView} />
        <Stack.Screen name="Edit Plan" component={EditPlanScreenView} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = {
};
