import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, Image } from 'react-native';

import ProgressView from '../components/ProgressView.js';
import RewardView from '../components/RewardView.js';
import { Ionicons, MaterialIcons } from '@expo/vector-icons'; // Import the icons
import { FontAwesome5 } from '@expo/vector-icons';
import QRView from '../components/QRView.js';


const Tab = createBottomTabNavigator();

const DetailScreenView = ({ route }) => {
    const { card } = route.params;
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let icon;

                    if (route.name === 'Progress') {
                        icon = focused ? (
                            <FontAwesome5 name="calendar-check" size={size} color={color} />
                        ) : (
                            <FontAwesome5 name="calendar-check" size={size} color={color} />
                        );
                    } 
                    if (route.name === 'QR Code') {
                        icon = focused ? (
                            <Ionicons name="qr-code-outline" size={size} color={color} />
                        ) : (
                            <Ionicons name="qr-code-outline" size={size} color={color} />
                        );
                    } 
                    
                    else if (route.name === 'Rewards') {
                        icon = focused ? (
                            <MaterialIcons name="card-giftcard" size={size} color={color} />
                        ) : (
                            <MaterialIcons name="card-giftcard" size={size} color={color} />
                        );
                    }

                    return icon;
                },
                tabBarActiveTintColor: 'blue',
                tabBarInactiveTintColor: 'gray',
                tabBarStyle: { display: 'flex' }, // Removed unnecessary array
                headerShown: false,
            })}
        >
            <Tab.Screen name="Progress">
                {() => <ProgressView card={card} />}
            </Tab.Screen>
            <Tab.Screen name="Rewards">
                {() => <RewardView card={card} />}
            </Tab.Screen>
            <Tab.Screen name="QR Code">
                {() => <QRView card={card} />}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

const styles = {
    tabContainer: {
        flex: 1,
        backgroundColor: 'white',
        
    },
    heading: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
};

export default DetailScreenView;
